"use client";

import { navCategories } from "@/app/data/categories";
import type { Dictionary } from "@/app/dictionaries";
import { getDirection, type Locale } from "@/app/i18n-config";
import { CurrencySwitcher } from "@/component/common/CurrencySwitcher";
import { LanguageSwitcher } from "@/component/common/LanguageSwitcher";
import { Dropdown } from "@/component/motion/Dropdown";
import { MobileDrawer } from "@/component/motion/MobileDrawer";
import { megaMenuVariants } from "@/component/motion/variants";
import {
  Camera,
  ChevronDown,
  Heart,
  LayoutGrid,
  Menu,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  dict: Dictionary;
}

const Navbar = ({ dict }: NavbarProps) => {
  const params = useParams<{ lang: Locale }>();
  const lang = params?.lang ?? "en";
  const dir = getDirection(lang);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [activeShopCategory, setActiveShopCategory] = useState(
    navCategories[0].label,
  );

  const activeCategory =
    navCategories.find((category) => category.label === activeShopCategory) ??
    navCategories[0];

  return (
    <header className="sticky top-0 z-40 bg-(--color-surface) shadow-(--shadow-sm)">
      {/* Main row: logo, search, actions */}
      <div className="container flex items-center gap-3 py-3">
        <button
          type="button"
          aria-label="Open menu"
          className="btn-ghost !p-2 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Link
          href={`/${lang}`}
          className="shrink-0 font-[family-name:var(--font-heading)] text-xl font-extrabold tracking-tight text-(--color-primary) sm:text-2xl"
        >
          Xinda<span className="text-(--color-secondary)">mart</span>
        </Link>

        <button
          type="button"
          aria-label="Browse categories"
          onClick={() => setShopMenuOpen((open) => !open)}
          className="btn-ghost hidden !p-2 sm:flex"
        >
          <LayoutGrid size={20} />
        </button>

        <Link
          href={`/product`}
          className="hidden shrink-0 text-sm font-semibold text-(--color-text) transition-colors hover:text-(--color-primary) sm:inline-flex"
        >
          Shop
        </Link>

        <form role="search" className="hidden flex-1 items-center md:flex">
          <label htmlFor="navbar-search" className="sr-only">
            {dict.common.search}
          </label>
          <div className="flex h-[46px] w-full items-stretch overflow-hidden rounded-full border border-(--color-border) bg-(--color-bg) shadow-(--shadow-sm) transition-all focus-within:border-(--color-primary) focus-within:bg-(--color-surface) focus-within:shadow-[0_0_0_3px_var(--color-primary-faint)]">
            <label
              htmlFor="navbar-image-search"
              aria-label="Search by image"
              title="Search by image"
              className="flex h-full w-[50px] shrink-0 cursor-pointer items-center justify-center bg-(--color-border) text-(--color-text-muted) transition-colors hover:bg-(--color-primary-faint) hover:text-(--color-primary)"
            >
              <Camera size={20} />
            </label>
            <input
              id="navbar-image-search"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <input
              id="navbar-search"
              type="search"
              placeholder={dict.common.search}
              className="w-full min-w-0 border-0 bg-transparent px-3 py-3 text-sm shadow-none outline-none placeholder:text-(--color-text-light)"
            />
            <button
              type="submit"
              className="btn-primary me-1.5 shrink-0 self-center rounded-full px-5"
            >
              Search
            </button>
          </div>
        </form>

        <div className="hidden items-center gap-1 self-center sm:flex">
          <LanguageSwitcher />
          <CurrencySwitcher />
        </div>

        <div
          className="hidden h-5 w-px shrink-0 self-center bg-(--color-border) sm:block"
          aria-hidden="true"
        />

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <Link
            href={`/${lang}/wishlist`}
            aria-label={dict.nav.wishlist}
            className="btn-ghost hidden !p-2 sm:flex rounded"
          >
            <Heart size={20} />
          </Link>

          <Link
            href={`/${lang}/cart`}
            aria-label={dict.nav.cart}
            className="btn-ghost relative !p-2 rounded"
          >
            <ShoppingCart size={20} />
            <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-(--color-secondary) text-[9px] font-bold text-white">
              0
            </span>
          </Link>

          <Link
            href={`/${lang}/sign-in`}
            aria-label={dict.nav.account}
            className="btn-ghost hidden !p-2 sm:flex rounded"
          >
            <User size={20} />
          </Link>
        </div>
      </div>

      {/* Category mega menu — full width, toggled by the grid icon */}
      {shopMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setShopMenuOpen(false)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      <Dropdown
        show={shopMenuOpen}
        variants={megaMenuVariants}
        className="absolute inset-x-0 top-full z-30 border-t border-(--color-border) bg-(--color-surface) shadow-xl"
      >
        <div className="container grid grid-cols-[220px_1fr] gap-8 py-6">
          <div className="flex max-h-[420px] flex-col gap-1 overflow-y-auto border-e border-(--color-border) pe-4">
            {navCategories.map((category) => (
              <button
                key={category.label}
                type="button"
                onMouseEnter={() => setActiveShopCategory(category.label)}
                onClick={() => setActiveShopCategory(category.label)}
                className={`flex items-center gap-2.5 rounded-(--radius-md) px-3 py-2 text-start text-sm font-medium transition-colors ${
                  activeShopCategory === category.label
                    ? "bg-(--color-primary) text-white"
                    : "text-(--color-dark) hover:bg-(--color-bg)"
                }`}
              >
                <category.icon size={16} className="shrink-0" />
                <span className="truncate">{category.label}</span>
              </button>
            ))}
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {activeCategory.columns.map((column) => (
                <div key={column.title}>
                  <h6 className="mb-2.5">{column.title}</h6>
                  <div className="flex flex-col items-start gap-2">
                    {column.links.map((link) => (
                      <Link
                        key={link.href}
                        href={`/${lang}${link.href}`}
                        onClick={() => setShopMenuOpen(false)}
                        className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Dropdown>

      {/* Mobile drawer */}
      <MobileDrawer
        show={mobileOpen}
        onClose={() => setMobileOpen(false)}
        side={dir === "rtl" ? "right" : "left"}
      >
        <div className="flex items-center justify-between border-b border-(--color-border) p-4">
          <Link
            href={`/${lang}`}
            onClick={() => setMobileOpen(false)}
            className="font-[family-name:var(--font-heading)] text-xl font-extrabold tracking-tight text-(--color-primary)"
          >
            Xinda<span className="text-(--color-secondary)">mart</span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            className="btn-ghost !p-2"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <form role="search" className="flex items-center p-4">
          <label htmlFor="mobile-search" className="sr-only">
            {dict.common.search}
          </label>
          <div className="flex h-[46px] w-full items-stretch overflow-hidden rounded-full border border-(--color-border) bg-(--color-bg) shadow-(--shadow-sm) transition-all focus-within:border-(--color-primary) focus-within:bg-(--color-surface) focus-within:shadow-[0_0_0_3px_var(--color-primary-faint)]">
            <label
              htmlFor="mobile-image-search"
              aria-label="Search by image"
              title="Search by image"
              className="flex h-full w-[50px] shrink-0 cursor-pointer items-center justify-center bg-(--color-border) text-(--color-text-muted) transition-colors hover:bg-(--color-primary-faint) hover:text-(--color-primary)"
            >
              <Camera size={20} />
            </label>
            <input
              id="mobile-image-search"
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
            />
            <input
              id="mobile-search"
              type="search"
              placeholder={dict.common.search}
              className="w-full min-w-0 border-0 bg-transparent px-3 py-3 text-sm shadow-none outline-none placeholder:text-(--color-text-light)"
            />
            <button
              type="submit"
              className="btn-primary me-1.5 shrink-0 self-center rounded-full px-5"
            >
              Search
            </button>
          </div>
        </form>

        <nav className="flex flex-col gap-1 px-2 pb-4">
          <Link
            href={`/${lang}`}
            onClick={() => setMobileOpen(false)}
            className="rounded-(--radius-md) px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-bg)"
          >
            {dict.nav.home}
          </Link>

          {navCategories.map((category) => (
            <details key={category.label} className="group">
              <summary className="flex list-none items-center justify-between rounded-(--radius-md) border-0 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-bg)">
                {category.label}
                <ChevronDown
                  size={16}
                  className="transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="flex flex-col gap-0.5 py-1 ps-6">
                {category.columns
                  .flatMap((column) => column.links)
                  .slice(0, 6)
                  .map((link) => (
                    <Link
                      key={link.href}
                      href={`/${lang}${link.href}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-(--radius-md) px-3 py-2 text-sm text-(--color-text-muted) transition-colors hover:bg-(--color-bg) hover:text-(--color-primary)"
                    >
                      {link.label}
                    </Link>
                  ))}
              </div>
            </details>
          ))}

          <Link
            href={`/${lang}/deals`}
            onClick={() => setMobileOpen(false)}
            className="rounded-(--radius-md) px-3 py-2.5 text-sm font-semibold text-(--color-secondary) transition-colors hover:bg-(--color-bg)"
          >
            {dict.nav.deals}
          </Link>
          <Link
            href={`/${lang}/sellers`}
            onClick={() => setMobileOpen(false)}
            className="rounded-(--radius-md) px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--color-bg)"
          >
            {dict.nav.sellers}
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-(--color-border) p-4">
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/${lang}/wishlist`}
              onClick={() => setMobileOpen(false)}
              className="btn-outline btn-sm"
            >
              <Heart size={16} />
              {dict.nav.wishlist}
            </Link>
            <Link
              href={`/${lang}/cart`}
              onClick={() => setMobileOpen(false)}
              className="btn-outline btn-sm"
            >
              <ShoppingCart size={16} />
              {dict.nav.cart}
            </Link>
          </div>
          <Link
            href={`/${lang}/sign-in`}
            onClick={() => setMobileOpen(false)}
            className="btn-primary btn-sm"
          >
            <User size={16} />
            {dict.nav.sign_in}
          </Link>
        </div>
      </MobileDrawer>
    </header>
  );
};

export default Navbar;
