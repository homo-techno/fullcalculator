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
import { absenteeismRateCalculator } from "./absenteeism-rate";
import { acresToHectaresConverter } from "./acres-to-hectares";
import { activationEnergyCalculator } from "./activation-energy";
import { actualYieldCalculator } from "./actual-yield";
import { ageOnPlanetsCalculator } from "./age-on-planets";
import { aggregateCalculator } from "./aggregate-calculator";
import { alleleFrequencyCalculator } from "./allele-frequency";
import { annealingTemperatureCalculator } from "./annealing-temperature";
import { applianceEnergyCalculator } from "./appliance-energy";
import { babyGenderCalculator } from "./baby-gender";
import { backfillCalculator } from "./backfill-calculator";
import { balusterSpacingCalculator } from "./baluster-spacing";
import { beamDeflectionCalculator } from "./beam-deflection";
import { beerLambertBioCalculator } from "./beer-lambert-bio";
import { betaCalculator } from "./beta-calculator";
import { billableHoursCalculator } from "./billable-hours";
import { binaryToDecimalConverter } from "./binary-to-decimal";
import { birthControlCalculator } from "./birth-control";
import { blackScholesCalculator } from "./black-scholes";
import { boardFootCalculator } from "./board-foot-calculator";
import { bondOrderCalculator } from "./bond-order";
import { breastPumpTimeCalculator } from "./breast-pump-time";
import { btuToWattsConverter } from "./btu-to-watts";
import { burndownChartCalculator } from "./burndown-chart";
import { calorimetryCalculator } from "./calorimetry";
import { capacityPlanningCalculator } from "./capacity-planning";
import { capmCalculator } from "./capm-calculator";
import { carryingCapacityCalculator } from "./carrying-capacity";
import { catFoodCalculator } from "./cat-food-calculator";
import { cellDilutionCalculator } from "./cell-dilution";
import { centsToDollarsConverter } from "./cents-to-dollars";
import { chineseGenderCalculator } from "./chinese-gender";
import { circleSkirtCalculator } from "./circle-skirt";
import { commuteCarbonCalculator } from "./commute-carbon";
import { compatibilityScoreCalculator } from "./compatibility-score";
import { compostingRateCalculator } from "./composting-rate";
import { compoundGrowthCalculator } from "./compound-growth";
import { concentrationCalculator } from "./concentration-calculator";
import { concreteMixDesignCalculator } from "./concrete-mix-design";
import { crochetBlanketCalculator } from "./crochet-blanket";
import { crossStitchCalculator } from "./cross-stitch";
import { crownMoldingAngleCalculator } from "./crown-molding-angle";
import { cubicFeetToGallonsConverter } from "./cubic-feet-to-gallons";
import { debtToEquityCalculator } from "./debt-to-equity";
import { decimalToBinaryConverter } from "./decimal-to-binary";
import { degreesToRadiansConverter } from "./degrees-to-radians";
import { dihybridCrossCalculator } from "./dihybrid-cross";
import { dividendDiscountCalculator } from "./dividend-discount";
import { dnaConcentrationCalculator } from "./dna-concentration";
import { dnaMolecularWeightCalculator } from "./dna-molecular-weight";
import { dogAgeChartCalculator } from "./dog-age-chart";
import { dogChocolateToxicityCalculator } from "./dog-chocolate-toxicity";
import { dogCrateSizeCalculator } from "./dog-crate-size";
import { dogHarnessSizeCalculator } from "./dog-harness-size";
import { dogHeatCycleCalculator } from "./dog-heat-cycle";
import { dogHumanYearsCalculator } from "./dog-human-years";
import { dogLifeExpectancyCalculator } from "./dog-life-expectancy";
import { dogMedicineDosageCalculator } from "./dog-medicine-dosage";
import { dogRawFoodCalculator } from "./dog-raw-food";
import { dogWalkingCalorieCalculator } from "./dog-walking-calorie";
import { dogWaterIntakeCalculator } from "./dog-water-intake";
import { dollarCostAveragingCalculator } from "./dollar-cost-averaging";
import { drakeEquationCalculator } from "./drake-equation";
import { dropsToMlConverter } from "./drops-to-ml";
import { eggFreezingCalculator } from "./egg-freezing";
import { electricVsGasCalculator } from "./electric-vs-gas";
import { electronConfigurationCalculator } from "./electron-configuration";
import { emailTimeCalculator } from "./email-time";
import { embroideryHoopCalculator } from "./embroidery-hoop";
import { emiCalculator } from "./emi-calculator";
import { endometriosisRiskCalculator } from "./endometriosis-risk";
import { energyAuditCalculator } from "./energy-audit";
import { enterpriseValueCalculator } from "./enterprise-value";
import { enzymeActivityCalculator } from "./enzyme-activity";
import { epfCalculator } from "./epf-calculator";
import { epsCalculator } from "./eps-calculator";
import { excavationVolumeCalculator } from "./excavation-volume";
import { fdCalculator } from "./fd-calculator";
import { flightCarbonCalculator } from "./flight-carbon";
import { foodWasteCalculator } from "./food-waste";
import { ftLbsToNmConverter } from "./ft-lbs-to-nm";
import { gallonsToPoundsConverter } from "./gallons-to-pounds";
import { generationTimeCalculator } from "./generation-time";
import { goldPriceCalculator } from "./gold-price";
import { gramsToCaloriesConverter } from "./grams-to-calories";
import { gramsToMolesCalculator } from "./grams-to-moles";
import { gratuityCalculator } from "./gratuity-calculator";
import { greywaterReuseCalculator } from "./greywater-reuse";
import { gstCalculator } from "./gst-calculator";
import { halfSquareTriangleCalculator } from "./half-square-triangle";
import { handrailHeightCalculator } from "./handrail-height";
import { heatOfCombustionCalculator } from "./heat-of-combustion";
import { hemocytometerCalculator } from "./hemocytometer";
import { hexToRgbConverter } from "./hex-to-rgb";
import { hexagonQuiltCalculator } from "./hexagon-quilt";
import { hiringCostCalculator } from "./hiring-cost";
import { householdCarbonCalculator } from "./household-carbon";
import { hraCalculator } from "./hra-calculator";
import { idealGasConstantCalculator } from "./ideal-gas-constant";
import { implantationCalculator } from "./implantation-calculator";
import { incomeTaxIndiaCalculator } from "./income-tax-india";
import { insulationSavingsCalculator } from "./insulation-savings";
import { ivfSuccessCalculator } from "./ivf-success";
import { knittingPatternCalculator } from "./knitting-pattern";
import { kwToHpConverter } from "./kw-to-hp";
import { latticeEnergyCalculator } from "./lattice-energy";
import { lbsToNewtonsConverter } from "./lbs-to-newtons";
import { ledSavingsCalculator } from "./led-savings";
import { loadBearingWallCalculator } from "./load-bearing-wall";
import { marginCallCalculator } from "./margin-call";
import { marketCapCalculator } from "./market-cap";
import { mbpsToGbpsConverter } from "./mbps-to-gbps";
import { mcgToMgConverter } from "./mcg-to-mg";
import { meatFootprintCalculator } from "./meat-footprint";
import { menopauseAgeCalculator } from "./menopause-age";
import { metalRoofingCalculator } from "./metal-roofing";
import { mgToMlConverter } from "./mg-to-ml";
import { michaelisMentenCalculator } from "./michaelis-menten";
import { molarRatioCalculator } from "./molar-ratio";
import { moleFractionCalculator } from "./mole-fraction";
import { molecularGeometryCalculator } from "./molecular-geometry";
import { molesToGramsCalculator } from "./moles-to-grams";
import { nameNumerologyCalculator } from "./name-numerology";
import { nmToFtLbsConverter } from "./nm-to-ft-lbs";
import { normalityCalculator } from "./normality-calculator";
import { npsCalculator } from "./nps-calculator";
import { octalToDecimalConverter } from "./octal-to-decimal";
import { optionsProfitCalculator } from "./options-profit";
import { paperSavingsCalculator } from "./paper-savings";
import { partialPressureCalculator } from "./partial-pressure";
import { pcosRiskCalculator } from "./pcos-risk";
import { pcrPrimerCalculator } from "./pcr-primer";
import { peRatioCalculator } from "./pe-ratio";
import { periodCalculator } from "./period-calculator";
import { photosynthesisRateCalculator } from "./photosynthesis-rate";
import { pixelsToInchesConverter } from "./pixels-to-inches";
import { pizzaSizeCalculator } from "./pizza-size";
import { plasticFootprintCalculator } from "./plastic-footprint";
import { pleatedSkirtCalculator } from "./pleated-skirt";
import { pomodoroTimerCalculator } from "./pomodoro-timer";
import { populationGrowthCalculator } from "./population-growth";
import { portfolioReturnCalculator } from "./portfolio-return";
import { postpartumRecoveryCalculator } from "./postpartum-recovery";
import { ppfCalculator } from "./ppf-calculator";
import { ppmCalculator } from "./ppm-calculator";
import { pregnancyBmiCalculator } from "./pregnancy-bmi";
import { pregnancyCalorieCalculator } from "./pregnancy-calorie";
import { priceToBookCalculator } from "./price-to-book";
import { projectTimelineCalculator } from "./project-timeline";
import { proteinMolecularWeightCalculator } from "./protein-molecular-weight";
import { punnettSquareCalculator } from "./punnett-square";
import { puppyFeedingCalculator } from "./puppy-feeding";
import { putCallParityCalculator } from "./put-call-parity";
import { pxToEmConverter } from "./px-to-em";
import { quiltBindingCalculator } from "./quilt-binding";
import { radiansToDegreesConverter } from "./radians-to-degrees";
import { rainwaterHarvestCalculator } from "./rainwater-harvest";
import { randomNameCalculator } from "./random-name";
import { rateConstantCalculator } from "./rate-constant";
import { rdCalculator } from "./rd-calculator";
import { recyclingSavingsCalculator } from "./recycling-savings";
import { resourceAllocationCalculator } from "./resource-allocation";
import { rgbToHexConverter } from "./rgb-to-hex";
import { riskRewardCalculator } from "./risk-reward";
import { serialDilutionCalculator } from "./serial-dilution";
import { shannonDiversityCalculator } from "./shannon-diversity";
import { sharpeRatioCalculator } from "./sharpe-ratio";
import { shingleCalculator } from "./shingle-calculator";
import { slopeGradeCalculator } from "./slope-grade";
import { soilCompactionCalculator } from "./soil-compaction";
import { solarRoiCalculator } from "./solar-roi";
import { speciesRichnessCalculator } from "./species-richness";
import { specificHeatCapacityCalculator } from "./specific-heat-capacity";
import { sprintVelocityCalculator } from "./sprint-velocity";
import { squareYardsToSquareFeetConverter } from "./square-yards-to-square-feet";
import { stairStringerCalculator } from "./stair-stringer";
import { stampDutyIndiaCalculator } from "./stamp-duty-india";
import { stockSplitCalculator } from "./stock-split";
import { storyPointsCalculator } from "./story-points";
import { sukanyaSamriddhiCalculator } from "./sukanya-samriddhi";
import { tdsCalculator } from "./tds-calculator";
import { theoreticalYieldCalculator } from "./theoretical-yield";
import { timeTrackingCalculator } from "./time-tracking";
import { tipSplitCalculator } from "./tip-split";
import { trainingRoiCalculator } from "./training-roi";
import { treePlantingCalculator } from "./tree-planting";
import { turnoverCostCalculator } from "./turnover-cost";
import { twinProbabilityCalculator } from "./twin-probability";
import { utilizationRateCalculator } from "./utilization-rate";
import { vatCalculator } from "./vat-calculator";
import { waccCalculator } from "./wacc-calculator";
import { waterFootprintCalculator } from "./water-footprint";
import { wattsToBtuConverter } from "./watts-to-btu";
import { windTurbineOutputCalculator } from "./wind-turbine-output";
import { yarnWeightCalculator } from "./yarn-weight";
import { test } from "./_t2";
import { abTestSignificanceCalculator } from "./ab-test-significance";
import { abgInterpreterCalculator } from "./abg-interpreter";
import { adFrequencyCalculator } from "./ad-frequency";
import { airHandlerSizeCalculator } from "./air-handler-size";
import { airflowCfmCalculator } from "./airflow-cfm";
import { alabamaPaycheckCalculator } from "./alabama-paycheck";
import { angularDiameterCalculator } from "./angular-diameter";
import { anniversaryGiftCalculator } from "./anniversary-gift";
import { apacheScoreCalculator } from "./apache-score";
import { arizonaPaycheckCalculator } from "./arizona-paycheck";
import { babyShowerBudgetCalculator } from "./baby-shower-budget";
import { backflowPreventerCalculator } from "./backflow-preventer";
import { bandsawBladeCalculator } from "./bandsaw-blade";
import { bishopScoreCalculator } from "./bishop-score";
import { bitcoinProfitCalculator } from "./bitcoin-profit";
import { blogTrafficCalculator } from "./blog-traffic";
import { boardFootageCalculator } from "./board-footage";
import { boilerSizeCalculator } from "./boiler-size";
import { bounceRateCalculator } from "./bounce-rate";
import { boxPlotCalculator } from "./box-plot";
import { bradenScaleCalculator } from "./braden-scale";
import { brandAwarenessCalculator } from "./brand-awareness";
import { bridesmaidCostCalculator } from "./bridesmaid-cost";
import { bunCreatinineCalculator } from "./bun-creatinine";
import { cabinetDoorSizeCalculator } from "./cabinet-door-size";
import { californiaPaycheckCalculator } from "./california-paycheck";
import { cateringQuantityCalculator } from "./catering-quantity";
import { clampPressureCalculator } from "./clamp-pressure";
import { coefficientVariationCalculator } from "./coefficient-variation";
import { coloradoPaycheckCalculator } from "./colorado-paycheck";
import { compoundTradingCalculator } from "./compound-trading";
import { condensateDrainCalculator } from "./condensate-drain";
import { contentRoiCalculator } from "./content-roi";
import { coolingLoadCalculator } from "./cooling-load";
import { correctedQtCalculator } from "./corrected-qt";
import { cosmicDistanceCalculator } from "./cosmic-distance";
import { cpcCalculator } from "./cpc-calculator";
import { cpmCalculator } from "./cpm-calculator";
import { creatinineClearanceCgCalculator } from "./creatinine-clearance-cg";
import { cronbachAlphaCalculator } from "./cronbach-alpha";
import { cryptoMiningProfitCalculator } from "./crypto-mining-profit";
import { cryptoTaxCalculator } from "./crypto-tax";
import { ctrCalculator } from "./ctr-calculator";
import { customerAcquisitionCostCalculator } from "./customer-acquisition-cost";
import { cuttingDiagramCalculator } from "./cutting-diagram";
import { dadoJointCalculator } from "./dado-joint";
import { defiYieldCalculator } from "./defi-yield";
import { dehumidifierSizeCalculator } from "./dehumidifier-size";
import { deltaVCalculator } from "./delta-v";
import { domainAuthorityCalculator } from "./domain-authority";
import { dovetailJointCalculator } from "./dovetail-joint";
import { dowelSpacingCalculator } from "./dowel-spacing";
import { drainPipeSlopeCalculator } from "./drain-pipe-slope";
import { drawdownCalculator } from "./drawdown-calculator";
import { drawerSlideCalculator } from "./drawer-slide";
import { drillBitSizeCalculator } from "./drill-bit-size";
import { ductSizeCalculator } from "./duct-size";
import { effectSizeCalculator } from "./effect-size";
import { egfrCalculator } from "./egfr-calculator";
import { emailOpenRateCalculator } from "./email-open-rate";
import { engagementRateCalculator } from "./engagement-rate";
import { engagementRingBudgetCalculator } from "./engagement-ring-budget";
import { eventParkingCalculator } from "./event-parking";
import { eventRentalCalculator } from "./event-rental";
import { eventSpaceCapacityCalculator } from "./event-space-capacity";
import { expansionTankCalculator } from "./expansion-tank";
import { expectedValueTradeCalculator } from "./expected-value-trade";
import { fenaCalculator } from "./fena-calculator";
import { fibonacciRetracementCalculator } from "./fibonacci-retracement";
import { fishersExactCalculator } from "./fishers-exact";
import { floridaPaycheckCalculator } from "./florida-paycheck";
import { fluidMaintenanceCalculator } from "./fluid-maintenance";
import { framinghamScoreCalculator } from "./framingham-score";
import { futuresPnlCalculator } from "./futures-pnl";
import { gasFeeCalculator } from "./gas-fee-calculator";
import { gasPipeSizeCalculator } from "./gas-pipe-size";
import { georgiaPaycheckCalculator } from "./georgia-paycheck";
import { glycolMixtureCalculator } from "./glycol-mixture";
import { graduationPartyCalculator } from "./graduation-party";
import { groomsmenCostCalculator } from "./groomsmen-cost";
import { habitableZoneCalculator } from "./habitable-zone";
import { harrisBenedictCalculator } from "./harris-benedict";
import { hashRateCalculator } from "./hash-rate";
import { heatLossCalculator } from "./heat-loss";
import { heatPumpCopCalculator } from "./heat-pump-cop";
import { honeymoonBudgetCalculator } from "./honeymoon-budget";
import { humidifierSizeCalculator } from "./humidifier-size";
import { illinoisPaycheckCalculator } from "./illinois-paycheck";
import { impermanentLossCalculator } from "./impermanent-loss";
import { indianaPaycheckCalculator } from "./indiana-paycheck";
import { influencerRateCalculator } from "./influencer-rate";
import { interquartileRangeCalculator } from "./interquartile-range";
import { kellyCriterionCalculator } from "./kelly-criterion";
import { keplerThirdLawCalculator } from "./kepler-third-law";
import { keywordDensityCalculator } from "./keyword-density";
import { kruskalWallisCalculator } from "./kruskal-wallis";
import { latheSpeedCalculator } from "./lathe-speed";
import { leadScoringCalculator } from "./lead-scoring";
import { leverageCalculator } from "./leverage-calculator";
import { lightTravelCalculator } from "./light-travel";
import { liquidityPoolCalculator } from "./liquidity-pool";
import { lotSizeCalculator } from "./lot-size-calculator";
import { louisianaPaycheckCalculator } from "./louisiana-paycheck";
import { magnitudeDistanceCalculator } from "./magnitude-distance";
import { mannWhitneyCalculator } from "./mann-whitney";
import { marginOfErrorCalculator } from "./margin-of-error";
import { marylandPaycheckCalculator } from "./maryland-paycheck";
import { massachusettsPaycheckCalculator } from "./massachusetts-paycheck";
import { meldScoreCalculator } from "./meld-score";
import { meteorShowerCalculator } from "./meteor-shower";
import { michiganPaycheckCalculator } from "./michigan-paycheck";
import { minnesotaPaycheckCalculator } from "./minnesota-paycheck";
import { missouriPaycheckCalculator } from "./missouri-paycheck";
import { miterAngleCalculator } from "./miter-angle";
import { mmseScoreCalculator } from "./mmse-score";
import { morseFallScaleCalculator } from "./morse-fall-scale";
import { movingAverageCalculator } from "./moving-average";
import { newJerseyPaycheckCalculator } from "./new-jersey-paycheck";
import { newYorkPaycheckCalculator } from "./new-york-paycheck";
import { newsScoreCalculator } from "./news-score";
import { northCarolinaPaycheckCalculator } from "./north-carolina-paycheck";
import { nortonScaleCalculator } from "./norton-scale";
import { numberNeededTreatCalculator } from "./number-needed-treat";
import { nutritionalScreeningCalculator } from "./nutritional-screening";
import { oddsRatioCalculator } from "./odds-ratio";
import { ohioPaycheckCalculator } from "./ohio-paycheck";
import { oneWayAnovaCalculator } from "./one-way-anova";
import { opioidConversionCalculator } from "./opioid-conversion";
import { pageLoadImpactCalculator } from "./page-load-impact";
import { pairedTTestCalculator } from "./paired-t-test";
import { parklandFormulaCalculator } from "./parkland-formula";
import { parsecConverterCalculator } from "./parsec-converter";
import { partyBalloonCalculator } from "./party-balloon";
import { pediatricGcsCalculator } from "./pediatric-gcs";
import { pennsylvaniaPaycheckCalculator } from "./pennsylvania-paycheck";
import { percentileRankCalculator } from "./percentile-rank";
import { pipCalculator } from "./pip-calculator";
import { pipeSizingCalculator } from "./pipe-sizing";
import { pivotPointCalculator } from "./pivot-point";
import { planetSurfaceGravityCalculator } from "./planet-surface-gravity";
import { podcastDownloadCalculator } from "./podcast-download";
import { positionSizeCalculator } from "./position-size";
import { powerAnalysisCalculator } from "./power-analysis";
import { ppvNpvCalculator } from "./ppv-npv";
import { pressureReliefValveCalculator } from "./pressure-relief-valve";
import { profitFactorCalculator } from "./profit-factor";
import { qsofaScoreCalculator } from "./qsofa-score";
import { radiatorSizeCalculator } from "./radiator-size";
import { receptionTimelineCalculator } from "./reception-timeline";
import { redShiftCalculator } from "./red-shift";
import { refrigerantChargeCalculator } from "./refrigerant-charge";
import { rehearsalDinnerCalculator } from "./rehearsal-dinner";
import { relativeRiskCalculator } from "./relative-risk";
import { retentionRateCalculator } from "./retention-rate";
import { revisedTraumaCalculator } from "./revised-trauma";
import { roasCalculator } from "./roas-calculator";
import { rocheLimitCalculator } from "./roche-limit";
import { rocketThrustCalculator } from "./rocket-thrust";
import { routerBitSpeedCalculator } from "./router-bit-speed";
import { rsiCalculator } from "./rsi-calculator";
import { salesFunnelCalculator } from "./sales-funnel";
import { sandpaperGritCalculator } from "./sandpaper-grit";
import { satellitePeriodCalculator } from "./satellite-period";
import { satelliteVelocityCalculator } from "./satellite-velocity";
import { schwarzschildRadiusCalculator } from "./schwarzschild-radius";
import { sensitivitySpecificityCalculator } from "./sensitivity-specificity";
import { seoRoiCalculator } from "./seo-roi";
import { sewerPipeCapacityCalculator } from "./sewer-pipe-capacity";
import { shelfSagCalculator } from "./shelf-sag";
import { skewnessKurtosisCalculator } from "./skewness-kurtosis";
import { socialMediaRoiCalculator } from "./social-media-roi";
import { southCarolinaPaycheckCalculator } from "./south-carolina-paycheck";
import { spaceTravelTimeCalculator } from "./space-travel-time";
import { spearmanCorrelationCalculator } from "./spearman-correlation";
import { stakingRewardsCalculator } from "./staking-rewards";
import { starLuminosityCalculator } from "./star-luminosity";
import { staticPressureCalculator } from "./static-pressure";
import { stellarClassificationCalculator } from "./stellar-classification";
import { stellarParallaxCalculator } from "./stellar-parallax";
import { stemLeafPlotCalculator } from "./stem-leaf-plot";
import { subscriberValueCalculator } from "./subscriber-value";
import { survivalRateCalculator } from "./survival-rate";
import { synodicPeriodCalculator } from "./synodic-period";
import { tableLegTaperCalculator } from "./table-leg-taper";
import { telescopeApertureCalculator } from "./telescope-aperture";
import { telescopeFovCalculator } from "./telescope-fov";
import { telescopeMagnificationCalculator } from "./telescope-magnification";
import { tennesseePaycheckCalculator } from "./tennessee-paycheck";
import { tenonSizeCalculator } from "./tenon-size";
import { texasPaycheckCalculator } from "./texas-paycheck";
import { thermalResistanceCalculator } from "./thermal-resistance";
import { tidalForceCalculator } from "./tidal-force";
import { timiScoreCalculator } from "./timi-score";
import { tokenVestingCalculator } from "./token-vesting";
import { twoSampleTTestCalculator } from "./two-sample-t-test";
import { typeIIIErrorCalculator } from "./type-i-ii-error";
import { veneerCoverageCalculator } from "./veneer-coverage";
import { ventPipeSizeCalculator } from "./vent-pipe-size";
import { viralCoefficientCalculator } from "./viral-coefficient";
import { virginiaPaycheckCalculator } from "./virginia-paycheck";
import { washingtonPaycheckCalculator } from "./washington-paycheck";
import { waterHeaterSizeCalculator } from "./water-heater-size";
import { waterSupplyDemandCalculator } from "./water-supply-demand";
import { weddingCakeSizeCalculator } from "./wedding-cake-size";
import { weddingDjTimelineCalculator } from "./wedding-dj-timeline";
import { weddingDrinkCalculator } from "./wedding-drink";
import { weddingFavorCalculator } from "./wedding-favor";
import { weddingFlowerCalculator } from "./wedding-flower";
import { weddingGuestListCalculator } from "./wedding-guest-list";
import { weddingInvitationCalculator } from "./wedding-invitation";
import { weddingPhotoTimelineCalculator } from "./wedding-photo-timeline";
import { weddingRegistryCalculator } from "./wedding-registry";
import { weddingSeatingCalculator } from "./wedding-seating";
import { weddingToastLengthCalculator } from "./wedding-toast-length";
import { wellsScoreCalculator } from "./wells-score";
import { wilcoxonTestCalculator } from "./wilcoxon-test";
import { winRateCalculator } from "./win-rate";
import { wisconsinPaycheckCalculator } from "./wisconsin-paycheck";
import { woodBendingCalculator } from "./wood-bending";
import { woodDensityCalculator } from "./wood-density";
import { woodExpansionCalculator } from "./wood-expansion";
import { woodMoistureCalculator } from "./wood-moisture";
import { woodScrewPilotCalculator } from "./wood-screw-pilot";
import { woodShrinkageCalculator } from "./wood-shrinkage";
import { woodStainCoverageCalculator } from "./wood-stain-coverage";
import { arcLengthCalculator } from "./arc-length";
import { armMortgageCalculator } from "./arm-mortgage";
import { baseballEraCalculator } from "./baseball-era";
import { baseballObpCalculator } from "./baseball-obp";
import { baseballOpsCalculator } from "./baseball-ops";
import { baseballSluggingCalculator } from "./baseball-slugging";
import { basketballPaceCalculator } from "./basketball-pace";
import { basketballPerCalculator } from "./basketball-per";
import { basketballTrueShootingCalculator } from "./basketball-true-shooting";
import { birthFlowerCalculator } from "./birth-flower";
import { birthstoneCalculator } from "./birthstone-calculator";
import { bodyRecompCalculator } from "./body-recomp";
import { bridgeLoanCalculator } from "./bridge-loan";
import { bulkingCalculator } from "./bulking-calculator";
import { caffeineHalfLifeCalculator } from "./caffeine-half-life";
import { cashOutRefinanceCalculator } from "./cash-out-refinance";
import { catAgeHumanCalculator } from "./cat-age-human";
import { celebrityAgeCalculator } from "./celebrity-age";
import { chordLengthCalculator } from "./chord-length";
import { circleEquationCalculator } from "./circle-equation";
import { cmToFeetConverter } from "./cm-to-feet";
import { cmToMmConverter } from "./cm-to-mm";
import { constructionLoanCalculator } from "./construction-loan";
import { cubeVolumeCalculator } from "./cube-volume";
import { cupsToPintsConverter } from "./cups-to-pints";
import { cupsToTablespoonsConverter } from "./cups-to-tablespoons";
import { distanceFormulaCalculator } from "./distance-formula";
import { dndCharacterCalculator } from "./dnd-character";
import { dogAgeHumanCalculator } from "./dog-age-human";
import { ellipseAreaCalculator } from "./ellipse-area";
import { equationOfLineCalculator } from "./equation-of-line";
import { feetToCmConverter } from "./feet-to-cm";
import { footballFantasyPointsCalculator } from "./football-fantasy-points";
import { footballPasserRatingCalculator } from "./football-passer-rating";
import { frustumVolumeCalculator } from "./frustum-volume";
import { gallonsToQuartsConverter } from "./gallons-to-quarts";
import { gasTripSplitCalculator } from "./gas-trip-split";
import { generationCalculator } from "./generation-calculator";
import { gramsToKgConverter } from "./grams-to-kg";
import { gramsToMgConverter } from "./grams-to-mg";
import { hemisphereVolumeCalculator } from "./hemisphere-volume";
import { heronFormulaCalculator } from "./heron-formula";
import { hexagonAreaCalculator } from "./hexagon-area";
import { hockeyCorsiCalculator } from "./hockey-corsi";
import { hockeySavePctCalculator } from "./hockey-save-pct";
import { hogwartsHouseCalculator } from "./hogwarts-house";
import { homeEquityLoanCalculator } from "./home-equity-loan";
import { howOldAmICalculator } from "./how-old-am-i";
import { inchesToMetersConverter } from "./inches-to-meters";
import { inscribedAngleCalculator } from "./inscribed-angle";
import { interestOnlyMortgageCalculator } from "./interest-only-mortgage";
import { jumboLoanCalculator } from "./jumbo-loan";
import { kgToGramsConverter } from "./kg-to-grams";
import { landLoanCalculator } from "./land-loan";
import { litersToOuncesConverter } from "./liters-to-ounces";
import { metersToInchesConverter } from "./meters-to-inches";
import { metersToMilesConverter } from "./meters-to-miles";
import { metersToYardsConverter } from "./meters-to-yards";
import { mgToGramsConverter } from "./mg-to-grams";
import { milesToMetersConverter } from "./miles-to-meters";
import { minecraftCraftingCalculator } from "./minecraft-crafting";
import { mlToOzConverter } from "./ml-to-oz";
import { mmToCmConverter } from "./mm-to-cm";
import { octagonAreaCalculator } from "./octagon-area";
import { ouncesToLitersConverter } from "./ounces-to-liters";
import { ozToMlConverter } from "./oz-to-ml";
import { parabolaCalculator } from "./parabola-calculator";
import { pentagonAreaCalculator } from "./pentagon-area";
import { pintsToCupsConverter } from "./pints-to-cups";
import { pyramidVolumeCalculator } from "./pyramid-volume";
import { quartsToGallonsConverter } from "./quarts-to-gallons";
import { rectangleAreaCalculator } from "./rectangle-area";
import { rectangularPrismCalculator } from "./rectangular-prism";
import { regularPolygonCalculator } from "./regular-polygon";
import { rhombusAreaCalculator } from "./rhombus-area";
import { secondMortgageCalculator } from "./second-mortgage";
import { sectorAreaCalculator } from "./sector-area";
import { soccerExpectedGoalsCalculator } from "./soccer-expected-goals";
import { soccerPassCompletionCalculator } from "./soccer-pass-completion";
import { spiritAnimalCalculator } from "./spirit-animal";
import { tbspToTspConverter } from "./tbsp-to-tsp";
import { tennisFirstServeCalculator } from "./tennis-first-serve";
import { tomatoYieldCalculator } from "./tomato-yield";
import { torusVolumeCalculator } from "./torus-volume";
import { triangleInequalityCalculator } from "./triangle-inequality";
import { usdaLoanCalculator } from "./usda-loan";
import { yardsMetersConverter } from "./yards-meters-converter";
import { exchange1031Calculator } from "./1031-exchange";
import { freelancerTaxCalculator } from "./1099-tax";
import { fifteenVsThirtyMortgageCalculator } from "./15-vs-30-mortgage";
import { fourOhOneKLoanCalculator } from "./401k-loan";
import { plan529TaxBenefitCalculator } from "./529-tax-benefit";
import { acresToSqMeters } from "./acres-to-sq-meters";
import { airFryerConverterCalculator } from "./air-fryer-converter";
import { airbnbIncomeCalculator } from "./airbnb-income";
import { alabamaSalesTaxCalculator } from "./alabama-sales-tax";
import { amtCalculator } from "./amt-calculator";
import { anaerobicThresholdCalculator } from "./anaerobic-threshold";
import { ankleCircumferenceCalculator } from "./ankle-circumference";
import { apiRateLimitCalculator } from "./api-rate-limit";
import { appraisalValueCalculator } from "./appraisal-value";
import { aquariumFilterCalculator } from "./aquarium-filter";
import { aquariumHeaterCalculator } from "./aquarium-heater";
import { aquariumLightCalculator } from "./aquarium-light";
import { arizonaSalesTaxCalculator } from "./arizona-sales-tax";
import { atmToPascal } from "./atm-to-pascal";
import { autoRefinanceCalculator } from "./auto-refinance";
import { babyNameMatchCalculator } from "./baby-name-match";
import { backdoorRothCalculator } from "./backdoor-roth";
import { backupSizeCalculator } from "./backup-size";
import { balanceTransferCalculator } from "./balance-transfer";
import { base64SizeCalculator } from "./base64-size";
import { bbqCookingTimeCalculator } from "./bbq-cooking-time";
import { berryBushSpacingCalculator } from "./berry-bush-spacing";
import { bingeWatchTimeCalculator } from "./binge-watch-time";
import { birdCageCalculator } from "./bird-cage-calculator";
import { boatLoanCalculator } from "./boat-loan";
import { bodyFatNavyCalculator } from "./body-fat-navy";
import { bodyFatSkinfoldCalculator } from "./body-fat-skinfold";
import { bodySymmetryCalculator } from "./body-symmetry";
import { bookReadingGoalCalculator } from "./book-reading-goal";
import { breadHydrationCalculator } from "./bread-hydration";
import { bucketListCalculator } from "./bucket-list";
import { buildingCostPerSqftCalculator } from "./building-cost-per-sqft";
import { bulbPlantingDepthCalculator } from "./bulb-planting-depth";
import { butterToOilCalculator } from "./butter-to-oil";
import { cakeServingCalculator } from "./cake-serving";
import { californiaSalesTaxCalculator } from "./california-sales-tax";
import { calorieBurnActivityCalculator } from "./calorie-burn-activity";
import { caloriesToJoules } from "./calories-to-joules";
import { candyMakingCalculator } from "./candy-making";
import { carbonOffsetCostCalculator } from "./carbon-offset-cost";
import { carbonTreeCalculator } from "./carbon-tree";
import { catCarrierSizeCalculator } from "./cat-carrier-size";
import { catIndoorSpaceCalculator } from "./cat-indoor-space";
import { catLitterBoxCalculator } from "./cat-litter-box";
import { catTreeSizeCalculator } from "./cat-tree-size";
import { catWaterIntakeCalculator } from "./cat-water-intake";
import { celsiusKelvinConverter } from "./celsius-kelvin-converter";
import { charitableDeductionCalculator } from "./charitable-deduction";
import { cheeseServingCalculator } from "./cheese-serving";
import { chickenCookingTimeCalculator } from "./chicken-cooking-time";
import { chickenFeedCalculator } from "./chicken-feed";
import { cidrCalculator } from "./cidr-calculator";
import { cloudCostCalculator } from "./cloud-cost";
import { codeReviewTimeCalculator } from "./code-review-time";
import { coffeeBrewingCalculator } from "./coffee-brewing";
import { colorDepthCalculator } from "./color-depth";
import { coloradoSalesTaxCalculator } from "./colorado-sales-tax";
import { commuteCostCalculator } from "./commute-cost";
import { compostBinSizeCalculator } from "./compost-bin-size";
import { condoFeeCalculator } from "./condo-fee";
import { consolidationLoanCalculator } from "./consolidation-loan";
import { containerResourcesCalculator } from "./container-resources";
import { cookieBatchCalculator } from "./cookie-batch";
import { costPerSquareFootCalculator } from "./cost-per-square-foot";
import { cpuBenchmarkCalculator } from "./cpu-benchmark";
import { creatineLoadingCalculator } from "./creatine-loading";
import { creditCardPayoffCalculator } from "./credit-card-payoff";
import { cryptoGainsTaxCalculator } from "./crypto-gains-tax";
import { cubicInchesToLiters } from "./cubic-inches-to-liters";
import { cubicMetersToGallons } from "./cubic-meters-to-gallons";
import { cuttingCalculator } from "./cutting-calculator";
import { databaseSizeCalculator } from "./database-size";
import { deepFryerOilCalculator } from "./deep-fryer-oil";
import { dependentTaxCreditCalculator } from "./dependent-tax-credit";
import { dogBootSizeCalculator } from "./dog-boot-size";
import { dogCollarSizeCalculator } from "./dog-collar-size";
import { dogKennelSizeCalculator } from "./dog-kennel-size";
import { dogSweaterSizeCalculator } from "./dog-sweater-size";
import { dogYardSizeCalculator } from "./dog-yard-size";
import { dotsCalculator } from "./dots-calculator";
import { dripIrrigationLayoutCalculator } from "./drip-irrigation-layout";
import { educationTaxCreditCalculator } from "./education-tax-credit";
import { eggBoilingCalculator } from "./egg-boiling";
import { employerPayrollCostCalculator } from "./employer-payroll-cost";
import { equipmentLoanCalculator } from "./equipment-loan";
import { escrowCalculator } from "./escrow-calculator";
import { fahrenheitToKelvin } from "./fahrenheit-to-kelvin";
import { fatFreeMassIndexCalculator } from "./fat-free-mass-index";
import { ferretCageCalculator } from "./ferret-cage";
import { fishTankStockingCalculator } from "./fish-tank-stocking";
import { floridaSalesTaxCalculator } from "./florida-sales-tax";
import { flourConverterCalculator } from "./flour-converter";
import { flowerBedCalculator } from "./flower-bed";
import { frostDateCalculator } from "./frost-date";
import { fruitServingCalculator } from "./fruit-serving";
import { fsaSavingsCalculator } from "./fsa-savings";
import { functionPointCalculator } from "./function-point";
import { functionalThresholdCalculator } from "./functional-threshold";
import { gallonsToCubicMeters } from "./gallons-to-cubic-meters";
import { gardenPathCalculator } from "./garden-path";
import { gardenRowSpacingCalculator } from "./garden-row-spacing";
import { gardenSunlightCalculator } from "./garden-sunlight";
import { georgiaSalesTaxCalculator } from "./georgia-sales-tax";
import { glycemicLoadCalculator } from "./glycemic-load";
import { gramsToTroyOz } from "./grams-to-troy-oz";
import { greenhouseHeatingCalculator } from "./greenhouse-heating";
import { groundCoverCalculator } from "./ground-cover";
import { guineaPigCageCalculator } from "./guinea-pig-cage";
import { hamsterWheelSizeCalculator } from "./hamster-wheel-size";
import { hardMoneyLoanCalculator } from "./hard-money-loan";
import { hectaresToSqFeet } from "./hectares-to-sq-feet";
import { hedgeSpacingCalculator } from "./hedge-spacing";
import { herbGardenCalculator } from "./herb-garden";
import { hipCircumferenceCalculator } from "./hip-circumference";
import { homeAppreciationRateCalculator } from "./home-appreciation-rate";
import { homeEquityLineCalculator } from "./home-equity-line";
import { homeInspectionCostCalculator } from "./home-inspection-cost";
import { homeOfficeDeductionCalculator } from "./home-office-deduction";
import { homeStagingCalculator } from "./home-staging";
import { homeWarrantyCostCalculator } from "./home-warranty-cost";
import { horseHayCalculator } from "./horse-hay";
import { houseFlippingCalculator } from "./house-flipping-calc";
import { howManyDaysUntilCalculator } from "./how-many-days-until";
import { hsaTaxSavingsCalculator } from "./hsa-tax-savings";
import { hydroponicPhCalculator } from "./hydroponic-ph";
import { iceCreamMakerCalculator } from "./ice-cream-maker";
import { illinoisSalesTaxCalculator } from "./illinois-sales-tax";
import { imageFilesizeCalculator } from "./image-filesize";
import { incomeDrivenRepaymentCalculator } from "./income-driven-repayment";
import { indianaSalesTaxCalculator } from "./indiana-sales-tax";
import { indoorPlantLightCalculator } from "./indoor-plant-light";
import { inflationImpactCalculator } from "./inflation-impact";
import { inheritedIraRmdCalculator } from "./inherited-ira-rmd";
import { investmentPropertyCalculator } from "./investment-property";
import { ipRangeCalculator } from "./ip-range";
import { jamSugarCalculator } from "./jam-sugar";
import { joulesToCalories } from "./joules-to-calories";
import { jsonSizeCalculator } from "./json-size";
import { kelvinToFahrenheit } from "./kelvin-to-fahrenheit";
import { kgToNewton } from "./kg-to-newton";
import { kmhToKnots } from "./kmh-to-knots";
import { kmhToMs } from "./kmh-to-ms";
import { knotsToKmh } from "./knots-to-kmh";
import { lactateThresholdCalculator } from "./lactate-threshold";
import { languageLearningCalculator } from "./language-learning";
import { lawnAerationCalculator } from "./lawn-aeration";
import { lawnOverseedingCalculator } from "./lawn-overseeding";
import { litersToCubicInches } from "./liters-to-cubic-inches";
import { louisianaSalesTaxCalculator } from "./louisiana-sales-tax";
import { luckyNumberCalculator } from "./lucky-number";
import { marginLoanCalculator } from "./margin-loan";
import { marinadeCalculator } from "./marinade-calculator";
import { marriageTaxPenaltyCalculator } from "./marriage-tax-penalty";
import { marylandSalesTaxCalculator } from "./maryland-sales-tax";
import { massachusettsSalesTaxCalculator } from "./massachusetts-sales-tax";
import { medicalExpenseDeductionCalculator } from "./medical-expense-deduction";
import { medicalLoanCalculator } from "./medical-loan";
import { medicareSurtaxCalculator } from "./medicare-surtax";
import { michiganSalesTaxCalculator } from "./michigan-sales-tax";
import { minnesotaSalesTaxCalculator } from "./minnesota-sales-tax";
import { missouriSalesTaxCalculator } from "./missouri-sales-tax";
import { monitorPpiCalculator } from "./monitor-ppi";
import { mortgageComparisonCalculator } from "./mortgage-comparison";
import { movingCostEstimateCalculator } from "./moving-cost-estimate";
import { mphToMs } from "./mph-to-ms";
import { msToMph } from "./ms-to-mph";
import { musclePotentialCalculator } from "./muscle-potential";
import { musicPracticeCalculator } from "./music-practice";
import { neckCircumferenceCalculator } from "./neck-circumference";
import { networkLatencyCalculator } from "./network-latency";
import { newJerseySalesTaxCalculator } from "./new-jersey-sales-tax";
import { newYorkSalesTaxCalculator } from "./new-york-sales-tax";
import { newtonToKg } from "./newton-to-kg";
import { northCarolinaSalesTaxCalculator } from "./north-carolina-sales-tax";
import { ohioSalesTaxCalculator } from "./ohio-sales-tax";
import { overtimeTaxCalculator } from "./overtime-tax";
import { parentPlusLoanCalculator } from "./parent-plus-loan";
import { pascalToAtm } from "./pascal-to-atm";
import { pastaWaterCalculator } from "./pasta-water";
import { paydayLoanCostCalculator } from "./payday-loan-cost";
import { payrollWithholdingCalculator } from "./payroll-withholding";
import { pennsylvaniaSalesTaxCalculator } from "./pennsylvania-sales-tax";
import { personalLoanCalculator } from "./personal-loan";
import { petCalorieBurnCalculator } from "./pet-calorie-burn";
import { petFirstAidCalculator } from "./pet-first-aid";
import { petNameGeneratorCalculator } from "./pet-name-generator";
import { piDigitsCalculator } from "./pi-digits";
import { pieCrustCalculator } from "./pie-crust";
import { pitiCalculator } from "./piti-calculator";
import { pizzaPartyCalculator } from "./pizza-party";
import { pondFishStockingCalculator } from "./pond-fish-stocking";
import { potSizeCalculator } from "./pot-size";
import { privateStudentLoanCalculator } from "./private-student-loan";
import { propertyManagementFeeCalculator } from "./property-management-fee";
import { propertyRoiCalculator } from "./property-roi";
import { proratedRentCalculator } from "./prorated-rent";
import { proteinIntakeCalculator } from "./protein-intake";
import { publicServiceForgivenessCalculator } from "./public-service-forgiveness";
import { quarterlyTaxCalculator } from "./quarterly-tax";
import { rabbitEnclosureCalculator } from "./rabbit-enclosure";
import { ramSpeedCalculator } from "./ram-speed";
import { realEstateCommissionCalculator } from "./real-estate-commission";
import { recoveryHeartRateCalculator } from "./recovery-heart-rate";
import { relativeStrengthCalculator } from "./relative-strength";
import { rentVsBuyDetailedCalculator } from "./rent-vs-buy-detailed";
import { rentalCashFlowCalculator } from "./rental-cash-flow";
import { rentalIncomeTaxCalculator } from "./rental-income-tax";
import { repMaxCalculator } from "./rep-max-calculator";
import { riceCookerCalculator } from "./rice-cooker";
import { roadTripSnackCalculator } from "./road-trip-snack";
import { roastBeefTimeCalculator } from "./roast-beef-time";
import { rothConversionCalculator } from "./roth-conversion";
import { runningAgeGradeCalculator } from "./running-age-grade";
import { rvLoanCalculator } from "./rv-loan";
import { sbaLoanCalculator } from "./sba-loan";
import { screenTimeCalculator } from "./screen-time";
import { securityDepositReturnCalculator } from "./security-deposit-return";
import { seedGerminationCalculator } from "./seed-germination";
import { serverBandwidthCalculator } from "./server-bandwidth";
import { smoothieRatioCalculator } from "./smoothie-ratio";
import { snowDayProbabilityCalculator } from "./snow-day-probability";
import { socialSecurityTaxCalculator } from "./social-security-tax";
import { soilVolumeCalculator } from "./soil-volume";
import { solarSystemWeightCalculator } from "./solar-system-weight";
import { southCarolinaSalesTaxCalculator } from "./south-carolina-sales-tax";
import { sprintCapacityCalculator } from "./sprint-capacity";
import { sqFeetToHectares } from "./sq-feet-to-hectares";
import { sqMetersToAcres } from "./sq-meters-to-acres";
import { squareFootGardenCalculator } from "./square-foot-garden";
import { squareFootagePriceCalculator } from "./square-footage-price";
import { ssdLifespanCalculator } from "./ssd-lifespan";
import { standardVsItemizedCalculator } from "./standard-vs-itemized";
import { stockOptionTaxCalculator } from "./stock-option-tax";
import { storageRaidCalculator } from "./storage-raid";
import { streamingCostCalculator } from "./streaming-cost";
import { studentLoanRefinanceCalculator } from "./student-loan-refinance";
import { subnetMaskCalculator } from "./subnet-mask";
import { subscriptionTrackerCalculator } from "./subscription-tracker";
import { sugarSubstituteCalculator } from "./sugar-substitute";
import { tennesseeSalesTaxCalculator } from "./tennessee-sales-tax";
import { texasSalesTaxCalculator } from "./texas-sales-tax";
import { throughputCalculator } from "./throughput-calculator";
import { timeCapsuleCalculator } from "./time-capsule";
import { tipEtiquetteCalculator } from "./tip-etiquette";
import { titleInsuranceCalculator } from "./title-insurance";
import { titleLoanCalculator } from "./title-loan";
import { transferTaxCalculator } from "./transfer-tax";
import { treeMulchRingCalculator } from "./tree-mulch-ring";
import { troyOzToGrams } from "./troy-oz-to-grams";
import { turtleTankSizeCalculator } from "./turtle-tank-size";
import { uptimeCalculator } from "./uptime-calculator";
import { vacationRentalCalculator } from "./vacation-rental";
import { vegetableGardenSizeCalculator } from "./vegetable-garden-size";
import { videoStorageCalculator } from "./video-storage";
import { virginiaSalesTaxCalculator } from "./virginia-sales-tax";
import { vo2maxEstimateCalculator } from "./vo2max-estimate";
import { volumeLoadCalculator } from "./volume-load";
import { w4WithholdingCalculator } from "./w4-withholding";
import { walkingDistanceCalculator } from "./walking-distance";
import { washingtonSalesTaxCalculator } from "./washington-sales-tax";
import { waterBottleRefillCalculator } from "./water-bottle-refill";
import { waterIntakeFitnessCalculator } from "./water-intake-fitness";
import { wateringScheduleCalculator } from "./watering-schedule";
import { wattHoursToJoules } from "./watt-hours-to-joules";
import { weedKillerMixCalculator } from "./weed-killer-mix";
import { wilks2Calculator } from "./wilks-2-calculator";
import { winePairingCalculator } from "./wine-pairing";
import { wisconsinSalesTaxCalculator } from "./wisconsin-sales-tax";
import { wristCircumferenceCalculator } from "./wrist-circumference";

