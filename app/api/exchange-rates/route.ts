import { NextResponse } from "next/server";
import { baseCurrency } from "@/app/currency-config";
import fallback from "@/app/data/exchange-rates.json";

// Free, no-API-key exchange rate provider. Updated daily.
const RATES_ENDPOINT = `https://open.er-api.com/v6/latest/${baseCurrency}`;

// Revalidate every 6 hours so rates stay fresh without hammering the provider.
const REVALIDATE_SECONDS = 60 * 60 * 6;

function getFallbackRates() {
  if (baseCurrency === fallback.base) {
    return { base: fallback.base, rates: fallback.rates as Record<string, number> };
  }

  // Re-base the static fallback table around the configured store currency.
  const rates = fallback.rates as Record<string, number>;
  const baseRate = rates[baseCurrency];
  if (!baseRate) {
    return { base: fallback.base, rates };
  }

  const rebased: Record<string, number> = {};
  for (const [code, rate] of Object.entries(rates)) {
    rebased[code] = rate / baseRate;
  }
  return { base: baseCurrency, rates: rebased };
}

export async function GET() {
  try {
    const res = await fetch(RATES_ENDPOINT, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error(`Exchange rate API responded ${res.status}`);

    const data = await res.json();
    if (data.result !== "success" || !data.rates) {
      throw new Error("Unexpected exchange rate API response");
    }

    return NextResponse.json({
      base: data.base_code as string,
      rates: data.rates as Record<string, number>,
      updatedAt: data.time_last_update_utc as string,
      source: "live" as const,
    });
  } catch {
    const { base, rates } = getFallbackRates();
    return NextResponse.json({
      base,
      rates,
      updatedAt: fallback.updatedAt,
      source: "fallback" as const,
    });
  }
}
