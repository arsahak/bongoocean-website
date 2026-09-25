"use client";

import { signoutAction } from "@/app/actions/auth";
import type { Dictionary } from "@/app/dictionaries";
import { formatPhoneDisplay } from "@/app/data/phone-countries";
import type { Locale } from "@/app/i18n-config";
import { Dropdown } from "@/component/motion/Dropdown";
import { LogOut, Package, Settings, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    image?: string | null;
  };
  lang: Locale;
  dict: Dictionary;
  className?: string;
}

export function UserMenu({ user, lang, dict, className = "" }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const displayPhone = user.phone ? formatPhoneDisplay(user.phone) : "";
  const displayName = user.name?.trim() || user.email || displayPhone || "";
  const contact = user.email || displayPhone || "";
  const initial = displayName.charAt(0).toUpperCase() || "?";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        aria-label={dict.nav.account}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost flex !p-2 items-center gap-1.5 rounded"
      >
        {user.image ? (
          <img
            src={user.image}
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-(--color-primary) text-sm font-bold text-white">
            {initial}
          </span>
        )}
      </button>

      {open && (
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 cursor-default"
        />
      )}

      <Dropdown
        show={open}
        className="absolute end-0 top-full z-30 mt-2 min-w-[190px] overflow-hidden rounded-(--radius-md) border border-(--color-border) bg-(--color-surface) py-1 text-(--color-dark) shadow-xl"
      >
        {displayName && (
          <div className="border-b border-(--color-border) px-3.5 py-2.5">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            {contact && contact !== displayName && (
              <p className="truncate text-xs text-(--color-text-muted)">
                {contact}
              </p>
            )}
          </div>
        )}
        {/* <Link
          href={`/${lang}/account`}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-(--color-bg)"
        >
          <User size={15} />
          {dict.nav.profile}
        </Link> */}
        <Link
          href={`/${lang}/orders`}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-(--color-bg)"
        >
          <Package size={15} />
          {dict.nav.orders}
        </Link>
        {/* <Link
          href={`/${lang}/account/settings`}
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors hover:bg-(--color-bg)"
        >
          <Settings size={15} />
          {dict.nav.settings}
        </Link> */}
        <div className="my-1 border-t border-(--color-border)" />
        <form action={signoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-start text-sm text-(--color-error) transition-colors hover:bg-(--color-bg)"
          >
            <LogOut size={15} />
            {dict.nav.sign_out}
          </button>
        </form>
      </Dropdown>
    </div>
  );
}
