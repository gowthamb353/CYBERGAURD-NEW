import mongoose, { Schema, Document } from 'mongoose';

// User Schema
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  college?: string;
  avatar: string;
  language: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: Date;
  completedMissions: string[];
  badges: string[];
  stats: {
    phishingAccuracy: number;
    scamAccuracy: number;
    passwordScore: number;
    privacyScore: number;
    totalChallengesCompleted: number;
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  college: { type: String, default: '' },
  avatar: { type: String, default: 'avatar-1' },
  language: { type: String, default: 'en' },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  lastActiveDate: { type: Date, default: Date.now },
  completedMissions: { type: [String], default: [] },
  badges: { type: [String], default: [] },
  stats: {
    phishingAccuracy: { type: Number, default: 0 },
    scamAccuracy: { type: Number, default: 0 },
    passwordScore: { type: Number, default: 0 },
    privacyScore: { type: Number, default: 0 },
    totalChallengesCompleted: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
});

// Challenge Schema
export interface IChallenge extends Document {
  id: string;
  missionId: string;
  category: 'phishing' | 'scam' | 'password' | 'privacy' | 'social_engineering';
  type: 'phish_swipe' | 'red_flag' | 'password_builder' | 'scam_chat';
  difficulty: 'easy' | 'medium' | 'hard';
  title: Record<string, string>;
  scenario: Record<string, any>;
  correctAnswer: any; // Server-side only
  explanation: Record<string, string>; // Server-side only until answer submitted
  redFlags?: Array<{
    id: string;
    textSnippet: string;
    explanation: Record<string, string>;
  }>;
  order: number;
}

const ChallengeSchema = new Schema<IChallenge>({
  missionId: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true },
  difficulty: { type: String, default: 'easy' },
  title: { type: Map, of: String },
  scenario: { type: Schema.Types.Mixed },
  correctAnswer: { type: Schema.Types.Mixed },
  explanation: { type: Map, of: String },
  redFlags: [
    {
      id: String,
      textSnippet: String,
      explanation: { type: Map, of: String },
    },
  ],
  order: { type: Number, default: 0 },
});

// Progress Schema
export interface IProgress extends Document {
  userId: string;
  challengeId: string;
  missionId: string;
  isCorrect: boolean;
  score: number;
  xpEarned: number;
  userAnswer?: any;
  completedAt: Date;
}

const ProgressSchema = new Schema<IProgress>({
  userId: { type: String, required: true, index: true },
  challengeId: { type: String, required: true },
  missionId: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  userAnswer: { type: Schema.Types.Mixed },
  completedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const ChallengeModel = mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);
export const ProgressModel = mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
