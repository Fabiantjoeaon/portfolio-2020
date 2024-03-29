const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

const replace = require("replace-in-file");

const removeAllSideEffectsFalseFromReactSpringPackages = async () => {
  try {
    const results = await replace({
      files: "node_modules/@react-spring/*/package.json",
      from: `"sideEffects": false`,
      to: `"sideEffects": true`,
    });

    console.log(results); // uncomment to log changed files
  } catch (e) {
    console.log(
      'error while trying to remove string "sideEffects:false" from react-spring packages',
      e
    );
  }
};

removeAllSideEffectsFalseFromReactSpringPackages();
