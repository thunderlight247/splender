"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag, Store, Trash2, Truck, X } from "lucide-react";
import { cartCount, cartSubtotal, MAX_QTY, useCart } from "@/store/cart";
import { formatGHS } from "@/lib/format";
import { useHydrated } from "@/lib/use-hydrated";
import {
  buildOrderMessage,
  whatsappLink,
  type CheckoutDetails,
  type Fulfilment,
} from "@/lib/whatsapp";
import { WhatsAppIcon } from "./WhatsAppIcon";

type Errors = Partial<Record<"name" | "phone" | "location", string>>;

// Accepts 024 484 2137, 0244842137, +233 24 484 2137, 233244842137
const GH_PHONE = /^(?:\+?233|0)[235]\d{8}$/;

function validate(d: CheckoutDetails): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = "Enter your name so we know who the order is for.";
  if (!GH_PHONE.test(d.phone.replace(/[\s-]/g, "")))
    e.phone = "Enter a Ghana phone number, e.g. 024 123 4567.";
  if (d.fulfilment === "delivery" && d.location.trim().length < 3)
    e.location = "Add your area and a landmark so the rider can find you.";
  return e;
}

export function CartDrawer() {
  const { items, isOpen, close, setQuantity, remove, clear } = useCart();
  const hydrated = useHydrated();
  const panelRef = useRef<HTMLDivElement>(null);
  const [details, setDetails] = useState<CheckoutDetails>({
    name: "",
    phone: "",
    fulfilment: "delivery",
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const list = hydrated ? items : [];
  const count = cartCount(list);
  const subtotal = cartSubtotal(list);

  // Escape to close, lock page scroll, move focus into the drawer
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, close]);

  // A fresh drawer open after sending starts a new order view
  useEffect(() => {
    if (!isOpen) setSent(false);
  }, [isOpen]);

  const update = <K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) => {
    setDetails((d) => ({ ...d, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const completeOrder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(details);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      document.getElementById(`checkout-${first}`)?.focus();
      return;
    }
    const message = buildOrderMessage(
      list.map((i) => ({
        name: i.name,
        variantLabel: i.variantLabel,
        variant: i.variant,
        quantity: i.quantity,
        price: i.price,
      })),
      details,
    );
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={close}
        className={`absolute inset-0 bg-ink/45 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
        inert={!isOpen}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cotton shadow-2xl outline-none transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-4">
          <h2 className="font-display text-xl font-bold">
            Your cart{count > 0 && <span className="text-ink-soft"> ({count})</span>}
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid size-10 place-items-center rounded-full hover:bg-cotton"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-blush text-pillar">
              <ShoppingBag className="size-7" />
            </span>
            <p className="font-display text-lg font-semibold">Your cart is empty</p>
            <p className="text-sm text-ink-soft">
              Add a few things and send the whole order to us on WhatsApp in one message.
            </p>
            <Link
              href="/shop"
              onClick={close}
              className="mt-2 inline-flex h-11 items-center rounded-btn bg-ink px-5 text-sm font-semibold text-paper"
            >
              Browse the shop
            </Link>
          </div>
        ) : sent ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-turf text-white">
              <WhatsAppIcon className="size-8" />
            </span>
            <p className="font-display text-lg font-semibold">Your order is ready in WhatsApp</p>
            <p className="text-sm text-ink-soft">
              Press send in WhatsApp and we&apos;ll reply to confirm availability, delivery fee and payment.
              WhatsApp didn&apos;t open?{" "}
              <button type="button" onClick={() => setSent(false)} className="font-semibold text-ink underline">
                Go back and try again
              </button>
              .
            </p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clear();
                  close();
                }}
                className="inline-flex h-11 items-center rounded-btn bg-ink px-5 text-sm font-semibold text-paper"
              >
                Clear cart
              </button>
              <button
                type="button"
                onClick={close}
                className="inline-flex h-11 items-center rounded-btn border border-line bg-paper px-5 text-sm font-semibold"
              >
                Keep shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={completeOrder} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <ul className="divide-y divide-line bg-paper">
                {list.map((item) => (
                  <li key={item.key} className="flex gap-3 px-5 py-4">
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={close}
                      className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cotton"
                    >
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold leading-snug">{item.name}</p>
                        <button
                          type="button"
                          onClick={() => remove(item.key)}
                          className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-cotton hover:text-pillar"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-xs text-ink-soft">
                        {item.variantLabel}: {item.variant}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full border border-line">
                          <button
                            type="button"
                            onClick={() => setQuantity(item.key, item.quantity - 1)}
                            className="grid size-8 place-items-center rounded-full hover:bg-cotton"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(item.key, item.quantity + 1)}
                            disabled={item.quantity >= MAX_QTY}
                            className="grid size-8 place-items-center rounded-full hover:bg-cotton disabled:opacity-40"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold tabular-nums">{formatGHS(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <fieldset className="space-y-4 px-5 py-5">
                <legend className="mb-3 font-display text-lg font-bold">Your details</legend>

                <Field id="checkout-name" label="Name" error={errors.name}>
                  <input
                    id="checkout-name"
                    autoComplete="name"
                    value={details.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputClass(!!errors.name)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "checkout-name-error" : undefined}
                  />
                </Field>

                <Field id="checkout-phone" label="Phone / WhatsApp number" error={errors.phone}>
                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="024 123 4567"
                    value={details.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass(!!errors.phone)}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "checkout-phone-error" : undefined}
                  />
                </Field>

                <div role="radiogroup" aria-label="How would you like to receive your order?" className="grid grid-cols-2 gap-2">
                  <FulfilmentOption
                    value="delivery"
                    current={details.fulfilment}
                    onChange={(v) => update("fulfilment", v)}
                    icon={<Truck className="size-5" />}
                    title="Tema / Accra Delivery"
                    note="Fee confirmed on WhatsApp"
                  />
                  <FulfilmentOption
                    value="pickup"
                    current={details.fulfilment}
                    onChange={(v) => update("fulfilment", v)}
                    icon={<Store className="size-5" />}
                    title="In-Store Pickup"
                    note="Free · Community 8, Tema"
                  />
                </div>

                {details.fulfilment === "delivery" && (
                  <Field id="checkout-location" label="Delivery location / landmark" error={errors.location}>
                    <input
                      id="checkout-location"
                      autoComplete="street-address"
                      placeholder="e.g. Community 11, near Lashibi Junction"
                      value={details.location}
                      onChange={(e) => update("location", e.target.value)}
                      className={inputClass(!!errors.location)}
                      aria-invalid={!!errors.location}
                      aria-describedby={errors.location ? "checkout-location-error" : undefined}
                    />
                  </Field>
                )}

                <Field id="checkout-notes" label="Order notes (optional)">
                  <textarea
                    id="checkout-notes"
                    rows={3}
                    placeholder="Colour preference, gift wrapping, best time to deliver…"
                    value={details.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    className={`${inputClass(false)} h-auto py-2.5`}
                  />
                </Field>
              </fieldset>
            </div>

            <div className="border-t border-line bg-paper px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="mb-3 flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">Subtotal</span>
                <span className="text-xl font-bold tabular-nums">{formatGHS(subtotal)}</span>
              </div>
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-turf font-semibold text-white transition-colors hover:bg-turf-dark"
              >
                <WhatsAppIcon />
                Complete Order via WhatsApp
              </button>
              <p className="mt-2 text-center text-xs text-ink-soft">
                Pay on delivery or at pickup — cash or Mobile Money.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClass = (invalid: boolean) =>
  `h-11 w-full rounded-btn border bg-paper px-3.5 text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-ink/20 ${
    invalid ? "border-pillar" : "border-line focus:border-ink"
  }`;

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-pillar">
          {error}
        </p>
      )}
    </div>
  );
}

function FulfilmentOption({
  value,
  current,
  onChange,
  icon,
  title,
  note,
}: {
  value: Fulfilment;
  current: Fulfilment;
  onChange: (v: Fulfilment) => void;
  icon: React.ReactNode;
  title: string;
  note: string;
}) {
  const checked = value === current;
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={() => onChange(value)}
      className={`flex flex-col items-start gap-1 rounded-xl border-2 p-3 text-left transition-colors ${
        checked ? "border-ink bg-paper" : "border-line bg-paper/60 hover:border-ink/40"
      }`}
    >
      <span className={checked ? "text-pillar" : "text-ink-soft"}>{icon}</span>
      <span className="text-sm font-semibold leading-tight">{title}</span>
      <span className="text-xs text-ink-soft">{note}</span>
    </button>
  );
}
