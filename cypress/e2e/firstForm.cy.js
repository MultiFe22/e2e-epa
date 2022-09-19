describe('Test get started button', () => {
  it('Test button', () => {
    cy.visit('https://www3.epa.gov/carbon-footprint-calculator/')
    cy.get('#get-started').click()
    // if all fields are empty, error message should be displayed
    cy.get('#failValidation').should('be.visible')

  })
})

describe('Try an invalid zip code', () => {
  let testdata
  before(function () {
    cy.fixture('bad-zip').then(function (data) {
      testdata = data
    })
  })
  it('Test invalid zip code', () => {
    cy.visit('https://www3.epa.gov/carbon-footprint-calculator/')
    cy.get('#zip-code-input').type(testdata.zip)
    cy.get('#get-started').click()
    // if all fields are empty, error message should be displayed
    cy.get('#invalidNum').should('be.visible')
    cy.get('#ppl-in-household-input').type(testdata.people)
    cy.get('#invalidNum').should('have.text', 'Please enter a valid number of people.')
    cy.get('#get-started').click()
    cy.get('#invalidNum').should('not.be.visible')
    cy.get('#invalidZip').should('be.visible')
  })
})

describe('Try a valid zip code', () => {
  let testdata
  let zipFactor
    before( () => {
      cy.fixture('assumptions').then(function (data) {
          testdata = data
      })
      cy.fixture('zip-factor').then(function (data) {
        zipFactor = data
      })
    })
    it ('Test calculation', () => {
      cy.calcNaturalGas(1, testdata.g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET, testdata.g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR, testdata.g_NUM_MONTHS_PER_YEAR).then((result) => { console.log(result) } )
    })
  })
