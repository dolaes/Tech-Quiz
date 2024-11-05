import React from 'react'
import Quiz from '../../client/src/components/Quiz'

describe('<Quiz />', () => {
    it('should display the start quiz button before starting the quiz', () => {
        cy.mount(<Quiz/>)
        cy.get('button').contains('Start Quiz').should('be.visible');
    })