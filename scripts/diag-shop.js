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

  const res = await page.evaluate(() => {
    const docW = 390;
    // find elements whose scrollWidth exceeds their clientWidth significantly,
    // and elements wider than the doc that are NOT position fixed
    const wide = [];
    document.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed") return;
      const r = el.getBoundingClientRect();
      if (r.width > docW + 1) {
        wide.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || "").slice(0, 70),
          w: Math.round(r.width),
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
          pos: cs.position,
        });
      }
    });

    // overflow-x scroll containers
    const scrollers = [];
    document.querySelectorAll("*").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.overflowX === "auto" || cs.overflowX === "scroll") {
        const r = el.getBoundingClientRect();
        scrollers.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || "").slice(0, 60),
          w: Math.round(r.width),
          scrollW: el.scrollWidth,
        });
      }
    });

    return { wide: wide.slice(0, 15), scrollers: scrollers.slice(0, 10) };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
