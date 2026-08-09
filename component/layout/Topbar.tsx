import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import { HelpCircle, Store, Truck } from "lucide-react";
import Link from "next/link";

interface TopbarProps {
  dict: Dictionary;
  lang: Locale;
}

const Topbar = ({ dict, lang }: TopbarProps) => {
  return (
    <div className="hidden bg-(--color-primary) text-white sm:block">
      <div className="container flex items-center justify-between gap-4 py-2 text-xs">
        <p className="truncate text-white/80">{dict.topbar.welcome}</p>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href={`/${lang}/orders/track`}
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white md:flex"
          >
            <Truck size={14} />
            {dict.topbar.track_order}
          </Link>
          <Link
            href={`/${lang}/sell`}
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white lg:flex"
          >
            <Store size={14} />
            {dict.topbar.sell_on_xindamart}
          </Link>
          <Link
            href={`/${lang}/help`}
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white md:flex"
          >
            <HelpCircle size={14} />
            {dict.topbar.help_center}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
