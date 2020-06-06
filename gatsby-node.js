const { join } = require("path");
const { createOpenGraphImage } = require("./index");
const { generateOgImages } = require("./src/generator");
const { config } = require("./src/config");
const { imageGenerationJobCache } = require("./src/cache");

exports.onPreInit = async ({ cache }, pluginConfig) => {
  config.init(pluginConfig);
  await imageGenerationJobCache.init(cache);
};

exports.onCreatePage = async ({ page, actions, cache }) => {
  if (!config.isValid()) return;

  // check if page is an og-image page, in this situation just add metadata to cache
  // this happens when a image is directly create via `createOpenGraphImage()`
  if (!!page.context["__ogImageGenerationContext"]) {
    await imageGenerationJobCache.add(cache, page.context["__ogImageGenerationContext"]);
    return;
  }

  // if page has no ogImage information given in the context, than we don't need to process it
  if (!page.context.ogImage) {
    return;
  }

  const { createPage, deletePage } = actions;

  // create new ogImage page & and add metadata to cache
  const ogImageId = encodeURIComponent(page.path.split("/").join(""));
  const implicitModeOptions = config.getConfig().implicitModeOptions;
  const format = page.context.ogImage.format || implicitModeOptions.format;
  const path = join(implicitModeOptions.targetDir, `${ogImageId}.${format}`);

  const { ogImageGenerationJob, ogImageMetaData } = createOpenGraphImage(createPage, {
    path: path,
    context: page.context,
    ...page.context.ogImage,
  });
  await imageGenerationJobCache.add(cache, ogImageGenerationJob);

  // update existing page with ogImage Metadata
  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      ogImage: ogImageMetaData,
    },
  });
};

exports.onPostBuild = async ({ cache }) => {
  if (!config.isValid()) return;

  const jobDefinitions = await imageGenerationJobCache.getAll(cache);
  await generateOgImages(jobDefinitions);
};
