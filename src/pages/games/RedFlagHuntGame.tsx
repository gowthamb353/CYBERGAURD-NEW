import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Flag,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Bot,
  Star,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AICoachModal } from '../../components/AICoachModal';

export const RedFlagHuntGame: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { notifyChallengeComplete } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [introCountdown, setIntroCountdown] = useState(5);

  // Selected flags
  const [foundFlags, setFoundFlags] = useState<string[]>([]);
  const [wrongTaps, setWrongTaps] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  // AI Coach modal
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.getChallenges('m_scam');
      setChallenges(res.challenges);
      setCurrentChallengeIndex(0);
      setFoundFlags([]);
      setWrongTaps(0);
      setSubmitted(false);
      setResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    const interval = setInterval(() => {
      setIntroCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowIntro(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showIntro]);

  const currentChallenge = challenges[currentChallengeIndex];

  const handleTapFlag = (flagId: string) => {
    if (submitted) return;
    if (!foundFlags.includes(flagId)) {
      setFoundFlags((prev) => [...prev, flagId]);
    }
  };

  const handleWrongTap = () => {
    if (submitted) return;
    setWrongTaps((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!currentChallenge || submitted) return;
    try {
      const res = await api.submitChallenge(
        currentChallenge.id,
        'm_scam',
        foundFlags
      );
      setSubmitted(true);
      setResult(res);
      notifyChallengeComplete(undefined, res.newlyAwardedBadges);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNextChallenge = () => {
    if (currentChallengeIndex + 1 < challenges.length) {
      setCurrentChallengeIndex((prev) => prev + 1);
      setFoundFlags([]);
      setWrongTaps(0);
      setSubmitted(false);
      setResult(null);
    } else {
      navigate('/missions');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Loading Red Flag Hunt scenarios...
        </div>
      </div>
    );
  }

  // 5-second intro
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md cyber-glass-glow rounded-3xl bg-[#081524] border-2 border-cyan-400 p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Flag className="w-8 h-8 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{t('games.redFlagTitle')}</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t('games.redFlagHowTo')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs text-slate-300 text-left space-y-1">
            <div className="text-cyan-400 font-semibold">Tappable anomalies:</div>
            <div>• Fake sender domain extensions</div>
            <div>• Panic urgency or advance payment requests</div>
            <div>• Dangerous executable or remote-access links</div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-mono text-cyan-400">
              Starting in {introCountdown}s...
            </span>
            <button
              type="button"
              onClick={() => setShowIntro(false)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer"
            >
              {t('games.startDrill')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scenario = currentChallenge?.scenario || {};
  const redFlagsList = currentChallenge?.redFlags || [];
  const totalFlagsCount = redFlagsList.length || 3;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-mono font-bold">
            <Flag className="w-3.5 h-3.5" />
            <span>
              {t('games.flagsFound', { count: foundFlags.length, total: totalFlagsCount })}
            </span>
          </div>

          {wrongTaps > 0 && (
            <span className="text-xs text-slate-400 font-mono">
              Wrong Taps: <span className="text-amber-400 font-bold">{wrongTaps}</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsAICoachOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg cyber-glass border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 text-xs font-semibold cursor-pointer"
        >
          <Bot className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t('games.hint')}</span>
        </button>
      </div>

      {/* Simulated Email / Message Inspector with interactive segments */}
      <div className="cyber-glass-glow rounded-3xl p-6 sm:p-7 bg-[#091728] border-2 border-cyan-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs">
          <span className="font-mono text-cyan-400 font-bold uppercase">
            TARGET MESSAGE TELEMETRY
          </span>
          <span className="text-[11px] text-slate-400">Tap suspicious segments</span>
        </div>

        {/* Sender line */}
        <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/15 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400">From:</span>
            <button
              type="button"
              onClick={() => handleTapFlag(redFlagsList[0]?.id || 'flag_domain')}
              className={`px-2.5 py-1 rounded-lg text-left font-mono transition-all cursor-pointer border ${
                foundFlags.includes(redFlagsList[0]?.id || 'flag_domain')
                  ? 'bg-red-500/30 border-red-400 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                  : 'bg-slate-900 border-slate-700 hover:border-cyan-400 text-cyan-300'
              }`}
            >
              {scenario.sender}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-slate-400">Subject:</span>
            <span
              onClick={handleWrongTap}
              className="text-slate-200 font-semibold cursor-pointer hover:bg-slate-900 px-2 py-0.5 rounded"
            >
              {scenario.subject}
            </span>
          </div>
        </div>

        {/* Message body with interactive text segments */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-cyan-500/15 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3">
          <p onClick={handleWrongTap} className="cursor-pointer hover:bg-slate-800/40 p-1 rounded">
            {scenario.salutation || 'Hello,'}
          </p>

          <p onClick={handleWrongTap} className="cursor-pointer hover:bg-slate-800/40 p-1 rounded">
            {scenario.bodyP1}
          </p>

          {/* Suspicious Part 2 (Advance Fee / Panic Phone) */}
          <div
            onClick={() => handleTapFlag(redFlagsList[1]?.id || 'flag_advance_fee')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
              foundFlags.includes(redFlagsList[1]?.id || 'flag_advance_fee')
                ? 'bg-red-500/30 border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-950/40'
            }`}
          >
            <span className="font-semibold">{scenario.bodyP2}</span>
          </div>

          {/* Suspicious Part 3 (Malicious Link / Remote Access) */}
          <div
            onClick={() => handleTapFlag(redFlagsList[2]?.id || 'flag_malicious_link')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer border ${
              foundFlags.includes(redFlagsList[2]?.id || 'flag_malicious_link')
                ? 'bg-red-500/30 border-red-400 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'border-dashed border-slate-700 hover:border-cyan-400/60 bg-slate-950/40 font-mono text-cyan-300'
            }`}
          >
            <span>{scenario.bodyP3}</span>
          </div>

          <p onClick={handleWrongTap} className="cursor-pointer hover:bg-slate-800/40 p-1 rounded text-slate-400 text-xs">
            {scenario.signoff || 'Security Administration'}
          </p>
        </div>

        {/* Found Flags Explanation List */}
        {foundFlags.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-cyan-500/15">
            <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Red Flags Identified ({foundFlags.length}):</span>
            </div>
            {foundFlags.map((flagId) => {
              const flagDef = redFlagsList.find((rf) => rf.id === flagId);
              const exp = flagDef?.explanation?.[i18n.language] || flagDef?.explanation?.['en'] || 'Critical threat trigger identified.';
              return (
                <div
                  key={flagId}
                  className="p-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-slate-200 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{exp}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Button */}
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={foundFlags.length === 0}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-40"
          >
            SUBMIT RED FLAG REPORT
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-center space-y-4">
            <div className="text-sm font-bold text-cyan-300">
              Drill Evaluated · Score: {result?.score || 100}% (+{result?.xpEarned || 150} XP)
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              {result?.explanation?.[i18n.language] || result?.explanation?.['en']}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={loadChallenges}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs"
              >
                {t('games.replay')}
              </button>
              <button
                type="button"
                onClick={handleNextChallenge}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                {t('games.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        activeScenario={currentChallenge?.scenario}
      />
    </div>
  );
};
