export type ProductCategory =
  | "fish"
  | "tanks"
  | "plants"
  | "food"
  | "equipment"
  | "accessories";

export type StockState = "in-stock" | "low-stock" | "unavailable";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductReview {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  type: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  description: string;
  shortDescription: string;
  stock: number;
  stockLabel: string;
  stockState: StockState;
  badge?: string;
  isLiveFish?: boolean;
  specs?: ProductSpec[];
  care?: { label: string; value: string }[];
  featured?: boolean;
  createdAt: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  href: string;
  count: number;
}

export interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered";

export interface OrderLine {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderLine[];
  estimate: string;
  address: string;
  payment: string;
}

export interface Address {
  id: string;
  label: string;
  recipient: string;
  line1: string;
  city: string;
  province: string;
  phone: string;
  isDefault?: boolean;
}
