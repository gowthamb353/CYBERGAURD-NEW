import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LevelUpModal: React.FC = () => {
  const { levelUpLevel, dismissLevelUp } = useAuth();

  useEffect(() => {
    if (levelUpLevel) {
      // Fire festive cyber confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#38bdf8', '#a855f7', '#10b981'],
      });
    }
  }, [levelUpLevel]);

  if (!levelUpLevel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm cyber-glass-glow rounded-2xl bg-[#091526]/95 border-2 border-cyan-400 p-6 text-center shadow-[0_0_50px_rgba(6,182,212,0.3)] animate-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={dismissLevelUp}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/40"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 border-2 border-cyan-300 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-bounce [animation-duration:1.5s]">
          <Shield className="w-10 h-10 text-white fill-white/20" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROMOTION ACHIEVED</span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-1">Defense Level {levelUpLevel}</h3>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Your tactical proficiency across cyber defense domains has ascended to the next rank tier!
        </p>

        <button
          type="button"
          onClick={dismissLevelUp}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          <span>CONTINUE DEFENSE</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
