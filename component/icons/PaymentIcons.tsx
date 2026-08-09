import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function VisaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Visa" {...props}>
      <rect width="38" height="24" rx="4" fill="#1A1F71" />
      <text
        x="19"
        y="16.5"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontStyle="italic"
        fontSize="10"
        letterSpacing="0.5"
        fill="#fff"
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Mastercard" {...props}>
      <rect width="38" height="24" rx="4" fill="#fff" />
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="23" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 6.3a7 7 0 0 1 0 11.4 7 7 0 0 1 0-11.4z" fill="#FF5F00" />
    </svg>
  );
}

export function PayPalIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="PayPal" {...props}>
      <rect width="38" height="24" rx="4" fill="#fff" />
      <text x="6" y="16" fontFamily="Arial, Helvetica, sans-serif" fontWeight="800" fontStyle="italic" fontSize="9.5" fill="#003087">
        Pay
        <tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}

export function ApplePayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Apple Pay" {...props}>
      <rect width="38" height="24" rx="4" fill="#000" />
      <g transform="translate(5.5, 4.5) scale(0.6)">
        <path
          fill="#fff"
          d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.475.95 3.5.95.93 0 2.13-1.01 3.84-1.01.722 0 2.6.07 4.04 2.36-.105.07-2.4 1.36-2.4 4.07 0 3.21 2.85 4.39 2.7 4.39z"
        />
      </g>
      <text x="22" y="16" fontFamily="Helvetica, Arial, sans-serif" fontWeight="600" fontSize="9" fill="#fff">
        Pay
      </text>
    </svg>
  );
}

export function CodIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 38 24" role="img" aria-label="Cash on Delivery" {...props}>
      <rect width="38" height="24" rx="4" fill="var(--color-success)" />
      <text
        x="19"
        y="16"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        fontSize="9"
        letterSpacing="1"
        fill="#fff"
      >
        COD
      </text>
    </svg>
  );
}
