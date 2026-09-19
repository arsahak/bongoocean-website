"use client";

import type { Dictionary } from "@/app/dictionaries";
import type { Locale } from "@/app/i18n-config";
import {
  ArrowRight,
  AtSign,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

type AuthMode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode: AuthMode;
  lang: Locale;
  dict: Dictionary;
}

const supplementalCopy: Record<
  Locale,
  {
    google: string;
    signIn: string;
    signUp: string;
    termsLead: string;
    terms: string;
    privacy: string;
    passwordHint: string;
    secureNote: string;
  }
> = {
  en: {
    google: "Continue with Google",
    signIn: "Sign in",
    signUp: "Create account",
    termsLead: "By creating an account, you agree to our",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    passwordHint: "Use 8 or more characters",
    secureNote: "Your information is protected with secure encryption.",
  },
  bn: {
    google: "Google দিয়ে চালিয়ে যান",
    signIn: "সাইন ইন করুন",
    signUp: "অ্যাকাউন্ট তৈরি করুন",
    termsLead: "অ্যাকাউন্ট তৈরি করে আপনি আমাদের নীতিতে সম্মত হচ্ছেন",
    terms: "সেবার শর্তাবলি",
    privacy: "গোপনীয়তা নীতি",
    passwordHint: "৮ বা তার বেশি অক্ষর ব্যবহার করুন",
    secureNote: "নিরাপদ এনক্রিপশনে আপনার তথ্য সুরক্ষিত থাকে।",
  },
  hi: {
    google: "Google से जारी रखें",
    signIn: "साइन इन करें",
    signUp: "खाता बनाएँ",
    termsLead: "खाता बनाकर आप हमारी नीतियों से सहमत होते हैं",
    terms: "सेवा की शर्तें",
    privacy: "गोपनीयता नीति",
    passwordHint: "8 या अधिक अक्षरों का उपयोग करें",
    secureNote: "आपकी जानकारी सुरक्षित एन्क्रिप्शन से संरक्षित है।",
  },
  ur: {
    google: "Google کے ساتھ جاری رکھیں",
    signIn: "سائن ان کریں",
    signUp: "اکاؤنٹ بنائیں",
    termsLead: "اکاؤنٹ بنا کر آپ ہماری پالیسیوں سے اتفاق کرتے ہیں",
    terms: "سروس کی شرائط",
    privacy: "رازداری کی پالیسی",
    passwordHint: "8 یا اس سے زیادہ حروف استعمال کریں",
    secureNote: "آپ کی معلومات محفوظ انکرپشن کے ذریعے محفوظ ہیں۔",
  },
  ar: {
    google: "المتابعة باستخدام Google",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    termsLead: "بإنشاء حساب، فإنك توافق على سياساتنا",
    terms: "شروط الخدمة",
    privacy: "سياسة الخصوصية",
    passwordHint: "استخدم 8 أحرف أو أكثر",
    secureNote: "معلوماتك محمية بتشفير آمن.",
  },
  es: {
    google: "Continuar con Google",
    signIn: "Iniciar sesión",
    signUp: "Crear una cuenta",
    termsLead: "Al crear una cuenta, aceptas nuestras políticas",
    terms: "Términos del servicio",
    privacy: "Política de privacidad",
    passwordHint: "Usa 8 caracteres o más",
    secureNote: "Tu información está protegida con cifrado seguro.",
  },
  zh: {
    google: "使用 Google 继续",
    signIn: "登录",
    signUp: "创建账户",
    termsLead: "创建账户即表示你同意我们的政策",
    terms: "服务条款",
    privacy: "隐私政策",
    passwordHint: "请使用至少 8 个字符",
    secureNote: "你的信息受到安全加密保护。",
  },
  fr: {
    google: "Continuer avec Google",
    signIn: "Se connecter",
    signUp: "Créer un compte",
    termsLead: "En créant un compte, vous acceptez nos politiques",
    terms: "Conditions d’utilisation",
    privacy: "Politique de confidentialité",
    passwordHint: "Utilisez au moins 8 caractères",
    secureNote: "Vos informations sont protégées par un chiffrement sécurisé.",
  },
};

function GoogleMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-5 place-items-center rounded-full bg-[conic-gradient(from_-45deg,#4285f4_0_25%,#34a853_0_50%,#fbbc05_0_75%,#ea4335_0)] text-[10px] font-extrabold text-white"
    >
      G
    </span>
  );
}

