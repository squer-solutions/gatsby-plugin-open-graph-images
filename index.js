const { join } = require("path");
const { config } = require("./src/config");

exports.createOpenGraphImage = (createPage, options) => {
  if (!config.isValid()) return;

  const { defaultSize, componentGenerationDir, domain } = config.getConfig();
  const { path, component, context } = options;

  const size = { ...defaultSize, ...(options.size || {}) };
  const componentPath = join(componentGenerationDir, encodeURIComponent(path.split("/").join("")));
  const imgPath = join("public", path);
  const webImgPath = join(domain, path);

  const thumbnailMetaData = { path: webImgPath, size };
  const thumbnailGenerationJob = { componentPath, imgPath, size };

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
