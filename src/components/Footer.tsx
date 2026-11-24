import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { STORE } from "@/lib/store-info";
import { CATEGORIES } from "@/data/catalog";
import { Wordmark } from "./Wordmark";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="mt-16 md:mt-20 border-t border-line bg-paper pb-16 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 sm:gap-10 px-4 py-10 sm:py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3 sm:space-y-4">
          <Wordmark />
          <p className="max-w-xs text-sm text-ink-soft leading-relaxed">{STORE.tagline}. Visit us in {STORE.area}.</p>
        </div>

        <div>
          <h2 className="mb-3 font-display font-bold text-ink">Shop</h2>
          <ul className="grid gap-2 text-sm text-ink-soft">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="tap-interactive inline-block py-1 hover:text-ink transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display font-bold text-ink">Talk to us</h2>
          <ul className="grid gap-2.5 text-sm">
            <li>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="tap-interactive inline-flex items-center gap-2 py-1 text-ink hover:text-turf transition-colors">
                <WhatsAppIcon className="size-4.5 text-turf shrink-0" /> WhatsApp {STORE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:${STORE.phoneTel}`} className="tap-interactive inline-flex items-center gap-2 py-1 text-ink hover:text-pillar transition-colors">
                <Phone className="size-4.5 text-pillar shrink-0" /> Call {STORE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="tap-interactive inline-flex items-center gap-2 py-1 text-ink-soft hover:text-ink transition-colors">
                <MapPin className="size-4.5 text-pillar shrink-0" /> {STORE.area} — directions
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-line px-4 py-5 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {STORE.name}, {STORE.city}. Prices in Ghana Cedis.
      </p>
    </footer>
  );
}
