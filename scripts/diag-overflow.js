const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  for (const route of ["/", "/shop"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));

    const out = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth;

      const hasClippingAncestor = (el) => {
        let p = el.parentElement;
        while (p && p !== document.body) {
          const cs = getComputedStyle(p);
          if (
            cs.overflowX !== "visible" ||
            cs.overflow !== "visible" ||
            cs.contain === "paint" ||
            cs.clipPath !== "none"
          )
            return true;
          p = p.parentElement;
        }
        return false;
      };

      const escapes = [];
      document.querySelectorAll("*").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        if (r.right <= docW + 1 && r.left >= -1) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none") return;
        if (hasClippingAncestor(el)) return;
        escapes.push({
          tag: el.tagName.toLowerCase(),
          cls: String(el.className || "").slice(0, 80),
          left: Math.round(r.left),
          right: Math.round(r.right),
          w: Math.round(r.width),
          pos: cs.position,
        });
      });

      return {
        docW,
        htmlScrollW: document.documentElement.scrollWidth,
        bodyScrollW: document.body.scrollWidth,
        layoutViewport: window.innerWidth,
        escapes: escapes.slice(0, 12),
      };
    });

    console.log("=== " + route + " ===");
    console.log(JSON.stringify(out, null, 2));
    await page.close();
  }

  // full page home mobile shots
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.screenshot({ path: `${process.env.TEMP}\\m-home-full.png`, fullPage: true });
  await page.screenshot({ path: `${process.env.TEMP}\\m-home-top.png` });
  const trust = await page.evaluate(() => {
    const el = [...document.querySelectorAll("section")].find((s) =>
      s.textContent.includes("Premium Quality")
    );
    if (!el) return "no trustbar";
    el.scrollIntoView({ block: "center" });
    return new Promise((res) =>
      setTimeout(() => {
        const items = [...el.querySelectorAll("p")].map((p) => ({
          t: p.textContent.trim().slice(0, 22),
          op: getComputedStyle(p).opacity,
        }));
        res(items);
      }, 1200)
    );
  });
  console.log("trustbar items: " + JSON.stringify(trust));
  await page.screenshot({ path: `${process.env.TEMP}\\m-home-trust.png` });

  await browser.close();
})();
