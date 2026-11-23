import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../i18n/languages';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

const STORAGE_KEY_LANG = 'skillsetu_lang';
const STORAGE_KEY_SELECTED = 'skillsetu_lang_selected';

export function LanguageProvider({ children }) {
  // Check localStorage for previously saved language
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('LocalStorage not accessible:', e);
    }
    return DEFAULT_LANGUAGE;
  });

  // Track if first-time language selection has been completed
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED) === 'true';
    } catch (e) {
      return false;
    }
  });

  // Control visibility of the language picker modal
  // If user hasn't selected a language yet, open it on first visit
  const [showLanguageModal, setShowLanguageModal] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SELECTED) !== 'true';
    } catch (e) {
      return true;
    }
  });

  const changeLanguage = useCallback((code) => {
    if (SUPPORTED_LANGUAGES.some(l => l.code === code)) {
      setLanguageState(code);
      try {
        localStorage.setItem(STORAGE_KEY_LANG, code);
      } catch (e) {
        console.warn('Could not save language to localStorage:', e);
      }
    }
  }, []);

  const confirmLanguage = useCallback((code) => {
    changeLanguage(code);
    setHasSelectedLanguage(true);
    setShowLanguageModal(false);
    try {
      localStorage.setItem(STORAGE_KEY_SELECTED, 'true');
    } catch (e) {
      console.warn('Could not save selection flag:', e);
    }
  }, [changeLanguage]);

  // Translation helper function supporting nested paths like 'hero.heading'
  const t = useCallback((path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language];

    // Traverse the path in current language
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = null;
        break;
      }
    }

    if (current && typeof current === 'string') {
      return current;
    }

    // Fallback to English if key missing in current language
    let fallbackCurrent = translations.en;
    for (const key of keys) {
      if (fallbackCurrent && typeof fallbackCurrent === 'object' && key in fallbackCurrent) {
        fallbackCurrent = fallbackCurrent[key];
      } else {
        fallbackCurrent = null;
        break;
      }
    }

    if (fallbackCurrent && typeof fallbackCurrent === 'string') {
      return fallbackCurrent;
    }

    return fallback || path;
  }, [language]);

  const currentLanguageMeta = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      confirmLanguage,
      hasSelectedLanguage,
      showLanguageModal,
      setShowLanguageModal,
      t,
      currentLanguageMeta,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
