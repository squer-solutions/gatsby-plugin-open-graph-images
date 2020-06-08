const { generateOgImages } = require("./src/generator");
const { config } = require("./src/config");
const { imageGenerationJobCache } = require("./src/cache");

exports.onPreInit = async ({ cache }, pluginConfig) => {
  config.init(pluginConfig);
  await imageGenerationJobCache.init(cache);
};

exports.onCreatePage = async ({ page, cache }) => {
  if (!!page.context.ogImage && !!page.context.ogImage["__ogImageGenerationContext"]) {
    await imageGenerationJobCache.add(cache, page.context.ogImage["__ogImageGenerationContext"]);
  }
};

exports.onPostBuild = async ({ cache }) => {
  const jobDefinitions = await imageGenerationJobCache.getAll(cache);
  await generateOgImages(jobDefinitions);
};
