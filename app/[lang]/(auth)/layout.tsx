import { getDictionary } from "@/app/dictionaries";
import { locales, type Locale } from "@/app/i18n-config";
import { LanguageSwitcher } from "@/component/common/LanguageSwitcher";
import { ThemeSwitcher } from "@/component/common/ThemeSwitcher";
import Footer from "@/component/layout/Footer";
import { Globe2, PackageCheck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const panelCopy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
    secure: string;
    delivery: string;
    tracking: string;
  }
> = {
  en: {
    eyebrow: "A simpler way to shop worldwide",
    title: "One account. A world of products.",
    description:
      "Discover products across borders, check out securely, and follow every order in one place.",
    secure: "Secure checkout",
    delivery: "Worldwide delivery",
    tracking: "Clear order tracking",
  },
  bn: {
    eyebrow: "বিশ্বজুড়ে কেনাকাটার সহজ উপায়",
    title: "একটি অ্যাকাউন্ট। পণ্যের এক বিশাল জগৎ।",
    description:
      "বিশ্বের নানা প্রান্তের পণ্য খুঁজুন, নিরাপদে মূল্য পরিশোধ করুন এবং সব অর্ডার এক জায়গায় দেখুন।",
    secure: "নিরাপদ চেকআউট",
    delivery: "বিশ্বব্যাপী ডেলিভারি",
    tracking: "সহজ অর্ডার ট্র্যাকিং",
  },
  hi: {
    eyebrow: "दुनिया भर में खरीदारी का आसान तरीका",
    title: "एक खाता। उत्पादों की पूरी दुनिया।",
    description:
      "दुनिया भर के उत्पाद खोजें, सुरक्षित भुगतान करें और हर ऑर्डर को एक ही जगह ट्रैक करें।",
    secure: "सुरक्षित चेकआउट",
    delivery: "विश्वव्यापी डिलीवरी",
    tracking: "स्पष्ट ऑर्डर ट्रैकिंग",
  },
  ur: {
    eyebrow: "دنیا بھر میں خریداری کا آسان طریقہ",
    title: "ایک اکاؤنٹ۔ مصنوعات کی ایک دنیا۔",
    description:
      "دنیا بھر کی مصنوعات دریافت کریں، محفوظ ادائیگی کریں اور ہر آرڈر کو ایک جگہ ٹریک کریں۔",
    secure: "محفوظ چیک آؤٹ",
    delivery: "دنیا بھر میں ڈیلیوری",
    tracking: "آسان آرڈر ٹریکنگ",
  },
  ar: {
    eyebrow: "طريقة أبسط للتسوق حول العالم",
    title: "حساب واحد. عالم من المنتجات.",
    description:
      "اكتشف منتجات من حول العالم، وادفع بأمان، وتابع كل طلب من مكان واحد.",
    secure: "دفع آمن",
    delivery: "توصيل عالمي",
    tracking: "تتبع واضح للطلبات",
  },
  es: {
    eyebrow: "Una forma más sencilla de comprar en todo el mundo",
    title: "Una cuenta. Un mundo de productos.",
    description:
      "Descubre productos de todo el mundo, paga de forma segura y sigue cada pedido en un solo lugar.",
    secure: "Pago seguro",
    delivery: "Entrega mundial",
    tracking: "Seguimiento claro",
  },
  zh: {
    eyebrow: "更轻松的全球购物方式",
    title: "一个账户，畅购全球好物。",
    description: "发现全球商品，安全结账，并在一个地方跟踪每一笔订单。",
    secure: "安全结账",
    delivery: "全球配送",
    tracking: "清晰的订单跟踪",
  },
  fr: {
    eyebrow: "Une façon plus simple d’acheter dans le monde entier",
    title: "Un compte. Un monde de produits.",
    description:
      "Découvrez des produits du monde entier, payez en toute sécurité et suivez chaque commande au même endroit.",
    secure: "Paiement sécurisé",
    delivery: "Livraison mondiale",
    tracking: "Suivi clair des commandes",
  },
};

export default function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  return <AuthLayoutContent params={params}>{children}</AuthLayoutContent>;
}

async function AuthLayoutContent({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;
  if (!locales.includes(rawLang as Locale)) notFound();

  const lang = rawLang as Locale;
  const dict = await getDictionary(lang);
  const copy = panelCopy[lang];

  const benefits = [
    { icon: ShieldCheck, label: copy.secure },
    { icon: Globe2, label: copy.delivery },
    { icon: PackageCheck, label: copy.tracking },
  ];

  return (
    <div className="min-h-screen bg-(--color-surface)">
      <header className="relative z-20 flex h-[76px] items-center border-b border-(--color-border) bg-(--color-surface)/95 px-4 backdrop-blur sm:px-8 lg:px-12">
        <Link
          href={`/${lang}`}
          aria-label={`${dict.nav.home} — BongoOcean`}
          className="inline-flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/logo/bongoocean.svg"
            alt="BongoOcean"
            width={162}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>
        <div className="ms-auto flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />
          <span
            className="hidden h-5 w-px bg-(--color-border) sm:block"
            aria-hidden="true"
          />
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="grid min-h-[calc(100vh-76px)] lg:grid-cols-[minmax(0,1.06fr)_minmax(420px,0.94fr)]">
        <section className="flex items-center justify-center bg-(--color-bg) px-5 py-12 sm:px-10 lg:px-16 lg:py-16">
          {children}
        </section>

        <aside className="relative hidden overflow-hidden bg-[#012d83] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div
            className="absolute -end-24 -top-28 size-[360px] rounded-full border-[72px] border-white/[0.055]"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-48 -start-36 size-[520px] rounded-full border-[100px] border-cyan-300/[0.07]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:42px_42px]"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-cyan-100 backdrop-blur">
              <Globe2 size={15} />
              {copy.eyebrow}
            </span>
          </div>

          <div className="relative z-10 my-12 max-w-[560px]">
            <div className="mb-9 flex items-center gap-3" aria-hidden="true">
              <span className="h-1.5 w-16 rounded-full bg-cyan-300" />
              <span className="h-1.5 w-6 rounded-full bg-white/30" />
            </div>
            <h2 className="max-w-[11ch] text-[clamp(2.75rem,4vw,4.75rem)] font-extrabold leading-[1.03] tracking-[-0.055em] text-white">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-[48ch] text-lg leading-8 text-blue-100/80">
              {copy.description}
            </p>
          </div>

          <div className="relative z-10 grid gap-3 xl:grid-cols-3">
            {benefits.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-cyan-300/15 text-cyan-200">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-semibold leading-5 text-white/90">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </aside>
      </main>
      <Footer dict={dict} lang={lang} />
    </div>
  );
}
