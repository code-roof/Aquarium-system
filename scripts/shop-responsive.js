const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  for (const [w, h, label] of [[390, 844, "mobile"], [768, 1024, "tablet"], [1440, 900, "desktop"]]) {
    await page.setViewport({ width: w, height: h });
    await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle2", timeout: 60000 });
    // wait for the loading overlay to fully unmount before measuring
    await page
      .waitForFunction(() => !document.querySelector('div.fixed.z-\\[100\\]'), { timeout: 15000, polling: 50 })
      .catch(() => {});
    await new Promise((r) => setTimeout(r, 600));
    const r = await page.evaluate(() => {
      const sec = document.querySelector("main section");
      return {
        headerH: sec.offsetHeight,
        navLinksVisible: !!document.querySelector('nav[aria-label="Primary"] a'),
        h1: document.querySelector("h1")?.textContent,
        waveSvgs: sec.querySelectorAll('svg[viewBox^="0 0 1440"]').length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        bodyOverflow: document.body.style.overflow || "unset",
      };
    });
    console.log(label.padEnd(8), JSON.stringify(r));
  }

  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
})();
