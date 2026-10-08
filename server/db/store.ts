import bcrypt from 'bcryptjs';
import { isDbConnected } from './connection.js';
import { UserModel, ChallengeModel, ProgressModel } from './models.js';
import { SEED_MISSIONS, SEED_CHALLENGES } from './seedData.js';
import { calculateLevel } from '../../src/config/gameRules.js';

// In-Memory store for preview reliability
const memoryUsers: any[] = [];
const memoryChallenges: any[] = [...SEED_CHALLENGES];
const memoryProgress: any[] = [];

// Seed an initial demo account
(async () => {
  const hashPassword = await bcrypt.hash('CyberGuardian2026!', 10);
  memoryUsers.push({
    id: 'user_guardian_1',
    _id: 'user_guardian_1',
    name: 'Cyber Sentinel',
    email: 'guardian@cyber.shield',
    password: hashPassword,
    college: 'Cyber Defense Academy',
    avatar: 'avatar-1',
    language: 'en',
    xp: 650,
    level: 3,
    streak: 3,
    lastActiveDate: new Date(),
    completedMissions: ['m_phishing'],
    badges: ['first_mission', 'phishing_hunter'],
    stats: {
      phishingAccuracy: 92,
      scamAccuracy: 85,
      passwordScore: 78,
      privacyScore: 88,
      totalChallengesCompleted: 8,
    },
    createdAt: new Date(),
  });

  // Additional mock leaderboard users (emails NEVER exposed)
  const names = [
    { name: 'Astra Phoenix', college: 'Cyber Defense Academy', xp: 1420, level: 4, avatar: 'avatar-2' },
    { name: 'Kavitha Raman', college: 'National Tech Institute', xp: 1250, level: 4, avatar: 'avatar-3' },
    { name: 'Carlos Mendez', college: 'Polytechnic Cyber Institute', xp: 980, level: 3, avatar: 'avatar-4' },
    { name: 'Fatima Al-Sayed', college: 'Emirates Institute of Tech', xp: 850, level: 3, avatar: 'avatar-5' },
    { name: 'Arjun Verma', college: 'IIT Delhi', xp: 720, level: 3, avatar: 'avatar-1' },
    { name: 'Sophie Laurent', college: 'Sorbonne Cyber Lab', xp: 580, level: 2, avatar: 'avatar-2' },
  ];

  for (let i = 0; i < names.length; i++) {
    const item = names[i];
    memoryUsers.push({
      id: `bot_user_${i}`,
      _id: `bot_user_${i}`,
      name: item.name,
      email: `agent_${i}@secure.domain`,
      password: hashPassword,
      college: item.college,
      avatar: item.avatar,
      language: 'en',
      xp: item.xp,
      level: item.level,
      streak: (i % 4) + 1,
      lastActiveDate: new Date(),
      completedMissions: ['m_phishing'],
      badges: ['first_mission'],
      stats: {
        phishingAccuracy: 80 + i * 2,
        scamAccuracy: 75 + i * 3,
        passwordScore: 70 + i * 4,
        privacyScore: 85,
        totalChallengesCompleted: 5 + i,
      },
      createdAt: new Date(),
    });
  }
})();

export async function findUserByEmail(email: string) {
  const normalized = email.toLowerCase().trim();
  if (isDbConnected()) {
    return await UserModel.findOne({ email: normalized }).exec();
  }
  return memoryUsers.find((u) => u.email === normalized) || null;
}

export async function findUserById(id: string) {
  if (isDbConnected()) {
    return await UserModel.findById(id).exec();
  }
  return memoryUsers.find((u) => u.id === id || u._id === id) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  college?: string;
  language?: string;
  avatar?: string;
}) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const userData = {
    name: data.name,
    email: normalizedEmail,
    password: data.password,
    college: data.college || '',
    language: data.language || 'en',
    avatar: data.avatar || 'avatar-1',
    xp: 0,
    level: 1,
    streak: 1,
    lastActiveDate: new Date(),
    completedMissions: [],
    badges: [],
    stats: {
      phishingAccuracy: 0,
      scamAccuracy: 0,
      passwordScore: 0,
      privacyScore: 0,
      totalChallengesCompleted: 0,
    },
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    const user = new UserModel(userData);
    return await user.save();
  }

  const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newUser = { id, _id: id, ...userData };
  memoryUsers.push(newUser);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<any>) {
  if (isDbConnected()) {
    return await UserModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).exec();
  }
  const index = memoryUsers.findIndex((u) => u.id === id || u._id === id);
  if (index !== -1) {
    memoryUsers[index] = { ...memoryUsers[index], ...updates };
    return memoryUsers[index];
  }
  return null;
}

export async function getMissions() {
  return SEED_MISSIONS;
}

export async function getChallenges(missionId?: string, includeAnswers = false) {
  let list = isDbConnected()
    ? await ChallengeModel.find(missionId ? { missionId } : {}).exec()
    : memoryChallenges.filter((c) => !missionId || c.missionId === missionId);

  // If in-memory is empty for some reason, fallback to SEED_CHALLENGES
  if (!list || list.length === 0) {
    list = SEED_CHALLENGES.filter((c) => !missionId || c.missionId === missionId);
  }

  return list.map((item: any) => {
    const obj = item.toObject ? item.toObject() : { ...item };
    if (!includeAnswers) {
      delete obj.correctAnswer;
      delete obj.explanation;
      // Also protect redFlags explanations if present
      if (obj.redFlags && Array.isArray(obj.redFlags)) {
        obj.redFlags = obj.redFlags.map((rf: any) => ({
          id: rf.id,
          textSnippet: rf.textSnippet,
        }));
      }
    }
    return obj;
  });
}

