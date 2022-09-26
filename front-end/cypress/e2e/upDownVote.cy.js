import { faker } from "@faker-js/faker";

const url = "http://localhost:3000";
const resetUrl = "http://localhost:5000/e2e/reset";

beforeEach(async ()=>{
  await cy.request('POST', resetUrl, {})
})

describe('handle upvote and downvote',()=>{
    const newRecommendation ={
        name:faker.lorem.word(),
        link:`https://www.youtube.com/${faker.lorem.word()}`
      }
    it('should upvote a link',()=>{
        cy.visit(`${url}`);
        cy.get("[data-cy=name]").type(newRecommendation.name);
        cy.get("[data-cy=link]").type(newRecommendation.link);
        cy.intercept('POST',"/recommendations").as("postRecommendation");
        cy.intercept('GET',"/recommendations").as("getRecommendation");

        cy.get("[data-cy=button]").click();
        cy.wait("@postRecommendation");
        cy.wait("@getRecommendation");
        cy.get("[data-cy=upvote]").click();
        cy.wait("@getRecommendation");
        cy.get("[data-cy=score]").should("contain","1");
    })
    it('should downvote a link',()=>{
        cy.visit(`${url}`);
        cy.get("[data-cy=name]").type(newRecommendation.name);
        cy.get("[data-cy=link]").type(newRecommendation.link);
        cy.intercept('POST',"/recommendations").as("postRecommendation");
        cy.intercept('GET',"/recommendations").as("getRecommendation");

        cy.get("[data-cy=button]").click();
        cy.wait("@postRecommendation");
        cy.wait("@getRecommendation");
        cy.get("[data-cy=downvote]").click();
        cy.wait("@getRecommendation");
        cy.get("[data-cy=score]").should("contain","-1");
    })
    it('should downvote a link until its get removed',()=>{
        cy.visit(`${url}`);
    
        cy.get("[data-cy=name]").type(newRecommendation.name);
        cy.get("[data-cy=link]").type(newRecommendation.link);
        cy.intercept('POST',"/recommendations").as("postRecommendation");
        cy.intercept('GET',"/recommendations").as("getRecommendation");

        cy.get("[data-cy=button]").click();
        cy.wait("@postRecommendation");
        cy.wait("@getRecommendation");


        for (let index = 0; index < 6; index++) {
            cy.get("[data-cy=downvote]").click();
            cy.wait("@getRecommendation");
        }

        cy.get("[data-cy=title]").should("not.exist")
    })
})