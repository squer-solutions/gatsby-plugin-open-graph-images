const puppeteer = require("puppeteer");
const express = require("express");
const http = require("http");
const fs = require("fs");

exports.generateThumbnailImages = async (thumbnailGenerationJobs) => {
  ensureThatThumbnailDirExists();

  const servingUrl = await getServingUrl();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const thumbnailGenerationJob of thumbnailGenerationJobs) {
    const { id, width, height, path } = thumbnailGenerationJob;
    const url = `${servingUrl}/${path}`;

    await page.goto(url);
    const thumbnailImagePath = `public/page-thumbnails/${id}.png`;
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
  try {
    fs.statSync("./public/page-thumbnails");
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync("./public/page-thumbnails");
    }
  }
};
