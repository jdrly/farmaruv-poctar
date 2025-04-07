export type Language = 'en' | 'cs';

export interface Translations {
  signIn: {
    title: string;
    description: string;
    email: string;
    password: string;
    forgotPassword: string;
    submitButton: string;
    noAccount: string;
    registerLink: string;
    error: string;
  };
  signUp: {
    title: string;
    description: string;
    email: string;
    password: string;
    submitButton: string;
    hasAccount: string;
    loginLink: string;
  };
  common: {
    termsAgreement: string;
    termsOfService: string;
    and: string;
    privacyPolicy: string;
  };
}

export const translations: Record<Language, Translations> = {
  cs: {
    signIn: {
      title: 'Farmářův počtář',
      description: 'Přihlaste se ke svému účtu',
      email: 'Email',
      password: 'Heslo',
      forgotPassword: 'Zapomněli jste heslo?',
      submitButton: 'Přihlásit se',
      noAccount: 'Nemáte účet?',
      registerLink: 'Zaregistrovat se',
      error: 'Chyba při přihlašování:'
    },
    signUp: {
      title: 'Vytvořit účet',
      description: 'Zaregistrujte se pro nový účet',
      email: 'Email',
      password: 'Heslo',
      submitButton: 'Zaregistrovat se',
      hasAccount: 'Již máte účet?',
      loginLink: 'Přihlásit se'
    },
    common: {
      termsAgreement: 'Kliknutím na pokračovat souhlasíte s našimi',
      termsOfService: 'Podmínkami služby',
      and: 'a',
      privacyPolicy: 'Zásadami ochrany osobních údajů'
    }
  },
  en: {
    signIn: {
      title: 'Welcome back',
      description: 'Login to your account',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot your password?',
      submitButton: 'Login',
      noAccount: 'Don\'t have an account?',
      registerLink: 'Sign up',
      error: 'Error signing in:'
    },
    signUp: {
      title: 'Create an account',
      description: 'Sign up for a new account',
      email: 'Email',
      password: 'Password',
      submitButton: 'Sign up',
      hasAccount: 'Already have an account?',
      loginLink: 'Sign in instead'
    },
    common: {
      termsAgreement: 'By clicking continue, you agree to our',
      termsOfService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy'
    }
  }
};