import {
  UserProfile,
  Mission,
  Challenge,
  ChallengeSubmissionResult,
  BadgeItem,
  LeaderboardEntry,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('cyber_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errMsg = 'Unable to connect. Please try again.';
    try {
      const data = await res.json();
      if (data && data.error) {
        errMsg = data.error;
      }
    } catch {
      // fallback message
    }
    throw new Error(errMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    college?: string;
    language?: string;
    avatar?: string;
  }): Promise<{ token: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ message: string; user: UserProfile }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(res);
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse(res);
  },

  // Missions
  async getMissions(): Promise<{ missions: Mission[] }> {
    const res = await fetch(`${API_BASE}/missions`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Challenges
  async getChallenges(missionId?: string): Promise<{ challenges: Challenge[] }> {
    const url = missionId ? `${API_BASE}/challenges?missionId=${missionId}` : `${API_BASE}/challenges`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async submitChallenge(
    challengeId: string,
    missionId: string,
    userAnswer: any
  ): Promise<ChallengeSubmissionResult> {
    const res = await fetch(`${API_BASE}/challenges/${challengeId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ missionId, userAnswer }),
    });
    return handleResponse(res);
  },

  // Badges
  async getBadges(): Promise<{ badges: BadgeItem[] }> {
    const res = await fetch(`${API_BASE}/badges`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Leaderboard
  async getLeaderboard(type: 'global' | 'college'): Promise<{
    leaderboard: LeaderboardEntry[];
    userHasCollege: boolean;
    userCollege: string;
  }> {
    const res = await fetch(`${API_BASE}/leaderboard?type=${type}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // AI Cyber Coach
  async askAICoach(params: {
    message: string;
    challengeContext?: any;
    userLanguage: string;
    mode?: 'hint' | 'explain' | 'tip';
  }): Promise<{ reply: string }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    return handleResponse(res);
  },
};
