"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Search, ShoppingBag } from "lucide-react";
import { cartCount, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { STORE } from "@/lib/store-info";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function MobileNav() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const openCart = useCart((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;

  // On individual product pages, the dedicated Product sticky action bar takes priority
  if (pathname.startsWith("/product/")) {
    return null;
  }

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop");

  const focusSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    const searchInput = document.querySelector<HTMLInputElement>(
      'header input[type="search"]'
    );
    if (searchInput) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        searchInput.focus();
      }, 150);
    } else {
      window.location.href = "/shop";
    }
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:hidden transition-transform duration-200"
    >
      <div className="grid h-14 grid-cols-5 items-center px-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-colors active:scale-95 ${
            isHome ? "text-pillar font-bold" : "text-ink-soft hover:text-ink font-medium"
          }`}
        >
          <Home className="size-5" />
          <span className="text-[0.68rem] tracking-tight">Home</span>
        </Link>

        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center gap-0.5 py-1 text-center transition-colors active:scale-95 ${
            isShop ? "text-pillar font-bold" : "text-ink-soft hover:text-ink font-medium"
          }`}
        >
          <Layers className="size-5" />
          <span className="text-[0.68rem] tracking-tight">Shop</span>
        </Link>

        <button
          type="button"
          onClick={focusSearch}
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-center text-ink-soft hover:text-ink font-medium transition-colors active:scale-95"
          aria-label="Search products"
        >
          <Search className="size-5" />
          <span className="text-[0.68rem] tracking-tight">Search</span>
        </button>

        <a
          href={`https://wa.me/${STORE.whatsapp}?text=Hi%20Splendy%20Mothercare%2C%20I%20have%20an%20inquiry%20about%20a%20product`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-1 text-center text-turf hover:text-turf-dark font-medium transition-colors active:scale-95"
          aria-label="Chat with Splendy on WhatsApp"
        >
          <WhatsAppIcon className="size-5" />
          <span className="text-[0.68rem] tracking-tight font-semibold">WhatsApp</span>
        </a>

        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center justify-center gap-0.5 py-1 text-center text-ink-soft hover:text-ink font-medium transition-colors active:scale-95"
          aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <div className="relative">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2.5 -top-1 grid min-w-4.5 h-4.5 place-items-center rounded-full bg-pillar px-1 text-[0.65rem] font-bold tabular-nums text-white ring-2 ring-paper">
                {count}
              </span>
            )}
          </div>
          <span className="text-[0.68rem] tracking-tight">Cart</span>
        </button>
      </div>
    </nav>
  );
}
