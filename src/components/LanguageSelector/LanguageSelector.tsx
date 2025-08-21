import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();

  const languages = [
    {
      code: 'fr',
      name: 'Français',
      flag: '🇫🇷',
      nativeName: 'Français'
    },
    {
      code: 'en',
      name: 'English',
      flag: '🇬🇧',
      nativeName: 'English'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <div className={`language-selector ${className}`}>
      <div className="language-selector__current">
        <span className="language-selector__flag">{currentLanguage.flag}</span>
        <span className="language-selector__name">{currentLanguage.nativeName}</span>
      </div>
      
      <div className="language-selector__dropdown">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`language-selector__option ${
              i18n.language === language.code ? 'language-selector__option--active' : ''
            }`}
            title={`${language.name} - ${language.nativeName}`}
          >
            <span className="language-selector__flag">{language.flag}</span>
            <span className="language-selector__name">{language.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
