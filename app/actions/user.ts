"use server";

import { auth, signOut } from "@/auth";
import { revalidatePath } from "next/cache";

const API = `${process.env.NEXT_PUBLIC_API_URL || "https://fishmeaqua-backend.vercel.app"}/api/v1`;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UserAddress {
  division?: string;
  district?: string;
  upazila?: string;
  postOffice?: string;
  postCode?: string;
  area?: string;
  zone?: string;
}

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  address?: UserAddress;
  shipToDifferentAddress: boolean;
  shippingAddress?: UserAddress;
  phone?: string;
  email?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  address?: UserAddress;
  shipToDifferentAddress?: boolean;
  shippingAddress?: UserAddress;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// ── Shared helpers ───────────────────────────────────────────────────────────
// All /users/me endpoints require the Bearer token from the customer/staff
// session (see auth.ts's authorize functions, which store the backend's
// signin token as session.user.accessToken).

async function getAccessToken(): Promise<string | null> {
  const session = await auth();
  return session?.user?.accessToken ?? null;
}

function parseErrorMessage(body: unknown, fallback: string): string {
  const b = body as { errors?: string[]; message?: string } | null;
  return b?.errors?.[0] || b?.message || fallback;
}

// ── Get ───────────────────────────────────────────────────────────────────────

export async function getMyProfile(): Promise<UserResult<UserProfile>> {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "You need to sign in first." };

  try {
    const res = await fetch(`${API}/users/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: parseErrorMessage(body, "Could not load your profile.") };
    }
    return { ok: true, data: body.data as UserProfile };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<UserResult<UserProfile>> {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "You need to sign in first." };

  try {
    const res = await fetch(`${API}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: parseErrorMessage(body, "Could not update your profile.") };
    }

    revalidatePath("/", "layout");
    return { ok: true, data: body.data as UserProfile };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// Form-action wrapper for the edit-profile page, matching the useActionState
// shape used elsewhere (see customerSigninAction in ./auth.ts) — takes a
// single "fullName" field and splits it the same way signup does.
export type UpdateProfileActionResult = {
  ok: boolean;
  error?: string;
  profile?: UserProfile;
};

export async function updateMyProfileAction(
  prevState: UpdateProfileActionResult,
  formData: FormData,
): Promise<UpdateProfileActionResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();

  if (!fullName) {
    return { ok: false, error: "Please enter your name." };
  }

  const [firstName, ...rest] = fullName.split(/\s+/);
  const lastName = rest.join(" ");

  const result = await updateMyProfile({
    firstName,
    lastName,
    email: email || undefined,
    phone: phone || undefined,
  });

  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, profile: result.data };
}

// Edit avatar — expects a FormData with a single "avatar" file field.
export async function updateMyAvatar(formData: FormData): Promise<UserResult<UserProfile>> {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "You need to sign in first." };

  try {
    const res = await fetch(`${API}/users/me/avatar`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      signal: AbortSignal.timeout(15000),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: parseErrorMessage(body, "Could not update your avatar.") };
    }

    revalidatePath("/", "layout");
    return { ok: true, data: body.data as UserProfile };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export async function changeMyPassword(
  input: ChangePasswordInput,
): Promise<UserResult> {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "You need to sign in first." };

  try {
    const res = await fetch(`${API}/users/me/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(input),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: parseErrorMessage(body, "Could not change your password.") };
    }
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
// Permanently deletes the signed-in user's own account, then signs them out
// (the session cookie would otherwise reference a user that no longer exists).

export async function deleteMyAccount(): Promise<UserResult> {
  const token = await getAccessToken();
  if (!token) return { ok: false, error: "You need to sign in first." };

  try {
    const res = await fetch(`${API}/users/me`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: parseErrorMessage(body, "Could not delete your account.") };
    }
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }

  await signOut({ redirectTo: "/sign-in" });
  return { ok: true, data: undefined };
}
