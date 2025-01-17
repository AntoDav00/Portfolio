import React from 'react';
import { 
  FaReact, 
  FaCode 
} from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';

// Utility per i progetti
export const truncateText = (text, maxLength = 125) => {
  return text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;
};

export const getLanguageIconComponents = (languages) => {
  const iconMap = {
    'TypeScript': SiTypescript,
    'React': FaReact,
    // Aggiungi altri mapping di icone
  };

  // Se è un singolo linguaggio
  if (typeof languages === 'string') {
    const LanguageIcon = iconMap[languages] || FaCode;
    return [LanguageIcon];
  }

  // Se sono più linguaggi
  const uniqueLanguages = [...new Set(languages)];
  return uniqueLanguages.slice(0, 3).map(lang => 
    iconMap[lang] || FaCode
  );
};
