import type { AgeGroup, CategorySlug } from "./types";

export const AGE_GROUPS: {
  slug: AgeGroup;
  label: string;
  range: string;
  image: string;
  tint: string;
}[] = [
  {
    slug: "newborn",
    label: "Newborn",
    range: "0–12 months",
    image: "/images/products/rocker-bassinet.webp",
    tint: "bg-sky",
  },
  {
    slug: "toddler",
    label: "Toddler",
    range: "1–4 years",
    image: "/images/products/coral-petal-tutu.webp",
    tint: "bg-blush",
  },
  {
    slug: "kids",
    label: "Kids",
    range: "5–12 years",
    image: "/images/products/led-light-up-sneakers.webp",
    tint: "bg-[#e7f3ec]",
  },
  {
    slug: "maternity",
    label: "Maternity",
    range: "For mum",
    image: "/images/products/rhinestone-slingback-heels.webp",
    tint: "bg-[#fdf1d6]",
  },
];

export const CATEGORIES: {
  slug: CategorySlug;
  label: string;
  blurb: string;
  image: string;
}[] = [
  {
    slug: "clothing",
    label: "Clothing",
    blurb: "Tutus, party dresses, everyday tees",
    image: "/images/products/petal-tulle-party-dress.webp",
  },
  {
    slug: "footwear",
    label: "Footwear",
    blurb: "Light-ups, sandals, shoes for mum",
    image: "/images/products/rainbow-glitter-sandals.webp",
  },
  {
    slug: "feeding-diapers",
    label: "Feeding & Diapers",
    blurb: "Formula, high chairs, bottles",
    image: "/images/products/foldable-high-chair.webp",
  },
  {
    slug: "bath-care",
    label: "Bath & Care",
    blurb: "Foldable tubs and bath sets",
    image: "/images/products/foldable-bath-set.webp",
  },
  {
    slug: "gear-car-seats",
    label: "Gear & Car Seats",
    blurb: "Car seats, cots, walkers, rockers",
    image: "/images/products/convertible-car-seat.webp",
  },
  {
    slug: "toys-gifts",
    label: "Toys & Gifts",
    blurb: "Ride-ons and cuddly seats",
    image: "/images/products/electric-ride-on-jeep.webp",
  },
  {
    slug: "back-to-school",
    label: "Back-to-School",
    blurb: "Flasks and water bottles",
    image: "/images/products/kids-flasks.webp",
  },
];

export const PRICE_RANGES: { slug: string; label: string; min: number; max: number }[] = [
  { slug: "under-200", label: "Under GHS 200", min: 0, max: 199.99 },
  { slug: "200-500", label: "GHS 200 – 500", min: 200, max: 500 },
  { slug: "500-1000", label: "GHS 500 – 1,000", min: 500.01, max: 1000 },
  { slug: "over-1000", label: "Over GHS 1,000", min: 1000.01, max: Number.POSITIVE_INFINITY },
];

export const SORTS = [
  { slug: "featured", label: "Featured" },
  { slug: "price-asc", label: "Price: Low to High" },
  { slug: "newest", label: "Newest" },
] as const;

export type SortSlug = (typeof SORTS)[number]["slug"];

export const ageLabel = (slug: AgeGroup) =>
  AGE_GROUPS.find((a) => a.slug === slug)?.label ?? slug;

export const categoryLabel = (slug: CategorySlug) =>
  CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
