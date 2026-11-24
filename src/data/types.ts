export type AgeGroup = "newborn" | "toddler" | "kids" | "maternity";

export type CategorySlug =
  | "clothing"
  | "footwear"
  | "feeding-diapers"
  | "bath-care"
  | "gear-car-seats"
  | "toys-gifts"
  | "back-to-school";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  ages: AgeGroup[];
  /** Price in Ghana Cedis */
  price: number;
  /** Short tag shown on the card, e.g. "0–12M" or "EU 29–39" */
  tag: string;
  /** What the selector is choosing: size, age, stage… */
  variantLabel: string;
  variants: string[];
  images: string[];
  description: string;
  highlights: string[];
  inStock: boolean;
  /** Lower number = shown earlier under "Featured". Omit to skip featuring. */
  featuredRank?: number;
  isBundle?: boolean;
  /** ISO date the item arrived, used for "Newest" sorting */
  addedAt: string;
}

export interface Option<T extends string> {
  slug: T;
  label: string;
}
