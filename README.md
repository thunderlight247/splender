# Splendy Mothercare & Mart — Online Storefront

Frontend-only storefront for Splendy Mothercare & Mart, Community 8, Tema.
Customers browse, fill a cart and send the whole order to the shop as one WhatsApp message.
There's no backend, database, login or payment gateway. Payment happens on delivery or in store.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # TypeScript only
```

Requires Node 18.18+.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Zustand (cart saved to `localStorage`) · Lucide icons.

## Where to edit things

| What | File |
| --- | --- |
| Products, prices, sizes, photos | `src/data/products.ts` |
| Age groups, categories, price ranges, sort options | `src/data/catalog.ts` |
| Phone, WhatsApp number, hours, rating, payment methods, Maps link | `src/lib/store-info.ts` |
| WhatsApp message wording | `src/lib/whatsapp.ts` |
| Colours and fonts | `src/app/globals.css`, `src/app/layout.tsx` |

**Before launch:** confirm every **price** in `products.ts` and the **opening hours** and
**payment methods** in `store-info.ts`. These are placeholders.

### Adding a product

1. Put the photo in `public/images/products/` (a square-ish `.webp` or `.jpg` works best).
2. Copy an existing entry in `src/data/products.ts`, then give it a new `id` and a unique `slug`.
3. Set `featuredRank` if it should appear in "Bestsellers & bundles" on the homepage.

## How ordering works

- **Add to Cart** saves items in the browser (they're still there after a refresh).
- **Cart drawer → Complete Order via WhatsApp** checks the name, phone (Ghana format) and
  delivery landmark. It then opens `wa.me/233244842137` with an itemised receipt.
- **Quick Order via WhatsApp** (product page and cards) sends a single-item enquiry with a link to the product.

## Project structure

```
src/
  app/            layout, homepage, /shop, /product/[slug], 404
  components/     Header, SearchBar, CartDrawer, ProductCard, ProductDetail, ShopView, Footer…
  data/           products.ts, catalog.ts, types.ts
  lib/            format (GHS), whatsapp, search, store-info, use-hydrated
  store/          cart.ts (Zustand + localStorage)
public/images/    products/ and store/ photos
```
