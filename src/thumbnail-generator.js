const { config } = require("./plugin-config");
const puppeteer = require("puppeteer");
const express = require("express");
const http = require("http");
const fs = require("fs");
const path = require("path");

exports.generateThumbnailImages = async (thumbnailGenerationJobs) => {
  ensureThatThumbnailDirExists();

  const servingUrl = await getServingUrl();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const thumbnailGenerationJob of thumbnailGenerationJobs) {
    const { id, componentPath } = thumbnailGenerationJob;
    const { defaultImageFormat, targetDirectory, defaultWidth, defaultHeight } = config.getConfig();

    const width = thumbnailGenerationJob.width || defaultWidth;
    const height = thumbnailGenerationJob.height || defaultHeight;
    const format = thumbnailGenerationJob.format || defaultImageFormat;

    const thumbnailImagePath = path.join("public", targetDirectory, `${id}.${format}`);
    const componentUrl = `${servingUrl}/${componentPath}`;

    await page.goto(componentUrl);
    await page.screenshot({ path: thumbnailImagePath, width, height });

    console.log(`🖼 created Thumbnail: ${thumbnailImagePath}`);
  }

  await browser.close();
};

const getServingUrl = async () => {
  const { NETLIFY: isNetlify, URL: netlifyUrl } = process.env;

  const getUrlFromFreshExpressInstance = async () => {
    const app = express();
    app.use(express.static("public"));
    const server = http.createServer(app);
    await server.listen(0);
    return `http://0.0.0.0:${server.address().port}/`;
  };

  return isNetlify ? netlifyUrl : await getUrlFromFreshExpressInstance();
};

const ensureThatThumbnailDirExists = () => {
  const targetDir = config.getConfig().targetDirectory;
  const thumbnailImagePath = path.join("public", targetDir);

  try {
    fs.statSync(thumbnailImagePath);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(thumbnailImagePath);
    }
  }
};
