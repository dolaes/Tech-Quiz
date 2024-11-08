import { Answer } from '../../client/src/models/Answer';
import { Question } from '../../client/src/models/Question';

describe('Quiz Running', () => {
    context('Quiz Setup', () => {
        beforeEach(() => {
            cy.fixture('../fixtures/question.json').then((questions) => {
                cy.intercept('GET', '/api/questions/random', {
                    statusCode: 200,
                    body: questions,
                }).as('getRandomQuestions');
            });
            cy.visit('/')
        });
    
        it('should GET a random question on page load and render the first question on the page', () => {
            cy.get('button').contains('Start Quiz').click();
            cy.wait('@getRandomQuestions').its('response.statusCode').should('eq', 200);
            cy.fixture('../fixtures/question.json').then((questions) => {
                cy.get('h2').contains(questions[0].question).should('be.visible');
            });
        });
    });

    context('Taking Quiz', () => {
        beforeEach(() => {
            cy.fixture('../fixtures/question.json').then((questions) => {
                cy.intercept('GET', '/api/questions/random', {
                    statusCode: 200,
                    body: questions,
                }).as('getRandomQuestions');
            });
            cy.visit('/')
            cy.get('button').contains('Start Quiz').click();
        });
    
        it('should go to the answer all the questions correctly and reflect that on the final screen', () => {
            cy.fixture('../fixtures/question.json').then((questions) => {
                questions.forEach((question : Question) => {
                    const correctAnswerIndex = (question.answers.findIndex((answer: Answer) => answer.isCorrect) + 1).toString();
                    cy.get('button').contains(correctAnswerIndex).click();
                });
        
                cy.get('h2').contains('Quiz Completed').should('be.visible');
                cy.get('div').contains('Your score: 10/10').should('be.visible');
            });
        });

        it('should go to the answer all the questions incorrectly and reflect that on the final screen', () => {
            cy.fixture('../fixtures/question.json').then((questions) => {
                questions.forEach((question : Question) => {
                    const incorrectAnswerIndex = (question.answers.findIndex((answer: Answer) => !answer.isCorrect) + 1).toString();
                    cy.get('button').contains(incorrectAnswerIndex).click();
                });
        
                cy.get('h2').contains('Quiz Completed').should('be.visible');
                cy.get('div').contains('Your score: 0/10').should('be.visible');
            });
        });
    });

    context('Quiz Reset', () => {
        beforeEach(() => {
            cy.fixture('../fixtures/question.json').then((questions) => {
                cy.intercept('GET', '/api/questions/random', {
                    statusCode: 200,
                    body: questions,
                }).as('getRandomQuestions');
            });
            cy.visit('/')
            cy.get('button').contains('Start Quiz').click();

            cy.fixture('../fixtures/question.json').then((questions) => {
                questions.forEach((question : Question) => {
                    const correctAnswerIndex = (question.answers.findIndex((answer: Answer) => answer.isCorrect) + 1).toString();
                    cy.get('button').contains(correctAnswerIndex).click();
                });
        
                cy.get('h2').contains('Quiz Completed').should('be.visible');
                cy.get('div').contains('Your score: 10/10').should('be.visible');
            });
        });

        it('should reset the quiz and GET questions again', () => {
            cy.fixture('../fixtures/question.json').then((questions) => {
                cy.get('button').contains('Take New Quiz').click();
                cy.wait('@getRandomQuestions').its('response.statusCode').should('eq', 200);
                cy.get('h2').contains(questions[0].question).should('be.visible');
            });
        })
    });
});