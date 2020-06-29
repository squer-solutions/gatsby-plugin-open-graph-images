![gatsby-plugin-open-graph-images](./logo.png)

# Gatsby Plugin: Open Graph Images

![Publish](https://github.com/squer-solutions/gatsby-plugin-open-graph-images/workflows/Publish/badge.svg)
[![npm version](http://img.shields.io/npm/v/gatsby-plugin-open-graph-images.svg?style=flat)](https://npmjs.org/package/gatsby-plugin-open-graph-images "View this project on npm")

A [Gatsby](https://github.com/gatsbyjs/gatsby) plugin to derive and generated
Images for the [Open Graph Protocol](https://ogp.me/) directly from React Components.

## How to install

1.  `yarn add gatsby-plugin-open-graph-images` or `npm i gatsby-plugin-open-graph-images`
2.  Place the plugin in your main `gatsby-config.js`:

```js
plugins: [`gatsby-plugin-open-graph-images`];
```

## How to use

The creation of Open Graph images is done by `createOpenGraphImage()` within your `gatsby-node.js` file.

```js
exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  const openGraphImage = createOpenGraphImage(createPage, {
    path: "/og-image/index.png",
    component: path.resolve(`src/templates/index.og-image.js`),
    size: {
      width: 400,
      height: 50,
    },
    context: {
      description: "a image created with gatsby-plugin-open-graph-images",
    },
  });
};
```

You can than simply include your open-graph image within your page. For example by using [react-helmet](https://github.com/nfl/react-helmet):

```jsx
<Helmet>
  <meta property="og:image" content={domain + "/og-image/index.png"} />
  <meta property="og:image:width" content="400" />
  <meta property="og:image:width" content="50" />
</Helmet>
```

**A more advanced usage** of `createOpenGraphImage()` is described in this [dev.to article](https://dev.to/duffleit/bridging-the-gap-between-gatsby-and-open-graph-images-52gh).

## Options

| option                 | type       | description                                                                                                                          |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `defaultSize`            | _optional_ | The default size for the generated image if not explicitly specified.<br>_default:_ `{ width: 1200, height: 630}`                    |
| `componentGenerationDir` | _optional_ | The directory where the rendered gatsby components are temporarily stored, to be later saved as images<br>_default:_ `"__generated"` |

If you use plugins that iterate over your pages, like `gatsby-plugin-sitemap`, exclude the `componentGenerationDir`:

```js
{
  resolve: `gatsby-plugin-sitemap`,
  options: {
    exclude: [`/__generated/*`],
  },
},
```
