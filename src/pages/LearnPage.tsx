import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, ShieldAlert, KeyRound, EyeOff, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LearnPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState<string>('phishing');

  const topics = [
    {
      id: 'phishing',
      title: 'Phishing Defense Doctrine',
      missionId: 'm_phishing',
      icon: ShieldAlert,
      tag: 'Critical',
      lessons: [
        'Inspect sender domain syntax character by character (e.g. paypa1.com vs paypal.com).',
        'Verify context before acting: banks, universities, and IT will never demand passwords or OTPs over text.',
        'Hover or tap-hold to inspect underlying destination URLs before committing any click.',
      ],
      goldenRule: 'When in doubt, open the official app directly rather than clicking incoming links.',
    },
    {
      id: 'scam',
      title: 'Scam & Anomaly Detection',
      missionId: 'm_scam',
      icon: EyeOff,
      tag: 'High Impact',
      lessons: [
        'Artificial urgency ("Account closed in 2 hours") is designed to bypass your logical judgment.',
        'Advance-fee traps lure victims by promising lottery payouts in exchange for "customs or gas fees".',
        'Executable attachments (.exe, .scr, .zip, .html) received in cold emails are almost always malware.',
      ],
      goldenRule: 'Legitimate organizations never ask you to pay an upfront fee to claim an award you never entered.',
    },
    {
      id: 'password',
      title: 'Cryptographic Fortresses',
      missionId: 'm_password',
      icon: KeyRound,
      tag: 'Foundation',
      lessons: [
        'Length dominates brute force mathematics: each additional character multiplies crack resistance exponentially.',
        'Dictionary words (e.g. "Password2026!") are cracked in seconds by automated GPU hash tables.',
        'Passphrases created from 4+ random unrelated words provide centuries of entropy while remaining memorable.',
      ],
      goldenRule: 'Enable Multi-Factor Authentication (MFA) everywhere to nullify credential stuffing leaks.',
    },
    {
      id: 'privacy',
      title: 'Identity & Device Hygiene',
      missionId: 'm_privacy',
      icon: BookOpen,
      tag: 'Essential',
      lessons: [
        'Audit smartphone permissions: simple utility apps do not require contacts, microphone, or SMS access.',
        'Avoid conducting banking or entering passwords over open, unencrypted public Wi-Fi access points.',
        'Limit social media telemetry that reveals security question answers (pet names, childhood schools, birthdays).',
      ],
      goldenRule: 'Grant least-privilege permissions: only give an application access to sensors it strictly requires.',
    },
    {
      id: 'social',
      title: 'Social Engineering Resistance',
      missionId: 'm_social',
      icon: Users,
      tag: 'Tactical',
      lessons: [
        'Attackers impersonate executives, authorities, or tech support to exploit compliance and fear.',
        'Demands for gift card PINs or emergency wire bypasses are always fraudulent.',
        'Always conduct out-of-band verification via official phone extensions before releasing sensitive records.',
      ],
      goldenRule: 'Never alter financial wire routing or release credentials based on a single email or text message.',
    },
  ];

  const currentTopic = topics.find((t) => t.id === selectedTopic) || topics[0];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('learn.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Topic selection tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {topics.map((tItem) => {
          const Icon = tItem.icon;
          const isSelected = selectedTopic === tItem.id;
          return (
            <button
              key={tItem.id}
              type="button"
              onClick={() => setSelectedTopic(tItem.id)}
              className={`p-3 rounded-xl cyber-glass text-left transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
              <div className="text-xs font-bold truncate">{tItem.title.split(' ')[0]}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tItem.tag}</div>
            </button>
          );
        })}
      </div>

      {/* Selected Lesson Card (3-Line Tactical Lessons + Test Yourself) */}
      <div className="cyber-glass-glow rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#081729] to-[#0a1e35] border border-cyan-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/15 pb-5">
          <div>
            <span className="text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              BRIEFING MODULE
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              {currentTopic.title}
            </h2>
          </div>
          <span className="text-xs text-cyan-300 font-mono px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 self-start sm:self-auto">
            {t('learn.readTime')}
          </span>
        </div>

        {/* 3-line bite-sized lessons */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Key Defense Directives:
          </div>
          <div className="grid grid-cols-1 gap-3.5">
            {currentTopic.lessons.map((lesson, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/15 flex items-start gap-3.5"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{lesson}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Golden Rule Highlight */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
              Golden Defense Rule
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              {currentTopic.goldenRule}
            </p>
          </div>
        </div>

        {/* TEST YOURSELF CTA */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/missions/${currentTopic.missionId}`)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{t('learn.testYourself')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
