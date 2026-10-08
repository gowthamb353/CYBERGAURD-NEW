import { Router, Response } from 'express';
import { getChallenges, getChallengeById, recordChallengeSubmission } from '../db/store.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/challenges (Answers and explanations are stripped server-side!)
router.get('/', async (req: any, res: Response) => {
  try {
    const { missionId } = req.query;
    const list = await getChallenges(missionId ? String(missionId) : undefined, false);
    return res.json({ challenges: list });
  } catch (error) {
    console.error('[Challenges] Error fetching challenges:', error);
    return res.status(500).json({ error: 'Unable to retrieve tactical challenges.' });
  }
});

// GET /api/challenges/:id
router.get('/:id', async (req: any, res: Response) => {
  try {
    const challenge = await getChallengeById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found.' });
    }

    const sanitized = challenge.toObject ? challenge.toObject() : { ...challenge };
    delete sanitized.correctAnswer;
    delete sanitized.explanation;
    if (sanitized.redFlags && Array.isArray(sanitized.redFlags)) {
      sanitized.redFlags = sanitized.redFlags.map((rf: any) => ({
        id: rf.id,
        textSnippet: rf.textSnippet,
      }));
    }

    return res.json({ challenge: sanitized });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to load challenge.' });
  }
});

// POST /api/challenges/:id/submit (Server-side answer validation ONLY)
router.post('/:id/submit', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { missionId, userAnswer } = req.body;
    if (userAnswer === undefined) {
      return res.status(400).json({ error: 'User answer payload required.' });
    }

    const result = await recordChallengeSubmission({
      userId: req.user!.userId,
      challengeId: req.params.id,
      missionId: missionId || 'm_phishing',
      userAnswer,
    });

    return res.json({
      success: true,
      isCorrect: result.isCorrect,
      score: result.score,
      xpEarned: result.xpEarned,
      correctAnswer: result.correctAnswer,
      explanation: result.explanation,
      newlyAwardedBadges: result.newlyAwardedBadges,
    });
  } catch (error: any) {
    console.error('[Challenges] Submission validation error:', error);
    return res.status(500).json({ error: error.message || 'Verification process encountered an error.' });
  }
});

export default router;
