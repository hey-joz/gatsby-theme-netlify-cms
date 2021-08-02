module.exports = ({ initOptions, pageCollectionNames }) => ({
  plugins: [
    {
      resolve: "@hey_joz/gatsby-source-netlify-cms",
      options: {
        initOptions,
        pageCollectionNames,
      },
    },
  ],
});
