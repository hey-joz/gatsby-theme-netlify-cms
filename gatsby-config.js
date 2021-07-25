module.exports = ({ initOptions }) => ({
  plugins: [
    {
      resolve: "@hey_joz/gatsby-source-netlify-cms",
      options: {
        initOptions,
      },
    },
  ],
});
