"use client";

import type { Dictionary } from "@/app/dictionaries";
import {
  BD_DIVISIONS,
  DELIVERY_ZONES,
  PAYMENT_METHODS,
  type DeliveryZone,
  type PaymentMethod,
} from "@/app/data/checkout";
import type { Locale } from "@/app/i18n-config";
import { useCart } from "@/component/providers/CartProvider";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import {
  AlertCircle,
  AtSign,
  Check,
  CreditCard,
  HandCoins,
  Loader2,
  LockKeyhole,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { placeOrderAction, type Order } from "@/app/actions/order";
import { OrderSuccessModal } from "./OrderSuccessModal";

interface CheckoutDetailsProps {
  dict: Dictionary;
  lang: Locale;
  initialUser?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };
}

const paymentLabel: Record<PaymentMethod, (dict: Dictionary) => string> = {
  cod: (dict) => dict.checkoutPage.cod,
  bkash: () => "bKash",
  nagad: () => "Nagad",
  card: (dict) => dict.checkoutPage.card,
};

// Each method's real brand color, so the selected state reads at a glance
// instead of every option looking the same shade of primary blue.
// Only COD is live for now; the rest render as disabled "coming soon" cards.
const AVAILABLE_PAYMENT_METHODS: readonly PaymentMethod[] = ["cod"];

const paymentColor: Record<PaymentMethod, string> = {
  cod: "#16A34A",
  bkash: "#E2136E",
  nagad: "#F5821F",
  card: "#1A56DB",
};

// bKash/Nagad aren't in any open icon set, so they get brand-colored
// wordmark badges; swap in official logo files here if you have them.
function PaymentLogo({ method }: { method: PaymentMethod }) {
  const color = paymentColor[method];

  if (method === "bkash" || method === "nagad") {
    return (
      <span
        style={{ backgroundColor: color }}
        className="flex h-10 min-w-18 items-center justify-center rounded-lg px-3 text-base font-extrabold tracking-tight text-white italic shadow-sm"
      >
        {method === "bkash" ? "bKash" : "Nagad"}
      </span>
    );
  }

  const Icon = method === "cod" ? HandCoins : CreditCard;
  return (
    <span
      style={{ backgroundColor: color }}
      className="flex size-10 items-center justify-center rounded-full text-white shadow-sm"
    >
      <Icon size={20} />
    </span>
  );
}

// Mirrors backend createOrder: 80 only for Dhaka division + Inside Dhaka,
// 150 everywhere else. The backend's figure is what's actually charged.
function deliveryFeeFor(division: string, zone: DeliveryZone): number {
  return division === "Dhaka" && zone === "Inside Dhaka" ? 80 : 150;
}

// Every label below carries this so it's unambiguous which fields the
// backend's createOrderRules actually requires vs. leaves optional.
function Required() {
  return (
    <span aria-hidden="true" className="ms-0.5 text-(--color-error)">
      *
    </span>
  );
}

function SectionHeading({
  step,
  icon: Icon,
  title,
}: {
  step: number;
  icon: typeof MapPin;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-xs font-bold text-white">
        {step}
      </span>
      <h3 className="flex items-center gap-2 text-base font-semibold text-(--color-dark)">
        <Icon size={17} className="text-(--color-primary)" />
        {title}
      </h3>
    </div>
  );
}

