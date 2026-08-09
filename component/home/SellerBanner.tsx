import { Shirt, Smartphone, Watch } from "lucide-react";
import Link from "next/link";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { FadeIn } from "@/component/motion/FadeIn";

interface SellerBannerProps {
  dict: Dictionary;
  lang: Locale;
}

export function SellerBanner({ dict, lang }: SellerBannerProps) {
  return (
    <section className="py-8 sm:py-10">
      <div className="container">
        <FadeIn className="relative overflow-hidden rounded-(--radius-2xl) bg-(--color-secondary) px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="relative z-10 text-start">
              <h2 className="text-white">Turn Your Inventory Into Income</h2>
              <p className="mt-3 max-w-md text-white/85">
                List your products and reach millions of buyers across 190+ countries.
              </p>
              <Link
                href={`/${lang}/sell`}
                className="btn-primary btn-pill mt-6 inline-flex w-fit items-center gap-2 px-6 py-3"
              >
                {dict.home.hero_cta_seller}
              </Link>
            </div>

            <div className="relative mx-auto hidden h-44 w-full max-w-sm sm:block lg:h-52">
              <div className="absolute start-[6%] top-1/2 h-28 w-28 -translate-y-1/2 -rotate-12 rounded-(--radius-xl) bg-white p-6 shadow-xl sm:h-32 sm:w-32">
                <Shirt className="h-full w-full text-(--color-primary)" strokeWidth={1.25} />
              </div>
              <div className="absolute start-1/2 top-1/2 z-10 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-(--radius-xl) bg-white p-7 shadow-2xl sm:h-36 sm:w-36">
                <Watch className="h-full w-full text-(--color-secondary)" strokeWidth={1.25} />
              </div>
              <div className="absolute end-[6%] top-1/2 h-28 w-28 -translate-y-1/2 rotate-12 rounded-(--radius-xl) bg-white p-6 shadow-xl sm:h-32 sm:w-32">
                <Smartphone className="h-full w-full text-(--color-primary)" strokeWidth={1.25} />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default SellerBanner;
