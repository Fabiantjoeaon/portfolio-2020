const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = {
  siteMetadata: {
    title: `Fabian Tjoe-A-On`,
    description: `Creative developer from Rotterdam.`,
    author: `@fabiantjoeaon`,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-netlify",
      options: {
        headers: {}, // option to add more headers. `Link` headers are transformed by the below criteria
        allPageHeaders: [], // option to add headers for all pages. `Link` headers are transformed by the below criteria
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true, // boolean to turn off automatic creation of redirect rules for client only paths
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",
        injectHTML: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-8PCZLMMWYZ"],
        pluginConfig: {
          // Puts tracking script in the head instead of the body
          head: true,
          // Avoids sending pageview hits from custom paths
          exclude: [],
        },
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-videos`,
            options: {
              height: "auto",
              preload: "auto",
              muted: true,
              autoplay: true,
              playsinline: true,
              controls: true,
              loop: true,
              pipelines: [
                {
                  name: "vp9",
                  transcode: chain =>
                    chain
                      .videoCodec("libvpx-vp9")
                      .noAudio()
                      .outputOptions(["-crf 20", "-b:v 0"]),
                  maxHeight: 480,
                  maxWidth: 900,
                  fileExtension: "webm",
                },
                {
                  name: "h264",
                  transcode: chain =>
                    chain
                      .videoCodec("libx264")
                      .noAudio()
                      .addOption("-profile:v", "main")
                      .addOption("-pix_fmt", "yuv420p")
                      .outputOptions(["-movflags faststart"]),
                  maxHeight: 1080,
                  maxWidth: 1894,
                  fileExtension: "mp4",
                },
              ],
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 890,
            },
          },
        ],
      },
    },

    // {
    //   resolve: `gatsby-plugin-create-client-paths`,
    //   options: { prefixes: [`/*`] },
    // },
    // {
    //   resolve: "gatsby-plugin-layout",
    //   options: {
    //     component: require("./src/layouts/index.js"),
    //   },
    // },
    "gatsby-plugin-layout",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-styled-components`,

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
