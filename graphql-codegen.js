const basePath = process.env.INIT_CWD || "";

module.exports = {
  overwrite: true,
  silent: false,
  schema: "http://localhost:8000/___graphql",
  documents: [`${basePath}/src/**/*.{ts,tsx}`, `${basePath}/gatsby-node.ts`],
  generates: {
    [`${basePath}/__generated__/gatsby.types.ts`]: {
      plugins: ["typescript", "typescript-operations"],
      config: {
        onlyOperationTypes: true,
        preResolveTypes: true,
        immutableTypes: true,
        flattenGeneratedTypes: true,
        namingConvention: { enumValues: "keep" },
        enumsAsTypes: true,
      },
      hooks: { afterOneFileWrite: ["prettier --write"] },
    },
  },
};
