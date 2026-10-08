import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Lock,
  Shield,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  Bot,
  Plus,
  Trash2,
  Sparkles,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';
import { Challenge } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AICoachModal } from '../../components/AICoachModal';

interface PasswordBlock {
  id: string;
  type: 'word' | 'symbol' | 'number' | 'extension';
  label: string;
  entropyValue: number;
  length: number;
}

const AVAILABLE_BLOCKS: PasswordBlock[] = [
  { id: 'b_w1', type: 'word', label: 'Quantum', entropyValue: 18, length: 7 },
  { id: 'b_w2', type: 'word', label: 'Falcon', entropyValue: 16, length: 6 },
  { id: 'b_w3', type: 'word', label: 'Nebula', entropyValue: 16, length: 6 },
  { id: 'b_w4', type: 'word', label: 'Horizon', entropyValue: 18, length: 7 },
  { id: 'b_s1', type: 'symbol', label: '#$!', entropyValue: 15, length: 3 },
  { id: 'b_s2', type: 'symbol', label: '@&*', entropyValue: 15, length: 3 },
  { id: 'b_s3', type: 'symbol', label: '%^+', entropyValue: 15, length: 3 },
  { id: 'b_n1', type: 'number', label: '849', entropyValue: 12, length: 3 },
  { id: 'b_n2', type: 'number', label: '372', entropyValue: 12, length: 3 },
  { id: 'b_n3', type: 'number', label: '915', entropyValue: 12, length: 3 },
  { id: 'b_e1', type: 'extension', label: '+4 Chars (Salt)', entropyValue: 20, length: 4 },
  { id: 'b_e2', type: 'extension', label: '+6 Chars (Entropy)', entropyValue: 25, length: 6 },
];

