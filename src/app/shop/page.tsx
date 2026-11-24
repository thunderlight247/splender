import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopView } from "@/components/ShopView";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse baby, kids and maternity products at Splendy Mothercare & Mart, Tema. Filter by age, category and price.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-ink-soft">Loading the shop…</div>}>
      <ShopView />
    </Suspense>
  );
}
