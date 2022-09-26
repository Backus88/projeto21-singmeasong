import { faker } from "@faker-js/faker";

const url = "http://localhost:3000";
const resetUrl = "http://localhost:5000/e2e/reset";
const urlBack = "http://localhost:5000";

beforeEach(async ()=>{
  await cy.request('POST', resetUrl, {})
})

describe("go to pages listed in menu when clicked", ()=>{
    const newRecommendation ={
    name:faker.lorem.word(),
    link:`https://www.youtube.com/${faker.lorem.word()}`
    }
    it("should show the 10 top links",()=>{
        cy.visit(`${url}`);
        let recommendation;
        for (let index = 0; index < 14; index++) {
            recommendation={
                name:faker.lorem.word(),
                link:`https://www.youtube.com/${faker.lorem.word()}`
            }
            cy.get("[data-cy=name]").type(recommendation.name);
            cy.get("[data-cy=link]").type(recommendation.link);
            cy.intercept('POST',"/recommendations").as("postRecommendation");
            cy.intercept('GET',"/recommendations").as("getRecommendation");

            cy.get("[data-cy=button]").click();
            cy.wait("@postRecommendation");
            cy.wait("@getRecommendation");
        }
        cy.intercept("GET", `/recommendations/top/10`).as("getTopRecommendations");
        cy.get("[data-cy=top]").click();
        cy.wait(1000)
        cy.url().should("equal", `${url}/top`);
        cy.get("[data-cy=title]").should("have.length", 10);
    })
    it("should show random links",()=>{
        cy.visit(`${url}`);
        let recommendation;
        for (let index = 0; index < 5; index++) {
            recommendation={
                name:faker.lorem.word(),
                link:`https://www.youtube.com/${faker.lorem.word()}`
            }
            cy.get("[data-cy=name]").type(recommendation.name);
            cy.get("[data-cy=link]").type(recommendation.link);
            cy.intercept('POST',"/recommendations").as("postRecommendation");
            cy.intercept('GET',"/recommendations").as("getRecommendation");

            cy.get("[data-cy=button]").click();
            cy.wait("@postRecommendation");
            cy.wait("@getRecommendation");
        }
        cy.intercept("GET", `/recommendations/random`).as("getRandomRecommendations");

        cy.get("[data-cy=random]").click();
        cy.wait("@getRandomRecommendations");
        cy.url().should("equal", `${url}/random`);
        cy.get("[data-cy=title]").should("have.length", 1);
    })
    it("go to homepage",()=>{
        cy.visit(`${url}`);
        let recommendation;
        for (let index = 0; index < 3; index++) {
            recommendation={
                name:faker.lorem.word(),
                link:`https://www.youtube.com/${faker.lorem.word()}`
            }
            cy.get("[data-cy=name]").type(recommendation.name);
            cy.get("[data-cy=link]").type(recommendation.link);
            cy.intercept('POST',"/recommendations").as("postRecommendation");
            cy.intercept('GET',"/recommendations").as("getRecommendation");

            cy.get("[data-cy=button]").click();
            cy.wait("@postRecommendation");
            cy.wait("@getRecommendation");
        }
        cy.visit(`${url}/random`);
        cy.wait(500);
        cy.get("[data-cy=home]").click();
        cy.wait(500);
        cy.url().should("equal", `${url}/`);
        cy.get("[data-cy=title]").should("have.length", 3);
    })
})