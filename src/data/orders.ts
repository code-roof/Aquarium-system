import type { Address, Order, OrderLine, OrderStatus } from "@/types";

/** Demo account data — no real authentication is connected yet. */
export const demoUser = {
  name: "Sanduni Jayasuriya",
  email: "sanduni@example.lk",
  phone: "+94 77 123 4567",
  joined: "January 2025",
  initials: "SJ",
};

export const demoAddresses: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    recipient: "Sanduni Jayasuriya",
    line1: "142/3 Park Road, Nugegoda",
    city: "Nugegoda",
    province: "Western",
    phone: "+94 77 123 4567",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    recipient: "Sanduni Jayasuriya",
    line1: "Level 7, Trade Centre, Fort",
    city: "Colombo 01",
    province: "Western",
    phone: "+94 77 123 4567",
  },
];

const line = (name: string, image: string, price: number, quantity: number): OrderLine => ({
  name,
  image,
  price,
  quantity,
});

export const demoOrders: Order[] = [
  {
    id: "ORD-00124",
    date: "12 Feb 2026",
    status: "shipped",
    total: 68200,
    estimate: "Arriving in 2 days",
    address: "142/3 Park Road, Nugegoda",
    payment: "Card ending 4417",
    items: [
      line("Reef Nano Aquarium 45L", "/images/tanks/nano-aquarium-90297903.jpg", 68500, 1),
      line("Neon Tetra", "/images/fish/paracheirodon-innesi-26431525.jpg", 250, 6),
      line("Java Fern (Live Plant)", "/images/plants/java-fern-aquarium-195896076.jpg", 450, 2),
    ],
  },
  {
    id: "ORD-00123",
    date: "05 Feb 2026",
    status: "delivered",
    total: 12450,
    estimate: "Delivered",
    address: "142/3 Park Road, Nugegoda",
    payment: "Cash on delivery",
    items: [
      line("Silent Air Pump", "/images/equipment/air-pump-aquarium-53519446.jpg", 6500, 1),
      line("Natural Gravel (Substrate)", "/images/accessories/aquarium-gravel-10921738.jpg", 1850, 2),
      line("Tropical Flakes (Fish Food)", "/images/food/aquarium-fish-food-579001.jpg", 890, 3),
    ],
  },
  {
    id: "ORD-00121",
    date: "28 Jan 2026",
    status: "processing",
    total: 54500,
    estimate: "Packing your order",
    address: "Level 7, Trade Centre, Fort",
    payment: "Bank transfer",
    items: [
      line("Cube Planted Aquarium 60L", "/images/tanks/nano-aquarium-61493098.jpg", 54500, 1),
    ],
  },
  {
    id: "ORD-00118",
    date: "16 Jan 2026",
    status: "delivered",
    total: 9650,
    estimate: "Delivered",
    address: "142/3 Park Road, Nugegoda",
    payment: "Card ending 4417",
    items: [
      line("Betta Fish", "/images/fish/betta-splendens-79067216.jpg", 850, 4),
      line("Anubias Nana (Live Plant)", "/images/plants/anubias-plant-aquarium-195875476.jpg", 650, 4),
      line("Colour Boost Betta Bits", "/images/food/fischfutter-18665319.jpg", 1350, 4),
    ],
  },
  {
    id: "ORD-00115",
    date: "04 Jan 2026",
    status: "delivered",
    total: 34500,
    estimate: "Delivered",
    address: "142/3 Park Road, Nugegoda",
    payment: "Card ending 4417",
    items: [
      line("External Canister Filter", "/images/equipment/aquarium-canister-filter-115888611.jpg", 34500, 1),
    ],
  },
];

export const orderTimeline: { status: OrderStatus; label: string; description: string }[] = [
  { status: "placed", label: "Order Placed", description: "We received your order" },
  { status: "confirmed", label: "Confirmed", description: "Payment verified" },
  { status: "processing", label: "Processing", description: "Items being prepared" },
  { status: "packed", label: "Packed", description: "Boxed and labelled" },
  { status: "shipped", label: "Shipped", description: "Handed to the courier" },
  { status: "delivered", label: "Delivered", description: "Arrived at your door" },
];
