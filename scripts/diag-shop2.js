const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3500));

  // Walk from deepest elements upward: find the SMALLEST element that is wider than 390
  // and whose parent is NOT wider (i.e. the actual origin of the extra width).
  const res = await page.evaluate(() => {
    const docW = 390;
    const all = [...document.querySelectorAll("*")];
    const wide = all.filter((el) => {
      const r = el.getBoundingClientRect();
      return r.width > docW + 1;
    });

    // For each wide element, check children widths to find leaf-most cause
    const report = wide.slice(0, 40).map((el) => {
      const r = el.getBoundingClientRect();
      const kids = [...el.children].map((c) => {
        const kr = c.getBoundingClientRect();
        return {
          tag: c.tagName.toLowerCase(),
          cls: String(c.className || "").slice(0, 55),
          w: Math.round(kr.width),
          right: Math.round(kr.right),
        };
      });
      return {
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 60),
        w: Math.round(r.width),
        pos: getComputedStyle(el).position,
        kids: kids.slice(0, 6),
      };
    });
    return report;
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
