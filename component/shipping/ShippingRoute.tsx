"use client";

import {
  defaultShippingDestination,
  shippingDestinationByCountry,
  shippingHub,
  type ShippingMethod,
} from "@/app/data/shipping";
import { getDirection, type Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";
import { motion } from "framer-motion";
import {
  PackageCheck,
  Plane,
  ShieldCheck,
  Ship,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface ShippingRouteProps {
  lang: Locale;
  /** Visitor's real country (ISO-3166 alpha-2), resolved server-side. */
  countryCode: string;
}

const stats = [
  { icon: Truck, label: "Dispatched from China within 24h" },
  { icon: ShieldCheck, label: "Buyer protection on every order" },
  { icon: PackageCheck, label: "Real-time tracking, door to door" },
];

const TRACKING_STAGES = [
  "Order Packed",
  "Departed Hub",
  "In Transit",
  "Customs Clearance",
  "Out for Delivery",
];
const TRACKING_STEP_MS = 2200;

interface MethodRouteProps {
  icon: LucideIcon;
  methodLabel: string;
  method: ShippingMethod;
  originFlag: string;
  destFlag: string;
  destName: string;
  dir: "ltr" | "rtl";
  speedSec: number;
}

function MethodRoute({
  icon: Icon,
  methodLabel,
  method,
  originFlag,
  destFlag,
  destName,
  dir,
  speedSec,
}: MethodRouteProps) {
  const moveKey = dir === "rtl" ? "right" : "left";

  return (
    <div className="rounded-(--radius-xl) border border-(--color-border) p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--color-dark)">
          <Icon size={16} className="text-(--color-primary)" />
          {methodLabel}
        </span>
        <span className="badge badge-primary">{method.days} days</span>
      </div>

      <div className="relative mt-5 h-0.5 rounded-full bg-(--color-border)">
        <span className="absolute start-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-text-light) ring-4 ring-(--color-surface)" />
        <motion.div
          className="absolute top-1/2 -translate-y-1/2"
          initial={{ [moveKey]: "0%" }}
          animate={{ [moveKey]: "96%" }}
          transition={{ duration: speedSec, repeat: Infinity, ease: "linear" }}
        >
          <Icon
            size={14}
            className={`text-(--color-primary) ${dir === "rtl" ? "" : "-scale-x-100"}`}
          />
        </motion.div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[0.6875rem] text-(--color-text-muted)">
        <span className="shrink-0">
          {originFlag} {shippingHub.name}
        </span>
        <span className="truncate px-2 text-center">{method.hub}</span>
        <span className="shrink-0">
          {destFlag} {destName}
        </span>
      </div>
    </div>
  );
}

function TrackingStepper() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((i) => (i + 1) % TRACKING_STAGES.length),
      TRACKING_STEP_MS,
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative mt-6 flex items-start justify-between border-t border-(--color-border) pt-6">
      <div
        className="absolute inset-x-6 top-[31px] h-px bg-(--color-border)"
        aria-hidden="true"
      />
      {TRACKING_STAGES.map((stage, i) => (
        <div
          key={stage}
          className="relative z-10 flex flex-1 flex-col items-center gap-1.5 text-center"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i <= active ? "bg-(--color-primary)" : "bg-(--color-border)"
            }`}
          />
          <span
            className={`text-[0.625rem] leading-tight transition-colors ${
              i === active
                ? "font-semibold text-(--color-dark)"
                : "text-(--color-text-muted)"
            }`}
          >
            {stage}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ShippingRoute({ lang, countryCode }: ShippingRouteProps) {
  const dir = getDirection(lang);
  const destination =
    shippingDestinationByCountry[countryCode] ?? defaultShippingDestination;
  const isDomestic = destination.name === shippingHub.name;

  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn>
          <h2 className="section-title">Worldwide Shipping</h2>
          <p className="section-subtitle mt-1">
            Tracked from our main hub straight to your door.
          </p>
        </FadeIn>

        <FadeIn
          delay={0.05}
          className="mt-6 overflow-hidden rounded-(--radius-2xl) border border-(--color-border) bg-(--color-surface) p-6 sm:p-8"
        >
          {isDomestic ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-5xl">{shippingHub.flag}</span>
              <h3 className="mt-1">Fast Domestic Delivery</h3>
              <p className="max-w-sm text-sm text-(--color-text-muted)">
                You&apos;re shopping from {shippingHub.name} — orders ship
                straight from our local hub, no border crossings.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodRoute
                icon={Plane}
                methodLabel="By Air"
                method={destination.air}
                originFlag={shippingHub.flag}
                destFlag={destination.flag}
                destName={destination.name}
                dir={dir}
                speedSec={2.2}
              />
              <MethodRoute
                icon={Ship}
                methodLabel="By Sea"
                method={destination.sea}
                originFlag={shippingHub.flag}
                destFlag={destination.flag}
                destName={destination.name}
                dir={dir}
                speedSec={4}
              />
            </div>
          )}

          <TrackingStepper />

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-(--color-border) pt-6 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-primary-faint) text-(--color-primary)">
                  <stat.icon size={16} />
                </span>
                <p className="text-sm text-(--color-text-muted)">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default ShippingRoute;
