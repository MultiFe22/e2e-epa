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

function calcNaturalGas(gasInput, g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET,g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR, g_NUM_MONTHS_PER_YEAR) {
    return (gasInput / g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET * g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR) * g_NUM_MONTHS_PER_YEAR;
}

function calcElectric(electricInput, g_AVG_ELEC_PRICE_PER_KILOWATT, g_eFactorValue, g_NUM_MONTHS_PER_YEAR){
    return electricInput / g_AVG_ELEC_PRICE_PER_KILOWATT * g_eFactorValue * g_NUM_MONTHS_PER_YEAR
}

function calcFuelOil(fuelOilInput, g_AVG_FUEL_OIL_PRICE_PER_GALLON, g_FUEL_OIL_EMISSIONS_FACTOR, g_NUM_MONTHS_PER_YEAR){
    return fuelOilInput / g_AVG_FUEL_OIL_PRICE_PER_GALLON * g_FUEL_OIL_EMISSIONS_FACTOR * g_NUM_MONTHS_PER_YEAR
}

function calcPropane(propaneInput, g_AVG_PROPANE_PRICE_PER_GALLON, g_PROPANE_EMISSIONS_FACTOR, g_NUM_MONTHS_PER_YEAR){
    return propaneInput / g_AVG_PROPANE_PRICE_PER_GALLON * g_PROPANE_EMISSIONS_FACTOR * g_NUM_MONTHS_PER_YEAR
}

function calcSummerCoolingAmount (elecTotal, utilityFactor, g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK, summerAC) {
    return elecTotal * utilityFactor * g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK * summerAC
}

function calcSummerCoolingDollar(utilityInput, utilityFactor, g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK, summerAC, g_NUM_MONTHS_PER_YEAR) {
    return utilityInput * utilityFactor * g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK * summerAC * g_NUM_MONTHS_PER_YEAR
}

function calcWinterHeatingAmount (greenTotal, utilityFactor, g_HEATING_SAVINGS_PER_DEGREE_OF_SETBACK, winterHeat) {
    return greenTotal * utilityFactor * g_HEATING_SAVINGS_PER_DEGREE_OF_SETBACK * winterHeat
}
function calcReplaceBulbsAmount(bulbInput, g_LAMP_KWH_SAVINGS, g_eFactorValue){
   return bulbInput * g_LAMP_KWH_SAVINGS * g_eFactorValue;
}

function calcReplaceBulbsDollar(bulbInput, g_LAMP_DOLLAR_SAVINGS){
    return bulbInput * g_LAMP_DOLLAR_SAVINGS
}

function calcComputerPowerAmount(g_COMPUTER_SLEEP_SAVINGS, g_eFactorValue){
    return g_COMPUTER_SLEEP_SAVINGS * g_eFactorValue
}

function calcComputerPowerDollar(g_COMPUTER_SLEEP_SAVINGS, g_AVG_ELEC_PRICE_PER_KILOWATT){
    return g_COMPUTER_SLEEP_SAVINGS * g_AVG_ELEC_PRICE_PER_KILOWATT
}

function calcGasSavings(emissionsSaved, g_CO2_EMITTED_PER_GALLON_OF_GASOLINE){
    // strip commas from emissionsSaved
    emissionsSaved = emissionsSaved.replace(/,/g, '')
    emissionsSaved = parseFloat(emissionsSaved)
    return (emissionsSaved / g_CO2_EMITTED_PER_GALLON_OF_GASOLINE)
}

function calcTreesSavings(emissionsSaved){
    emissionsSaved = emissionsSaved.replace(/,/g, '')
    emissionsSaved = parseFloat(emissionsSaved)
    return (emissionsSaved / 86.0) 
}

function calcRecyclingSavings(emissionsSaved){
    return (emissionsSaved / 3.1)
}

Cypress.Commands.add('calcNaturalGas', calcNaturalGas)

Cypress.Commands.add('calcElectric', calcElectric)

Cypress.Commands.add('calcFuelOil', calcFuelOil)

Cypress.Commands.add('calcPropane', calcPropane)

Cypress.Commands.add('calcSummerCoolingAmount', calcSummerCoolingAmount)

Cypress.Commands.add('calcSummerCoolingDollar', calcSummerCoolingDollar)

Cypress.Commands.add('calcWinterHeatingAmount', calcWinterHeatingAmount)

Cypress.Commands.add('calcReplaceBulbsAmount', calcReplaceBulbsAmount)

Cypress.Commands.add('calcReplaceBulbsDollar', calcReplaceBulbsDollar)

Cypress.Commands.add('calcComputerPowerAmount', calcComputerPowerAmount)

Cypress.Commands.add('calcComputerPowerDollar', calcComputerPowerDollar)

Cypress.Commands.add('calcGasSavings', calcGasSavings)

Cypress.Commands.add('calcTreesSavings', calcTreesSavings)

Cypress.Commands.add('calcRecyclingSavings', calcRecyclingSavings)