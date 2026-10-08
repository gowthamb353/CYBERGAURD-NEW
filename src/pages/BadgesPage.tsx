import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Lock, ShieldCheck, Fish, Flag, EyeOff, Shield } from 'lucide-react';
import { api } from '../services/api';
import { BadgeItem } from '../types';
import { BadgeModal } from '../components/BadgeModal';

export const BadgesPage: React.FC = () => {
  const { t } = useTranslation();
  const [badges, setBadges] = useState<BadgeItem[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getBadges()
      .then((res) => setBadges(res.badges))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Fish':
        return Fish;
      case 'Flag':
        return Flag;
      case 'Lock':
        return Lock;
      case 'EyeOff':
        return EyeOff;
      case 'Award':
        return Award;
      default:
        return ShieldCheck;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Loading credentials and operational badges...
        </div>
      </div>
    );
  }

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('badges.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('badges.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl cyber-glass border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold self-start sm:self-auto">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>{unlockedCount} / {badges.length} UNLOCKED</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((b) => {
          const Icon = getBadgeIcon(b.icon);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBadge(b)}
              className={`p-5 rounded-2xl flex flex-col items-center text-center transition-all cursor-pointer border group ${
                b.isUnlocked
                  ? 'cyber-glass-glow bg-[#091a2e]/90 border-cyan-400/50 hover:border-cyan-300 hover:scale-105 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-500 hover:border-slate-700'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border transition-transform ${
                  b.isUnlocked
                    ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 group-hover:scale-110'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {b.isUnlocked ? (
                  <Icon className="w-7 h-7 text-cyan-300" />
                ) : (
                  <Lock className="w-6 h-6 text-slate-600" />
                )}
              </div>

              <div
                className={`text-xs font-bold leading-tight ${
                  b.isUnlocked ? 'text-white group-hover:text-cyan-300' : 'text-slate-500'
                }`}
              >
                {b.name}
              </div>

              <div className="text-[10px] text-slate-400 font-mono mt-1 capitalize">
                {b.isUnlocked ? (
                  <span className="text-emerald-400 font-semibold">Awarded</span>
                ) : (
                  <span className="text-slate-500">Locked</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
};
