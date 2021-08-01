import type { PluginOptions as OrigPluginOptions } from "gatsby";
import { InitOptions } from "netlify-cms-core";

export type PluginOptions = OrigPluginOptions & {
  initOptions: InitOptions;
  pageCollectionNames: string[];
};

export type AllPagesQuery = {
  readonly allFile: {
    readonly nodes: ReadonlyArray<{
      readonly children: ReadonlyArray<{
        readonly __typename: string;
        readonly id: string;
        readonly path: string;
      }>;
    }>;
  };
};

export type AllPagesQueryVariables = {
  collections: ReadonlyArray<string>;
};
