"use server";

import {
  getItem1688DetailAction as sourcingGetItem1688DetailAction,
  search1688Action as sourcingSearch1688Action,
  type ItemDetail1688,
  type Search1688Params,
  type SourcingSearchResult,
} from "./sourcing";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/v1`;

// ── Bongoocean product catalog (public, paginated) ──────────────────────────
// Separate from the 1688 sourcing search below — this hits the backend's own
// Product catalog (GET /products, no auth required).

export interface ProductCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductBrandRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ProductVendorRef {
  _id: string;
  name: string;
  slug: string;
}

export type ProductUnit = "kg" | "g" | "l" | "ml" | "pcs";

export interface Product {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  category: string | ProductCategoryRef;
  brand?: string | ProductBrandRef | null;
  vendor?: string | ProductVendorRef | null;
  shortDescription?: string;
  overview?: string;
  featureImage?: string;
  galleryImages: string[];
  // Optional single product video: "upload" is a hosted file URL, "youtube"
  // a canonical https://www.youtube.com/embed/{id} URL, "" means no video.
  videoUrl?: string;
  videoSource?: "upload" | "youtube" | "";
  price: number;
  discountPrice?: number;
  unit: ProductUnit;
  weight: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  // Auto-expires 30 days after being set — always reflects current status.
  isNewArrival: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: "default" | "price-low" | "price-high" | "name";
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
}

interface ProductDataResponse<T = unknown> {
  ok: boolean;
  data?: T | null;
  error?: string;
}

async function parseProductError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await res.json();
    return typeof body?.message === "string" ? body.message : fallback;
  } catch {
    return fallback;
  }
}

export async function listCatalogProductsAction(
  params: ListProductsParams = {},
): Promise<ProductDataResponse<ProductListResult>> {
  try {
    const query = new URLSearchParams();
    query.set("page", String(params.page || 1));
    query.set("limit", String(params.limit || 20));
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    if (params.isFeatured !== undefined) {
      query.set("isFeatured", String(params.isFeatured));
    }
    if (params.isTrending !== undefined) {
      query.set("isTrending", String(params.isTrending));
    }
    if (params.isNewArrival !== undefined) {
      query.set("isNewArrival", String(params.isNewArrival));
    }
    // Customers only ever see live products — never draft/hidden ones.
    query.set("isActive", "true");

    const res = await fetch(`${API}/products?${query.toString()}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        error: await parseProductError(res, "Failed to fetch products."),
      };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function getCatalogProductAction(
  idOrSlug: string,
): Promise<ProductDataResponse<Product>> {
  try {
    const res = await fetch(`${API}/products/${idOrSlug}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        error: await parseProductError(res, "Failed to fetch product."),
      };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Approved reviews for one product (public) ──────────────────────────────

export interface ProductReviewCustomer {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

export interface ProductReview {
  _id: string;
  rating: number;
  comment: string;
  customer?: ProductReviewCustomer | null;
  createdAt: string;
}

export interface ProductReviewsResult {
  reviews: ProductReview[];
  summary: {
    averageRating: number;
    totalReviews: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export async function listProductReviewsAction(
  productId: string,
  params: { page?: number; limit?: number } = {},
): Promise<ProductDataResponse<ProductReviewsResult>> {
  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();

    const res = await fetch(
      `${API}/reviews/products/${productId}${qs ? `?${qs}` : ""}`,
      { method: "GET", cache: "no-store" },
    );
    if (!res.ok) {
      return {
        ok: false,
        error: await parseProductError(res, "Failed to fetch reviews."),
      };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── 1688 sourcing search ────────────────────────────────────────────────────
// The product grid sources listings directly from 1688 (no separate backend
// Product catalog). Delegates to app/actions/sourcing.ts — kept as a wrapper
// function (not a re-export) since "use server" files may only export async
// functions.

export async function search1688Action(
  params: Search1688Params,
): Promise<{
  ok: boolean;
  data?: SourcingSearchResult | null;
  error?: string;
}> {
  return sourcingSearch1688Action(params);
}

export async function getItem1688DetailAction(
  itemId: string,
): Promise<{ ok: boolean; data?: ItemDetail1688 | null; error?: string }> {
  return sourcingGetItem1688DetailAction(itemId);
}

export type {
  ItemDetail1688,
  ItemDetailPriceTier,
  ItemDetailSpecification,
  ItemDetailVariant,
  ItemDetailVariantOption,
  Search1688Params,
  SourcingItem,
  SourcingSearchResult,
} from "./sourcing";
