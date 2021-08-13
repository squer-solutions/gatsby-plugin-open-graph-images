const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const http = require("http");
const { join, dirname } = require("path");
const { config } = require("./config");

exports.generateOgImages = async (imageGenerationJobs) => {
  const { puppeteerLaunchOptions } = config.getConfig();
  const servingUrl = await getServingUrl();
  const browser = await puppeteer.launch(puppeteerLaunchOptions);
  const page = await browser.newPage();

  for (const imageGenerationJob of imageGenerationJobs) {
    const { componentPath, imgPath, size } = imageGenerationJob;
    const componentUrl = `${servingUrl}/${componentPath}`;

    await page.setViewport(size);
    await page.goto(componentUrl, { waitUntil: "networkidle2" });

    ensureThatImageDirExists(imgPath);
    await page.screenshot({ path: imgPath, clip: { x: 0, y: 0, ...size } });
    // fs.unlinkSync(join("public", componentPath, "index.html"));

    const printPath = `${imgPath.replace("public", "")} ${size.width}x${size.height}`;
    console.log(`🖼  created Image: ${printPath}`);
  }

  await browser.close();
};

const getServingUrl = async () => {
  const app = express();
  app.use(express.static("public"));
  const server = http.createServer(app);
  await server.listen(0);
  return `http://0.0.0.0:${server.address().port}/`;
};

const ensureThatImageDirExists = (path) => {
  const targetDir = dirname(path);

  try {
    fs.statSync(targetDir);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  }
};
