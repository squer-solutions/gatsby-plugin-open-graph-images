const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const http = require("http");
const { config } = require("./config");
const { join } = require("path");

exports.generateThumbnailImages = async (thumbnailGenerationJobs) => {
  ensureThatThumbnailDirExists();

  const servingUrl = await getServingUrl();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const thumbnailGenerationJob of thumbnailGenerationJobs) {
    const { componentPath, imgPath, size } = thumbnailGenerationJob;
    const componentUrl = `${servingUrl}/${componentPath}`;

    await page.goto(componentUrl);
    await page.screenshot({ imgPath, ...size });

    console.log(`🖼 created Thumbnail: ${imgPath}`);
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
  const thumbnailImagePath = join("public", targetDir);

  try {
    fs.statSync(thumbnailImagePath);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(thumbnailImagePath);
    }
  }
};
