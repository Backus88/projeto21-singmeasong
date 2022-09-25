import app from "../src/app";
import supertest from "supertest";
import { prisma } from "../src/database";
import * as query from '../src/repositories/recommendationRepository';
import * as factory from '../factories/integrationFactory';
import { Recommendation } from "@prisma/client";

const tester = supertest(app)

beforeEach(async ()=>{
    await prisma.$executeRaw`TRUNCATE TABLE "recommendations" RESTART IDENTITY`;
})

describe('test route POST /recommendations', () => {
    it('should create a new music recommentation and return status 201', async() =>{
        const recommendation = factory.recommendation
        const result = await tester.post('/recommendations').send(recommendation);
        const created = await query.recommendationRepository.findByName(recommendation.name);
        expect(result.statusCode).toBe(201);
        expect(created.name).toBe(recommendation.name);
    });
    it('should not create a new recommendation and return status 422', async() =>{
        const recommendation = factory.notValidLink
        const result = await tester.post('/recommendations').send(recommendation);
        const created = await query.recommendationRepository.findByName(recommendation.name);
        expect(result.statusCode).toBe(422);
        expect(created?.name).toBeFalsy();
    })
    it('should not create a new recommendation and return status 422', async() =>{
        const recommendation = factory.notValidFormat
        const result = await tester.post('/recommendations').send(recommendation);
        const created = await query.recommendationRepository.findByName(recommendation.url);
        expect(result.statusCode).toBe(422);
        expect(created?.name).toBeFalsy();
    })
    it('should not create a recommentation and return status 409', async() =>{
        const recommendation = factory.recommendation
        await tester.post('/recommendations').send(recommendation);
        const created = await query.recommendationRepository.findByName(recommendation.name);
        const result = await tester.post('/recommendations').send(recommendation);
        expect(result.statusCode).toBe(409);
        expect(created.name).toBe(recommendation.name);
    });
});

describe('test route GET /recommendations', () => {
    it('should get a empty array return status 200', async() =>{
        const result = await tester.get('/recommendations');
        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual([]);
    });
    it('should get an array of objects and return status 200', async() =>{
        const recommendation = factory.recommendation
        await tester.post('/recommendations').send(recommendation);
        const result = await tester.get('/recommendations');
        expect(result.statusCode).toBe(200);
        expect(result.body).toHaveLength(1);
    });
});

describe('test route POST /recommendations/:id/upvote', () => {
    it('should add an upvote and return status 200', async() =>{
        const recommendation = factory.recommendation
        await tester.post('/recommendations').send(recommendation);
        const result = await tester.post('/recommendations/1/upvote');
        const created = await query.recommendationRepository.findByName(recommendation.name)
        expect(result.statusCode).toBe(200);
        expect(created.score).toEqual(1);
    });
    it('should not find the id and return status 404', async() =>{
        const result = await tester.post('/recommendations/1/upvote');
        expect(result.statusCode).toBe(404);
    });
    it('should give an internal server error and return status 500', async() =>{
        const result = await tester.post('/recommendations/aa/upvote');
        expect(result.statusCode).toBe(500);
    });
});

describe('test route POST /recommendations/:id/downvote', () => {
    it('should subtract an upvote and return status 200', async() =>{
        const recommendation = factory.recommendation
        await tester.post('/recommendations').send(recommendation);
        const result = await tester.post('/recommendations/1/downvote');
        const created = await query.recommendationRepository.findByName(recommendation.name)
        expect(result.statusCode).toBe(200);
        expect(created.score).toEqual(-1);
    });
    it('should not find the id and return status 404', async() =>{
        const result = await tester.post('/recommendations/1/downvote');
        expect(result.statusCode).toBe(404);
    });
    it('should give an internal server error and return status 500', async() =>{
        const result = await tester.post('/recommendations/aa/downvote');
        expect(result.statusCode).toBe(500);
    });
    it('should subtract six upvotes, delete the recommendation and return status 200', async() =>{
        const recommendation = factory.recommendation
        let result:any;
        await tester.post('/recommendations').send(recommendation);
        for (let index = 0; index < 6; index++) {
            result = await tester.post('/recommendations/1/downvote');
        }
        const created = await query.recommendationRepository.findByName(recommendation.name);
        expect(result.statusCode).toBe(200);
        expect(created).toBeNull();
    });
});

describe('test route GET /recommendations/:id', () => {
    it('should get a empty object return status 200', async() =>{
        const result = await tester.get('/recommendations/1');
        expect(result.statusCode).toBe(404);
        expect(result.body).toStrictEqual({});
    });
    it('should get an object and return status 200', async() =>{
        const recommendation = factory.recommendation
        let type : Recommendation;
        await tester.post('/recommendations').send(recommendation);
        const result = await tester.get('/recommendations/1');
        expect(result.statusCode).toBe(200);
        expect(typeof (result.text)).toBe('string')
    });
    it('should get an internal server error and return status 500', async() =>{
        const result = await tester.get('/recommendations/aaa');
        expect(result.statusCode).toBe(500);
    });
});

describe('test route GET /recommendations/random', () => {
    it('should get an random object and return status 200', async() =>{
        const recommendations = factory.arrayOfRecommendations;
        for(const recommendation of recommendations){
            await tester.post('/recommendations').send(recommendation);
        }
        const result = await tester.get('/recommendations/random');
        expect(result.statusCode).toBe(200);
        expect(typeof (result.text)).toBe('string')
    });
    it('should get a empty object return status 200', async() =>{
        const result = await tester.get('/recommendations/random');
        expect(result.statusCode).toBe(404);
        expect(result.body).toStrictEqual({});
    });
});

describe('test route GET /recommendations/top/:amount', () => {
    it('should get an random object and return status 200', async() =>{
        const recommendations = factory.arrayOfRecommendations;
        for(const recommendation of recommendations){
            await tester.post('/recommendations').send(recommendation);
        }
        const result = await tester.get('/recommendations/top/2');
        expect(result.statusCode).toBe(200);
        expect(result.body.length).toBe(2)
    });
    it('should get a empty object return status 200', async() =>{
        const result = await tester.get('/recommendations/top/2');
        expect(result.statusCode).toBe(200);
        expect(result.body).toStrictEqual([]);
    });
    it('should get an internal server error and return status 500', async() =>{
        const result = await tester.get('/recommendations/top/aaaa');
        expect(result.statusCode).toBe(500);
    });
});


afterAll(async () => {
	await prisma.$disconnect();
});