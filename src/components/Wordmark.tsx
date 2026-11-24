import Link from "next/link";

// Letter colours lifted from the real SPLENDY sign above the Tema shopfront
const SIGN_COLOURS = ["#1e88e5", "#e53935", "#2e9d4f", "#f08a00", "#2e7d32", "#1565c0", "#d81b60"];

export function Wordmark({ animate = false, size = "sm" }: { animate?: boolean; size?: "sm" | "lg" }) {
  const letters = "SPLENDY".split("");
  const big = size === "lg";
  return (
    <span className="inline-flex flex-col leading-none" aria-label="Splendy Mothercare & Mart">
      <span
        aria-hidden
        className={`font-display font-extrabold tracking-tight ${big ? "text-6xl sm:text-7xl" : "text-2xl"}`}
      >
        {letters.map((l, i) => (
          <span
            key={i}
            className={animate ? "letter-drop" : "inline-block"}
            style={{ color: SIGN_COLOURS[i], animationDelay: animate ? `${i * 60}ms` : undefined }}
          >
            {l}
          </span>
        ))}
      </span>
      <span
        aria-hidden
        className={`font-sans font-semibold text-ink-soft ${big ? "mt-2 text-base" : "mt-0.5 text-[0.7rem]"}`}
      >
        Mothercare &amp; Mart
      </span>
    </span>
  );
}

export function WordmarkLink() {
  return (
    <Link href="/" className="shrink-0 rounded-lg" aria-label="Splendy Mothercare & Mart — home">
      <Wordmark animate />
    </Link>
  );
}
