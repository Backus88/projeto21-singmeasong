import { faker } from '@faker-js/faker';
import { CreateRecommendationData } from '../src/services/recommendationsService';

export const recommendation: CreateRecommendationData ={
    name:faker.lorem.word(10),
    youtubeLink: "https://www.youtube.com/watch?v=NFEwN1N3vvA&t=2250s"
}

export const notValidLink: CreateRecommendationData ={
    name:faker.lorem.word(10),
    youtubeLink: faker.internet.url()
}
export const notValidFormat :any = {
    url: faker.lorem.word(5),
    test: faker.internet.url()
}

export const arrayOfRecommendations:CreateRecommendationData[] =[
    {
        name:faker.lorem.word(10),
        youtubeLink: "https://www.youtube.com/watch?v=NFEwN1N3vvA&t=2250s"
    },
    {
        name:faker.lorem.word(10),
        youtubeLink: "https://www.youtube.com/watch?v=zpGg_gxVKWc"
    },
    {
        name:faker.lorem.word(10),
        youtubeLink: "https://www.youtube.com/watch?v=XkhViKCaV4U"
    },
    {
        name:faker.lorem.word(10),
        youtubeLink: "https://www.youtube.com/watch?v=vj40Xsrwp-8&t=2102s"
    }
] 