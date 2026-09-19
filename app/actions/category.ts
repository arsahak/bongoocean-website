"use server";

const API = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/v1`;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryDataResponse<T = unknown> {
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

// ── List categories (public backend endpoint — no auth required) ──────────────

export async function listCategoriesAction(): Promise<
  CategoryDataResponse<Category[]>
> {
  try {
    const res = await fetch(`${API}/categories`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        error: await parseError(res, "Failed to fetch categories."),
      };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Get a single category (public) ─────────────────────────────────────────────

export async function getCategoryAction(
  id: string,
): Promise<CategoryDataResponse<Category>> {
  try {
    const res = await fetch(`${API}/categories/${id}`, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        error: await parseError(res, "Failed to fetch category."),
      };
    }
    const body = await res.json();
    return { ok: true, data: body.data };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
