"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { products } from "@/data/products";
import {
  AGE_GROUPS,
  CATEGORIES,
  PRICE_RANGES,
  SORTS,
  type SortSlug,
} from "@/data/catalog";
import type { AgeGroup, CategorySlug } from "@/data/types";
import { searchProducts } from "@/lib/search";
import { ProductCard } from "./ProductCard";

type FilterKey = "age" | "category" | "price";

export function ShopView() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const age = params.get("age") as AgeGroup | null;
  const category = params.get("category") as CategorySlug | null;
  const price = params.get("price");
  const sortParam = params.get("sort");
  const sort: SortSlug = SORTS.some((s) => s.slug === sortParam) ? (sortParam as SortSlug) : "featured";

  const setParam = (key: FilterKey | "sort" | "q", value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearAll = () => router.replace(pathname, { scroll: false });

  const results = useMemo(() => {
    let list = searchProducts(products, q);
    if (age) list = list.filter((p) => p.ages.includes(age));
    if (category) list = list.filter((p) => p.category === category);
    const range = PRICE_RANGES.find((r) => r.slug === price);
    if (range) list = list.filter((p) => p.price >= range.min && p.price <= range.max);

    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "newest") sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt));
    else sorted.sort((a, b) => (a.featuredRank ?? 99) - (b.featuredRank ?? 99));
    return sorted;
  }, [q, age, category, price, sort]);

  // Lock scroll behind the mobile filter sheet
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFiltersOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [filtersOpen]);

  type ActiveFilter = { key: FilterKey | "q"; label: string };
  const activeRaw: (ActiveFilter | null)[] = [
    q ? { key: "q", label: `“${q}”` } : null,
    age ? { key: "age", label: AGE_GROUPS.find((a) => a.slug === age)?.label ?? age } : null,
    category
      ? { key: "category", label: CATEGORIES.find((c) => c.slug === category)?.label ?? category }
      : null,
    price ? { key: "price", label: PRICE_RANGES.find((r) => r.slug === price)?.label ?? price } : null,
  ];
  const active = activeRaw.filter((x): x is ActiveFilter => x !== null);

  const heading = category
    ? CATEGORIES.find((c) => c.slug === category)?.label
    : age
      ? AGE_GROUPS.find((a) => a.slug === age)?.label
      : q
        ? "Search results"
        : "Shop everything";

  const filterPanel = (
    <div className="space-y-7">
      <FilterGroup
        title="Age group"
        options={AGE_GROUPS.map((a) => ({ value: a.slug, label: `${a.label}`, hint: a.range }))}
        value={age}
        onChange={(v) => setParam("age", v)}
      />
      <FilterGroup
        title="Category"
        options={CATEGORIES.map((c) => ({ value: c.slug, label: c.label }))}
        value={category}
        onChange={(v) => setParam("category", v)}
      />
      <FilterGroup
        title="Price range"
        options={PRICE_RANGES.map((r) => ({ value: r.slug, label: r.label }))}
        value={price}
        onChange={(v) => setParam("price", v)}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 md:pt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{heading}</h1>
          <p className="mt-1 text-sm text-ink-soft" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-btn border border-line bg-paper px-4 text-sm font-semibold sm:flex-none lg:hidden"
          >
            <SlidersHorizontal className="size-4" />
            Filters{active.length > 0 && ` (${active.length})`}
          </button>
          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "featured" ? null : e.target.value)}
            className="h-11 flex-1 rounded-btn border border-line bg-paper px-3 text-sm font-semibold sm:flex-none"
          >
            {SORTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {active.length > 0 && (
        <ul className="mt-4 flex flex-wrap items-center gap-2">
          {active.map((f) => (
            <li key={f.key}>
              <button
                type="button"
                onClick={() => setParam(f.key, null)}
                className="inline-flex items-center gap-1.5 rounded-full bg-blush py-1.5 pl-3 pr-2 text-sm font-medium text-ink hover:bg-blush/70"
                aria-label={`Remove filter ${f.label}`}
              >
                {f.label}
                <X className="size-3.5" />
              </button>
            </li>
          ))}
          <li>
            <button type="button" onClick={clearAll} className="px-2 text-sm font-semibold text-pillar hover:underline">
              Clear all
            </button>
          </li>
        </ul>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-36">{filterPanel}</div>
        </aside>

        <section aria-label="Products">
          {results.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-paper px-6 py-14 text-center">
              <p className="font-display text-xl font-bold">No products match these filters</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
                Remove a filter to see more, or message us on WhatsApp — the shop has far more than we can list here.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 inline-flex h-11 items-center rounded-btn bg-ink px-5 text-sm font-semibold text-paper"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Mobile filter sheet */}
      <div className={`fixed inset-0 z-50 lg:hidden ${filtersOpen ? "" : "pointer-events-none"}`} aria-hidden={!filtersOpen}>
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-ink/45 transition-opacity duration-300 ${filtersOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
          inert={!filtersOpen}
          className={`absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-[1.75rem] bg-paper transition-transform duration-300 ease-out ${
            filtersOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-xl font-bold">Filters</h2>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="grid size-10 place-items-center rounded-full hover:bg-cotton"
              aria-label="Close filters"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{filterPanel}</div>
          <div className="flex gap-2 border-t border-line px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={clearAll}
              className="h-12 flex-1 rounded-btn border border-line font-semibold"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="h-12 flex-[2] rounded-btn bg-pillar font-semibold text-white"
            >
              Show {results.length} {results.length === 1 ? "product" : "products"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: string; label: string; hint?: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 font-display text-base font-bold">{title}</legend>
      <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="checkbox"
              aria-checked={checked}
              onClick={() => onChange(checked ? null : o.value)}
              className={`rounded-full border px-3.5 py-2 text-left text-sm transition-colors lg:rounded-lg lg:border-transparent lg:px-3 lg:py-1.5 ${
                checked
                  ? "border-ink bg-ink font-semibold text-paper"
                  : "border-line bg-paper text-ink hover:bg-cotton lg:bg-transparent"
              }`}
            >
              {o.label}
              {o.hint && <span className={`ml-1.5 text-xs ${checked ? "text-paper/75" : "text-ink-soft"}`}>{o.hint}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
