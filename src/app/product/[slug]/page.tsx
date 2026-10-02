import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { ProductDetails } from "@/components/product/ProductDetails";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return <ProductDetails product={product} related={getRelatedProducts(product, 4)} />;
}
