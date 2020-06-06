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

  const ogImageMetaData = { path: webImgPath, size };
  const ogImageGenerationJob = { componentPath, imgPath, size };

  createPage({
    path: componentPath,
    component: component,
    context: {
      ...context,
      ogImage: ogImageMetaData,
      __ogImageGenerationContext: ogImageGenerationJob,
    },
  });

  return { ogImageGenerationJob, ogImageMetaData };
};
