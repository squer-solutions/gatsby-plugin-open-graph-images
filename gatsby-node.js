const { thumbnailGenerationJobs } = require("./src/thumbnail-cache");
const { generateThumbnailImages } = require("./src/thumbnail-generator");
const { createThumbnail } = require("./index");

exports.onPreInit = async ({ cache }) => {
  await thumbnailGenerationJobs.initialize(cache);
};

const createThumbnailIdFromPath = (path) => {
  return encodeURIComponent(path.split("/").join(""));
};

exports.onCreatePage = async ({ page, actions, cache }) => {
  // check if page is thumbnailPage, in this situation just add metadata to cache
  // this happens when a thumbnail is directly create via `createThumbnail()`
  if (!!page.context["__thumbnailGenerationContext"]) {
    await thumbnailGenerationJobs.add(
      cache,
      page.context["__thumbnailGenerationContext"]
    );
    return;
  }

  // if page has no thumbnail information given in the context, than we don't need to process it
  if (!page.context.thumbnail) {
    return;
  }

  const { createPage, deletePage } = actions;

  // create new thumbnail page & and add metadata to cache
  const thumbnailId = createThumbnailIdFromPath(page.path);
  const { thumbnailGenerationJob, thumbnailMetadata } = createThumbnail(
    createPage,
    {
      id: thumbnailId,
      component: page.context.thumbnail.component,
      size: page.context.thumbnail.size,
      context: page.context,
      emitCreationDetails: true,
    }
  );
  await thumbnailGenerationJobs.add(cache, thumbnailGenerationJob);

  // update existing page with thumbnail
  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      thumbnail: thumbnailMetadata,
    },
  });
};

exports.onPostBuild = async ({ cache }) => {
  const jobDefinitions = await thumbnailGenerationJobs.getAll(cache);
  await generateThumbnailImages(jobDefinitions);
};
