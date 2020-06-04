exports.config = (() => {
  const defaultConfig = {
    defaultWidth: 1200,
    defaultHeight: 800,
    defaultImageFormat: "png",
    temporalThumbnailComponentDirectory: `404/thumbnails`,
    targetDirectory: "thumbnails",
  };

  let currentConfig = {};

  return {
    init: (config) => {
      console.log("CONFIG: ", { config });
      currentConfig = { ...defaultConfig, ...config };
    },
    getConfig: () => {
      return currentConfig;
    },
  };
})();