export async function getChallengeById(id: string) {
  if (isDbConnected()) {
    return await ChallengeModel.findOne({ id }).exec();
  }
  return memoryChallenges.find((c) => c.id === id) || SEED_CHALLENGES.find((c) => c.id === id) || null;
}

export async function recordChallengeSubmission(params: {
  userId: string;
  challengeId: string;
  missionId: string;
  userAnswer: any;
}) {
  const challenge = await getChallengeById(params.challengeId);
  if (!challenge) {
    throw new Error('Challenge not found');
  }

  let isCorrect = false;
  let score = 0;
  let xpEarned = 0;

  if (challenge.type === 'phish_swipe') {
    isCorrect = params.userAnswer === challenge.correctAnswer;
    score = isCorrect ? 100 : 0;
    xpEarned = isCorrect ? 100 : 25;
  } else if (challenge.type === 'red_flag') {
    // Array of selected flags
    const userFlags: string[] = Array.isArray(params.userAnswer) ? params.userAnswer : [];
    const correctFlags: string[] = Array.isArray(challenge.correctAnswer) ? challenge.correctAnswer : [];
    const matches = userFlags.filter((f) => correctFlags.includes(f)).length;
    const accuracy = correctFlags.length > 0 ? matches / correctFlags.length : 0;
    isCorrect = accuracy >= 0.8;
    score = Math.round(accuracy * 100);
    xpEarned = isCorrect ? 150 : Math.round(accuracy * 100);
  } else if (challenge.type === 'password_builder') {
    // Evaluated strength
    const strength = params.userAnswer?.strength || 'weak';
    isCorrect = strength === 'strong' || strength === 'legendary';
    score = strength === 'legendary' ? 100 : strength === 'strong' ? 85 : 50;
    xpEarned = isCorrect ? 150 : 50;
  } else if (challenge.type === 'scam_chat') {
    isCorrect = params.userAnswer === challenge.correctAnswer;
    score = isCorrect ? 100 : 0;
    xpEarned = isCorrect ? 150 : 30;
  }

  // Update user stats, XP, level, streak, badges
  const user = await findUserById(params.userId);
  let newlyAwardedBadges: string[] = [];

  if (user) {
    const currentXp = (user.xp || 0) + xpEarned;
    const oldLevel = user.level || 1;
    const newLevel = calculateLevel(currentXp);

    // Streak logic: check if last active was yesterday vs today
    const now = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : now;
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);

    let streak = user.streak || 1;
    if (diffHours >= 24 && diffHours < 48) {
      streak += 1;
    } else if (diffHours >= 48) {
      streak = 1;
    }

    // Badges check
    const existingBadges: string[] = user.badges || [];
    const badgesToCheck = [...existingBadges];

    // Badge 1: First Mission
    if (!badgesToCheck.includes('first_mission')) {
      badgesToCheck.push('first_mission');
      newlyAwardedBadges.push('first_mission');
    }

    // Badge 2: Phishing Hunter
    if (challenge.category === 'phishing' && isCorrect && !badgesToCheck.includes('phishing_hunter')) {
      badgesToCheck.push('phishing_hunter');
      newlyAwardedBadges.push('phishing_hunter');
    }

    // Badge 3: Scam Detector
    if (challenge.category === 'scam' && isCorrect && !badgesToCheck.includes('scam_detector')) {
      badgesToCheck.push('scam_detector');
      newlyAwardedBadges.push('scam_detector');
    }

    // Badge 4: Password Master
    if (challenge.category === 'password' && isCorrect && !badgesToCheck.includes('password_master')) {
      badgesToCheck.push('password_master');
      newlyAwardedBadges.push('password_master');
    }

    // Badge 5: Privacy Protector
    if (challenge.category === 'privacy' && isCorrect && !badgesToCheck.includes('privacy_protector')) {
      badgesToCheck.push('privacy_protector');
      newlyAwardedBadges.push('privacy_protector');
    }

    // Check completion of missions
    const completedMissions = new Set(user.completedMissions || []);
    completedMissions.add(params.missionId);

    // Badge 6: Cyber Guardian (all completed + streak >= 3)
    if (
      completedMissions.size >= 4 &&
      streak >= 3 &&
      !badgesToCheck.includes('cyber_guardian')
    ) {
      badgesToCheck.push('cyber_guardian');
      newlyAwardedBadges.push('cyber_guardian');
    }

    await updateUser(params.userId, {
      xp: currentXp,
      level: newLevel,
      streak,
      lastActiveDate: now,
      completedMissions: Array.from(completedMissions),
      badges: badgesToCheck,
    });
  }

  // Return full verification result with explanation
  return {
    isCorrect,
    score,
    xpEarned,
    correctAnswer: challenge.correctAnswer,
    explanation: challenge.explanation,
    newlyAwardedBadges,
  };
}

export async function getLeaderboardData(type: 'global' | 'college', userCollege?: string) {
  let users: any[] = [];
  if (isDbConnected()) {
    users = await UserModel.find({}, 'name avatar xp level college').sort({ xp: -1 }).limit(50).exec();
  } else {
    users = [...memoryUsers].sort((a, b) => (b.xp || 0) - (a.xp || 0));
  }

  if (type === 'college') {
    if (userCollege && userCollege.trim()) {
      users = users.filter((u) => u.college && u.college.toLowerCase() === userCollege.toLowerCase());
    } else {
      // If user has not specified a college, return college ranks among all users who have college set
      users = users.filter((u) => Boolean(u.college && u.college.trim()));
    }
  }

  // Security override: NEVER return email or sensitive information
  return users.map((u, index) => ({
    id: u.id || u._id,
    rank: index + 1,
    name: u.name,
    avatar: u.avatar || 'avatar-1',
    xp: u.xp || 0,
    level: u.level || 1,
    college: u.college || '',
  }));
}
