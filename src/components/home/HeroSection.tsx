import fs from "node:fs";
import path from "node:path";
import { Hero, type HeroSlide } from "./Hero";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

function titleFromFilename(file: string): string {
  return path
    .basename(file, path.extname(file))
    .replace(/[-_]+/g, " ")
    .replace(/\d+/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getHeroSlides(): HeroSlide[] {
  const dir = path.join(process.cwd(), "public", "images", "hero");
  try {
    return fs
      .readdirSync(dir)
      .filter((file) => IMAGE_EXT.includes(path.extname(file).toLowerCase()))
      .sort()
      .map((file) => ({
        src: `/images/hero/${file}`,
        alt: titleFromFilename(file),
      }));
  } catch {
    return [];
  }
}

export function HeroSection() {
  const slides = getHeroSlides();
  return <Hero slides={slides} />;
}
