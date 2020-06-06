exports.config = (() => {
  const defaultConfig = {
    defaultSize: {
      width: 1200,
      height: 630,
    },
    implicitModeOptions: {
      format: "png",
      targetDir: "thumbnails",
    },
    componentGenerationDir: "__generated",
  };

  let currentConfig = {};

  return {
    init: (config) => {
      if (!config.domain) {
        throw (
          "Please provide a domain name under which the page is hosted.\n" +
          "OG-Images are not generated as this domain is needed, to provide a full og-image-url.\n" +
          "Provide it in your gatsby-config.js like: \n" +
          "\n" +
          "{\n" +
          "   resolve: `gatsby-plugin-open-graph-images`,\n" +
          "   options: {\n" +
          '       domain: "https://google.com",\n' +
          "   },\n" +
          "}"
        );
      }
      currentConfig = {
        ...defaultConfig,
        ...config,
        defaultSize: { ...defaultConfig.defaultSize, ...(config.defaultSize || {}) },
        implicitModeOptions: { ...defaultConfig.implicitModeOptions, ...(config.implicitModeOptions || {}) },
      };
    },
    getConfig: () => {
      return currentConfig;
    },
    isValid: () => {
      return !!currentConfig.domain;
    },
  };
})();
