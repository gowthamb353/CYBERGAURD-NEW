import { Router, Response } from 'express';
import { getLeaderboardData, findUserById } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const type = (req.query.type as 'global' | 'college') || 'global';
    const user = await findUserById(req.user!.userId);
    const userCollege = user?.college || '';

    const list = await getLeaderboardData(type, userCollege);

    return res.json({
      leaderboard: list,
      userHasCollege: Boolean(userCollege.trim()),
      userCollege,
    });
  } catch (error) {
    console.error('[Leaderboard] Error:', error);
    return res.status(500).json({ error: 'Failed to load leaderboard.' });
  }
});

export default router;
