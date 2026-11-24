import { STORE } from "./store-info";
import { formatGHS } from "./format";

export type Fulfilment = "delivery" | "pickup";

export interface CheckoutDetails {
  name: string;
  phone: string;
  fulfilment: Fulfilment;
  location: string;
  notes: string;
}

export interface OrderLine {
  name: string;
  variantLabel: string;
  variant: string;
  quantity: number;
  price: number;
}

const RULE = "------------------------------";

export const FULFILMENT_LABEL: Record<Fulfilment, string> = {
  delivery: "Tema / Accra Delivery",
  pickup: "Free In-Store Pickup (Tema)",
};

/** Builds a wa.me link to the store with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Itemised receipt for the full cart checkout. */
export function buildOrderMessage(lines: OrderLine[], details: CheckoutDetails): string {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const itemCount = lines.reduce((n, l) => n + l.quantity, 0);

  const items = lines
    .map(
      (l, i) =>
        `${i + 1}. ${l.name}\n` +
        `   ${l.variantLabel}: ${l.variant}  |  Qty: ${l.quantity}\n` +
        `   ${formatGHS(l.price)} each = *${formatGHS(l.price * l.quantity)}*`,
    )
    .join("\n\n");

  const out: string[] = [
    `*${STORE.name.toUpperCase()}*`,
    `New order from the website`,
    RULE,
    items,
    RULE,
    `Items: ${itemCount}`,
    `*Subtotal: ${formatGHS(subtotal)}*`,
  ];

  if (details.fulfilment === "delivery") {
    out.push(`Delivery fee: to be confirmed`);
  }

  out.push(
    RULE,
    `*Fulfilment:* ${FULFILMENT_LABEL[details.fulfilment]}`,
  );
  if (details.fulfilment === "delivery" && details.location.trim()) {
    out.push(`*Delivery location:* ${details.location.trim()}`);
  }
  out.push(
    `*Name:* ${details.name.trim()}`,
    `*Phone:* ${details.phone.trim()}`,
  );
  if (details.notes.trim()) {
    out.push(`*Notes:* ${details.notes.trim()}`);
  }
  out.push(RULE, `Please confirm availability and payment details. Thank you!`);

  return out.join("\n");
}

/** Short enquiry for a single product from the product page or card. */
export function buildQuickOrderMessage(
  line: OrderLine,
  productUrl?: string,
): string {
  const out = [
    `Hello ${STORE.shortName}! I'd like to order:`,
    ``,
    `*${line.name}*`,
    `${line.variantLabel}: ${line.variant}  |  Qty: ${line.quantity}`,
    `Price: ${formatGHS(line.price)} each (${formatGHS(line.price * line.quantity)})`,
  ];
  if (productUrl) out.push(productUrl);
  out.push(``, `Is it available in Tema?`);
  return out.join("\n");
}
