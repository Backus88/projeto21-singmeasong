import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import * as query from '../src/repositories/recommendationRepository';
import * as factory from '../factories/integrationFactory';

const tester = supertest(app)

beforeEach(async ()=>{
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
})

describe('test route POST /register', () => {
    it('should create a new music recommentation and return status 201', async() =>{
        const recommendation = factory.recommendation
        const result = await tester.post('/recommendations').send(recommendation);
        const created = await query.recommendationRepository.findByName(recommendation.name);
        expect(result.statusCode).toBe(201);
        expect(created.name).toBe(recommendation.name);
    })
});

afterAll(async () => {
	await prisma.$disconnect();
});