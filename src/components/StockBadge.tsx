export function StockBadge({ inStock }: { inStock: boolean }) {
  return inStock ? (
    <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-turf">
      <span className="size-2 rounded-full bg-turf" aria-hidden />
      In Stock in Tema
    </span>
  ) : (
    <span className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-ink-soft">
      <span className="size-2 rounded-full bg-ink-soft" aria-hidden />
      Out of stock — ask on WhatsApp
    </span>
  );
}
