const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3200));

  const shot = async (needle, name) => {
    await page.evaluate((n) => {
      const s = [...document.querySelectorAll("section")].find((x) =>
        x.textContent.includes(n)
      );
      s?.scrollIntoView({ block: "center" });
    }, needle);
    await new Promise((r) => setTimeout(r, 1600));
    await page.screenshot({ path: `${process.env.TEMP}\\${name}.png` });
  };

  await shot("Your dream aquarium is one click away", "cta2");
  await shot("Real fish, happy hobbyists", "rev3");

  const info = await page.evaluate(() => {
    const cta = [...document.querySelectorAll("section")].find((s) =>
      s.textContent.includes("Your dream aquarium is one click away")
    );
    const img = cta.querySelector("img");
    const rev = [...document.querySelectorAll("section")].find((s) =>
      s.textContent.includes("Real fish, happy hobbyists")
    );
    return {
      ctaImg: img ? img.getAttribute("src") : null,
      overlays: [...cta.querySelectorAll("div.absolute.inset-0")].map((d) =>
        getComputedStyle(d).backgroundColor
      ),
      reviewTitle: rev.querySelector("h2")?.textContent,
      reviewDesc: rev.querySelector("p")?.textContent,
      reviewTexts: [...rev.querySelectorAll("blockquote")].map((b) => b.textContent.slice(0, 70)),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})();
