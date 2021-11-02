// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// get by data-cy id
Cypress.Commands.add('getByTestId', (testId) => {
  cy.get(`[data-cy='${testId}']`)
})

// contains by data-cy id
Cypress.Commands.add('containsByTestId', (testId, contains) => {
  cy.contains(`[data-cy='${testId}']`, contains)
})

// Post login, status 201
Cypress.Commands.add('login', (email, password) => {
  cy.getByTestId('email').type(email).blur()
  cy.getByTestId('email-error').should('not.exist')
  cy.getByTestId('password').type(password).blur()
  cy.getByTestId('password-error').should('not.exist')

  cy.getByTestId('global-error').should('not.exist')
  cy.request({
    method: 'POST',
    url: 'http://localhost:3000/v1/o-auth/login',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { email, password },
  }).then((res) => {
    expect(res.status).to.eq(201)
    expect(res.body).to.have.property('access_token')
    expect(res.body).to.have.property('refresh_token')
    Cypress.env('refresh', res.body.refresh_token)
  })
  var token = Cypress.env('token')
  cy.containsByTestId('submit', 'Login').click()
  cy.url().should('include', '/')
  cy.window().its('sessionStorage').invoke('getItem', 'token').should('exist')
  cy.window().its('sessionStorage').invoke('getItem', 'refresh').should('exist')
  console.log(token)
  cy.request({
    url: 'http://localhost:3000/v1/o-auth/permissions',
    headers: {
      authorization: 'Bearer ' + token,
      //   'Content-Type': 'application/json',
    },
  }).then((res) => {
    expect(res.status).to.eq(200)
    cy.window().its('sessionStorage').invoke('getItem', 'permissions').should('exist')
      console.log(res)
  })
})
