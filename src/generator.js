const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const http = require("http");
const { join, dirname } = require("path");

exports.generateThumbnailImages = async (thumbnailGenerationJobs) => {
  const servingUrl = await getServingUrl();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const thumbnailGenerationJob of thumbnailGenerationJobs) {
    const { componentPath, imgPath, size } = thumbnailGenerationJob;
    const componentUrl = `${servingUrl}/${componentPath}`;

    await page.goto(componentUrl);
    await page.setViewport(size);

    ensureThatThumbnailDirExists(imgPath);
    await page.screenshot({ path: imgPath, clip: { x: 0, y: 0, ...size } });

    fs.unlinkSync(join("public", componentPath, "index.html"));

    console.log(`🖼 created Thumbnail: ${imgPath} ${size.width}x${size.height}`);
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

const ensureThatThumbnailDirExists = (path) => {
  const targetDir = dirname(path);

  try {
    fs.statSync(targetDir);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(targetDir);
    }
  }
};
