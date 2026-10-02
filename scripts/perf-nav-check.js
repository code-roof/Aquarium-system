const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const loaderGone = (page) =>
  page.evaluate(() => {
    const l = document.querySelector('div.fixed.z-\\[100\\]');
    return !l;
  });

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.setViewport({ width: 1440, height: 900 });

  // 1. FIRST visit of the session -> full intro
  let t0 = Date.now();
  await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded", timeout: 60000 });
  while (await loaderGone(page) && Date.now() - t0 < 12000) await new Promise((r) => setTimeout(r, 50));
  console.log("first visit loader:", Date.now() - t0, "ms");

  // 2. REFRESH in same session -> short flash
  t0 = Date.now();
  await page.reload({ waitUntil: "domcontentloaded", timeout: 60000 });
  while (await loaderGone(page) && Date.now() - t0 < 12000) await new Promise((r) => setTimeout(r, 50));
  console.log("refresh loader:", Date.now() - t0, "ms");

  // 3. Client-side navigation timings via the real menu
  for (const label of ["Shop", "About", "Contact"]) {
    const ms = await page.evaluate(async (lbl) => {
      const a = [...document.querySelectorAll('nav[aria-label="Primary"] a')].find((x) => x.textContent.trim() === lbl);
      const start = performance.now();
      a.click();
      await new Promise((res) => {
        const tick = () => (location.pathname === "/shop" || location.pathname === "/about" || location.pathname === "/contact") ? res() : setTimeout(tick, 30);
        setTimeout(tick, 30);
      });
      return Math.round(performance.now() - start);
    }, label);
    console.log(`nav -> ${label}: ${ms} ms`);
    await new Promise((r) => setTimeout(r, 700));
    // return home for the next leg
    await page.evaluate(() => {
      const h = [...document.querySelectorAll('nav[aria-label="Primary"] a')].find((x) => x.textContent.trim() === "Home");
      if (h) h.click();
    });
    await new Promise((r) => setTimeout(r, 700));
  }

  // 4. No Aquarium in menu or footer
  const links = await page.evaluate(() => {
    const nav = [...document.querySelectorAll('nav[aria-label="Primary"] a')].map((a) => a.textContent.trim());
    const foot = [...document.querySelectorAll("footer a")].map((a) => a.textContent.trim());
    return { nav, footHasAquarium: foot.includes("Aquarium") };
  });
  console.log("navbar:", JSON.stringify(links.nav), "| footer Aquarium:", links.footHasAquarium);

  console.log("js errors:", errors.length ? errors : "none");
  await browser.close();
})();