export function AuthForm({ mode, lang, dict }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const isSignUp = mode === "sign-up";
  const copy = supplementalCopy[lang];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="w-full max-w-[480px]">
      <div className="mb-8">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-sm font-semibold text-(--color-primary) shadow-(--shadow-sm)">
          <span className="size-1.5 rounded-full bg-(--color-secondary) shadow-[0_0_0_4px_var(--color-secondary-faint)]" />
          {isSignUp ? dict.nav.sign_up : dict.nav.sign_in}
        </span>
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold tracking-[-0.045em] text-(--color-dark)">
          {isSignUp ? dict.auth.sign_up_title : dict.auth.sign_in_title}
        </h1>
        <p className="mt-3 text-base leading-7 text-(--color-text-muted)">
          {isSignUp ? dict.auth.sign_up_subtitle : dict.auth.sign_in_subtitle}
        </p>
      </div>

      <button
        type="button"
        className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 text-[0.9375rem] font-semibold text-(--color-dark) shadow-(--shadow-sm) transition-colors hover:border-(--color-dark) hover:bg-(--color-bg)"
      >
        <GoogleMark />
        {copy.google}
      </button>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-(--color-border)" />
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-(--color-text-light)">
          {dict.common.or}
        </span>
        <span className="h-px flex-1 bg-(--color-border)" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && (
          <div>
            <label htmlFor="full-name">{dict.auth.full_name}</label>
            <div className="relative">
              <UserRound
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
              />
              <input
                id="full-name"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder={dict.auth.full_name}
                className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>
          </div>
        )}

        {isSignUp ? (
          <div>
            <label htmlFor="identifier">
              {dict.auth.email} / {dict.auth.phone}
            </label>
            <div className="relative">
              <AtSign
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
              />
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                placeholder="name@example.com / +880 1XXX-XXXXXX"
                required
                className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="email">{dict.auth.email}</label>
            <div className="relative">
              <Mail
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
              />
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@example.com"
                required
                className="h-12 rounded-lg ps-11 pe-4 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>
          </div>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <label htmlFor="password" className="mb-0">
              {dict.auth.password}
            </label>
            {!isSignUp && (
              <Link
                href={`/${lang}/forgot-password`}
                className="text-sm font-semibold text-(--color-primary) hover:text-(--color-primary-dark)"
              >
                {dict.auth.forgot_password}
              </Link>
            )}
          </div>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              size={18}
              className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              placeholder="••••••••"
              className="h-12 rounded-lg ps-11 pe-12 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute end-1.5 top-1/2 size-9 -translate-y-1/2 rounded-lg !p-0 text-(--color-text-light) hover:bg-(--color-bg) hover:text-(--color-dark)"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {isSignUp && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-(--color-text-muted)">
              <Check size={15} className="text-(--color-success)" />
              {copy.passwordHint}
            </p>
          )}
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirm-password">{dict.auth.confirm_password}</label>
            <div className="relative">
              <LockKeyhole
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
              />
              <input
                id="confirm-password"
                name="confirmPassword"
                type={showConfirmation ? "text" : "password"}
                autoComplete="new-password"
                placeholder="••••••••"
                className="h-12 rounded-lg ps-11 pe-12 focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
              <button
                type="button"
                aria-label={showConfirmation ? "Hide password" : "Show password"}
                aria-pressed={showConfirmation}
                onClick={() => setShowConfirmation((visible) => !visible)}
                className="absolute end-1.5 top-1/2 size-9 -translate-y-1/2 rounded-lg !p-0 text-(--color-text-light) hover:bg-(--color-bg) hover:text-(--color-dark)"
              >
                {showConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}

        {!isSignUp && (
          <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-(--color-text-muted)">
            <input type="checkbox" name="remember" />
            {dict.auth.remember_me}
          </label>
        )}

        {isSignUp && (
          <p className="text-sm leading-6 text-(--color-text-muted)">
            {copy.termsLead}{" "}
            <Link href="#" className="font-semibold text-(--color-primary)">
              {copy.terms}
            </Link>{" "}
            {dict.common.and}{" "}
            <Link href="#" className="font-semibold text-(--color-primary)">
              {copy.privacy}
            </Link>
            .
          </p>
        )}

        <button
          type="submit"
          className="group h-12 w-full rounded-lg bg-[#0a0a0a] px-4 text-sm font-medium text-white transition-colors hover:bg-black/90"
        >
          {isSignUp ? copy.signUp : copy.signIn}
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
          />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-(--color-text-muted)">
        {isSignUp ? dict.auth.have_account : dict.auth.no_account}{" "}
        <Link
          href={`/${lang}/${isSignUp ? "sign-in" : "sign-up"}`}
          className="font-bold text-(--color-primary) hover:text-(--color-primary-dark)"
        >
          {isSignUp ? dict.nav.sign_in : dict.nav.sign_up}
        </Link>
      </p>

      <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-(--color-text-light)">
        <LockKeyhole size={13} />
        {copy.secureNote}
      </p>
    </div>
  );
}