import { fourOhThreeBCalculator } from "./403b-calculator";
import { amnioticFluidCalculator } from "./amniotic-fluid";
import { annuityPayoutCalculator } from "./annuity-payout";
import { apScorePredictCalculator } from "./ap-score-predict";
import { apgarCalculator } from "./apgar-calculator";
import { atvInsuranceCalculator } from "./atv-insurance";
import { babyBathTempCalculator } from "./baby-bath-temp";
import { babyBottleAmountCalculator } from "./baby-bottle-amount";
import { babyFoodIntroCalculator } from "./baby-food-intro";
import { babyGrowthSpurtCalculator } from "./baby-growth-spurt";
import { babyNameMeaningCalculator } from "./baby-name-meaning";
import { babyProofingCalculator } from "./baby-proofing";
import { babyShoeSizeCalculator } from "./baby-shoe-size";
import { babyToothCalculator } from "./baby-tooth";
import { baristaFireCalculator } from "./barista-fire";
import { baseboardHeatCalculator } from "./baseboard-heat";
import { bathroomRemodelCostCalculator } from "./bathroom-remodel-cost";
import { bernoulliEquationCalculator } from "./bernoulli-equation";
import { boatFuelCalcCalculator } from "./boat-fuel-calc";
import { brakePadLifeCalculator } from "./brake-pad-life";
import { breastfeedingTimerCalculator } from "./breastfeeding-timer";
import { capacitorEnergyCalculator } from "./capacitor-energy";
import { carBatteryLifeCalculator } from "./car-battery-life";
import { carDepreciationYearsCalculator } from "./car-depreciation-years";
import { carMaintenanceCostCalculator } from "./car-maintenance-cost";
import { carSeatAgeCalculator } from "./car-seat-age";
import { carSoundSystemCalculator } from "./car-sound-system";
import { carTotalCostCalculator } from "./car-total-cost";
import { carVsUberCalculator } from "./car-vs-uber";
import { carWashSavingsCalculator } from "./car-wash-savings";
import { carWaxCoverageCalculator } from "./car-wax-coverage";
import { cargoSpaceCalculator } from "./cargo-space";
import { ceilingFanSizeCalculator } from "./ceiling-fan-size";
import { centralAcCostCalculator } from "./central-ac-cost";
import { chainFenceCalculator } from "./chain-fence";
import { cinderBlockWallCalculator } from "./cinder-block-wall";
import { citationGeneratorCalculator } from "./citation-generator";
import { classScheduleCalculator } from "./class-schedule";
import { closetOrganizerCostCalculator } from "./closet-organizer-cost";
import { coastFireCalculator } from "./coast-fire";
import { cobraCostCalculator } from "./cobra-cost";
import { collegeAcceptanceCalculator } from "./college-acceptance";
import { collegeGpaCalculator } from "./college-gpa";
import { collegeSavingsBabyCalculator } from "./college-savings-baby";
import { commuteFuelCostCalculator } from "./commute-fuel-cost";
import { concreteFootingCalcCalculator } from "./concrete-footing-calc";
import { contractionCounterCalculator } from "./contraction-counter";
import { creditHoursCalculator } from "./credit-hours";
import { curtainRodCalculator } from "./curtain-rod";
import { dashCamStorageCalculator } from "./dash-cam-storage";
import { daycareCostCalculator } from "./daycare-cost";
import { deckCostCalculator } from "./deck-cost";
import { decomposedGraniteCalcCalculator } from "./decomposed-granite-calc";
import { dentalInsuranceCalculator } from "./dental-insurance";
import { diaperSizeCalculator } from "./diaper-size";
import { disabilityInsuranceCalculator } from "./disability-insurance";
import { doorReplacementCostCalculator } from "./door-replacement-cost";
import { dormRoomSetupCalculator } from "./dorm-room-setup";
import { drivewayCostCalculator } from "./driveway-cost";
import { dropCeilingCalcCalculator } from "./drop-ceiling-calc";
import { elasticCollisionCalculator } from "./elastic-collision";
import { electricFieldCalculator } from "./electric-field";
import { emissionTestCostCalculator } from "./emission-test-cost";
import { engineOilChangeCalculator } from "./engine-oil-change";
import { evChargingCostCalculator } from "./ev-charging-cost";
import { evRangeCalculator } from "./ev-range";
import { evSavingsCalculator } from "./ev-savings";
import { faradayLawCalculator } from "./faraday-law";
import { fenceCostCalculator } from "./fence-cost";
import { fetalWeightCalculator } from "./fetal-weight";
import { financialAidEstimateCalculator } from "./financial-aid-estimate";
import { fireNumberCalculator } from "./fire-number";
import { flagstonePatioCalculator } from "./flagstone-patio";
import { flashcardRetentionCalculator } from "./flashcard-retention";
import { frenchDrainCalcCalculator } from "./french-drain-calc";
import { frequencyWavelengthCalculator } from "./frequency-wavelength";
import { garageDoorCostCalculator } from "./garage-door-cost";
import { gestationalAgeCalculator } from "./gestational-age";
import { gradeNeededCalculator } from "./grade-needed";
import { gutterCostCalculator } from "./gutter-cost";
import { gutterSizingCalculator } from "./gutter-sizing";
import { hardwoodFloorCostCalculator } from "./hardwood-floor-cost";
import { healthInsuranceCostCalculator } from "./health-insurance-cost";
import { heatTransferCalculator } from "./heat-transfer";
import { highSchoolGpaCalculator } from "./high-school-gpa";
import { houseWrapCalcCalculator } from "./house-wrap-calc";
import { hybridSavingsCalculator } from "./hybrid-savings";
import { idealGasCalcCalculator } from "./ideal-gas-calc";
import { impulseCalculator } from "./impulse-calculator";
import { inelasticCollisionCalculator } from "./inelastic-collision";
import { internshipValueCalculator } from "./internship-value";
import { iraContributionCalculator } from "./ira-contribution";
import { kineticEnergyCalcCalculator } from "./kinetic-energy-calc";
import { kitchenCabinetCostCalculator } from "./kitchen-cabinet-cost";
import { kitchenRemodelCostCalculator } from "./kitchen-remodel-cost";
import { landscapeBorderCalculator } from "./landscape-border";
import { landscapeFabricCalcCalculator } from "./landscape-fabric-calc";
import { landscapeStoneCalculator } from "./landscape-stone";
import { landscapingCostCalculator } from "./landscaping-cost";
import { leanFireCalculator } from "./lean-fire";
import { longTermCareCalculator } from "./long-term-care";
import { magneticForceCalculator } from "./magnetic-force";
import { mealPlanCostCalculator } from "./meal-plan-cost";
import { medicareCostCalculator } from "./medicare-cost";
import { metalPanelCalculator } from "./metal-panel";
import { mirrorEquationCalculator } from "./mirror-equation";
import { motorcycleInsuranceCalculator } from "./motorcycle-insurance";
import { movingTruckSizeCalculator } from "./moving-truck-size";
import { nicuStayCalculator } from "./nicu-stay";
import { noteTakingSpeedCalculator } from "./note-taking-speed";
import { nurseryRoomCalculator } from "./nursery-room";
import { parallelCapacitorsCalculator } from "./parallel-capacitors";
import { parallelResistorsCalculator } from "./parallel-resistors";
import { patioCostCalculator } from "./patio-cost";
import { patioPaverCalcCalculator } from "./patio-paver-calc";
import { peaGravelCalcCalculator } from "./pea-gravel-calc";
import { pellGrantCalculator } from "./pell-grant";
import { pensionVsLumpSumCalculator } from "./pension-vs-lump-sum";
import { playgroundSurfaceCalculator } from "./playground-surface";
import { postHoleCalcCalculator } from "./post-hole-calc";
import { postpartumDepressionCalculator } from "./postpartum-depression";
import { potentialEnergyCalcCalculator } from "./potential-energy-calc";
import { powerPhysicsCalculator } from "./power-physics";
import { pregnancyDueDateIvfCalculator } from "./pregnancy-due-date-ivf";
import { pumpingScheduleCalculator } from "./pumping-schedule";
import { railroadTieCalcCalculator } from "./railroad-tie-calc";
import { registrationFeeCalculator } from "./registration-fee";
import { requiredSavingsRateCalculator } from "./required-savings-rate";
import { retirementGapCalculator } from "./retirement-gap";
import { retirementIncomeCalculator } from "./retirement-income";
import { retirementSavingsNeededCalculator } from "./retirement-savings-needed";
import { riverRockCalcCalculator } from "./river-rock-calc";
import { roofReplacementCostCalculator } from "./roof-replacement-cost";
import { roomPaintCostCalculator } from "./room-paint-cost";
import { satToActCalculator } from "./sat-to-act";
import { scholarshipOddsCalculator } from "./scholarship-odds";
import { sepIraCalculator } from "./sep-ira";
import { septicTankSizeCalculator } from "./septic-tank-size";
import { seriesCapacitorsCalculator } from "./series-capacitors";
import { seriesResistorsCalculator } from "./series-resistors";
import { sidingCostCalculator } from "./siding-cost";
import { simpleIraCalculator } from "./simple-ira";
import { sleepRegressionCalculator } from "./sleep-regression";
import { snellsLawCalculator } from "./snells-law";
import { socialSecurityAgeCalculator } from "./social-security-age";
import { specificHeatCalcCalculator } from "./specific-heat-calc";
import { springForceCalculator } from "./spring-force";
import { steppingStoneCalcCalculator } from "./stepping-stone-calc";
import { stoneWallCalculator } from "./stone-wall";
import { storageUnitSizeCalculator } from "./storage-unit-size";
import { stuccoCoverageCalculator } from "./stucco-coverage";
import { studentLoanPaymentCalculator } from "./student-loan-payment";
import { studentMonthlyBudgetCalculator } from "./student-monthly-budget";
import { studyAbroadCostCalculator } from "./study-abroad-cost";
import { studyBreakCalculator } from "./study-break";
import { syntheticTurfCalculator } from "./synthetic-turf";
import { termLifeInsuranceCalculator } from "./term-life-insurance";
import { textbookCostCalculator } from "./textbook-cost";
import { thesisTimelineCalculator } from "./thesis-timeline";
import { thinLensCalculator } from "./thin-lens";
import { tireWearCalculator } from "./tire-wear";
import { toddlerHeightCalculator } from "./toddler-height";
import { towingMpgCalculator } from "./towing-mpg";
import { vaporBarrierCalcCalculator } from "./vapor-barrier-calc";
import { visionInsuranceCalculator } from "./vision-insurance";
import { waterSoftenerSizeCalculator } from "./water-softener-size";
import { waveSpeedCalculator } from "./wave-speed";
import { weightedGpaCalcCalculator } from "./weighted-gpa-calc";
import { wellDepthCalculator } from "./well-depth";
import { wholeLifeInsuranceCalculator } from "./whole-life-insurance";
import { windowReplacementCostCalculator } from "./window-replacement-cost";
import { windowTintCalculator } from "./window-tint";
import { workDoneCalculator } from "./work-done";
import { workStudyHoursCalculator } from "./work-study-hours";
import { airlineMilesValue } from "./airline-miles-value";
import { altitudeAdjustment } from "./altitude-adjustment";
import { backpackingCost } from "./backpacking-cost";
import { beachVacationCost } from "./beach-vacation-cost";
import { campingChecklistCost } from "./camping-checklist-cost";
import { carryOnWeight } from "./carry-on-weight";
import { cruiseTip } from "./cruise-tip";
import { currencyConverterTrip } from "./currency-converter-trip";
import { customsDuty } from "./customs-duty";
import { disneyTripCost } from "./disney-trip-cost";
import { distanceBetweenCities } from "./distance-between-cities";
import { drivingDistance } from "./driving-distance";
import { dutyFreeSavings } from "./duty-free-savings";
import { hotelPointsValue } from "./hotel-points-value";
import { internationalCallCost } from "./international-call-cost";
import { luggageSize } from "./luggage-size";
import { roadTripCost } from "./road-trip-cost";
import { skiTripCost } from "./ski-trip-cost";
import { timezoneConverter } from "./timezone-converter";
import { travelAdapter } from "./travel-adapter";
import { travelBudgetDaily } from "./travel-budget-daily";
import { travelPointsValue } from "./travel-points-value";
import { travelTipGuide } from "./travel-tip-guide";
import { travelVaccineCost } from "./travel-vaccine-cost";
import { vacationDaysNeeded } from "./vacation-days-needed";
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
  absenteeismRateCalculator,
  acresToHectaresConverter,
  activationEnergyCalculator,
  actualYieldCalculator,
  ageOnPlanetsCalculator,
  aggregateCalculator,
  alleleFrequencyCalculator,
  annealingTemperatureCalculator,
  applianceEnergyCalculator,
  babyGenderCalculator,
  backfillCalculator,
  balusterSpacingCalculator,
  beamDeflectionCalculator,
  beerLambertBioCalculator,
  betaCalculator,
  billableHoursCalculator,
  binaryToDecimalConverter,
  birthControlCalculator,
  blackScholesCalculator,
  boardFootCalculator,
  bondOrderCalculator,
  breastPumpTimeCalculator,
  btuToWattsConverter,
  burndownChartCalculator,
  calorimetryCalculator,
  capacityPlanningCalculator,
  capmCalculator,
  carryingCapacityCalculator,
  catFoodCalculator,
  cellDilutionCalculator,
  centsToDollarsConverter,
  chineseGenderCalculator,
  circleSkirtCalculator,
  commuteCarbonCalculator,
  compatibilityScoreCalculator,
  compostingRateCalculator,
  compoundGrowthCalculator,
  concentrationCalculator,
  concreteMixDesignCalculator,
  crochetBlanketCalculator,
  crossStitchCalculator,
  crownMoldingAngleCalculator,
  cubicFeetToGallonsConverter,
  debtToEquityCalculator,
  decimalToBinaryConverter,
  degreesToRadiansConverter,
  dihybridCrossCalculator,
  dividendDiscountCalculator,
  dnaConcentrationCalculator,
  dnaMolecularWeightCalculator,
  dogAgeChartCalculator,
  dogChocolateToxicityCalculator,
  dogCrateSizeCalculator,
  dogHarnessSizeCalculator,
  dogHeatCycleCalculator,
  dogHumanYearsCalculator,
  dogLifeExpectancyCalculator,
  dogMedicineDosageCalculator,
  dogRawFoodCalculator,
  dogWalkingCalorieCalculator,
  dogWaterIntakeCalculator,
  dollarCostAveragingCalculator,
  drakeEquationCalculator,
  dropsToMlConverter,
  eggFreezingCalculator,
  electricVsGasCalculator,
  electronConfigurationCalculator,
  emailTimeCalculator,
  embroideryHoopCalculator,
  emiCalculator,
  endometriosisRiskCalculator,
  energyAuditCalculator,
  enterpriseValueCalculator,
  enzymeActivityCalculator,
  epfCalculator,
  epsCalculator,
  excavationVolumeCalculator,
  fdCalculator,
  flightCarbonCalculator,
  foodWasteCalculator,
  ftLbsToNmConverter,
  gallonsToPoundsConverter,
  generationTimeCalculator,
  goldPriceCalculator,
  gramsToCaloriesConverter,
  gramsToMolesCalculator,
  gratuityCalculator,
  greywaterReuseCalculator,
  gstCalculator,
  halfSquareTriangleCalculator,
  handrailHeightCalculator,
  heatOfCombustionCalculator,
  hemocytometerCalculator,
  hexToRgbConverter,
  hexagonQuiltCalculator,
  hiringCostCalculator,
  householdCarbonCalculator,
  hraCalculator,
  idealGasConstantCalculator,
  implantationCalculator,
  incomeTaxIndiaCalculator,
  insulationSavingsCalculator,
  ivfSuccessCalculator,
  knittingPatternCalculator,
  kwToHpConverter,
  latticeEnergyCalculator,
  lbsToNewtonsConverter,
  ledSavingsCalculator,
  loadBearingWallCalculator,
  marginCallCalculator,
  marketCapCalculator,
  mbpsToGbpsConverter,
  mcgToMgConverter,
  meatFootprintCalculator,
  menopauseAgeCalculator,
  metalRoofingCalculator,
  mgToMlConverter,
  michaelisMentenCalculator,
  molarRatioCalculator,
  moleFractionCalculator,
  molecularGeometryCalculator,
  molesToGramsCalculator,
  nameNumerologyCalculator,
  nmToFtLbsConverter,
  normalityCalculator,
  npsCalculator,
  octalToDecimalConverter,
  optionsProfitCalculator,
  paperSavingsCalculator,
  partialPressureCalculator,
  pcosRiskCalculator,
  pcrPrimerCalculator,
  peRatioCalculator,
  periodCalculator,
  photosynthesisRateCalculator,
  pixelsToInchesConverter,
  pizzaSizeCalculator,
  plasticFootprintCalculator,
  pleatedSkirtCalculator,
  pomodoroTimerCalculator,
  populationGrowthCalculator,
  portfolioReturnCalculator,
  postpartumRecoveryCalculator,
  ppfCalculator,
  ppmCalculator,
  pregnancyBmiCalculator,
  pregnancyCalorieCalculator,
  priceToBookCalculator,
  projectTimelineCalculator,
  proteinMolecularWeightCalculator,
  punnettSquareCalculator,
  puppyFeedingCalculator,
  putCallParityCalculator,
  pxToEmConverter,
  quiltBindingCalculator,
  radiansToDegreesConverter,
  rainwaterHarvestCalculator,
  randomNameCalculator,
  rateConstantCalculator,
  rdCalculator,
  recyclingSavingsCalculator,
  resourceAllocationCalculator,
  rgbToHexConverter,
  riskRewardCalculator,
  serialDilutionCalculator,
  shannonDiversityCalculator,
  sharpeRatioCalculator,
  shingleCalculator,
  slopeGradeCalculator,
  soilCompactionCalculator,
  solarRoiCalculator,
  speciesRichnessCalculator,
  specificHeatCapacityCalculator,
  sprintVelocityCalculator,
  squareYardsToSquareFeetConverter,
  stairStringerCalculator,
  stampDutyIndiaCalculator,
  stockSplitCalculator,
  storyPointsCalculator,
  sukanyaSamriddhiCalculator,
  tdsCalculator,
  theoreticalYieldCalculator,
  timeTrackingCalculator,
  tipSplitCalculator,
  trainingRoiCalculator,
  treePlantingCalculator,
  turnoverCostCalculator,
  twinProbabilityCalculator,
  utilizationRateCalculator,
  vatCalculator,
  waccCalculator,
  waterFootprintCalculator,
  wattsToBtuConverter,
  windTurbineOutputCalculator,
  yarnWeightCalculator,
  test,
  abTestSignificanceCalculator,
  abgInterpreterCalculator,
  adFrequencyCalculator,
  airHandlerSizeCalculator,
  airflowCfmCalculator,
  alabamaPaycheckCalculator,
  angularDiameterCalculator,
  anniversaryGiftCalculator,
  apacheScoreCalculator,
  arizonaPaycheckCalculator,
  babyShowerBudgetCalculator,
  backflowPreventerCalculator,
  bandsawBladeCalculator,
  bishopScoreCalculator,
  bitcoinProfitCalculator,
  blogTrafficCalculator,
  boardFootageCalculator,
  boilerSizeCalculator,
  bounceRateCalculator,
  boxPlotCalculator,
  bradenScaleCalculator,
  brandAwarenessCalculator,
  bridesmaidCostCalculator,
  bunCreatinineCalculator,
  cabinetDoorSizeCalculator,
  californiaPaycheckCalculator,
  cateringQuantityCalculator,
  clampPressureCalculator,
  coefficientVariationCalculator,
  coloradoPaycheckCalculator,
  compoundTradingCalculator,
  condensateDrainCalculator,
  contentRoiCalculator,
  coolingLoadCalculator,
  correctedQtCalculator,
  cosmicDistanceCalculator,
  cpcCalculator,
  cpmCalculator,
  creatinineClearanceCgCalculator,
  cronbachAlphaCalculator,
  cryptoMiningProfitCalculator,
  cryptoTaxCalculator,
  ctrCalculator,
  customerAcquisitionCostCalculator,
  cuttingDiagramCalculator,
  dadoJointCalculator,
  defiYieldCalculator,
  dehumidifierSizeCalculator,
  deltaVCalculator,
  domainAuthorityCalculator,
  dovetailJointCalculator,
  dowelSpacingCalculator,
  drainPipeSlopeCalculator,
  drawdownCalculator,
  drawerSlideCalculator,
  drillBitSizeCalculator,
  ductSizeCalculator,
  effectSizeCalculator,
  egfrCalculator,
  emailOpenRateCalculator,
  engagementRateCalculator,
  engagementRingBudgetCalculator,
  eventParkingCalculator,
  eventRentalCalculator,
  eventSpaceCapacityCalculator,
  expansionTankCalculator,
  expectedValueTradeCalculator,
  fenaCalculator,
  fibonacciRetracementCalculator,
  fishersExactCalculator,
  floridaPaycheckCalculator,
  fluidMaintenanceCalculator,
  framinghamScoreCalculator,
  futuresPnlCalculator,
  gasFeeCalculator,
  gasPipeSizeCalculator,
  georgiaPaycheckCalculator,
  glycolMixtureCalculator,
  graduationPartyCalculator,
  groomsmenCostCalculator,
  habitableZoneCalculator,
  harrisBenedictCalculator,
  hashRateCalculator,
  heatLossCalculator,
  heatPumpCopCalculator,
  honeymoonBudgetCalculator,
  humidifierSizeCalculator,
  illinoisPaycheckCalculator,
  impermanentLossCalculator,
  indianaPaycheckCalculator,
  influencerRateCalculator,
  interquartileRangeCalculator,
  kellyCriterionCalculator,
  keplerThirdLawCalculator,
  keywordDensityCalculator,
  kruskalWallisCalculator,
  latheSpeedCalculator,
  leadScoringCalculator,
  leverageCalculator,
  lightTravelCalculator,
  liquidityPoolCalculator,
  lotSizeCalculator,
  louisianaPaycheckCalculator,
  magnitudeDistanceCalculator,
  mannWhitneyCalculator,
  marginOfErrorCalculator,
  marylandPaycheckCalculator,
  massachusettsPaycheckCalculator,
  meldScoreCalculator,
  meteorShowerCalculator,
  michiganPaycheckCalculator,
  minnesotaPaycheckCalculator,
  missouriPaycheckCalculator,
  miterAngleCalculator,
  mmseScoreCalculator,
  morseFallScaleCalculator,
  movingAverageCalculator,
  newJerseyPaycheckCalculator,
  newYorkPaycheckCalculator,
  newsScoreCalculator,
  northCarolinaPaycheckCalculator,
  nortonScaleCalculator,
  numberNeededTreatCalculator,
  nutritionalScreeningCalculator,
  oddsRatioCalculator,
  ohioPaycheckCalculator,
  oneWayAnovaCalculator,
  opioidConversionCalculator,
  pageLoadImpactCalculator,
  pairedTTestCalculator,
  parklandFormulaCalculator,
  parsecConverterCalculator,
  partyBalloonCalculator,
  pediatricGcsCalculator,
  pennsylvaniaPaycheckCalculator,
  percentileRankCalculator,
  pipCalculator,
  pipeSizingCalculator,
  pivotPointCalculator,
  planetSurfaceGravityCalculator,
  podcastDownloadCalculator,
  positionSizeCalculator,
  powerAnalysisCalculator,
  ppvNpvCalculator,
  pressureReliefValveCalculator,
  profitFactorCalculator,
  qsofaScoreCalculator,
  radiatorSizeCalculator,
  receptionTimelineCalculator,
  redShiftCalculator,
  refrigerantChargeCalculator,
  rehearsalDinnerCalculator,
  relativeRiskCalculator,
  retentionRateCalculator,
  revisedTraumaCalculator,
  roasCalculator,
  rocheLimitCalculator,
  rocketThrustCalculator,
  routerBitSpeedCalculator,
  rsiCalculator,
  salesFunnelCalculator,
  sandpaperGritCalculator,
  satellitePeriodCalculator,
  satelliteVelocityCalculator,
  schwarzschildRadiusCalculator,
  sensitivitySpecificityCalculator,
  seoRoiCalculator,
  sewerPipeCapacityCalculator,
  shelfSagCalculator,
  skewnessKurtosisCalculator,
  socialMediaRoiCalculator,
  southCarolinaPaycheckCalculator,
  spaceTravelTimeCalculator,
  spearmanCorrelationCalculator,
  stakingRewardsCalculator,
  starLuminosityCalculator,
  staticPressureCalculator,
  stellarClassificationCalculator,
  stellarParallaxCalculator,
  stemLeafPlotCalculator,
  subscriberValueCalculator,
  survivalRateCalculator,
  synodicPeriodCalculator,
  tableLegTaperCalculator,
  telescopeApertureCalculator,
  telescopeFovCalculator,
  telescopeMagnificationCalculator,
  tennesseePaycheckCalculator,
  tenonSizeCalculator,
  texasPaycheckCalculator,
  thermalResistanceCalculator,
  tidalForceCalculator,
  timiScoreCalculator,
  tokenVestingCalculator,
  twoSampleTTestCalculator,
  typeIIIErrorCalculator,
  veneerCoverageCalculator,
  ventPipeSizeCalculator,
  viralCoefficientCalculator,
  virginiaPaycheckCalculator,
  washingtonPaycheckCalculator,
  waterHeaterSizeCalculator,
  waterSupplyDemandCalculator,
  weddingCakeSizeCalculator,
  weddingDjTimelineCalculator,
  weddingDrinkCalculator,
  weddingFavorCalculator,
  weddingFlowerCalculator,
  weddingGuestListCalculator,
  weddingInvitationCalculator,
  weddingPhotoTimelineCalculator,
  weddingRegistryCalculator,
  weddingSeatingCalculator,
  weddingToastLengthCalculator,
  wellsScoreCalculator,
  wilcoxonTestCalculator,
  winRateCalculator,
  wisconsinPaycheckCalculator,
  woodBendingCalculator,
  woodDensityCalculator,
  woodExpansionCalculator,
  woodMoistureCalculator,
  woodScrewPilotCalculator,
  woodShrinkageCalculator,
  woodStainCoverageCalculator,
  arcLengthCalculator,
  armMortgageCalculator,
  baseballEraCalculator,
  baseballObpCalculator,
  baseballOpsCalculator,
  baseballSluggingCalculator,
  basketballPaceCalculator,
  basketballPerCalculator,
  basketballTrueShootingCalculator,
  birthFlowerCalculator,
  birthstoneCalculator,
  bodyRecompCalculator,
  bridgeLoanCalculator,
  bulkingCalculator,
  caffeineHalfLifeCalculator,
  cashOutRefinanceCalculator,
  catAgeHumanCalculator,
  celebrityAgeCalculator,
  chordLengthCalculator,
  circleEquationCalculator,
  cmToFeetConverter,
  cmToMmConverter,
  constructionLoanCalculator,
  cubeVolumeCalculator,
  cupsToPintsConverter,
  cupsToTablespoonsConverter,
  distanceFormulaCalculator,
  dndCharacterCalculator,
  dogAgeHumanCalculator,
  ellipseAreaCalculator,
  equationOfLineCalculator,
  feetToCmConverter,
  footballFantasyPointsCalculator,
  footballPasserRatingCalculator,
  frustumVolumeCalculator,
  gallonsToQuartsConverter,
  gasTripSplitCalculator,
  generationCalculator,
  gramsToKgConverter,
  gramsToMgConverter,
  hemisphereVolumeCalculator,
  heronFormulaCalculator,
  hexagonAreaCalculator,
  hockeyCorsiCalculator,
  hockeySavePctCalculator,
  hogwartsHouseCalculator,
  homeEquityLoanCalculator,
  howOldAmICalculator,
  inchesToMetersConverter,
  inscribedAngleCalculator,
  interestOnlyMortgageCalculator,
  jumboLoanCalculator,
  kgToGramsConverter,
  landLoanCalculator,
  litersToOuncesConverter,
  metersToInchesConverter,
  metersToMilesConverter,
  metersToYardsConverter,
  mgToGramsConverter,
  milesToMetersConverter,
  minecraftCraftingCalculator,
  mlToOzConverter,
  mmToCmConverter,
  octagonAreaCalculator,
  ouncesToLitersConverter,
  ozToMlConverter,
  parabolaCalculator,
  pentagonAreaCalculator,
  pintsToCupsConverter,
  pyramidVolumeCalculator,
  quartsToGallonsConverter,
  rectangleAreaCalculator,
  rectangularPrismCalculator,
  regularPolygonCalculator,
  rhombusAreaCalculator,
  secondMortgageCalculator,
  sectorAreaCalculator,
  soccerExpectedGoalsCalculator,
  soccerPassCompletionCalculator,
  spiritAnimalCalculator,
  tbspToTspConverter,
  tennisFirstServeCalculator,
  tomatoYieldCalculator,
  torusVolumeCalculator,
  triangleInequalityCalculator,
  usdaLoanCalculator,
  yardsMetersConverter,
  exchange1031Calculator,
  freelancerTaxCalculator,
  fifteenVsThirtyMortgageCalculator,
  fourOhOneKLoanCalculator,
  plan529TaxBenefitCalculator,
  acresToSqMeters,
  airFryerConverterCalculator,
  airbnbIncomeCalculator,
  alabamaSalesTaxCalculator,
  amtCalculator,
  anaerobicThresholdCalculator,
  ankleCircumferenceCalculator,
  apiRateLimitCalculator,
  appraisalValueCalculator,
  aquariumFilterCalculator,
  aquariumHeaterCalculator,
  aquariumLightCalculator,
  arizonaSalesTaxCalculator,
  atmToPascal,
  autoRefinanceCalculator,
  babyNameMatchCalculator,
  backdoorRothCalculator,
  backupSizeCalculator,
  balanceTransferCalculator,
  base64SizeCalculator,
  bbqCookingTimeCalculator,
  berryBushSpacingCalculator,
  bingeWatchTimeCalculator,
  birdCageCalculator,
  boatLoanCalculator,
  bodyFatNavyCalculator,
  bodyFatSkinfoldCalculator,
  bodySymmetryCalculator,
  bookReadingGoalCalculator,
  breadHydrationCalculator,
  bucketListCalculator,
  buildingCostPerSqftCalculator,
  bulbPlantingDepthCalculator,
  butterToOilCalculator,
  cakeServingCalculator,
  californiaSalesTaxCalculator,
  calorieBurnActivityCalculator,
  caloriesToJoules,
  candyMakingCalculator,
  carbonOffsetCostCalculator,
  carbonTreeCalculator,
  catCarrierSizeCalculator,
  catIndoorSpaceCalculator,
  catLitterBoxCalculator,
  catTreeSizeCalculator,
  catWaterIntakeCalculator,
  celsiusKelvinConverter,
  charitableDeductionCalculator,
  cheeseServingCalculator,
  chickenCookingTimeCalculator,
  chickenFeedCalculator,
  cidrCalculator,
  cloudCostCalculator,
  codeReviewTimeCalculator,
  coffeeBrewingCalculator,
  colorDepthCalculator,
  coloradoSalesTaxCalculator,
  commuteCostCalculator,
  compostBinSizeCalculator,
  condoFeeCalculator,
  consolidationLoanCalculator,
  containerResourcesCalculator,
  cookieBatchCalculator,
  costPerSquareFootCalculator,
  cpuBenchmarkCalculator,
  creatineLoadingCalculator,
  creditCardPayoffCalculator,
  cryptoGainsTaxCalculator,
  cubicInchesToLiters,
  cubicMetersToGallons,
  cuttingCalculator,
  databaseSizeCalculator,
  deepFryerOilCalculator,
  dependentTaxCreditCalculator,
  dogBootSizeCalculator,
  dogCollarSizeCalculator,
  dogKennelSizeCalculator,
  dogSweaterSizeCalculator,
  dogYardSizeCalculator,
  dotsCalculator,
  dripIrrigationLayoutCalculator,
  educationTaxCreditCalculator,
  eggBoilingCalculator,
  employerPayrollCostCalculator,
  equipmentLoanCalculator,
  escrowCalculator,
  fahrenheitToKelvin,
  fatFreeMassIndexCalculator,
  ferretCageCalculator,
  fishTankStockingCalculator,
  floridaSalesTaxCalculator,
  flourConverterCalculator,
  flowerBedCalculator,
  frostDateCalculator,
  fruitServingCalculator,
  fsaSavingsCalculator,
  functionPointCalculator,
  functionalThresholdCalculator,
  gallonsToCubicMeters,
  gardenPathCalculator,
  gardenRowSpacingCalculator,
  gardenSunlightCalculator,
  georgiaSalesTaxCalculator,
  glycemicLoadCalculator,
  gramsToTroyOz,
  greenhouseHeatingCalculator,
  groundCoverCalculator,
  guineaPigCageCalculator,
  hamsterWheelSizeCalculator,
  hardMoneyLoanCalculator,
  hectaresToSqFeet,
  hedgeSpacingCalculator,
  herbGardenCalculator,
  hipCircumferenceCalculator,
  homeAppreciationRateCalculator,
  homeEquityLineCalculator,
  homeInspectionCostCalculator,
  homeOfficeDeductionCalculator,
  homeStagingCalculator,
  homeWarrantyCostCalculator,
  horseHayCalculator,
  houseFlippingCalculator,
  howManyDaysUntilCalculator,
  hsaTaxSavingsCalculator,
  hydroponicPhCalculator,
  iceCreamMakerCalculator,
  illinoisSalesTaxCalculator,
  imageFilesizeCalculator,
  incomeDrivenRepaymentCalculator,
  indianaSalesTaxCalculator,
  indoorPlantLightCalculator,
  inflationImpactCalculator,
  inheritedIraRmdCalculator,
  investmentPropertyCalculator,
  ipRangeCalculator,
  jamSugarCalculator,
  joulesToCalories,
  jsonSizeCalculator,
  kelvinToFahrenheit,
  kgToNewton,
  kmhToKnots,
  kmhToMs,
  knotsToKmh,
  lactateThresholdCalculator,
  languageLearningCalculator,
  lawnAerationCalculator,
  lawnOverseedingCalculator,
  litersToCubicInches,
  louisianaSalesTaxCalculator,
  luckyNumberCalculator,
  marginLoanCalculator,
  marinadeCalculator,
  marriageTaxPenaltyCalculator,
  marylandSalesTaxCalculator,
  massachusettsSalesTaxCalculator,
  medicalExpenseDeductionCalculator,
  medicalLoanCalculator,
  medicareSurtaxCalculator,
  michiganSalesTaxCalculator,
  minnesotaSalesTaxCalculator,
  missouriSalesTaxCalculator,
  monitorPpiCalculator,
  mortgageComparisonCalculator,
  movingCostEstimateCalculator,
  mphToMs,
  msToMph,
  musclePotentialCalculator,
  musicPracticeCalculator,
  neckCircumferenceCalculator,
  networkLatencyCalculator,
  newJerseySalesTaxCalculator,
  newYorkSalesTaxCalculator,
  newtonToKg,
  northCarolinaSalesTaxCalculator,
  ohioSalesTaxCalculator,
  overtimeTaxCalculator,
  parentPlusLoanCalculator,
  pascalToAtm,
  pastaWaterCalculator,
  paydayLoanCostCalculator,
  payrollWithholdingCalculator,
  pennsylvaniaSalesTaxCalculator,
  personalLoanCalculator,
  petCalorieBurnCalculator,
  petFirstAidCalculator,
  petNameGeneratorCalculator,
  piDigitsCalculator,
  pieCrustCalculator,
  pitiCalculator,
  pizzaPartyCalculator,
  pondFishStockingCalculator,
  potSizeCalculator,
  privateStudentLoanCalculator,
  propertyManagementFeeCalculator,
  propertyRoiCalculator,
  proratedRentCalculator,
  proteinIntakeCalculator,
  publicServiceForgivenessCalculator,
  quarterlyTaxCalculator,
  rabbitEnclosureCalculator,
  ramSpeedCalculator,
  realEstateCommissionCalculator,
  recoveryHeartRateCalculator,
  relativeStrengthCalculator,
  rentVsBuyDetailedCalculator,
  rentalCashFlowCalculator,
  rentalIncomeTaxCalculator,
  repMaxCalculator,
  riceCookerCalculator,
  roadTripSnackCalculator,
  roastBeefTimeCalculator,
  rothConversionCalculator,
  runningAgeGradeCalculator,
  rvLoanCalculator,
  sbaLoanCalculator,
  screenTimeCalculator,
  securityDepositReturnCalculator,
  seedGerminationCalculator,
  serverBandwidthCalculator,
  smoothieRatioCalculator,
  snowDayProbabilityCalculator,
  socialSecurityTaxCalculator,
  soilVolumeCalculator,
  solarSystemWeightCalculator,
  southCarolinaSalesTaxCalculator,
  sprintCapacityCalculator,
  sqFeetToHectares,
  sqMetersToAcres,
  squareFootGardenCalculator,
  squareFootagePriceCalculator,
  ssdLifespanCalculator,
  standardVsItemizedCalculator,
  stockOptionTaxCalculator,
  storageRaidCalculator,
  streamingCostCalculator,
  studentLoanRefinanceCalculator,
  subnetMaskCalculator,
  subscriptionTrackerCalculator,
  sugarSubstituteCalculator,
  tennesseeSalesTaxCalculator,
  texasSalesTaxCalculator,
  throughputCalculator,
  timeCapsuleCalculator,
  tipEtiquetteCalculator,
  titleInsuranceCalculator,
  titleLoanCalculator,
  transferTaxCalculator,
  treeMulchRingCalculator,
  troyOzToGrams,
  turtleTankSizeCalculator,
  uptimeCalculator,
  vacationRentalCalculator,
  vegetableGardenSizeCalculator,
  videoStorageCalculator,
  virginiaSalesTaxCalculator,
  vo2maxEstimateCalculator,
  volumeLoadCalculator,
  w4WithholdingCalculator,
  walkingDistanceCalculator,
  washingtonSalesTaxCalculator,
  waterBottleRefillCalculator,
  waterIntakeFitnessCalculator,
  wateringScheduleCalculator,
  wattHoursToJoules,
  weedKillerMixCalculator,
  wilks2Calculator,
  winePairingCalculator,
  wisconsinSalesTaxCalculator,
  wristCircumferenceCalculator,
  fourOhThreeBCalculator,
  amnioticFluidCalculator,
  annuityPayoutCalculator,
  apScorePredictCalculator,
  apgarCalculator,
  atvInsuranceCalculator,
  babyBathTempCalculator,
  babyBottleAmountCalculator,
  babyFoodIntroCalculator,
  babyGrowthSpurtCalculator,
  babyNameMeaningCalculator,
  babyProofingCalculator,
  babyShoeSizeCalculator,
  babyToothCalculator,
  baristaFireCalculator,
  baseboardHeatCalculator,
  bathroomRemodelCostCalculator,
  bernoulliEquationCalculator,
  boatFuelCalcCalculator,
  brakePadLifeCalculator,
  breastfeedingTimerCalculator,
  capacitorEnergyCalculator,
  carBatteryLifeCalculator,
  carDepreciationYearsCalculator,
  carMaintenanceCostCalculator,
  carSeatAgeCalculator,
  carSoundSystemCalculator,
  carTotalCostCalculator,
  carVsUberCalculator,
  carWashSavingsCalculator,
  carWaxCoverageCalculator,
  cargoSpaceCalculator,
  ceilingFanSizeCalculator,
  centralAcCostCalculator,
  chainFenceCalculator,
  cinderBlockWallCalculator,
  citationGeneratorCalculator,
  classScheduleCalculator,
  closetOrganizerCostCalculator,
  coastFireCalculator,
  cobraCostCalculator,
  collegeAcceptanceCalculator,
  collegeGpaCalculator,
  collegeSavingsBabyCalculator,
  commuteFuelCostCalculator,
  concreteFootingCalcCalculator,
  contractionCounterCalculator,
  creditHoursCalculator,
  curtainRodCalculator,
  dashCamStorageCalculator,
  daycareCostCalculator,
  deckCostCalculator,
  decomposedGraniteCalcCalculator,
  dentalInsuranceCalculator,
  diaperSizeCalculator,
  disabilityInsuranceCalculator,
  doorReplacementCostCalculator,
  dormRoomSetupCalculator,
  drivewayCostCalculator,
  dropCeilingCalcCalculator,
  elasticCollisionCalculator,
  electricFieldCalculator,
  emissionTestCostCalculator,
  engineOilChangeCalculator,
  evChargingCostCalculator,
  evRangeCalculator,
  evSavingsCalculator,
  faradayLawCalculator,
  fenceCostCalculator,
  fetalWeightCalculator,
  financialAidEstimateCalculator,
  fireNumberCalculator,
  flagstonePatioCalculator,
  flashcardRetentionCalculator,
  frenchDrainCalcCalculator,
  frequencyWavelengthCalculator,
  garageDoorCostCalculator,
  gestationalAgeCalculator,
  gradeNeededCalculator,
  gutterCostCalculator,
  gutterSizingCalculator,
  hardwoodFloorCostCalculator,
  healthInsuranceCostCalculator,
  heatTransferCalculator,
  highSchoolGpaCalculator,
  houseWrapCalcCalculator,
  hybridSavingsCalculator,
  idealGasCalcCalculator,
  impulseCalculator,
  inelasticCollisionCalculator,
  internshipValueCalculator,
  iraContributionCalculator,
  kineticEnergyCalcCalculator,
  kitchenCabinetCostCalculator,
  kitchenRemodelCostCalculator,
  landscapeBorderCalculator,
  landscapeFabricCalcCalculator,
  landscapeStoneCalculator,
  landscapingCostCalculator,
  leanFireCalculator,
  longTermCareCalculator,
  magneticForceCalculator,
  mealPlanCostCalculator,
  medicareCostCalculator,
  metalPanelCalculator,
  mirrorEquationCalculator,
  motorcycleInsuranceCalculator,
  movingTruckSizeCalculator,
  nicuStayCalculator,
  noteTakingSpeedCalculator,
  nurseryRoomCalculator,
  parallelCapacitorsCalculator,
  parallelResistorsCalculator,
  patioCostCalculator,
  patioPaverCalcCalculator,
  peaGravelCalcCalculator,
  pellGrantCalculator,
  pensionVsLumpSumCalculator,
  playgroundSurfaceCalculator,
  postHoleCalcCalculator,
  postpartumDepressionCalculator,
  potentialEnergyCalcCalculator,
  powerPhysicsCalculator,
  pregnancyDueDateIvfCalculator,
  pumpingScheduleCalculator,
  railroadTieCalcCalculator,
  registrationFeeCalculator,
  requiredSavingsRateCalculator,
  retirementGapCalculator,
  retirementIncomeCalculator,
  retirementSavingsNeededCalculator,
  riverRockCalcCalculator,
  roofReplacementCostCalculator,
  roomPaintCostCalculator,
  satToActCalculator,
  scholarshipOddsCalculator,
  sepIraCalculator,
  septicTankSizeCalculator,
  seriesCapacitorsCalculator,
  seriesResistorsCalculator,
  sidingCostCalculator,
  simpleIraCalculator,
  sleepRegressionCalculator,
  snellsLawCalculator,
  socialSecurityAgeCalculator,
  specificHeatCalcCalculator,
  springForceCalculator,
  steppingStoneCalcCalculator,
  stoneWallCalculator,
  storageUnitSizeCalculator,
  stuccoCoverageCalculator,
  studentLoanPaymentCalculator,
  studentMonthlyBudgetCalculator,
  studyAbroadCostCalculator,
  studyBreakCalculator,
  syntheticTurfCalculator,
  termLifeInsuranceCalculator,
  textbookCostCalculator,
  thesisTimelineCalculator,
  thinLensCalculator,
  tireWearCalculator,
  toddlerHeightCalculator,
  towingMpgCalculator,
  vaporBarrierCalcCalculator,
  visionInsuranceCalculator,
  waterSoftenerSizeCalculator,
  waveSpeedCalculator,
  weightedGpaCalcCalculator,
  wellDepthCalculator,
  wholeLifeInsuranceCalculator,
  windowReplacementCostCalculator,
  windowTintCalculator,
  workDoneCalculator,
  workStudyHoursCalculator,
  airlineMilesValue,
  altitudeAdjustment,
  backpackingCost,
  beachVacationCost,
  campingChecklistCost,
  carryOnWeight,
  cruiseTip,
  currencyConverterTrip,
  customsDuty,
  disneyTripCost,
  distanceBetweenCities,
  drivingDistance,
  dutyFreeSavings,
  hotelPointsValue,
  internationalCallCost,
  luggageSize,
  roadTripCost,
  skiTripCost,
  timezoneConverter,
  travelAdapter,
  travelBudgetDaily,
  travelPointsValue,
  travelTipGuide,
  travelVaccineCost,
  vacationDaysNeeded,
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
