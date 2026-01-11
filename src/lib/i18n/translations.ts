import type { Language } from '@/stores/language.store'

export interface Translations {
  auth: {
    title: string
    signInDescription: string
    signUpDescription: string
    email: string
    emailPlaceholder: string
    password: string
    forgotPassword: string
    signInButton: string
    signUpButton: string
    noAccount: string
    hasAccount: string
    signUpLink: string
    signInLink: string
    error: string
    termsAgreement: string
    termsOfService: string
    and: string
    privacyPolicy: string
    signingIn: string
    signingUp: string
  }
  common: {
    appName: string
    loading: string
    error: string
    retry: string
  }
  nav: {
    calculator: string
    breederValues: string
    gdpr: string
    feedback: string
    info: string
    signOut: string
  }
}

export const translations: Record<Language, Translations> = {
  cs: {
    auth: {
      title: 'Farmářův počtář',
      signInDescription: 'Přihlaste se ke svému účtu',
      signUpDescription: 'Vytvořte si nový účet',
      email: 'Email',
      emailPlaceholder: 'vas@email.cz',
      password: 'Heslo',
      forgotPassword: 'Zapomněli jste heslo?',
      signInButton: 'Přihlásit se',
      signUpButton: 'Zaregistrovat se',
      noAccount: 'Nemáte účet?',
      hasAccount: 'Již máte účet?',
      signUpLink: 'Zaregistrujte se',
      signInLink: 'Přihlaste se',
      error: 'Chyba:',
      termsAgreement: 'Kliknutím na pokračovat souhlasíte s našimi',
      termsOfService: 'Podmínkami služby',
      and: 'a',
      privacyPolicy: 'Zásadami ochrany osobních údajů',
      signingIn: 'Přihlašování...',
      signingUp: 'Registrace...',
    },
    common: {
      appName: 'Farmářův počtář',
      loading: 'Načítání...',
      error: 'Došlo k chybě',
      retry: 'Zkusit znovu',
    },
    nav: {
      calculator: 'Kalkulačka',
      breederValues: 'Hodnoty od chovatelů',
      gdpr: 'GDPR',
      feedback: 'Zpětná vazba',
      info: 'Informace',
      signOut: 'Odhlásit se',
    },
  },
  en: {
    auth: {
      title: "Farmer's Calculator",
      signInDescription: 'Sign in to your account',
      signUpDescription: 'Create a new account',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      signInButton: 'Sign in',
      signUpButton: 'Sign up',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      signUpLink: 'Sign up',
      signInLink: 'Sign in',
      error: 'Error:',
      termsAgreement: 'By clicking continue, you agree to our',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      signingIn: 'Signing in...',
      signingUp: 'Signing up...',
    },
    common: {
      appName: "Farmer's Calculator",
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Try again',
    },
    nav: {
      calculator: 'Calculator',
      breederValues: 'Breeder Values',
      gdpr: 'Privacy Policy',
      feedback: 'Feedback',
      info: 'Information',
      signOut: 'Sign out',
    },
  },
}
