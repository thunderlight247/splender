import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getProductBySlug, products } from "@/data/products";
import { categoryLabel } from "@/data/catalog";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: { images: [product.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.id !== product.id && (p.category === product.category || p.ages.some((a) => product.ages.includes(a))))
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 md:pt-8">
      <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
        <Link
          href={`/shop?category=${product.category}`}
          className="tap-interactive inline-flex items-center gap-1 rounded-lg py-1.5 pr-2 font-medium hover:text-ink transition-colors active:scale-95"
        >
          <ChevronLeft className="size-4" />
          {categoryLabel(product.category)}
        </Link>
      </nav>

      <ProductDetail product={product} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-16">
          <h2 id="related-heading" className="font-display text-2xl font-bold">
            You might also need
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
