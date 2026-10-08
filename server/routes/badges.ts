import { Router, Response } from 'express';
import { BADGE_DEFINITIONS } from '../../src/config/gameRules.js';
import { findUserById } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await findUserById(req.user!.userId);
    const userBadges = user?.badges || [];

    const badges = BADGE_DEFINITIONS.map((b) => ({
      ...b,
      isUnlocked: userBadges.includes(b.id) || userBadges.includes(b.code),
    }));

    return res.json({ badges });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve honors and badges.' });
  }
});

export default router;
