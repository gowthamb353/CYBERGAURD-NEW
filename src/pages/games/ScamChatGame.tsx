import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  ShieldAlert,
  Bot,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AICoachModal } from '../../components/AICoachModal';

export const ScamChatGame: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { notifyChallengeComplete } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [introCountdown, setIntroCountdown] = useState(5);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.getChallenges('m_social');
      setChallenges(res.challenges);
      setSelectedOption(null);
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

  const currentChallenge = challenges[0];
  const scenario = currentChallenge?.scenario || {};

  const handleSelectOption = async (optionId: string) => {
    if (submitted) return;
    setSelectedOption(optionId);
    try {
      const res = await api.submitChallenge(
        currentChallenge.id,
        'm_social',
        optionId
      );
      setSubmitted(true);
      setResult(res);
      notifyChallengeComplete(undefined, res.newlyAwardedBadges);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Connecting to Social Engineering live simulation...
        </div>
      </div>
    );
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md cyber-glass-glow rounded-3xl bg-[#081524] border-2 border-cyan-400 p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <MessageSquare className="w-8 h-8 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{t('games.scamChatTitle')}</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t('games.scamChatHowTo')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs text-slate-300 text-left space-y-1">
            <div className="text-cyan-400 font-semibold">Tactic Focus:</div>
            <div>• Executive authority pressure & secrecy traps</div>
            <div>• Gift card & urgent transfer scams</div>
            <div>• Enforcing verified voice callback policy</div>
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg font-bold text-white">{t('games.scamChatTitle')}</h1>
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

      {/* Simulated Chat Feed */}
      <div className="cyber-glass-glow rounded-3xl p-6 bg-[#081728] border-2 border-cyan-500/40 shadow-2xl space-y-5">
        {/* Chat partner header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
              CEO
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>{scenario.attackerName || 'Executive Impersonator'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                  External Domain
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Direct Message Thread</div>
            </div>
          </div>
        </div>

        {/* Dialogue bubbles */}
        <div className="space-y-3 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/15 min-h-[160px]">
          {scenario.dialogue?.map((d: any, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-[10px] flex items-center justify-center text-slate-300 font-bold shrink-0 mt-1">
                RV
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-200 leading-relaxed max-w-[85%]">
                {d.message}
              </div>
            </div>
          ))}
        </div>

        {/* Player response choices */}
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Choose Your Defensive Response:
          </div>

          <div className="space-y-2">
            {scenario.options?.map((opt: any) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={submitted}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-3.5 rounded-xl text-left text-xs sm:text-sm transition-all border cursor-pointer ${
                    isSelected
                      ? opt.isThreat
                        ? 'bg-red-950/60 border-red-500 text-red-200'
                        : 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                      : 'cyber-glass bg-slate-900/60 border-cyan-500/20 hover:border-cyan-400 text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>
        </div>

        {/* Evaluation Banner */}
        {submitted && result && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
              result.isCorrect
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                : 'bg-red-950/80 border-red-400 text-red-200'
            }`}
          >
            <div className="font-bold flex items-center justify-between">
              <span>{result.isCorrect ? 'Threat Deflected!' : 'Compromised!'}</span>
              <span className="font-mono text-cyan-300">+{result.xpEarned} XP</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {result.explanation?.[i18n.language] || result.explanation?.['en']}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={loadChallenges}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 font-bold text-xs"
              >
                {t('games.replay')}
              </button>
              <button
                type="button"
                onClick={() => navigate('/missions')}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
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
        activeScenario={scenario}
      />
    </div>
  );
};
