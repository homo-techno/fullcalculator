import type { CalculatorDefinition } from "./types";
import { percentageCalculator } from "./percentage";
import { bmiCalculator } from "./bmi";
import { ageCalculator } from "./age";
import { tipCalculator } from "./tip";
import { compoundInterestCalculator } from "./compound-interest";
import { mortgageCalculator } from "./mortgage";
import { loanCalculator } from "./loan";
import { calorieCalculator } from "./calorie";
import { gpaCalculator } from "./gpa";
import { salaryCalculator } from "./salary";
import { discountCalculator } from "./discount";
import { unitConverter } from "./unit-converter";
import { squareFootageCalculator } from "./square-footage";
import { fractionCalculator } from "./fraction";
import { standardDeviationCalculator } from "./standard-deviation";
import { dateCalculator } from "./date";
import { paceCalculator } from "./pace";
import { fuelCostCalculator } from "./fuel-cost";
import { electricityCalculator } from "./electricity";
import { rentSplitCalculator } from "./rent-split";
import { roiCalculator } from "./roi";
import { inflationCalculator } from "./inflation";
import { speedCalculator } from "./speed";
import { volumeCalculator } from "./volume";
import { idealWeightCalculator } from "./ideal-weight";
import { bodyFatCalculator } from "./body-fat";
import { pregnancyCalculator } from "./pregnancy";
import { sleepCalculator } from "./sleep";
import { randomNumberGenerator } from "./random-number";
import { probabilityCalculator } from "./probability";
import { timeZoneConverter } from "./time-zone";
import { paycheckCalculator } from "./paycheck";
import { taxCalculator } from "./tax";
import { retirementCalculator } from "./retirement";
import { carLoanCalculator } from "./car-loan";
import { downPaymentCalculator } from "./down-payment";
import { debtPayoffCalculator } from "./debt-payoff";
import { savingsGoalCalculator } from "./savings-goal";
import { marginCalculator } from "./margin";
import { gradeCalculator } from "./grade";
import { scientificCalculator } from "./scientific";
import { quadraticCalculator } from "./quadratic";
import { ratioCalculator } from "./ratio";
import { binaryHexConverter } from "./binary-hex";
import { cookingConverter } from "./cooking";
import { concreteCalculator } from "./concrete";
import { paintCalculator } from "./paint";
import { heartRateCalculator } from "./heart-rate";
import { waterIntakeCalculator } from "./water-intake";
import { proteinCalculator } from "./protein";
import { subnetCalculator } from "./subnet";
import { pythagoreanCalculator } from "./pythagorean";
import { averageCalculator } from "./average";
import { lcmGcdCalculator } from "./lcm-gcd";
import { factorialCalculator } from "./factorial";
import { exponentCalculator } from "./exponent";
import { squareRootCalculator } from "./square-root";
import { slopeCalculator } from "./slope";
import { decimalFractionCalculator } from "./decimal-fraction";
import { roundingCalculator } from "./rounding";
import { logarithmCalculator } from "./logarithm";
import { percentageChangeCalculator } from "./percentage-change";
import { permutationCalculator } from "./permutation";
import { midpointCalculator } from "./midpoint";
import { longDivisionCalculator } from "./long-division";
import { numberSequenceCalculator } from "./number-sequence";
import { areaOfCircleCalculator } from "./area-of-circle";
import { percentageOfNumberCalculator } from "./percentage-of-number";
import { netWorthCalculator } from "./net-worth";
import { investmentCalculator } from "./investment";
import { simpleInterestCalculator } from "./simple-interest";
import { breakEvenCalculator } from "./break-even";
import { annuityCalculator } from "./annuity";
import { stockReturnCalculator } from "./stock-return";
import { creditCardCalculator } from "./credit-card";
import { costOfLivingCalculator } from "./cost-living";
import { macroCalculator } from "./macro";
import { bacCalculator } from "./bac";
import { ovulationCalculator } from "./ovulation";
import { oneRepMaxCalculator } from "./one-rep-max";
import { waistHipCalculator } from "./waist-hip";
import { stepsMilesCalculator } from "./steps-miles";
import { bloodPressureCalculator } from "./blood-pressure";
import { vo2maxCalculator } from "./vo2max";
import { tileCalculator } from "./tile";
import { gravelCalculator } from "./gravel";
import { timeCardCalculator } from "./time-card";
import { tipTaxCalculator } from "./tip-tax";
import { gasMileageCalculator } from "./gas-mileage";
import { timeDurationCalculator } from "./time-duration";
import { poolVolumeCalculator } from "./pool-volume";
import { ohmsLawCalculator } from "./ohms-law";
import { forceCalculator } from "./force";
import { densityCalculator } from "./density";
import { energyCalculator } from "./energy";
import { momentumCalculator } from "./momentum";
import { accelerationCalculator } from "./acceleration";
import { wavelengthCalculator } from "./wavelength";
import { phCalculator } from "./ph";
import { colorConverter } from "./color-converter";
import { dataStorageConverter } from "./data-storage";
import { shoeSizeConverter } from "./shoe-size";
import { speedConverter } from "./speed-converter";
import { angleConverter } from "./angle-converter";
import { areaConverter } from "./area-converter";
import { pressureConverter } from "./pressure";
import { matrixCalculator } from "./matrix";
import { circumferenceCalculator } from "./circle-circumference";
import { triangleAreaCalculator } from "./triangle-area";
import { mixedNumberCalculator } from "./mixed-number";
import { surfaceAreaCalculator } from "./surface-area";
import { cylinderVolumeCalculator } from "./cylinder-volume";
import { coneVolumeCalculator } from "./cone-volume";
import { hexDecimalConverter } from "./hex-decimal";
import { romanNumeralCalculator } from "./roman-numeral";
import { dogYearsCalculator } from "./dog-years";
import { cagrCalculator } from "./cagr";
import { leaseCalculator } from "./lease";
import { propertyTaxCalculator } from "./property-tax";
import { salesTaxCalculator } from "./sales-tax";
import { markupCalculator } from "./markup";
import { payRaiseCalculator } from "./pay-raise";
import { workHoursCalculator } from "./work-hours";
import { bmrCalculator } from "./bmr";
import { windChillCalculator } from "./wind-chill";
import { heatIndexCalculator } from "./heat-index";
import { dewPointCalculator } from "./dew-point";
import { leanBodyMassCalculator } from "./lean-body-mass";
import { readingTimeCalculator } from "./reading-time";
import { aspectRatioCalculator } from "./aspect-ratio";
import { pixelDensityCalculator } from "./pixel-density";
import { downloadTimeCalculator } from "./download-time";
import { carbonFootprintCalculator } from "./carbon-footprint";
import { percentageErrorCalculator } from "./percentage-error";
import { significantFiguresCalculator } from "./significant-figures";
import { tdeeCalculator } from "./tdee";
import { halfLifeCalculator } from "./half-life";
import { molarityCalculator } from "./molarity";
import { frequencyCalculator } from "./frequency";
import { resistanceCalculator } from "./resistance";
import { btuCalculator } from "./btu";
import { horsepowerCalculator } from "./horsepower";
import { torqueCalculator } from "./torque";
import { wordCounterCalculator } from "./word-counter";
import { passwordStrengthCalculator } from "./password-generator";
import { timestampConverter } from "./timestamp";
import { amortizationCalculator } from "./amortization";
import { conversionRateCalculator } from "./conversion-rate";
import { costPerUnitCalculator } from "./cost-per-unit";
import { electricityUsageCalculator } from "./electricity-usage";
import { sphereCalculator } from "./sphere-calculator";
import { weightConverter } from "./weight-converter";
import { temperatureConverter } from "./temperature-converter";
import { lengthConverter } from "./length-converter";
import { timeConverter } from "./time-converter";
import { volumeConverter } from "./volume-converter";
import { absoluteValueCalculator } from "./absolute-value";
import { primeNumberCalculator } from "./prime-number";
import { fibonacciCalculator } from "./fibonacci";
import { complexNumberCalculator } from "./complex-number";
import { vectorCalculator } from "./vector";
import { proportionsCalculator } from "./proportions";
import { trapezoidAreaCalculator } from "./trapezoid-area";
import { parallelogramAreaCalculator } from "./parallelogram-area";
import { numberBaseConverter } from "./number-base";
import { linearEquationCalculator } from "./linear-equation";
import { dividendCalculator } from "./dividend";
import { debtToIncomeCalculator } from "./debt-to-income";
import { emergencyFundCalculator } from "./emergency-fund";
import { ruleOf72Calculator } from "./rule-of-72";
import { rentalYieldCalculator } from "./rental-yield";
import { hourlyToSalaryCalculator } from "./hourly-to-salary";
import { bloodSugarCalculator } from "./blood-sugar";
import { dueDateCalculator } from "./due-date";
import { targetHeartRateCalculator } from "./target-heart-rate";
import { idealGasCalculator } from "./ideal-gas";
import { projectileCalculator } from "./projectile";
import { springConstantCalculator } from "./spring-constant";
import { specificHeatCalculator } from "./specific-heat";
import { lensEquationCalculator } from "./lens-equation";
import { electricalPowerCalculator } from "./electrical-power";
import { frictionCalculator } from "./friction";
import { fenceCalculator } from "./fence";
import { wallpaperCalculator } from "./wallpaper";
import { soilMulchCalculator } from "./soil-mulch";
import { carpetCalculator } from "./carpet";
import { deckCalculator } from "./deck";
import { staircaseCalculator } from "./staircase";
import { roadTripCalculator } from "./road-trip";
import { eventCountdownCalculator } from "./event-countdown";
import { fuelEfficiencyConverter } from "./fuel-efficiency";
import { lawnCalculator } from "./lawn";
import { energyConverter } from "./energy-converter";
import { forceConverter } from "./force-converter";
import { bondYieldCalculator } from "./bond-yield";
import { interestRateCalculator } from "./interest-rate";
import { coulombsLawCalculator } from "./coulombs-law";
import { cookingTempCalculator } from "./cooking-temp";
import { clothingSizeConverter } from "./clothing-size";
import { movingCostCalculator } from "./moving-cost";
import { ageInDaysCalculator } from "./age-in-days";
import { flowRateCalculator } from "./flow-rate";
import { wireGaugeCalculator } from "./wire-gauge";
import { noiseLevelCalculator } from "./noise-level";
import { armyBodyFatCalculator } from "./army-body-fat";
import { signalToNoiseCalculator } from "./signal-to-noise";
import { fourOhOneKCalculator } from "./401k";
import { anionGapCalculator } from "./anion-gap";
import { apgarScoreCalculator } from "./apgar-score";
import { aquariumCalculator } from "./aquarium";
import { astronomicalUnitConverter } from "./astronomical-unit";
import { audioBitrateCalculator } from "./audio-bitrate";
import { autoLeaseCalculator } from "./auto-lease";
import { babyGrowthCalculator } from "./baby-growth";
import { backsplashCalculator } from "./backsplash";
import { bandwidthCalculator } from "./bandwidth";
import { basketballStatsCalculator } from "./basketball-stats";
import { batteryLifeCalculator } from "./battery-life";
import { battingAverageCalculator } from "./batting-average";
import { beerLambertCalculator } from "./beer-lambert";
import { binaryArithmeticCalculator } from "./binary-arithmetic";
import { binomialCoefficientCalculator } from "./binomial-coefficient";
import { bmiPercentileCalculator } from "./bmi-percentile";
import { bodySurfaceAreaCalculator } from "./body-surface-area";
import { bodyWaterCalculator } from "./body-water";
import { bowlingScoreCalculator } from "./bowling-score";
import { boylesLawCalculator } from "./boyles-law";
import { brickCalculator } from "./brick";
import { budgetCalculator } from "./budget";
import { buoyancyCalculator } from "./buoyancy";
import { burnsCalculator } from "./burns";
import { businessDaysCalculator } from "./business-days";
import { businessLoanCalculator } from "./business-loan";
import { caffeineCalculator } from "./caffeine";
import { candleBurnCalculator } from "./candle-burn";
import { capacitanceCalculator } from "./capacitance";
import { capitalGainsCalculator } from "./capital-gains";
import { carDepreciationCalculator } from "./car-depreciation";
import { centripetalForceCalculator } from "./centripetal-force";
import { charlesLawCalculator } from "./charles-law";
import { chineseZodiacCalculator } from "./chinese-zodiac";
import { chiSquareCalculator } from "./chi-square";
import { circuitCalculator } from "./circuit";
import { coffeeRatioCalculator } from "./coffee-ratio";
import { coinFlipCalculator } from "./coin-flip";
import { collegeSavingsCalculator } from "./college-savings";
import { colorTemperatureCalculator } from "./color-temperature";
import { compostCalculator } from "./compost";
import { confidenceIntervalCalculator } from "./confidence-interval";
import { cookingWeightConverter } from "./cooking-weight";
import { correctedCalciumCalculator } from "./corrected-calcium";
import { correlationCalculator } from "./correlation";
import { costBasisCalculator } from "./cost-basis";
import { countertopCalculator } from "./countertop";
import { covarianceCalculator } from "./covariance";
import { creatinineClearanceCalculator } from "./creatinine-clearance";
import { crossProductCalculator } from "./cross-product";
import { cryptoProfitCalculator } from "./crypto-profit";
import { currencyTipCalculator } from "./currency-tip";
import { curtainCalculator } from "./curtain";
import { cyclingPowerCalculator } from "./cycling-power";
import { daysBetweenDatesCalculator } from "./days-between-dates";
import { debtSnowballCalculator } from "./debt-snowball";
import { decayCalculator } from "./decay";
import { densityUnitConverter } from "./density-unit";
import { depreciationCalculator } from "./depreciation";
import { determinantCalculator } from "./determinant";
import { diceRollerCalculator } from "./dice-roller";
import { dilutionCalculator } from "./dilution";
import { dopplerEffectCalculator } from "./doppler-effect";
import { dotProductCalculator } from "./dot-product";
import { dpiCalculator } from "./dpi";
import { drywallCalculator } from "./drywall";
import { engineDisplacementCalculator } from "./engine-displacement";
import { eraCalculator } from "./era";
import { escapeVelocityCalculator } from "./escape-velocity";
import { estateTaxCalculator } from "./estate-tax";
import { exchangeRateCalculator } from "./exchange-rate";
import { exerciseCalorieCalculator } from "./exercise-calorie";
import { fabricConverter } from "./fabric";
import { flightDistanceCalculator } from "./flight-distance";
import { flooringCalculator } from "./flooring";
import { fontSizeConverter } from "./font-size";
import { frameRateCalculator } from "./frame-rate";
import { frequencyUnitConverter } from "./frequency-unit";
import { futureValueCalculator } from "./future-value";
import { gearRatioCalculator } from "./gear-ratio";
import { geometricMeanCalculator } from "./geometric-mean";
import { giftWrapCalculator } from "./gift-wrap";
import { glasgowComaCalculator } from "./glasgow-coma";
import { golfHandicapCalculator } from "./golf-handicap";
import { gravitationalForceCalculator } from "./gravitational-force";
import { gutterCalculator } from "./gutter";
import { harmonicMeanCalculator } from "./harmonic-mean";
import { heartRateReserveCalculator } from "./heart-rate-reserve";
import { homeEquityCalculator } from "./home-equity";
import { hvacCalculator } from "./hvac";
import { hydrationCalculator } from "./hydration";
import { imageResolutionCalculator } from "./image-resolution";
import { inductanceCalculator } from "./inductance";
import { inequalitySolverCalculator } from "./inequality-solver";
import { insulationCalculator } from "./insulation";
import { insulinDoseCalculator } from "./insulin-dose";
import { interpolationCalculator } from "./interpolation";
import { irrCalculator } from "./irr";
import { irrigationCalculator } from "./irrigation";
import { ivDripRateCalculator } from "./iv-drip-rate";
import { jetLagCalculator } from "./jet-lag";
import { lightingCalculator } from "./lighting";
import { lotteryOddsCalculator } from "./lottery-odds";
import { lumberCalculator } from "./lumber";
import { luminosityConverter } from "./luminosity";
import { mapScaleCalculator } from "./map-scale";
import { marathonPredictorCalculator } from "./marathon-predictor";
import { meanMedianModeCalculator } from "./mean-median-mode";
import { medicationDosageCalculator } from "./medication-dosage";
import { modularArithmeticCalculator } from "./modular-arithmetic";
import { monitorComparisonCalculator } from "./monitor-comparison";
import { mortarCalculator } from "./mortar";
import { mortgageRefinanceCalculator } from "./mortgage-refinance";
import { movingBoxCalculator } from "./moving-box";
import { musicTempoCalculator } from "./music-tempo";
import { nauticalConverter } from "./nautical";
import { normalDistributionCalculator } from "./normal-distribution";
import { npvCalculator } from "./npv";
import { orbitalVelocityCalculator } from "./orbital-velocity";
import { paperSizeConverter } from "./paper-size";
import { partyFoodCalculator } from "./party-food";
import { patioCalculator } from "./patio-paver";
import { payrollTaxCalculator } from "./payroll-tax";
import { pediatricDoseCalculator } from "./pediatric-dose";
import { pendulumCalculator } from "./pendulum";
import { pergolaCalculator } from "./pergola";
import { petFoodCalculator } from "./pet-food";
import { photographyExposureCalculator } from "./photography-exposure";
import { pizzaDoughCalculator } from "./pizza-dough";
import { plywoodCalculator } from "./plywood";
import { pokerOddsCalculator } from "./poker-odds";
import { polarCoordinatesCalculator } from "./polar-coordinates";
import { polynomialCalculator2 } from "./polynomial";
import { postageCalculator } from "./postage";
import { powerFactorCalculator } from "./power-factor";
import { powerUnitConverter } from "./power-unit";
import { pregnancyWeightCalculator } from "./pregnancy-weight";
import { presentValueCalculator } from "./present-value";
import { printSizeCalculator } from "./print-size";
import { projectorSizeCalculator } from "./projector-size";
import { quarterbackRatingCalculator } from "./quarterback-rating";
import { radiationDoseConverter } from "./radiation-dose";
import { raisedGardenBedCalculator } from "./raised-garden-bed";
import { readingLevelCalculator } from "./reading-level";
import { realReturnCalculator } from "./real-return";
import { rebarCalculator } from "./rebar";
import { recipeScalerCalculator } from "./recipe-scaler";
import { recoveryTimeCalculator } from "./recovery-time";
import { refractiveIndexCalculator } from "./refractive-index";
import { regressionCalculator } from "./regression";
import { rentVsBuyCalculator } from "./rent-vs-buy";
import { retainingWallCalculator } from "./retaining-wall";
import { reynoldsNumberCalculator } from "./reynolds-number";
import { roofingCalculator } from "./roofing";
import { roomAcousticsCalculator } from "./room-acoustics";
import { rothIraCalculator } from "./roth-ira";
import { runningSplitsCalculator } from "./running-splits";
import { sampleSizeCalculator } from "./sample-size";
import { sandboxCalculator } from "./sandbox";
import { screenSizeCalculator } from "./screen-size";
import { seriesConvergenceCalculator } from "./series-convergence";
import { shedCalculator } from "./shed";
import { sleepDebtCalculator } from "./sleep-debt";
import { soccerStatsCalculator } from "./soccer-stats";
import { sodiumCorrectionCalculator } from "./sodium-correction";
import { solarPanelCalculator } from "./solar-panel";
import { soundSpeedCalculator } from "./sound-speed";
import { speakerWireCalculator } from "./speaker-wire";
import { stefanBoltzmannCalculator } from "./stefan-boltzmann";
import { studentLoanCalculator } from "./student-loan";
import { studyTimeCalculator } from "./study-time";
import { summationCalculator } from "./summation";
import { swimmingPaceCalculator } from "./swimming-pace";
import { taxBracketCalculator } from "./tax-bracket";
import { terrariumCalculator } from "./terrarium";
import { thermalExpansionCalculator } from "./thermal-expansion";
import { timberVolumeCalculator } from "./timber-volume";
import { tipPoolCalculator } from "./tip-pool";
import { tireSizeCalculator } from "./tire-size";
import { torqueUnitConverter } from "./torque-unit";
import { towingCapacityCalculator } from "./towing-capacity";
import { trainingZoneCalculator } from "./training-zone";
import { transformerCalculator } from "./transformer";
import { travelBudgetCalculator } from "./travel-budget";
import { tuningFrequencyCalculator } from "./tuning-frequency";
import { tvDistanceCalculator } from "./tv-distance";
import { typingSpeedCalculator } from "./typing-speed";
import { varianceCalculator } from "./variance";
import { videoBitrateCalculator } from "./video-bitrate";
import { viscosityConverter } from "./viscosity";
import { waterHeaterCalculator } from "./water-heater";
import { weddingBudgetCalculator } from "./wedding-budget";
import { weightedAverageCalculator } from "./weighted-average";
import { windEnergyCalculator } from "./wind-energy";
import { windowBlindCalculator } from "./window-blind";
import { wireLengthCalculator } from "./wire-length";
import { workEnergyCalculator } from "./work-energy";
import { zodiacSignCalculator } from "./zodiac-sign";
import { zScoreCalculator } from "./z-score";
import { psiToBarConverter } from "./psi-to-bar";
import { barToPsiConverter } from "./bar-to-psi";
import { mphToKphConverter } from "./mph-to-kph";
import { kphToMphConverter } from "./kph-to-mph";
import { tbspToCupsConverter } from "./tablespoons-to-cups";
import { tspToTbspConverter } from "./teaspoons-to-tablespoons";
import { flOzToMlConverter } from "./fluid-ounces-to-ml";
import { pintsToLitersConverter } from "./pints-to-liters";
import { quartsToLitersConverter } from "./quarts-to-liters";
import { feetToInchesConverter } from "./feet-to-inches";
import { cubicFeetCalculator } from "./cubic-feet";
import { cubicYardsCalculator } from "./cubic-yards";
import { scientificNotationCalculator } from "./scientific-notation";
import { simplifyFractionsCalculator } from "./simplify-fractions";
import { voltageDropCalculator } from "./voltage-drop";
import { voltageDividerCalculator } from "./voltage-divider";
import { ledResistorCalculator } from "./led-resistor";
import { pipeFlowCalculator } from "./pipe-flow";
import { airFlowCalculator } from "./air-flow";
import { waterPressureCalculator } from "./water-pressure";
import { pulleyCalculator } from "./pulley";
import { leverCalculator } from "./lever";
import { inclinedPlaneCalculator } from "./inclined-plane";
import { beltLengthCalculator } from "./belt-length";
import { gearSpeedCalculator } from "./gear-speed";
import { ketoCalculator } from "./keto";
import { calorieDeficitCalculator } from "./calorie-deficit";
import { ffmiCalculator } from "./ffmi";
import { waistToHeightCalculator } from "./waist-to-height";
import { navyBodyFatCalculator } from "./navy-body-fat";
import { conceptionCalculator } from "./conception";
import { ivfDueDateCalculator } from "./ivf-due-date";
import { walkingCalorieCalculator } from "./walking-calorie";
import { runningCalorieCalculator } from "./running-calorie";
import { cyclingCalorieCalculator } from "./cycling-calorie";
import { benchPressCalculator } from "./bench-press";
import { squatMaxCalculator } from "./squat-max";
import { deadliftMaxCalculator } from "./deadlift-max";
import { wilksScoreCalculator } from "./wilks-score";
import { alcoholCalorieCalculator } from "./alcohol-calorie";
import { intermittentFastingCalculator } from "./intermittent-fasting";
import { pregnancyWeekCalculator } from "./pregnancy-week";
import { babyFormulaCalculator } from "./baby-formula";
import { breastfeedingCalorieCalculator } from "./breastfeeding-calorie";
import { vitaminDCalculator } from "./vitamin-d";
import { ironIntakeCalculator } from "./iron-intake";
import { fiberIntakeCalculator } from "./fiber-intake";
import { sugarIntakeCalculator } from "./sugar-intake";
import { sodiumIntakeCalculator } from "./sodium-intake";
import { dogWeightCalculator } from "./dog-weight";
import { topsoilCalculator } from "./topsoil";
import { sodCalculator } from "./sod";
import { grassSeedCalculator } from "./grass-seed";
import { poolChemicalCalculator } from "./pool-chemical";
import { hotTubCalculator } from "./hot-tub";
import { asphaltCalculator } from "./asphalt";
import { concreteBlockCalculator } from "./concrete-block";
import { baseboardCalculator } from "./baseboard";
import { crownMoldingCalculator } from "./crown-molding";
import { epoxyCalculator } from "./epoxy";
import { resinCalculator } from "./resin";
import { groutCalculator } from "./grout";
import { fertilizerCalculator } from "./fertilizer";
import { studSpacingCalculator } from "./stud-spacing";
import { joistSpanCalculator } from "./joist-span";
import { beamSizeCalculator } from "./beam-size";
import { postSpacingCalculator } from "./post-spacing";
import { deckStainCalculator } from "./deck-stain";
import { evChargingCalculator } from "./ev-charging";
import { solarSavingsCalculator } from "./solar-savings";
import { waterBillCalculator } from "./water-bill";
import { gasBillCalculator } from "./gas-bill";
import { paintQuantityCalculator } from "./paint-quantity";
import { wallpaperRollsCalculator } from "./wallpaper-rolls";
import { homeMaintenanceCalculator } from "./home-maintenance";
import { inchesToCmConverter } from "./inches-to-cm";
import { cmToInchesConverter } from "./cm-to-inches";
import { feetToMetersConverter } from "./feet-to-meters";
import { metersToFeetConverter } from "./meters-to-feet";
import { milesToKmConverter } from "./miles-to-km";
import { kmToMilesConverter } from "./km-to-miles";
import { poundsToKgConverter } from "./pounds-to-kg";
import { kgToPoundsConverter } from "./kg-to-pounds";
import { ouncesToGramsConverter } from "./ounces-to-grams";
import { gramsToOuncesConverter } from "./grams-to-ounces";
import { celsiusToFahrenheitConverter } from "./celsius-to-fahrenheit";
import { fahrenheitToCelsiusConverter } from "./fahrenheit-to-celsius";
import { cupsToMlConverter } from "./cups-to-ml";
import { litersToGallonsConverter } from "./liters-to-gallons";
import { gallonsToLitersConverter } from "./gallons-to-liters";
import { mmToInchesConverter } from "./mm-to-inches";
import { inchesToMmConverter } from "./inches-to-mm";
import { sqMetersToSqFeetConverter } from "./sq-meters-to-sq-feet";
import { acresToSqFeetConverter } from "./acres-to-sq-feet";
import { hectaresToAcresConverter } from "./hectares-to-acres";
import { stonesToPoundsConverter } from "./stones-to-pounds";
import { stonesToKgConverter } from "./stones-to-kg";
import { yardsToMetersConverter } from "./yards-to-meters";
import { wattsToAmpsConverter } from "./watts-to-amps";
import { ampsToWattsConverter } from "./amps-to-watts";
import { homeAffordabilityCalculator } from "./home-affordability";
import { fhaLoanCalculator } from "./fha-loan";
import { vaLoanCalculator } from "./va-loan";
import { pmiCalculator2 } from "./pmi";
import { closingCostCalculator } from "./closing-cost";
import { biweeklyMortgageCalculator } from "./biweekly-mortgage";
import { extraMortgagePaymentCalculator } from "./extra-mortgage-payment";
import { takeHomePayCalculator } from "./take-home-pay";
import { overtimePayCalculator } from "./overtime";
import { commissionCalculator2 } from "./commission";
import { selfEmploymentTaxCalculator } from "./self-employment-tax";
import { bonusTaxCalculator } from "./bonus-tax";
import { cdInterestCalculator } from "./cd-interest";
import { savingsAccountCalculator } from "./savings-account";
import { pensionCalculator } from "./pension";
import { socialSecurityCalculator } from "./social-security";
import { rmdCalculator } from "./rmd";
import { hsaCalculator } from "./hsa";
import { rentAffordabilityCalculator } from "./rent-affordability";
import { netIncomeCalculator } from "./net-income";
import { grossToNetCalculator } from "./gross-to-net";
import { inheritanceTaxCalculator } from "./inheritance-tax";
import { freelanceRateCalculator } from "./freelance-rate";
import { invoiceCalculator } from "./invoice";
import { cashFlowCalculator } from "./cash-flow";
import { braSizeCalculator } from "./bra-size";
import { ringSizeCalculator } from "./ring-size";
import { hatSizeCalculator } from "./hat-size";
import { bikeSizeCalculator } from "./bike-size";
import { skiSizeCalculator } from "./ski-size";
import { snowboardSizeCalculator } from "./snowboard-size";
import { helmetSizeCalculator } from "./helmet-size";
import { backpackSizeCalculator } from "./backpack-size";
import { dayOfWeekCalculator } from "./day-of-week";
import { leapYearCalculator } from "./leap-year";
import { moonPhaseCalculator } from "./moon-phase";
import { sunriseSunsetCalculator } from "./sunrise-sunset";
import { beaufortScaleCalculator } from "./beaufort-scale";
import { uvIndexCalculator } from "./uv-index";
import { humidityCalculator2 } from "./humidity";
import { soilPhCalculator } from "./soil-ph";
import { waterHardnessCalculator } from "./water-hardness";
import { poolSaltCalculator } from "./pool-salt";
import { ageDifferenceCalculator } from "./age-difference";
import { loveCalculator } from "./love-calculator";
import { numerologyCalculator } from "./numerology";
import { lifePathCalculator } from "./life-path";
import { angelNumberCalculator } from "./angel-number";
import { bmiPrimeCalculator } from "./bmi-prime";
import { bodyShapeCalculator } from "./body-shape";