export const PasswordFortressGame: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { notifyChallengeComplete } = useAuth();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [introCountdown, setIntroCountdown] = useState(5);

  // Assembled blocks (NO REAL PASSWORDS)
  const [assembledBlocks, setAssembledBlocks] = useState<PasswordBlock[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  // AI Coach modal
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);

  const loadChallenges = async () => {
    setLoading(true);
    try {
      const res = await api.getChallenges('m_password');
      setChallenges(res.challenges);
      setAssembledBlocks([]);
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

  // Calculate live entropy & simulated crack time
  const totalLength = assembledBlocks.reduce((acc, b) => acc + b.length, 0);
  const totalEntropy = assembledBlocks.reduce((acc, b) => acc + b.entropyValue, 0);

  let crackTimeText = 'Instant (Under 1 second)';
  let strengthRating: 'weak' | 'moderate' | 'strong' | 'legendary' = 'weak';
  let progressPercent = 10;
  let ratingColor = 'text-red-400 border-red-500/40 bg-red-500/10';

  if (totalEntropy >= 65 && totalLength >= 15) {
    crackTimeText = '4.8 Million Centuries (Impenetrable)';
    strengthRating = 'legendary';
    progressPercent = 100;
    ratingColor = 'text-emerald-300 border-emerald-400 bg-emerald-500/20';
  } else if (totalEntropy >= 45 && totalLength >= 12) {
    crackTimeText = '1,200 Years (GPU Cluster Proof)';
    strengthRating = 'strong';
    progressPercent = 75;
    ratingColor = 'text-cyan-300 border-cyan-400 bg-cyan-500/20';
  } else if (totalEntropy >= 25 && totalLength >= 8) {
    crackTimeText = '4 Months (Hashcat vulnerable)';
    strengthRating = 'moderate';
    progressPercent = 45;
    ratingColor = 'text-amber-300 border-amber-400 bg-amber-500/20';
  }

  const addBlock = (block: PasswordBlock) => {
    if (assembledBlocks.length >= 7 || submitted) return;
    setAssembledBlocks((prev) => [...prev, block]);
  };

  const removeBlock = (index: number) => {
    if (submitted) return;
    setAssembledBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    if (submitted) return;
    setAssembledBlocks([]);
  };

  const handleSubmit = async () => {
    if (assembledBlocks.length === 0 || submitted) return;
    try {
      const challengeId = challenges[0]?.id || 'ch_pass_1';
      const res = await api.submitChallenge(challengeId, 'm_password', {
        strength: strengthRating,
        totalLength,
        totalEntropy,
      });
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
          Calibrating Password Fortress simulation blocks...
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
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">{t('games.passwordTitle')}</h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t('games.passwordHowTo')}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-xs text-slate-300 text-left space-y-1">
            <div className="text-cyan-400 font-semibold">Security Rules:</div>
            <div>• Build from abstract security tokens only</div>
            <div>• Real passwords are never accepted or entered</div>
            <div>• Maximize entropy to reach Fortress Grade</div>
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
      {/* Top Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h1 className="text-lg font-bold text-white">{t('games.passwordTitle')}</h1>
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

      {/* Live Fortress Meter & Crack Time Display */}
      <div className="cyber-glass-glow rounded-3xl p-6 bg-[#081729] border-2 border-cyan-500/40 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/15 pb-4">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase">
              {t('games.crackTime')}
            </div>
            <div className="text-lg sm:text-xl font-black text-white font-mono mt-0.5">
              {crackTimeText}
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider font-mono self-start sm:self-auto ${ratingColor}`}>
            {t(`games.${strengthRating}`)}
          </div>
        </div>

        {/* Live Resistance Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Cryptographic Resistance</span>
            <span className="text-cyan-300 tabular-nums">
              {totalLength} Chars · {totalEntropy} Bits Entropy
            </span>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-cyan-500/20">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                strengthRating === 'legendary'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                  : strengthRating === 'strong'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                  : strengthRating === 'moderate'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-red-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Assembled Blocks Assembly Slot */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400">
              SIMULATED CIPHER ASSEMBLY (Max 7 Blocks):
            </span>
            {assembledBlocks.length > 0 && !submitted && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-red-400 hover:text-red-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="min-h-[70px] p-3 rounded-2xl bg-slate-950/80 border border-cyan-500/20 flex flex-wrap items-center gap-2">
            {assembledBlocks.length === 0 ? (
              <div className="w-full text-center text-xs text-slate-500 italic py-3">
                Tap security blocks below to assemble your impenetrable cipher key
              </div>
            ) : (
              assembledBlocks.map((block, idx) => (
                <div
                  key={`${block.id}_${idx}`}
                  onClick={() => removeBlock(idx)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-xs font-mono font-bold flex items-center gap-2 hover:bg-red-950/50 hover:border-red-400 hover:text-red-200 transition-colors cursor-pointer group shadow-sm"
                >
                  <span>{block.label}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-red-300">×</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Submit Button */}
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={assembledBlocks.length === 0}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-40"
          >
            VALIDATE FORTRESS STRENGTH
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-cyan-950/50 border border-cyan-500/40 text-center space-y-3">
            <div className="text-sm font-bold text-cyan-300 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span>Fortress Verified · +{result?.xpEarned || 150} XP</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
              {result?.explanation?.[i18n.language] || result?.explanation?.['en']}
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
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
                className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
              >
                {t('games.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Available Security Blocks Grid */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
          Available Modular Cipher Blocks:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {AVAILABLE_BLOCKS.map((block) => (
            <button
              key={block.id}
              type="button"
              disabled={submitted}
              onClick={() => addBlock(block)}
              className="p-3 rounded-xl cyber-glass bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-400/60 hover:bg-slate-800 text-left transition-all cursor-pointer flex items-center justify-between group disabled:opacity-50"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-mono">
                  {block.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  +{block.entropyValue} Bits · {block.type}
                </div>
              </div>
              <Plus className="w-4 h-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      <AICoachModal
        isOpen={isAICoachOpen}
        onClose={() => setIsAICoachOpen(false)}
        activeScenario={challenges[0]?.scenario}
      />
    </div>
  );
};
