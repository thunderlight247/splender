"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { WordmarkLink } from "./Wordmark";
import { SearchBar } from "./SearchBar";
import { CATEGORIES } from "@/data/catalog";
import { cartCount, useCart } from "@/store/cart";
import { useHydrated } from "@/lib/use-hydrated";

export function Header() {
  const items = useCart((s) => s.items);
  const open = useCart((s) => s.open);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 pt-3 pb-2 md:py-3">
        <WordmarkLink />
        <SearchBar className="hidden flex-1 md:block md:max-w-xl md:mx-auto" />
        <button
          type="button"
          onClick={open}
          className="relative ml-auto grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-ink/90 md:ml-0"
          aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 grid min-w-5 h-5 place-items-center rounded-full bg-pillar px-1 text-[0.7rem] font-bold tabular-nums text-white ring-2 ring-paper">
              {count}
            </span>
          )}
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-2 md:hidden">
        <SearchBar />
      </div>

      <nav aria-label="Shop by category" className="mx-auto max-w-6xl">
        <ul className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-2.5 text-sm">
          <li>
            <Link
              href="/shop"
              className="block whitespace-nowrap rounded-full px-3 py-1.5 font-semibold text-pillar hover:bg-blush"
            >
              Shop all
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="block whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-ink-soft hover:bg-cotton hover:text-ink"
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
