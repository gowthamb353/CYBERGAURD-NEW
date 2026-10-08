import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, LogOut, CheckCircle, Save, Shield, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LANGUAGES, setAppLanguage } from '../i18n';

export const ProfilePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUserProfile, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [college, setCollege] = useState(user?.college || '');
  const [language, setLanguage] = useState(user?.language || i18n.language || 'en');
  const [avatar, setAvatar] = useState(user?.avatar || 'avatar-1');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateUserProfile({
        name,
        college,
        language,
        avatar,
      });
      setAppLanguage(language);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update dossier.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {t('profile.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      <div className="cyber-glass-glow rounded-3xl p-6 sm:p-8 bg-[#081628] border border-cyan-500/30 shadow-xl space-y-6">
        {/* User Badge Top Banner */}
        <div className="flex items-center gap-4 pb-6 border-b border-cyan-500/15">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 text-2xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            {avatar === 'avatar-1' ? '🛡️' : '⚡'}
          </div>
          <div>
            <div className="text-lg font-bold text-white">{user.name}</div>
            <div className="text-xs text-slate-400 font-mono">{user.email}</div>
            <div className="text-[11px] text-cyan-400 font-mono mt-0.5">
              Level {user.level} · {user.xp} XP · {user.streak} Day Streak
            </div>
          </div>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('profile.saved')}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t('profile.name')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t('profile.college')}
            </label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Stanford / Cyber Tech Institute (Optional)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t('profile.language')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950/70 border border-cyan-500/20 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {/* Avatar choice */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Guardian Insignia Avatar
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAvatar('avatar-1')}
                className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center border cursor-pointer ${
                  avatar === 'avatar-1'
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                🛡️
              </button>
              <button
                type="button"
                onClick={() => setAvatar('avatar-2')}
                className={`w-12 h-12 rounded-xl text-xl flex items-center justify-center border cursor-pointer ${
                  avatar === 'avatar-2'
                    ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-700'
                }`}
              >
                ⚡
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? t('app.initializing') : t('profile.save')}</span>
            </button>
          </div>
        </form>

        {/* Terminate Session (Logout) */}
        <div className="pt-4 border-t border-cyan-500/15">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('profile.logout')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
