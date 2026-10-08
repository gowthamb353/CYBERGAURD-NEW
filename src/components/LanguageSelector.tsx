import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { LANGUAGES, setAppLanguage } from '../i18n';
import { useAuth } from '../context/AuthContext';

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { i18n } = useTranslation();
  const { user, updateUserProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = async (code: string) => {
    setAppLanguage(code);
    setIsOpen(false);
    if (user) {
      try {
        await updateUserProfile({ language: code });
      } catch {
        // quiet fallback
      }
    }
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select interface language"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg cyber-glass border border-cyan-500/20 text-slate-200 hover:text-cyan-300 hover:border-cyan-400/40 transition-colors text-xs font-medium cursor-pointer"
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        {!compact && <span>{currentLang.native}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl cyber-glass-glow bg-[#0b1728]/95 border border-cyan-500/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider border-b border-cyan-500/10 mb-1">
            Choose Language
          </div>
          <div className="grid grid-cols-1 gap-1">
            {LANGUAGES.map((lang) => {
              const isSelected = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelectLanguage(lang.code)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-200 font-semibold border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{lang.native}</span>
                    <span className="text-[10px] text-slate-400">{lang.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
