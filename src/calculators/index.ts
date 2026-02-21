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
