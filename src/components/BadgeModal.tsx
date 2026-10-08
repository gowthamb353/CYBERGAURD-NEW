import React from 'react';
import { ShieldCheck, Lock, X, Award } from 'lucide-react';
import { BadgeItem } from '../types';

interface BadgeModalProps {
  badge: BadgeItem | null;
  onClose: () => void;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ badge, onClose }) => {
  if (!badge) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm cyber-glass-glow rounded-2xl bg-[#091526]/95 border border-cyan-500/40 p-6 text-center shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/40"
        >
          <X className="w-4 h-4" />
        </button>

        <div
          className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center border-2 transition-transform ${
            badge.isUnlocked
              ? 'bg-gradient-to-tr from-cyan-500/30 to-purple-500/30 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-500'
          }`}
        >
          {badge.isUnlocked ? (
            <Award className="w-10 h-10 text-cyan-300" />
          ) : (
            <Lock className="w-8 h-8 text-slate-500" />
          )}
        </div>

        <div
          className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold mb-2 ${
            badge.isUnlocked
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          {badge.isUnlocked ? 'AWARDED' : 'LOCKED'}
        </div>

        <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">{badge.description}</p>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/20 text-left mb-6">
          <div className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>HOW TO UNLOCK</span>
          </div>
          <div className="text-xs text-slate-200">{badge.requirement}</div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
};