import { accelerationTimeCalculator } from "./acceleration-time";
import { accountsReceivableCalculator } from "./accounts-receivable";
import { actScoreCalculator } from "./act-score";
import { airQualityIndexCalculator } from "./air-quality-index";
import { alcoholDilutionCalculator } from "./alcohol-dilution";
import { alimonyCalculator } from "./alimony-calculator";
import { animationFramesCalculator } from "./animation-frames";
import { antennaLengthCalculator } from "./antenna-length";
import { armCalculator } from "./arm-calculator";
import { armyPtScoreCalculator } from "./army-pt-score";
import { attendanceRateCalculator } from "./attendance-rate";
import { audioFileSizeCalculator } from "./audio-file-size";
import { autoInsuranceEstimateCalculator } from "./auto-insurance-estimate";
import { bakingConversionCalculator } from "./baking-conversion";
import { bannerSizeCalculator } from "./banner-size";
import { batteryCapacityCalculator } from "./battery-capacity";
import { beerAbvCalculator } from "./beer-abv";
import { beltSizeCalculator } from "./belt-size";
import { bindingCalculator } from "./binding-calculator";
import { birdCageSizeCalculator } from "./bird-cage-size";
import { boardGameScoreCalculator } from "./board-game-score";
import { boatFuelCalculator } from "./boat-fuel";
import { bodyMeasurementCalculator } from "./body-measurement";
import { boxingCalorieCalculator } from "./boxing-calorie";
import { bpmCalculator } from "./bpm-calculator";
import { braceletSizeCalculator } from "./bracelet-size";
import { brakingDistanceCalculator } from "./braking-distance";
import { breadRecipeCalculator } from "./bread-recipe";
import { breakEvenPointCalculator } from "./break-even-point";
import { btuHeatingCalculator } from "./btu-heating";
import { businessLicenseCalculator } from "./business-license";
import { businessValuationCalculator } from "./business-valuation";
import { butterOilConversionCalculator } from "./butter-oil-conversion";
import { cableLengthAudioCalculator } from "./cable-length-audio";
import { cableVoltageDropCalculator } from "./cable-voltage-drop";
import { cacCalculator } from "./cac-calculator";
import { caffeineIntakeCalculator } from "./caffeine-intake";
import { cakePanSizeCalculator } from "./cake-pan-size";
import { campfireHeatCalculator } from "./campfire-heat";
import { candyTemperatureCalculator } from "./candy-temperature";
import { canningTimeCalculator } from "./canning-time";
import { canvasSizeCalculator } from "./canvas-size";
import { capRateCalculator } from "./cap-rate";
import { carAffordabilityCalculator } from "./car-affordability";
import { carInsuranceCalculator } from "./car-insurance";
import { carLeaseVsBuyCalculator } from "./car-lease-vs-buy";
import { carPaymentCalculator } from "./car-payment";
import { carTradeInCalculator } from "./car-trade-in";
import { cardProbabilityCalculator } from "./card-probability";
import { cargoVolumeCalculator } from "./cargo-volume";
import { cashOnCashCalculator } from "./cash-on-cash";
import { catAgeCalculator } from "./cat-age";
import { catCalorieCalculator } from "./cat-calorie";
import { catFoodAmountCalculator } from "./cat-food-amount";
import { catPregnancyCalculator } from "./cat-pregnancy";
import { celsiusToKelvinConverter } from "./celsius-to-kelvin";
import { chickenCoopSizeCalculator } from "./chicken-coop-size";
import { childSupportCalculator } from "./child-support";
import { chordCalculator } from "./chord-calculator";
import { churnRateCalculator } from "./churn-rate";
import { citationCountCalculator } from "./citation-count";
import { classAverageCalculator } from "./class-average";
import { classRankCalculator } from "./class-rank";
import { cmToMetersConverter } from "./cm-to-meters";
import { coilInductanceCalculator } from "./coil-inductance";
import { colorContrastCalculator } from "./color-contrast";
import { commercialLeaseCalculator } from "./commercial-lease";
import { courtFeeCalculator } from "./court-fee";
import { crochetYarnCalculator } from "./crochet-yarn";
import { cropFactorCalculator } from "./crop-factor";
import { crossfitScoreCalculator } from "./crossfit-score";
import { cubicMetersToLitersConverter } from "./cubic-meters-to-liters";
import { cumulativeGpaCalculator } from "./cumulative-gpa";
import { cupsToOzConverter } from "./cups-to-oz";
import { currentDividerCalculator } from "./current-divider";
import { currentRatioCalculator } from "./current-ratio";
import { curtainFabricCalculator } from "./curtain-fabric";
import { curveGradeCalculator } from "./curve-grade";
import { customerLifetimeValueCalculator } from "./customer-lifetime-value";
import { cyclingFtpCalculator } from "./cycling-ftp";
import { dAndDDiceCalculator } from "./d-and-d-dice";
import { decibelCalculator } from "./decibel-calculator";
import { deepFryOilCalculator } from "./deep-fry-oil";
import { depthOfFieldCalculator } from "./depth-of-field";
import { disabilityBenefitCalculator } from "./disability-benefit";
import { discountPercentageCalculator } from "./discount-percentage";
import { dogBmiCalculator } from "./dog-bmi";
import { dogCalorieCalculator } from "./dog-calorie";
import { dogFoodAmountCalculator } from "./dog-food-amount";
import { dogPregnancyCalculator } from "./dog-pregnancy";
import { drainageCalculator } from "./drainage-calculator";
import { dressSizeCalculator } from "./dress-size";
import { dscrCalculator } from "./dscr";
import { eggProductionCalculator } from "./egg-production";
import { eggSubstituteCalculator } from "./egg-substitute";
import { electricRangeCalculator } from "./electric-range";
import { electricalLoadCalculator } from "./electrical-load";
import { electricityCostApplianceCalculator } from "./electricity-cost-appliance";
import { elevationGainCalculator } from "./elevation-gain";
import { emissionCalculator } from "./emission-calculator";
import { employeeCostCalculator } from "./employee-cost";
import { essayLengthCalculator } from "./essay-length";
import { eventTicketCalculator } from "./event-ticket";
import { fabricYardageCalculator } from "./fabric-yardage";
import { fantasyPointsCalculator } from "./fantasy-points";
import { feetToMilesConverter } from "./feet-to-miles";
import { finalGradeCalculator } from "./final-grade";
import { financialAidCalculator } from "./financial-aid";
import { firewoodCalculator } from "./firewood-calculator";
import { fishTankSizeCalculator } from "./fish-tank-size";
import { fishingLineCalculator } from "./fishing-line";
import { flashGuideNumberCalculator } from "./flash-guide-number";
import { flashcardStudyCalculator } from "./flashcard-study";
import { flexibilityTestCalculator } from "./flexibility-test";
import { flipProfitCalculator } from "./flip-profit";
import { floodInsuranceCalculator } from "./flood-insurance";
import { focalLengthEquivalentCalculator } from "./focal-length-equivalent";
import { fontScaleCalculator } from "./font-scale";
import { foodCostCalculator } from "./food-cost";
import { frameSizeCalculator } from "./frame-size";
import { freezerStorageCalculator } from "./freezer-storage";
import { frequencyToNoteCalculator } from "./frequency-to-note";
import { frostDepthCalculator } from "./frost-depth";
import { fuseSizingCalculator } from "./fuse-sizing";
import { gamingMonitorCalculator } from "./gaming-monitor";
import { gardenYieldCalculator } from "./garden-yield";
import { gasCostTripCalculator } from "./gas-cost-trip";
import { gearRatioVehicleCalculator } from "./gear-ratio-vehicle";
import { generatorSizingCalculator } from "./generator-sizing";
import { glassesSizeCalculator } from "./glasses-size";
import { gloveSizeCalculator } from "./glove-size";
import { goldenRatioCalculator } from "./golden-ratio";
import { gpaToPercentageCalculator } from "./gpa-to-percentage";
import { gridCalculator } from "./grid-calculator";
import { grillTemperatureCalculator } from "./grill-temperature";
import { gripStrengthCalculator } from "./grip-strength";
import { grmCalculator } from "./grm";
import { groundingResistanceCalculator } from "./grounding-resistance";
import { growingSeasonCalculator } from "./growing-season";
import { hairColorMixCalculator } from "./hair-color-mix";
import { hairGrowthCalculator } from "./hair-growth";
import { hamsterCageSizeCalculator } from "./hamster-cage-size";
import { healthInsuranceSubsidyCalculator } from "./health-insurance-subsidy";
import { heatDissipationCalculator } from "./heat-dissipation";
import { helocCalculator } from "./heloc-calculator";
import { hikingCalorieCalculator } from "./hiking-calorie";
import { hoaCalculator } from "./hoa-calculator";
import { hobbyCostCalculator } from "./hobby-cost";
import { homeInsuranceCalculator } from "./home-insurance";
import { homeValueCalculator } from "./home-value";
import { homeworkPlannerCalculator } from "./homework-planner";
import { horseFeedCalculator } from "./horse-feed";
import { horseWeightCalculator } from "./horse-weight";
import { hpToKwConverter } from "./hp-to-kw";
import { hyperfocalDistanceCalculator } from "./hyperfocal-distance";
import { inchesToFeetConverter } from "./inches-to-feet";
import { inkCoverageCalculator } from "./ink-coverage";
import { interestPenaltyCalculator } from "./interest-penalty";
import { intervalCalculator } from "./interval-calculator";
import { inventoryTurnoverCalculator } from "./inventory-turnover";
import { jumpHeightCalculator } from "./jump-height";
import { karaokeKeyCalculator } from "./karaoke-key";
import { kelvinToCelsiusConverter } from "./kelvin-to-celsius";
import { keyTransposeCalculator } from "./key-transpose";
import { kgToStonesConverter } from "./kg-to-stones";
import { kittenGrowthCalculator } from "./kitten-growth";
import { kmToMetersConverter } from "./km-to-meters";
import { knittingGaugeCalculator } from "./knitting-gauge";
import { knotsToMphConverter } from "./knots-to-mph";
import { landAreaCalculator } from "./land-area";
import { lateFeeCalculator } from "./late-fee";
import { letterGradeCalculator } from "./letter-grade";
import { licensePlateFeeCalculator } from "./license-plate-fee";
import { lifeInsuranceNeedCalculator } from "./life-insurance-need";
import { litersToCubicMetersConverter } from "./liters-to-cubic-meters";
import { litersToMlConverter } from "./liters-to-ml";
import { livestockWaterCalculator } from "./livestock-water";
import { llcCostCalculator } from "./llc-cost";
import { lotteryPayoutCalculator } from "./lottery-payout";
import { ltvCalculator } from "./ltv";
import { marinePftCalculator } from "./marine-pft";
import { matBoardCalculator } from "./mat-board";
import { mealPrepCalculator } from "./meal-prep";
import { meatCookingTimeCalculator } from "./meat-cooking-time";
import { medicarePremiumCalculator } from "./medicare-premium";
import { meetingCostCalculator } from "./meeting-cost";
import { mensSuitSizeCalculator } from "./mens-suit-size";
import { metersToCmConverter } from "./meters-to-cm";
import { metersToKmConverter } from "./meters-to-km";
import { metronomeCalculator } from "./metronome-calculator";
import { mileageReimbursementCalculator } from "./mileage-reimbursement";
import { milesToFeetConverter } from "./miles-to-feet";
import { minimumWageCalculator } from "./minimum-wage";
import { mlToLitersConverter } from "./ml-to-liters";
import { mlToTbspConverter } from "./ml-to-tbsp";
import { mortgagePointsCalculator } from "./mortgage-points";
import { motorTorqueCalculator } from "./motor-torque";
import { motorcycleGearRatioCalculator } from "./motorcycle-gear-ratio";
import { motorcycleLeanAngleCalculator } from "./motorcycle-lean-angle";
import { movingEstimateCalculator } from "./moving-estimate";
import { mpgCalculator } from "./mpg-calculator";
import { mphToKnotsConverter } from "./mph-to-knots";
import { mulchDepthCalculator } from "./mulch-depth";
import { muscleGainCalculator } from "./muscle-gain";
import { nailGrowthCalculator } from "./nail-growth";
import { necklaceLengthCalculator } from "./necklace-length";
import { noiCalculator } from "./noi-calculator";
import { noiseReductionCalculator } from "./noise-reduction";
import { notaryFeeCalculator } from "./notary-fee";
import { oilChangeIntervalCalculator } from "./oil-change-interval";
import { ouncesToPoundsConverter } from "./ounces-to-pounds";
import { overtimeLawCalculator } from "./overtime-law";
import { ozToCupsConverter } from "./oz-to-cups";
import { paceConverterCalculator } from "./pace-converter";
import { paperWeightCalculator } from "./paper-weight";
import { parlayCalculator } from "./parlay-calculator";
import { pastaServingCalculator } from "./pasta-serving";
import { patentCostCalculator } from "./patent-cost";
import { pcbTraceWidthCalculator } from "./pcb-trace-width";
import { perDiemCalculator } from "./per-diem";
import { perfumeConcentrationCalculator } from "./perfume-concentration";
import { petAgeComparisonCalculator } from "./pet-age-comparison";
import { petInsuranceCalculator } from "./pet-insurance";
import { petMedicationDoseCalculator } from "./pet-medication-dose";
import { petTravelCostCalculator } from "./pet-travel-cost";
import { photoPrintSizeCalculator } from "./photo-print-size";
import { pillowSizeCalculator } from "./pillow-size";
import { plankTimeCalculator } from "./plank-time";
import { plantSpacingCalculator } from "./plant-spacing";
import { podcastFileSizeCalculator } from "./podcast-file-size";
import { pondVolumeCalculator } from "./pond-volume";
import { poundsToOuncesConverter } from "./pounds-to-ounces";
import { powerConsumptionCalculator } from "./power-consumption";
import { pricePerUnitCalculator } from "./price-per-unit";
import { printingCostCalculator } from "./printing-cost";
import { productivityCalculator } from "./productivity";
import { profitMarginCalculator } from "./profit-margin";
import { propertyAppreciationCalculator } from "./property-appreciation";
import { ptoCalculator } from "./pto-calculator";
import { puppyGrowthCalculator } from "./puppy-growth";
import { pushUpTestCalculator } from "./push-up-test";
import { quickRatioCalculator } from "./quick-ratio";
import { quiltSizeCalculator } from "./quilt-size";
import { rabbitHutchSizeCalculator } from "./rabbit-hutch-size";
import { racePredictorCalculator } from "./race-predictor";
import { rainBarrelCalculator } from "./rain-barrel";
import { rainfallCalculator } from "./rainfall-calculator";
import { rcTimeConstantCalculator } from "./rc-time-constant";
import { renovationCostCalculator } from "./renovation-cost";
import { rentIncreaseCalculator } from "./rent-increase";
import { rentToOwnCalculator } from "./rent-to-own";
import { rentalIncomeCalculator } from "./rental-income";
import { rentersInsuranceCalculator } from "./renters-insurance";
import { reptileEnclosureCalculator } from "./reptile-enclosure";
import { resistorColorCodeCalculator } from "./resistor-color-code";
import { resonantFrequencyCalculator } from "./resonant-frequency";
import { reverseMortgageCalculator } from "./reverse-mortgage";
import { riceWaterRatioCalculator } from "./rice-water-ratio";
import { rlTimeConstantCalculator } from "./rl-time-constant";
import { roiMarketingCalculator } from "./roi-marketing";
import { ropeJumpCalorieCalculator } from "./rope-jump-calorie";
import { rowingPaceCalculator } from "./rowing-pace";
import { ruleOfThirdsCalculator } from "./rule-of-thirds";
import { runningVo2maxCalculator } from "./running-vo2max";
import { rvFuelCalculator } from "./rv-fuel";
import { salesRevenueCalculator } from "./sales-revenue";
import { salesTaxReverseCalculator } from "./sales-tax-reverse";
import { satScoreCalculator } from "./sat-score";
import { scholarshipCalculator } from "./scholarship-calculator";
import { securityDepositCalculator } from "./security-deposit";
import { semesterHoursCalculator } from "./semester-hours";
import { septicSizeCalculator } from "./septic-size";
import { shiftDifferentialCalculator } from "./shift-differential";
import { shippingCostCalculator } from "./shipping-cost";
import { sickLeaveCalculator } from "./sick-leave";
import { sitUpTestCalculator } from "./sit-up-test";
import { skinTypeCalculator } from "./skin-type";
import { skincareRoutineCalculator } from "./skincare-routine";
import { slowCookerConversionCalculator } from "./slow-cooker-conversion";
import { smokeMeatTimeCalculator } from "./smoke-meat-time";
import { snowLoadCalculator } from "./snow-load";
import { socialMediaSizeCalculator } from "./social-media-size";
import { socialSecurityBenefitCalculator } from "./social-security-benefit";
import { sockSizeCalculator } from "./sock-size";
import { solarPanelSizingCalculator } from "./solar-panel-sizing";
import { songKeyCalculator } from "./song-key";
import { sourdoughStarterCalculator } from "./sourdough-starter";
import { speakerPlacementCalculator } from "./speaker-placement";
import { spiceConversionCalculator } from "./spice-conversion";
import { sportsBettingOddsCalculator } from "./sports-betting-odds";
import { sprinklerCoverageCalculator } from "./sprinkler-coverage";
import { sqFeetToSqMetersConverter } from "./sq-feet-to-sq-meters";
import { stampDutyCalculator } from "./stamp-duty";
import { stepsToCaloriesCalculator } from "./steps-to-calories";
import { storageCostCalculator } from "./storage-cost";
import { streamingBitrateCalculator } from "./streaming-bitrate";
import { streamingDataCalculator } from "./streaming-data";
import { strengthStandardsCalculator } from "./strength-standards";
import { studentBudgetCalculator } from "./student-budget";
import { studentLoanInterestCalculator } from "./student-loan-interest";
import { studentLoanRepaymentCalculator } from "./student-loan-repayment";
import { subwooferBoxCalculator } from "./subwoofer-box";
import { sunscreenAmountCalculator } from "./sunscreen-amount";
import { swimPaceCalculator } from "./swim-pace";
import { tableclothSizeCalculator } from "./tablecloth-size";
import { tbspToMlConverter } from "./tbsp-to-ml";
import { teacherSalaryCalculator } from "./teacher-salary";
import { termLifeCostCalculator } from "./term-life-cost";
import { testScoreCalculator } from "./test-score";
import { threadCalculator } from "./thread-calculator";
import { threePhasePowerCalculator } from "./three-phase-power";
import { tideCalculator } from "./tide-calculator";
import { tirePressureCalculator } from "./tire-pressure";
import { trademarkCostCalculator } from "./trademark-cost";
import { trailDistanceCalculator } from "./trail-distance";
import { trailerWeightCalculator } from "./trailer-weight";
import { transformerTurnsCalculator } from "./transformer-turns";
import { treeHeightCalculator } from "./tree-height";
import { triathlonTimeCalculator } from "./triathlon-time";
import { truckPayloadCalculator } from "./truck-payload";
import { tspToMlConverter } from "./tsp-to-ml";
import { tuitionCostCalculator } from "./tuition-cost";
import { turkeyCookingTimeCalculator } from "./turkey-cooking-time";
import { umbrellaInsuranceCalculator } from "./umbrella-insurance";
import { unemploymentBenefitCalculator } from "./unemployment-benefit";
import { upsSizingCalculator } from "./ups-sizing";
import { vacancyRateCalculator } from "./vacancy-rate";
import { vehicleLoanPayoffCalculator } from "./vehicle-loan-payoff";
import { vehicleTaxCalculator } from "./vehicle-tax";
import { videoFileSizeCalculator } from "./video-file-size";
import { videoGameFpsCalculator } from "./video-game-fps";
import { vinylRpmCalculator } from "./vinyl-rpm";
import { visibilityDistanceCalculator } from "./visibility-distance";
import { watchSizeCalculator } from "./watch-size";
import { waterFlowRateCalculator } from "./water-flow-rate";
import { weightLossTimeCalculator } from "./weight-loss-time";
import { weightedGradeCalculator } from "./weighted-grade";
import { weightliftingTotalCalculator } from "./weightlifting-total";
import { wellPumpCalculator } from "./well-pump";
import { wheatstoneBridgeCalculator } from "./wheatstone-bridge";
import { wheelOffsetCalculator } from "./wheel-offset";
import { windLoadCalculator } from "./wind-load";
import { wineServingCalculator } from "./wine-serving";
import { wireAmpacityCalculator } from "./wire-ampacity";
import { workersCompCalculator } from "./workers-comp";
import { workingCapitalCalculator } from "./working-capital";
import { wpmCalculator } from "./wpm-calculator";
import { xpCalculator } from "./xp-calculator";
import { yeastConversionCalculator } from "./yeast-conversion";
import { yogaCalorieCalculator } from "./yoga-calorie";

