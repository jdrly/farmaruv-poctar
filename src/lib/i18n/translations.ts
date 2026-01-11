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
    errorInvalidCredentials: string
    errorEmailInUse: string
    errorWeakPassword: string
    errorNetworkError: string
    errorGeneric: string
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
    save: string
    cancel: string
    delete: string
    add: string
    edit: string
    currency: string
  }
  nav: {
    calculator: string
    breederValues: string
    gdpr: string
    feedback: string
    info: string
    signOut: string
  }
  calculator: {
    title: string
    description: string
    animalCount: string
    animalCountPlaceholder: string
    expenses: string
    expensesDescription: string
    income: string
    incomeDescription: string
    item: string
    value: string
    addCustomItem: string
    customItemTooltip: string
    customItemPlaceholder: string
    summary: string
    totalMonthlyExpenses: string
    totalYearlyExpenses: string
    totalMonthlyIncome: string
    totalYearlyIncome: string
    monthlyPerAnimal: string
    yearlyPerAnimal: string
    overallStatus: string
    monthlyBalance: string
    yearlyBalance: string
    noAnimalCount: string
    profit: string
    loss: string
    initializingData: string
    errorInitializing: string
    errorSaving: string
    errorDeleting: string
  }
  notFound: {
    title: string
    message: string
    backToHome: string
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
      errorInvalidCredentials: 'Nesprávný email nebo heslo. Zkuste to prosím znovu.',
      errorEmailInUse: 'Tento email je již registrován. Zkuste se přihlásit.',
      errorWeakPassword: 'Heslo musí mít alespoň 8 znaků.',
      errorNetworkError: 'Problém s připojením. Zkontrolujte internet a zkuste to znovu.',
      errorGeneric: 'Něco se pokazilo. Zkuste to prosím znovu.',
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
      save: 'Uložit',
      cancel: 'Zrušit',
      delete: 'Smazat',
      add: 'Přidat',
      edit: 'Upravit',
      currency: 'Kč',
    },
    nav: {
      calculator: 'Kalkulačka',
      breederValues: 'Hodnoty od chovatelů',
      gdpr: 'GDPR',
      feedback: 'Zpětná vazba',
      info: 'Informace',
      signOut: 'Odhlásit se',
    },
    calculator: {
      title: 'Kalkulačka nákladů chovu',
      description: 'Finanční kalkulačka pro drobné chovatele králíků a drůbeže.',
      animalCount: 'Počet chovaných zvířat',
      animalCountPlaceholder: 'Zadejte počet zvířat',
      expenses: 'Náklady na chov',
      expensesDescription: 'Zadejte své náklady na krmivo, vybavení, veterinární péči a další.',
      income: 'Příjmy',
      incomeDescription: 'Zadejte příjmy z prodeje masa, vajec, živých zvířat a dotací.',
      item: 'Položka',
      value: 'Hodnota',
      addCustomItem: '+ Přidat vlastní položku',
      customItemTooltip: 'Počítá se jako hodnota za měsíc',
      customItemPlaceholder: 'Vlastní položka',
      summary: 'Souhrn',
      totalMonthlyExpenses: 'Celkové měsíční náklady',
      totalYearlyExpenses: 'Celkové roční náklady',
      totalMonthlyIncome: 'Celkové měsíční příjmy',
      totalYearlyIncome: 'Celkové roční příjmy',
      monthlyPerAnimal: 'Měsíční náklad na 1 zvíře',
      yearlyPerAnimal: 'Roční náklad na 1 zvíře',
      overallStatus: 'Celkový stav chovu',
      monthlyBalance: 'Měsíční bilance',
      yearlyBalance: 'Roční bilance',
      noAnimalCount: '—',
      profit: 'Zisk',
      loss: 'Ztráta',
      initializingData: 'Inicializace dat...',
      errorInitializing: 'Nepodařilo se inicializovat kalkulačku. Obnovte prosím stránku.',
      errorSaving: 'Nepodařilo se uložit. Zkuste to prosím znovu.',
      errorDeleting: 'Nepodařilo se smazat položku. Zkuste to prosím znovu.',
    },
    notFound: {
      title: '404',
      message: 'Stránka nenalezena',
      backToHome: 'Zpět na úvodní stránku',
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
      errorInvalidCredentials: 'Invalid email or password. Please try again.',
      errorEmailInUse: 'This email is already registered. Try signing in instead.',
      errorWeakPassword: 'Password must be at least 8 characters long.',
      errorNetworkError: 'Connection problem. Check your internet and try again.',
      errorGeneric: 'Something went wrong. Please try again.',
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
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      add: 'Add',
      edit: 'Edit',
      currency: 'CZK',
    },
    nav: {
      calculator: 'Calculator',
      breederValues: 'Breeder Values',
      gdpr: 'Privacy Policy',
      feedback: 'Feedback',
      info: 'Information',
      signOut: 'Sign out',
    },
    calculator: {
      title: 'Breeding Cost Calculator',
      description: 'Financial calculator for small-scale rabbit and poultry breeders.',
      animalCount: 'Number of animals',
      animalCountPlaceholder: 'Enter number of animals',
      expenses: 'Breeding Expenses',
      expensesDescription: 'Enter your costs for feed, equipment, veterinary care, and more.',
      income: 'Income',
      incomeDescription: 'Enter income from meat sales, eggs, live animals, and subsidies.',
      item: 'Item',
      value: 'Value',
      addCustomItem: '+ Add custom item',
      customItemTooltip: 'Calculated as monthly value',
      customItemPlaceholder: 'Custom item',
      summary: 'Summary',
      totalMonthlyExpenses: 'Total Monthly Expenses',
      totalYearlyExpenses: 'Total Yearly Expenses',
      totalMonthlyIncome: 'Total Monthly Income',
      totalYearlyIncome: 'Total Yearly Income',
      monthlyPerAnimal: 'Monthly cost per animal',
      yearlyPerAnimal: 'Yearly cost per animal',
      overallStatus: 'Overall Status',
      monthlyBalance: 'Monthly Balance',
      yearlyBalance: 'Yearly Balance',
      noAnimalCount: '—',
      profit: 'Profit',
      loss: 'Loss',
      initializingData: 'Initializing data...',
      errorInitializing: 'Failed to initialize calculator. Please refresh the page.',
      errorSaving: 'Failed to save. Please try again.',
      errorDeleting: 'Failed to delete item. Please try again.',
    },
    notFound: {
      title: '404',
      message: 'Page not found',
      backToHome: 'Back to home',
    },
  },
}
