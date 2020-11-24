/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

exports.onCreateWebpackConfig = ({ loaders, actions }) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert|geom|comp|vs|fs|gs|vsh|fsh|gsh|vshader|fshader|gshader)$/,
          use: [loaders.raw(), "glslify-loader"],
        },
        {
          test: /\.gl(tf|b)$/,
          use: loaders.url(),
        },
      ],
      unknownContextCritical: false,
    },
  });
};

// exports.onCreatePage = async ({ page, actions }) => {
//   const { createPage } = actions;
//   // Only update the `/app` page.
//   if (page.path.match(/^\//)) {
//     // page.matchPath is a special key that's used for matching pages
//     // with corresponding routes only on the client.
//     page.matchPath = "/*";
//     // Update the page.
//     createPage(page);
//   }
// };