const CheckoutDetails = ({
  dict,
  lang,
  initialUser,
}: CheckoutDetailsProps) => {
  const { items, subtotal, clear } = useCart();
  const { format } = useCurrency();
  const router = useRouter();
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const orderPlaced = placedOrder !== null;
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const leavingRef = useRef(false);

  const [division, setDivision] = useState("");
  const [zone, setZone] = useState<DeliveryZone>("Inside Dhaka");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const deliveryFee = items.length > 0 ? deliveryFeeFor(division, zone) : 0;
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (orderPlaced || submitting) return;
    const form = new FormData(e.currentTarget);
    const field = (name: string) => String(form.get(name) ?? "").trim();

    setSubmitting(true);
    setSubmitError("");
    const result = await placeOrderAction({
      customerName: field("customerName"),
      customerPhone: field("customerPhone"),
      customerEmail: field("customerEmail"),
      shippingAddress: {
        division: field("division"),
        district: field("district"),
        upazila: field("upazila"),
        postOffice: field("postOffice"),
        postCode: field("postCode"),
        area: field("area"),
        zone,
      },
      items: items.map((item) => ({
        productId: item.productId,
        slug: item.id,
        name: item.name,
        quantity: item.qty,
      })),
      notes: field("notes"),
    });
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    // The order now exists on the backend — empty the cart right away so a
    // reload or back-navigation can't place it twice.
    clear();
    setPlacedOrder(result.order);
  };

  const leaveTo = (href: string) => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    router.push(href);
  };

  // Once placed, keep rendering the form under the popup even after the
  // cart clears, instead of flashing the empty-cart state.
  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-primary-faint) text-(--color-primary)">
          <ShoppingCart size={36} />
        </span>
        <h3>{dict.cart.empty}</h3>
        <Link href={`/${lang}`} className="btn-primary btn-pill mt-2">
          {dict.cart.empty_cta}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]"
    >
      <div className="flex flex-col gap-5">
        {/* Contact information */}
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-sm)">
          <SectionHeading step={1} icon={UserRound} title={dict.checkoutPage.contact_info} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="checkout-name">
                {dict.auth.full_name}
                <Required />
              </label>
              <div className="relative">
                <UserRound
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
                />
                <input
                  id="checkout-name"
                  name="customerName"
                  type="text"
                  autoComplete="name"
                  required
                  defaultValue={initialUser?.name ?? ""}
                  className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-phone">
                {dict.auth.phone}
                <Required />
              </label>
              <div className="relative">
                <Phone
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
                />
                <input
                  id="checkout-phone"
                  name="customerPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+880 1XXX-XXXXXX"
                  required
                  pattern="^\+?[0-9\s\-\(\)]{7,20}$"
                  title="7–15 digits, optionally starting with +"
                  defaultValue={initialUser?.phone ?? ""}
                  className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-email">{dict.auth.email}</label>
              <div className="relative">
                <AtSign
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
                />
                <input
                  id="checkout-email"
                  name="customerEmail"
                  type="email"
                  autoComplete="email"
                  defaultValue={initialUser?.email ?? ""}
                  className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-sm)">
          <SectionHeading step={2} icon={MapPin} title={dict.checkoutPage.shipping_address} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="checkout-division">
                {dict.checkoutPage.division}
                <Required />
              </label>
              <select
                id="checkout-division"
                name="division"
                required
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="h-12 rounded-lg px-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              >
                <option value="" disabled>
                  {dict.checkoutPage.division}
                </option>
                {BD_DIVISIONS.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="checkout-district">{dict.checkoutPage.district}</label>
              <input
                id="checkout-district"
                name="district"
                type="text"
                className="h-12 rounded-lg px-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-upazila">{dict.checkoutPage.upazila}</label>
              <input
                id="checkout-upazila"
                name="upazila"
                type="text"
                className="h-12 rounded-lg px-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-post-office">
                {dict.checkoutPage.post_office}
              </label>
              <input
                id="checkout-post-office"
                name="postOffice"
                type="text"
                className="h-12 rounded-lg px-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>

            <div>
              <label htmlFor="checkout-post-code">{dict.checkoutPage.post_code}</label>
              <input
                id="checkout-post-code"
                name="postCode"
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="1207"
                className="h-12 rounded-lg px-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="checkout-area">
                {dict.checkoutPage.street_address}
                <Required />
              </label>
              <textarea
                id="checkout-area"
                name="area"
                rows={2}
                required
                className="rounded-lg px-4 py-3 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2">
              {dict.checkoutPage.delivery_zone}
              <Required />
            </label>
            <div className="flex flex-wrap gap-3">
              {DELIVERY_ZONES.map((z) => {
                const selected = zone === z;
                return (
                  <label
                    key={z}
                    className={`flex cursor-pointer items-center gap-2 rounded-(--radius-md) border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                      selected
                        ? "border-(--color-primary) bg-(--color-primary-faint) text-(--color-primary) shadow-(--shadow-sm)"
                        : "border-(--color-border) text-(--color-text-muted) hover:border-(--color-primary)/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="zone"
                      value={z}
                      checked={selected}
                      onChange={() => setZone(z)}
                      className="sr-only"
                    />
                    <span
                      className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-(--color-primary) bg-(--color-primary)"
                          : "border-(--color-border)"
                      }`}
                    >
                      {selected && <Check size={10} strokeWidth={3} className="text-white" />}
                    </span>
                    {z === "Inside Dhaka"
                      ? dict.checkoutPage.inside_dhaka
                      : dict.checkoutPage.outside_dhaka}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-sm)">
          <SectionHeading step={3} icon={CreditCard} title={dict.checkoutPage.payment_method} />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PAYMENT_METHODS.map((method) => {
              const available = AVAILABLE_PAYMENT_METHODS.includes(method);
              const selected = paymentMethod === method;
              const color = paymentColor[method];
              return (
                <label
                  key={method}
                  aria-disabled={!available}
                  style={
                    selected
                      ? {
                          borderColor: color,
                          backgroundColor: `${color}14`,
                          boxShadow: `0 0 0 4px ${color}26, 0 8px 20px -6px ${color}66`,
                        }
                      : undefined
                  }
                  className={`relative flex flex-col items-center gap-2.5 rounded-(--radius-md) border-2 px-3 py-4 text-center transition-all ${
                    selected
                      ? "cursor-pointer"
                      : available
                        ? "cursor-pointer border-(--color-border) hover:bg-(--color-bg)"
                        : "cursor-not-allowed border-dashed border-(--color-border) opacity-55 grayscale"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={selected}
                    disabled={!available}
                    onChange={() => setPaymentMethod(method)}
                    className="sr-only"
                  />
                  {!available && (
                    <span className="absolute -top-2 start-1/2 -translate-x-1/2 rounded-full bg-(--color-dark) px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-white rtl:translate-x-1/2">
                      {dict.checkoutPage.coming_soon}
                    </span>
                  )}
                  {selected && (
                    <span
                      style={{ backgroundColor: color }}
                      className="absolute end-1.5 top-1.5 flex size-4 items-center justify-center rounded-full text-white"
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                  <PaymentLogo method={method} />
                  <span
                    style={selected ? { color } : undefined}
                    className={`text-xs font-semibold ${
                      selected ? "" : "text-(--color-dark)"
                    }`}
                  >
                    {paymentLabel[method](dict)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Order notes */}
        <div className="rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-sm)">
          <label htmlFor="checkout-notes" className="mb-2">
            {dict.checkoutPage.order_notes}
          </label>
          <textarea
            id="checkout-notes"
            name="notes"
            rows={3}
            placeholder={dict.checkoutPage.order_notes_placeholder}
            className="rounded-lg px-4 py-3 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
          />
        </div>
      </div>

      {/* Order summary */}
      <div className="sticky top-24 flex flex-col gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) p-5 shadow-(--shadow-sm)">
        <h3 className="text-base font-semibold text-(--color-dark)">
          {dict.checkoutPage.order_items}
        </h3>

        <div className="flex max-h-[280px] flex-col gap-3 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div
                className={`relative size-12 shrink-0 overflow-hidden rounded-(--radius-md) ${
                  item.image ? "bg-white" : `bg-linear-to-br ${item.gradient}`
                }`}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-contain p-1"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-white/90">
                    <ShoppingBag size={18} />
                  </span>
                )}
                <span className="absolute -end-1.5 -top-1.5 flex size-4.5 items-center justify-center rounded-full bg-(--color-dark) text-[10px] font-bold text-white">
                  {item.qty}
                </span>
              </div>
              <p className="line-clamp-2 flex-1 text-xs text-(--color-text-muted)">
                {item.name}
              </p>
              <span className="shrink-0 text-sm font-medium text-(--color-dark)">
                {format(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5 border-t border-(--color-border) pt-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-(--color-text-muted)">{dict.cart.subtotal}</span>
            <span className="font-medium text-(--color-dark)">{format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-(--color-text-muted)">
              {dict.checkoutPage.delivery_fee}
            </span>
            <span className="font-medium text-(--color-dark)">
              {format(deliveryFee)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-(--color-border) pt-3">
          <span className="font-semibold text-(--color-dark)">{dict.cart.total}</span>
          <span className="price text-lg">{format(total)}</span>
        </div>

        {submitError && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-(--radius-md) bg-red-50 px-3.5 py-3 text-sm font-medium text-(--color-error)"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={orderPlaced || submitting}
          aria-busy={submitting}
          className="btn-primary btn-pill inline-flex h-13 w-full items-center justify-center gap-2 text-base shadow-lg shadow-(--color-primary)/25 disabled:cursor-not-allowed disabled:opacity-80"
        >
          {submitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Package size={18} />
          )}
          {dict.checkoutPage.place_order}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-(--color-text-light)">
          <ShieldCheck size={13} />
          <LockKeyhole size={13} />
          Secure checkout · Your information is protected
        </p>
      </div>

      {placedOrder && (
        <OrderSuccessModal
          orderId={placedOrder.orderNumber}
          title={dict.checkoutPage.order_success_title}
          message={dict.checkoutPage.order_success_message}
          orderIdLabel={dict.checkoutPage.order_id}
          totalLabel={dict.cart.total}
          totalValue={format(placedOrder.total)}
          checkOrderLabel={dict.checkoutPage.check_order}
          backToHomeLabel={dict.checkoutPage.back_to_home}
          redirectingLabel={dict.checkoutPage.redirecting_home}
          onCheckOrder={() =>
            leaveTo(`/${lang}/orders?id=${encodeURIComponent(placedOrder.orderNumber)}`)
          }
          onBackHome={() => leaveTo(`/${lang}`)}
        />
      )}
    </form>
  );
};

export default CheckoutDetails;
