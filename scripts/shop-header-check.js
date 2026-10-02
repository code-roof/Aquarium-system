const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUT = "C:\\Users\\ASUSTU~1\\AppData\\Local\\Temp\\opencode";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.setViewport({ width: 1440, height: 900 });

  for (const [path, name] of [["/shop", "shop-clean"], ["/shop?category=tanks", "shop-tanks-clean"]]) {
    await page.goto("http://localhost:3000" + path, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 1200));

    const info = await page.evaluate(() => {
      const sec = document.querySelector("main section, section.bg-navy-950");
      const svgs = [...sec.querySelectorAll("svg")].map((s) => (s.getAttribute("viewBox") || "").slice(0, 20));
      const next = sec.nextElementSibling;
      return {
        headerBottom: Math.round(sec.getBoundingClientRect().bottom + window.scrollY),
        headerHeight: sec.offsetHeight,
        headerSVGs: svgs,
        nextTop: Math.round(next.getBoundingClientRect().top + window.scrollY),
        gap: Math.round(next.getBoundingClientRect().top + window.scrollY - (sec.getBoundingClientRect().bottom + window.scrollY)),
        nextClasses: next.className.slice(0, 60),
      };
    });
    console.log(path, JSON.stringify(info, null, 1));
    await page.screenshot({ path: `${OUT}\\${name}.png` });
  }

  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
})();
