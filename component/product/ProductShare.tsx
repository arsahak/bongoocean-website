"use client";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/component/icons/SocialIcons";
import { Check, Copy } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface ProductShareProps {
  title: string;
}

type Status = "copied" | "instagram" | null;

const shareTargets = {
  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  linkedin: (url: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  x: (url: string, title: string) =>
    `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
};

// Page URL without query/hash, so shared links stay clean and canonical.
function currentUrl(): string {
  return `${window.location.origin}${window.location.pathname}`;
}

function openSharePopup(href: string) {
  const width = 600;
  const height = 640;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  window.open(
    href,
    "share",
    `noopener,noreferrer,width=${width},height=${height},left=${left},top=${top}`,
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API is blocked on insecure origins / older browsers.
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    const ok = document.execCommand("copy");
    input.remove();
    return ok;
  }
}

export function ProductShare({ title }: ProductShareProps) {
  const [status, setStatus] = useState<Status>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const flash = (next: Status) => {
    setStatus(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(null), 2500);
  };

  const handleCopy = async () => {
    if (await copyText(currentUrl())) flash("copied");
  };

  // Instagram has no web share link: use the native share sheet where it
  // exists (phones — Instagram is listed there), otherwise copy the link.
  const handleInstagram = async () => {
    const url = currentUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    if (await copyText(url)) flash("instagram");
  };

  const iconClass = "h-4 w-4 shrink-0";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="text-sm font-medium text-(--color-text-muted)">
        Share:
      </span>

      <div className="flex items-center gap-2">
        <ShareButton
          label="Share on Facebook"
          brand="#1877F2"
          onClick={() => openSharePopup(shareTargets.facebook(currentUrl()))}
        >
          <FacebookIcon className={iconClass} />
        </ShareButton>
        <ShareButton
          label="Share on Instagram"
          brand="#E1306C"
          hoverBackground="radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"
          onClick={handleInstagram}
        >
          <InstagramIcon className={iconClass} />
        </ShareButton>
        <ShareButton
          label="Share on LinkedIn"
          brand="#0A66C2"
          onClick={() => openSharePopup(shareTargets.linkedin(currentUrl()))}
        >
          <LinkedinIcon className={iconClass} />
        </ShareButton>
        <ShareButton
          label="Share on X (Twitter)"
          brand="var(--color-dark)"
          hoverForeground="var(--color-bg)"
          onClick={() => openSharePopup(shareTargets.x(currentUrl(), title))}
        >
          <XIcon className="h-3.5 w-3.5 shrink-0" />
        </ShareButton>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy product link"
          title="Copy link"
          className={`inline-flex h-9 items-center gap-1.5 rounded-full border bg-(--color-surface) px-3.5 py-0 text-xs font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 ${
            status === "copied"
              ? "border-(--color-success) text-(--color-success)"
              : "border-(--color-border) text-(--color-dark) hover:border-(--color-dark)"
          }`}
        >
          {status === "copied" ? (
            <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <Copy aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
          )}
          {status === "copied" ? "Copied" : "Copy"}
        </button>
      </div>

      <p aria-live="polite" className="w-full text-xs text-(--color-success) empty:hidden">
        {status === "instagram" &&
          "Link copied — paste it into your Instagram story, post or DM."}
      </p>
    </div>
  );
}

// Neutral circle with the icon in brand color; fills with the brand on hover.
function ShareButton({
  label,
  brand,
  hoverBackground,
  hoverForeground,
  onClick,
  children,
}: {
  label: string;
  brand: string;
  /** Overrides the hover fill (e.g. Instagram's gradient). */
  hoverBackground?: string;
  /** Icon color on hover — defaults to white. */
  hoverForeground?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      style={
        {
          "--brand": brand,
          "--brand-bg": hoverBackground ?? brand,
          "--brand-fg": hoverForeground ?? "#fff",
        } as CSSProperties
      }
      className="group/share relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-(--color-border) bg-(--color-surface) p-0 text-(--brand) shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-(--brand-fg) hover:shadow-[0_6px_16px_-4px_var(--brand)] active:scale-95"
    >
      <span
        aria-hidden="true"
        style={{ background: "var(--brand-bg)" }}
        className="absolute inset-0 scale-50 rounded-full opacity-0 transition-all duration-200 group-hover/share:scale-100 group-hover/share:opacity-100"
      />
      <span className="relative">{children}</span>
    </button>
  );
}

export default ProductShare;
