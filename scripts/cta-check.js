const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });

  for (const vp of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height, isMobile: vp.name === "mobile" });
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 3000));

    const info = await page.evaluate(() => {
      const el = [...document.querySelectorAll("section")].find((s) =>
        s.textContent.includes("Your dream aquarium is one click away")
      );
      if (!el) return "not found";
      el.scrollIntoView({ block: "center" });
      return new Promise((res) =>
        setTimeout(() => {
          const r = el.getBoundingClientRect();
          res({
            w: Math.round(r.width),
            h: Math.round(r.height),
            hasPromo: el.textContent.includes("OCEAN10"),
            text: el.innerText.replace(/\n+/g, " | ").slice(0, 220),
          });
        }, 1500)
      );
    });
    console.log(vp.name + ": " + JSON.stringify(info));
    await page.screenshot({ path: `${process.env.TEMP}\\cta-${vp.name}.png` });
    await page.close();
  }
  await browser.close();
})();
