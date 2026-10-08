import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB, isDbConnected } from './db/connection.js';
import { UserModel, ChallengeModel } from './db/models.js';
import { SEED_CHALLENGES } from './db/seedData.js';

dotenv.config();

async function runSeed() {
  console.log('[Seed] Starting Cyber Guardian database seeding...');
  await connectDB();

  if (isDbConnected()) {
    console.log('[Seed] Connected to MongoDB Atlas. Dropping old challenges & seeding fresh...');
    await ChallengeModel.deleteMany({});
    await ChallengeModel.insertMany(SEED_CHALLENGES);
    console.log(`[Seed] Seeded ${SEED_CHALLENGES.length} challenges into MongoDB Atlas.`);

    const existingUser = await UserModel.findOne({ email: 'guardian@cyber.shield' });
    if (!existingUser) {
      const passwordHash = await bcrypt.hash('CyberGuardian2026!', 10);
      await UserModel.create({
        name: 'Cyber Sentinel',
        email: 'guardian@cyber.shield',
        password: passwordHash,
        college: 'Cyber Defense Academy',
        avatar: 'avatar-1',
        language: 'en',
        xp: 650,
        level: 3,
        streak: 3,
        lastActiveDate: new Date(),
        completedMissions: ['m_phishing'],
        badges: ['first_mission', 'phishing_hunter'],
      });
      console.log('[Seed] Default operative account created: guardian@cyber.shield');
    }
  } else {
    console.log(`[Seed] MongoDB not connected; in-memory store initialized with ${SEED_CHALLENGES.length} challenges.`);
  }

  console.log('[Seed] Database seeding completed successfully.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('[Seed] Error during seeding:', err);
  process.exit(1);
});
