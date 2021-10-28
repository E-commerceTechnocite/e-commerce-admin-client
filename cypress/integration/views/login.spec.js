/// <reference types="cypress" />

describe('Global login test', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Checks if login exists', () => {
    cy.get('form')
    cy.getByTestId('email')
    cy.getByTestId('password')
    cy.getByTestId('submit')
  })

  it('If email & password empty then cannot send and shows error message', () => {
    cy.getByTestId('email').click().blur().should('be.empty')
    cy.getByTestId('email-error').should('be.visible')
    cy.getByTestId('password').click().blur().should('be.empty')
    cy.getByTestId('password-error').should('be.visible')
  })

  it('Cannot submit without both inputs value', () => {
    cy.containsByTestId('submit', 'Login').click()
    cy.getByTestId('email-error').should('be.visible')
    cy.getByTestId('password-error').should('be.visible')
  })

  it('Throws an error if credentials are not valid', () => {
    cy.getByTestId('email').type('wrong@user.com').blur()
    cy.getByTestId('email-error').should('not.exist')
    cy.getByTestId('password').type('123').blur()
    cy.getByTestId('password-error').should('not.exist')
    cy.containsByTestId('submit', 'Login').click()
    cy.getByTestId('global-error').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('Logs the user if credentials are valid', () => {
    cy.login('admin@test.com', 'admin')
  })
})
