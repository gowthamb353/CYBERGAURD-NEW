import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  RotateCcw,
  ArrowRight,
  Flame,
  Bot,
  Star,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AICoachModal } from '../../components/AICoachModal';

export const PhishOrLegitGame: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { notifyChallengeComplete } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [introCountdown, setIntroCountdown] = useState(5);

  // Gameplay state
  const [combo, setCombo] = useState(1);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);

  // Card interaction
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  // Feedback state
  const [feedback, setFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    reason: string;
    xpEarned: number;
  } | null>(null);

  // End of round state
  const [isGameOver, setIsGameOver] = useState(false);

  // AI Coach modal
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  // Fetch challenges
  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.getChallenges('m_phishing');
      // Duplicate to ensure 10 cards per round as requested
      let pool = res.challenges;
      if (pool.length < 10) {
        pool = [...pool, ...pool.map((c, i) => ({ ...c, id: `${c.id}_r2_${i}` }))].slice(0, 10);
      }
      setChallenges(pool);
      setCurrentIndex(0);
      setCombo(1);
      setScore(0);
      setCorrectCount(0);
      setTotalXpEarned(0);
      setIsGameOver(false);
      setFeedback(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  // 5-second intro timer
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

  const currentChallenge = challenges[currentIndex];

  const handleAnswer = async (userSaysSafe: boolean) => {
    if (!currentChallenge || feedback) return;

    try {
      // Clean ID for base submission
      const baseId = currentChallenge.id.split('_r2_')[0];
      const res = await api.submitChallenge(baseId, 'm_phishing', userSaysSafe);

      const isAnsCorrect = res.isCorrect;
      const currentMultiplier = isAnsCorrect ? combo : 1;
      const roundXp = res.xpEarned * currentMultiplier;

      if (isAnsCorrect) {
        setCombo((c) => Math.min(5, c + 1));
        setCorrectCount((prev) => prev + 1);
        setScore((s) => s + 100 * currentMultiplier);
      } else {
        setCombo(1);
      }

      setTotalXpEarned((prev) => prev + roundXp);

      const langExplanation =
        res.explanation[i18n.language] || res.explanation['en'] || 'Verification complete.';

      setFeedback({
        show: true,
        isCorrect: isAnsCorrect,
        reason: langExplanation,
        xpEarned: roundXp,
      });

      notifyChallengeComplete(undefined, res.newlyAwardedBadges);

      // Auto proceed after 2.4s or player clicks Next
      setTimeout(() => {
        advanceNextCard();
      }, 2400);
    } catch (err: any) {
      console.error(err);
    }
  };

  const advanceNextCard = () => {
    setFeedback(null);
    setDragOffset(0);
    if (currentIndex + 1 >= challenges.length) {
      setIsGameOver(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Drag / Touch gestures for swipe
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - startX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset > 90) {
      // Swiped Right -> Safe
      handleAnswer(true);
    } else if (dragOffset < -90) {
      // Swiped Left -> Threat
      handleAnswer(false);
    }
    setDragOffset(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-cyan-400 font-mono text-xs animate-pulse">
          Loading Phish or Legit tactical scenarios...
        </div>
      </div>
    );
  }

  // 5-second How to Play Intro Modal
  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md cyber-glass-glow rounded-3xl bg-[#081524] border-2 border-cyan-400 p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{t('games.phishTitle')}</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t('games.phishHowTo')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold">
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300">
              ← SWIPE LEFT
              <div className="text-[10px] font-normal text-slate-300 mt-1">Phishing / Threat</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              SWIPE RIGHT →
              <div className="text-[10px] font-normal text-slate-300 mt-1">Legitimate / Safe</div>
            </div>
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

  // Round Results Screen
  if (isGameOver) {
    const accuracy = Math.round((correctCount / challenges.length) * 100);
    const stars = accuracy >= 80 ? 3 : accuracy >= 50 ? 2 : 1;

    return (
      <div className="max-w-md mx-auto my-8 cyber-glass-glow rounded-3xl p-6 sm:p-8 bg-[#091728] border-2 border-cyan-400 text-center space-y-6 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('games.missionComplete')}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white">{t('games.phishTitle')}</h2>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-10 h-10 ${
                s <= stars
                  ? 'text-amber-400 fill-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 text-center font-mono">
          <div>
            <div className="text-[10px] text-slate-400">ACCURACY</div>
            <div className="text-base font-bold text-white mt-0.5">{accuracy}%</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">XP EARNED</div>
            <div className="text-base font-bold text-cyan-300 mt-0.5">+{totalXpEarned}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">SCORE</div>
            <div className="text-base font-bold text-amber-300 mt-0.5">{score}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={loadChallenges}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('games.replay')}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/missions')}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <span>{t('games.next')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const scenario = currentChallenge.scenario || {};

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Top Bar: Progress, Combo multiplier, AI Coach Hint */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-400 font-semibold">
            {currentIndex + 1} / {challenges.length}
          </span>
          {combo > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{t('games.combo', { combo })}</span>
            </div>
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

      {/* Progress pill bar */}
      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-cyan-400 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / challenges.length) * 100}%` }}
        />
      </div>

      {/* Swipeable Card Container */}
      <div className="relative min-h-[380px] flex items-center justify-center select-none">
        {/* Underlay hints for swipe */}
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 transition-opacity pointer-events-none ${
            dragOffset < -30 ? 'opacity-100 scale-110' : 'opacity-0'
          }`}
        >
          <X className="w-8 h-8" />
        </div>
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 transition-opacity pointer-events-none ${
            dragOffset > 30 ? 'opacity-100 scale-110' : 'opacity-0'
          }`}
        >
          <Check className="w-8 h-8" />
        </div>

        {/* Card */}
        <div
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
            transition: isDragging ? 'none' : 'transform 0.25s ease-out',
          }}
          className={`w-full cyber-glass-glow rounded-3xl p-6 sm:p-7 bg-[#09192c] border-2 cursor-grab active:cursor-grabbing shadow-2xl relative transition-colors ${
            dragOffset > 50
              ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              : dragOffset < -50
              ? 'border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.3)]'
              : 'border-cyan-500/40'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-cyan-500/15 mb-4">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {scenario.badgeText || scenario.channel || 'INCOMING MESSAGE'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              CHANNEL: {String(scenario.channel || 'EMAIL').toUpperCase()}
            </span>
          </div>

          {/* Simulated Email / SMS details */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">From:</span>
                <span className="font-mono text-cyan-300 font-medium truncate max-w-[240px]">
                  {scenario.sender}
                </span>
              </div>
              {scenario.subject && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Subject:</span>
                  <span className="text-slate-200 font-semibold truncate max-w-[240px]">
                    {scenario.subject}
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/10 text-xs sm:text-sm text-slate-200 leading-relaxed min-h-[110px]">
              {scenario.body}
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500 mt-5 italic">
            ← Drag left for Threat · Drag right for Safe →
          </div>
        </div>
      </div>

      {/* Fallback Large Tap Target Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <button
          type="button"
          onClick={() => handleAnswer(false)}
          disabled={Boolean(feedback)}
          className="py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600/90 to-rose-700/90 hover:from-red-500 hover:to-rose-600 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-red-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
          <span>{t('games.threat')}</span>
        </button>

        <button
          type="button"
          onClick={() => handleAnswer(true)}
          disabled={Boolean(feedback)}
          className="py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600/90 to-teal-700/90 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <Check className="w-5 h-5" />
          <span>{t('games.safe')}</span>
        </button>
      </div>

      {/* Instant Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 ${
            feedback.isCorrect
              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
              : 'bg-red-950/80 border-red-400 text-red-200'
          }`}
        >
          {feedback.isCorrect ? (
            <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold flex items-center justify-between">
              <span>{feedback.isCorrect ? 'Correct Decision!' : 'Threat Missed!'}</span>
              <span className="font-mono text-cyan-300">+{feedback.xpEarned} XP</span>
            </div>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">{feedback.reason}</p>
          </div>
        </div>
      )}

      {/* AI Coach Hint Modal */}
      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        activeScenario={currentChallenge?.scenario}
      />
    </div>
  );
};
