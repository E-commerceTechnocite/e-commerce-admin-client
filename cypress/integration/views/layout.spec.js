/// <reference types="cypress" />

describe('Global layout test', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Checks user auth on url change', () => {
    // cy.quickLogin('admin@test.com', 'admin')
    cy.getByTestId('products').click()
    cy.checkUser()
    cy.url().should('include', '/products')
  })
})
