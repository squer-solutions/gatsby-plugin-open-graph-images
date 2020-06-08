const path = require("path");
const { createOpenGraphImage } = require("../index");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const openGraphImage = createOpenGraphImage(createPage, {
    path: "/og-image/index.png",
    component: path.resolve(`src/templates/index-og-image.js`),
    size: {
      width: 400,
      height: 50,
    },
    context: {
      id: "a image created with gatsby-plugin-open-graph-images",
    },
  });
};
