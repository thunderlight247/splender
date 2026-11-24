/**
 * Store details in one place. Edit here and the whole site updates.
 * ⚠ Confirm HOURS with the store — they couldn't be verified online.
 */
export const STORE = {
  name: "Splendy Mothercare & Mart",
  shortName: "Splendy",
  tagline: "For all your maternity and baby needs",
  area: "Community 8, Tema",
  city: "Tema, Greater Accra",
  phoneDisplay: "024 484 2137",
  phoneTel: "+233244842137",
  /** International format without "+" for wa.me links */
  whatsapp: "233244842137",
  mapsUrl: "https://share.google/O0PtJPI88CVrtuxVf",
  rating: 4.3,
  hours: [
    { days: "Monday – Saturday", time: "8:00am – 8:00pm" },
    { days: "Sunday", time: "12:00pm – 6:00pm" },
  ],
  payments: ["Cash", "Mobile Money (MTN, Telecel, AT)", "Bank card in store"],
} as const;
