import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Crosshair,
  BookOpen,
  Award,
  BarChart2,
  Trophy,
  User,
  Bot,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAICoach: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAICoach }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  const links = [
    { to: '/home', icon: Home, label: t('nav.home') },
    { to: '/missions', icon: Crosshair, label: t('nav.missions') },
    { to: '/learn', icon: BookOpen, label: t('nav.learn') },
    { to: '/badges', icon: Award, label: t('nav.badges') },
    { to: '/progress', icon: BarChart2, label: t('nav.progress') },
    { to: '/leaderboard', icon: Trophy, label: t('nav.leaderboard') },
    { to: '/profile', icon: User, label: t('nav.profile') },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-cyan-950/40 cyber-glass h-[calc(100vh-61px)] sticky top-[61px] p-4 justify-between z-30">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
            Command Center
          </div>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* AI Cyber Coach Launcher at bottom of sidebar */}
        <div className="pt-4 border-t border-cyan-950/50">
          <button
            type="button"
            onClick={onOpenAICoach}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300">
                  {t('coach.title')}
                </div>
                <div className="text-[10px] text-cyan-400/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{t('coach.online')}</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
              24/7
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 cyber-glass border-t border-cyan-950/60 flex items-center justify-around px-2 z-40 bg-[#060e1b]/95 backdrop-blur-lg">
        {links.slice(0, 5).map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-12 h-12 rounded-lg text-[10px] transition-colors ${
                  isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="truncate max-w-[48px]">{link.label}</span>
            </NavLink>
          );
        })}
        {/* Floating Coach icon on mobile nav */}
        <button
          type="button"
          onClick={onOpenAICoach}
          className="flex flex-col items-center justify-center w-12 h-12 rounded-lg text-[10px] text-cyan-400 font-semibold cursor-pointer"
        >
          <Bot className="w-5 h-5 mb-0.5 text-cyan-400" />
          <span>AI Coach</span>
        </button>
      </nav>
    </>
  );
};
