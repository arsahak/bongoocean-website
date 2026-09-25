"use server";

import { auth, signIn, signOut } from "@/auth";
import { safeCallbackUrl } from "@/app/utils/safe-redirect";

const API = `${process.env.NEXT_PUBLIC_API_URL || "https://fishmeaqua-backend.vercel.app"}/api/v1`;

// ── Types ─────────────────────────────────────────────────────────────────────

export type ActionResult = { success: boolean; message: string };
export type SigninResult = { ok: boolean; error?: string; redirectTo?: string };
export type SignupResult =
  | { ok: false; error: string }
  | { ok: true; otpRequired: true; identifier: string; channel: "email" | "phone" };
export type OtpActionResult = { ok: boolean; error?: string; message?: string };

// ── Sign out ──────────────────────────────────────────────────────────────────

export async function signoutAction(): Promise<void> {
  await signOut({ redirectTo: "/sign-in" });
}

// ── Customer auth (website sign-in / sign-up) ───────────────────────────────────
// Sign-in goes through the "customer-credentials" provider registered in
// auth.ts, which calls the backend's /api/v1/auth/signin (rejects staff
// accounts). Sign-up calls the backend's /api/v1/auth/signup directly, then
// signs the new account in the same way.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isCredentialsError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { message, type } = error as { message?: string; type?: string };
  return (
    type === "CredentialsSignin" ||
    Boolean(message?.includes("CredentialsSignin")) ||
    Boolean(message?.includes("credentials"))
  );
}

export async function customerSigninAction(
  prevState: SigninResult,
  formData: FormData,
): Promise<SigninResult> {
  const identifier = (formData.get("identifier") as string)?.trim();
  const password = formData.get("password") as string;
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"), "/");

  if (!identifier || !password) {
    return { ok: false, error: "Email/phone and password are required." };
  }

  try {
    await signIn("customer-credentials", {
      identifier,
      password,
      redirect: false,
    });
    return { ok: true, redirectTo: callbackUrl };
  } catch (error) {
    if (isCredentialsError(error)) {
      return { ok: false, error: "Invalid email/phone or password." };
    }
    return { ok: false, error: "An error occurred. Please try again." };
  }
}

// Step 1: starts signup and triggers an OTP email/SMS. Doesn't create the
// account yet — see verifySignupOtpAction, which completes it.
export async function customerSignupAction(
  prevState: SignupResult,
  formData: FormData,
): Promise<SignupResult> {
  const fullName = (formData.get("fullName") as string)?.trim();
  const identifier = (formData.get("identifier") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!fullName || !identifier || !password) {
    return { ok: false, error: "Please fill in all required fields." };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: "Passwords do not match." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const isEmail = EMAIL_RE.test(identifier);

  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email: isEmail ? identifier : undefined,
        phone: isEmail ? undefined : identifier,
        password,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    const body = await res.json().catch(() => null);
    if (!res.ok) {
      const message =
        body?.errors?.[0] || body?.message || "Could not create your account.";
      return { ok: false, error: message };
    }

    return {
      ok: true,
      otpRequired: true,
      identifier,
      channel: body?.data?.channel === "phone" ? "phone" : "email",
    };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// Step 2: verifies the OTP, which creates the account on the backend, then
// signs the new account in the normal way (same as customerSigninAction).
export async function verifySignupOtpAction(
  prevState: SigninResult,
  formData: FormData,
): Promise<SigninResult> {
  const identifier = (formData.get("identifier") as string)?.trim();
  const otp = (formData.get("otp") as string)?.trim();
  const password = formData.get("password") as string;
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"), "/");

  if (!identifier || !otp || !password) {
    return { ok: false, error: "Please enter the code we sent you." };
  }

  try {
    const res = await fetch(`${API}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, otp }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const message = body?.errors?.[0] || body?.message || "Invalid code.";
      return { ok: false, error: message };
    }
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }

  try {
    await signIn("customer-credentials", {
      identifier,
      password,
      redirect: false,
    });
    return { ok: true, redirectTo: callbackUrl };
  } catch {
    // Account was created but the auto sign-in failed; send them to sign in manually.
    return { ok: true, redirectTo: "/sign-in" };
  }
}

// Resends the signup OTP. Called directly from a button click rather than
// through useActionState, since it isn't tied to a form submission.
export async function resendSignupOtpAction(
  identifier: string,
): Promise<OtpActionResult> {
  try {
    const res = await fetch(`${API}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      return { ok: false, error: body?.message || "Could not resend the code." };
    }
    return { ok: true, message: body?.message || "Code resent." };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

// ── Staff auth (manager, admin, superadmin) ────────────────────────────────────
// Goes through the "admin-credentials" provider registered in auth.ts, which
// calls the backend's /api/v1/auth/staff/signin (rejects customer accounts).

export async function adminSigninAction(
  prevState: SigninResult,
  formData: FormData,
): Promise<SigninResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  try {
    await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
    });
    return { ok: true, redirectTo: callbackUrl };
  } catch (error: any) {
    const msg: string = error?.message || "";
    if (
      msg.includes("CredentialsSignin") ||
      msg.includes("credentials") ||
      error?.type === "CredentialsSignin"
    ) {
      return { ok: false, error: "Invalid email or password." };
    }
    return { ok: false, error: "An error occurred. Please try again." };
  }
}

// ── Own admin profile (any signed-in staff member) ──────────────────────────────
// Full staff CRUD (list/create/update/delete other accounts) lives in
// app/actions/staff.ts, backed by the real /api/v1/users/staff endpoints.

export type AdminRole = "customer" | "manager" | "admin" | "superadmin";

export interface AdminAccount {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: AdminRole;
  createdAt: string;
  updatedAt: string;
}

interface AdminDataResponse<T = unknown> {
  ok: boolean;
  data?: T | null;
  error?: string;
}

async function getAdminAuthToken() {
  const session = await auth();
  return (session?.user as any)?.accessToken as string | undefined;
}

async function parseAdminError(
  res: Response,
  fallback: string,
): Promise<string> {
  try {
    const body = await res.json();
    if (typeof body?.message === "string") return body.message;
  } catch {
    // ignore parse failure
  }
  return fallback;
}

export async function getMyAdminProfileAction(): Promise<
  AdminDataResponse<AdminAccount>
> {
  const token = await getAdminAuthToken();
  if (!token) return { ok: false, error: "Not authenticated." };

  try {
    const res = await fetch(`${API}/users/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false,
        error: await parseAdminError(res, "Failed to fetch profile."),
      };
    }
    const body = await res.json();
    return { ok: true, data: body.data as AdminAccount };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}
