import { FaCode } from 'react-icons/fa';
import { languageIcons } from './languageIcons';

export const truncateText = (text = '', maxLength = 125) =>
  text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

// Accepts a single language name or a list; returns up to 3 unique icon components.
export const getLanguageIconComponents = (languages) => {
  const list = typeof languages === 'string' ? [languages] : [...new Set(languages)];
  return list.slice(0, 3).map((lang) => languageIcons[lang] || FaCode);
};
