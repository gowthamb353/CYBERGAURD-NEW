import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { BarChart2, Lightbulb, Target, Shield, CheckCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProgressPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user) return null;

  const stats = user.stats || {};
  const phishingVal = stats.phishingAccuracy || 85;
  const scamVal = stats.scamAccuracy || 80;
  const passwordVal = stats.passwordScore || 75;
  const privacyVal = stats.privacyScore || 85;
  const socialVal = 70;

  const radarData = [
    { subject: 'Phishing', A: phishingVal, fullMark: 100 },
    { subject: 'Scam Detection', A: scamVal, fullMark: 100 },
    { subject: 'Passwords', A: passwordVal, fullMark: 100 },
    { subject: 'Data Privacy', A: privacyVal, fullMark: 100 },
    { subject: 'Social Eng.', A: socialVal, fullMark: 100 },
  ];

  const barData = [
    { name: 'Phishing', score: phishingVal },
    { name: 'Scam', score: scamVal },
    { name: 'Password', score: passwordVal },
    { name: 'Privacy', score: privacyVal },
    { name: 'Social', score: socialVal },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('progress.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t('progress.subtitle')}
        </p>
      </div>

      {/* Metric summary counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl cyber-glass bg-[#081524] border border-cyan-500/20">
          <div className="text-[11px] text-slate-400 font-mono">AVG ACCURACY</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {Math.round((phishingVal + scamVal + privacyVal) / 3)}%
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Optimal Defense</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl cyber-glass bg-[#081524] border border-cyan-500/20">
          <div className="text-[11px] text-slate-400 font-mono">SIMULATIONS</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1">
            {stats.totalChallengesCompleted || 8}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Total drills completed</div>
        </div>

        <div className="p-4 rounded-2xl cyber-glass bg-[#081524] border border-cyan-500/20">
          <div className="text-[11px] text-slate-400 font-mono">DEFENSE STREAK</div>
          <div className="text-2xl font-bold text-amber-300 font-mono mt-1">
            {user.streak || 1} Days
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1">Active readiness</div>
        </div>

        <div className="p-4 rounded-2xl cyber-glass bg-[#081524] border border-cyan-500/20">
          <div className="text-[11px] text-slate-400 font-mono">TOP DISCIPLINE</div>
          <div className="text-xl font-bold text-purple-300 truncate mt-1">
            Phishing
          </div>
          <div className="text-[10px] text-purple-400/80 mt-1">Rank Tier 3</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="cyber-glass-glow rounded-3xl p-6 bg-[#081628] border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {t('progress.skillRadar')}
            </span>
            <span className="text-[11px] font-mono text-cyan-400">5 DEFENSE AXES</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#0e3a5a" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#0e3a5a" />
                <Radar
                  name="Guardian Score"
                  dataKey="A"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="cyber-glass-glow rounded-3xl p-6 bg-[#081628] border border-cyan-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Discipline Proficiency (%)
            </span>
            <span className="text-[11px] font-mono text-cyan-400">BENCHMARK 100</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071526',
                    borderColor: '#06b6d4',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="score" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* One Personalized Tactical Recommendation Card */}
      <div className="p-6 rounded-3xl cyber-glass-glow bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-[#071324] border-2 border-cyan-400/40 shadow-xl flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
          <Lightbulb className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              {t('progress.recommendation')}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
              AI ADVISER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Your threat detection accuracy in <strong className="text-cyan-300">Phishing Hunter</strong> is exceptional (92%). However, expanding your entropy composition in <strong className="text-cyan-300">Password Fortress</strong> and rehearsing out-of-band verification in <strong className="text-cyan-300">Social Engineering</strong> will unlock the elite <strong className="text-emerald-300">Cyber Guardian</strong> badge.
          </p>
        </div>
      </div>
    </div>
  );
};
