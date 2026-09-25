import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    accessToken?: string;
    role?: string;
    // "admin" via admin-credentials (staff), "customer" via customer-credentials.
    userType?: "admin" | "customer";
    // Staff-only fields, present when userType is "admin".
    companyName?: string;
    has_paid_subscription?: boolean;
    subscription_type?: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    role?: string;
    userType?: "admin" | "customer";
    companyName?: string;
    has_paid_subscription?: boolean;
    subscription_type?: string;
  }
}
