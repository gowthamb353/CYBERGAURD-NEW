import { Router, Response } from 'express';
import { getMissions, findUserById } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await findUserById(req.user!.userId);
    const completedList = user?.completedMissions || [];
    const allMissions = await getMissions();

    const sequence = allMissions.map((m, index) => {
      const isCompleted = completedList.includes(m.id);
      let isUnlocked = false;

      if (index === 0) {
        isUnlocked = true;
      } else {
        const prevMission = allMissions[index - 1];
        isUnlocked = completedList.includes(prevMission.id);
      }

      return {
        ...m,
        isCompleted,
        isUnlocked,
      };
    });

    return res.json({ missions: sequence });
  } catch (error) {
    console.error('[Missions] Error retrieving missions:', error);
    return res.status(500).json({ error: 'Failed to retrieve mission directives.' });
  }
});

export default router;
