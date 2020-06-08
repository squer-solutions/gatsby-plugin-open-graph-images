exports.config = (() => {
  const defaultConfig = {
    defaultSize: {
      width: 1200,
      height: 630,
    },
    componentGenerationDir: "__generated",
  };

  let currentConfig = {};

  return {
    init: (config) => {
      currentConfig = {
        ...defaultConfig,
        ...config,
        defaultSize: { ...defaultConfig.defaultSize, ...(config.defaultSize || {}) },
      };
    },
    getConfig: () => {
      return currentConfig;
    },
  };
})();
