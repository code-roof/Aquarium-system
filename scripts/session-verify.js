const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const SEL = "div.fixed.z-\\[100\\]";

async function measure(page, loadFn) {
  const t0 = Date.now();
  await loadFn();
  let gone = false;
  while (Date.now() - t0 < 15000) {
    gone = await page.evaluate((s) => !document.querySelector(s), SEL);
    if (gone) break;
    await new Promise((r) => setTimeout(r, 50));
  }
  return { ms: Date.now() - t0, found: gone };
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.setViewport({ width: 1440, height: 900 });

  const first = await measure(page, () => page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 }));
  console.log("FIRST visit  loader hidden after:", first.ms, "ms  (intro should be ~3100)");

  const second = await measure(page, () => page.reload({ waitUntil: "domcontentloaded", timeout: 60000 }));
  console.log("REFRESH      loader hidden after:", second.ms, "ms  (short flash)");

  const third = await measure(page, () => page.reload({ waitUntil: "domcontentloaded", timeout: 60000 }));
  console.log("REFRESH #2   loader hidden after:", third.ms, "ms");

  // scroll lock released after boot?
  const overflow = await page.evaluate(() => document.body.style.overflow || "(unset)");
  console.log("body overflow after boot:", overflow);

  // client-side navigation timings
  for (const [label, path] of [["Shop", "/shop"], ["About", "/about"], ["Contact", "/contact"]]) {
    const ms = await page.evaluate(async (lbl, p) => {
      const a = [...document.querySelectorAll('nav[aria-label="Primary"] a')].find((x) => x.textContent.trim() === lbl);
      const start = performance.now();
      a.click();
      await new Promise((res) => {
        const tick = () => (location.pathname === p ? res() : setTimeout(tick, 20));
        setTimeout(tick, 20);
      });
      return Math.round(performance.now() - start);
    }, label, path);
    console.log(`nav -> ${label}: ${ms} ms`);
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => {
      const h = [...document.querySelectorAll('nav[aria-label="Primary"] a')].find((x) => x.textContent.trim() === "Home");
      if (h) h.click();
    });
    await new Promise((r) => setTimeout(r, 500));
  }

  const checks = await page.evaluate(() => ({
    navbar: [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => a.textContent.trim()),
    footerAquarium: [...document.querySelectorAll("footer a")].some((a) => a.textContent.trim() === "Aquarium"),
    shopGlow: !!document.querySelector('[class*="radial-gradient(700px"]'),
  }));
  console.log("navbar:", JSON.stringify(checks.navbar));
  console.log("footer has Aquarium:", checks.footerAquarium);
  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
})();
