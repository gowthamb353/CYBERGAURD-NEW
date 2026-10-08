import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  Play,
  ArrowRight,
  Fish,
  Flag,
  KeyRound,
  EyeOff,
  Users,
} from 'lucide-react';
import { Mission } from '../types';
import { api } from '../services/api';

export const MissionsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getMissions();
      setMissions(res.missions);
    } catch (err: any) {
      setError(err.message || 'Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const getMissionIcon = (cat: string) => {
    switch (cat) {
      case 'phishing':
        return Fish;
      case 'scam':
        return Flag;
      case 'password':
        return KeyRound;
      case 'privacy':
        return EyeOff;
      case 'social_engineering':
        return Users;
      default:
        return ShieldCheck;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Retrieving tactical operations matrix...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center cyber-glass rounded-2xl max-w-md mx-auto my-12">
        <p className="text-sm text-red-300 mb-4">{error}</p>
        <button
          onClick={fetchMissions}
          className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
        >
          {t('app.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('missions.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          {t('missions.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {missions.map((mission, idx) => {
          const Icon = getMissionIcon(mission.category);
          const title = mission.title[i18n.language] || mission.title['en'] || 'Mission';
          const description =
            mission.description[i18n.language] || mission.description['en'] || '';

          return (
            <div
              key={mission.id}
              className={`p-6 rounded-2xl transition-all relative overflow-hidden border ${
                mission.isCompleted
                  ? 'cyber-glass bg-[#081829]/90 border-cyan-500/40'
                  : mission.isUnlocked
                  ? 'cyber-glass-glow bg-[#0a1f38]/90 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Status Indicator Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                      mission.isCompleted
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                        : mission.isUnlocked
                        ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {mission.isCompleted ? (
                      <CheckCircle className="w-7 h-7 text-emerald-400" />
                    ) : mission.isUnlocked ? (
                      <Icon className="w-7 h-7 text-cyan-300" />
                    ) : (
                      <Lock className="w-6 h-6 text-slate-500" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        OPERATION 0{idx + 1}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          mission.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : mission.isUnlocked
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {mission.isCompleted
                          ? t('missions.completed')
                          : mission.isUnlocked
                          ? t('missions.unlocked')
                          : t('missions.locked')}
                      </span>
                      <span className="text-xs text-amber-300 font-mono tabular-nums">
                        {t('missions.reward', { xp: mission.xpReward })}
                      </span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-2 md:pt-0">
                  {mission.isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/missions/${mission.id}`)}
                      className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-lg ${
                        mission.isCompleted
                          ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                          : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-cyan-500/25'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{mission.isCompleted ? 'REPLAY' : t('missions.play')}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-500 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{t('missions.reqPrev')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
