/**
 * Cyber Guardian Game Rules & Level Calculations
 */

export const XP_REWARDS = {
  easy: 100,
  medium: 150,
  hard: 200,
  bonusStreak: 50,
  perfectRound: 75,
} as const;

/**
 * Calculates level from total XP.
 * Formula: Level 1 = 0 XP, Level 2 = 250 XP, Level 3 = 600 XP, etc.
 * level = floor(sqrt(xp / 100)) + 1
 */
export function calculateLevel(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForNextLevel(currentLevel: number): number {
  // Required total XP for next level
  return Math.pow(currentLevel, 2) * 100;
}

export function xpProgressInCurrentLevel(xp: number): {
  currentLevel: number;
  currentLevelBaseXp: number;
  nextLevelXp: number;
  xpInLevel: number;
  xpNeededForLevel: number;
  progressPercent: number;
} {
  const currentLevel = calculateLevel(xp);
  const currentLevelBaseXp = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXp = xpForNextLevel(currentLevel);
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const xpInLevel = Math.max(0, xp - currentLevelBaseXp);
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeededForLevel) * 100));

  return {
    currentLevel,
    currentLevelBaseXp,
    nextLevelXp,
    xpInLevel,
    xpNeededForLevel,
    progressPercent,
  };
}

export interface BadgeDefinition {
  id: string;
  code: string;
  titleKey: string;
  name: string;
  description: string;
  requirement: string;
  category: 'onboarding' | 'phishing' | 'scam' | 'password' | 'privacy' | 'mastery';
  icon: string;
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_mission',
    code: 'first_mission',
    titleKey: 'badge_first_mission',
    name: 'First Mission',
    description: 'Initiated active cyber defense service and neutralized your first threat simulation.',
    requirement: 'Complete your first defense challenge.',
    category: 'onboarding',
    icon: 'ShieldCheck',
  },
  {
    id: 'phishing_hunter',
    code: 'phishing_hunter',
    titleKey: 'badge_phishing_hunter',
    name: 'Phishing Hunter',
    description: 'Mastered email header analysis, URL obfuscation detection, and credential traps.',
    requirement: 'Score 80%+ accuracy in Phish or Legit.',
    category: 'phishing',
    icon: 'Fish',
  },
  {
    id: 'scam_detector',
    code: 'scam_detector',
    titleKey: 'badge_scam_detector',
    name: 'Scam Detector',
    description: 'Uncovered hidden urgency triggers, deceptive links, and social engineering anomalies.',
    requirement: 'Find all red flags in a Red Flag Hunt scenario.',
    category: 'scam',
    icon: 'Flag',
  },
  {
    id: 'password_master',
    code: 'password_master',
    titleKey: 'badge_password_master',
    name: 'Password Master',
    description: 'Constructed an impenetrable digital barricade with multi-century cryptographic complexity.',
    requirement: 'Build a Fortress-Grade password in Password Fortress.',
    category: 'password',
    icon: 'Lock',
  },
  {
    id: 'privacy_protector',
    code: 'privacy_protector',
    titleKey: 'badge_privacy_protector',
    name: 'Privacy Protector',
    description: 'Successfully shielded sensitive identity telemetry from unauthorized interception.',
    requirement: 'Complete all Privacy and Social Engineering drills.',
    category: 'privacy',
    icon: 'EyeOff',
  },
  {
    id: 'cyber_guardian',
    code: 'cyber_guardian',
    titleKey: 'badge_cyber_guardian',
    name: 'Cyber Guardian',
    description: 'Achieved elite cybersecurity operational readiness across all tactical defense categories.',
    requirement: 'Complete all 5 mission categories and maintain a 3-day defense streak.',
    category: 'mastery',
    icon: 'Award',
  },
];
