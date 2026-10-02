import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "live-fish",
    name: "Live Fish",
    slug: "fish",
    image: "/images/category/live-fish.jpg",
    description: "Quarantined, healthy freshwater & marine fish",
    href: "/shop?category=fish",
    count: 20,
  },
  {
    id: "aquarium-tanks",
    name: "Aquarium Tanks",
    slug: "tanks",
    image: "/images/category/aquarium-tanks.jpg",
    description: "Rimless, bowfront & full display systems",
    href: "/shop?category=tanks",
    count: 10,
  },
  {
    id: "aquatic-plants",
    name: "Aquatic Plants",
    slug: "plants",
    image: "/images/category/aquatic-plants.jpg",
    description: "Live plants, mosses & starter bundles",
    href: "/shop?category=plants",
    count: 10,
  },
  {
    id: "fish-food",
    name: "Fish Food",
    slug: "food",
    image: "/images/category/fish-food.jpg",
    description: "Flakes, pellets, treats & live food",
    href: "/shop?category=food",
    count: 10,
  },
  {
    id: "filters-equipment",
    name: "Filters & Equipment",
    slug: "equipment",
    image: "/images/category/filters-equipment.jpg",
    description: "Filtration, heating, lighting & aeration",
    href: "/shop?category=equipment",
    count: 10,
  },
  {
    id: "accessories",
    name: "Accessories",
    slug: "accessories",
    image: "/images/category/accessories.jpg",
    description: "Substrate, hardscape, décor & tools",
    href: "/shop?category=accessories",
    count: 10,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);
