import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Shield,
  Flame,
  Zap,
  ArrowRight,
  Fish,
  Flag,
  Lock,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { xpProgressInCurrentLevel } from '../config/gameRules';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const xpMeta = xpProgressInCurrentLevel(user.xp || 0);

  // Determine current active mission
  const activeMissionId = 'm_phishing';
  const completedCount = user.completedMissions?.length || 0;

  const shortcuts = [
    {
      id: 'phish',
      title: t('games.phishTitle'),
      desc: t('home.phishDesc'),
      icon: Fish,
      action: () => navigate('/missions/m_phishing'),
      color: 'border-cyan-500/30 hover:border-cyan-400',
      iconBg: 'bg-cyan-500/15 text-cyan-400',
    },
    {
      id: 'scam',
      title: t('games.redFlagTitle'),
      desc: t('home.scamDesc'),
      icon: Flag,
      action: () => navigate('/missions/m_scam'),
      color: 'border-purple-500/30 hover:border-purple-400',
      iconBg: 'bg-purple-500/15 text-purple-400',
    },
    {
      id: 'password',
      title: t('games.passwordTitle'),
      desc: t('home.passDesc'),
      icon: Lock,
      action: () => navigate('/missions/m_password'),
      color: 'border-emerald-500/30 hover:border-emerald-400',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Operative Header & XP Progression Card */}
      <div className="cyber-glass-glow rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#071527] to-[#0a1b32] border border-cyan-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-xl shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {user.avatar === 'avatar-1' ? '🛡️' : '⚡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {t('home.agentGreeting', { name: user.name })}
                </h1>
              </div>
              <p className="text-xs text-cyan-400 font-mono mt-0.5">
                {t('home.rank', { level: xpMeta.currentLevel })} · {user.xp || 0} XP
              </p>
            </div>
          </div>

          {/* Streak Badge */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tabular-nums">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{t('home.streak', { count: user.streak || 1 })}</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Level Progress</span>
            <span className="text-cyan-300 font-mono tabular-nums">
              {xpMeta.xpInLevel} / {xpMeta.xpNeededForLevel} XP ({xpMeta.progressPercent}%)
            </span>
          </div>
          <div className="h-3 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-cyan-500/20">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
              style={{ width: `${xpMeta.progressPercent}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400 text-right">
            {t('home.xpToNext', {
              xp: xpMeta.xpNeededForLevel - xpMeta.xpInLevel,
              next: xpMeta.currentLevel + 1,
            })}
          </div>
        </div>
      </div>

      {/* Dominant Visual Anchor: One CONTINUE MISSION Card */}
      <div className="cyber-glass-glow rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#08182b] via-[#09223d] to-[#0d1e38] border-2 border-cyan-400/50 relative overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.18)]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono font-semibold">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACTIVE DIRECTIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Phishing Hunter Simulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.activeMissionDesc')} Neutralize deceptive emails, identify fake banking alerts, and protect team identities.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/missions/${activeMissionId}`)}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>{t('home.continueMission')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 Small Tactical Shortcuts */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider px-1">
          {t('home.quickLaunch')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shortcuts.map((sc) => {
            const Icon = sc.icon;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={sc.action}
                className={`p-4 rounded-2xl cyber-glass bg-[#081524]/80 border ${sc.color} flex items-center gap-4 text-left hover:scale-[1.02] transition-transform cursor-pointer shadow-sm group`}
              >
                <div className={`w-11 h-11 rounded-xl ${sc.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {sc.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {sc.desc}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Goal Card */}
      <div className="p-5 rounded-2xl cyber-glass bg-[#06101c]/90 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">{t('home.dailyGoal')}</div>
            <div className="text-xs text-slate-400 mt-0.5">{t('home.dailyGoalDesc')}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-cyan-300 font-mono tabular-nums">
            {completedCount > 0 ? `${completedCount}/3 Completed` : '0/3 Completed'}
          </div>
          <button
            type="button"
            onClick={() => navigate('/missions')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Engage
          </button>
        </div>
      </div>
    </div>
  );
};
