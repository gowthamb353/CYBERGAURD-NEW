import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { findUserByEmail, findUserById, createUser, updateUser } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cyber_guardian_jwt_secret_dev_key';

// Register
router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('college').optional().trim(),
    body('language').optional().trim(),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { name, email, password, college, language, avatar } = req.body;
      const existing = await findUserByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'An agent is already commissioned with this email address.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await createUser({
        name,
        email,
        password: hashedPassword,
        college: college || '',
        language: language || 'en',
        avatar: avatar || 'avatar-1',
      });

      const userId = user.id || user._id;
      const token = jwt.sign({ userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        token,
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          college: user.college,
          language: user.language,
          avatar: user.avatar,
          xp: user.xp || 0,
          level: user.level || 1,
          streak: user.streak || 1,
          completedMissions: user.completedMissions || [],
          badges: user.badges || [],
        },
      });
    } catch (error) {
      console.error('[Auth] Register error:', error);
      return res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
  }
);

// Login
router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: any, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    try {
      const { email, password } = req.body;
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or credentials.' });
      }

      const userId = user.id || user._id;
      const token = jwt.sign({ userId, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token,
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          college: user.college || '',
          language: user.language || 'en',
          avatar: user.avatar || 'avatar-1',
          xp: user.xp || 0,
          level: user.level || 1,
          streak: user.streak || 1,
          completedMissions: user.completedMissions || [],
          badges: user.badges || [],
          stats: user.stats || {},
        },
      });
    } catch (error) {
      console.error('[Auth] Login error:', error);
      return res.status(500).json({ error: 'Authentication failed. Please try again.' });
    }
  }
);

// Current User Profile
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await findUserById(req.user!.userId);
    if (!user) {
      return res.status(404).json({ error: 'Agent profile not found.' });
    }

    const userId = user.id || user._id;
    return res.json({
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        college: user.college || '',
        language: user.language || 'en',
        avatar: user.avatar || 'avatar-1',
        xp: user.xp || 0,
        level: user.level || 1,
        streak: user.streak || 1,
        completedMissions: user.completedMissions || [],
        badges: user.badges || [],
        stats: user.stats || {},
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to retrieve dossier.' });
  }
});

// Update Profile (Name, College, Language, Avatar)
router.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, college, language, avatar } = req.body;
    const updates: any = {};
    if (name) updates.name = name.trim();
    if (college !== undefined) updates.college = college.trim();
    if (language) updates.language = language;
    if (avatar) updates.avatar = avatar;

    const updated = await updateUser(req.user!.userId, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Agent not found.' });
    }

    return res.json({
      message: 'Profile updated successfully.',
      user: {
        id: updated.id || updated._id,
        name: updated.name,
        email: updated.email,
        college: updated.college,
        language: updated.language,
        avatar: updated.avatar,
        xp: updated.xp,
        level: updated.level,
        streak: updated.streak,
        completedMissions: updated.completedMissions,
        badges: updated.badges,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Mock Forgot Password
router.post('/forgot-password', authLimiter, async (req: any, res: Response) => {
  return res.json({
    message: 'If an operative account exists, password recovery instructions have been dispatched.',
  });
});

export default router;
