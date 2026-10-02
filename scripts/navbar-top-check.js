const puppeteer = require("puppeteer-core");

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = "C:\\Users\\ASUSTU~1\\AppData\\Local\\Temp\\opencode";

const ROUTES = [
  { path: "/shop", name: "shop" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
  { path: "/cart", name: "cart" },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: ["--window-size=1440,900"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  for (const r of ROUTES) {
    await page.goto("http://localhost:3000" + r.path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((res) => setTimeout(res, 900));

    const info = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Primary"] a');
      const cs = nav ? getComputedStyle(nav) : null;
      // sample the pixel background behind the navbar via element behind it
      const behind = document.elementFromPoint(720, 30);
      return {
        linkColor: cs ? cs.color : null,
        linkText: nav ? nav.textContent : null,
        behindClass: behind ? behind.className.toString().slice(0, 70) : null,
        headerBg: getComputedStyle(document.querySelector("header > div")).backgroundColor,
        topSectionBg: (() => {
          const s = document.querySelector("main section, main > div");
          return s ? getComputedStyle(s).backgroundColor : null;
        })(),
      };
    });
    console.log(r.path, JSON.stringify(info, null, 1));
    await page.screenshot({ path: `${OUT}\\top-${r.name}.png` });
  }

  await browser.close();
})();
