export interface UserProfile {
  id: string;
  name: string;
  email: string;
  college?: string;
  language: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  completedMissions: string[];
  badges: string[];
  stats?: {
    phishingAccuracy?: number;
    scamAccuracy?: number;
    passwordScore?: number;
    privacyScore?: number;
    totalChallengesCompleted?: number;
  };
}

export interface Mission {
  id: string;
  order: number;
  title: Record<string, string>;
  category: 'phishing' | 'scam' | 'password' | 'privacy' | 'social_engineering';
  gameType: 'phish_swipe' | 'red_flag' | 'password_builder' | 'scam_chat';
  xpReward: number;
  description: Record<string, string>;
  isCompleted: boolean;
  isUnlocked: boolean;
}

export interface Challenge {
  id: string;
  missionId: string;
  category: string;
  type: 'phish_swipe' | 'red_flag' | 'password_builder' | 'scam_chat';
  difficulty: 'easy' | 'medium' | 'hard';
  title: Record<string, string>;
  scenario: any;
  redFlags?: Array<{
    id: string;
    textSnippet: string;
    explanation?: Record<string, string>;
  }>;
  order: number;
}

export interface ChallengeSubmissionResult {
  success: boolean;
  isCorrect: boolean;
  score: number;
  xpEarned: number;
  correctAnswer: any;
  explanation: Record<string, string>;
  newlyAwardedBadges: string[];
}

export interface BadgeItem {
  id: string;
  code: string;
  titleKey: string;
  name: string;
  description: string;
  requirement: string;
  category: string;
  icon: string;
  isUnlocked: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  college?: string;
}
