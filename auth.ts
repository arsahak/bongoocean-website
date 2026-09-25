import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://fishmeaqua-backend.vercel.app";
const AUTH_SECRET =
  process.env.WEBSITE_AUTH_SECRET ??
  (process.env.AUTH_SECRET
    ? `website:${process.env.AUTH_SECRET}`
    : undefined);

const STAFF_ROLES = new Set(["manager", "admin", "superadmin"]);

export const { auth, signIn, signOut, handlers } = NextAuth({
  secret: AUTH_SECRET,
  // Distinct cookie names (and a distinct derived secret, above) from the
  // admin dashboard and vendor dashboard, so all three can run on localhost
  // without one app's session bleeding into another's.
  cookies: {
    sessionToken: {
      name: "fishme-website.session-token",
    },
    callbackUrl: {
      name: "fishme-website.callback-url",
    },
    csrfToken: {
      name: "fishme-website.csrf-token",
    },
    pkceCodeVerifier: {
      name: "fishme-website.pkce.code-verifier",
    },
    state: {
      name: "fishme-website.state",
    },
    nonce: {
      name: "fishme-website.nonce",
    },
    webauthnChallenge: {
      name: "fishme-website.challenge",
    },
  },
  providers: [
    // Staff sign-in (manager / admin / superadmin only) — hits the backend's
    // /api/v1/auth/staff/signin, which rejects customer accounts with 403
    // even on valid credentials.
    Credentials({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/auth/staff/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error(
              "Admin sign-in failed with status:",
              res.status,
              errorText,
            );
            return null;
          }

          const body = await res.json();
          const user = body?.data?.user;
          const token = body?.data?.token;
          const role = typeof user?.role === "string" ? user.role : "";

          if (!token || !user?._id || !STAFF_ROLES.has(role)) {
            console.error(
              "Staff sign-in response is missing fields or has a forbidden role:",
              body,
            );
            return null;
          }

          return {
            id: user._id,
            email: user.email ?? null,
            name: `${user.firstName} ${user.lastName}`.trim(),
            accessToken: token,
            role,
            userType: "admin",
          };
        } catch (error) {
          console.error("Admin authorize function crashed:", error);
          return null;
        }
      },
    }),

    // Customer sign-in — hits the backend's /api/v1/auth/signin, which only
    // accepts "customer" role accounts (staff logins are rejected there).
    Credentials({
      id: "customer-credentials",
      name: "Customer",
      credentials: {
        identifier: { label: "Email or phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        try {
          const res = await fetch(`${BACKEND_URL}/api/v1/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.identifier,
              password: credentials.password,
            }),
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error(
              "Customer sign-in failed with status:",
              res.status,
              errorText,
            );
            return null;
          }

          const body = await res.json();
          const user = body?.data?.user;
          const token = body?.data?.token;

          if (!token || !user?._id) {
            console.error(
              "Customer sign-in response is missing fields:",
              body,
            );
            return null;
          }

          return {
            id: user._id,
            email: user.email ?? null,
            name: `${user.firstName} ${user.lastName}`.trim(),
            accessToken: token,
            role: user.role,
            userType: "customer",
          };
        } catch (error) {
          console.error("Customer authorize function crashed:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.role = user.role;
        token.userType = user.userType;
        if (user.userType === "admin") {
          token.companyName = user.companyName;
          token.has_paid_subscription = user.has_paid_subscription ?? false;
          token.subscription_type = user.subscription_type ?? "free";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.accessToken = token.accessToken;
        session.user.role = token.role;
        session.user.userType = token.userType;
        if (token.userType === "admin") {
          session.user.companyName = token.companyName;
          session.user.has_paid_subscription = token.has_paid_subscription;
          session.user.subscription_type = token.subscription_type;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },

  session: {
    strategy: "jwt",
    // Keep the Auth.js session aligned with the backend access-token lifetime.
    maxAge: 7 * 24 * 60 * 60,
  },
});
