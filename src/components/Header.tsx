import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Flame } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return (
      <header className="w-full flex items-center justify-between px-6 py-4 border-b border-cyan-950/40 cyber-glass z-40 sticky top-0">
        <Link to="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white hover:text-cyan-400 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <span>Cyber Guardian</span>
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </header>
    );
  }

  const navLinks = [
    { to: '/home', label: t('nav.home') },
    { to: '/missions', label: t('nav.missions') },
    { to: '/learn', label: t('nav.learn') },
    { to: '/badges', label: t('nav.badges') },
    { to: '/progress', label: t('nav.progress') },
    { to: '/leaderboard', label: t('nav.leaderboard') },
  ];

  return (
    <header className="w-full flex items-center justify-between px-6 py-3.5 border-b border-cyan-950/40 cyber-glass z-40 sticky top-0">
      {/* Zone 1: Brand title */}
      <Link to="/home" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white hover:text-cyan-300 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Shield className="w-4 h-4 text-cyan-400" />
        </div>
        <span>Cyber Guardian</span>
      </Link>

      {/* Zone 2: 4-6 text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`transition-colors py-1 ${
                isActive ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold' : 'hover:text-cyan-300'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {/* Streak indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tabular-nums">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
          <span>{user.streak || 1}d</span>
        </div>

        <LanguageSelector compact />

        <Link
          to="/profile"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg cyber-glass border border-cyan-500/20 hover:border-cyan-400/40 transition-colors cursor-pointer text-xs font-medium"
        >
          <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-semibold text-[10px]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-slate-200 truncate max-w-[100px]">{user.name}</span>
        </Link>
      </div>
    </header>
  );
};
