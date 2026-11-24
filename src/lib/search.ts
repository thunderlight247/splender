import type { Product } from "@/data/types";
import { ageLabel, categoryLabel } from "@/data/catalog";

/** Simple client-side search: every word must appear somewhere in the product. */
export function searchProducts(list: Product[], query: string): Product[] {
  const words = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return list;
  return list.filter((p) => {
    const haystack = [
      p.name,
      p.description,
      p.tag,
      categoryLabel(p.category),
      ...p.ages.map(ageLabel),
      ...p.variants,
      p.isBundle ? "bundle" : "",
    ]
      .join(" ")
      .toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}
