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

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const blogPostTemplate = require.resolve(
    `./src/templates/projectTemplate.js`
  );
  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }
  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: blogPostTemplate,
      context: {
        // additional data can be passed via context
        slug: node.frontmatter.slug,
      },
    });
  });
};
