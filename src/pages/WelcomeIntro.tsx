import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Search, Shield, ChevronRight } from 'lucide-react';
import { Header } from '../components/Header';

export const WelcomeIntro: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const pillars = [
    {
      id: 'learn',
      title: t('welcome.learnTitle'),
      desc: t('welcome.learnDesc'),
      icon: BookOpen,
      color: 'from-blue-500/20 to-cyan-500/10',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400',
    },
    {
      id: 'detect',
      title: t('welcome.detectTitle'),
      desc: t('welcome.detectDesc'),
      icon: Search,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      id: 'defend',
      title: t('welcome.defendTitle'),
      desc: t('welcome.defendDesc'),
      icon: Shield,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050b14] cyber-grid flex flex-col justify-between">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex-1 flex flex-col justify-center items-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-6">
          <span>OPERATIONAL DOCTRINE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {t('welcome.title')}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-12 leading-relaxed">
          {t('welcome.subtitle')}
        </p>

        {/* 3 Pillars: LEARN / DETECT / DEFEND */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`p-6 rounded-2xl cyber-glass bg-gradient-to-b ${p.color} border ${p.border} flex flex-col items-center text-center hover:scale-[1.02] transition-transform shadow-lg`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-[#071324] border ${p.border} flex items-center justify-center mb-4 ${p.iconColor}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-white tracking-wide mb-2">
                  {p.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigate('/home')}
          className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm tracking-widest uppercase flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <span>{t('welcome.startJourney')}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </main>

      <footer className="text-center py-4 text-xs text-slate-500">
        Cyber Guardian Command Center
      </footer>
    </div>
  );
};
