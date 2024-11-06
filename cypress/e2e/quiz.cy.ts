describe('Quiz Running', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/');
    });

    it('should GET a raondom question on page load and render the question on the page', () => {
        cy.intercept('GET', 'api/random', {
            statusCode: 200,
            body: mockState
        }).as('getRandomQuestions');

        cy.visit('/');
    })
})