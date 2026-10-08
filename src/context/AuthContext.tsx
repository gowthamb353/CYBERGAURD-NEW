import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';
import { setAppLanguage } from '../i18n';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    language?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshUser: () => Promise<void>;
  pulseShield: number;
  triggerShieldPulse: () => void;
  levelUpLevel: number | null;
  dismissLevelUp: () => void;
  newBadgesAwarded: string[];
  dismissNewBadges: () => void;
  notifyChallengeComplete: (newLevel?: number, newBadges?: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pulseShield, setPulseShield] = useState<number>(0);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [newBadgesAwarded, setNewBadgesAwarded] = useState<string[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('cyber_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then((res) => {
        setUser(res.user);
        if (res.user.language) {
          setAppLanguage(res.user.language);
        }
      })
      .catch(() => {
        localStorage.removeItem('cyber_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const triggerShieldPulse = () => {
    setPulseShield((prev) => prev + 1);
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    try {
      const res = await api.login(email, pass);
      localStorage.setItem('cyber_token', res.token);
      setUser(res.user);
      if (res.user.language) {
        setAppLanguage(res.user.language);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect. Please try again.');
      throw err;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    language?: string;
  }) => {
    setError(null);
    try {
      const res = await api.register(data);
      localStorage.setItem('cyber_token', res.token);
      setUser(res.user);
      if (res.user.language) {
        setAppLanguage(res.user.language);
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('cyber_token');
    setUser(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      const res = await api.updateProfile(updates);
      setUser(res.user);
      if (updates.language) {
        setAppLanguage(updates.language);
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.getMe();
      setUser(res.user);
    } catch {
      // quiet refresh
    }
  };

  const notifyChallengeComplete = (newLevel?: number, newBadges?: string[]) => {
    refreshUser();
    if (newLevel && user && newLevel > user.level) {
      setLevelUpLevel(newLevel);
    }
    if (newBadges && newBadges.length > 0) {
      setNewBadgesAwarded(newBadges);
    }
  };

  const dismissLevelUp = () => setLevelUpLevel(null);
  const dismissNewBadges = () => setNewBadgesAwarded([]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
        pulseShield,
        triggerShieldPulse,
        levelUpLevel,
        dismissLevelUp,
        newBadgesAwarded,
        dismissNewBadges,
        notifyChallengeComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