import { a1cCalculator } from "./a1c-calculator";
import { ageInHoursCalculator } from "./age-in-hours";
import { ageInMonthsCalculator } from "./age-in-months";
import { ageInWeeksCalculator } from "./age-in-weeks";
import { airbnbCalculator } from "./airbnb-calculator";
import { allergySeasonCalculator } from "./allergy-season";
import { altitudeSicknessCalculator } from "./altitude-sickness";
import { anniversaryCalculator } from "./anniversary-calculator";
import { avogadroCalculator } from "./avogadro-calculator";
import { babyClothingSizeCalculator } from "./baby-clothing-size";
import { babyFeedingScheduleCalculator } from "./baby-feeding-schedule";
import { babyHeightPercentileCalculator } from "./baby-height-percentile";
import { babyMilestoneCalculator } from "./baby-milestone";
import { babyNamePopularityCalculator } from "./baby-name-popularity";
import { babySleepScheduleCalculator } from "./baby-sleep-schedule";
import { babyWeightPercentileCalculator } from "./baby-weight-percentile";
import { bathroomTileCalculator } from "./bathroom-tile";
import { bathtubSizeCalculator } from "./bathtub-size";
import { bayesTheoremCalculator } from "./bayes-theorem";
import { beehiveCalculator } from "./beehive-calculator";
import { binomialDistributionCalculator } from "./binomial-distribution";
import { biologicalAgeCalculator } from "./biological-age";
import { birthdayCalculator } from "./birthday-calculator";
import { bloodAlcoholTimeCalculator } from "./blood-alcohol-time";
import { bloodTypeCompatibilityCalculator } from "./blood-type-compatibility";
import { bloodVolumeCalculator } from "./blood-volume";
import { bmiChildrenCalculator } from "./bmi-children";
import { boilingPointCalculator } from "./boiling-point";
import { booleanAlgebraCalculator } from "./boolean-algebra";
import { breakTimeCalculator } from "./break-time";
import { breastMilkIntakeCalculator } from "./breast-milk-intake";
import { bufferSolutionCalculator } from "./buffer-solution";
import { cabinetCalculator } from "./cabinet-calculator";
import { campingGearCalculator } from "./camping-gear";
import { carSeatSizeCalculator } from "./car-seat-size";
import { carryOnSizeCalculator } from "./carry-on-size";
import { childDosageCalculator } from "./child-dosage";
import { childHeightPredictorCalculator } from "./child-height-predictor";
import { childShoeSizeCalculator } from "./child-shoe-size";
import { childcareCostCalculator } from "./childcare-cost";
import { chimneyHeightCalculator } from "./chimney-height";
import { cholesterolRatioCalculator } from "./cholesterol-ratio";
import { closetOrganizerCalculator } from "./closet-organizer";
import { collegeFundCalculator } from "./college-fund";
import { columnCalculator } from "./column-calculator";
import { combinationsCalculator } from "./combinations-calculator";
import { companionPlantingCalculator } from "./companion-planting";
import { completingSquareCalculator } from "./completing-square";
import { compostRatioCalculator } from "./compost-ratio";
import { contactLensCalculator } from "./contact-lens";
import { contractionTimerCalculator } from "./contraction-timer";
import { countdownDaysCalculator } from "./countdown-days";
import { creatinineCalculator } from "./creatinine-calculator";
import { cropRotationCalculator } from "./crop-rotation";
import { cruiseCostCalculator } from "./cruise-cost";
import { cubicEquationCalculator } from "./cubic-equation";
import { currencyExchangeCalculator } from "./currency-exchange";
import { dateAddSubtractCalculator } from "./date-add-subtract";
import { decimalTimeCalculator } from "./decimal-time";
import { derivativeCalculator } from "./derivative-calculator";
import { diaperCostCalculator } from "./diaper-cost";
import { dilutionRatioCalculator } from "./dilution-ratio";
import { doorSizeCalculator } from "./door-size";
import { dosageByWeightCalculator } from "./dosage-by-weight";
import { downspoutCalculator } from "./downspout-calculator";
import { dripIrrigationCalculator } from "./drip-irrigation";
import { drivewayCalculator } from "./driveway-calculator";
import { drivingTimeCalculator } from "./driving-time";
import { eigenvalueCalculator } from "./eigenvalue-calculator";
import { electrochemistryCalculator } from "./electrochemistry";
import { empiricalFormulaCalculator } from "./empirical-formula";
import { enthalpyCalculator } from "./enthalpy-calculator";
import { entropyCalculator } from "./entropy-calculator";
import { equilibriumConstantCalculator } from "./equilibrium-constant";
import { exponentialGrowthCalculator } from "./exponential-growth";
import { fallRiskCalculator } from "./fall-risk";
import { fertilityWindowCalculator } from "./fertility-window";
import { flightTimeCalculator } from "./flight-time";
import { flowerBulbCalculator } from "./flower-bulb";
import { fluidBalanceCalculator } from "./fluid-balance";
import { footingCalculator } from "./footing-calculator";
import { formulaMixingCalculator } from "./formula-mixing";
import { foundationCalculator } from "./foundation-calculator";
import { freezingPointCalculator } from "./freezing-point";
import { frenchDrainCalculator } from "./french-drain";
import { fruitTreeYieldCalculator } from "./fruit-tree-yield";
import { fuelStopCalculator } from "./fuel-stop";
import { garageDoorSizeCalculator } from "./garage-door-size";
import { garageFloorEpoxyCalculator } from "./garage-floor-epoxy";
import { gardenBedCostCalculator } from "./garden-bed-cost";
import { gardenFenceCalculator } from "./garden-fence";
import { gardenWaterCalculator } from "./garden-water";
import { gasLawCombinedCalculator } from "./gas-law-combined";
import { gestationalDiabetesCalculator } from "./gestational-diabetes";
import { gibbsFreeEnergyCalculator } from "./gibbs-free-energy";
import { greenhouseSizeCalculator } from "./greenhouse-size";
import { growLightCalculator } from "./grow-light";
import { growthSpurtCalculator } from "./growth-spurt";
import { gutterGuardCalculator } from "./gutter-guard";
import { gutterSizeCalculator } from "./gutter-size";
import { harvestDateCalculator } from "./harvest-date";
import { hcgLevelCalculator } from "./hcg-level";
import { hearingLossCalculator } from "./hearing-loss";
import { heartDiseaseRiskCalculator } from "./heart-disease-risk";
import { hotelCostCalculator } from "./hotel-cost";
import { hoursCalculator } from "./hours-calculator";
import { hydroponicNutrientCalculator } from "./hydroponic-nutrient";
import { hyperbolicCalculator } from "./hyperbolic-calculator";
import { integralCalculator } from "./integral-calculator";
import { internationalSizeCalculator } from "./international-size";
import { inverseTrigCalculator } from "./inverse-trig";
import { ivFlowRateCalculator } from "./iv-flow-rate";
import { julianDateCalculator } from "./julian-date";
import { kickCountCalculator } from "./kick-count";
import { laplaceTransformCalculator } from "./laplace-transform";
import { latitudeLongitudeCalculator } from "./latitude-longitude";
import { lawOfCosinesCalculator } from "./law-of-cosines";
import { lawOfSinesCalculator } from "./law-of-sines";
import { lawnFertilizerCalculator } from "./lawn-fertilizer";
import { layoverTimeCalculator } from "./layover-time";
import { limitCalculator } from "./limit-calculator";
import { limitingReagentCalculator } from "./limiting-reagent";
import { logarithmSolverCalculator } from "./logarithm-solver";
import { luggageWeightCalculator } from "./luggage-weight";
import { mapDistanceCalculator } from "./map-distance";
import { massSpectrometryCalculator } from "./mass-spectrometry";
import { maternityLeaveCalculator } from "./maternity-leave";
import { matrixInverseCalculator } from "./matrix-inverse";
import { meetingTimeCalculator } from "./meeting-time";
import { mentalHealthScoreCalculator } from "./mental-health-score";
import { metabolicAgeCalculator } from "./metabolic-age";
import { militaryTimeCalculator } from "./military-time";
import { molalityCalculator } from "./molality-calculator";
import { molarMassCalculator } from "./molar-mass";
import { monthsBetweenDatesCalculator } from "./months-between-dates";
import { nitrogenCalculator } from "./nitrogen-calculator";
import { nutritionLabelCalculator } from "./nutrition-label";
import { osmoticPressureCalculator } from "./osmotic-pressure";
import { oxidationNumberCalculator } from "./oxidation-number";
import { painScaleCalculator } from "./pain-scale";
import { partialFractionsCalculator } from "./partial-fractions";
import { passportExpiryCalculator } from "./passport-expiry";
import { paternityLeaveCalculator } from "./paternity-leave";
import { paverBaseCalculator } from "./paver-base";
import { payPeriodCalculator } from "./pay-period";
import { percentCompositionCalculator } from "./percent-composition";
import { percentYieldCalculator } from "./percent-yield";
import { phAdjustmentCalculator } from "./ph-adjustment";
import { poissonDistributionCalculator } from "./poisson-distribution";
import { pottingSoilCalculator } from "./potting-soil";
import { powerPlugCalculator } from "./power-plug";
import { quarterCalculator } from "./quarter-calculator";
import { radioactiveDecayRateCalculator } from "./radioactive-decay-rate";
import { raisedBedSoilCalculator } from "./raised-bed-soil";
import { rampCalculator } from "./ramp-calculator";
import { reactionRateCalculator } from "./reaction-rate";
import { retainingWallBlockCalculator } from "./retaining-wall-block";
import { retirementAgeCalculator } from "./retirement-age";
import { roadTripPlannerCalculator } from "./road-trip-planner";
import { roofPitchCalculator } from "./roof-pitch";
import { seedStartingCalculator } from "./seed-starting";
import { showerTileCalculator } from "./shower-tile";
import { sidingCalculator } from "./siding-calculator";
import { sleepCycleCalculator } from "./sleep-cycle";
import { soffitCalculator } from "./soffit-calculator";
import { soilAmendmentCalculator } from "./soil-amendment";
import { solubilityProductCalculator } from "./solubility-product";
import { strokeRiskCalculator } from "./stroke-risk";
import { strollerAgeCalculator } from "./stroller-age";
import { syntheticDivisionCalculator } from "./synthetic-division";
import { systemOfEquationsCalculator } from "./system-of-equations";
import { taylorSeriesCalculator } from "./taylor-series";
import { timeSinceCalculator } from "./time-since";
import { timeUntilCalculator } from "./time-until";
import { timeZoneDifferenceCalculator } from "./time-zone-difference";
import { timezoneMeetingCalculator } from "./timezone-meeting";
import { tipAbroadCalculator } from "./tip-abroad";
import { titrationCalculator } from "./titration-calculator";
import { toddlerBmiCalculator } from "./toddler-bmi";
import { travelChecklistCalculator } from "./travel-checklist";
import { travelInsuranceCalculator } from "./travel-insurance";
import { travelPackingCalculator } from "./travel-packing";
import { travelVaccineCalculator } from "./travel-vaccine";
import { treeSpacingCalculator } from "./tree-spacing";
import { trigCalculator } from "./trig-calculator";
import { trussCalculator } from "./truss-calculator";
import { unitCircleCalculator } from "./unit-circle";
import { unixTimestampCalculator } from "./unix-timestamp";
import { vaporPressureCalculator } from "./vapor-pressure";
import { vegetableYieldCalculator } from "./vegetable-yield";
import { visaDurationCalculator } from "./visa-duration";
import { visionPrescriptionCalculator } from "./vision-prescription";
import { weedCoverageCalculator } from "./weed-coverage";
import { weeksBetweenDatesCalculator } from "./weeks-between-dates";
import { whatDayWasCalculator } from "./what-day-was";
import { windowSizeCalculator } from "./window-size";
import { workScheduleCalculator } from "./work-schedule";
import { workdayCalculator } from "./workday-calculator";
import { wormCompostingCalculator } from "./worm-composting";
import { woundSizeCalculator } from "./wound-size";

