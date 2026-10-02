const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));
  await page.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) =>
      x.textContent.includes("Loved by aquarists")
    );
    s?.scrollIntoView({ block: "center" });
  });
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${process.env.TEMP}\\rev-mobile.png` });
  const m = await page.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) =>
      x.textContent.includes("Loved by aquarists")
    );
    return {
      docW: document.documentElement.clientWidth,
      htmlScrollW: document.documentElement.scrollWidth,
      h2Left: Math.round(s.querySelector("h2").getBoundingClientRect().left),
      swiperW: Math.round(s.querySelector(".swiper").getBoundingClientRect().width),
      slideCount: s.querySelectorAll(".swiper-slide").length,
    };
  });
  console.log(JSON.stringify(m));
  await browser.close();
})();
