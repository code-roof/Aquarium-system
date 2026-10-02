const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=390,844"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(() => !document.querySelector('div.fixed.z-\\[100\\]'), { timeout: 15000, polling: 50 }).catch(() => {});
  await new Promise((r) => setTimeout(r, 600));

  const out = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0) return;
      if (r.right > vw + 1 || r.left < -1) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString(),
          text: (el.textContent || "").trim().slice(0, 60),
          parent: el.parentElement ? el.parentElement.tagName.toLowerCase() + "." + (el.parentElement.className || "").toString().slice(0, 50) : "",
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
        });
      }
    });
    return { vw, scrollW: document.documentElement.scrollWidth, offenders: bad.slice(0, 14) };
  });

  console.log("viewport:", out.vw, "scrollWidth:", out.scrollW);
  out.offenders.forEach((o) => {
    console.log(`  ${o.tag} L${o.left} R${o.right} W${o.w}`);
    console.log(`    cls:   ${o.cls}`);
    console.log(`    text:  "${o.text}"`);
    console.log(`    under: ${o.parent}`);
  });

  await browser.close();
})();
