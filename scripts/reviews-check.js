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

  await page.goto("http://localhost:3000/", { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 3000));

  const info = await page.evaluate(() => {
    const sec = [...document.querySelectorAll("section")].find((s) =>
      s.textContent.includes("Your dream aquarium is one click away")
    );
    const reviewSec = [...document.querySelectorAll("section")].find((s) =>
      s.textContent.includes("Loved by aquarists")
    );
    if (!reviewSec) return { err: "no review section" };
    reviewSec.scrollIntoView({ block: "center" });
    return new Promise((res) =>
      setTimeout(() => {
        const h2 = reviewSec.querySelector("h2");
        const eyebrow = reviewSec.querySelector(".eyebrow");
        const p = reviewSec.querySelector("p");
        const swiper = reviewSec.querySelector(".swiper");
        const slides = [...reviewSec.querySelectorAll(".swiper-slide")].map((s) => {
          const cs = getComputedStyle(s);
          return {
            transform: cs.transform.slice(0, 60),
            opacity: cs.opacity,
            swiperClasses: s.className.replace("swiper-slide ", "").slice(0, 70),
          };
        });
        res({
          headingLeft: h2 ? Math.round(h2.getBoundingClientRect().left) : null,
          h2TextAlign: h2 ? getComputedStyle(h2).textAlign : null,
          eyebrowLeft: eyebrow ? Math.round(eyebrow.getBoundingClientRect().left) : null,
          pAlign: p ? getComputedStyle(p).textAlign : null,
          swiperOverflow: swiper ? getComputedStyle(swiper).overflow : null,
          slides: slides.slice(0, 6),
          prevBtn: !!reviewSec.querySelector("#review-prev"),
          nextBtn: !!reviewSec.querySelector("#review-next"),
        });
      }, 1200)
    );
  });

  console.log(JSON.stringify(info, null, 2));
  await page.screenshot({ path: `${process.env.TEMP}\\rev-1.png` });

  // click next and capture the sweep mid-transition
  await page.evaluate(() => document.querySelector("#review-next")?.click());
  await new Promise((r) => setTimeout(r, 340));
  await page.screenshot({ path: `${process.env.TEMP}\\rev-mid.png` });
  await new Promise((r) => setTimeout(r, 900));
  await page.screenshot({ path: `${process.env.TEMP}\\rev-2.png` });

  if (errors.length) console.log("JS ERRORS: " + JSON.stringify(errors));
  else console.log("no JS errors");
  await browser.close();
})();
