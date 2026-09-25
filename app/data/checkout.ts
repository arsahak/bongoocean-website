// Mirrors the backend's BD_DIVISIONS / DELIVERY_ZONES / PAYMENT_METHODS
// (backend/models/user.model.ts, backend/models/order.model.ts) so this
// form's values line up with what /orders actually accepts.

export const BD_DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

export type BdDivision = (typeof BD_DIVISIONS)[number];

export const DELIVERY_ZONES = ["Inside Dhaka", "Outside Dhaka"] as const;

export type DeliveryZone = (typeof DELIVERY_ZONES)[number];

export const PAYMENT_METHODS = ["cod", "bkash", "nagad", "card"] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
