import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'calibrating' | 'ready'>('calibrating');

  useEffect(() => {
    // Under 3 seconds sequence: 1.8s calibrating -> 0.8s SYSTEM READY -> proceed
    const timer1 = setTimeout(() => {
      setPhase('ready');
    }, 1600);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050b14] cyber-grid text-white px-4">
      <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
        {/* Glowing circular radar */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping [animation-duration:2.5s]" />
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20" />

        {/* Scanning laser line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_2s_ease-in-out_infinite]" />

        {/* Shield icon */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.4)]">
          <Shield className="w-9 h-9 text-cyan-400 fill-cyan-400/20" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-blue-500 font-mono mb-2">
        {t('app.loading')}
      </h1>

      <div className="flex items-center gap-2 text-xs font-mono">
        {phase === 'calibrating' ? (
          <span className="text-cyan-400/80 animate-pulse">{t('app.initializing')}</span>
        ) : (
          <span className="text-emerald-400 font-bold tracking-wider flex items-center gap-1.5 animate-in fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {t('app.systemReady')}
          </span>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          25% { opacity: 1; }
          75% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
