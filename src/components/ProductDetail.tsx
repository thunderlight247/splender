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
    <div className="mt-3 grid gap-8 md:grid-cols-2 md:gap-12">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem] border border-line bg-paper">
          <Image
            key={product.images[imageIndex]}
            src={product.images[imageIndex]}
            alt={`${product.name}${product.images.length > 1 ? ` — photo ${imageIndex + 1} of ${product.images.length}` : ""}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        {product.images.length > 1 && (
          <ul className="mt-3 flex gap-2" aria-label="Product photos">
            {product.images.map((src, i) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setImageIndex(i)}
                  aria-label={`Show photo ${i + 1}`}
                  aria-current={i === imageIndex}
                  className={`relative block size-18 overflow-hidden rounded-xl border-2 bg-paper sm:size-20 ${
                    i === imageIndex ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"
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
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          For {product.ages.map(ageLabel).join(" & ").toLowerCase()} · {product.tag}
        </p>
        <p className="mt-4 text-3xl font-bold tabular-nums">{formatGHS(product.price)}</p>

        <p className="mt-5 max-w-prose leading-relaxed text-ink-soft">{product.description}</p>
        <ul className="mt-4 space-y-1.5">
          {product.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 size-4 shrink-0 text-turf" />
              {h}
            </li>
          ))}
        </ul>

        {/* Size / age selector */}
        <fieldset className="mt-7">
          <legend className="mb-2.5 text-sm font-semibold">
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
                  className={`min-w-14 rounded-xl border-2 px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                    checked ? "border-ink bg-ink text-paper" : "border-line bg-paper hover:border-ink/50"
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Quantity + add */}
        <div className="mt-6 flex gap-3">
          <div className="flex h-12 items-center rounded-btn border border-line bg-paper" aria-label="Quantity">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="grid h-full w-11 place-items-center disabled:opacity-40"
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
              className="grid h-full w-11 place-items-center disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-btn bg-pillar px-5 font-semibold text-white transition-colors hover:bg-pillar-dark disabled:opacity-50"
          >
            {added ? <Check className="size-5" /> : <ShoppingBag className="size-5" />}
            {added ? "Added to cart" : "Add to Cart"}
          </button>
        </div>

        <button
          type="button"
          onClick={quickOrder}
          className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-btn border-2 border-turf font-semibold text-turf transition-colors hover:bg-turf hover:text-white"
        >
          <WhatsAppIcon />
          Quick Order via WhatsApp
        </button>

        <dl className="mt-8 grid gap-4 rounded-card bg-paper p-5 text-sm sm:grid-cols-2">
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
    </div>
  );
}
