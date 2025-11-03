import React, { createContext, useContext, useEffect, useState } from 'react';
import { changeLanguage, getCurrentLanguage, getSupportedLanguages, isRTL } from '@/lib/i18n';
import { I18nManager } from 'react-native';

interface LanguageContextType {
  currentLanguage: string;
  supportedLanguages: { code: string; name: string }[];
  changeAppLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [rtl, setRtl] = useState<boolean>(false);

  useEffect(() => {
    const initLanguage = async () => {
      try {
        // Wait a bit to ensure i18n is initialized
        await new Promise(resolve => setTimeout(resolve, 100));
        const language = getCurrentLanguage();
        const rtlStatus = isRTL(language);
        setCurrentLanguage(language);
        setRtl(rtlStatus);
        
        // Set RTL for React Native
        if (I18nManager.isRTL !== rtlStatus) {
          I18nManager.allowRTL(rtlStatus);
          I18nManager.forceRTL(rtlStatus);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, []);

  const changeAppLanguage = async (language: string) => {
    try {
      await changeLanguage(language);
      const rtlStatus = isRTL(language);
      setCurrentLanguage(language);
      setRtl(rtlStatus);
      
      // Update RTL for React Native
      if (I18nManager.isRTL !== rtlStatus) {
        I18nManager.allowRTL(rtlStatus);
        I18nManager.forceRTL(rtlStatus);
        // Note: App needs to be reloaded for RTL changes to take full effect
      }
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        supportedLanguages: getSupportedLanguages(),
        changeAppLanguage,
        isLoading,
        isRTL: rtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}