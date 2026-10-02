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
    // Ignore position:fixed (they follow viewport). Find static/relative/absolute
    // elements wider than the doc, excluding those inside overflow-hidden ancestors.
    const docW = document.documentElement.clientWidth;
    const inClipped = (el) => {
      let p = el.parentElement;
      while (p) {
        const cs = getComputedStyle(p);
        if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.contain === "paint")
          return true;
        p = p.parentElement;
      }
      return false;
    };

    const out = [];
    document.querySelectorAll("body *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed") return;
      const r = el.getBoundingClientRect();
      if (r.width <= docW + 1) return;
      if (inClipped(el)) return;
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 70),
        w: Math.round(r.width),
        pos: cs.position,
      });
    });

    // also: which top-level sections exist and their widths
    const tops = [...document.body.children].map((el) => {
      const r = el.getBoundingClientRect();
      return {
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 50),
        w: Math.round(r.width),
        pos: getComputedStyle(el).position,
      };
    });
    return { docW, innerW: window.innerWidth, out: out.slice(0, 20), tops };
  });
  console.log(JSON.stringify(res, null, 2));
  await browser.close();
})();
