"use client";

import { updateMyProfileAction, type UserProfile } from "@/app/actions/user";
import type { Dictionary } from "@/app/dictionaries";
import { localeToCountryCode } from "@/app/data/shipping";
import type { Locale } from "@/app/i18n-config";
import { PhoneInput } from "@/component/common/PhoneInput";
import { AtSign, ArrowRight, UserRound } from "lucide-react";
import type { CountryCode } from "libphonenumber-js/min";
import Link from "next/link";
import { useActionState } from "react";

interface EditProfileFormProps {
  dict: Dictionary;
  lang: Locale;
  profile: UserProfile;
}

export function EditProfileForm({ dict, lang, profile }: EditProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateMyProfileAction, {
    ok: false,
  });

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
  const profileAfterUpdate = state.ok ? state.profile : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label htmlFor="fullName">{dict.auth.full_name}</label>
        <div className="relative">
          <UserRound
            aria-hidden="true"
            size={18}
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
          />
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            defaultValue={profileAfterUpdate ? [profileAfterUpdate.firstName, profileAfterUpdate.lastName].filter(Boolean).join(" ") : fullName}
            className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email">{dict.auth.email}</label>
        <div className="relative">
          <AtSign
            aria-hidden="true"
            size={18}
            className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={profileAfterUpdate?.email ?? profile.email ?? ""}
            className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone">{dict.auth.phone}</label>
        <PhoneInput
          id="phone"
          name="phone"
          defaultValue={profileAfterUpdate?.phone ?? profile.phone}
          defaultCountry={(localeToCountryCode[lang] as CountryCode) ?? "BD"}
          invalidMessage={`Enter a valid phone number for the selected country.`}
        />
      </div>

      {!state.ok && state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-(--color-error)">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-(--color-success)">
          Profile updated successfully.
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="group h-12 rounded-lg bg-[#0a0a0a] px-6 text-sm font-medium text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending ? (
            "Saving…"
          ) : (
            <>
              {dict.common.save}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </>
          )}
        </button>
        <Link
          href={`/${lang}/customer-profile`}
          className="text-sm font-semibold text-(--color-text-muted) hover:text-(--color-dark)"
        >
          {dict.common.cancel}
        </Link>
      </div>
    </form>
  );
}
