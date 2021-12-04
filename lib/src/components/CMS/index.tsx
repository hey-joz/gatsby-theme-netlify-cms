import type { InitOptions } from "@hey_joz/gatsby-source-netlify-cms";
import type NetlifyIdentityWidget from "netlify-identity-widget";
import React, { FC, Fragment, memo, ReactNode, useEffect } from "react";

const slice = (
  // eslint-disable-next-line no-unused-vars
  imports: any[],
  // eslint-disable-next-line no-unused-vars
  lengths: number[]
): any[][] => {
  const _imports = [...imports];
  return lengths.map((length) => {
    return _imports.splice(0, length);
  });
};

export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};

export type CmsQueryVariables = Exact<{ [key: string]: never }>;

export type CmsQuery = {
  readonly __typename?: "Query";
  readonly sitePlugin?:
    | {
        readonly __typename?: "SitePlugin";
        readonly pluginOptions?: any | null | undefined;
      }
    | null
    | undefined;
};

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    netlifyIdentity: typeof NetlifyIdentityWidget;
  }
}

export type PreviewTemplatePromises = Record<string, Promise<unknown>>;
export type WidgetPromises = Record<string, Promise<unknown>>;
export type EditorComponentPromises = Record<string, Promise<unknown>>;

type Props = {
  children: ReactNode;
  previewTemplatePromises?: PreviewTemplatePromises;
  widgetPromises?: WidgetPromises;
  editorComponentPromises?: EditorComponentPromises;
  initOptions: InitOptions;
};

const CMS: FC<Props> = ({
  children,
  previewTemplatePromises,
  widgetPromises,
  editorComponentPromises,
  initOptions,
}) => {
  useEffect(() => {
    const promises: [
      Promise<typeof import("netlify-cms-app")>,
      Promise<typeof import("netlify-identity-widget")>,
      Promise<typeof import("../../cms/components/Path")>,
      Promise<typeof import("../../cms/components/Uuid")>,
      ...Promise<unknown>[]
    ] = [
      import("netlify-cms-app"),
      import("netlify-identity-widget"),
      import("../../cms/components/Path"),
      import("../../cms/components/Uuid"),
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

    if (editorComponentPromises) {
      Object.keys(editorComponentPromises).forEach((widget) => {
        promises.push(editorComponentPromises[widget]);
      });
    }

    Promise.all(promises).then(
      ([CMS, netlifyIdentityWidget, Path, Uuid, ...otherImports]) => {
        const [previewImports, widgetImports, editorComponentsImports] = slice(
          otherImports,
          [
            previewTemplatePromises
              ? Object.keys(previewTemplatePromises).length
              : 0,
            widgetPromises ? Object.keys(widgetPromises).length : 0,
            editorComponentPromises
              ? Object.keys(editorComponentPromises).length
              : 0,
          ]
        );

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
              previewImports[index].default
            );
          });
        }

        if (widgetPromises) {
          Object.keys(widgetPromises).forEach((widget, index) => {
            CMS.default.registerWidget(
              widget,
              // TODO: fix this type
              widgetImports[index].default
            );
          });
        }

        if (editorComponentPromises) {
          Object.keys(editorComponentPromises).forEach((_, index) => {
            CMS.default.registerEditorComponent(
              editorComponentsImports[index].default
            );
          });
        }

        CMS.default.init(initOptions);

        netlifyIdentityWidget.init();
      }
    );
  }, []);

  return <Fragment>{children}</Fragment>;
};

export default memo(CMS);
