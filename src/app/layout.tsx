import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import { UIProvider } from "@/providers/UIProvider";
import { CartProvider } from "@/providers/CartProvider";
import { WishlistProvider } from "@/providers/WishlistProvider";
import { Navbar, MobileMenu } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { SmoothScroll } from "@/components/effects/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "aquarium.lk — Nature in Every Drop | Premium Aquariums & Fish",
    template: "%s | aquarium.lk",
  },
  description:
    "Sri Lanka's premium destination for healthy tropical fish, rimless aquariums, plants, food and equipment. Nationwide delivery from Colombo.",
  keywords: ["aquarium", "fish", "Sri Lanka", "aquarium.lk", "tropical fish", "aquascaping"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top" className={`${inter.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <ToastProvider>
            <UIProvider>
              <CartProvider>
                <WishlistProvider>
                  <LoadingScreen />
                  <CustomCursor />
                  <Navbar />
                  <MobileMenu />
                  <SearchOverlay />
                  <main id="main-content" tabIndex={-1}>
                    {children}
                  </main>
                  <Footer />
                </WishlistProvider>
              </CartProvider>
            </UIProvider>
          </ToastProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
