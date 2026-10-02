const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  for (const route of ["/", "/shop", "/product/neon-tetra", "/cart", "/about", "/contact"]) {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3500));

    const res = await page.evaluate(async () => {
      window.scrollTo(9999, 0);
      await new Promise((r) => setTimeout(r, 350));
      const x = window.scrollX;
      window.scrollTo(0, 0);
      return {
        canScrollX: x,
        innerW: window.innerWidth,
        clientW: document.documentElement.clientWidth,
        htmlScrollW: document.documentElement.scrollWidth,
        bodyOverflowX: getComputedStyle(document.body).overflowX,
        hasHScrollbar: window.innerWidth > document.documentElement.clientWidth,
      };
    });
    console.log(route.padEnd(24), JSON.stringify(res));
    await page.close();
  }
  await browser.close();
})();
