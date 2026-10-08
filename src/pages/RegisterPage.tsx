import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, AlertCircle, ArrowRight } from 'lucide-react';
import { ShieldAnimation } from '../components/ShieldAnimation';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, pulseShield, triggerShieldPulse } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    triggerShieldPulse();

    try {
      await register({
        name,
        email,
        password,
        college: college.trim() || undefined,
      });
      navigate('/welcome');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-6 overflow-hidden">
      <ShieldAnimation pulseTrigger={pulseShield} />

      <header className="w-full max-w-6xl flex items-center justify-between z-10 py-2">
        <Link to="/" className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider text-sm">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span>CYBER GUARDIAN</span>
        </Link>
        <LanguageSelector />
      </header>

      <main className="w-full max-w-md z-10 my-auto">
        <div className="cyber-glass-glow rounded-3xl p-6 sm:p-8 bg-[#071324]/90 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl">
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {t('auth.register')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Commission your security operative profile
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('auth.fullName')}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  triggerShieldPulse();
                }}
                onFocus={triggerShieldPulse}
                placeholder="Agent John Doe"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  triggerShieldPulse();
                }}
                onFocus={triggerShieldPulse}
                placeholder="agent@domain.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  triggerShieldPulse();
                }}
                onFocus={triggerShieldPulse}
                placeholder="•••••••• (Min 6 chars)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t('auth.college')}
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  triggerShieldPulse();
                }}
                onFocus={triggerShieldPulse}
                placeholder="e.g. Stanford / Cyber Tech Institute (Optional)"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? t('app.initializing') : t('auth.registerBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-400">
            <span>{t('auth.alreadyHaveAccount')} </span>
            <Link
              to="/login"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              {t('auth.login')}
            </Link>
          </div>
        </div>
      </main>

      <footer className="w-full text-center text-[11px] text-slate-500 z-10 py-2">
        <span>Cyber Guardian Defense Academy</span>
      </footer>
    </div>
  );
};
