const puppeteer = require("puppeteer-core");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--window-size=1440,900"] });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1000));

  const read = () =>
    page.evaluate(() => {
      const el = [...document.querySelectorAll("span")].find((s) => s.textContent === "Serving hobbyists since");
      const grid = el ? el.closest(".grid") : null;
      if (!grid) return null;
      return [...grid.querySelectorAll(".tabular-nums")].map((s) => s.textContent);
    });

  console.log("before scroll:", JSON.stringify(await read()));

  // scroll the stats band into view
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("span")].find((s) => s.textContent === "Serving hobbyists since");
    el.closest(".grid").scrollIntoView({ block: "center" });
  });

  const samples = [];
  for (let i = 0; i < 9; i++) {
    await new Promise((r) => setTimeout(r, 260));
    samples.push((await read())?.join(" | "));
  }
  console.log("samples:");
  samples.forEach((s) => console.log("  " + s));

  await new Promise((r) => setTimeout(r, 2200));
  console.log("settled:", JSON.stringify(await read()));
  console.log("js errors:", errors.length ? errors : "none");

  await browser.close();
})();
