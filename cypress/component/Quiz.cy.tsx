import Quiz from '../../client/src/components/Quiz';
import { Answer } from '../../client/src/models/Answer';
import { Question } from '../../client/src/models/Question';

describe('<Quiz />', () => {
    beforeEach(() => {
        cy.fixture('../fixtures/question.json').then((questions) => {
            cy.intercept('GET', '/api/questions/random', {
                statusCode: 200,
                body: questions,
            }).as('getRandomQuestions');
            cy.mount(<Quiz />);
        });
    });

    it('should display the start quiz button before starting the quiz', () => {
        cy.get('button').contains('Start Quiz').should('be.visible');
    });

    it('should start the quiz when the start button is clicked', () => {
        cy.get('button').contains('Start Quiz').click();
        cy.fixture('../fixtures/question.json').then((questions) => {
            cy.get('h2').contains(questions[0].question).should('be.visible');
        });
    });

    it('should progress to the next question when the user clicks an answer', () => {
        cy.get('button').contains('Start Quiz').click();
        cy.fixture('../fixtures/question.json').then((questions) => {
            cy.get('button').contains("1").click();
            cy.get('h2').contains(questions[1].question).should('be.visible');
        });
    });

    it('should complete the quiz with all the correct answer', () => {
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

    it('should complete the quiz with all the incorrect answer', () => {
        cy.get('button').contains('Start Quiz').click();

        cy.fixture('../fixtures/question.json').then((questions) => {
            questions.forEach((question : Question) => {
                const incorrectAnswerIndex = (question.answers.findIndex((answer: Answer) => !answer.isCorrect) + 1).toString();
                cy.get('button').contains(incorrectAnswerIndex).click();
            });
    
            cy.get('h2').contains('Quiz Completed').should('be.visible');
            cy.get('div').contains('Your score: 0/10').should('be.visible');
        });
    });

    it('should restart the quiz in the user wants clicks the reset button', () => {
        cy.get('button').contains('Start Quiz').click();

        cy.fixture('../fixtures/question.json').then((questions) => {
            questions.forEach((question : Question) => {
                const correctAnswerIndex = (question.answers.findIndex((answer: Answer) => answer.isCorrect) + 1).toString();
                cy.get('button').contains(correctAnswerIndex).click();
            });
    
            cy.get('button').contains('Take New Quiz').click();
            cy.get('h2').contains(questions[0].question).should('be.visible');
        });
    });
});