import { prisma } from '../database.js';

export async function resetBd() {
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
}