export const calculators: CalculatorDefinition[] = [
  percentageCalculator,
  bmiCalculator,
  ageCalculator,
  tipCalculator,
  compoundInterestCalculator,
  mortgageCalculator,
  loanCalculator,
  calorieCalculator,
  gpaCalculator,
  salaryCalculator,
  discountCalculator,
  unitConverter,
  squareFootageCalculator,
  fractionCalculator,
  standardDeviationCalculator,
  dateCalculator,
  paceCalculator,
  fuelCostCalculator,
  electricityCalculator,
  rentSplitCalculator,
  roiCalculator,
  inflationCalculator,
  speedCalculator,
  volumeCalculator,
  idealWeightCalculator,
  bodyFatCalculator,
  pregnancyCalculator,
  sleepCalculator,
  randomNumberGenerator,
  probabilityCalculator,
  timeZoneConverter,
  paycheckCalculator,
  taxCalculator,
  retirementCalculator,
  carLoanCalculator,
  downPaymentCalculator,
  debtPayoffCalculator,
  savingsGoalCalculator,
  marginCalculator,
  gradeCalculator,
  scientificCalculator,
  quadraticCalculator,
  ratioCalculator,
  binaryHexConverter,
  cookingConverter,
  concreteCalculator,
  paintCalculator,
  heartRateCalculator,
  waterIntakeCalculator,
  proteinCalculator,
  subnetCalculator,
  pythagoreanCalculator,
  averageCalculator,
  lcmGcdCalculator,
  factorialCalculator,
  exponentCalculator,
  squareRootCalculator,
  slopeCalculator,
  decimalFractionCalculator,
  roundingCalculator,
  logarithmCalculator,
  percentageChangeCalculator,
  permutationCalculator,
  midpointCalculator,
  longDivisionCalculator,
  numberSequenceCalculator,
  areaOfCircleCalculator,
  percentageOfNumberCalculator,
  netWorthCalculator,
  investmentCalculator,
  simpleInterestCalculator,
  breakEvenCalculator,
  annuityCalculator,
  stockReturnCalculator,
  creditCardCalculator,
  costOfLivingCalculator,
  macroCalculator,
  bacCalculator,
  ovulationCalculator,
  oneRepMaxCalculator,
  waistHipCalculator,
  stepsMilesCalculator,
  bloodPressureCalculator,
  vo2maxCalculator,
  tileCalculator,
  gravelCalculator,
  timeCardCalculator,
  tipTaxCalculator,
  gasMileageCalculator,
  timeDurationCalculator,
  poolVolumeCalculator,
  ohmsLawCalculator,
  forceCalculator,
  densityCalculator,
  energyCalculator,
  momentumCalculator,
  accelerationCalculator,
  wavelengthCalculator,
  phCalculator,
  colorConverter,
  dataStorageConverter,
  shoeSizeConverter,
  speedConverter,
  angleConverter,
  areaConverter,
  pressureConverter,
  matrixCalculator,
  circumferenceCalculator,
  triangleAreaCalculator,
  mixedNumberCalculator,
  surfaceAreaCalculator,
  cylinderVolumeCalculator,
  coneVolumeCalculator,
  hexDecimalConverter,
  romanNumeralCalculator,
  dogYearsCalculator,
  cagrCalculator,
  leaseCalculator,
  propertyTaxCalculator,
  salesTaxCalculator,
  markupCalculator,
  payRaiseCalculator,
  workHoursCalculator,
  bmrCalculator,
  windChillCalculator,
  heatIndexCalculator,
  dewPointCalculator,
  leanBodyMassCalculator,
  readingTimeCalculator,
  aspectRatioCalculator,
  pixelDensityCalculator,
  downloadTimeCalculator,
  carbonFootprintCalculator,
  percentageErrorCalculator,
  significantFiguresCalculator,
  tdeeCalculator,
  halfLifeCalculator,
  molarityCalculator,
  frequencyCalculator,
  resistanceCalculator,
  btuCalculator,
  horsepowerCalculator,
  torqueCalculator,
  wordCounterCalculator,
  passwordStrengthCalculator,
  timestampConverter,
  amortizationCalculator,
  conversionRateCalculator,
  costPerUnitCalculator,
  electricityUsageCalculator,
  sphereCalculator,
  weightConverter,
  temperatureConverter,
  lengthConverter,
  timeConverter,
  volumeConverter,
  absoluteValueCalculator,
  primeNumberCalculator,
  fibonacciCalculator,
  complexNumberCalculator,
  vectorCalculator,
  proportionsCalculator,
  trapezoidAreaCalculator,
  parallelogramAreaCalculator,
  numberBaseConverter,
  linearEquationCalculator,
  dividendCalculator,
  debtToIncomeCalculator,
  emergencyFundCalculator,
  ruleOf72Calculator,
  rentalYieldCalculator,
  hourlyToSalaryCalculator,
  bloodSugarCalculator,
  dueDateCalculator,
  targetHeartRateCalculator,
  idealGasCalculator,
  projectileCalculator,
  springConstantCalculator,
  specificHeatCalculator,
  lensEquationCalculator,
  electricalPowerCalculator,
  frictionCalculator,
  fenceCalculator,
  wallpaperCalculator,
  soilMulchCalculator,
  carpetCalculator,
  deckCalculator,
  staircaseCalculator,
  roadTripCalculator,
  eventCountdownCalculator,
  fuelEfficiencyConverter,
  lawnCalculator,
  energyConverter,
  forceConverter,
  bondYieldCalculator,
  interestRateCalculator,
  coulombsLawCalculator,
  cookingTempCalculator,
  clothingSizeConverter,
  movingCostCalculator,
  ageInDaysCalculator,
  flowRateCalculator,
  wireGaugeCalculator,
  noiseLevelCalculator,
  armyBodyFatCalculator,
  signalToNoiseCalculator,
  fourOhOneKCalculator,
  anionGapCalculator,
  apgarScoreCalculator,
  aquariumCalculator,
  astronomicalUnitConverter,
  audioBitrateCalculator,
  autoLeaseCalculator,
  babyGrowthCalculator,
  backsplashCalculator,
  bandwidthCalculator,
  basketballStatsCalculator,
  batteryLifeCalculator,
  battingAverageCalculator,
  beerLambertCalculator,
  binaryArithmeticCalculator,
  binomialCoefficientCalculator,
  bmiPercentileCalculator,
  bodySurfaceAreaCalculator,
  bodyWaterCalculator,
  bowlingScoreCalculator,
  boylesLawCalculator,
  brickCalculator,
  budgetCalculator,
  buoyancyCalculator,
  burnsCalculator,
  businessDaysCalculator,
  businessLoanCalculator,
  caffeineCalculator,
  candleBurnCalculator,
  capacitanceCalculator,
  capitalGainsCalculator,
  carDepreciationCalculator,
  centripetalForceCalculator,
  charlesLawCalculator,
  chineseZodiacCalculator,
  chiSquareCalculator,
  circuitCalculator,
  coffeeRatioCalculator,
  coinFlipCalculator,
  collegeSavingsCalculator,
  colorTemperatureCalculator,
  compostCalculator,
  confidenceIntervalCalculator,
  cookingWeightConverter,
  correctedCalciumCalculator,
  correlationCalculator,
  costBasisCalculator,
  countertopCalculator,
  covarianceCalculator,
  creatinineClearanceCalculator,
  crossProductCalculator,
  cryptoProfitCalculator,
  currencyTipCalculator,
  curtainCalculator,
  cyclingPowerCalculator,
  daysBetweenDatesCalculator,
  debtSnowballCalculator,
  decayCalculator,
  densityUnitConverter,
  depreciationCalculator,
  determinantCalculator,
  diceRollerCalculator,
  dilutionCalculator,
  dopplerEffectCalculator,
  dotProductCalculator,
  dpiCalculator,
  drywallCalculator,
  engineDisplacementCalculator,
  eraCalculator,
  escapeVelocityCalculator,
  estateTaxCalculator,
  exchangeRateCalculator,
  exerciseCalorieCalculator,
  fabricConverter,
  flightDistanceCalculator,
  flooringCalculator,
  fontSizeConverter,
  frameRateCalculator,
  frequencyUnitConverter,
  futureValueCalculator,
  gearRatioCalculator,
  geometricMeanCalculator,
  giftWrapCalculator,
  glasgowComaCalculator,
  golfHandicapCalculator,
  gravitationalForceCalculator,
  gutterCalculator,
  harmonicMeanCalculator,
  heartRateReserveCalculator,
  homeEquityCalculator,
  hvacCalculator,
  hydrationCalculator,
  imageResolutionCalculator,
  inductanceCalculator,
  inequalitySolverCalculator,
  insulationCalculator,
  insulinDoseCalculator,
  interpolationCalculator,
  irrCalculator,
  irrigationCalculator,
  ivDripRateCalculator,
  jetLagCalculator,
  lightingCalculator,
  lotteryOddsCalculator,
  lumberCalculator,
  luminosityConverter,
  mapScaleCalculator,
  marathonPredictorCalculator,
  meanMedianModeCalculator,
  medicationDosageCalculator,
  modularArithmeticCalculator,
  monitorComparisonCalculator,
  mortarCalculator,
  mortgageRefinanceCalculator,
  movingBoxCalculator,
  musicTempoCalculator,
  nauticalConverter,
  normalDistributionCalculator,
  npvCalculator,
  orbitalVelocityCalculator,
  paperSizeConverter,
  partyFoodCalculator,
  patioCalculator,
  payrollTaxCalculator,
  pediatricDoseCalculator,
  pendulumCalculator,
  pergolaCalculator,
  petFoodCalculator,
  photographyExposureCalculator,
  pizzaDoughCalculator,
  plywoodCalculator,
  pokerOddsCalculator,
  polarCoordinatesCalculator,
  polynomialCalculator2,
  postageCalculator,
  powerFactorCalculator,
  powerUnitConverter,
  pregnancyWeightCalculator,
  presentValueCalculator,
  printSizeCalculator,
  projectorSizeCalculator,
  quarterbackRatingCalculator,
  radiationDoseConverter,
  raisedGardenBedCalculator,
  readingLevelCalculator,
  realReturnCalculator,
  rebarCalculator,
  recipeScalerCalculator,
  recoveryTimeCalculator,
  refractiveIndexCalculator,
  regressionCalculator,
  rentVsBuyCalculator,
  retainingWallCalculator,
  reynoldsNumberCalculator,
  roofingCalculator,
  roomAcousticsCalculator,
  rothIraCalculator,
  runningSplitsCalculator,
  sampleSizeCalculator,
  sandboxCalculator,
  screenSizeCalculator,
  seriesConvergenceCalculator,
  shedCalculator,
  sleepDebtCalculator,
  soccerStatsCalculator,
  sodiumCorrectionCalculator,
  solarPanelCalculator,
  soundSpeedCalculator,
  speakerWireCalculator,
  stefanBoltzmannCalculator,
  studentLoanCalculator,
  studyTimeCalculator,
  summationCalculator,
  swimmingPaceCalculator,
  taxBracketCalculator,
  terrariumCalculator,
  thermalExpansionCalculator,
  timberVolumeCalculator,
  tipPoolCalculator,
  tireSizeCalculator,
  torqueUnitConverter,
  towingCapacityCalculator,
  trainingZoneCalculator,
  transformerCalculator,
  travelBudgetCalculator,
  tuningFrequencyCalculator,
  tvDistanceCalculator,
  typingSpeedCalculator,
  varianceCalculator,
  videoBitrateCalculator,
  viscosityConverter,
  waterHeaterCalculator,
  weddingBudgetCalculator,
  weightedAverageCalculator,
  windEnergyCalculator,
  windowBlindCalculator,
  wireLengthCalculator,
  workEnergyCalculator,
  zodiacSignCalculator,
  zScoreCalculator,
  psiToBarConverter,
  barToPsiConverter,
  mphToKphConverter,
  kphToMphConverter,
  tbspToCupsConverter,
  tspToTbspConverter,
  flOzToMlConverter,
  pintsToLitersConverter,
  quartsToLitersConverter,
  feetToInchesConverter,
  cubicFeetCalculator,
  cubicYardsCalculator,
  scientificNotationCalculator,
  simplifyFractionsCalculator,
  voltageDropCalculator,
  voltageDividerCalculator,
  ledResistorCalculator,
  pipeFlowCalculator,
  airFlowCalculator,
  waterPressureCalculator,
  pulleyCalculator,
  leverCalculator,
  inclinedPlaneCalculator,
  beltLengthCalculator,
  gearSpeedCalculator,
  ketoCalculator,
  calorieDeficitCalculator,
  ffmiCalculator,
  waistToHeightCalculator,
  navyBodyFatCalculator,
  conceptionCalculator,
  ivfDueDateCalculator,
  walkingCalorieCalculator,
  runningCalorieCalculator,
  cyclingCalorieCalculator,
  benchPressCalculator,
  squatMaxCalculator,
  deadliftMaxCalculator,
  wilksScoreCalculator,
  alcoholCalorieCalculator,
  intermittentFastingCalculator,
  pregnancyWeekCalculator,
  babyFormulaCalculator,
  breastfeedingCalorieCalculator,
  vitaminDCalculator,
  ironIntakeCalculator,
  fiberIntakeCalculator,
  sugarIntakeCalculator,
  sodiumIntakeCalculator,
  dogWeightCalculator,
  topsoilCalculator,
  sodCalculator,
  grassSeedCalculator,
  poolChemicalCalculator,
  hotTubCalculator,
  asphaltCalculator,
  concreteBlockCalculator,
  baseboardCalculator,
  crownMoldingCalculator,
  epoxyCalculator,
  resinCalculator,
  groutCalculator,
  fertilizerCalculator,
  studSpacingCalculator,
  joistSpanCalculator,
  beamSizeCalculator,
  postSpacingCalculator,
  deckStainCalculator,
  evChargingCalculator,
  solarSavingsCalculator,
  waterBillCalculator,
  gasBillCalculator,
  paintQuantityCalculator,
  wallpaperRollsCalculator,
  homeMaintenanceCalculator,
  inchesToCmConverter,
  cmToInchesConverter,
  feetToMetersConverter,
  metersToFeetConverter,
  milesToKmConverter,
  kmToMilesConverter,
  poundsToKgConverter,
  kgToPoundsConverter,
  ouncesToGramsConverter,
  gramsToOuncesConverter,
  celsiusToFahrenheitConverter,
  fahrenheitToCelsiusConverter,
  cupsToMlConverter,
  litersToGallonsConverter,
  gallonsToLitersConverter,
  mmToInchesConverter,
  inchesToMmConverter,
  sqMetersToSqFeetConverter,
  acresToSqFeetConverter,
  hectaresToAcresConverter,
  stonesToPoundsConverter,
  stonesToKgConverter,
  yardsToMetersConverter,
  wattsToAmpsConverter,
  ampsToWattsConverter,
  homeAffordabilityCalculator,
  fhaLoanCalculator,
  vaLoanCalculator,
  pmiCalculator2,
  closingCostCalculator,
  biweeklyMortgageCalculator,
  extraMortgagePaymentCalculator,
  takeHomePayCalculator,
  overtimePayCalculator,
  commissionCalculator2,
  selfEmploymentTaxCalculator,
  bonusTaxCalculator,
  cdInterestCalculator,
  savingsAccountCalculator,
  pensionCalculator,
  socialSecurityCalculator,
  rmdCalculator,
  hsaCalculator,
  rentAffordabilityCalculator,
  netIncomeCalculator,
  grossToNetCalculator,
  inheritanceTaxCalculator,
  freelanceRateCalculator,
  invoiceCalculator,
  cashFlowCalculator,
  braSizeCalculator,
  ringSizeCalculator,
  hatSizeCalculator,
  bikeSizeCalculator,
  skiSizeCalculator,
  snowboardSizeCalculator,
  helmetSizeCalculator,
  backpackSizeCalculator,
  dayOfWeekCalculator,
  leapYearCalculator,
  moonPhaseCalculator,
  sunriseSunsetCalculator,
  beaufortScaleCalculator,
  uvIndexCalculator,
  humidityCalculator2,
  soilPhCalculator,
  waterHardnessCalculator,
  poolSaltCalculator,
  ageDifferenceCalculator,
  loveCalculator,
  numerologyCalculator,
  lifePathCalculator,
  angelNumberCalculator,
  bmiPrimeCalculator,
  bodyShapeCalculator,
  accelerationTimeCalculator,
  accountsReceivableCalculator,
  actScoreCalculator,
  airQualityIndexCalculator,
  alcoholDilutionCalculator,
  alimonyCalculator,
  animationFramesCalculator,
  antennaLengthCalculator,
  armCalculator,
  armyPtScoreCalculator,
  attendanceRateCalculator,
  audioFileSizeCalculator,
  autoInsuranceEstimateCalculator,
  bakingConversionCalculator,
  bannerSizeCalculator,
  batteryCapacityCalculator,
  beerAbvCalculator,
  beltSizeCalculator,
  bindingCalculator,
  birdCageSizeCalculator,
  boardGameScoreCalculator,
  boatFuelCalculator,
  bodyMeasurementCalculator,
  boxingCalorieCalculator,
  bpmCalculator,
  braceletSizeCalculator,
  brakingDistanceCalculator,
  breadRecipeCalculator,
  breakEvenPointCalculator,
  btuHeatingCalculator,
  businessLicenseCalculator,
  businessValuationCalculator,
  butterOilConversionCalculator,
  cableLengthAudioCalculator,
  cableVoltageDropCalculator,
  cacCalculator,
  caffeineIntakeCalculator,
  cakePanSizeCalculator,
  campfireHeatCalculator,
  candyTemperatureCalculator,
  canningTimeCalculator,
  canvasSizeCalculator,
  capRateCalculator,
  carAffordabilityCalculator,
  carInsuranceCalculator,
  carLeaseVsBuyCalculator,
  carPaymentCalculator,
  carTradeInCalculator,
  cardProbabilityCalculator,
  cargoVolumeCalculator,
  cashOnCashCalculator,
  catAgeCalculator,
  catCalorieCalculator,
  catFoodAmountCalculator,
  catPregnancyCalculator,
  celsiusToKelvinConverter,
  chickenCoopSizeCalculator,
  childSupportCalculator,
  chordCalculator,
  churnRateCalculator,
  citationCountCalculator,
  classAverageCalculator,
  classRankCalculator,
  cmToMetersConverter,
  coilInductanceCalculator,
  colorContrastCalculator,
  commercialLeaseCalculator,
  courtFeeCalculator,
  crochetYarnCalculator,
  cropFactorCalculator,
  crossfitScoreCalculator,
  cubicMetersToLitersConverter,
  cumulativeGpaCalculator,
  cupsToOzConverter,
  currentDividerCalculator,
  currentRatioCalculator,
  curtainFabricCalculator,
  curveGradeCalculator,
  customerLifetimeValueCalculator,
  cyclingFtpCalculator,
  dAndDDiceCalculator,
  decibelCalculator,
  deepFryOilCalculator,
  depthOfFieldCalculator,
  disabilityBenefitCalculator,
  discountPercentageCalculator,
  dogBmiCalculator,
  dogCalorieCalculator,
  dogFoodAmountCalculator,
  dogPregnancyCalculator,
  drainageCalculator,
  dressSizeCalculator,
  dscrCalculator,
  eggProductionCalculator,
  eggSubstituteCalculator,
  electricRangeCalculator,
  electricalLoadCalculator,
  electricityCostApplianceCalculator,
  elevationGainCalculator,
  emissionCalculator,
  employeeCostCalculator,
  essayLengthCalculator,
  eventTicketCalculator,
  fabricYardageCalculator,
  fantasyPointsCalculator,
  feetToMilesConverter,
  finalGradeCalculator,
  financialAidCalculator,
  firewoodCalculator,
  fishTankSizeCalculator,
  fishingLineCalculator,
  flashGuideNumberCalculator,
  flashcardStudyCalculator,
  flexibilityTestCalculator,
  flipProfitCalculator,
  floodInsuranceCalculator,
  focalLengthEquivalentCalculator,
  fontScaleCalculator,
  foodCostCalculator,
  frameSizeCalculator,
  freezerStorageCalculator,
  frequencyToNoteCalculator,
  frostDepthCalculator,
  fuseSizingCalculator,
  gamingMonitorCalculator,
  gardenYieldCalculator,
  gasCostTripCalculator,
  gearRatioVehicleCalculator,
  generatorSizingCalculator,
  glassesSizeCalculator,
  gloveSizeCalculator,
  goldenRatioCalculator,
  gpaToPercentageCalculator,
  gridCalculator,
  grillTemperatureCalculator,
  gripStrengthCalculator,
  grmCalculator,
  groundingResistanceCalculator,
  growingSeasonCalculator,
  hairColorMixCalculator,
  hairGrowthCalculator,
  hamsterCageSizeCalculator,
  healthInsuranceSubsidyCalculator,
  heatDissipationCalculator,
  helocCalculator,
  hikingCalorieCalculator,
  hoaCalculator,
  hobbyCostCalculator,
  homeInsuranceCalculator,
  homeValueCalculator,
  homeworkPlannerCalculator,
  horseFeedCalculator,
  horseWeightCalculator,
  hpToKwConverter,
  hyperfocalDistanceCalculator,
  inchesToFeetConverter,
  inkCoverageCalculator,
  interestPenaltyCalculator,
  intervalCalculator,
  inventoryTurnoverCalculator,
  jumpHeightCalculator,
  karaokeKeyCalculator,
  kelvinToCelsiusConverter,
  keyTransposeCalculator,
  kgToStonesConverter,
  kittenGrowthCalculator,
  kmToMetersConverter,
  knittingGaugeCalculator,
  knotsToMphConverter,
  landAreaCalculator,
  lateFeeCalculator,
  letterGradeCalculator,
  licensePlateFeeCalculator,
  lifeInsuranceNeedCalculator,
  litersToCubicMetersConverter,
  litersToMlConverter,
  livestockWaterCalculator,
  llcCostCalculator,
  lotteryPayoutCalculator,
  ltvCalculator,
  marinePftCalculator,
  matBoardCalculator,
  mealPrepCalculator,
  meatCookingTimeCalculator,
  medicarePremiumCalculator,
  meetingCostCalculator,
  mensSuitSizeCalculator,
  metersToCmConverter,
  metersToKmConverter,
  metronomeCalculator,
  mileageReimbursementCalculator,
  milesToFeetConverter,
  minimumWageCalculator,
  mlToLitersConverter,
  mlToTbspConverter,
  mortgagePointsCalculator,
  motorTorqueCalculator,
  motorcycleGearRatioCalculator,
  motorcycleLeanAngleCalculator,
  movingEstimateCalculator,
  mpgCalculator,
  mphToKnotsConverter,
  mulchDepthCalculator,
  muscleGainCalculator,
  nailGrowthCalculator,
  necklaceLengthCalculator,
  noiCalculator,
  noiseReductionCalculator,
  notaryFeeCalculator,
  oilChangeIntervalCalculator,
  ouncesToPoundsConverter,
  overtimeLawCalculator,
  ozToCupsConverter,
  paceConverterCalculator,
  paperWeightCalculator,
  parlayCalculator,
  pastaServingCalculator,
  patentCostCalculator,
  pcbTraceWidthCalculator,
  perDiemCalculator,
  perfumeConcentrationCalculator,
  petAgeComparisonCalculator,
  petInsuranceCalculator,
  petMedicationDoseCalculator,
  petTravelCostCalculator,
  photoPrintSizeCalculator,
  pillowSizeCalculator,
  plankTimeCalculator,
  plantSpacingCalculator,
  podcastFileSizeCalculator,
  pondVolumeCalculator,
  poundsToOuncesConverter,
  powerConsumptionCalculator,
  pricePerUnitCalculator,
  printingCostCalculator,
  productivityCalculator,
  profitMarginCalculator,
  propertyAppreciationCalculator,
  ptoCalculator,
  puppyGrowthCalculator,
  pushUpTestCalculator,
  quickRatioCalculator,
  quiltSizeCalculator,
  rabbitHutchSizeCalculator,
  racePredictorCalculator,
  rainBarrelCalculator,
  rainfallCalculator,
  rcTimeConstantCalculator,
  renovationCostCalculator,
  rentIncreaseCalculator,
  rentToOwnCalculator,
  rentalIncomeCalculator,
  rentersInsuranceCalculator,
  reptileEnclosureCalculator,
  resistorColorCodeCalculator,
  resonantFrequencyCalculator,
  reverseMortgageCalculator,
  riceWaterRatioCalculator,
  rlTimeConstantCalculator,
  roiMarketingCalculator,
  ropeJumpCalorieCalculator,
  rowingPaceCalculator,
  ruleOfThirdsCalculator,
  runningVo2maxCalculator,
  rvFuelCalculator,
  salesRevenueCalculator,
  salesTaxReverseCalculator,
  satScoreCalculator,
  scholarshipCalculator,
  securityDepositCalculator,
  semesterHoursCalculator,
  septicSizeCalculator,
  shiftDifferentialCalculator,
  shippingCostCalculator,
  sickLeaveCalculator,
  sitUpTestCalculator,
  skinTypeCalculator,
  skincareRoutineCalculator,
  slowCookerConversionCalculator,
  smokeMeatTimeCalculator,
  snowLoadCalculator,
  socialMediaSizeCalculator,
  socialSecurityBenefitCalculator,
  sockSizeCalculator,
  solarPanelSizingCalculator,
  songKeyCalculator,
  sourdoughStarterCalculator,
  speakerPlacementCalculator,
  spiceConversionCalculator,
  sportsBettingOddsCalculator,
  sprinklerCoverageCalculator,
  sqFeetToSqMetersConverter,
  stampDutyCalculator,
  stepsToCaloriesCalculator,
  storageCostCalculator,
  streamingBitrateCalculator,
  streamingDataCalculator,
  strengthStandardsCalculator,
  studentBudgetCalculator,
  studentLoanInterestCalculator,
  studentLoanRepaymentCalculator,
  subwooferBoxCalculator,
  sunscreenAmountCalculator,
  swimPaceCalculator,
  tableclothSizeCalculator,
  tbspToMlConverter,
  teacherSalaryCalculator,
  termLifeCostCalculator,
  testScoreCalculator,
  threadCalculator,
  threePhasePowerCalculator,
  tideCalculator,
  tirePressureCalculator,
  trademarkCostCalculator,
  trailDistanceCalculator,
  trailerWeightCalculator,
  transformerTurnsCalculator,
  treeHeightCalculator,
  triathlonTimeCalculator,
  truckPayloadCalculator,
  tspToMlConverter,
  tuitionCostCalculator,
  turkeyCookingTimeCalculator,
  umbrellaInsuranceCalculator,
  unemploymentBenefitCalculator,
  upsSizingCalculator,
  vacancyRateCalculator,
  vehicleLoanPayoffCalculator,
  vehicleTaxCalculator,
  videoFileSizeCalculator,
  videoGameFpsCalculator,
  vinylRpmCalculator,
  visibilityDistanceCalculator,
  watchSizeCalculator,
  waterFlowRateCalculator,
  weightLossTimeCalculator,
  weightedGradeCalculator,
  weightliftingTotalCalculator,
  wellPumpCalculator,
  wheatstoneBridgeCalculator,
  wheelOffsetCalculator,
  windLoadCalculator,
  wineServingCalculator,
  wireAmpacityCalculator,
  workersCompCalculator,
  workingCapitalCalculator,
  wpmCalculator,
  xpCalculator,
  yeastConversionCalculator,
  yogaCalorieCalculator,
  a1cCalculator,
  ageInHoursCalculator,
  ageInMonthsCalculator,
  ageInWeeksCalculator,
  airbnbCalculator,
  allergySeasonCalculator,
  altitudeSicknessCalculator,
  anniversaryCalculator,
  avogadroCalculator,
  babyClothingSizeCalculator,
  babyFeedingScheduleCalculator,
  babyHeightPercentileCalculator,
  babyMilestoneCalculator,
  babyNamePopularityCalculator,
  babySleepScheduleCalculator,
  babyWeightPercentileCalculator,
  bathroomTileCalculator,
  bathtubSizeCalculator,
  bayesTheoremCalculator,
  beehiveCalculator,
  binomialDistributionCalculator,
  biologicalAgeCalculator,
  birthdayCalculator,
  bloodAlcoholTimeCalculator,
  bloodTypeCompatibilityCalculator,
  bloodVolumeCalculator,
  bmiChildrenCalculator,
  boilingPointCalculator,
  booleanAlgebraCalculator,
  breakTimeCalculator,
  breastMilkIntakeCalculator,
  bufferSolutionCalculator,
  cabinetCalculator,
  campingGearCalculator,
  carSeatSizeCalculator,
  carryOnSizeCalculator,
  childDosageCalculator,
  childHeightPredictorCalculator,
  childShoeSizeCalculator,
  childcareCostCalculator,
  chimneyHeightCalculator,
  cholesterolRatioCalculator,
  closetOrganizerCalculator,
  collegeFundCalculator,
  columnCalculator,
  combinationsCalculator,
  companionPlantingCalculator,
  completingSquareCalculator,
  compostRatioCalculator,
  contactLensCalculator,
  contractionTimerCalculator,
  countdownDaysCalculator,
  creatinineCalculator,
  cropRotationCalculator,
  cruiseCostCalculator,
  cubicEquationCalculator,
  currencyExchangeCalculator,
  dateAddSubtractCalculator,
  decimalTimeCalculator,
  derivativeCalculator,
  diaperCostCalculator,
  dilutionRatioCalculator,
  doorSizeCalculator,
  dosageByWeightCalculator,
  downspoutCalculator,
  dripIrrigationCalculator,
  drivewayCalculator,
  drivingTimeCalculator,
  eigenvalueCalculator,
  electrochemistryCalculator,
  empiricalFormulaCalculator,
  enthalpyCalculator,
  entropyCalculator,
  equilibriumConstantCalculator,
  exponentialGrowthCalculator,
  fallRiskCalculator,
  fertilityWindowCalculator,
  flightTimeCalculator,
  flowerBulbCalculator,
  fluidBalanceCalculator,
  footingCalculator,
  formulaMixingCalculator,
  foundationCalculator,
  freezingPointCalculator,
  frenchDrainCalculator,
  fruitTreeYieldCalculator,
  fuelStopCalculator,
  garageDoorSizeCalculator,
  garageFloorEpoxyCalculator,
  gardenBedCostCalculator,
  gardenFenceCalculator,
  gardenWaterCalculator,
  gasLawCombinedCalculator,
  gestationalDiabetesCalculator,
  gibbsFreeEnergyCalculator,
  greenhouseSizeCalculator,
  growLightCalculator,
  growthSpurtCalculator,
  gutterGuardCalculator,
  gutterSizeCalculator,
  harvestDateCalculator,
  hcgLevelCalculator,
  hearingLossCalculator,
  heartDiseaseRiskCalculator,
  hotelCostCalculator,
  hoursCalculator,
  hydroponicNutrientCalculator,
  hyperbolicCalculator,
  integralCalculator,
  internationalSizeCalculator,
  inverseTrigCalculator,
  ivFlowRateCalculator,
  julianDateCalculator,
  kickCountCalculator,
  laplaceTransformCalculator,
  latitudeLongitudeCalculator,
  lawOfCosinesCalculator,
  lawOfSinesCalculator,
  lawnFertilizerCalculator,
  layoverTimeCalculator,
  limitCalculator,
  limitingReagentCalculator,
  logarithmSolverCalculator,
  luggageWeightCalculator,
  mapDistanceCalculator,
  massSpectrometryCalculator,
  maternityLeaveCalculator,
  matrixInverseCalculator,
  meetingTimeCalculator,
  mentalHealthScoreCalculator,
  metabolicAgeCalculator,
  militaryTimeCalculator,
  molalityCalculator,
  molarMassCalculator,
  monthsBetweenDatesCalculator,
  nitrogenCalculator,
  nutritionLabelCalculator,
  osmoticPressureCalculator,
  oxidationNumberCalculator,
  painScaleCalculator,
  partialFractionsCalculator,
  passportExpiryCalculator,
  paternityLeaveCalculator,
  paverBaseCalculator,
  payPeriodCalculator,
  percentCompositionCalculator,
  percentYieldCalculator,
  phAdjustmentCalculator,
  poissonDistributionCalculator,
  pottingSoilCalculator,
  powerPlugCalculator,
  quarterCalculator,
  radioactiveDecayRateCalculator,
  raisedBedSoilCalculator,
  rampCalculator,
  reactionRateCalculator,
  retainingWallBlockCalculator,
  retirementAgeCalculator,
  roadTripPlannerCalculator,
  roofPitchCalculator,
  seedStartingCalculator,
  showerTileCalculator,
  sidingCalculator,
  sleepCycleCalculator,
  soffitCalculator,
  soilAmendmentCalculator,
  solubilityProductCalculator,
  strokeRiskCalculator,
  strollerAgeCalculator,
  syntheticDivisionCalculator,
  systemOfEquationsCalculator,
  taylorSeriesCalculator,
  timeSinceCalculator,
  timeUntilCalculator,
  timeZoneDifferenceCalculator,
  timezoneMeetingCalculator,
  tipAbroadCalculator,
  titrationCalculator,
  toddlerBmiCalculator,
  travelChecklistCalculator,
  travelInsuranceCalculator,
  travelPackingCalculator,
  travelVaccineCalculator,
  treeSpacingCalculator,
  trigCalculator,
  trussCalculator,
  unitCircleCalculator,
  unixTimestampCalculator,
  vaporPressureCalculator,
  vegetableYieldCalculator,
  visaDurationCalculator,
  visionPrescriptionCalculator,
  weedCoverageCalculator,
  weeksBetweenDatesCalculator,
  whatDayWasCalculator,
  windowSizeCalculator,
  workScheduleCalculator,
  workdayCalculator,
  wormCompostingCalculator,
  woundSizeCalculator,
];

export function getCalculatorBySlug(slug: string): CalculatorDefinition | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getRelatedCalculators(calc: CalculatorDefinition): CalculatorDefinition[] {
  return calc.relatedSlugs
    .map((slug) => getCalculatorBySlug(slug))
    .filter((c): c is CalculatorDefinition => c !== undefined);
}

export function getCalculatorsByCategory(categorySlug: string): CalculatorDefinition[] {
  return calculators.filter((c) => c.categorySlug === categorySlug);
}
