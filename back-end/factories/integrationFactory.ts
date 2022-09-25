import { faker } from '@faker-js/faker';
import { CreateRecommendationData } from '../src/services/recommendationsService';

export const recommendation: CreateRecommendationData ={
    name:faker.lorem.word(10),
    youtubeLink: "https://www.youtube.com/watch?v=NFEwN1N3vvA&t=2250s"
}