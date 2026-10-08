import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Globe, GraduationCap, Medal, ArrowRight, Shield } from 'lucide-react';
import { api } from '../services/api';
import { LeaderboardEntry } from '../types';
import { useAuth } from '../context/AuthContext';

export const LeaderboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'global' | 'college'>('global');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [userHasCollege, setUserHasCollege] = useState(false);
  const [userCollege, setUserCollege] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (tab: 'global' | 'college') => {
    setLoading(true);
    try {
      const res = await api.getLeaderboard(tab);
      setEntries(res.leaderboard);
      setUserHasCollege(res.userHasCollege);
      setUserCollege(res.userCollege);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(activeTab);
  }, [activeTab]);

  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t('leaderboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('leaderboard.subtitle')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-cyan-500/20 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'global'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t('leaderboard.global')}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('college')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'college'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{t('leaderboard.college')}</span>
          </button>
        </div>
      </div>

      {/* College Tab Empty Prompt if user has not set college */}
      {activeTab === 'college' && !userHasCollege && (
        <div className="p-5 rounded-2xl cyber-glass bg-gradient-to-r from-blue-950/40 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white">
                Compete with your Academy Cohort
              </div>
              <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
                {t('leaderboard.noCollege')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/profile')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            {t('leaderboard.addCollegeBtn')}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-cyan-400 font-mono text-xs animate-pulse">
            Computing defense command standings...
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-6 pb-2">
              {/* Rank 2 (Silver) */}
              <div className="order-1 flex flex-col items-center text-center cyber-glass rounded-2xl p-4 sm:p-5 border border-slate-400/30 mt-6 bg-[#081525]">
                <div className="w-12 h-12 rounded-full bg-slate-700/60 border-2 border-slate-300 flex items-center justify-center text-slate-200 font-bold text-sm mb-2 shadow-md">
                  🥈
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate max-w-full">
                  {top3[1]?.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-full">
                  {top3[1]?.college || `Level ${top3[1]?.level}`}
                </div>
                <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono mt-2">
                  {top3[1]?.xp} XP
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-1">Rank #2</div>
              </div>

              {/* Rank 1 (Gold) */}
              <div className="order-2 flex flex-col items-center text-center cyber-glass-glow rounded-3xl p-5 sm:p-6 border-2 border-amber-400/60 bg-[#0a1e35] shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-300 flex items-center justify-center text-amber-300 font-bold text-base mb-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  🥇
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white truncate max-w-full">
                  {top3[0]?.name}
                </div>
                <div className="text-[11px] text-amber-300/80 truncate max-w-full">
                  {top3[0]?.college || `Level ${top3[0]?.level}`}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono mt-2">
                  {top3[0]?.xp} XP
                </div>
                <div className="text-[10px] font-mono font-bold text-amber-400 uppercase mt-1">
                  CHAMPION #1
                </div>
              </div>

              {/* Rank 3 (Bronze) */}
              <div className="order-3 flex flex-col items-center text-center cyber-glass rounded-2xl p-4 sm:p-5 border border-amber-700/40 mt-8 bg-[#081525]">
                <div className="w-12 h-12 rounded-full bg-amber-900/40 border-2 border-amber-600 flex items-center justify-center text-amber-400 font-bold text-sm mb-2 shadow-md">
                  🥉
                </div>
                <div className="text-xs sm:text-sm font-bold text-white truncate max-w-full">
                  {top3[2]?.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate max-w-full">
                  {top3[2]?.college || `Level ${top3[2]?.level}`}
                </div>
                <div className="text-xs sm:text-sm font-bold text-cyan-300 font-mono mt-2">
                  {top3[2]?.xp} XP
                </div>
                <div className="text-[10px] text-slate-500 uppercase mt-1">Rank #3</div>
              </div>
            </div>
          )}

          {/* Detailed Leaderboard Table */}
          <div className="cyber-glass-glow rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#081628]/95 shadow-xl">
            <div className="grid grid-cols-12 px-5 py-3.5 border-b border-cyan-500/20 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <span className="col-span-2 sm:col-span-1">{t('leaderboard.rank')}</span>
              <span className="col-span-6 sm:col-span-5">{t('leaderboard.guardian')}</span>
              <span className="hidden sm:inline sm:col-span-3">{t('leaderboard.college')}</span>
              <span className="col-span-2 sm:col-span-1">{t('leaderboard.level')}</span>
              <span className="col-span-2 text-right">{t('leaderboard.xp')}</span>
            </div>

            <div className="divide-y divide-cyan-500/10">
              {entries.map((entry, idx) => {
                const isCurrentUser = user && (entry.id === user.id || entry.name === user.name);
                return (
                  <div
                    key={entry.id || idx}
                    className={`grid grid-cols-12 px-5 py-3.5 items-center text-xs sm:text-sm transition-colors ${
                      isCurrentUser
                        ? 'bg-cyan-500/15 border-l-4 border-cyan-400 font-bold'
                        : 'hover:bg-slate-900/60'
                    }`}
                  >
                    <span className="col-span-2 sm:col-span-1 font-mono text-slate-400 font-bold">
                      #{entry.rank || idx + 1}
                    </span>
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 font-semibold text-xs shrink-0">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate text-white font-semibold">
                        {entry.name}
                        {isCurrentUser && (
                          <span className="ml-1.5 text-[10px] text-cyan-400 font-normal">
                            (You)
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="hidden sm:inline sm:col-span-3 text-xs text-slate-400 truncate">
                      {entry.college || '—'}
                    </span>
                    <span className="col-span-2 sm:col-span-1 font-mono text-slate-300">
                      Lvl {entry.level}
                    </span>
                    <span className="col-span-2 text-right font-mono font-bold text-cyan-300 tabular-nums">
                      {entry.xp} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
