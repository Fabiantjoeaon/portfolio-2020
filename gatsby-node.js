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
