const path = require("path");
const { createOpenGraphImage } = require("../index");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  createOpenGraphImage(createPage, {
    path: "/og-image/index.png",
    component: path.resolve(`src/templates/index-og-image.js`),
    waitCondition: "networkidle0",
    size: {
      width: 400,
      height: 50
    },
    context: {
      description: "a image created with gatsby-plugin-open-graph-images"
    }
  });

  const result = await graphql(`
    {
      allArtistsJson {
        nodes {
          id
          name
        }
      }
    }
  `)

  result.data.allArtistsJson.nodes.forEach(({ name, id }) => {
    createPage({
      path: `artists/${id}`,
      component: path.resolve(`src/templates/artist.js`),
      context: {
        id: id,
        ogImage: createOpenGraphImage(createPage, {
          path: `og-images/artists/${id}.png`,
          component: path.resolve(`src/templates/artist-og-image.js`),
          context: { id }
        })
      }
    });
  });

};
