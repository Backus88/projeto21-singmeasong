import { jest } from '@jest/globals';
import { recommendationService } from '../src/services/recommendationsService';
import { recommendationRepository } from '../src/repositories/recommendationRepository';
import * as factory from '../factories/unitFactory';
import { Recommendation } from '@prisma/client';
import { CreateRecommendationData } from '../src/services/recommendationsService';
import { conflictError, notFoundError } from '../src/utils/errorUtils';

beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});

describe('Test insert service', () => {
    it('should call findByname and create functions from repository', async () => {
        const recommendation = factory.recommendation;
        jest.spyOn(
            recommendationRepository,
            'findByName'
        ).mockImplementationOnce(() => {
            return null;
        });
        jest.spyOn(recommendationRepository, 'create').mockImplementation(
            () => {
                return null;
            }
        );
        await recommendationService.insert(recommendation);
        expect(recommendationRepository.create).toBeCalled();
        expect(recommendationRepository.findByName).toBeCalled();
    });
    it('should not allow to insert and return status 409 ', async () => {
        const recommendation = factory.recommendation;
        jest.spyOn(
            recommendationRepository,
            'findByName'
        ).mockImplementationOnce((): any => {
            return recommendation;
        });
        const promise = recommendationService.insert(recommendation);
        expect(promise).rejects.toEqual(
            conflictError('Recommendations names must be unique')
        );
    });
});

describe('upvote service', () => {
    it('should increase one upvote', async () => {
        const recommendation = factory.insertRecommendation;
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => recommendation
        );
        jest.spyOn(
            recommendationRepository,
            'updateScore'
        ).mockImplementationOnce((): any => recommendation);
        await recommendationService.upvote(factory.id);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
    });
    it('should not increase one upvote and throw 404', async () => {
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => null
        );
        const promise = recommendationService.upvote(factory.id);
        expect(promise).rejects.toEqual(notFoundError());
    });
});

describe('downvote service', () => {
    it('should deacrease one upvote', async () => {
        const recommendation = factory.insertRecommendation;
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => recommendation
        );
        jest.spyOn(
            recommendationRepository,
            'updateScore'
        ).mockImplementationOnce((): any => recommendation);
        jest.spyOn(recommendationRepository, 'remove');
        await recommendationService.downvote(factory.id);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).not.toBeCalled();
    });
    it('should not increase one upvote and throw 404', async () => {
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => null
        );
        const promise = recommendationService.downvote(factory.id);
        expect(promise).rejects.toEqual(notFoundError());
    });
    it('should remove the link', async () => {
        const recommendation = factory.lowScore;
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => recommendation
        );
        jest.spyOn(
            recommendationRepository,
            'updateScore'
        ).mockImplementationOnce((): any => recommendation);
        jest.spyOn(recommendationRepository, 'remove');
        await recommendationService.downvote(factory.id);
        expect(recommendationRepository.find).toBeCalled();
        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled();
    });
});

describe('test getByIdOrFail function', () => {
    it('should return the recommendation', async () => {
        const recommendation = factory.insertRecommendation;
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => {
                return recommendation;
            }
        );
        const result = await recommendationService.getById(factory.id);
        expect(result).toEqual(recommendation);
    });
    it('should throw error 404 not found', async () => {
        jest.spyOn(recommendationRepository, 'find').mockImplementationOnce(
            (): any => {
                return null;
            }
        );
        const result = recommendationService.getById(factory.id);
        expect(result).rejects.toEqual(notFoundError());
    });
});

describe('test get function', () => {
    it('should return the recommendation', async () => {
        const recommendation = factory.insertRecommendation;
        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(
            (): any => {
                return recommendation;
            }
        );
        const result = await recommendationService.get();
        expect(result).toEqual(recommendation);
    });
});

describe('test getTop function', () => {
    it('should return all the recommendations', async () => {
        const recommendation = factory.insertRecommendation;
        jest.spyOn(
            recommendationRepository,
            'getAmountByScore'
        ).mockImplementationOnce((): any => {
            return recommendation;
        });
        const result = await recommendationService.getTop(factory.id);
        expect(result).toEqual(recommendation);
    });
});

describe('test getRandom function', () => {
    it('should return recommendations with highe score than 10', async () => {
        const recommendation = factory.recommendation;
        jest.spyOn(Math, 'random').mockImplementationOnce((): number => 0.71);
        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(
            (): any => {
                return [
                    recommendation,
                    recommendation,
                    recommendation,
                    recommendation,
                ];
            }
        );
        jest.spyOn(Math, 'random').mockImplementationOnce((): number => 0.2);

        const result = await recommendationService.getRandom();
        expect(result).toEqual(recommendation);
    });
    it('should return recommendations with a lower score than 10', async () => {
        const recommendation = factory.recommendation;
        jest.spyOn(Math, 'random').mockImplementationOnce((): number => 0.69);
        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(
            (): any => {
                return [
                    recommendation,
                    recommendation,
                    recommendation,
                    recommendation,
                ];
            }
        );
        jest.spyOn(Math, 'random').mockImplementationOnce((): number => 0.2);

        const result = await recommendationService.getRandom();
        expect(result).toEqual(recommendation);
    });
    it('should return status 404 notfound ', async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(
            (): any => []
        );
        jest.spyOn(recommendationRepository, 'findAll').mockImplementationOnce(
            (): any => []
        );

        const result = recommendationService.getRandom();
        expect(result).rejects.toEqual(notFoundError());
    });
});
