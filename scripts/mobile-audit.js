const puppeteer = require("puppeteer-core");

const ROUTES = [
  { path: "/", name: "home" },
  { path: "/shop", name: "shop" },
  { path: "/product/neon-tetra", name: "product" },
  { path: "/cart", name: "cart" },
  { path: "/about", name: "about" },
  { path: "/contact", name: "contact" },
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  for (const vp of VIEWPORTS) {
    console.log(`\n===== ${vp.name} (${vp.width}x${vp.height}) =====`);
    const page = await browser.newPage();
    await page.setViewport({
      width: vp.width,
      height: vp.height,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
      deviceScaleFactor: 1,
    });

    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 160)));

    for (const r of ROUTES) {
      const res = await page.goto("http://localhost:3000" + r.path, {
        waitUntil: "networkidle2",
        timeout: 60000,
      });
      await new Promise((res2) => setTimeout(res2, 1200));

      const audit = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const scrollW = document.documentElement.scrollWidth;

        // elements wider than viewport
        const overflow = [];
        document.querySelectorAll("body *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          if (r.right > docW + 2 || r.left < -2) {
            const cs = getComputedStyle(el);
            if (cs.position === "fixed" || cs.visibility === "hidden" || cs.opacity === "0") return;
            overflow.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || "")).slice(0, 70),
              left: Math.round(r.left),
              right: Math.round(r.right),
              w: Math.round(r.width),
            });
          }
        });

        // small tap targets among interactive elements
        const small = [];
        document.querySelectorAll("a, button, input, select, textarea").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none") return;
          if (r.height < 32 || r.width < 32) {
            small.push({
              tag: el.tagName.toLowerCase(),
              label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 32),
              w: Math.round(r.width),
              h: Math.round(r.height),
            });
          }
        });

        // text that overflows its own box
        const clipped = [];
        document.querySelectorAll("h1,h2,h3,p,span,a,button,li").forEach((el) => {
          if (el.children.length > 0) return;
          if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
            const cs = getComputedStyle(el);
            if (cs.overflow === "visible" && cs.whiteSpace !== "nowrap" && cs.textOverflow !== "ellipsis") {
              clipped.push({
                tag: el.tagName.toLowerCase(),
                label: (el.textContent || "").trim().slice(0, 40),
                scrollW: el.scrollWidth,
                clientW: el.clientWidth,
              });
            }
          }
        });

        return {
          docW,
          scrollW,
          hOverflow: scrollW > docW + 2,
          overflow: overflow.slice(0, 6),
          smallCount: small.length,
          small: small.slice(0, 6),
          clippedCount: clipped.length,
          clipped: clipped.slice(0, 5),
          fontSizes: (() => {
            const set = {};
            document.querySelectorAll("p,span,a,button,h1,h2,h3,li").forEach((el) => {
              if (el.children.length > 0) return;
              const t = (el.textContent || "").trim();
              if (t.length < 3) return;
              const fs = parseFloat(getComputedStyle(el).fontSize);
              set[fs] = (set[fs] || 0) + 1;
            });
            return Object.entries(set)
              .map(([k, v]) => ({ px: +k, count: v }))
              .sort((a, b) => a.px - b.px)
              .slice(0, 4);
          })(),
        };
      });

      const flag = audit.hOverflow ? "H-OVERFLOW" : "ok";
      console.log(`\n[${flag}] ${r.path} (${res.status()})`);
      if (audit.hOverflow) {
        console.log(`   scrollWidth ${audit.scrollW} > clientWidth ${audit.docW}`);
        audit.overflow.forEach((o) =>
          console.log(`   overflow: <${o.tag} class="${o.cls}"> left=${o.left} right=${o.right} w=${o.w}`)
        );
      }
      if (audit.smallCount) {
        console.log(`   small tap targets: ${audit.smallCount}`);
        audit.small.forEach((s) =>
          console.log(`     <${s.tag}> "${s.label}" ${s.w}x${s.h}`)
        );
      }
      if (audit.clippedCount) {
        console.log(`   clipped text: ${audit.clippedCount}`);
        audit.clipped.forEach((c) =>
          console.log(`     <${c.tag}> "${c.label}" ${c.scrollW}>${c.clientW}`)
        );
      }
      console.log(`   smallest font sizes: ${JSON.stringify(audit.fontSizes)}`);
      if (errors.length) console.log(`   JS errors: ${JSON.stringify(errors)}`);

      await page.screenshot({
        path: `${process.env.TEMP}\\m-${vp.name}-${r.name}.png`,
        fullPage: false,
      });
    }

    await page.close();
  }

  await browser.close();
})();
