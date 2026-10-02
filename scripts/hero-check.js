const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1000 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 8000));

  const state = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const eyebrow = document.querySelector("p.text-aqua-300");
    return {
      bootedFlag: sessionStorage.getItem("aquarium-lk-booted"),
      bodyOverflow: document.body.style.overflow,
      loaderInDom: document.body.innerHTML.includes("z-[100]"),
      h1Style: h1 ? h1.getAttribute("style") : "no h1",
      h1Visible: h1 ? getComputedStyle(h1).opacity : "n/a",
      eyebrowVisible: eyebrow ? getComputedStyle(eyebrow).opacity : "n/a",
      scrollHeight: document.documentElement.scrollHeight,
    };
  });
  console.log(JSON.stringify({ state, errors: errors.slice(0, 5) }, null, 2));
  await page.screenshot({ path: process.env.TEMP + "\\aqlk-real.png" });
  await browser.close();
})();
