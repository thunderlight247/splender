"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/types";
import { formatGHS } from "@/lib/format";
import { buildQuickOrderMessage, whatsappLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { StockBadge } from "./StockBadge";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const add = useCart((s) => s.add);
  const [variant, setVariant] = useState(product.variants[0]);
  const [added, setAdded] = useState(false);
  const selectId = useId();
  const href = `/product/${product.slug}`;

  const addToCart = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      variantLabel: product.variantLabel,
      variant,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  const orderOnWhatsApp = () => {
    const message = buildQuickOrderMessage(
      {
        name: product.name,
        variantLabel: product.variantLabel,
        variant,
        quantity: 1,
        price: product.price,
      },
      `${window.location.origin}${href}`,
    );
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-paper shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-cotton">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-paper/95 px-2.5 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-sm">
          {product.isBundle ? "Bundle" : product.tag}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <StockBadge inStock={product.inStock} />
        <h3 className="font-display text-[0.98rem] sm:text-[1.05rem] font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
          <Link href={href} className="hover:text-pillar transition-colors underline-offset-2">
            {product.name}
          </Link>
        </h3>
        <p className="text-base sm:text-lg font-bold tabular-nums text-ink">{formatGHS(product.price)}</p>

        {product.variants.length > 1 && (
          <div className="mt-0.5">
            <label htmlFor={selectId} className="sr-only">
              {product.variantLabel}
            </label>
            <select
              id={selectId}
              value={variant}
              onChange={(e) => setVariant(e.target.value)}
              className="h-9 sm:h-10 w-full rounded-xl border border-line bg-cotton px-2.5 text-base sm:text-xs font-medium text-ink transition-colors focus:border-ink focus:outline-none"
            >
              {product.variants.map((v) => (
                <option key={v} value={v}>
                  {product.variantLabel}: {v}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`tap-interactive inline-flex h-10 sm:h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-btn px-2.5 sm:px-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
              added ? "bg-turf" : "bg-pillar hover:bg-pillar-dark"
            }`}
          >
            {added ? (
              <Check className="size-4 animate-cart-pop" />
            ) : (
              <ShoppingBag className="size-4" />
            )}
            {added ? (
              "Added!"
            ) : (
              <>
                <span className="sm:hidden">Add</span>
                <span className="hidden sm:inline">Add to Cart</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={orderOnWhatsApp}
            className="tap-interactive grid size-10 sm:size-11 shrink-0 place-items-center rounded-btn bg-turf text-white shadow-sm transition-all hover:bg-turf-dark"
            aria-label={`Order ${product.name} on WhatsApp`}
            title="Order on WhatsApp"
          >
            <WhatsAppIcon className="size-4.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
