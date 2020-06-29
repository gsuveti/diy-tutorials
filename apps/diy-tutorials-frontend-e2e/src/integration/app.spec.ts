describe('diy-tutorials-frontend', () => {
    beforeEach(() => cy.visit('http://localhost:8080/'));

    it('should display welcome message', () => {
        cy.get("#post-1363").contains("Mucegai Prod");
        cy.get("#post-1363").contains("Mucegai Prod").click({force: true});
        cy.get("#45a63e73-57b1-4b06-b07b-e75b05049d1b .question-options > :nth-child(1) > .btn").click({force: true});

        cy.get("#32b991d4-ef1b-476b-873f-9f8ebe740c74").clear().type("1");
        cy.get("#316994b0-10b2-45ce-81eb-0af2f580126a").clear().type("1");
        cy.get("#cc76adc9-3e71-469e-a21d-63173cb305e7").clear().type("1");

        cy.get("#4094fe9d-f1da-4127-8cdb-e9820f5e2cd5").clear().type("1");
        cy.get("#dd69233f-5976-4035-b29b-d8a19e7d3271").clear().type("1");

        cy.get("#dc7c3358-9568-4a0a-9c85-ed35b6aed865 .question-options > :nth-child(1) > .btn").click({force: true});
        cy.get("#c69c66a7-c7c1-42fe-a1fc-5269071560d4 .question-options > :nth-child(1) > .btn").click({force: true});
        cy.get(".btn").contains("Calculează");
        cy.get(".btn").contains("Calculează").click();

    });
});
