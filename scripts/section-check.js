const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1000 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 7000));

  const shots = [
    { name: "categories", find: 'document.querySelector("section.container-x.py-24")' },
    { name: "banner", find: '[...document.querySelectorAll("section")].find(s => s.textContent.includes("Everything You Need to Start Your Aquarium"))' },
    { name: "fish", find: '[...document.querySelectorAll("section")].find(s => s.textContent.includes("Featured this week"))' },
    { name: "hero", find: '(window.scrollTo(0, 0), document.body)' },
  ];
  for (const s of shots) {
    const ok = await page.evaluate((code) => {
      const el = eval(code);
      if (!el) return false;
      el.scrollIntoView({ block: "center" });
      return true;
    }, s.find);
    if (!ok) console.log("missing target: " + s.name);
    await new Promise((r) => setTimeout(r, 1800));
    await page.screenshot({ path: `${process.env.TEMP}\\aqlk-${s.name}.png` });
  }

  const rowInfo = await page.evaluate(() => {
    const grid = document.querySelector("section.container-x.py-24 .grid");
    if (!grid) return "no grid";
    const cards = [...grid.children].map((c) => {
      const r = c.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) };
    });
    return { cols: getComputedStyle(grid).gridTemplateColumns, count: cards.length, cards };
  });
  console.log(JSON.stringify(rowInfo, null, 2));
  await browser.close();
})();
