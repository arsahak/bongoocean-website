"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { NavCategory } from "@/app/data/categories";
import { Dropdown } from "@/component/motion/Dropdown";
import { megaMenuVariants } from "@/component/motion/variants";
import type { Locale } from "@/app/i18n-config";

interface MegaMenuProps {
  category: NavCategory;
  show: boolean;
}

const badgeClass: Record<string, string> = {
  new: "badge-success",
  hot: "badge-secondary",
  sale: "badge-warning",
};

export function MegaMenu({ category, show }: MegaMenuProps) {
  const params = useParams<{ lang: Locale }>();
  const lang = params?.lang ?? "en";

  return (
    <Dropdown
      show={show}
      variants={megaMenuVariants}
      className="absolute inset-x-0 top-full z-30 border-t border-(--color-border) bg-(--color-surface) shadow-xl"
    >
      <div className="container grid grid-cols-1 gap-10 py-8 lg:grid-cols-[1fr_280px]">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {category.columns.map((column) => (
            <div key={column.title}>
              <h6 className="mb-3">{column.title}</h6>
              <div className="flex flex-col items-start gap-2.5">
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={`/${lang}${link.href}`}
                    className="inline-flex items-center gap-2 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
                  >
                    {link.label}
                    {link.badge && (
                      <span className={`badge ${badgeClass[link.badge]}`}>{link.badge}</span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between rounded-(--radius-lg) bg-(--color-primary-faint) p-6">
          <div>
            <span className="badge badge-primary">{category.label}</span>
            <h4 className="mt-3">{category.promo.title}</h4>
            <p className="mt-2 text-sm text-(--color-text-muted)">{category.promo.subtitle}</p>
          </div>
          <Link href={`/${lang}${category.promo.href}`} className="btn-primary btn-sm btn-pill mt-6 w-fit">
            {category.promo.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </Dropdown>
  );
}
