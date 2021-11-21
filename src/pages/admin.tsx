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

export type CollectionPreviewPromiseMap = Record<string, Promise<unknown>>;

type Props = {
  children: ReactNode;
  collectionPreviewPromises?: CollectionPreviewPromiseMap;
};

const CMS: FC<Props> = ({ children, collectionPreviewPromises }) => {
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
      import("../cms-components/Deploys"),
      import("../cms-components/Path"),
      import("../cms-components/Uuid"),
    ];

    if (collectionPreviewPromises) {
      Object.keys(collectionPreviewPromises).forEach((collection) => {
        promises.push(collectionPreviewPromises[collection]);
      });
    }

    Promise.all<
      typeof import("netlify-cms-app"),
      typeof import("netlify-identity-widget"),
      typeof import("../cms-components/Deploys"),
      typeof import("../cms-components/Path"),
      typeof import("../cms-components/Uuid")
      // TODO: fix this type
      // @ts-expect-error this array is not compatible with the forced types
    >(promises).then(
      ([CMS, netlifyIdentityWidget, Deploys, Path, Uuid, ...Previews]) => {
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
        CMS.default.registerWidget("deploys", Deploys.default);

        if (collectionPreviewPromises) {
          Object.keys(collectionPreviewPromises).forEach(
            (collection, index) => {
              CMS.default.registerPreviewTemplate(
                collection,
                // TODO: fix this type
                // @ts-expect-error this is not typed
                Previews[index].default
              );
            }
          );
        }

        CMS.default.init(data.sitePlugin?.pluginOptions.initOptions);

        netlifyIdentityWidget.init();
      }
    );
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default memo(CMS);
