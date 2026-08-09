"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useParams } from "next/navigation";
import {
  baseCurrency as defaultBaseCurrency,
  isCurrencyCode,
  localeCurrencyMap,
  type CurrencyCode,
} from "@/app/currency-config";
import type { Locale } from "@/app/i18n-config";

interface RatesResponse {
  base: string;
  rates: Record<string, number>;
  updatedAt: string;
  source: "live" | "fallback";
}

interface CurrencyContextValue {
  /** Currency the visitor sees prices in. */
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Currency that product prices are stored/entered in (admin-configured). */
  baseCurrency: string;
  rates: Record<string, number>;
  ratesUpdatedAt: string | null;
  ratesSource: "live" | "fallback" | "loading";
  /** Convert an amount from the base currency into the selected currency. */
  convert: (amountInBase: number) => number;
  /** Convert + format an amount from the base currency for display. */
  format: (amountInBase: number) => string;
}

const STORAGE_KEY = "xindamart-currency";

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const params = useParams<{ lang: Locale }>();
  const lang = params?.lang ?? "en";

  const [currency, setCurrencyState] = useState<CurrencyCode>(defaultBaseCurrency);
  const [rates, setRates] = useState<Record<string, number>>({
    [defaultBaseCurrency]: 1,
  });
  const [base, setBase] = useState<string>(defaultBaseCurrency);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [source, setSource] = useState<"live" | "fallback" | "loading">("loading");

  // Pick initial currency: stored preference, else locale default.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isCurrencyCode(stored)) {
      setCurrencyState(stored);
      return;
    }
    const localeDefault = localeCurrencyMap[lang];
    if (localeDefault) setCurrencyState(localeDefault);
  }, [lang]);

  // Load latest exchange rates (admin base currency -> all currencies).
  useEffect(() => {
    let cancelled = false;

    fetch("/api/exchange-rates")
      .then((res) => res.json())
      .then((data: RatesResponse) => {
        if (cancelled) return;
        setRates(data.rates);
        setBase(data.base);
        setUpdatedAt(data.updatedAt);
        setSource(data.source);
      })
      .catch(() => {
        if (!cancelled) setSource("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    localStorage.setItem(STORAGE_KEY, code);
    setCurrencyState(code);
  };

  const convert = (amountInBase: number) => {
    const rate = rates[currency] ?? 1;
    return amountInBase * rate;
  };

  const format = (amountInBase: number) => {
    const value = convert(amountInBase);
    try {
      return new Intl.NumberFormat(lang, {
        style: "currency",
        currency,
        maximumFractionDigits: value >= 100 ? 0 : 2,
      }).format(value);
    } catch {
      return `${value.toFixed(2)} ${currency}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        baseCurrency: base,
        rates,
        ratesUpdatedAt: updatedAt,
        ratesSource: source,
        convert,
        format,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
