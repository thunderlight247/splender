"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { products } from "@/data/products";
import { categoryLabel } from "@/data/catalog";
import { formatGHS } from "@/lib/format";
import { searchProducts } from "@/lib/search";

export function SearchBar({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => searchProducts(products, query).slice(0, 6), [query]);

  // Close the dropdown when tapping outside it
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  const submit = (e?: { preventDefault: () => void }) => {
    e?.preventDefault();
    const q = query.trim();
    setOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const showPanel = open && query.trim().length > 0;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form role="search" onSubmit={submit}>
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search products
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-ink-soft"
        />
        <input
          id={`${listId}-input`}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          placeholder="Search car seats, tutus, walkers…"
          autoComplete="off"
          aria-controls={listId}
          aria-expanded={showPanel}
          className="h-10 sm:h-11 w-full rounded-full border border-line bg-paper pl-10 pr-10 text-base md:text-[0.95rem] text-ink placeholder:text-ink-soft/80 focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-cotton active:bg-cotton"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </form>

      {showPanel && (
        <div
          id={listId}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-[60vh] overflow-y-auto rounded-2xl border border-line bg-paper shadow-[0_12px_32px_-12px_rgba(31,42,68,0.35)]"
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm text-ink-soft">
              Nothing matches “{query.trim()}”. Try “car seat”, “dress” or “walker”, or ask us on WhatsApp.
            </p>
          ) : (
            <ul>
              {results.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="flex min-h-[52px] items-center gap-3 px-3.5 py-2.5 hover:bg-cotton focus-visible:bg-cotton active:bg-cotton"
                  >
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-cotton">
                      <Image src={p.images[0]} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block text-xs text-ink-soft">
                        {categoryLabel(p.category)} · {p.tag}
                      </span>
                    </span>
                    <span className="text-sm font-semibold tabular-nums">{formatGHS(p.price)}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-line">
                <button
                  type="button"
                  onClick={submit}
                  className="w-full px-4 py-3 text-left text-sm font-semibold text-pillar hover:bg-cotton"
                >
                  See all results for “{query.trim()}”
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
