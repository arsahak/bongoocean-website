"use server";

import {
  getItem1688DetailAction as sourcingGetItem1688DetailAction,
  search1688Action as sourcingSearch1688Action,
  type ItemDetail1688,
  type Search1688Params,
  type SourcingSearchResult,
} from "./sourcing";

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
