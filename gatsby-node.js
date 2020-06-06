const { join } = require("path");
const { createOpenGraphImage } = require("./index");
const { generateThumbnailImages } = require("./src/generator");
const { config } = require("./src/config");
const { thumbnailGenerationJobCache } = require("./src/cache");

exports.onPreInit = async ({ cache }, pluginConfig) => {
  config.init(pluginConfig);
  await thumbnailGenerationJobCache.init(cache);
};

exports.onCreatePage = async ({ page, actions, cache }) => {
  if (!config.isValid()) return;

  // check if page is thumbnailPage, in this situation just add metadata to cache
  // this happens when a thumbnail is directly create via `createThumbnail()`
  if (!!page.context["__thumbnailGenerationContext"]) {
    await thumbnailGenerationJobCache.add(cache, page.context["__thumbnailGenerationContext"]);
    return;
  }

  // if page has no thumbnail information given in the context, than we don't need to process it
  if (!page.context.thumbnail) {
    return;
  }

  const { createPage, deletePage } = actions;

  // create new thumbnail page & and add metadata to cache
  const thumbnailId = encodeURIComponent(page.path.split("/").join(""));
  const implicitModeOptions = config.getConfig().implicitModeOptions;
  const format = page.context.thumbnail.format || implicitModeOptions.format;
  const path = join(implicitModeOptions.targetDir, `${thumbnailId}.${format}`);

  const { thumbnailGenerationJob, thumbnailMetaData } = createOpenGraphImage(createPage, {
    path: path,
    component: page.context.thumbnail.component,
    size: page.context.thumbnail.size,
    context: page.context,
  });
  await thumbnailGenerationJobCache.add(cache, thumbnailGenerationJob);

  // update existing page with thumbnail
  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      thumbnail: thumbnailMetaData,
    },
  });
};

exports.onPostBuild = async ({ cache }) => {
  if (!config.isValid()) return;

  const jobDefinitions = await thumbnailGenerationJobCache.getAll(cache);
  await generateThumbnailImages(jobDefinitions);
};
