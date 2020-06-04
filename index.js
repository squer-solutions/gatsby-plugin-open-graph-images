const { join } = require("path");
const { config } = require("./src/config");

exports.createOpenGraphImage = (createPage, options) => {
  const { defaultWidth, defaultHeight, temporalThumbnailComponentDirectory } = config.getConfig();
  const { path, component, size, context } = options;

  const { width, height } = { width: defaultWidth, height: defaultHeight, ...(size || {}) };
  const componentPath = join(temporalThumbnailComponentDirectory, encodeURIComponent(path.split("/").join("")));
  const imgPath = join("public", path);

  const thumbnailMetaData = { imgPath, size: { width, height } };
  const thumbnailGenerationJob = { componentPath, ...thumbnailMetaData };

  createPage({
    path: componentPath,
    component: component,
    context: {
      ...context,
      thumbnail: thumbnailMetaData,
      __thumbnailGenerationContext: thumbnailGenerationJob,
    },
  });

  return { thumbnailGenerationJob, thumbnailMetaData };
};
