import { faker } from "@faker-js/faker";

const url = "http://localhost:3000";
const resetUrl = "http://localhost:5000/e2e/reset";

beforeEach(async ()=>{
  await cy.request('POST', resetUrl, {})
})

describe('create recommendation', () => {
  const newRecommendation ={
    name:faker.lorem.word(),
    link:`https://www.youtube.com/${faker.lorem.word()}`
  }
  it('should create a new recommendation', () => {
    cy.visit(`${url}`);
    cy.get("[data-cy=name]").type(newRecommendation.name);
    cy.get("[data-cy=link]").type(newRecommendation.link);
    cy.intercept('POST',"/recommendations").as("postRecommendation");
    cy.intercept('GET',"/recommendations").as("getRecommendation");

    cy.get("[data-cy=button]").click();
    cy.wait("@postRecommendation");
    cy.wait("@getRecommendation");
    cy.get("[data-cy=title]").should("contain", newRecommendation.name);
    cy.get("[data-cy=video]").should("be.visible");
  })
})