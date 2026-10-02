import { products, getProductBySlug, getRelatedProducts, searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import type { Product, ProductCategory } from "@/types";

/**
 * Mock product service. Swap the implementation body for Laravel REST
 * calls (`fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)`) when the
 * backend lands — the signatures stay identical.
 */

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export interface ProductQuery {
  category?: ProductCategory | "all";
  sort?: string;
  search?: string;
  maxPrice?: number;
  rating?: number;
  availability?: "all" | "in-stock";
}

export const productService = {
  async list(query: ProductQuery = {}): Promise<Product[]> {
    await delay();
    let result = [...products];

    if (query.category && query.category !== "all") {
      result = result.filter((p) => p.category === query.category);
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (query.maxPrice) {
      result = result.filter((p) => p.price <= query.maxPrice!);
    }
    if (query.rating) {
      result = result.filter((p) => p.rating >= query.rating!);
    }
    if (query.availability === "in-stock") {
      result = result.filter((p) => p.stockState !== "unavailable");
    }

    switch (query.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "featured":
      default:
        result.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }
    return result;
  },

  async bySlug(slug: string): Promise<Product | undefined> {
    await delay(160);
    return getProductBySlug(slug);
  },

  async related(product: Product, limit = 4): Promise<Product[]> {
    await delay(120);
    return getRelatedProducts(product, limit);
  },

  async search(term: string): Promise<Product[]> {
    await delay(120);
    return searchProducts(term);
  },

  async categories() {
    await delay(80);
    return categories;
  },

  async featured(limit = 8): Promise<Product[]> {
    await delay(120);
    const featured = products.filter((p) => p.featured);
    return [...featured, ...products.filter((p) => !p.featured)].slice(0, limit);
  },
};
