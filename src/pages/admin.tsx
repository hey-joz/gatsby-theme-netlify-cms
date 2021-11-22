import { graphql, useStaticQuery } from "gatsby";
import type NetlifyIdentityWidget from "netlify-identity-widget";
import React, { FC, Fragment, memo, ReactNode, useEffect } from "react";

import { CmsQuery } from "../../__generated__/gatsby.types";

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    netlifyIdentity: typeof NetlifyIdentityWidget;
  }
}

export type PreviewTemplatePromises = Record<string, Promise<unknown>>;
export type WidgetPromises = Record<string, Promise<unknown>>;

type Props = {
  children: ReactNode;
  previewTemplatePromises?: PreviewTemplatePromises;
  widgetPromises?: WidgetPromises;
};

const CMS: FC<Props> = ({
  children,
  previewTemplatePromises,
  widgetPromises,
}) => {
  const data = useStaticQuery<CmsQuery>(graphql`
    query CMS {
      sitePlugin(name: { eq: "@hey_joz/gatsby-theme-netlify-cms" }) {
        pluginOptions
      }
    }
  `);

  useEffect(() => {
    const promises: [
      Promise<typeof import("netlify-cms-app")>,
      Promise<typeof import("netlify-identity-widget")>,
      ...Promise<unknown>[]
    ] = [
      import("netlify-cms-app"),
      import("netlify-identity-widget"),
      import("../cms/components/Path"),
      import("../cms/components/Uuid"),
    ];

    if (previewTemplatePromises) {
      Object.keys(previewTemplatePromises).forEach((collection) => {
        promises.push(previewTemplatePromises[collection]);
      });
    }

    if (widgetPromises) {
      Object.keys(widgetPromises).forEach((widget) => {
        promises.push(widgetPromises[widget]);
      });
    }

    Promise.all<
      typeof import("netlify-cms-app"),
      typeof import("netlify-identity-widget"),
      typeof import("../cms/components/Path"),
      typeof import("../cms/components/Uuid")
      // TODO: fix this type
      // @ts-expect-error this array is not compatible with the forced types
    >(promises).then(
      ([CMS, netlifyIdentityWidget, Path, Uuid, ...otherImports]) => {
        // Isolate preview imports
        const previewImports = previewTemplatePromises
          ? otherImports.slice(0, Object.keys(previewTemplatePromises).length)
          : [];

        // Widgets are the remaining imports
        const widgetImports = otherImports.slice(previewImports.length);

        global.window.netlifyIdentity = netlifyIdentityWidget;

        const addLoginListener = () =>
          netlifyIdentityWidget.on("login", () => {
            document.location.reload();
          });

        netlifyIdentityWidget.on("init", (user) => {
          if (!user) {
            addLoginListener();
          } else {
            netlifyIdentityWidget.on("logout", () => {
              document.location.reload();
            });
          }
        });

        CMS.default.registerWidget("uuid", Uuid.default);
        CMS.default.registerWidget("path", Path.default);

        if (previewTemplatePromises) {
          Object.keys(previewTemplatePromises).forEach((collection, index) => {
            CMS.default.registerPreviewTemplate(
              collection,
              // TODO: fix this type
              // @ts-expect-error this is not typed
              previewImports[index].default
            );
          });
        }

        if (widgetPromises) {
          Object.keys(widgetPromises).forEach((widget, index) => {
            CMS.default.registerWidget(
              widget,
              // TODO: fix this type
              // @ts-expect-error this is not typed
              widgetImports[index].default
            );
          });
        }

        CMS.default.init(data.sitePlugin?.pluginOptions.initOptions);

        netlifyIdentityWidget.init();
      }
    );
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default memo(CMS);
