import { navCategories } from "@/app/data/categories";
import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import {
  ApplePayIcon,
  CodIcon,
  MastercardIcon,
  PayPalIcon,
  VisaIcon,
} from "@/component/icons/PaymentIcons";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
  YoutubeIcon,
} from "@/component/icons/SocialIcons";
import { Send, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ThemeSwitcher } from "../common/ThemeSwitcher";

interface FooterProps {
  dict: Dictionary;
  lang: Locale;
}

interface FooterLink {
  label: string;
  href: string;
}

function FooterLinks({ links }: { links: FooterLink[] }) {
  return (
    <ul className="flex flex-col items-start gap-2.5 ps-0 text-start [&>li]:m-0">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-primary)"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

const Footer = ({ dict, lang }: FooterProps) => {
  const year = new Date().getFullYear();

  const companyLinks: FooterLink[] = [
    { label: dict.footer.about, href: `/${lang}/about` },
    { label: dict.footer.careers, href: `/${lang}/careers` },
    { label: dict.footer.blog, href: `/${lang}/blog` },
    { label: dict.topbar.sell_on_xindamart, href: `/${lang}/sell` },
    { label: dict.footer.contact, href: `/${lang}/contact` },
  ];

  const serviceLinks: FooterLink[] = [
    { label: dict.footer.help, href: `/${lang}/help` },
    { label: dict.topbar.track_order, href: `/${lang}/orders/track` },
    { label: dict.footer.returns, href: `/${lang}/returns` },
    { label: dict.footer.shipping_info, href: `/${lang}/shipping` },
    { label: dict.footer.faq, href: `/${lang}/faq` },
  ];

  const categoryLinks: FooterLink[] = navCategories
    .slice(0, 6)
    .map((category) => ({
      label: category.label,
      href: `/${lang}${category.href}`,
    }));

  const legalLinks: FooterLink[] = [
    { label: dict.footer.terms, href: `/${lang}/terms` },
    { label: dict.footer.privacy, href: `/${lang}/privacy` },
    { label: dict.footer.cookie_policy, href: `/${lang}/cookies` },
  ];

  const socialLinks = [
    {
      label: "Facebook",
      href: "https://facebook.com/xindamart",
      Icon: FacebookIcon,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/xindamart",
      Icon: InstagramIcon,
    },
    { label: "X (Twitter)", href: "https://x.com/xindamart", Icon: XIcon },
    {
      label: "YouTube",
      href: "https://youtube.com/@xindamart",
      Icon: YoutubeIcon,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/company/xindamart",
      Icon: LinkedinIcon,
    },
  ];

  const paymentMethods = [
    { label: "Visa", Icon: VisaIcon },
    { label: "Mastercard", Icon: MastercardIcon },
    { label: "PayPal", Icon: PayPalIcon },
    { label: "Apple Pay", Icon: ApplePayIcon },
    { label: "Cash on Delivery", Icon: CodIcon },
  ];

  return (
    <footer className="border-t border-(--color-border) bg-(--color-surface)">
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 lg:grid-cols-12">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-4">
          <Link
            href={`/${lang}`}
            className="font-[family-name:var(--font-heading)] text-xl font-extrabold tracking-tight text-(--color-primary) sm:text-2xl"
          >
            Xinda<span className="text-(--color-secondary)">mart</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-(--color-text-muted)">
            {dict.footer.tagline}
          </p>

          <h6 className="mt-6 mb-3">{dict.footer.follow_us}</h6>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-(--color-border) text-(--color-text-muted) transition-colors hover:border-(--color-primary) hover:text-(--color-primary)"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Company */}
        <div className="text-start lg:col-span-2">
          <h6 className="mb-4 text-start">{dict.footer.company}</h6>
          <FooterLinks links={companyLinks} />
        </div>

        {/* Customer service */}
        <div className="text-start lg:col-span-2">
          <h6 className="mb-4 text-start">{dict.footer.customer_service}</h6>
          <FooterLinks links={serviceLinks} />
        </div>

        {/* Top categories */}
        <div className="text-start lg:col-span-2">
          <h6 className="mb-4 text-start">{dict.footer.top_categories}</h6>
          <FooterLinks links={categoryLinks} />
        </div>

        {/* Newsletter */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <h6 className="mb-4">{dict.footer.newsletter_title}</h6>
          <p className="mb-4 text-sm text-(--color-text-muted)">
            {dict.footer.newsletter_subtitle}
          </p>
          <form className="flex w-full items-center gap-1 rounded-full border border-(--color-border) bg-(--color-bg) p-1 transition-colors focus-within:border-(--color-primary) focus-within:bg-(--color-surface) focus-within:shadow-[0_0_0_3px_var(--color-primary-faint)]">
            <label htmlFor="footer-newsletter" className="sr-only">
              {dict.footer.newsletter_placeholder}
            </label>
            <input
              id="footer-newsletter"
              type="email"
              placeholder={dict.footer.newsletter_placeholder}
              className="w-full min-w-0 border-0 bg-transparent px-3 py-0 shadow-none outline-none"
            />
            <button
              type="submit"
              aria-label={dict.footer.subscribe}
              className="btn-primary shrink-0 rounded-full px-5 py-2"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="mt-6 ">
            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* Payment / trust bar */}
      <div className="border-t border-(--color-border)">
        <div className="container flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <div className="flex items-center gap-2 text-sm font-medium text-(--color-text-muted)">
            <ShieldCheck size={18} className="text-(--color-primary)" />
            {dict.footer.secure_payment}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map(({ label, Icon }) => (
              <span
                key={label}
                title={label}
                className="overflow-hidden rounded-(--radius-md) border border-(--color-border)"
              >
                <Icon className="block h-7 w-11" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-(--color-border) bg-(--color-bg)">
        <div className="container flex flex-col items-center justify-between gap-4 py-5 text-sm text-(--color-text-muted) sm:flex-row sm:flex-wrap">
          <p>
            © {year} Xindamart. {dict.footer.copyright}
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-(--color-primary)"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
