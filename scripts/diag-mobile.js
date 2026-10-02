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
  await new Promise((r) => setTimeout(r, 1500));

  const out = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const res = [];
    // walk all elements, report those whose own box exceeds docW
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width <= docW + 2) return;
      const cs = getComputedStyle(el);
      res.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || "").slice(0, 90),
        w: Math.round(r.width),
        left: Math.round(r.left),
        pos: cs.position,
        overflowX: cs.overflowX,
        minW: cs.minWidth,
        ws: cs.whiteSpace,
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
      });
    });
    return {
      docW,
      bodyScrollW: document.body.scrollWidth,
      htmlScrollW: document.documentElement.scrollWidth,
      bodyClientW: document.body.clientWidth,
      offenders: res.slice(0, 25),
    };
  });

  console.log(JSON.stringify(out, null, 2));

  // now home hero measurement
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2500));
  const home = await page.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: Math.round(r.top), h: Math.round(r.height) };
    };
    const sections = [...document.querySelectorAll("body > * > section, main > section, section")].slice(0, 10).map((s) => {
      const r = s.getBoundingClientRect();
      return {
        cls: String(s.className || "").slice(0, 55),
        top: Math.round(r.top + window.scrollY),
        h: Math.round(r.height),
      };
    });
    return {
      viewportH: window.innerHeight,
      hero: pick("section.relative.flex"),
      docScrollH: document.documentElement.scrollHeight,
      sections,
    };
  });
  console.log(JSON.stringify(home, null, 2));

  await browser.close();
})();
