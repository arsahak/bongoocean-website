"use client";

import {
  customerSigninAction,
  customerSignupAction,
  resendSignupOtpAction,
  verifySignupOtpAction,
} from "@/app/actions/auth";
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
  MessageSquare,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

type AuthMode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode: AuthMode;
  lang: Locale;
  dict: Dictionary;
  callbackUrl?: string;
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
    otpTitle: string;
    otpSubtitle: string;
    otpVerify: string;
    otpResend: string;
    otpChangeDetails: string;
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
    otpTitle: "Verify your account",
    otpSubtitle: "We sent a 6-digit code to",
    otpVerify: "Verify & continue",
    otpResend: "Resend code",
    otpChangeDetails: "Use a different email or phone",
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
    otpTitle: "আপনার অ্যাকাউন্ট যাচাই করুন",
    otpSubtitle: "আমরা একটি ৬-সংখ্যার কোড পাঠিয়েছি",
    otpVerify: "যাচাই করে এগিয়ে যান",
    otpResend: "আবার কোড পাঠান",
    otpChangeDetails: "ভিন্ন ইমেইল বা ফোন ব্যবহার করুন",
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
    otpTitle: "अपना खाता सत्यापित करें",
    otpSubtitle: "हमने एक 6-अंकीय कोड भेजा है",
    otpVerify: "सत्यापित करें और जारी रखें",
    otpResend: "कोड फिर से भेजें",
    otpChangeDetails: "अलग ईमेल या फ़ोन का उपयोग करें",
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
    otpTitle: "اپنا اکاؤنٹ تصدیق کریں",
    otpSubtitle: "ہم نے 6 ہندسوں کا کوڈ بھیجا ہے",
    otpVerify: "تصدیق کریں اور جاری رکھیں",
    otpResend: "کوڈ دوبارہ بھیجیں",
    otpChangeDetails: "مختلف ای میل یا فون استعمال کریں",
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
    otpTitle: "تحقق من حسابك",
    otpSubtitle: "أرسلنا رمزًا مكونًا من 6 أرقام إلى",
    otpVerify: "تحقق وتابع",
    otpResend: "إعادة إرسال الرمز",
    otpChangeDetails: "استخدم بريدًا إلكترونيًا أو هاتفًا مختلفًا",
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
    otpTitle: "Verifica tu cuenta",
    otpSubtitle: "Enviamos un código de 6 dígitos a",
    otpVerify: "Verificar y continuar",
    otpResend: "Reenviar código",
    otpChangeDetails: "Usar otro correo o teléfono",
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
    otpTitle: "验证您的账户",
    otpSubtitle: "我们已发送一个6位验证码至",
    otpVerify: "验证并继续",
    otpResend: "重新发送验证码",
    otpChangeDetails: "使用其他邮箱或电话",
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
    otpTitle: "Vérifiez votre compte",
    otpSubtitle: "Nous avons envoyé un code à 6 chiffres à",
    otpVerify: "Vérifier et continuer",
    otpResend: "Renvoyer le code",
    otpChangeDetails: "Utiliser un autre e-mail ou téléphone",
  },
};

const OTP_RESEND_COOLDOWN_SECONDS = 60;

