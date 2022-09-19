describe('Happy Ending', () => {
    let zip
    let zipFactor
    let numPeople = 1
    let assumptions
    before(function () {
        cy.fixture('zip-factor').then(function (data) {
            // random select a key from the object
            let keys = Object.keys(data)
            let randomKey = keys[ keys.length * Math.random() << 0]
            // get the value of the key
            zipFactor = data[randomKey]/1000
            // get the key
            zip = randomKey
            })
        cy.fixture('assumptions').then(function (data) {
            assumptions = data
        })
      })
    it('Try to get started without any input', () => {
      cy.visit('https://www3.epa.gov/carbon-footprint-calculator/')
      cy.get('#get-started').click()
    })

    it('Try to get started with valid zip code and people', () => {
      cy.get('#failValidation').should('be.visible')
      cy.get('#zip-code-input').type(zip)
      cy.get('#ppl-in-household-input').type(numPeople)
      cy.get('#get-started').click()
    })
    it('Partially fill out the energy form', () => {
      cy.get('#primaryHeatingSource').should('be.visible')
      cy.get('#primaryHeatingSource').select('Natural Gas')
      cy.get('#naturalGasTextInput').type('1')
      cy.get('.naturalGas > .inner-container > .green-lb-total > span').invoke('text').then((text) => {
        cy.calcNaturalGas(1, assumptions.g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET,
            assumptions.g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })
      cy.get('#electricityTextInput').type('1')
      cy.get('.electricity > .inner-container > .green-lb-total > span').invoke('text').then((text) => {
        cy.calcElectric(1, assumptions.g_AVG_ELEC_PRICE_PER_KILOWATT, zipFactor, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })
      cy.get('#fuelTextInput').type('1')
      cy.get('.fuel > .inner-container > .green-lb-total > span').invoke('text').then((text) => {
        cy.calcFuelOil(1, assumptions.g_AVG_FUEL_OIL_PRICE_PER_GALLON, assumptions.g_FUEL_OIL_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })
      cy.get('#propaneTextInput').type('1')
        cy.get('.propane > .inner-container > .green-lb-total > span').invoke('text').then((text) => {
        cy.calcPropane(1, assumptions.g_AVG_PROPANE_PRICE_PER_GALLON, assumptions.g_PROPANE_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })
        cy.get(':nth-child(4) > .totalEmissions').invoke('text').then((total) => {
            cy.calcNaturalGas(1, assumptions.g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET, assumptions.g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((gas) => {
                cy.calcElectric(1, assumptions.g_AVG_ELEC_PRICE_PER_KILOWATT, zipFactor, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((elec) => {
                    cy.calcFuelOil(1, assumptions.g_AVG_FUEL_OIL_PRICE_PER_GALLON, assumptions.g_FUEL_OIL_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((fuel) => {
                        cy.calcPropane(1, assumptions.g_AVG_PROPANE_PRICE_PER_GALLON, assumptions.g_PROPANE_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((propane) => {
                            cy.wrap(parseFloat(gas) + parseFloat(elec) + parseFloat(fuel) + parseFloat(propane)).invoke('toFixed', 0).should('eq', total)
                        })
                    })
                })
            })
        })

      cy.get('#energyAC').type('10')
      cy.get('.bold > .ac-energy-co2-saved').invoke('text').then((text) => {
        cy.calcElectric(1, assumptions.g_AVG_ELEC_PRICE_PER_KILOWATT, zipFactor, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10)
            .then((elec) => {
                cy.calcSummerCoolingAmount(elec, assumptions.g_PERCENT_ELEC_TO_COOLING, assumptions.g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK, 10).invoke('toFixed', 0)
                    .invoke('toString')
                    .should('eq', text)
            })
      })
      cy.get('.bold > .ac-energy-dollars-saved').invoke('text').then((text) => {
        cy.get('#electricityTextInput').invoke('val').then((elec) => {
            cy.calcSummerCoolingDollar(elec, assumptions.g_PERCENT_ELEC_TO_COOLING, assumptions.g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK, 10, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 0)
                .invoke('toString')
                .should('eq', text)
        })
        })
        cy.get('#energyHeat').type('10')
      
      cy.get(':nth-child(1) > tbody > :nth-child(3) > :nth-child(5) > .bold').should('have.text', '25 lbs of CO2')
      cy.get('.bold > .ac-energy-dollars-saved').should('have.text', '1')
      cy.get('.bold > .heat-energy-dollars-saved').should('have.text', '2')
      cy.get(':nth-child(5) > .newEmissionTotal').invoke('text').then((newEmission) => {
        cy.calcNaturalGas(1, assumptions.g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET, assumptions.g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((gas) => {
            cy.calcWinterHeatingAmount(gas, assumptions.g_PERCENT_NAT_GAS_TO_HEATING, assumptions.g_HEATING_SAVINGS_PER_DEGREE_OF_SETBACK, 10).invoke('toFixed', 10).then((heat) => {
                cy.calcElectric(1, assumptions.g_AVG_ELEC_PRICE_PER_KILOWATT, zipFactor, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((elec) => {
                    cy.calcSummerCoolingAmount(elec, assumptions.g_PERCENT_ELEC_TO_COOLING, assumptions.g_COOLING_SAVINGS_PER_DEGREE_OF_SETBACK, 10).invoke('toFixed', 10).then((cool) => {
                        cy.calcNaturalGas(1, assumptions.g_AVG_NAT_GAS_PRICE_PER_THOUSAND_CUBIC_FEET, assumptions.g_NAT_GAS_CUBIC_FEET_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((gas) => {
                            cy.calcElectric(1, assumptions.g_AVG_ELEC_PRICE_PER_KILOWATT, zipFactor, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((elec) => {
                                cy.calcFuelOil(1, assumptions.g_AVG_FUEL_OIL_PRICE_PER_GALLON, assumptions.g_FUEL_OIL_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((fuel) => {
                                    cy.calcPropane(1, assumptions.g_AVG_PROPANE_PRICE_PER_GALLON, assumptions.g_PROPANE_EMISSIONS_FACTOR, assumptions.g_NUM_MONTHS_PER_YEAR).invoke('toFixed', 10).then((propane) => {
                                        cy.wrap((parseFloat(gas) + parseFloat(elec) + parseFloat(fuel) + parseFloat(propane) - (parseFloat(heat) + parseFloat(cool)))).invoke('toFixed', 0).should('eq', (parseFloat(newEmission)).toFixed(0))
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        })
      cy.get('#lightsToReplace').type('3')
      cy.get('.bold > .lightEnergyCo2Saved').invoke('text').then((text) => {
        cy.calcReplaceBulbsAmount(3, assumptions.g_LAMP_KWH_SAVINGS, zipFactor).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })
        

      cy.get('.bold > .lightEnergyDollarsSaved').invoke('text').then((text) => {
        cy.calcReplaceBulbsDollar(3, assumptions.g_LAMP_DOLLAR_SAVINGS).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })
      cy.get('#pwrMgmtSelect').select('Will Do')
      cy.get('.bold > .computerPwrDollarsSaved').invoke('text').then((text) => {
        cy.calcComputerPowerDollar(assumptions.g_COMPUTER_SLEEP_SAVINGS, assumptions.g_AVG_ELEC_PRICE_PER_KILOWATT).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })

      cy.get('.bold > .computerPwrCo2Saved').invoke('text').then((text) => {
        cy.calcComputerPowerAmount(assumptions.g_COMPUTER_SLEEP_SAVINGS, zipFactor).invoke('toFixed', 0)
            .invoke('toString')
            .should('eq', text)
        })

        cy.get('#increaseGreenInput').type('1')
      cy.get('#coldWaterSelect').select('Already Done')
      cy.get('#loadsPerWeek').type('7')
      cy.get('.bold > .coldWaterDollarsSaved').should('have.text', '42')
      // should have the color rgb(170, 170, 170)
      cy.get('.bold > .coldWaterDollarsSaved').should('have.css', 'color', 'rgb(170, 170, 170)')
    })
    it('Fully fill out the transportation form', () => {
      cy.get('#to-transportation').click()
      cy.get('#numVehiclesInput').select('1')
      cy.get('#maintCurrentSelect').select('Do Not Do')
      cy.get('#vehicle1Miles').type('10')
      cy.get('#vehicle1Select').select('Per Week')
      cy.get('#vehicle1GasMileage').type('5')
      cy.get('.vehicle1Co2').should('have.text', '2,149')
      cy.get('#maintReduceSelect').select('Will Do')
      cy.get('.maintReducDollarsSaved').should('have.text', '27')
      cy.get('.maintReducCo2Saved').should('have.text', '145')
      cy.get('#reduceMilesInput1').type('3')
      cy.get('#reduceMilesSelect1').should('have.value', 'Per Year')
      cy.get('.bold > .reduceMilesVehicle1Dollars').should('have.text', '1')
      cy.get('.bold > .reduceMilesVehicle1Co2').should('have.text', '12')
      cy.get('#replaceVehicleInput1').type('6')
      cy.get('.bold > .replaceVehicle1Dollars').should('have.text', '64')
      cy.get('.bold > .replaceVehicle1Co2').should('have.text', '344')
    })
    it('Fully fill out the waster form', () => {
      cy.get('#to-waste').click()
      cy.get('#magazinesCheckbox').click()
      cy.get('#wasteReductionRadios > :nth-child(5)').should('not.be.visible')
      cy.get('#plasticCheckboxR').click()
      cy.get('#userWasteCurrent').should('have.text', '665')
      cy.get('.mobile-hook > .wasteWillSave').should('have.text', '36')
      cy.get('#to-report').click()
    })
    it('Verify the report and notices that is incomplete', () => {
      cy.get('#homeEnergyProgressBar').should('have.value', 73.33333333333333)
      cy.get('#progress-incomplete').should('be.visible')
      cy.get(':nth-child(4) > .totalEmissions').invoke('text').then((text) => {
        cy.get('.rowChart > .totalEmissions').invoke('text').should('eq', text)
        })
      cy.get(':nth-child(1) > div > .gallonsOfGasSavings').invoke('text').then((text) => {
        cy.get(':nth-child(5) > .newEmissionTotal').invoke('text').then((newEmission) => {
            cy.get('.rowChart > .totalEmissions').invoke('text').then((rowChart) => {
                cy.wrap((parseFloat(rowChart.replace(/,/g, '')) - parseFloat(newEmission.replace(/,/g, '')))).invoke('toFixed', 10).then((emissionsSaved) => {
                    cy.calcGasSavings(emissionsSaved, assumptions.g_CO2_EMITTED_PER_GALLON_OF_GASOLINE).invoke('toFixed', 0).should('satisfy', (temp) => {
                        return text == temp+1 || text == temp || text == temp-1
                    })
                })
            })
        })
            
        })
      cy.get(':nth-child(3) > div > .treeSavings').then((text) => {
        cy.get(':nth-child(5) > .newEmissionTotal').invoke('text').then((newEmission) => {
            cy.get('.rowChart > .totalEmissions').invoke('text').then((rowChart) => {
                cy.wrap((parseFloat(rowChart.replace(/,/g, '')) - parseFloat(newEmission.replace(/,/g, '')))).invoke('toFixed', 10).then((emissionsSaved) => {
                    cy.calcTreesSavings(emissionsSaved).invoke('toFixed', 0).should('satisfy', (temp) => {
                        return text.text() == temp+1 || text.text() == temp || text.text() == temp-1
                    })
                })
            })
        })
            
        })
      cy.get(':nth-child(5) > div > .wasteSavings').then((text) => {
        cy.get(':nth-child(5) > .newEmissionTotal').invoke('text').then((newEmission) => {
            cy.get('.rowChart > .totalEmissions').invoke('text').then((rowChart) => {
                cy.wrap((parseFloat(rowChart.replace(/,/g, '')) - parseFloat(newEmission.replace(/,/g, '')))).invoke('toFixed', 10).then((emissionsSaved) => {
                    cy.calcRecyclingSavings(emissionsSaved).invoke('toFixed', 0).should('satisfy', (temp) => {
                        return text.text() == temp+1 || text.text() == temp || text.text() == temp-1
                    })
                })
            })
        })
            
        })
      cy.get('.rowChart > .uS_avg').should('have.text', '26,793')
    })
    it('Fill out the rest of the forms', () => {
      cy.get('#energy > .new-button-style').click()
      cy.get('#fridgeSelect').select('Will Do')
      cy.get('#windowSelect').select('Will Not Do')
      cy.get('#furnaceSelect').select('Will Do')
      cy.get('#AirDrySelect').select('Will Do')
    })
    it('Verify the report and notices that is complete', () => {
      cy.get('#view-full-report').click()
      cy.get('#homeEnergyProgressBar').should('have.value', 100)
      cy.get('#progress-incomplete').should('not.be.visible')
      cy.get('#progress-complete > h2').should('be.visible')
  
    })
  })