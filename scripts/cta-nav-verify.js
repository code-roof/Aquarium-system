const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // scrolled navbar on /shop should turn white with dark text
  await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => window.scrollTo(0, 500));
  await new Promise((r) => setTimeout(r, 900));
  const s = await page.evaluate(() => {
    const a = document.querySelector('nav[aria-label="Primary"] a');
    return { linkColor: getComputedStyle(a).color, headerBg: getComputedStyle(document.querySelector("header > div")).backgroundColor };
  });
  console.log("shop scrolled:", JSON.stringify(s));

  // home: CTA darkness + height, and nav on scroll
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));
  const cta = await page.evaluate(() => {
    const sec = [...document.querySelectorAll("section")].find((s) => s.textContent.includes("Start your underwater world"));
    const flat = sec.querySelector("div.bg-navy-950\\/30");
    return { height: sec.offsetHeight, flatOverlay: flat ? getComputedStyle(flat).backgroundColor : "NOT FOUND" };
  });
  console.log("cta:", JSON.stringify(cta));

  await page.evaluate(() => window.scrollTo(0, 600));
  await new Promise((r) => setTimeout(r, 900));
  const h = await page.evaluate(() => {
    const a = document.querySelector('nav[aria-label="Primary"] a');
    return { linkColor: getComputedStyle(a).color, headerBg: getComputedStyle(document.querySelector("header > div")).backgroundColor };
  });
  console.log("home scrolled:", JSON.stringify(h));

  await browser.close();
})();
