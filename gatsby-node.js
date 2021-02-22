const { generateOgImages } = require("./src/generator");
const { config } = require("./src/config");
const { imageGenerationJobCache } = require("./src/cache");

exports.onPreInit = async (pluginConfig) => {
  config.init(pluginConfig);
};

exports.onPreBootstrap = async ({ cache }) => {
  await imageGenerationJobCache.init(cache);
};

exports.onCreatePage = async ({ page, cache }) => {
  const { componentGenerationDir } = config.getConfig()
  if (page.path.startsWith(`/${componentGenerationDir}/`)) {
    await imageGenerationJobCache.add(cache, page.context.ogImage["__ogImageGenerationContext"]);
  }
};

exports.onPostBuild = async ({ cache }) => {
  const jobDefinitions = await imageGenerationJobCache.getAll(cache);
  await generateOgImages(jobDefinitions);
};
