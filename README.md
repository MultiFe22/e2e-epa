# e2e-epa

To run the tests is simple, first you should have node 16+ and npm installed.

Then at the root of the project:
```bash
npm install
```

To run all the tests headed and capturing your screen:

```bash
npx cypress run --headed
```

To run all the tests headless:

```bash
npx cypress run
```

## Assumptions
In the fixture folder you can find all data used, and in there lies all the assumptions for the tests. This data was obtained directly from the US government, to maintain the test as close as possible to reality. I've also inspected the JS of the client side and gathered almost all the scripts that calculate the results, I've applied those scripts to know what value expect on each result.

## Test Scenarios
A multi-test happy ending, it can test all the possible zip codes on the US and it's outputs, covering all happy ending cases.

A form validation at the start of the calculator. To ensure that know one will breack the calculator with invalid data.

## Bugs found
- Zip code form doesn't filter characters (you can input whatever you like).
- Negative numbers can be input on all forms on the calculator.
- Some forms can be set to 0, then a division by zero occurs crashing the functionality.
- Windows saving emission is bugged, setting negative numbers to the expected CO2 savings.
