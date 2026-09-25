import {
  ArrowRight,
  Globe,
  Package,
  ShieldCheck,
  Shirt,
  Smartphone,
  Store,
  TrendingUp,
  Truck,
  Watch,
} from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";

interface SellerBannerProps {
  dict: Dictionary;
  lang: Locale;
}

const perks = [
  { icon: Globe, label: "190+ countries" },
  { icon: ShieldCheck, label: "Secure payments" },
  { icon: Truck, label: "Worldwide delivery" },
];

// Relative heights for the decorative sales chart — rising left to right.
const chartBars = [38, 52, 44, 63, 58, 78, 92];

export function SellerBanner({ dict, lang }: SellerBannerProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn className="relative isolate overflow-hidden rounded-(--radius-2xl) bg-linear-to-br from-(--color-primary-dark) via-(--color-primary) to-(--color-secondary-dark) px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          {/* Backdrop: soft glows + a faint grid that fades out toward the edges. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-24 -top-24 -z-10 h-80 w-80 rounded-full bg-(--color-secondary) opacity-40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -start-20 -z-10 h-80 w-80 rounded-full bg-(--color-primary-light) opacity-40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          />

          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Copy */}
            <div className="text-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
                <Store aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                {dict.topbar.sell_on_bongoocean}
              </span>

              <h2 className="mt-4 text-3xl leading-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Turn Your Inventory{" "}
                <span className="whitespace-nowrap bg-linear-to-r from-(--color-secondary-light) to-white bg-clip-text text-transparent">
                  Into Income
                </span>
              </h2>
              <p className="mt-3 max-w-md text-white/80">
                List your products and reach millions of buyers across 190+
                countries.
              </p>

              <ul className="mt-6 flex list-none flex-wrap gap-2 ps-0">
                {perks.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/15"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-(--color-secondary-light)"
                    />
                    {label}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${lang}/sell`}
                className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-(--color-primary) shadow-[0_10px_30px_-8px_rgba(0,196,243,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-8px_rgba(0,196,243,0.9)]"
              >
                {dict.home.hero_cta_seller}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-primary) text-white transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  <ArrowRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 shrink-0 rtl:rotate-180"
                  />
                </span>
              </Link>
            </div>

            {/* Illustration: a glass "store dashboard" with products orbiting it. */}
            <div
              aria-hidden="true"
              className="relative mx-auto hidden h-72 w-full max-w-md sm:block lg:h-80"
            >
              {/* Dashboard card */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 rounded-(--radius-xl) border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-(--color-primary)">
                      <Store className="h-4.5 w-4.5 shrink-0" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Your Store
                      </p>
                      <p className="text-[11px] text-white/60">
                        Sales overview
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                    Live
                  </span>
                </div>

                <div className="mt-5 flex h-24 items-end gap-2">
                  {chartBars.map((height, index) => (
                    <span
                      key={index}
                      style={{ height: `${height}%` }}
                      className={`flex-1 rounded-t-md ${
                        index === chartBars.length - 1
                          ? "bg-linear-to-t from-(--color-secondary) to-white"
                          : "bg-white/25"
                      }`}
                    />
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-3 text-xs text-white/80">
                  <TrendingUp className="h-4 w-4 shrink-0 text-emerald-300" />
                  Sales growing every week
                </div>
              </div>

              {/* Floating product tiles */}
              <div className="absolute -start-1 top-2 animate-[seller-float_6s_ease-in-out_infinite]">
                <div className="flex h-16 w-16 -rotate-12 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <Shirt
                    className="h-8 w-8 shrink-0 text-(--color-primary)"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="absolute -end-1 top-6 animate-[seller-float_7s_ease-in-out_1s_infinite]">
                <div className="flex h-14 w-14 rotate-12 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <Watch
                    className="h-7 w-7 shrink-0 text-(--color-secondary-dark)"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="absolute -bottom-1 end-10 animate-[seller-float_6.5s_ease-in-out_0.5s_infinite]">
                <div className="flex h-16 w-16 rotate-6 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <Smartphone
                    className="h-8 w-8 shrink-0 text-(--color-primary)"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              {/* "New order" toast */}
              <div className="absolute bottom-3 -start-2 animate-[seller-float_5.5s_ease-in-out_1.5s_infinite]">
                <div className="flex items-center gap-2.5 rounded-xl bg-white py-2 ps-2 pe-4 shadow-xl">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-primary-faint) text-(--color-primary)">
                    <Package className="h-4 w-4 shrink-0" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0a]">
                      New order received
                    </p>
                    <p className="text-[10px] text-[#5e6470]">Just now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default SellerBanner;
