"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Store, Truck } from "lucide-react";
import type { Product } from "@/data/types";
import { ageLabel } from "@/data/catalog";
import { formatGHS } from "@/lib/format";
import { buildQuickOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { MAX_QTY, useCart } from "@/store/cart";
import { StockBadge } from "./StockBadge";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [imageIndex, setImageIndex] = useState(0);
  const [variant, setVariant] = useState(product.variants[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: product.price,
        variantLabel: product.variantLabel,
        variant,
      },
      qty,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  const quickOrder = () => {
    const message = buildQuickOrderMessage(
      { name: product.name, variantLabel: product.variantLabel, variant, quantity: qty, price: product.price },
      window.location.href,
    );
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-3 grid gap-8 pb-20 md:grid-cols-2 md:gap-12 md:pb-0">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-sm">
          <Image
            key={product.images[imageIndex]}
            src={product.images[imageIndex]}
            alt={`${product.name}${product.images.length > 1 ? ` — photo ${imageIndex + 1} of ${product.images.length}` : ""}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="animate-fade-in-up object-cover transition-all duration-300"
          />
        </div>
        {product.images.length > 1 && (
          <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Product photos">
            {product.images.map((src, i) => (
              <li key={src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === imageIndex}
                  className={`tap-interactive relative block size-16 sm:size-20 overflow-hidden rounded-xl border-2 bg-paper transition-all ${
                    i === imageIndex ? "border-ink ring-2 ring-ink/20 scale-95" : "border-line opacity-75 hover:opacity-100"
                  }`}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <StockBadge inStock={product.inStock} />
        <h1 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-ink">
          {product.name}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          For {product.ages.map(ageLabel).join(" & ").toLowerCase()} · {product.tag}
        </p>
        <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold tabular-nums text-ink">{formatGHS(product.price)}</p>

        <p className="mt-4 sm:mt-5 max-w-prose leading-relaxed text-ink-soft text-sm sm:text-base">{product.description}</p>
        <ul className="mt-4 space-y-1.5">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-ink">
              <Check className="mt-0.5 size-4 shrink-0 text-turf" />
              {h}
            </li>
          ))}
        </ul>

        {/* Size / age selector */}
        <fieldset className="mt-6 sm:mt-7">
          <legend className="mb-2 text-sm font-semibold">
            {product.variantLabel}: <span className="font-normal text-ink-soft">{variant}</span>
          </legend>
          <div className="flex flex-wrap gap-2" role="radiogroup">
            {product.variants.map((v) => {
              const checked = v === variant;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  onClick={() => setVariant(v)}
                  className={`tap-interactive min-h-[44px] min-w-14 rounded-xl border-2 px-3.5 py-2 text-sm font-semibold transition-all ${
                    checked
                      ? "border-ink bg-ink text-paper shadow-sm scale-[1.02]"
                      : "border-line bg-paper text-ink hover:border-ink/50"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Quantity + add (Desktop / in-page buttons) */}
        <div className="mt-6 flex gap-3">
          <div className="flex h-12 items-center rounded-btn border border-line bg-paper shadow-sm" aria-label="Quantity">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="tap-interactive grid h-full w-11 place-items-center disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
              disabled={qty >= MAX_QTY}
              className="tap-interactive grid h-full w-11 place-items-center disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            className={`tap-interactive inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-btn px-5 font-semibold text-white shadow-sm transition-all disabled:opacity-50 ${
              added ? "bg-turf" : "bg-pillar hover:bg-pillar-dark"
            }`}
          >
            {added ? <Check className="size-5 animate-cart-pop" /> : <ShoppingBag className="size-5" />}
            {added ? "Added to cart" : "Add to Cart"}
          </button>
        </div>

        <button
          type="button"
          onClick={quickOrder}
          className="tap-interactive mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-btn border-2 border-turf font-semibold text-turf shadow-sm transition-all hover:bg-turf hover:text-white"
        >
          <WhatsAppIcon />
          Quick Order via WhatsApp
        </button>

        <dl className="mt-8 grid gap-4 rounded-card bg-paper p-5 text-sm sm:grid-cols-2 border border-line/60">
          <div className="flex gap-3">
            <Truck className="size-5 shrink-0 text-pillar" />
            <div>
              <dt className="font-semibold">Same-day delivery</dt>
              <dd className="text-ink-soft">Tema &amp; Accra, fee confirmed on WhatsApp</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <Store className="size-5 shrink-0 text-pillar" />
            <div>
              <dt className="font-semibold">Free in-store pickup</dt>
              <dd className="text-ink-soft">Community 8, Tema</dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden animate-slide-up-bottom">
        <div className="flex items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <span className="block text-xs font-semibold text-ink-soft truncate">{product.variantLabel}: {variant}</span>
            <span className="block text-lg font-bold tabular-nums text-ink">{formatGHS(product.price)}</span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            className={`tap-interactive inline-flex h-11 flex-[2] items-center justify-center gap-1.5 rounded-btn px-3 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50 ${
              added ? "bg-turf" : "bg-pillar hover:bg-pillar-dark"
            }`}
          >
            {added ? <Check className="size-4 animate-cart-pop" /> : <ShoppingBag className="size-4" />}
            {added ? "Added!" : "Add to Cart"}
          </button>

          <button
            type="button"
            onClick={quickOrder}
            className="tap-interactive grid size-11 shrink-0 place-items-center rounded-btn bg-turf text-white shadow-sm transition-all hover:bg-turf-dark"
            aria-label="Order on WhatsApp"
            title="Order on WhatsApp"
          >
            <WhatsAppIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
