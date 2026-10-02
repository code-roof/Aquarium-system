const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/shop?category=tanks", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await new Promise((r) => setTimeout(r, 3000));

  const read = async () =>
    page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim(),
      url: location.pathname + location.search,
      resultCount: document.body.innerText.match(/(\d+)\s+results/)?.[1] ?? "?",
    }));

  console.log("initial (tanks):", JSON.stringify(await read()));

  // click the navbar "Shop" link (client-side nav, no reload)
  const clicked = await page.evaluate(() => {
    const link = [...document.querySelectorAll("header nav a")].find(
      (a) => a.textContent.trim() === "Shop"
    );
    if (!link) return false;
    link.click();
    return true;
  });
  console.log("clicked Shop:", clicked);
  await new Promise((r) => setTimeout(r, 2500));
  console.log("after Shop click:", JSON.stringify(await read()));

  // now click "Aquarium"
  const clicked2 = await page.evaluate(() => {
    const link = [...document.querySelectorAll("header nav a")].find(
      (a) => a.textContent.trim() === "Aquarium"
    );
    if (!link) return false;
    link.click();
    return true;
  });
  console.log("clicked Aquarium:", clicked2);
  await new Promise((r) => setTimeout(r, 2500));
  console.log("after Aquarium click:", JSON.stringify(await read()));

  await browser.close();
})();
