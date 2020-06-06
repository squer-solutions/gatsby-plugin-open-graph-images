const path = require("path");
const { createOpenGraphImage } = require("../index");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // create thumbnails during pages
  graphql(`
    {
      allArtistsJson {
        nodes {
          id
          name
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(result.errors);
    }
    result.data.allArtistsJson.nodes.forEach(({ id, name }) => {
      createPage({
        path: id,
        component: path.resolve(`src/pages/_artist.template.js`),
        context: {
          id: id,
          thumbnail: {
            component: path.resolve(`src/pages/_artist-thumbnail.template.js`),
          },
        },
      });
    });
  });

  // manually create a thumbnail
  createOpenGraphImage(createPage, {
    path: "/thumbnails/index.png",
    component: path.resolve(`src/pages/_index-thumbnail.template.js`),
    size: {
      width: 400,
      height: 50,
    },
    context: {
      description: "lorem ipsum",
    },
  });
};
