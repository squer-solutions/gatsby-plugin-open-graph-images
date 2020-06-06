const path = require("path");
const { createOpenGraphImage } = require("../index");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // create Open Graph Images during pages
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
          ogImage: {
            component: path.resolve(`src/pages/_artist-og-image.template.js`),
          },
        },
      });
    });
  });

  // manually create a Open Graph Image
  createOpenGraphImage(createPage, {
    path: "/og-image/index.png",
    component: path.resolve(`src/pages/_index-og-image.template.js`),
    size: {
      width: 400,
      height: 50,
    },
    context: {
      description: "lorem ipsum",
    },
  });
};
