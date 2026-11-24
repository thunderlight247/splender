import Image from "next/image";
import Link from "next/link";
import { Accessibility, Clock, CreditCard, MapPin, Star, Store, Truck } from "lucide-react";
import { AGE_GROUPS, CATEGORIES } from "@/data/catalog";
import { featuredProducts, products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { STORE } from "@/lib/store-info";

export default function HomePage() {
  const featured = featuredProducts();
  const countByCategory = (slug: string) => products.filter((p) => p.category === slug).length;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="mx-auto max-w-6xl px-4 pt-5 md:pt-10">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr] md:gap-10">
          <div className="order-2 md:order-1">
            <h1 className="font-display text-[2.35rem] font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Everything for baby and mum, under one roof in Tema.
            </h1>
            <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
              Car seats, cots, party dresses and hospital bags from our shop in {STORE.area}. Order on
              WhatsApp and we&apos;ll deliver the same day, or collect it free in store.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop?sort=newest"
                className="inline-flex h-12 items-center rounded-btn bg-pillar px-6 font-semibold text-white transition-colors hover:bg-pillar-dark"
              >
                Shop New Arrivals
              </Link>
              <Link
                href="/shop?q=bundle"
                className="inline-flex h-12 items-center rounded-btn border-2 border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-paper"
              >
                Hospital Bag Bundles
              </Link>
            </div>
            <ul className="mt-7 grid gap-2.5 text-sm font-medium sm:grid-cols-3 sm:gap-4">
              <li className="flex items-center gap-2">
                <Truck className="size-4.5 text-pillar" /> Same-day delivery, Tema &amp; Accra
              </li>
              <li className="flex items-center gap-2">
                <Store className="size-4.5 text-pillar" /> Free in-store pickup
              </li>
              <li className="flex items-center gap-2">
                <WhatsAppIcon className="size-4.5 text-turf" /> Order in one message
              </li>
            </ul>
          </div>

          <figure className="order-1 md:order-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] bg-sky md:aspect-[4/3.2]">
              <Image
                src="/images/store/storefront.webp"
                alt="The Splendy Mothercare & Mart shopfront in Tema, with children's clothes in every window"
                fill
                priority
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 flex items-center gap-1.5 text-xs text-ink-soft">
              <MapPin className="size-3.5" /> Our shop, {STORE.area}
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ───────── Shop by age ───────── */}
      <section aria-labelledby="age-heading" className="mx-auto mt-14 max-w-6xl md:mt-20">
        <h2 id="age-heading" className="px-4 font-display text-2xl font-bold sm:text-3xl">
          Shop by age
        </h2>
        <ul className="no-scrollbar mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 md:grid md:grid-cols-4 md:overflow-visible">
          {AGE_GROUPS.map((a) => (
            <li key={a.slug} className="w-[42%] shrink-0 snap-start sm:w-[30%] md:w-auto">
              <Link
                href={`/shop?age=${a.slug}`}
                className={`flex h-full flex-col items-center gap-3 rounded-card p-4 text-center transition-transform active:scale-[0.98] ${a.tint}`}
              >
                <span className="relative size-24 overflow-hidden rounded-full bg-paper ring-4 ring-paper sm:size-28">
                  <Image src={a.image} alt="" fill sizes="112px" className="object-cover" />
                </span>
                <span>
                  <span className="block font-display text-lg font-bold">{a.label}</span>
                  <span className="block text-sm text-ink-soft">{a.range}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Shop by category ───────── */}
      <section aria-labelledby="cat-heading" className="mx-auto mt-14 max-w-6xl px-4 md:mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 id="cat-heading" className="font-display text-2xl font-bold sm:text-3xl">
            Shop by category
          </h2>
          <Link href="/shop" className="text-sm font-semibold text-pillar hover:underline">
            View all
          </Link>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <li key={c.slug} className={i === 0 ? "col-span-2 sm:col-span-1 lg:col-span-2 lg:row-span-2" : ""}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative flex h-full min-h-40 flex-col justify-end overflow-hidden rounded-card bg-ink p-4 text-white"
              >
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <span className="relative">
                  <span className={`block font-display font-bold ${i === 0 ? "text-2xl lg:text-3xl" : "text-lg"}`}>
                    {c.label}
                  </span>
                  <span className="block text-sm text-white/85">{c.blurb}</span>
                  <span className="mt-1 block text-xs text-white/70">
                    {countByCategory(c.slug)} {countByCategory(c.slug) === 1 ? "item" : "items"}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────── Featured ───────── */}
      <section id="bestsellers" aria-labelledby="feat-heading" className="mx-auto mt-14 max-w-6xl px-4 md:mt-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="feat-heading" className="font-display text-2xl font-bold sm:text-3xl">
              Bestsellers &amp; bundles
            </h2>
            <p className="mt-1 text-sm text-ink-soft">What Tema parents are picking up this month.</p>
          </div>
          <Link href="/shop" className="shrink-0 text-sm font-semibold text-pillar hover:underline">
            Shop all
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      {/* ───────── Store trust & info ───────── */}
      <section aria-labelledby="visit-heading" className="mx-auto mt-14 max-w-6xl px-4 md:mt-20">
        <div className="overflow-hidden rounded-[1.75rem] bg-ink text-paper">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="p-6 sm:p-10">
              <h2 id="visit-heading" className="font-display text-3xl font-bold sm:text-4xl">
                Come and see it in person
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <span className="flex" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className={`size-5 ${i < Math.round(STORE.rating) ? "fill-sun text-sun" : "text-paper/30"}`}
                    />
                  ))}
                </span>
                <span className="font-semibold">
                  {STORE.rating.toFixed(1)} out of 5 from local shoppers
                </span>
              </div>

              <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="flex gap-3">
                  <Accessibility className="mt-0.5 size-5 shrink-0 text-sun" />
                  <div>
                    <dt className="font-semibold">Wheelchair accessible</dt>
                    <dd className="mt-0.5 text-sm text-paper/75">
                      Wheelchair-accessible entrance — easy with a pram too.
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CreditCard className="mt-0.5 size-5 shrink-0 text-sun" />
                  <div>
                    <dt className="font-semibold">Pay in store or on delivery</dt>
                    <dd className="mt-0.5 text-sm text-paper/75">{STORE.payments.join(", ")}.</dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-sun" />
                  <div>
                    <dt className="font-semibold">Opening hours</dt>
                    {STORE.hours.map((h) => (
                      <dd key={h.days} className="mt-0.5 text-sm text-paper/75">
                        {h.days}: {h.time}
                      </dd>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-sun" />
                  <div>
                    <dt className="font-semibold">Find us</dt>
                    <dd className="mt-0.5 text-sm text-paper/75">{STORE.area}, {STORE.city}</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={STORE.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-btn bg-paper px-5 font-semibold text-ink hover:bg-cotton"
                >
                  <MapPin className="size-4.5" /> Get directions
                </a>
                <a
                  href={`https://wa.me/${STORE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-btn bg-turf px-5 font-semibold text-white hover:bg-turf-dark"
                >
                  <WhatsAppIcon className="size-4.5" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1.5 lg:p-2">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-2xl">
                <Image
                  src="/images/store/shoes-and-dresses.webp"
                  alt="Inside Splendy: racks of children's shoes and party dresses on green turf flooring"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="/images/store/baby-foods-aisle.webp"
                  alt="The baby foods and toiletries aisle"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="/images/store/clothing-floor.webp"
                  alt="The clothing floor with rails of kids' outfits"
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
