import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-extrabold">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-ink-soft">
        The product may have sold out or moved. Browse the shop, or ask us on WhatsApp and we&apos;ll check the shelves.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex h-12 items-center rounded-btn bg-pillar px-6 font-semibold text-white hover:bg-pillar-dark"
      >
        Browse the shop
      </Link>
    </div>
  );
}
