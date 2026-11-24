"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { WordmarkLink } from "./Wordmark";
import { SearchBar } from "./SearchBar";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { CATEGORIES } from "@/data/catalog";
import { cartCount, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";
import { STORE } from "@/lib/store-info";

export function Header() {
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-md supports-[backdrop-filter]:bg-paper/85 transition-all">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 pt-3 pb-2 md:py-3">
        <WordmarkLink />
        <SearchBar className="hidden flex-1 md:block md:max-w-xl md:mx-auto" />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {/* Quick WhatsApp button */}
          <a
            href={`https://wa.me/${STORE.whatsapp}?text=Hello%20Splendy%20Mothercare%2C%20I'd%20like%20to%20make%20an%20inquiry`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="tap-interactive flex size-10 md:size-11 items-center justify-center rounded-full bg-turf/10 text-turf hover:bg-turf hover:text-white transition-all shadow-sm"
          >
            <WhatsAppIcon className="size-5" />
          </a>

          {/* Cart button */}
          <button
            type="button"
            onClick={open}
            className="tap-interactive relative grid size-10 md:size-11 shrink-0 place-items-center rounded-full bg-ink text-paper shadow-sm hover:bg-ink/90"
            aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="size-5 transition-transform active:scale-90" />
            {count > 0 && (
              <span
                key={count}
                className="animate-cart-pop absolute -right-1 -top-1 grid min-w-5 h-5 place-items-center rounded-full bg-pillar px-1 text-[0.7rem] font-bold tabular-nums text-white ring-2 ring-paper"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-2 md:hidden">
        <SearchBar />
      </div>

      <nav aria-label="Shop by category" className="relative mx-auto max-w-6xl">
        {/* Subtle scroll cues on mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-2.5 z-10 w-4 bg-gradient-to-r from-paper to-transparent md:hidden"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-2.5 z-10 w-6 bg-gradient-to-l from-paper to-transparent md:hidden"
        />
        <ul className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 pb-2.5 text-sm scroll-smooth">
          <li>
            <Link
              href="/shop"
              className="tap-interactive block whitespace-nowrap rounded-full bg-pillar/10 px-3.5 py-1.5 font-semibold text-pillar hover:bg-pillar hover:text-white transition-all"
            >
              Shop all
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="tap-interactive block whitespace-nowrap rounded-full border border-transparent px-3.5 py-1.5 font-medium text-ink-soft hover:border-line hover:bg-cotton hover:text-ink transition-all"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
