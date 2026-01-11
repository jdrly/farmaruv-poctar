import { Store, Effect } from '@tanstack/store'

export type Language = 'cs' | 'en'

interface LanguageState {
  language: Language
}

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'cs'
  const stored = localStorage.getItem('language')
  if (stored === 'cs' || stored === 'en') return stored
  return 'cs'
}

export const languageStore = new Store<LanguageState>({
  language: getInitialLanguage(),
})

// Persist language to localStorage
const persistEffect = new Effect({
  deps: [languageStore],
  fn: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', languageStore.state.language)
    }
  },
})
persistEffect.mount()

export const languageActions = {
  setLanguage: (language: Language) => {
    languageStore.setState({ language })
  },
  toggleLanguage: () => {
    languageStore.setState((state) => ({
      language: state.language === 'cs' ? 'en' : 'cs',
    }))
  },
}
