import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { STORE } from "@/lib/store-info";
import { CATEGORIES } from "@/data/catalog";
import { Wordmark } from "./Wordmark";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Wordmark />
          <p className="max-w-xs text-sm text-ink-soft">{STORE.tagline}. Visit us in {STORE.area}.</p>
        </div>

        <div>
          <h2 className="mb-3 font-display font-bold">Shop</h2>
          <ul className="grid gap-2 text-sm text-ink-soft">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="hover:text-ink">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display font-bold">Talk to us</h2>
          <ul className="grid gap-3 text-sm">
            <li>
              <a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-turf">
                <WhatsAppIcon className="size-4 text-turf" /> WhatsApp {STORE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`tel:${STORE.phoneTel}`} className="inline-flex items-center gap-2 hover:text-pillar">
                <Phone className="size-4 text-pillar" /> Call {STORE.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={STORE.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-ink">
                <MapPin className="size-4" /> {STORE.area} — directions
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
