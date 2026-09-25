"use client";

import { phoneCountries, phoneFlagUrl } from "@/app/data/phone-countries";
import { Dropdown } from "@/component/motion/Dropdown";
import { ChevronDown } from "lucide-react";
import {
  AsYouType,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js/min";
import { useMemo, useState } from "react";

interface PhoneInputProps {
  id?: string;
  name: string;
  /** Existing number in E.164 form, e.g. "+8801XXXXXXXXX". */
  defaultValue?: string;
  defaultCountry?: CountryCode;
  required?: boolean;
  invalidMessage: string;
  className?: string;
}

export function PhoneInput({
  id,
  name,
  defaultValue,
  defaultCountry = "BD",
  required,
  invalidMessage,
  className = "",
}: PhoneInputProps) {
  const parsedDefault = useMemo(
    () => (defaultValue ? parsePhoneNumberFromString(defaultValue) : undefined),
    [defaultValue],
  );

  const [country, setCountry] = useState<CountryCode>(
    (parsedDefault?.country as CountryCode | undefined) ?? defaultCountry,
  );
  const [national, setNational] = useState(
    parsedDefault?.formatNational() ?? "",
  );
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const current =
    phoneCountries.find((c) => c.code === country) ?? phoneCountries[0];

  const e164 = useMemo(() => {
    const digits = national.replace(/\D/g, "");
    if (!digits) return "";
    const formatted = new AsYouType(country).input(national);
    const number = parsePhoneNumberFromString(formatted, country);
    return number ? number.number : `${current.dialCode}${digits}`;
  }, [national, country, current.dialCode]);

  const isValid = !national.trim() || isValidPhoneNumber(e164, country);

  const handleCountrySelect = (code: string) => {
    setCountry(code as CountryCode);
    setOpen(false);
  };

  return (
    <div className={className}>
      <div className="flex h-12 items-stretch overflow-hidden rounded-lg border border-(--color-border) focus-within:border-(--color-dark)">
        <div className="relative shrink-0">
          <button
            type="button"
            aria-label="Select country code"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-full items-center gap-1.5 border-e border-(--color-border) px-3 text-sm text-(--color-text)"
          >
            <img
              src={phoneFlagUrl(current.code)}
              alt=""
              width={20}
              height={15}
              className="rounded-[2px]"
            />
            {current.dialCode}
            <ChevronDown
              size={12}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
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
            className="absolute start-0 top-full z-30 mt-1 max-h-[280px] min-w-[220px] overflow-y-auto rounded border border-(--color-border) bg-(--color-surface) py-1 shadow-xl"
          >
            {phoneCountries.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => handleCountrySelect(c.code)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-start text-sm transition-colors hover:bg-(--color-bg) ${
                  c.code === country
                    ? "font-semibold text-(--color-primary)"
                    : "text-(--color-dark)"
                }`}
              >
                <img
                  src={phoneFlagUrl(c.code)}
                  alt=""
                  width={20}
                  height={15}
                  className="rounded-[2px]"
                />
                <span className="flex-1 truncate">{c.name}</span>
                <span className="text-(--color-text-muted)">{c.dialCode}</span>
              </button>
            ))}
          </Dropdown>
        </div>

        <input
          id={id}
          type="tel"
          inputMode="tel"
          value={national}
          required={required}
          onChange={(e) =>
            setNational(new AsYouType(country).input(e.target.value))
          }
          onBlur={() => setTouched(true)}
          placeholder="1XXX-XXXXXX"
          className="h-full w-full border-0 bg-transparent px-3 text-sm shadow-none outline-none placeholder:text-(--color-text-light)"
        />
      </div>
      {touched && !isValid && (
        <p className="mt-1.5 text-xs text-(--color-error)">{invalidMessage}</p>
      )}
      <input type="hidden" name={name} value={isValid ? e164 : ""} />
    </div>
  );
}
