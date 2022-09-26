import { faker } from '@faker-js/faker';
import { CreateRecommendationData } from '../src/services/recommendationsService';
import { Recommendation } from '@prisma/client';

export const recommendation: CreateRecommendationData = {
    name: faker.lorem.word(10),
    youtubeLink: 'https://www.youtube.com/watch?v=NFEwN1N3vvA&t=2250s',
};

export const insertRecommendation: Recommendation = {
    id: faker.datatype.number({ max: 100 }),
    name: faker.lorem.word(10),
    youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
    score: faker.datatype.number({ min: 0, max: 100 }),
};

export const id: number = faker.datatype.number({ max: 100 });

export const lowScore: Recommendation = {
    id: faker.datatype.number({ max: 100 }),
    name: faker.lorem.word(10),
    youtubeLink: `https://www.youtube.com/${faker.lorem.word()}`,
    score: faker.datatype.number({ min: -100, max: -6 }),
};
