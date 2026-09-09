"use server";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/v1`;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SourcingItem {
  id: string;
  title: string;
  titleEn?: string;
  price?: string;
  minOrder?: string;
  sales?: string;
  image?: string;
  url?: string;
}

export interface SourcingSearchResult {
  items: SourcingItem[];
  hasMore: boolean;
}

export interface Search1688Params {
  q: string;
  page?: number;
  pageSize?: number;
  sort?: "default" | "price_asc" | "price_desc" | "sales";
}

export interface ItemDetailPriceTier {
  minQuantity: string;
  price: string;
}

export interface ItemDetailSpecification {
  name: string;
  value: string;
}

export interface ItemDetailVariantOption {
  name: string;
  values: string[];
}

export interface ItemDetailVariant {
  skuId: string;
  price: string;
  quantity: string;
  optionValues: Record<string, string>;
}

export interface ItemDetail1688 {
  id: string;
  title: string;
  images: string[];
  video?: { thumbnail?: string; url?: string };
  price?: string;
  unit?: string;
  minOrder?: string;
  priceTiers: ItemDetailPriceTier[];
  sales?: string;
  url?: string;
  specifications: ItemDetailSpecification[];
  variantOptions: ItemDetailVariantOption[];
  variants: ItemDetailVariant[];
  descriptionImages: string[];
}

interface SourcingDataResponse<T = unknown> {
  ok: boolean;
  data?: T | null;
  error?: string;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.message === "string" ? body.message : fallback;
  } catch {
    return fallback;
  }
}

// ── Search 1688 supplier listings ───────────────────────────────────────────
// This backend route has no auth requirement (public), and the storefront has
// no staff session to attach anyway — unlike the dashboard's equivalent action.

export async function search1688Action(
  params: Search1688Params,
): Promise<SourcingDataResponse<SourcingSearchResult>> {
  try {
    const query = new URLSearchParams();
    query.set("q", params.q);
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));
    if (params.sort) query.set("sort", params.sort);

    const res = await fetch(`${API}/sourcing/1688/search?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      const message = await parseError(res, "Failed to search 1688 listings.");
      return { ok: false, error: message };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Get full 1688 product detail ────────────────────────────────────────────

export async function getItem1688DetailAction(
  itemId: string,
): Promise<SourcingDataResponse<ItemDetail1688>> {
  try {
    const res = await fetch(`${API}/sourcing/1688/detail/${itemId}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      const message = await parseError(res, "Failed to load product detail.");
      return { ok: false, error: message };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
