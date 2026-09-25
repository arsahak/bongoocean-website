"use client";

import type { Order, OrderPagination, OrderStatus } from "@/app/actions/order";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { useCurrency } from "@/component/providers/CurrencyProvider";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  Loader,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

interface OrderListProps {
  dict: Dictionary;
  lang: Locale;
  orders: Order[];
  pagination: OrderPagination;
  highlightId?: string;
}

const STATUS_STYLE: Record<OrderStatus, { icon: LucideIcon; className: string }> = {
  pending: { icon: Clock, className: "bg-amber-100 text-amber-700" },
  processing: { icon: Loader, className: "bg-sky-100 text-sky-700" },
  shipped: { icon: Truck, className: "bg-indigo-100 text-indigo-700" },
  delivered: { icon: CheckCircle2, className: "bg-green-100 text-green-700" },
  cancelled: { icon: XCircle, className: "bg-red-100 text-red-700" },
};

function statusLabel(status: OrderStatus, dict: Dictionary) {
  return {
    pending: dict.orders.status_pending,
    processing: dict.orders.status_processing,
    shipped: dict.orders.status_shipped,
    delivered: dict.orders.status_delivered,
    cancelled: dict.orders.status_cancelled,
  }[status];
}

function paymentName(method: Order["paymentMethod"], dict: Dictionary) {
  if (method === "cod") return dict.checkoutPage.cod;
  if (method === "card") return dict.checkoutPage.card;
  return method === "bkash" ? "bKash" : "Nagad";
}

const OrderList = ({ dict, lang, orders, pagination, highlightId }: OrderListProps) => {
  const { format } = useCurrency();
  const highlightRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (highlightId) {
      highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId]);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-(--radius-lg) border border-(--color-border) bg-(--color-surface) px-6 py-20 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-(--color-primary-faint) text-(--color-primary)">
          <Package size={36} />
        </span>
        <h3>{dict.orders.empty}</h3>
        <Link href={`/${lang}`} className="btn-primary btn-pill mt-2">
          {dict.orders.empty_cta}
        </Link>
      </div>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(lang, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => {
        const isNew = order.orderNumber === highlightId;
        const status = STATUS_STYLE[order.orderStatus] ?? STATUS_STYLE.pending;
        const StatusIcon = status.icon;
        const address = [
          order.shippingAddress?.area,
          order.shippingAddress?.upazila,
          order.shippingAddress?.district,
          order.shippingAddress?.division,
          order.shippingAddress?.postCode,
        ]
          .filter(Boolean)
          .join(", ");

        return (
          <article
            key={order._id}
            ref={isNew ? highlightRef : undefined}
            className={`overflow-hidden rounded-(--radius-lg) border bg-(--color-surface) shadow-(--shadow-sm) ${
              isNew
                ? "border-(--color-primary) ring-4 ring-(--color-primary)/15"
                : "border-(--color-border)"
            }`}
          >
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-(--color-border) bg-(--color-bg) px-5 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-wide text-(--color-dark)">
                  {order.orderNumber}
                </span>
                {isNew && (
                  <span className="badge badge-success">{dict.orders.just_placed}</span>
                )}
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
              >
                <StatusIcon size={12} />
                {statusLabel(order.orderStatus, dict)}
              </span>
            </header>

            <div className="flex flex-col gap-3 px-5 py-4">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-(--radius-md) border border-(--color-border) bg-white">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-(--color-text-light)">
                        <ShoppingBag size={18} />
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm text-(--color-dark)">
                    {item.title}
                    <span className="ms-1.5 text-xs text-(--color-text-muted)">
                      × {item.quantity}
                    </span>
                  </p>
                  <span className="shrink-0 text-sm font-medium text-(--color-dark)">
                    {format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <footer className="grid grid-cols-1 gap-3 border-t border-(--color-border) px-5 py-4 text-sm sm:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-1.5 text-(--color-text-muted)">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} className="shrink-0 text-(--color-primary)" />
                  {dict.orders.placed_on}: {dateFormat.format(new Date(order.createdAt))}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CreditCard size={14} className="shrink-0 text-(--color-primary)" />
                  {dict.orders.payment}: {paymentName(order.paymentMethod, dict)}
                </span>
                {address && (
                  <span className="inline-flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0 text-(--color-primary)" />
                    {dict.orders.ship_to}: {address}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1 sm:items-end">
                <span className="flex w-full justify-between gap-6 text-xs text-(--color-text-muted) sm:w-auto">
                  {dict.checkoutPage.delivery_fee}
                  <span>{format(order.deliveryFee)}</span>
                </span>
                <span className="flex w-full items-baseline justify-between gap-6 sm:w-auto">
                  <span className="text-(--color-text-muted)">{dict.cart.total}</span>
                  <span className="price text-lg">{format(order.total)}</span>
                </span>
              </div>
            </footer>
          </article>
        );
      })}

      {pagination.totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-2 flex items-center justify-center gap-3 text-sm"
        >
          {pagination.hasPreviousPage ? (
            <Link
              href={`/${lang}/orders?page=${pagination.page - 1}`}
              className="inline-flex items-center gap-1 rounded-full border border-(--color-border) px-4 py-2 font-semibold transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              <ChevronLeft size={15} className="rtl:rotate-180" />
              {dict.common.back}
            </Link>
          ) : (
            <span />
          )}
          <span className="text-(--color-text-muted)">
            {pagination.page} / {pagination.totalPages}
          </span>
          {pagination.hasNextPage && (
            <Link
              href={`/${lang}/orders?page=${pagination.page + 1}`}
              className="inline-flex items-center gap-1 rounded-full border border-(--color-border) px-4 py-2 font-semibold transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
            >
              {dict.common.next}
              <ChevronRight size={15} className="rtl:rotate-180" />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
};

export default OrderList;
