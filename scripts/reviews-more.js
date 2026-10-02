const puppeteer = require("puppeteer-core");

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message).slice(0, 200)));
  const failed = [];
  page.on("requestfailed", (r) => failed.push(r.url().slice(-60)));

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3200));
  await page.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) =>
      x.textContent.includes("Real fish, happy hobbyists")
    );
    s?.scrollIntoView({ block: "center" });
  });
  await new Promise((r) => setTimeout(r, 1800));
  await page.screenshot({ path: `${process.env.TEMP}\\rev-more.png` });

  const info = await page.evaluate(() => {
    const s = [...document.querySelectorAll("section")].find((x) =>
      x.textContent.includes("Real fish, happy hobbyists")
    );
    const slides = [...s.querySelectorAll(".swiper-slide")];
    const imgs = [...s.querySelectorAll("img")].map((i) => ({
      src: i.getAttribute("src")?.split("url=")[1]?.split("&")[0] || i.getAttribute("src"),
      loaded: i.complete && i.naturalWidth > 0,
      alt: i.getAttribute("alt"),
    }));
    return {
      slideCount: slides.length,
      brokenImgs: imgs.filter((i) => !i.loaded).map((i) => i.src),
      imgCount: imgs.length,
      names: [...s.querySelectorAll("figcaption span.block.truncate")].map(
        (n) => n.textContent.trim()
      ),
      has3d: slides.some((sl) => getComputedStyle(sl).transform.startsWith("matrix3d")),
    };
  });
  console.log(JSON.stringify(info, null, 2));
  console.log(errors.length ? "JS ERRORS: " + JSON.stringify(errors) : "no JS errors");
  if (failed.length) console.log("failed requests: " + JSON.stringify(failed));
  await browser.close();
})();
