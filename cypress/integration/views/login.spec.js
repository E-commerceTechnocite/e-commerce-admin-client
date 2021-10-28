/// <reference types="cypress" />

describe('Global login test', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Login exists', () => {
    cy.get('form')
  })
})