export function AuthForm({ mode, lang, dict, callbackUrl: callbackUrlProp }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const isSignUp = mode === "sign-up";
  const copy = supplementalCopy[lang];

  const callbackUrl = callbackUrlProp ?? `/${lang}`;
  // React resets uncontrolled form fields right after a successful action
  // submission, so the password can't be read off the DOM afterward — track
  // it imperatively via onChange instead.
  const passwordDraftRef = useRef("");

  const [signinState, signinFormAction, signinPending] = useActionState(
    customerSigninAction,
    { ok: false, error: "" },
  );
  const [signupState, signupFormAction, signupPending] = useActionState(
    customerSignupAction,
    { ok: false, error: "" },
  );
  const [verifyState, verifyFormAction, verifyPending] = useActionState(
    verifySignupOtpAction,
    { ok: false, error: "" },
  );

  const [otpStep, setOtpStep] = useState(false);
  const [pendingIdentifier, setPendingIdentifier] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");
  const [pendingChannel, setPendingChannel] = useState<"email" | "phone">("email");

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendPending, setResendPending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (signinState.ok) {
      // Full page navigation so server components re-render with the fresh
      // session cookie instead of serving a stale RSC cache.
      window.location.href = signinState.redirectTo || callbackUrl;
    }
  }, [signinState, callbackUrl]);

  useEffect(() => {
    if (signupState.ok && signupState.otpRequired) {
      setPendingIdentifier(signupState.identifier);
      setPendingChannel(signupState.channel);
      setPendingPassword(passwordDraftRef.current);
      setOtpStep(true);
      setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
    }
  }, [signupState]);

  useEffect(() => {
    if (verifyState.ok) {
      window.location.href = verifyState.redirectTo || callbackUrl;
    }
  }, [verifyState, callbackUrl]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  async function handleResend() {
    setResendPending(true);
    setResendError("");
    setResendMessage("");
    const result = await resendSignupOtpAction(pendingIdentifier);
    setResendPending(false);
    if (result.ok) {
      setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
      setResendMessage(result.message ?? "Code resent.");
    } else {
      setResendError(result.error ?? "Could not resend the code.");
    }
  }

  const showOtpStep = isSignUp && otpStep;
  const signupError = !signupState.ok ? signupState.error : undefined;
  const detailsError = isSignUp ? signupError : signinState.error;
  const detailsPending = isSignUp ? signupPending : signinPending;

  return (
    <div className="w-full max-w-[480px]">
      <div className="mb-8">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1.5 text-sm font-semibold text-(--color-primary) shadow-(--shadow-sm)">
          <span className="size-1.5 rounded-full bg-(--color-secondary) shadow-[0_0_0_4px_var(--color-secondary-faint)]" />
          {isSignUp ? dict.nav.sign_up : dict.nav.sign_in}
        </span>
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold tracking-[-0.045em] text-(--color-dark)">
          {showOtpStep
            ? copy.otpTitle
            : isSignUp
              ? dict.auth.sign_up_title
              : dict.auth.sign_in_title}
        </h1>
        <p className="mt-3 text-base leading-7 text-(--color-text-muted)">
          {showOtpStep ? (
            <>
              {copy.otpSubtitle}{" "}
              <span className="font-semibold text-(--color-dark)">
                {pendingIdentifier}
              </span>{" "}
              {pendingChannel === "email" ? (
                <Mail aria-hidden="true" size={14} className="inline align-[-2px]" />
              ) : (
                <MessageSquare aria-hidden="true" size={14} className="inline align-[-2px]" />
              )}
            </>
          ) : isSignUp ? (
            dict.auth.sign_up_subtitle
          ) : (
            dict.auth.sign_in_subtitle
          )}
        </p>
      </div>

      {showOtpStep ? (
        <form action={verifyFormAction} className="space-y-5 mt-8">
          <input type="hidden" name="identifier" value={pendingIdentifier} />
          <input type="hidden" name="password" value={pendingPassword} />
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <div>
            <label htmlFor="otp">OTP</label>
            <div className="relative">
              <ShieldCheck
                aria-hidden="true"
                size={18}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-(--color-text-light)"
              />
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                required
                autoFocus
                className="h-12 rounded-lg ps-11 pe-4 tracking-[0.3em] focus:border-(--color-dark) focus:outline-none focus:shadow-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 text-sm">
            <button
              type="button"
              onClick={() => {
                setOtpStep(false);
                setResendMessage("");
                setResendError("");
              }}
              className="font-semibold text-(--color-primary) hover:text-(--color-primary-dark)"
            >
              {copy.otpChangeDetails}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendPending || resendCooldown > 0}
              className="font-semibold text-(--color-primary) hover:text-(--color-primary-dark) disabled:cursor-not-allowed disabled:text-(--color-text-light)"
            >
              {resendCooldown > 0 ? `${copy.otpResend} (${resendCooldown}s)` : copy.otpResend}
            </button>
          </div>

          {resendMessage && (
            <p className="text-sm font-medium text-(--color-success)">{resendMessage}</p>
          )}
          {resendError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-(--color-error)">
              {resendError}
            </p>
          )}
          {verifyState.error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-(--color-error)">
              {verifyState.error}
            </p>
          )}

          <button
            type="submit"
            disabled={verifyPending}
            className="group h-12 w-full rounded-lg bg-[#0a0a0a] px-4 text-sm font-medium text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {verifyPending ? (
              "Verifying…"
            ) : (
              <>
                {copy.otpVerify}
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                />
              </>
            )}
          </button>
        </form>
      ) : (
      <form
        action={isSignUp ? signupFormAction : signinFormAction}
        className="space-y-5 mt-8"
      >
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
            <label htmlFor="identifier">{dict.auth.email_or_phone}</label>
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
            <label htmlFor="identifier">{dict.auth.email_or_phone}</label>
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
              onChange={(e) => {
                passwordDraftRef.current = e.target.value;
              }}
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

        {detailsError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-(--color-error)">
            {detailsError}
          </p>
        )}

        <button
          type="submit"
          disabled={detailsPending}
          className="group h-12 w-full rounded-lg bg-[#0a0a0a] px-4 text-sm font-medium text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {detailsPending ? (
            isSignUp ? (
              "Creating account…"
            ) : (
              "Signing in…"
            )
          ) : (
            <>
              {isSignUp ? copy.signUp : copy.signIn}
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              />
            </>
          )}
        </button>
      </form>
      )}

      {!showOtpStep && (
        <p className="mt-7 text-center text-sm text-(--color-text-muted)">
          {isSignUp ? dict.auth.have_account : dict.auth.no_account}{" "}
          <Link
            href={`/${lang}/${isSignUp ? "sign-in" : "sign-up"}${
              callbackUrlProp ? `?callbackUrl=${encodeURIComponent(callbackUrlProp)}` : ""
            }`}
            className="font-bold text-(--color-primary) hover:text-(--color-primary-dark)"
          >
            {isSignUp ? dict.nav.sign_in : dict.nav.sign_up}
          </Link>
        </p>
      )}

      <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-(--color-text-light)">
        <LockKeyhole size={13} />
        {copy.secureNote}
      </p>
    </div>
  );
}
