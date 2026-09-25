// Post-sign-in redirects come from the URL (?callbackUrl=...), so only allow
// same-site paths — "//evil.com" or "https://evil.com" would otherwise turn
// the sign-in page into an open redirect.
export function safeCallbackUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
