const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });

  const has = (sel) => page.evaluate((s) => !!document.querySelector(s), sel);
  console.log("loader html present immediately:", await has('div.fixed.z-\\[100\\]'));
  console.log("session keys right after goto:", JSON.stringify(await page.evaluate(() => Object.keys(sessionStorage))));

  for (const t of [200, 600, 1200, 2000, 2600, 3200]) {
    await new Promise((r) => setTimeout(r, t === 200 ? 200 : 0));
    const loader = await has('div.fixed.z-\\[100\\]');
    const keys = await page.evaluate(() => Object.keys(sessionStorage));
    console.log(`t~${t}ms loader=${loader} keys=${JSON.stringify(keys)}`);
    await new Promise((r) => setTimeout(r, 400));
  }

  await browser.close();
})();
