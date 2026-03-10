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
import { atvInsuranceCalculator } from "./atv-insurance";
import { babyBathTempCalculator } from "./baby-bath-temp";
import { babyBottleAmountCalculator } from "./baby-bottle-amount";
import { babyFoodIntroCalculator } from "./baby-food-intro";
import { babyGrowthSpurtCalculator } from "./baby-growth-spurt";
import { babyNameMeaningCalculator } from "./baby-name-meaning";
import { babyProofingCalculator } from "./baby-proofing";
import { babyShoeSizeCalculator } from "./baby-shoe-size";
import { babyToothCalculator } from "./baby-tooth";
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
import { classScheduleCalculator } from "./class-schedule";
import { closetOrganizerCostCalculator } from "./closet-organizer-cost";
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
import { zeroToSixtyCalculator } from "./0-60-calculator";
import { threeDPrintingCostCalculator } from "./3d-printing-cost";
import { wendler531Calculator } from "./531-calculator";
import { fiveKPaceCalculator } from "./5k-pace";
import { addTimeCalc } from "./add-time-calc";
import { airbnbProfitCalculator } from "./airbnb-profit-calc";
import { alcoholUnitsCalculator } from "./alcohol-units";
import { anesthesiaRiskCalculator } from "./anesthesia-risk";
import { apyCalculator } from "./apy-calculator";
import { aquariumCo2Calculator } from "./aquarium-co2";
import { archerySightTapeCalculator } from "./archery-sight-tape";
import { arvCalculator } from "./arv-calculator";
import { ascvdRiskCalculator } from "./ascvd-risk";
import { babyAgeCalc } from "./baby-age-calc";
import { babyPercentileCalculator } from "./baby-percentile";
import { bailCalculator } from "./bail-calculator";
import { bbqSmokingTimeCalculator } from "./bbq-smoking-time";
import { beerBrewingCalculator } from "./beer-brewing-calc";
import { benadrylDosageCalculator } from "./benadryl-dosage";
import { benchPressCalcCalculator } from "./bench-press-calc";
import { bloodTypeInheritanceCalculator } from "./blood-type-inheritance";
import { boardBattenCalculator } from "./board-batten-calc";
import { boardGamePlayerCalculator } from "./board-game-player";
import { breastCancerRiskCalculator } from "./breast-cancer-risk";
import { brineCalculator } from "./brine-calculator";
import { bunCreatinineRatioCalculator } from "./bun-creatinine-ratio";
import { cakePricingCalculator } from "./cake-pricing-calc";
import { candleWaxCalcCalculator } from "./candle-wax-calc";
import { carAffordabilityMonthlyCalculator } from "./car-affordability-monthly";
import { carInsuranceEstimateCalculator } from "./car-insurance-estimate";
import { carLeaseCalculator } from "./car-lease-calc";
import { carbCalculator } from "./carb-calculator";
import { cardiacOutputCalculator } from "./cardiac-output";
import { cateringServingCalculator } from "./catering-serving-calc";
import { cdCalculator } from "./cd-calculator";
import { childHeightPercentileCalculator } from "./child-height-percentile";
import { chocolateToxicityCalculator } from "./chocolate-toxicity";
import { chronologicalAgeCalc } from "./chronological-age-calc";
import { clothingSizeConvertCalculator } from "./clothing-size-convert";
import { coldBrewRatioCalculator } from "./cold-brew-ratio";
import { combinationCalc } from "./combination-calc";
import { concreteColumnCalculator } from "./concrete-column";
import { concreteSlabCalculator } from "./concrete-slab";
import { concreteStairsCalculator } from "./concrete-stairs";
import { consultingRateCalc } from "./consulting-rate-calc";
import { continuousCompoundCalculator } from "./continuous-compound";
import { cookingAltitudeAdjustCalculator } from "./cooking-altitude-adjust";
import { countdownCalculator } from "./countdown-calculator";
import { cupsToGramsCalculator } from "./cups-to-grams";
import { cyclingCaloriesCalculator } from "./cycling-calories";
import { deadliftCalcCalculator } from "./deadlift-calc";
import { debtAvalancheCalculator } from "./debt-avalanche";
import { decimalToFractionConverter } from "./decimal-to-fraction";
import { discGolfRatingCalculator } from "./disc-golf-rating";
import { dividendYieldCalc } from "./dividend-yield-calc";
import { dndEncounterCalculator } from "./dnd-encounter";
import { dogFoodCalculator } from "./dog-food-calculator";
import { droneFlightTimeCalculator } from "./drone-flight-time";
import { drugHalfLifeCalculator } from "./drug-half-life";
import { effectiveInterestRateCalculator } from "./effective-interest-rate";
import { embroideryThreadCalculator } from "./embroidery-thread";
import { engineHpCalculator } from "./engine-hp-calc";
import { epoxyResinCalcCalculator } from "./epoxy-resin-calc";
import { epworthSleepinessCalculator } from "./epworth-sleepiness";
import { factorCalculator } from "./factor-calculator";
import { fatBurningZoneCalculator } from "./fat-burning-zone";
import { fatIntakeCalcCalculator } from "./fat-intake-calc";
import { fiberCalculator } from "./fiber-calculator";
import { filamentUsageCalculator } from "./filament-usage";
import { fractionToDecimalConverter } from "./fraction-to-decimal";
import { freshToDryHerbCalculator } from "./fresh-to-dry-herb";
import { fuelCostTripCalculator } from "./fuel-cost-trip";
import { garlicConverterCalculator } from "./garlic-converter";
import { gcfCalculator } from "./gcf-calculator";
import { gramsToCupsCalculator } from "./grams-to-cups";
import { gramsToTablespoonsCalculator } from "./grams-to-tablespoons";
import { grossRentMultiplierCalculator } from "./gross-rent-multiplier";
import { guitarStringTensionCalculator } from "./guitar-string-tension";
import { halfMarathonPaceCalculator } from "./half-marathon-pace";
import { hamCookingTimeCalculator } from "./ham-cooking-time";
import { heartRateZoneCalculator } from "./heart-rate-zone";
import { hexToDecimalConverter } from "./hex-to-decimal";
import { hikingCaloriesCalculator } from "./hiking-calories";
import { homaIrCalculator } from "./homa-ir-calc";
import { iifymCalculator } from "./iifym-calculator";
import { immigrationWaitTimeCalculator } from "./immigration-wait-time";
import { jumpRopeCaloriesCalculator } from "./jump-rope-calories";
import { ketoMacroCalculator } from "./keto-macro";
import { knittingYarnCalcCalculator } from "./knitting-yarn-calc";
import { ladderAngleCalculator } from "./ladder-angle-calc";
import { lcmCalculator } from "./lcm-calculator";
import { leatherWorkingCalculator } from "./leather-working";
import { legalFeeCalc } from "./legal-fee-calc";
import { lifeExpectancyCalculator } from "./life-expectancy-calc";
import { logCalculator } from "./log-calculator";
import { lotteryTaxCalculator } from "./lottery-tax-calc";
import { lumberWeightCalculator } from "./lumber-weight-calc";
import { maintenanceCaloriesCalculator } from "./maintenance-calories";
import { mapBloodPressureCalculator } from "./map-blood-pressure";
import { marathonPaceCalculator } from "./marathon-pace";
import { maxHeartRateCalculator } from "./max-heart-rate";
import { melatoninDosageCalculator } from "./melatonin-dosage";
import { metalWeightCalculator } from "./metal-weight-calc";
import { mlToGramsCalculator } from "./ml-to-grams";
import { modelScaleCalculator } from "./model-scale";
import { moneyMarketCalc } from "./money-market-calc";
import { octalConverter } from "./octal-converter";
import { overtimePayCalc } from "./overtime-pay-calc";
import { ozempicDosageCalculator } from "./ozempic-dosage";
import { packYearCalculator } from "./pack-year-calc";
import { paintMixingRatioCalculator } from "./paint-mixing-ratio";
import { pancakeBatchCalculator } from "./pancake-batch";
import { partyDrinkCalculator } from "./party-drink-calc";
import { paverSandCalculator } from "./paver-sand-calc";
import { pediatricDosageCalculator } from "./pediatric-dosage";
import { personalInjurySettlementCalculator } from "./personal-injury-settlement";
import { pondCalculator } from "./pond-calc";
import { potteryGlazeCalculator } from "./pottery-glaze";
import { pregnancyWeightGainCalculator } from "./pregnancy-weight-gain";
import { puppyWeightCalculator } from "./puppy-weight-calc";
import { qtcCalculator } from "./qtc-calculator";
import { quiltingFabricCalculator } from "./quilting-fabric";
import { rcCarGearingCalculator } from "./rc-car-gearing";
import { romanNumeralCalc } from "./roman-numeral-calc";
import { rsuTaxCalc } from "./rsu-tax-calc";
import { salaryComparisonCalculator } from "./salary-comparison";
import { salesForecastCalculator } from "./sales-forecast";
import { selfRisingFlourCalculator } from "./self-rising-flour";
import { sellerNetProceedsCalculator } from "./seller-net-proceeds";
import { sentencingGuidelinesCalculator } from "./sentencing-guidelines";
import { shiplapCalculator } from "./shiplap-calc";
import { sideHustleTaxCalculator } from "./side-hustle-tax";
import { sigFigsCalc } from "./sig-figs-calc";
import { smokingRecoveryCalculator } from "./smoking-recovery";
import { soapMakingCalcCalculator } from "./soap-making-calc";
import { songRoyaltyCalcCalculator } from "./song-royalty-calc";
import { sourdoughCalculator } from "./sourdough-calc";
import { sousVideCalculator } from "./sous-vide-calc";
import { speakerWattageCalculator } from "./speaker-wattage";
import { spiralStaircaseCalculator } from "./spiral-staircase";
import { squatCalcCalculator } from "./squat-calc";
import { ssdiBenefitCalculator } from "./ssdi-benefit";
import { stairCarpetCalculator } from "./stair-carpet-calc";
import { startupCostCalc } from "./startup-cost-calc";
import { statuteLimitationsCalculator } from "./statute-limitations";
import { steakCookingTimeCalculator } from "./steak-cooking-time";
import { steelWeightCalculator } from "./steel-weight-calc";
import { stepsToMilesCalculator } from "./steps-to-miles";
import { stockAverageCalc } from "./stock-average-calc";
import { strideLengthCalcCalculator } from "./stride-length-calc";
import { subtractTimeCalc } from "./subtract-time-calc";
import { swimmingCalorieCalculator } from "./swimming-calorie";
import { thanksgivingCalculator } from "./thanksgiving-calc";
import { thinsetCalculator } from "./thinset-calc";
import { timeToDecimalConverter } from "./time-to-decimal";
import { tylenolDosageCalculator } from "./tylenol-dosage";
import { uncookedToCookedCalculator } from "./uncooked-to-cooked";
import { vinylRecordValueCalculator } from "./vinyl-record-value";
import { wainscotingCalculator } from "./wainscoting-calc";
import { weddingAlcoholCalculator } from "./wedding-alcohol-calc";
import { weightGainCalcCalculator } from "./weight-gain-calc";
import { woodturningBlankCalculator } from "./woodturning-blank";
import { wrongfulTerminationCalculator } from "./wrongful-termination";
import { twelveHourShiftPayCalculator } from "./12-hour-shift-pay";

import { fourOhOneKEmployerMatchCalculator } from "./401k-employer-match";

import { acTonnageCalculator } from "./ac-tonnage-calc";

import { adderallDosageCalculator } from "./adderall-dosage-calc";

import { adiabaticProcessCalculator } from "./adiabatic-process";

import { agiCalculator } from "./agi-calculator";

import { agilityTestCalculator } from "./agility-test-calc";

import { airFilterSizeCalculator } from "./air-filter-size";

import { angularMomentumCalculator } from "./angular-momentum-calc";

import { annualIncomeCalculator } from "./annual-income-calc";

import { anovaTwoWayCalculator } from "./anova-two-way";

import { antibioticDoseCalculator } from "./antibiotic-dose-calc";

import { aquariumHeaterSizeCalculator } from "./aquarium-heater-size";

import { awgToMmCalculator } from "./awg-to-mm-calc";

import { basalBodyTempCalculator } from "./basal-body-temp-calc";

import { bathroomFanSizeCalculator } from "./bathroom-fan-size";

import { bbqPartyCalculator } from "./bbq-party-calc";

import { beamLoadCalculator } from "./beam-load-calc";

import { beehiveHoneyCalculator } from "./beehive-honey-calc";

import { birthdayPartyCostCalculator } from "./birthday-party-cost";

import { blackbodyRadiationCalculator } from "./blackbody-radiation";

import { bloodOxygenCalculator } from "./blood-oxygen-calc";

import { bowlingHandicapCalculator } from "./bowling-handicap-calc";

import { breadProofingCalculator } from "./bread-proofing-calc";

import { breastmilkStorageCalculator } from "./breastmilk-storage-calc";

import { brunchPlannerCalculator } from "./brunch-planner-calc";

import { caffeineNapCalculator } from "./caffeine-nap-calc";

import { calisthenicsProgCalculator } from "./calisthenics-prog-calc";

import { capitalGainsTaxDetailedCalculator } from "./capital-gains-tax-detailed";

import { carnotEfficiencyCalculator } from "./carnot-efficiency";

import { catenaryCalculator } from "./catenary-calc";

import { cellPhonePlanCalculator } from "./cell-phone-plan-calc";

import { cementCalculator } from "./cement-calc";

import { cfmCalculator } from "./cfm-calculator";

import { cha2ds2VascCalculator } from "./cha2ds2-vasc-calc";

import { charcuterieBoardCalculator } from "./charcuterie-board-calc";

import { cheeseBoardCalculator } from "./cheese-board-calc";

import { chickenEggCalculator } from "./chicken-egg-calc";

import { childGrowthChartCalculator } from "./child-growth-chart-calc";

import { childTaxCreditCalculator } from "./child-tax-credit-calc";

import { clomidOvulationCalculator } from "./clomid-ovulation-calc";

import { cocktailRecipeCalculator } from "./cocktail-recipe-calc";

import { coffeeSpendingCalculator } from "./coffee-spending-calc";

import { coldPlungeCalculator } from "./cold-plunge-calc";

import { colorBlindnessSimCalculator } from "./color-blindness-sim";

import { compostingWormCalculator } from "./composting-worm-calc";

import { comptonScatteringCalculator } from "./compton-scattering";

import { concreteBlockFillCalculator } from "./concrete-block-fill";

import { concretePatioCalculator } from "./concrete-patio-calc";

import { concussionAssessmentCalculator } from "./concussion-assessment";

import { continuedFractionCalculator } from "./continued-fraction-calc";

import { cookieExchangeCalculator } from "./cookie-exchange-calc";

import { couponSavingsCalculator } from "./coupon-savings-calc";

import { creditCardInterestCalculator } from "./credit-card-interest-calc";

import { crownRumpLengthCalculator } from "./crown-rump-length-calc";

import { crushedStoneCalculator } from "./crushed-stone-calc";

import { crystalFieldCalculator } from "./crystal-field-calc";

import { cupsToPoundsCalculator } from "./cups-to-pounds-calc";

import { cyclingTrainingPlanCalculator } from "./cycling-training-plan";

import { dartScoreCalculator } from "./dart-score-calc";

import { dataTransferCalculator } from "./data-transfer-calc";

import { dayOfYearCalculator } from "./day-of-year-calc";

import { deckRailingCalculator } from "./deck-railing-calc";

import { dehydratorTimeCalculator } from "./dehydrator-time-calc";

import { dentalCostCalculator } from "./dental-cost-calc";

import { diabetesRiskCalculator } from "./diabetes-risk-calc";

import { diaperUsageCalculator } from "./diaper-usage-calc";

import { diffractionGratingCalculator } from "./diffraction-grating";

import { dividendTaxCalculator } from "./dividend-tax-calc";

import { dpiPpiCalculator } from "./dpi-ppi-calc";

import { earnedIncomeCreditCalculator } from "./earned-income-credit";

import { electricityApplianceCalculator } from "./electricity-appliance-calc";

import { electromagneticWaveCalculator } from "./electromagnetic-wave";

import { evChargingTimeCalculator } from "./ev-charging-time";

import { exhaustFanSizeCalculator } from "./exhaust-fan-size";

import { fantasyTradeCalculator } from "./fantasy-trade-calc";

import { fencePostDepthCalculator } from "./fence-post-depth-calc";

import { fermentationTimeCalculator } from "./fermentation-time-calc";

import { ficaTaxCalculator } from "./fica-tax-calc";

import { flowRateConverterCalculator } from "./flow-rate-converter";

import { foodCostPerServingCalculator } from "./food-cost-per-serving";

import { freezerMealCalculator } from "./freezer-meal-calc";

import { fuelEconomyConverterCalculator } from "./fuel-economy-converter";

import { furnaceSizeCalculator } from "./furnace-size-calc";

import { futureSalaryCalculator } from "./future-salary-calc";

import { gad7AnxietyCalculator } from "./gad7-anxiety-calc";

import { garageSalePriceCalculator } from "./garage-sale-price";

import { gasDiffusionCalculator } from "./gas-diffusion-calc";

import { giftBudgetCalculator } from "./gift-budget-calc";

import { glycemicIndexCalculator } from "./glycemic-index-calc";

import { golfClubDistanceCalculator } from "./golf-club-distance";

import { gramsToTeaspoonsCalculator } from "./grams-to-teaspoons-calc";

import { gravelDrivewayCalculator } from "./gravel-driveway-calc";

import { greenhouseVentilationCalculator } from "./greenhouse-ventilation";

import { guineaPigFoodCalculator } from "./guinea-pig-food-calc";

import { gymMembershipRoiCalculator } from "./gym-membership-roi";

import { hamPerPersonCalculator } from "./ham-per-person-calc";

import { hamsterWheelCalculator } from "./hamster-wheel-calc";

import { hardnessConverterCalculator } from "./hardness-converter";

import { headCircumferenceCalculator } from "./head-circumference-calc";

import { houseCleaningTimeCalculator } from "./house-cleaning-time";

import { hydrationSweatCalculator } from "./hydration-sweat-calc";

import { ibuprofenDosageCalculator } from "./ibuprofen-dosage-calc";

import { instantPotTimeCalculator } from "./instant-pot-time-calc";

import { isothermalProcessCalculator } from "./isothermal-process";

import { kayakSizeCalculator } from "./kayak-size-calc";

import { kombuchaBrewCalculator } from "./kombucha-brew-calc";

import { latteFactorCalculator } from "./latte-factor-calc";

import { laundryCostCalculator } from "./laundry-cost-calc";

import { levothyroxineDoseCalculator } from "./levothyroxine-dose-calc";

import { logicGateCalculator } from "./logic-gate-calc";

import { lumensToWattsCalculator } from "./lumens-to-watts-calc";

import { lutealPhaseCalculator } from "./luteal-phase-calc";

import { magiCalculator } from "./magi-calculator";

import { magneticFieldCalculator } from "./magnetic-field-calc";

import { marathonTrainingCalculator } from "./marathon-training-calc";

import { mashedPotatoesServingCalculator } from "./mashed-potatoes-serving";

import { mealCalorieCalculator } from "./meal-calorie-calc";

import { mealPrepCostCalculator } from "./meal-prep-cost-calc";

import { momentOfInertiaCalculator } from "./moment-of-inertia";

import { mortgageRecastCalculator } from "./mortgage-recast-calc";

import { muscleRecoveryCalculator } from "./muscle-recovery-calc";

import { netToGrossPayCalculator } from "./net-to-gross-pay";

import { nuclearDecayChainCalculator } from "./nuclear-decay-chain";

import { nutritionGapCalculator } from "./nutrition-gap-calc";

import { pValueCalculator } from "./p-value-calc";

import { paperWeightConverterCalculator } from "./paper-weight-converter";

import { paycheckWithholdingCalculator } from "./paycheck-withholding-calc";

import { perfectNumberCalculator } from "./perfect-number-calc";

import { phaseChangeCalculator } from "./phase-change-calc";

import { photoelectricCalculator } from "./photoelectric-calc";

import { phq9DepressionCalculator } from "./phq9-depression-calc";

import { pickleballRatingCalculator } from "./pickleball-rating";

import { pilatesCalorieCalculator } from "./pilates-calorie-calc";

import { plankProgressionCalculator } from "./plank-progression-calc";

import { postFrameBuildingCalculator } from "./post-frame-building";

import { potluckPlannerCalculator } from "./potluck-planner";

import { poundsToCupsCalculator } from "./pounds-to-cups-calc";

import { primeCountingCalculator } from "./prime-counting-calc";

import { prismDispersionCalculator } from "./prism-dispersion";

import { proratedSalaryCalculator } from "./prorated-salary-calc";

import { pullUpProgressionCalculator } from "./pull-up-progression";

import { punchRecipeCalculator } from "./punch-recipe-calc";

import { rValueCalculator } from "./r-value-calc";

import { radiantFloorHeatCalculator } from "./radiant-floor-heat";

import { rafterLengthCalculator } from "./rafter-length-calc";

import { rainGardenCalculator } from "./rain-garden-calc";

import { rainwaterTankCalculator } from "./rainwater-tank-calc";

import { readingSpeedCalculator } from "./reading-speed-calc";

import { realEstateDepreciationCalculator } from "./real-estate-depreciation";

import { rockClimbingGradeCalculator } from "./rock-climbing-grade";

import { saunaSessionCalculator } from "./sauna-session-calc";

import { savingsRateCalculator } from "./savings-rate-calc";

import { screenResolutionCalculator } from "./screen-resolution-calc";

import { setTheoryCalculator } from "./set-theory-calc";

import { skateboardSizeCalculator } from "./skateboard-size-calc";

import { skinCancerRiskCalculator } from "./skin-cancer-risk";

import { sleepQualityScoreCalculator } from "./sleep-quality-score";

import { socialSecurityBreakEvenCalculator } from "./social-security-break-even";

import { solarBatteryCalculator } from "./solar-battery-calc";

import { streamingCostCompareCalculator } from "./streaming-cost-compare";

import { stressLevelCalculator } from "./stress-level-calc";

import { subscriptionAuditCalculator } from "./subscription-audit-calc";

import { surfboardSizeCalculator } from "./surfboard-size-calc";

import { swimmingTrainingCalculator } from "./swimming-training-calc";

import { taxEquivalentYieldCalculator } from "./tax-equivalent-yield";

import { taxLossHarvestCalculator } from "./tax-loss-harvest";

import { threadPitchCalculator } from "./thread-pitch-calc";

import { thriftStoreMarkupCalculator } from "./thrift-store-markup";

import { timeAndHalfCalculator } from "./time-and-half-calc";

import { timezoneSalaryCalculator } from "./timezone-salary-calc";

import { toddlerPortionCalculator } from "./toddler-portion-calc";

import { torqueConverterCalculator } from "./torque-converter-calc";

import { trainingLoadCalculator } from "./training-load-calc";

import { turkeyDefrostCalculator } from "./turkey-defrost-calc";

import { turkeySizeCalculator } from "./turkey-size-calc";

import { typingSpeedTestCalculator } from "./typing-speed-test-calc";

import { vinylFenceCalculator } from "./vinyl-fence-calc";

import { visionAcuityCalculator } from "./vision-acuity-calc";

import { waffleBatchCalculator } from "./waffle-batch-calc";

import { wallSquareFootageCalculator } from "./wall-square-footage-calc";

import { weddingTimelineCalculator } from "./wedding-timeline-calc";

import { weightWatchersCalculator } from "./weight-watchers-calc";

import { whiteboardSizeCalculator } from "./whiteboard-size-calc";

import { wireGaugeAmpacityCalculator } from "./wire-gauge-ampacity";

import { woodBeamSpanCalculator } from "./wood-beam-span-calc";

import { woodFenceCalculator } from "./wood-fence-calc";

import { cryptoStakingCalculator } from "./crypto-staking-calculator";
import { ethereumStakingCalculator } from "./ethereum-staking-calculator";
import { nftProfitCalculator } from "./nft-profit-calculator";
import { bitcoinMiningCalculator } from "./bitcoin-mining-calculator";
import { coveredCallCalculator } from "./covered-call-calculator";
import { fatFireCalculator } from "./fat-fire-calculator";
import { financialIndependenceCalculator } from "./financial-independence-calculator";
import { putOptionCalculator } from "./put-option-calculator";
import { callOptionCalculator } from "./call-option-calculator";
import { optionsGreeksCalculator } from "./options-greeks-calculator";
import { sinkingFundCalculator } from "./sinking-fund-calculator";
import { uberEarningsCalculator } from "./uber-earnings-calculator";
import { lyftEarningsCalculator } from "./lyft-earnings-calculator";
import { freelancerRateCalculator } from "./freelancer-rate-calculator";
import { etsyProfitCalculator } from "./etsy-profit-calculator";
import { ebayProfitCalculator } from "./ebay-profit-calculator";
import { shopifyProfitCalculator } from "./shopify-profit-calculator";
import { dropshippingProfitCalculator } from "./dropshipping-profit-calculator";
import { resaleProfitCalculator } from "./resale-profit-calculator";
import { sideHustleIncomeCalculator } from "./side-hustle-income-calculator";
import { passiveIncomeCalculator } from "./passive-income-calculator";
import { rentalRoiCalculator } from "./rental-roi-calculator";
import { houseHackingCalculator } from "./house-hacking-calculator";
import { brrrrCalculator } from "./brrrr-calculator";
import { wholesaleDealCalculator } from "./wholesale-deal-calculator";
import { sellerClosingCostCalculator } from "./seller-closing-cost-calculator";
import { buyerClosingCostCalculator } from "./buyer-closing-cost-calculator";
import { pointsVsRateCalculator } from "./points-vs-rate-calculator";
import { armVsFixedCalculator } from "./arm-vs-fixed-calculator";
import { cashOutRefiCalculator } from "./cash-out-refi-calculator";
import { jumboMortgageCalculator } from "./jumbo-mortgage-calculator";
import { giftTaxCalculator } from "./gift-tax-calculator";
import { megaBackdoorRothCalculator } from "./mega-backdoor-roth-calculator";
import { hsaSavingsCalculator } from "./hsa-savings-calculator";
import { washSaleCalculator } from "./wash-sale-calculator";
import { quarterlyEstimatedTaxCalculator } from "./quarterly-estimated-tax-calculator";
import { tax1099QuarterlyCalculator } from "./1099-quarterly-tax-calculator";
import { selfEmploymentFicaCalculator } from "./self-employment-fica-calculator";
import { gapInsuranceCalculator } from "./gap-insurance-calculator";
import { pmiRemovalCalculator } from "./pmi-removal-calculator";
import { costOfLivingComparisonCalculator } from "./cost-of-living-comparison-calculator";
import { salaryNegotiationCalculator } from "./salary-negotiation-calculator";
import { equityCompensationCalculator } from "./equity-compensation-calculator";
import { stockOptionValueCalculator } from "./stock-option-value-calculator";
import { weddingCostCalculator } from "./wedding-cost-calculator";
import { studentLoanForgivenessCalculator } from "./student-loan-forgiveness-calculator";
import { rowingCalorieCalculator } from "./rowing-calorie-calculator";
import { stairClimbingCalorieCalculator } from "./stair-climbing-calorie-calculator";
import { ellipticalCalorieCalculator } from "./elliptical-calorie-calculator";
import { martialArtsCalorieCalculator } from "./martial-arts-calorie-calculator";
import { danceCalorieCalculator } from "./dance-calorie-calculator";
import { skiingCalorieCalculator } from "./skiing-calorie-calculator";
import { snowboardingCalorieCalculator } from "./snowboarding-calorie-calculator";
import { stressScoreCalculator } from "./stress-score-calculator";
import { burnoutRiskCalculator } from "./burnout-risk-calculator";
import { sleepQualityCalculator } from "./sleep-quality-calculator";
import { anxietyScoreCalculator } from "./anxiety-score-calculator";
import { depressionScreeningCalculator } from "./depression-screening-calculator";
import { mindfulnessMinutesCalculator } from "./mindfulness-minutes-calculator";
import { spfCalculator } from "./spf-calculator";
import { retinolStrengthCalculator } from "./retinol-strength-calculator";
import { vitaminDDosageCalculator } from "./vitamin-d-dosage-calculator";
import { omega3DosageCalculator } from "./omega3-dosage-calculator";
import { calciumNeedsCalculator } from "./calcium-needs-calculator";
import { magnesiumNeedsCalculator } from "./magnesium-needs-calculator";
import { zincNeedsCalculator } from "./zinc-needs-calculator";
import { bloodPressureRiskCalculator } from "./blood-pressure-risk-calculator";
import { a1cToGlucoseCalculator } from "./a1c-to-glucose-calculator";
import { carbToInsulinCalculator } from "./carb-to-insulin-calculator";
import { kidneyFunctionCalculator } from "./kidney-function-calculator";
import { liverFunctionCalculator } from "./liver-function-calculator";
import { anesthesiaDosageCalculator } from "./anesthesia-dosage-calculator";
import { pediatricWeightCalculator } from "./pediatric-weight-calculator";
import { infantGrowthCalculator } from "./infant-growth-calculator";
import { childGrowthPercentileCalculator } from "./child-growth-percentile-calculator";
import { formulaFeedingCalculator } from "./formula-feeding-calculator";
import { bracesCostCalculator } from "./braces-cost-calculator";
import { ivfCostCalculator } from "./ivf-cost-calculator";
import { contactLensCostCalculator } from "./contact-lens-cost-calculator";
import { wheelchairRampCalculator } from "./wheelchair-ramp-calculator";
import { adaComplianceCalculator } from "./ada-compliance-calculator";
import { dotsScoreCalculator } from "./dots-score-calculator";
import { vo2maxFitnessCalculator } from "./vo2max-fitness-calculator";
import { reverseDietCalculator } from "./reverse-diet-calculator";
import { carbCyclingCalculator } from "./carb-cycling-calculator";
import { veganProteinCalculator } from "./vegan-protein-calculator";
import { electrolyteNeedsCalculator } from "./electrolyte-needs-calculator";
import { sweatRateCalculator } from "./sweat-rate-calculator";
import { altitudeAdjustmentCalculator } from "./altitude-adjustment-calculator";
import { heatIndexExerciseCalculator } from "./heat-index-exercise-calculator";
import { windChillExerciseCalculator } from "./wind-chill-exercise-calculator";
import { matrixDeterminantCalculator } from "./matrix-determinant-calculator";
import { matrixMultiplicationCalculator } from "./matrix-multiplication-calculator";
import { vectorCrossProductCalculator } from "./vector-cross-product-calculator";
import { vectorDotProductCalculator } from "./vector-dot-product-calculator";
import { vectorMagnitudeCalculator } from "./vector-magnitude-calculator";
import { polarToCartesianCalculator } from "./polar-to-cartesian-calculator";
import { cartesianToPolarCalculator } from "./cartesian-to-polar-calculator";
import { eulerFormulaCalculator } from "./euler-formula-calculator";
import { fourierSeriesCalculator } from "./fourier-series-calculator";
import { differentialEquationCalculator } from "./differential-equation-calculator";
import { partialDerivativeCalculator } from "./partial-derivative-calculator";
import { doubleIntegralCalculator } from "./double-integral-calculator";
import { tripleIntegralCalculator } from "./triple-integral-calculator";
import { lineIntegralCalculator } from "./line-integral-calculator";
import { surfaceIntegralCalculator } from "./surface-integral-calculator";
import { divergenceCalculator } from "./divergence-calculator";
import { curlCalculator } from "./curl-calculator";
import { gradientCalculator } from "./gradient-calculator";
import { truthTableCalculator } from "./truth-table-calculator";
import { binaryToHexCalculator } from "./binary-to-hex-calculator";
import { hexToBinaryCalculator } from "./hex-to-binary-calculator";
import { octalConverterCalculator } from "./octal-converter-calculator";
import { pascalTriangleCalculator } from "./pascal-triangle-calculator";
import { catalanNumberCalculator } from "./catalan-number-calculator";
import { stirlingNumberCalculator } from "./stirling-number-calculator";
import { chineseRemainderCalculator } from "./chinese-remainder-calculator";
import { quarticEquationCalculator } from "./quartic-equation-calculator";
import { polynomialRootCalculator } from "./polynomial-root-calculator";
import { polynomialDivisionCalculator } from "./polynomial-division-calculator";
import { remainderTheoremCalculator } from "./remainder-theorem-calculator";
import { rationalRootCalculator } from "./rational-root-calculator";
import { descartesRuleCalculator } from "./descartes-rule-calculator";
import { cramersRuleCalculator } from "./cramers-rule-calculator";
import { gaussEliminationCalculator } from "./gauss-elimination-calculator";
import { leastSquaresCalculator } from "./least-squares-calculator";
import { fTestCalculator } from "./f-test-calculator";
import { tTestCalculator } from "./t-test-calculator";
import { anovaCalculator } from "./anova-calculator";
import { exponentialDistributionCalculator } from "./exponential-distribution-calculator";
import { geometricDistributionCalculator } from "./geometric-distribution-calculator";
import { carbonOffsetCalculator } from "./carbon-offset-calculator";
import { ecologicalFootprintCalculator } from "./ecological-footprint-calculator";
import { energySavingsCalculator } from "./energy-savings-calculator";
import { solarPanelSavingsCalculator } from "./solar-panel-savings-calculator";
import { solarPanelSizeCalculator } from "./solar-panel-size-calculator";
import { evVsGasCalculator } from "./ev-vs-gas-calculator";
import { electricityCarbonCalculator } from "./electricity-carbon-calculator";
import { homeEnergyAuditCalculator } from "./home-energy-audit-calculator";
import { insulationRValueCalculator } from "./insulation-r-value-calculator";
import { hvacSizingCalculator } from "./hvac-sizing-calculator";
import { starMagnitudeCalculator } from "./star-magnitude-calculator";
import { planetaryWeightCalculator } from "./planetary-weight-calculator";
import { hubbleConstantCalculator } from "./hubble-constant-calculator";
import { redshiftCalculator } from "./redshift-calculator";
import { lightYearCalculator } from "./light-year-calculator";
import { parsecCalculator } from "./parsec-calculator";
import { asteroidImpactCalculator } from "./asteroid-impact-calculator";
import { radioactiveDecayCalculator } from "./radioactive-decay-calculator";
import { nuclearBindingEnergyCalculator } from "./nuclear-binding-energy-calculator";
import { massEnergyCalculator } from "./mass-energy-calculator";
import { deBroglieWavelengthCalculator } from "./de-broglie-wavelength-calculator";
import { heisenbergUncertaintyCalculator } from "./heisenberg-uncertainty-calculator";
import { schrodingerEquationCalculator } from "./schrodinger-equation-calculator";
import { wienDisplacementCalculator } from "./wien-displacement-calculator";
import { hendersonHasselbalchCalculator } from "./henderson-hasselbalch-calculator";
import { nernstEquationCalculator } from "./nernst-equation-calculator";
import { arrheniusEquationCalculator } from "./arrhenius-equation-calculator";
import { vanDerWaalsCalculator } from "./van-der-waals-calculator";
import { boyleLawCalculator } from "./boyle-law-calculator";
import { gayLussacLawCalculator } from "./gay-lussac-law-calculator";
import { daltonLawCalculator } from "./dalton-law-calculator";
import { grahamsLawCalculator } from "./grahams-law-calculator";
import { raoultsLawCalculator } from "./raoults-law-calculator";
import { colligativePropertiesCalculator } from "./colligative-properties-calculator";
import { cellDivisionCalculator } from "./cell-division-calculator";
import { hardyWeinbergCalculator } from "./hardy-weinberg-calculator";
import { dilutionFactorCalculator } from "./dilution-factor-calculator";
import { doublingTimeCalculator } from "./doubling-time-calculator";
import { nannyCostCalculator } from "./nanny-cost-calculator";
import { babysitterPayCalculator } from "./babysitter-pay-calculator";
import { babyFormulaCostCalculator } from "./baby-formula-cost-calculator";
import { schoolSupplyCostCalculator } from "./school-supply-cost-calculator";
import { backToSchoolCalculator } from "./back-to-school-calculator";
import { christmasGiftBudgetCalculator } from "./christmas-gift-budget-calculator";
import { holidayBudgetCalculator } from "./holiday-budget-calculator";
import { valentinesBudgetCalculator } from "./valentines-budget-calculator";
import { vacationBudgetCalculator } from "./vacation-budget-calculator";
import { roadTripCostCalculator } from "./road-trip-cost-calculator";
import { campingCostCalculator } from "./camping-cost-calculator";
import { travelPerDiemCalculator } from "./travel-per-diem-calculator";
import { dryCleaningCostCalculator } from "./dry-cleaning-cost-calculator";
import { cleaningSupplyCalculator } from "./cleaning-supply-calculator";
import { groceryBudgetCalculator } from "./grocery-budget-calculator";
import { pantryInventoryCalculator } from "./pantry-inventory-calculator";
import { coffeeCostCalculator } from "./coffee-cost-calculator";
import { smokingCostCalculator } from "./smoking-cost-calculator";
import { alcoholSpendingCalculator } from "./alcohol-spending-calculator";
import { homeGymCostCalculator } from "./home-gym-cost-calculator";
import { bookReadingTimeCalculator } from "./book-reading-time-calculator";
import { audiobookListeningTimeCalculator } from "./audiobook-listening-time-calculator";
import { podcastListeningCalculator } from "./podcast-listening-calculator";
import { tvBingeTimeCalculator } from "./tv-binge-time-calculator";
import { movieMarathonCalculator } from "./movie-marathon-calculator";
import { videoGameCostPerHourCalculator } from "./video-game-cost-per-hour-calculator";
import { petLifetimeCostCalculator } from "./pet-lifetime-cost-calculator";
import { dogWalkingCostCalculator } from "./dog-walking-cost-calculator";
import { catFoodCostCalculator } from "./cat-food-cost-calculator";
import { aquariumCostCalculator } from "./aquarium-cost-calculator";
import { horseOwnershipCostCalculator } from "./horse-ownership-cost-calculator";
import { weddingCateringCalculator } from "./wedding-catering-calculator";
import { weddingPhotographyCalculator } from "./wedding-photography-calculator";
import { weddingVenueCostCalculator } from "./wedding-venue-cost-calculator";
import { obituaryWordCountCalculator } from "./obituary-word-count-calculator";
import { storageUnitCostCalculator } from "./storage-unit-cost-calculator";
import { junkRemovalCostCalculator } from "./junk-removal-cost-calculator";
import { homeStagingCostCalculator } from "./home-staging-cost-calculator";
import { homeAppraisalCostCalculator } from "./home-appraisal-cost-calculator";
import { termiteTreatmentCostCalculator } from "./termite-treatment-cost-calculator";
import { lawnMowingCostCalculator } from "./lawn-mowing-cost-calculator";
import { treeRemovalCostCalculator } from "./tree-removal-cost-calculator";
import { snowRemovalCostCalculator } from "./snow-removal-cost-calculator";
import { gutterCleaningCostCalculator } from "./gutter-cleaning-cost-calculator";
import { pressureWashingCostCalculator } from "./pressure-washing-cost-calculator";
import { windowCleaningCostCalculator } from "./window-cleaning-cost-calculator";
import { carpetCleaningCostCalculator } from "./carpet-cleaning-cost-calculator";
import { upholsteryCleaningCostCalculator } from "./upholstery-cleaning-cost-calculator";
import { carDetailingCostCalculator } from "./car-detailing-cost-calculator";
import { carWrapCostCalculator } from "./car-wrap-cost-calculator";
import { parkingCostCalculator } from "./parking-cost-calculator";
import { tollCostCalculator } from "./toll-cost-calculator";
import { rideshareVsCarCalculator } from "./rideshare-vs-car-calculator";
import { bikeVsCarCalculator } from "./bike-vs-car-calculator";
import { electricScooterCostCalculator } from "./electric-scooter-cost-calculator";
import { internetPlanCalculator } from "./internet-plan-calculator";
import { cableVsStreamingCalculator } from "./cable-vs-streaming-calculator";
import { cordCuttingSavingsCalculator } from "./cord-cutting-savings-calculator";
import { cloudStorageCostCalculator } from "./cloud-storage-cost-calculator";
import { dataBreachRiskCalculator } from "./data-breach-risk-calculator";
import { identityTheftCostCalculator } from "./identity-theft-cost-calculator";
import { vpnCostCalculator } from "./vpn-cost-calculator";
import { websiteHostingCostCalculator } from "./website-hosting-cost-calculator";
import { domainNameValueCalculator } from "./domain-name-value-calculator";
import { appDevelopmentCostCalculator } from "./app-development-cost-calculator";
import { freelanceProjectCostCalculator } from "./freelance-project-cost-calculator";
import { printVsDigitalCalculator } from "./print-vs-digital-calculator";
import { paperUsageCalculator } from "./paper-usage-calculator";
import { inkCostPerPageCalculator } from "./ink-cost-per-page-calculator";
import { envelopeSizeCalculator } from "./envelope-size-calculator";
import { boxSizeCalculator } from "./box-size-calculator";
import { palletCalculator } from "./pallet-calculator";
import { warehouseSpaceCalculator } from "./warehouse-space-calculator";
import { dumpsterSizeCalculator } from "./dumpster-size-calculator";
import { ppcRoiCalculator } from "./ppc-roi-calculator";
import { mrrCalculator } from "./mrr-calculator";
import { arrCalculator } from "./arr-calculator";
import { saasValuationCalculator } from "./saas-valuation-calculator";
import { startupRunwayCalculator } from "./startup-runway-calculator";
import { burnRateCalculator } from "./burn-rate-calculator";
import { capTableCalculator } from "./cap-table-calculator";
import { revenuePerEmployeeCalculator } from "./revenue-per-employee-calculator";
import { clickThroughRateCalculator } from "./click-through-rate-calculator";
import { pageLoadTimeCalculator } from "./page-load-time-calculator";
import { serverUptimeCalculator } from "./server-uptime-calculator";
import { storageIopsCalculator } from "./storage-iops-calculator";
import { networkThroughputCalculator } from "./network-throughput-calculator";
import { latencyCalculator } from "./latency-calculator";
import { concurrentUsersCalculator } from "./concurrent-users-calculator";
import { bandwidthCostCalculator } from "./bandwidth-cost-calculator";
import { cdnCostCalculator } from "./cdn-cost-calculator";
import { awsEc2CostCalculator } from "./aws-ec2-cost-calculator";
import { awsS3CostCalculator } from "./aws-s3-cost-calculator";
import { azureVmCostCalculator } from "./azure-vm-cost-calculator";
import { gcpComputeCostCalculator } from "./gcp-compute-cost-calculator";
import { serverlessCostCalculator } from "./serverless-cost-calculator";
import { dockerResourceCalculator } from "./docker-resource-calculator";
import { kubernetesNodeCalculator } from "./kubernetes-node-calculator";
import { ciCdTimeCalculator } from "./ci-cd-time-calculator";
import { storyPointCalculator } from "./story-point-calculator";
import { technicalDebtCalculator } from "./technical-debt-calculator";
import { developerProductivityCalculator } from "./developer-productivity-calculator";
import { slackMessageCostCalculator } from "./slack-message-cost-calculator";
import { freelanceIncomeTaxCalculator } from "./freelance-income-tax-calculator";
import { contractorVsEmployeeCalculator } from "./contractor-vs-employee-calculator";
import { workFromHomeSavingsCalculator } from "./work-from-home-savings-calculator";
import { bytesToMegabytesCalculator } from "./bytes-to-megabytes-calculator";
import { megabytesToGigabytesCalculator } from "./megabytes-to-gigabytes-calculator";
import { gigabytesToTerabytesCalculator } from "./gigabytes-to-terabytes-calculator";
import { bitrateCalculator } from "./bitrate-calculator";
import { dpiToPpiCalculator } from "./dpi-to-ppi-calculator";
import { pixelsToInchesCalculator } from "./pixels-to-inches-calculator";
import { inchesToPixelsCalculator } from "./inches-to-pixels-calculator";
import { uploadSpeedCalculator } from "./upload-speed-calculator";
import { sampleRateCalculator } from "./sample-rate-calculator";
import { ppiCalculator } from "./ppi-calculator";
import { monitorDistanceCalculator } from "./monitor-distance-calculator";
import { tvSizeCalculator } from "./tv-size-calculator";
import { projectorThrowCalculator } from "./projector-throw-calculator";
import { clothingSizeConverterCalculator } from "./clothing-size-converter-calculator";
import { ringSizeConverterCalculator } from "./ring-size-converter-calculator";
import { braSizeConverterCalculator } from "./bra-size-converter-calculator";
import { hatSizeConverterCalculator } from "./hat-size-converter-calculator";
import { kidsClothingSizeCalculator } from "./kids-clothing-size-calculator";
import { internationalPaperSizeCalculator } from "./international-paper-size-calculator";
import { wireGaugeConverterCalculator } from "./wire-gauge-converter-calculator";
import { paintCoverageCalculator } from "./paint-coverage-calculator";
import { curtainSizeCalculator } from "./curtain-size-calculator";
import { rugSizeCalculator } from "./rug-size-calculator";
import { bedsheetSizeCalculator } from "./bedsheet-size-calculator";
import { posterSizeCalculator } from "./poster-size-calculator";

import { afterRepairValueCalculator } from "./after-repair-value-calculator";
import { pricePerSquareFootCalculator } from "./price-per-square-foot-calculator";
import { houseFlipCalculator } from "./house-flip-calculator";
import { landValueCalculator } from "./land-value-calculator";
import { triplexInvestmentCalculator } from "./triplex-investment-calculator";
import { fourplexInvestmentCalculator } from "./fourplex-investment-calculator";
import { airbnbRevenueCalculator } from "./airbnb-revenue-calculator";
import { vacationRentalIncomeCalculator } from "./vacation-rental-income-calculator";
import { realEstateSyndicationCalculator } from "./real-estate-syndication-calculator";
import { tripleNetLeaseCalculator } from "./triple-net-lease-calculator";
import { leaseVsBuyCalculator } from "./lease-vs-buy-calculator";
import { costSegregationCalculator } from "./cost-segregation-calculator";
import { depreciationRecaptureCalculator } from "./depreciation-recapture-calculator";
import { qualifiedOpportunityZoneCalculator } from "./qualified-opportunity-zone-calculator";
import { muniBondCalculator } from "./muni-bond-calculator";
import { treasuryBondCalculator } from "./treasury-bond-calculator";
import { seriesIBondCalculator } from "./series-i-bond-calculator";
import { cdLadderCalculator } from "./cd-ladder-calculator";
import { cryptoPortfolioCalculator } from "./crypto-portfolio-calculator";
import { defiImpermanentLossSimulatorCalculator } from "./defi-impermanent-loss-simulator";
import { cryptoMiningElectricityCalculator } from "./crypto-mining-electricity-calculator";
import { altcoinProfitCalculator } from "./altcoin-profit-calculator";
import { cryptoAirdropValueCalculator } from "./crypto-airdrop-value-calculator";
import { cryptoLendingCalculator } from "./crypto-lending-calculator";
import { flashLoanCalculator } from "./flash-loan-calculator";
import { cryptoArbitrageCalculator } from "./crypto-arbitrage-calculator";
import { tokenomicsCalculator } from "./tokenomics-calculator";
import { cryptoMarketCapCalculator } from "./crypto-market-cap-calculator";
import { bitcoinHalvingCalculator } from "./bitcoin-halving-calculator";
import { ethereumGasEstimatorCalculator } from "./ethereum-gas-estimator";
import { solanaStakingCalculator } from "./solana-staking-calculator";
import { cardanoStakingCalculator } from "./cardano-staking-calculator";
import { polkadotStakingCalculator } from "./polkadot-staking-calculator";
import { cosmosStakingCalculator } from "./cosmos-staking-calculator";
import { avalancheStakingCalculator } from "./avalanche-staking-calculator";
import { polygonStakingCalculator } from "./polygon-staking-calculator";
import { cryptoFearGreedCalculator } from "./crypto-fear-greed-calculator";
import { bitcoinRainbowChartCalculator } from "./bitcoin-rainbow-chart-calculator";
import { unitEconomicsCalculator } from "./unit-economics-calculator";
import { ltvCacRatioCalculator } from "./ltv-cac-ratio-calculator";
import { paybackPeriodCalculator } from "./payback-period-calculator";
import { contributionMarginCalculator } from "./contribution-margin-calculator";
import { operatingMarginCalculator } from "./operating-margin-calculator";
import { grossMarginCalculator } from "./gross-margin-calculator";
import { ebitdaCalculator } from "./ebitda-calculator";
import { priceElasticityCalculator } from "./price-elasticity-calculator";
import { marketShareCalculator } from "./market-share-calculator";
import { daysSalesOutstandingCalculator } from "./days-sales-outstanding-calculator";
import { accountsPayableTurnoverCalculator } from "./accounts-payable-turnover-calculator";
import { interestCoverageRatioCalculator } from "./interest-coverage-ratio-calculator";
import { freeCashFlowCalculator } from "./free-cash-flow-calculator";
import { disposableIncomeCalculator } from "./disposable-income-calculator";
import { discretionaryIncomeCalculator } from "./discretionary-income-calculator";
import { debtSnowballMethodCalculator } from "./debt-snowball-method-calculator";
import { zeroBasedBudgetCalculator } from "./zero-based-budget-calculator";
import { envelopeBudgetCalculator } from "./envelope-budget-calculator";
import { fiftyThirtyTwentyCalculator } from "./fifty-thirty-twenty-calculator";
import { needsVsWantsCalculator } from "./needs-vs-wants-calculator";
import { financialHealthScoreCalculator } from "./financial-health-score-calculator";
import { moneyMarketCalculator } from "./money-market-calculator";
import { highYieldSavingsCalculator } from "./high-yield-savings-calculator";
import { certificateOfDepositCalculator } from "./certificate-of-deposit-calculator";
import { emergencySavingsCalculator } from "./emergency-savings-calculator";
import { rainyDayFundCalculator } from "./rainy-day-fund-calculator";
import { wealthTaxCalculator } from "./wealth-tax-calculator";
import { luxuryTaxCalculator } from "./luxury-tax-calculator";
import { sinTaxCalculator } from "./sin-tax-calculator";
import { carbonTaxCalculator } from "./carbon-tax-calculator";
import { netCarbsCalculator } from "./net-carbs-calculator";
import { potassiumNeedsCalculator } from "./potassium-needs-calculator";
import { vitaminCCalculator } from "./vitamin-c-calculator";
import { vitaminB12Calculator } from "./vitamin-b12-calculator";
import { folateNeedsCalculator } from "./folate-needs-calculator";
import { biotinCalculator } from "./biotin-calculator";
import { collagenDosageCalculator } from "./collagen-dosage-calculator";
import { probioticsCalculator } from "./probiotics-calculator";
import { turmericDosageCalculator } from "./turmeric-dosage-calculator";
import { ashwagandhaDosageCalculator } from "./ashwagandha-dosage-calculator";
import { coq10DosageCalculator } from "./coq10-dosage-calculator";
import { fishOilCalculator } from "./fish-oil-calculator";
import { glucosamineDosageCalculator } from "./glucosamine-dosage-calculator";
import { preWorkoutCalculator } from "./pre-workout-calculator";
import { postWorkoutNutritionCalculator } from "./post-workout-nutrition-calculator";
import { mealFrequencyCalculator } from "./meal-frequency-calculator";
import { cheatMealCalculator } from "./cheat-meal-calculator";
import { refeedDayCalculator } from "./refeed-day-calculator";
import { dietBreakCalculator } from "./diet-break-calculator";
import { thermicEffectFoodCalculator } from "./thermic-effect-food-calculator";
import { neatCalculator } from "./neat-calculator";
import { restingEnergyExpenditureCalculator } from "./resting-energy-expenditure-calculator";
import { mifflinStJeorCalculator } from "./mifflin-st-jeor-calculator";
import { katchMcardleCalculator } from "./katch-mcardle-calculator";
import { benchPressMaxCalculator } from "./bench-press-max-calculator";
import { overheadPressMaxCalculator } from "./overhead-press-max-calculator";
import { bodyRecompositionCalculator } from "./body-recomposition-calculator";
import { leanBulkCalculator } from "./lean-bulk-calculator";
import { miniCutCalculator } from "./mini-cut-calculator";
import { targetHeartRateZoneCalculator } from "./target-heart-rate-zone-calculator";
import { functionalThresholdPowerCalculator } from "./functional-threshold-power-calculator";
import { cooperTestCalculator } from "./cooper-test-calculator";
import { beepTestCalculator } from "./beep-test-calculator";
import { pushupTestCalculator } from "./pushup-test-calculator";
import { situpTestCalculator } from "./situp-test-calculator";
import { plankTestCalculator } from "./plank-test-calculator";
import { bodyTypeCalculator } from "./body-type-calculator";
import { wristSizeCalculator } from "./wrist-size-calculator";
import { ankleSizeCalculator } from "./ankle-size-calculator";
import { rockClimbingCalorieCalculator } from "./rock-climbing-calorie-calculator";
import { surfingCalorieCalculator } from "./surfing-calorie-calculator";
import { skateboardingCalorieCalculator } from "./skateboarding-calorie-calculator";
import { kayakingCalorieCalculator } from "./kayaking-calorie-calculator";
import { tennisCalorieCalculator } from "./tennis-calorie-calculator";
import { basketballCalorieCalculator } from "./basketball-calorie-calculator";
import { soccerCalorieCalculator } from "./soccer-calorie-calculator";
import { volleyballCalorieCalculator } from "./volleyball-calorie-calculator";
import { badmintonCalorieCalculator } from "./badminton-calorie-calculator";
import { tableTennisCalorieCalculator } from "./table-tennis-calorie-calculator";
import { golfCalorieCalculator } from "./golf-calorie-calculator";
import { horsebackRidingCalorieCalculator } from "./horseback-riding-calorie-calculator";
import { iceSkatingCalorieCalculator } from "./ice-skating-calorie-calculator";
import { rollerSkatingCalorieCalculator } from "./roller-skating-calorie-calculator";
import { trampolineCalorieCalculator } from "./trampoline-calorie-calculator";
import { waterPoloCalorieCalculator } from "./water-polo-calorie-calculator";
import { crossfitCalorieCalculator } from "./crossfit-calorie-calculator";
import { spinningCalorieCalculator } from "./spinning-calorie-calculator";
import { zumbaCalorieCalculator } from "./zumba-calorie-calculator";
import { hexagonCalculator } from "./hexagon-calculator";
import { octagonCalculator } from "./octagon-calculator";
import { pentagonCalculator } from "./pentagon-calculator";
import { rhombusCalculator } from "./rhombus-calculator";
import { parallelogramCalculator } from "./parallelogram-calculator";
import { ellipseCalculator } from "./ellipse-calculator";
import { ellipsoidCalculator } from "./ellipsoid-calculator";
import { torusCalculator } from "./torus-calculator";
import { frustumCalculator } from "./frustum-calculator";
import { tetrahedronCalculator } from "./tetrahedron-calculator";
import { dodecahedronCalculator } from "./dodecahedron-calculator";
import { icosahedronCalculator } from "./icosahedron-calculator";
import { irregularPolygonCalculator } from "./irregular-polygon-calculator";
import { segmentAreaCalculator } from "./segment-area-calculator";
import { annulusCalculator } from "./annulus-calculator";
import { centralAngleCalculator } from "./central-angle-calculator";
import { tangentLineCalculator } from "./tangent-line-calculator";
import { greatCircleCalculator } from "./great-circle-calculator";
import { sphericalTriangleCalculator } from "./spherical-triangle-calculator";
import { primeFactorizationCalculator } from "./prime-factorization-calculator";
import { lcmHcfCalculator } from "./lcm-hcf-calculator";
import { modularExponentiationCalculator } from "./modular-exponentiation-calculator";
import { eulersTotientCalculator } from "./eulers-totient-calculator";
import { lucasNumberCalculator } from "./lucas-number-calculator";
import { tribonacciCalculator } from "./tribonacci-calculator";
import { collatzConjectureCalculator } from "./collatz-conjecture-calculator";
import { happyNumberCalculator } from "./happy-number-calculator";
import { amicableNumberCalculator } from "./amicable-number-calculator";
import { narcissisticNumberCalculator } from "./narcissistic-number-calculator";
import { palindromeNumberCalculator } from "./palindrome-number-calculator";
import { armstrongNumberCalculator } from "./armstrong-number-calculator";
import { abundantNumberCalculator } from "./abundant-number-calculator";
import { deficientNumberCalculator } from "./deficient-number-calculator";
import { harshadNumberCalculator } from "./harshad-number-calculator";
import { kaprekarNumberCalculator } from "./kaprekar-number-calculator";
import { smithNumberCalculator } from "./smith-number-calculator";
import { mersennePrimeCalculator } from "./mersenne-prime-calculator";
import { twinPrimeCalculator } from "./twin-prime-calculator";
import { hypergeometricCalculator } from "./hypergeometric-calculator";
import { negativeBinomialCalculator } from "./negative-binomial-calculator";
import { betaDistributionCalculator } from "./beta-distribution-calculator";
import { gammaDistributionCalculator } from "./gamma-distribution-calculator";
import { weibullDistributionCalculator } from "./weibull-distribution-calculator";
import { logNormalCalculator } from "./log-normal-calculator";
import { uniformDistributionCalculator } from "./uniform-distribution-calculator";
import { multinomialCalculator } from "./multinomial-calculator";
import { kurtosisCalculator } from "./kurtosis-calculator";
import { skewnessCalculator } from "./skewness-calculator";
import { percentileCalculator } from "./percentile-calculator";
import { quartileCalculator } from "./quartile-calculator";
import { outlierCalculator } from "./outlier-calculator";
import { machNumberCalculator } from "./mach-number-calculator";
import { poiseuilleLawCalculator } from "./poiseuille-law-calculator";
import { hookesLawCalculator } from "./hookes-law-calculator";
import { youngsModulusCalculator } from "./youngs-modulus-calculator";
import { shearStressCalculator } from "./shear-stress-calculator";
import { bulkModulusCalculator } from "./bulk-modulus-calculator";
import { centrifugalForceCalculator } from "./centrifugal-force-calculator";
import { coriolisEffectCalculator } from "./coriolis-effect-calculator";
import { gravitationalPotentialCalculator } from "./gravitational-potential-calculator";
import { simpleHarmonicMotionCalculator } from "./simple-harmonic-motion-calculator";
import { molecularWeightCalculator } from "./molecular-weight-calculator";
import { dilutionCalculatorChemCalculator } from "./dilution-calculator-chem";
import { cellPotentialCalculator } from "./cell-potential-calculator";
import { bornHaberCycleCalculator } from "./born-haber-cycle-calculator";
import { earthquakeMagnitudeCalculator } from "./earthquake-magnitude-calculator";
import { richterScaleCalculator } from "./richter-scale-calculator";
import { windSpeedCalculator } from "./wind-speed-calculator";
import { airQualityCalculator } from "./air-quality-calculator";
import { soundWavelengthCalculator } from "./sound-wavelength-calculator";
import { lightPollutionCalculator } from "./light-pollution-calculator";
import { rainwaterHarvestingCalculator } from "./rainwater-harvesting-calculator";
import { greywaterCalculator } from "./greywater-calculator";
import { treeCarbonSequestrationCalculator } from "./tree-carbon-sequestration-calculator";
import { roomPaintCalculator } from "./room-paint-calculator";
import { fenceStainCalculator } from "./fence-stain-calculator";
import { epoxyFloorCalculator } from "./epoxy-floor-calculator";
import { kitchenRemodelCalculator } from "./kitchen-remodel-calculator";
import { bathroomRemodelCalculator } from "./bathroom-remodel-calculator";
import { basementFinishingCalculator } from "./basement-finishing-calculator";
import { atticInsulationCalculator } from "./attic-insulation-calculator";
import { sprayFoamCalculator } from "./spray-foam-calculator";
import { blownInInsulationCalculator } from "./blown-in-insulation-calculator";
import { radiantFloorCostCalculator } from "./radiant-floor-cost-calculator";
import { tanklessWaterHeaterCalculator } from "./tankless-water-heater-calculator";
import { solarWaterHeaterCalculator } from "./solar-water-heater-calculator";
import { sumpPumpSizeCalculator } from "./sump-pump-size-calculator";
import { generatorSizeCalculator } from "./generator-size-calculator";
import { standbyGeneratorCalculator } from "./standby-generator-calculator";
import { batteryBackupCalculator } from "./battery-backup-calculator";
import { surgeProtectorCalculator } from "./surge-protector-calculator";
import { wholeHouseFanCalculator } from "./whole-house-fan-calculator";
import { airPurifierSizeCalculator } from "./air-purifier-size-calculator";
import { waterFilterCalculator } from "./water-filter-calculator";
import { reverseOsmosisCalculator } from "./reverse-osmosis-calculator";
import { toddlerShoeSizeCalculator } from "./toddler-shoe-size-calculator";
import { childWeightPercentileCalculator } from "./child-weight-percentile-calculator";
import { screenTimeKidsCalculator } from "./screen-time-kids-calculator";
import { allowanceCalculator } from "./allowance-calculator";
import { choreChartCalculator } from "./chore-chart-calculator";
import { birthdayAgeCalculator } from "./birthday-age-calculator";
import { petFoodAmountCalculator } from "./pet-food-amount-calculator";
import { fishTankVolumeCalculator } from "./fish-tank-volume-calculator";
import { terrariumSizeCalculator } from "./terrarium-size-calculator";
import { hotTubVolumeCalculator } from "./hot-tub-volume-calculator";
import { airportTransferCalculator } from "./airport-transfer-calculator";
import { hotelTaxCalculator } from "./hotel-tax-calculator";
import { resortFeeCalculator } from "./resort-fee-calculator";
import { travelInsuranceCostCalculator } from "./travel-insurance-cost-calculator";
import { passportRenewalCalculator } from "./passport-renewal-calculator";
import { visaCostCalculator } from "./visa-cost-calculator";
import { currencyExchangeFeeCalculator } from "./currency-exchange-fee-calculator";
import { dutyFreeSavingsCalculator } from "./duty-free-savings-calculator";
import { milesToKmWalkingCalculator } from "./miles-to-km-walking-calculator";
import { walkingTimeCalculator } from "./walking-time-calculator";
import { hikingTimeCalculator } from "./hiking-time-calculator";
import { cyclingDistanceCalculator } from "./cycling-distance-calculator";
import { motorcycleFuelCalculator } from "./motorcycle-fuel-calculator";
import { electricBikeRangeCalculator } from "./electric-bike-range-calculator";
import { scooterRangeCalculator } from "./scooter-range-calculator";
import { breadFlourCalculator } from "./bread-flour-calculator";
import { cocktailMixerCalculator } from "./cocktail-mixer-calculator";
import { coffeeWaterRatioCalculator } from "./coffee-water-ratio-calculator";
import { espressoDoseCalculator } from "./espresso-dose-calculator";
import { teaBrewingCalculator } from "./tea-brewing-calculator";
import { smokerCookTimeCalculator } from "./smoker-cook-time-calculator";
import { bbqMeatCalculator } from "./bbq-meat-calculator";
import { hamSizeCalculator } from "./ham-size-calculator";
import { roastSizeCalculator } from "./roast-size-calculator";
import { pastaPortionCalculator } from "./pasta-portion-calculator";
import { frostingAmountCalculator } from "./frosting-amount-calculator";
import { fondantCalculator } from "./fondant-calculator";
import { jamSugarRatioCalculator } from "./jam-sugar-ratio-calculator";
import { canningJarCalculator } from "./canning-jar-calculator";
import { foodCostPercentageCalculator } from "./food-cost-percentage-calculator";
import { eventBudgetCalculator } from "./event-budget-calculator";
import { seatingArrangementCalculator } from "./seating-arrangement-calculator";
import { tentSizeCalculator } from "./tent-size-calculator";
import { stageSizeCalculator } from "./stage-size-calculator";
import { soundSystemCalculator } from "./sound-system-calculator";
import { photoBoothCostCalculator } from "./photo-booth-cost-calculator";
import { djCostCalculator } from "./dj-cost-calculator";
import { bandCostCalculator } from "./band-cost-calculator";
import { floristCostCalculator } from "./florist-cost-calculator";
import { invitationCostCalculator } from "./invitation-cost-calculator";
import { thankYouCardCalculator } from "./thank-you-card-calculator";
import { babyShowerCalculator } from "./baby-shower-calculator";
import { bridalShowerCalculator } from "./bridal-shower-calculator";
import { bachelorPartyCalculator } from "./bachelor-party-calculator";
import { retirementPartyCalculator } from "./retirement-party-calculator";
import { anniversaryPartyCalculator } from "./anniversary-party-calculator";
import { newtonToPoundForceCalculator } from "./newton-to-pound-force-calculator";
import { pascalToAtmCalculator } from "./pascal-to-atm-calculator";
import { barToPsiCalculator } from "./bar-to-psi-calculator";
import { torrToPascalCalculator } from "./torr-to-pascal-calculator";
import { calorieToKilojouleCalculator } from "./calorie-to-kilojoule-calculator";
import { btuToWattCalculator } from "./btu-to-watt-calculator";
import { horsepowerToKilowattCalculator } from "./horsepower-to-kilowatt-calculator";
import { knotToMphCalculator } from "./knot-to-mph-calculator";
import { lightYearToKmCalculator } from "./light-year-to-km-calculator";
import { astronomicalUnitCalculator } from "./astronomical-unit-calculator";
import { nauticalMileToKmCalculator } from "./nautical-mile-to-km-calculator";
import { fathomToMeterCalculator } from "./fathom-to-meter-calculator";
import { furlongToMeterCalculator } from "./furlong-to-meter-calculator";
import { chainToMeterCalculator } from "./chain-to-meter-calculator";
import { rodToMeterCalculator } from "./rod-to-meter-calculator";
import { leagueToKmCalculator } from "./league-to-km-calculator";
import { handToCmCalculator } from "./hand-to-cm-calculator";
import { stoneToKgCalculator } from "./stone-to-kg-calculator";
import { troyOunceToGramCalculator } from "./troy-ounce-to-gram-calculator";
import { caratToGramCalculator } from "./carat-to-gram-calculator";
import { grainToGramCalculator } from "./grain-to-gram-calculator";
import { dramToGramCalculator } from "./dram-to-gram-calculator";
import { bushelToLiterCalculator } from "./bushel-to-liter-calculator";
import { gillToMlCalculator } from "./gill-to-ml-calculator";
import { firkinToLiterCalculator } from "./firkin-to-liter-calculator";
import { hogsheadToLiterCalculator } from "./hogshead-to-liter-calculator";
import { rankineToKelvinCalculator } from "./rankine-to-kelvin-calculator";
import { radianToGradianCalculator } from "./radian-to-gradian-calculator";
import { steradianToDegreeCalculator } from "./steradian-to-degree-calculator";
import { weberToMaxwellCalculator } from "./weber-to-maxwell-calculator";
import { wifiSpeedTestCalculator } from "./wifi-speed-test-calculator";
import { internetBandwidthCalculator } from "./internet-bandwidth-calculator";
import { vpnSpeedCalculator } from "./vpn-speed-calculator";
import { dnsPropagationCalculator } from "./dns-propagation-calculator";
import { sslCertificateCostCalculator } from "./ssl-certificate-cost-calculator";
import { emailStorageCalculator } from "./email-storage-calculator";
import { cloudBackupCalculator } from "./cloud-backup-calculator";
import { nasStorageCalculator } from "./nas-storage-calculator";
import { raidCalculator } from "./raid-calculator";
import { monitorRefreshRateCalculator } from "./monitor-refresh-rate-calculator";
import { gpuBenchmarkCalculator } from "./gpu-benchmark-calculator";
import { powerSupplyCalculator } from "./power-supply-calculator";
import { upsRuntimeCalculator } from "./ups-runtime-calculator";
import { pcBuildCostCalculator } from "./pc-build-cost-calculator";
import { laptopBatteryLifeCalculator } from "./laptop-battery-life-calculator";
import { phoneBatteryLifeCalculator } from "./phone-battery-life-calculator";
import { tabletBatteryLifeCalculator } from "./tablet-battery-life-calculator";
import { stellarLuminosityCalculator } from "./stellar-luminosity-calculator";
import { stellarMassCalculator } from "./stellar-mass-calculator";
import { stellarRadiusCalculator } from "./stellar-radius-calculator";
import { neutronStarCalculator } from "./neutron-star-calculator";
import { blackHoleMassCalculator } from "./black-hole-mass-calculator";
import { cosmicDistanceLadderCalculator } from "./cosmic-distance-ladder-calculator";
import { galaxyRecessionVelocityCalculator } from "./galaxy-recession-velocity-calculator";
import { darkMatterCalculator } from "./dark-matter-calculator";
import { cosmicMicrowaveBackgroundCalculator } from "./cosmic-microwave-background-calculator";
import { solarEclipseCalculator } from "./solar-eclipse-calculator";
import { lunarEclipseCalculator } from "./lunar-eclipse-calculator";
import { planetTransitCalculator } from "./planet-transit-calculator";
import { cometOrbitCalculator } from "./comet-orbit-calculator";
import { commuteTimeValueCalculator } from "./commute-time-value-calculator";
import { workLifeBalanceCalculator } from "./work-life-balance-calculator";
import { salaryPerHourCalculator } from "./salary-per-hour-calculator";
import { onCallPayCalculator } from "./on-call-pay-calculator";
import { hazardPayCalculator } from "./hazard-pay-calculator";
import { businessMealDeductionCalculator } from "./business-meal-deduction-calculator";
import { professionalDevelopmentRoiCalculator } from "./professional-development-roi-calculator";
import { certificationRoiCalculator } from "./certification-roi-calculator";
import { degreeRoiCalculator } from "./degree-roi-calculator";
import { careerChangeCalculator } from "./career-change-calculator";
import { teaspoonToMlCalculator } from "./teaspoon-to-ml-calculator";
import { tablespoonToMlCalculator } from "./tablespoon-to-ml-calculator";
import { cupToMlCalculator } from "./cup-to-ml-calculator";
import { pintToMlCalculator } from "./pint-to-ml-calculator";
import { quartToLiterCalculator } from "./quart-to-liter-calculator";
import { gallonToLiterExactCalculator } from "./gallon-to-liter-exact-calculator";
import { fluidOunceToMlCalculator } from "./fluid-ounce-to-ml-calculator";
import { dryOunceToGramCalculator } from "./dry-ounce-to-gram-calculator";
import { groupExpenseCalculator } from "./group-expense-calculator";
import { roommateExpenseCalculator } from "./roommate-expense-calculator";
import { utilitySplitCalculator } from "./utility-split-calculator";
import { choreTimeCalculator } from "./chore-time-calculator";
import { errandTimeCalculator } from "./errand-time-calculator";
import { mealPlanningCalculator } from "./meal-planning-calculator";
import { weeklyGroceryCalculator } from "./weekly-grocery-calculator";
import { cashbackCalculator } from "./cashback-calculator";
import { rewardsPointsCalculator } from "./rewards-points-calculator";
import { frequentFlyerCalculator } from "./frequent-flyer-calculator";
import { hotelPointsCalculator } from "./hotel-points-calculator";
import { creditCardRewardsCalculator } from "./credit-card-rewards-calculator";
import { priceMatchCalculator } from "./price-match-calculator";
import { unitPriceCalculator } from "./unit-price-calculator";
import { costPerUseCalculator } from "./cost-per-use-calculator";
import { costPerWearCalculator } from "./cost-per-wear-calculator";
import { subscriptionCancelCalculator } from "./subscription-cancel-calculator";
import { freeTrialTrackerCalculator } from "./free-trial-tracker-calculator";

import { tattooCostCalculator } from "./tattoo-cost-calculator";
import { tattooSizeCalculator } from "./tattoo-size-calculator";
import { tattooSessionTimeCalculator } from "./tattoo-session-time-calculator";
import { tattooHealingTimeCalculator } from "./tattoo-healing-time-calculator";
import { tattooRemovalCostCalculator } from "./tattoo-removal-cost-calculator";
import { tattooTipCalculator } from "./tattoo-tip-calculator";
import { tattooTouchUpCalculator } from "./tattoo-touch-up-calculator";
import { tattooAftercareCalculator } from "./tattoo-aftercare-calculator";
import { tattooPlacementCalculator } from "./tattoo-placement-calculator";
import { tattooPainLevelCalculator } from "./tattoo-pain-level-calculator";
import { foundationShadeCalculator } from "./foundation-shade-calculator";
import { concealerShadeCalculator } from "./concealer-shade-calculator";
import { hairDyeAmountCalculator } from "./hair-dye-amount-calculator";
import { nailPolishAmountCalculator } from "./nail-polish-amount-calculator";
import { moisturizerAmountCalculator } from "./moisturizer-amount-calculator";
import { sunlessTannerCalculator } from "./sunless-tanner-calculator";
import { eyelashExtensionCalculator } from "./eyelash-extension-calculator";
import { lipFillerCostCalculator } from "./lip-filler-cost-calculator";
import { facialCostCalculator } from "./facial-cost-calculator";
import { hairTransplantCostCalculator } from "./hair-transplant-cost-calculator";
import { microbladingCostCalculator } from "./microblading-cost-calculator";
import { dpsCalculator } from "./dps-calculator";
import { gamingPcBottleneckCalculator } from "./gaming-pc-bottleneck-calculator";
import { gameServerCostCalculator } from "./game-server-cost-calculator";
import { fpsCalculator } from "./fps-calculator";
import { inputLagCalculator } from "./input-lag-calculator";
import { gamingChairSizeCalculator } from "./gaming-chair-size-calculator";
import { gameDownloadTimeCalculator } from "./game-download-time-calculator";
import { esportsPrizeCalculator } from "./esports-prize-calculator";
import { dndDamageCalculator } from "./dnd-damage-calculator";
import { rpgStatCalculator } from "./rpg-stat-calculator";
import { lootDropCalculator } from "./loot-drop-calculator";
import { lawsuitSettlementCalculator } from "./lawsuit-settlement-calculator";
import { attorneyFeeCalculator } from "./attorney-fee-calculator";
import { courtCostCalculator } from "./court-cost-calculator";
import { bailAmountCalculator } from "./bail-amount-calculator";
import { childCustodyCalculator } from "./child-custody-calculator";
import { spousalSupportCalculator } from "./spousal-support-calculator";
import { personalInjuryCalculator } from "./personal-injury-calculator";
import { wrongfulDeathCalculator } from "./wrongful-death-calculator";
import { smallClaimsCalculator } from "./small-claims-calculator";
import { trafficTicketCalculator } from "./traffic-ticket-calculator";
import { duiCostCalculator } from "./dui-cost-calculator";
import { divorceSettlementCalculator } from "./divorce-settlement-calculator";
import { legalMalpracticeCalculator } from "./legal-malpractice-calculator";
import { cropYieldCalculator } from "./crop-yield-calculator";
import { livestockFeedCalculator } from "./livestock-feed-calculator";
import { cattleWeightCalculator } from "./cattle-weight-calculator";
import { stockingRateCalculator } from "./stocking-rate-calculator";
import { hayBaleCalculator } from "./hay-bale-calculator";
import { grainBinCalculator } from "./grain-bin-calculator";
import { farmProfitCalculator } from "./farm-profit-calculator";
import { tractorFuelCalculator } from "./tractor-fuel-calculator";
import { fencePostCalculator } from "./fence-post-calculator";
import { pondStockingCalculator } from "./pond-stocking-calculator";
import { chickenCoopCalculator } from "./chicken-coop-calculator";
import { coverCropCalculator } from "./cover-crop-calculator";
import { cropInsuranceCalculator } from "./crop-insurance-calculator";
import { farmLoanCalculator } from "./farm-loan-calculator";
import { dairyProductionCalculator } from "./dairy-production-calculator";
import { densityAltitudeCalculator } from "./density-altitude-calculator";
import { aircraftWeightBalanceCalculator } from "./aircraft-weight-balance-calculator";
import { fuelBurnRateCalculator } from "./fuel-burn-rate-calculator";
import { takeoffDistanceCalculator } from "./takeoff-distance-calculator";
import { landingDistanceCalculator } from "./landing-distance-calculator";
import { crosswindComponentCalculator } from "./crosswind-component-calculator";
import { trueAirspeedCalculator } from "./true-airspeed-calculator";
import { groundSpeedCalculator } from "./ground-speed-calculator";
import { flightFuelCalculator } from "./flight-fuel-calculator";
import { pilotLogbookCalculator } from "./pilot-logbook-calculator";
import { aircraftRangeCalculator } from "./aircraft-range-calculator";
import { windCorrectionAngleCalculator } from "./wind-correction-angle-calculator";
import { hullSpeedCalculator } from "./hull-speed-calculator";
import { anchorSizeCalculator } from "./anchor-size-calculator";
import { boatFuelConsumptionCalculator } from "./boat-fuel-consumption-calculator";
import { engineHoursCalculator } from "./engine-hours-calculator";
import { boatInsuranceCalculator } from "./boat-insurance-calculator";
import { marinaSlipCostCalculator } from "./marina-slip-cost-calculator";
import { boatWinterizationCalculator } from "./boat-winterization-calculator";
import { sailAreaCalculator } from "./sail-area-calculator";
import { displacementCalculator } from "./displacement-calculator";
import { boatTrailerCalculator } from "./boat-trailer-calculator";
import { watermakerCalculator } from "./watermaker-calculator";
import { marineBatteryCalculator } from "./marine-battery-calculator";
import { lifePathNumberCalculator } from "./life-path-number-calculator";
import { zodiacCompatibilityCalculator } from "./zodiac-compatibility-calculator";
import { birthChartCalculator } from "./birth-chart-calculator";
import { moonSignCalculator } from "./moon-sign-calculator";
import { risingSignCalculator } from "./rising-sign-calculator";
import { chineseZodiacYearCalculator } from "./chinese-zodiac-year-calculator";
import { destinyNumberCalculator } from "./destiny-number-calculator";
import { soulUrgeNumberCalculator } from "./soul-urge-number-calculator";
import { personalYearCalculator } from "./personal-year-calculator";
import { karmicDebtCalculator } from "./karmic-debt-calculator";
import { biorhythmCalculator } from "./biorhythm-calculator";
import { keyTranspositionCalculator } from "./key-transposition-calculator";
import { delayTimeCalculator } from "./delay-time-calculator";
import { reverbTimeCalculator } from "./reverb-time-calculator";
import { decibelAdditionCalculator } from "./decibel-addition-calculator";
import { paSystemCalculator } from "./pa-system-calculator";
import { headphoneAmpCalculator } from "./headphone-amp-calculator";
import { vinylRecordCalculator } from "./vinyl-record-calculator";
import { songLengthCalculator } from "./song-length-calculator";
import { studioCostCalculator } from "./studio-cost-calculator";
import { musicStreamingRoyaltyCalculator } from "./music-streaming-royalty-calculator";
import { metronomeSubdivisionCalculator } from "./metronome-subdivision-calculator";
import { capoTranspositionCalculator } from "./capo-transposition-calculator";
import { boardFeetCalculator } from "./board-feet-calculator";
import { mortiseTenonCalculator } from "./mortise-tenon-calculator";
import { woodGlueCalculator } from "./wood-glue-calculator";
import { sawmillYieldCalculator } from "./sawmill-yield-calculator";
import { plywoodSheetCalculator } from "./plywood-sheet-calculator";
import { hardwoodCostCalculator } from "./hardwood-cost-calculator";
import { woodFinishCalculator } from "./wood-finish-calculator";
import { woodStainCalculator } from "./wood-stain-calculator";
import { pipeDiameterCalculator } from "./pipe-diameter-calculator";
import { drainSlopeCalculator } from "./drain-slope-calculator";
import { toiletFlushCalculator } from "./toilet-flush-calculator";
import { faucetFlowRateCalculator } from "./faucet-flow-rate-calculator";
import { sprinklerHeadCalculator } from "./sprinkler-head-calculator";
import { breakerSizeCalculator } from "./breaker-size-calculator";
import { wireSizeCalculator } from "./wire-size-calculator";
import { conduitFillCalculator } from "./conduit-fill-calculator";
import { electricalPanelCalculator } from "./electrical-panel-calculator";
import { groundRodCalculator } from "./ground-rod-calculator";
import { printTimeEstimatorCalculator } from "./print-time-estimator-calculator";
import { resinVolumeCalculator } from "./resin-volume-calculator";
import { printBedCalculator } from "./print-bed-calculator";
import { layerHeightCalculator } from "./layer-height-calculator";
import { infillCalculator } from "./infill-calculator";
import { nozzleFlowCalculator } from "./nozzle-flow-calculator";
import { filamentDryingCalculator } from "./filament-drying-calculator";
import { printFarmCalculator } from "./print-farm-calculator";
import { stlScalingCalculator } from "./stl-scaling-calculator";
import { tireSizeComparisonCalculator } from "./tire-size-comparison-calculator";
import { gearRatioFinalDriveCalculator } from "./gear-ratio-final-drive-calculator";
import { turboSizingCalculator } from "./turbo-sizing-calculator";
import { compressionRatioCalculator } from "./compression-ratio-calculator";
import { engineBoreStrokeCalculator } from "./engine-bore-stroke-calculator";
import { fuelInjectorSizeCalculator } from "./fuel-injector-size-calculator";
import { intercoolerCalculator } from "./intercooler-calculator";
import { exhaustPipeSizeCalculator } from "./exhaust-pipe-size-calculator";
import { carPaintCalculator } from "./car-paint-calculator";
import { windshieldReplacementCalculator } from "./windshield-replacement-calculator";
import { carShippingCalculator } from "./car-shipping-calculator";
import { vehicleRegistrationCalculator } from "./vehicle-registration-calculator";
import { sewingThreadCalculator } from "./sewing-thread-calculator";
import { zipperLengthCalculator } from "./zipper-length-calculator";
import { elasticCalculator } from "./elastic-calculator";
import { biasTapeCalculator } from "./bias-tape-calculator";
import { buttonSpacingCalculator } from "./button-spacing-calculator";
import { hemAllowanceCalculator } from "./hem-allowance-calculator";
import { patternGradingCalculator } from "./pattern-grading-calculator";
import { seamAllowanceCalculator } from "./seam-allowance-calculator";
import { interfacingCalculator } from "./interfacing-calculator";
import { liningFabricCalculator } from "./lining-fabric-calculator";
import { macrameCordCalculator } from "./macrame-cord-calculator";
import { aquariumWaterVolumeCalculator } from "./aquarium-water-volume-calculator";
import { fishStockingCalculator } from "./fish-stocking-calculator";
import { co2InjectionCalculator } from "./co2-injection-calculator";
import { waterChangeCalculator } from "./water-change-calculator";
import { aquariumSaltCalculator } from "./aquarium-salt-calculator";
import { substrateCalculator } from "./substrate-calculator";
import { aquariumGlassThicknessCalculator } from "./aquarium-glass-thickness-calculator";
import { exposureTriangleCalculator } from "./exposure-triangle-calculator";
import { shutterSpeedCalculator } from "./shutter-speed-calculator";
import { apertureCalculator } from "./aperture-calculator";
import { isoCalculator } from "./iso-calculator";
import { circleOfConfusionCalculator } from "./circle-of-confusion-calculator";
import { sensorSizeCalculator } from "./sensor-size-calculator";
import { photoAspectRatioCalculator } from "./photo-aspect-ratio-calculator";
import { timeLapseCalculator } from "./time-lapse-calculator";
import { butterConversionCalculator } from "./butter-conversion-calculator";
import { sugarConversionCalculator } from "./sugar-conversion-calculator";
import { flourConversionCalculator } from "./flour-conversion-calculator";
import { honeyConversionCalculator } from "./honey-conversion-calculator";
import { milkConversionCalculator } from "./milk-conversion-calculator";
import { oilConversionCalculator } from "./oil-conversion-calculator";
import { eggConversionCalculator } from "./egg-conversion-calculator";
import { bakingPowderConversionCalculator } from "./baking-powder-conversion-calculator";
import { saltConversionCalculator } from "./salt-conversion-calculator";
import { vanillaConversionCalculator } from "./vanilla-conversion-calculator";
import { chocolateConversionCalculator } from "./chocolate-conversion-calculator";
import { creamConversionCalculator } from "./cream-conversion-calculator";
import { cheeseConversionCalculator } from "./cheese-conversion-calculator";
import { riceConversionCalculator } from "./rice-conversion-calculator";
import { photosynthesisCalculator } from "./photosynthesis-calculator";
import { respirationRateCalculator } from "./respiration-rate-calculator";
import { osmosisCalculator } from "./osmosis-calculator";
import { enzymeKineticsCalculator } from "./enzyme-kinetics-calculator";
import { geneFrequencyCalculator } from "./gene-frequency-calculator";
import { mutationRateCalculator } from "./mutation-rate-calculator";
import { geneticDistanceCalculator } from "./genetic-distance-calculator";
import { biodiversityIndexCalculator } from "./biodiversity-index-calculator";
import { trophicLevelCalculator } from "./trophic-level-calculator";
import { foodWebCalculator } from "./food-web-calculator";
import { biomassCalculator } from "./biomass-calculator";
import { carbonCycleCalculator } from "./carbon-cycle-calculator";
import { mriCostCalculator } from "./mri-cost-calculator";
import { ctScanCostCalculator } from "./ct-scan-cost-calculator";
import { xRayCostCalculator } from "./x-ray-cost-calculator";
import { bloodTestCostCalculator } from "./blood-test-cost-calculator";
import { physicalTherapyCostCalculator } from "./physical-therapy-cost-calculator";
import { chiropractorCostCalculator } from "./chiropractor-cost-calculator";
import { dermatologistCostCalculator } from "./dermatologist-cost-calculator";
import { orthodontistCostCalculator } from "./orthodontist-cost-calculator";
import { optometristCostCalculator } from "./optometrist-cost-calculator";
import { psychiatristCostCalculator } from "./psychiatrist-cost-calculator";
import { urgentCareCostCalculator } from "./urgent-care-cost-calculator";
import { ambulanceCostCalculator } from "./ambulance-cost-calculator";
import { prescriptionCostCalculator } from "./prescription-cost-calculator";
import { medicalBillNegotiationCalculator } from "./medical-bill-negotiation-calculator";
import { healthSavingsCalculator } from "./health-savings-calculator";
import { vennDiagramCalculator } from "./venn-diagram-calculator";
import { binaryAdditionCalculator } from "./binary-addition-calculator";
import { hexadecimalArithmeticCalculator } from "./hexadecimal-arithmetic-calculator";
import { ieee754Calculator } from "./ieee-754-calculator";
import { floatingPointCalculator } from "./floating-point-calculator";
import { errorPropagationCalculator } from "./error-propagation-calculator";
import { dimensionalAnalysisCalculator } from "./dimensional-analysis-calculator";
import { unitConversionChainCalculator } from "./unit-conversion-chain-calculator";
import { extrapolationCalculator } from "./extrapolation-calculator";
import { curveFittingCalculator } from "./curve-fitting-calculator";
import { condoInsuranceCalculator } from "./condo-insurance-calculator";
import { earthquakeInsuranceCalculator } from "./earthquake-insurance-calculator";
import { petInsuranceCostCalculator } from "./pet-insurance-cost-calculator";
import { travelMedicalInsuranceCalculator } from "./travel-medical-insurance-calculator";
import { supplementalInsuranceCalculator } from "./supplemental-insurance-calculator";
import { cobraInsuranceCalculator } from "./cobra-insurance-calculator";
import { marketplaceInsuranceCalculator } from "./marketplace-insurance-calculator";
import { lifeInsuranceNeedsCalculator } from "./life-insurance-needs-calculator";
import { accidentalDeathInsuranceCalculator } from "./accidental-death-insurance-calculator";
import { criticalIllnessInsuranceCalculator } from "./critical-illness-insurance-calculator";
import { declutterCalculator } from "./declutter-calculator";
import { closetOrganizationCalculator } from "./closet-organization-calculator";
import { garageOrganizationCalculator } from "./garage-organization-calculator";
import { pantryOrganizationCalculator } from "./pantry-organization-calculator";
import { bathroomCleaningCalculator } from "./bathroom-cleaning-calculator";
import { kitchenDeepCleanCalculator } from "./kitchen-deep-clean-calculator";
import { springCleaningCalculator } from "./spring-cleaning-calculator";
import { moveInCleaningCalculator } from "./move-in-cleaning-calculator";
import { moveOutCleaningCalculator } from "./move-out-cleaning-calculator";
import { officeCleaningCalculator } from "./office-cleaning-calculator";
import { windowWashingCalculator } from "./window-washing-calculator";
import { powerWashingTimeCalculator } from "./power-washing-time-calculator";
import { examScoreCalculator } from "./exam-score-calculator";
import { scholarshipValueCalculator } from "./scholarship-value-calculator";
import { studentDebtPayoffCalculator } from "./student-debt-payoff-calculator";
import { graduateSchoolRoiCalculator } from "./graduate-school-roi-calculator";

import { meadMakingCalculator } from "./mead-making-calculator";
import { homebrewAbvCalculator } from "./homebrew-abv-calculator";
import { homebrewEquipmentCalculator } from "./homebrew-equipment-calculator";
import { distillationYieldCalculator } from "./distillation-yield-calculator";
import { wineryStartupCalculator } from "./winery-startup-calculator";
import { fermentationTempCalculator } from "./fermentation-temp-calculator";
import { wineCellarCalculator } from "./wine-cellar-calculator";
import { carbonationLevelCalculator } from "./carbonation-level-calculator";
import { primingSugarCalculator } from "./priming-sugar-calculator";
import { taproomRevenueCalculator } from "./taproom-revenue-calculator";
import { tinyHouseCostCalculator } from "./tiny-house-cost-calculator";
import { vanConversionCalculator } from "./van-conversion-calculator";
import { rvTripCostCalculator } from "./rv-trip-cost-calculator";
import { cabinBuildCalculator } from "./cabin-build-calculator";
import { shedCostCalculator } from "./shed-cost-calculator";
import { yurtCostCalculator } from "./yurt-cost-calculator";
import { pergolaCostCalculator } from "./pergola-cost-calculator";
import { gazeboCostCalculator } from "./gazebo-cost-calculator";
import { screenedPorchCalculator } from "./screened-porch-calculator";
import { hotTubCostCalculator } from "./hot-tub-cost-calculator";
import { outdoorKitchenCalculator } from "./outdoor-kitchen-calculator";
import { firePitCostCalculator } from "./fire-pit-cost-calculator";
import { poolCostCalculator } from "./pool-cost-calculator";
import { arduinoPowerCalculator } from "./arduino-power-calculator";
import { raspberryPiPowerCalculator } from "./raspberry-pi-power-calculator";
import { rcCircuitCalculator } from "./rc-circuit-calculator";
import { inductorEnergyCalculator } from "./inductor-energy-calculator";
import { robotBuildCalculator } from "./robot-build-calculator";
import { droneBuildCalculator } from "./drone-build-calculator";
import { servoTorqueCalculator } from "./servo-torque-calculator";
import { stepperSpeedCalculator } from "./stepper-speed-calculator";
import { solarChargeCalculator } from "./solar-charge-calculator";
import { seedSpacingCalculator } from "./seed-spacing-calculator";
import { irrigationFlowCalculator } from "./irrigation-flow-calculator";
import { cropYieldEstimateCalculator } from "./crop-yield-estimate-calculator";
import { beekeepingStartupCalculator } from "./beekeeping-startup-calculator";
import { hydroponicsNutrientCalculator } from "./hydroponics-nutrient-calculator";
import { aquaponicsRatioCalculator } from "./aquaponics-ratio-calculator";
import { mushroomSubstrateCalculator } from "./mushroom-substrate-calculator";
import { orchardPlanningCalculator } from "./orchard-planning-calculator";
import { bowlingAverageCalculator } from "./bowling-average-calculator";
import { dartsCheckoutCalculator } from "./darts-checkout-calculator";
import { fishingLineStrengthCalculator } from "./fishing-line-strength-calculator";
import { huntingBallisticsCalculator } from "./hunting-ballistics-calculator";
import { archeryArrowSpineCalculator } from "./archery-arrow-spine-calculator";
import { climbingRopeCalculator } from "./climbing-rope-calculator";
import { tennisRacketSizeCalculator } from "./tennis-racket-size-calculator";
import { baseballBatSizeCalculator } from "./baseball-bat-size-calculator";
import { bicycleSizeCalculator } from "./bicycle-size-calculator";
import { foodTruckStartupCalculator } from "./food-truck-startup-calculator";
import { restaurantStartupCalculator } from "./restaurant-startup-calculator";
import { recipeScalingCalculator } from "./recipe-scaling-calculator";
import { pizzaSizeValueCalculator } from "./pizza-size-value-calculator";
import { bakingAltitudeCalculator } from "./baking-altitude-calculator";
import { sourdoughHydrationCalculator } from "./sourdough-hydration-calculator";
import { smokingMeatTimeCalculator } from "./smoking-meat-time-calculator";
import { mealDeliveryCalculator } from "./meal-delivery-calculator";
import { breadBakingFlourCalculator } from "./bread-baking-flour-calculator";
import { butterYieldCalculator } from "./butter-yield-calculator";
import { coffeeShopStartupCalculator } from "./coffee-shop-startup-calculator";
import { bakeryStartupCalculator } from "./bakery-startup-calculator";
import { wardrobeCapsuleCalculator } from "./wardrobe-capsule-calculator";
import { clothingCostPerWearCalculator } from "./clothing-cost-per-wear-calculator";
import { dressAlterationCalculator } from "./dress-alteration-calculator";
import { tailorCostCalculator } from "./tailor-cost-calculator";
import { shoeSizeAgeCalculator } from "./shoe-size-age-calculator";
import { weddingDressCalculator } from "./wedding-dress-calculator";
import { suitCostCalculator } from "./suit-cost-calculator";
import { uniformCostCalculator } from "./uniform-cost-calculator";
import { fabricNeededCalculator } from "./fabric-needed-calculator";
import { jewelryMetalWeightCalculator } from "./jewelry-metal-weight-calculator";
import { customJewelryCalculator } from "./custom-jewelry-calculator";
import { watchCollectionCalculator } from "./watch-collection-calculator";
import { airbnbOccupancyCalculator } from "./airbnb-occupancy-calculator";
import { rentalYieldGrossCalculator } from "./rental-yield-gross-calculator";
import { rentToPriceCalculator } from "./rent-to-price-calculator";
import { n1PercentRuleCalculator } from "./1-percent-rule-calculator";
import { propertyTaxEstimateCalculator } from "./property-tax-estimate-calculator";
import { renovationBudgetCalculator } from "./renovation-budget-calculator";
import { bpmToMsCalculator } from "./bpm-to-ms-calculator";
import { speakerBoxVolumeCalculator } from "./speaker-box-volume-calculator";
import { roomReverbCalculator } from "./room-reverb-calculator";
import { cableLengthSignalCalculator } from "./cable-length-signal-calculator";
import { homeStudioCalculator } from "./home-studio-calculator";
import { vinylRecordTimeCalculator } from "./vinyl-record-time-calculator";
import { concertSoundCalculator } from "./concert-sound-calculator";
import { llcFormationCalculator } from "./llc-formation-calculator";
import { ndaCostCalculator } from "./nda-cost-calculator";
import { incorporationCostCalculator } from "./incorporation-cost-calculator";
import { breakEvenUnitsCalculator } from "./break-even-units-calculator";
import { accountsReceivableDaysCalculator } from "./accounts-receivable-days-calculator";
import { workingCapitalRatioCalculator } from "./working-capital-ratio-calculator";
import { puppyFirstYearCalculator } from "./puppy-first-year-calculator";
import { kittenFirstYearCalculator } from "./kitten-first-year-calculator";
import { reptileTankSizeCalculator } from "./reptile-tank-size-calculator";
import { petInsuranceCompareCalculator } from "./pet-insurance-compare-calculator";
import { horseMonthlyCalculator } from "./horse-monthly-calculator";
import { petGroomingCalculator } from "./pet-grooming-calculator";
import { passportTimelineCalculator } from "./passport-timeline-calculator";
import { backpackingBudgetCalculator } from "./backpacking-budget-calculator";
import { destinationWeddingCalculator } from "./destination-wedding-calculator";
import { travelPointsValueCalculator } from "./travel-points-value-calculator";
import { studyAbroadCalculator } from "./study-abroad-calculator";
import { gapYearCalculator } from "./gap-year-calculator";
import { skiTripCalculator } from "./ski-trip-calculator";
import { disneyVacationCalculator } from "./disney-vacation-calculator";
import { safariTripCalculator } from "./safari-trip-calculator";
import { yachtCharterCalculator } from "./yacht-charter-calculator";
import { glampingCostCalculator } from "./glamping-cost-calculator";
import { postureScoreCalculator } from "./posture-score-calculator";
import { hydrationNeedsCalculator } from "./hydration-needs-calculator";
import { eyeStrainRiskCalculator } from "./eye-strain-risk-calculator";
import { hearingDamageRiskCalculator } from "./hearing-damage-risk-calculator";
import { sittingHealthRiskCalculator } from "./sitting-health-risk-calculator";
import { circadianRhythmCalculator } from "./circadian-rhythm-calculator";
import { napDurationCalculator } from "./nap-duration-calculator";
import { handwashingTimeCalculator } from "./handwashing-time-calculator";
import { sunlightExposureCalculator } from "./sunlight-exposure-calculator";
import { ergonomicDeskCalculator } from "./ergonomic-desk-calculator";
import { classGradeCalculator } from "./class-grade-calculator";
import { homeschoolCostCalculator } from "./homeschool-cost-calculator";
import { tutoringCostCalculator } from "./tutoring-cost-calculator";
import { semesterCreditsCalculator } from "./semester-credits-calculator";
import { collegeApplicationCalculator } from "./college-application-calculator";
import { scholarshipChanceCalculator } from "./scholarship-chance-calculator";
import { totientFunctionCalculator } from "./totient-function-calculator";
import { mobiusFunctionCalculator } from "./mobius-function-calculator";
import { perfectNumberCheckCalculator } from "./perfect-number-check-calculator";
import { twinPrimeFinderCalculator } from "./twin-prime-finder-calculator";
import { digitSumCalculator } from "./digit-sum-calculator";
import { numberPalindromeCalculator } from "./number-palindrome-calculator";
import { triangularNumberCalculator } from "./triangular-number-calculator";
import { pentagonalNumberCalculator } from "./pentagonal-number-calculator";
import { hexagonalNumberCalculator } from "./hexagonal-number-calculator";
import { ouncesToCupsCalculator } from "./ounces-to-cups-calculator";
import { sticksToCupsCalculator } from "./sticks-to-cups-calculator";
import { fahrenheitToGasCalculator } from "./fahrenheit-to-gas-calculator";
import { quartsToLitersCalculator } from "./quarts-to-liters-calculator";
import { pintsToCupsCalculator } from "./pints-to-cups-calculator";
import { gallonsToLitersCalculator } from "./gallons-to-liters-calculator";
import { fluidOzToMlCalculator } from "./fluid-oz-to-ml-calculator";
import { richterScaleEnergyCalculator } from "./richter-scale-energy-calculator";
import { windPowerCalculator } from "./wind-power-calculator";
import { waterPressureDepthCalculator } from "./water-pressure-depth-calculator";
import { pendulumPeriodCalculator } from "./pendulum-period-calculator";
import { buoyancyForceCalculator } from "./buoyancy-force-calculator";
import { kineticEnergyCalculator } from "./kinetic-energy-calculator";
import { potentialEnergyGravCalculator } from "./potential-energy-grav-calculator";
import { frictionForceCalculator } from "./friction-force-calculator";
import { angularVelocityCalculator } from "./angular-velocity-calculator";
import { roofReplacementCalculator } from "./roof-replacement-calculator";
import { windowReplacementCalculator } from "./window-replacement-calculator";
import { doorReplacementCalculator } from "./door-replacement-calculator";
import { flooringInstallCalculator } from "./flooring-install-calculator";
import { hardwoodRefinishCalculator } from "./hardwood-refinish-calculator";
import { countertopCostCalculator } from "./countertop-cost-calculator";
import { backsplashCostCalculator } from "./backsplash-cost-calculator";
import { paintingCostCalculator } from "./painting-cost-calculator";
import { exteriorPaintingCalculator } from "./exterior-painting-calculator";
import { plumbingRepairCalculator } from "./plumbing-repair-calculator";
import { electricalRewiringCalculator } from "./electrical-rewiring-calculator";
import { garageDoorCalculator } from "./garage-door-calculator";

import { babyWeightGainCalculator } from "./baby-weight-gain-calculator";
import { breastPumpScheduleCalculator } from "./breast-pump-schedule-calculator";
import { dueDateIvfCalculator } from "./due-date-ivf-calculator";
import { strollerBudgetCalculator } from "./stroller-budget-calculator";
import { retirementSavingsGapCalculator } from "./retirement-savings-gap-calculator";
import { retirementWithdrawalCalculator } from "./retirement-withdrawal-calculator";
import { downsizingSavingsCalculator } from "./downsizing-savings-calculator";
import { elderCareCostCalculator } from "./elder-care-cost-calculator";
import { inheritanceSplitCalculator } from "./inheritance-split-calculator";
import { freelanceHourlyRateCalculator } from "./freelance-hourly-rate-calculator";
import { projectQuoteCalculator } from "./project-quote-calculator";
import { gigTaxEstimateCalculator } from "./gig-tax-estimate-calculator";
import { deliveryDriverProfitCalculator } from "./delivery-driver-profit-calculator";
import { contentCreatorRevenueCalculator } from "./content-creator-revenue-calculator";
import { podcastMonetizationCalculator } from "./podcast-monetization-calculator";
import { onlineCourseRevenueCalculator } from "./online-course-revenue-calculator";
import { ebookRoyaltyCalculator } from "./ebook-royalty-calculator";
import { patreonIncomeCalculator } from "./patreon-income-calculator";
import { printOnDemandCalculator } from "./print-on-demand-calculator";
import { compostSavingsCalculator } from "./compost-savings-calculator";
import { waterConservationCalculator } from "./water-conservation-calculator";
import { energyStarSavingsCalculator } from "./energy-star-savings-calculator";
import { reusableBagCalculator } from "./reusable-bag-calculator";
import { ledBulbSavingsCalculator } from "./led-bulb-savings-calculator";
import { thermostatSavingsCalculator } from "./thermostat-savings-calculator";
import { lowFlowToiletCalculator } from "./low-flow-toilet-calculator";
import { clotheslineSavingsCalculator } from "./clothesline-savings-calculator";
import { windChillTempCalculator } from "./wind-chill-temp-calculator";
import { uvExposureTimeCalculator } from "./uv-exposure-time-calculator";
import { lightningDistanceCalculator } from "./lightning-distance-calculator";
import { barometricAltitudeCalculator } from "./barometric-altitude-calculator";
import { gasPriceOptimizerCalculator } from "./gas-price-optimizer-calculator";
import { miningElectricityCalculator } from "./mining-electricity-calculator";
import { stakingRewardCalculator } from "./staking-reward-calculator";
import { tokenUnlockCalculator } from "./token-unlock-calculator";
import { yieldFarmingCalculator } from "./yield-farming-calculator";
import { nftFloorPriceCalculator } from "./nft-floor-price-calculator";
import { defiPortfolioCalculator } from "./defi-portfolio-calculator";
import { tippingEtiquetteCalculator } from "./tipping-etiquette-calculator";
import { splitRentCalculator } from "./split-rent-calculator";
import { garageSaleCalculator } from "./garage-sale-calculator";
import { cashbackRewardsCalculator } from "./cashback-rewards-calculator";
import { warrantyValueCalculator } from "./warranty-value-calculator";
import { depreciationVehicleCalculator } from "./depreciation-vehicle-calculator";
import { leaseVsBuyCarCalculator } from "./lease-vs-buy-car-calculator";

import { smartHomeCostCalculator } from "./smart-home-cost-calculator";
import { smartLockRoiCalculator } from "./smart-lock-roi-calculator";
import { solarBatterySizeCalculator } from "./solar-battery-size-calculator";
import { evHomeChargerCalculator } from "./ev-home-charger-calculator";
import { smartSprinklerCalculator } from "./smart-sprinkler-calculator";
import { treadmillCostCalculator } from "./treadmill-cost-calculator";
import { pelotonCostCalculator } from "./peloton-cost-calculator";
import { homeSaunaCostCalculator } from "./home-sauna-cost-calculator";
import { coldPlungeCostCalculator } from "./cold-plunge-cost-calculator";
import { massageGunValueCalculator } from "./massage-gun-value-calculator";
import { boardGameValueCalculator } from "./board-game-value-calculator";
import { legoCostPerPieceCalculator } from "./lego-cost-per-piece-calculator";
import { modelTrainTrackCalculator } from "./model-train-track-calculator";
import { stampCollectionValueCalculator } from "./stamp-collection-value-calculator";
import { coinCollectionValueCalculator } from "./coin-collection-value-calculator";
import { cyberInsuranceCalculator } from "./cyber-insurance-calculator";
import { napierLogarithmCalculator } from "./napier-logarithm-calculator";
import { hyperbolicSineCalculator } from "./hyperbolic-sine-calculator";
import { hyperbolicCosineCalculator } from "./hyperbolic-cosine-calculator";
import { sigmoidFunctionCalculator } from "./sigmoid-function-calculator";
import { softmaxCalculator } from "./softmax-calculator";

import { tenNinetyNineDeductionCalculator } from "./1099-deduction";
import { adoptionCostCalculator } from "./adoption-cost";
import { aduCostCalculator } from "./adu-cost";
import { aiApiCostCalculator } from "./ai-api-cost";
import { aiImageCostCalculator } from "./ai-image-cost";
import { aiTrainingCostCalculator } from "./ai-training-cost";
import { airbnbOccupancyRateCalculator } from "./airbnb-occupancy-rate";
import { alaskaPaycheckCalculator } from "./alaska-paycheck";
import { amazonFbaProfitCalculator } from "./amazon-fba-profit";
import { appRevenueCalculator } from "./app-revenue";
import { aquaponicsSizingCalculator } from "./aquaponics-sizing";
import { arkansasPaycheckCalculator } from "./arkansas-paycheck";
import { asbestosRemovalCostCalculator } from "./asbestos-removal-cost";
import { babyFirstYearCostCalculator } from "./baby-first-year-cost";
import { backToSchoolCostCalculator } from "./back-to-school-cost";
import { backpackingFoodCalculator } from "./backpacking-food";
import { barMitzvahCostCalculator } from "./bar-mitzvah-cost";
import { beekeepingCostCalculator } from "./beekeeping-cost";
import { beerRecipeScaleCalculator } from "./beer-recipe-scale";
import { bloodDonationEligibilityCalculator } from "./blood-donation-eligibility";
import { bloodGlucoseA1cCalculator } from "./blood-glucose-a1c";
import { botoxCostCalculator } from "./botox-cost";
import { btuToKwCalculator } from "./btu-to-kw";
import { businessInsuranceCostCalculator } from "./business-insurance-cost";
import { carbonCreditValueCalculator } from "./carbon-credit-value";
import { cashRegisterCalculator } from "./cash-register";
import { cheeseMakingCalculator } from "./cheese-making-calc";
import { chickenCoopCostCalculator } from "./chicken-coop-cost";
import { christmasBudgetCalculator } from "./christmas-budget";
import { christmasLightCostCalculator } from "./christmas-light-cost";
import { climbingTrainingLoadCalculator } from "./climbing-training-load";
import { cloudHostingCostCalculator } from "./cloud-hosting-cost";
import { collagenIntakeCalculator } from "./collagen-intake";
import { collegeMoveInCostCalculator } from "./college-move-in-cost";
import { communitySolarSavingsCalculator } from "./community-solar-savings";
import { connecticutPaycheckCalculator } from "./connecticut-paycheck";
import { cosmeticSurgeryCostCalculator } from "./cosmetic-surgery-cost";
import { coursePricingCalculator } from "./course-pricing";
import { cpapPressureCalculator } from "./cpap-pressure";
import { creatineDosageCalculator } from "./creatine-dosage";
import { cricketRunRateCalculator } from "./cricket-run-rate";
import { delawarePaycheckCalculator } from "./delaware-paycheck";
import { dentalImplantCostCalculator } from "./dental-implant-cost";
import { destinationWeddingCostCalculator } from "./destination-wedding-cost";
import { divorceCostCalculator } from "./divorce-cost";
import { domainValueCalculator } from "./domain-value";
import { doordashEarningsCalculator } from "./doordash-earnings";
import { dropshippingMarginCalculator } from "./dropshipping-margin";
import { easterEggHuntCalculator } from "./easter-egg-hunt";
import { electricBikeSavingsCalculator } from "./electric-bike-savings";
import { electricityTimeOfUseCalculator } from "./electricity-time-of-use";
import { electrolyteCalculator } from "./electrolyte-calculator";
import { energyRebateCalculator } from "./energy-rebate";
import { equityDilutionCalculator } from "./equity-dilution";
import { evBatteryDegradationCalculator } from "./ev-battery-degradation";
import { evHomeChargerCostCalculator } from "./ev-home-charger-cost";
import { evLeaseVsBuyCalculator } from "./ev-lease-vs-buy";
import { evRoadTripPlannerCalculator } from "./ev-road-trip-planner";
import { evTaxCreditCalculator } from "./ev-tax-credit";
import { evVsGasTotalCostCalculator } from "./ev-vs-gas-total-cost";
import { familyReunionCostCalculator } from "./family-reunion-cost";
import { fishingRodWeightCalculator } from "./fishing-rod-weight";
import { foodTruckCostCalculator } from "./food-truck-cost";
import { fourthOfJulyPartyCalculator } from "./fourth-of-july-party";
import { freelanceProjectBidCalculator } from "./freelance-project-bid";
import { funeralCostCalculator } from "./funeral-cost";
import { gallonsPerMinuteCalculator } from "./gallons-per-minute";
import { geothermalCostCalculator } from "./geothermal-cost";
import { gigTaxCalculator } from "./gig-tax-calculator";
import { globalEntryRoiCalculator } from "./global-entry-roi";
import { glp1WeightLossCalculator } from "./glp1-weight-loss";
import { greenBuildingPremiumCalculator } from "./green-building-premium";
import { halloweenCandyCalcCalculator } from "./halloween-candy-calc";
import { halloweenCostumeCostCalculator } from "./halloween-costume-cost";
import { hawaiiPaycheckCalculator } from "./hawaii-paycheck";
import { hearingAidCostCalculator } from "./hearing-aid-cost";
import { heatPumpSavingsCalculator } from "./heat-pump-savings";
import { hoaFeeComparisonCalculator } from "./hoa-fee-comparison";
import { holidayShippingDeadlineCalculator } from "./holiday-shipping-deadline";
import { homeAppraisalValueCalculator } from "./home-appraisal-value";
import { homeElectrificationCalculator } from "./home-electrification";
import { homeEnergyScoreCalculator } from "./home-energy-score";
import { homeSolarLoanCalculator } from "./home-solar-loan";
import { homesteadGardenSizeCalculator } from "./homestead-garden-size";
import { horsepowerToTorqueCalculator } from "./horsepower-to-torque";
import { housewarmingPartyCalculator } from "./housewarming-party";
import { idahoPaycheckCalculator } from "./idaho-paycheck";
import { instacartEarningsCalculator } from "./instacart-earnings";
import { inventoryReorderCalculator } from "./inventory-reorder";
import { invisalignCostCalculator } from "./invisalign-cost";
import { iowaPaycheckCalculator } from "./iowa-paycheck";
import { iudTimelineCalculator } from "./iud-timeline";
import { kansasPaycheckCalculator } from "./kansas-paycheck";
import { kentuckyPaycheckCalculator } from "./kentucky-paycheck";
import { lasikCostCalculator } from "./lasik-cost";
import { ledUpgradeRoiCalculator } from "./led-upgrade-roi";
import { lightYearsToKmCalculator } from "./light-years-to-km";
import { llcVsScorpCalculator } from "./llc-vs-scorp";
import { llmTokenCalculator } from "./llm-token-calculator";
import { lyftDriverEarningsCalculator } from "./lyft-driver-earnings";
import { mainePaycheckCalculator } from "./maine-paycheck";
import { mapleSyrupYieldCalculator } from "./maple-syrup-yield";
import { menstrualCycleLengthCalculator } from "./menstrual-cycle-length";
import { microgramsToMgCalculator } from "./micrograms-to-mg";
import { migraineTriggerScoreCalculator } from "./migraine-trigger-score";
import { mississippiPaycheckCalculator } from "./mississippi-paycheck";
import { mmaReachAdvantageCalculator } from "./mma-reach-advantage";
import { modelTrainScaleCalculator } from "./model-train-scale";
import { moldRemediationCostCalculator } from "./mold-remediation-cost";
import { montanaPaycheckCalculator } from "./montana-paycheck";
import { mounjaroDosageCalculator } from "./mounjaro-dosage";
import { movingTimelineCalculator } from "./moving-timeline";
import { mushroomGrowingCalculator } from "./mushroom-growing-calc";
import { nauticalMilesToKmCalculator } from "./nautical-miles-to-km";
import { nebraskaPaycheckCalculator } from "./nebraska-paycheck";
import { netMeteringSavingsCalculator } from "./net-metering-savings";
import { nevadaPaycheckCalculator } from "./nevada-paycheck";
import { newHampshirePaycheckCalculator } from "./new-hampshire-paycheck";
import { newMexicoPaycheckCalculator } from "./new-mexico-paycheck";
import { newYearsPartyCalculator } from "./new-years-party";
import { newsletterRevenueCalculator } from "./newsletter-revenue";
import { newtonsToPoundsCalculator } from "./newtons-to-pounds";
import { northDakotaPaycheckCalculator } from "./north-dakota-paycheck";
import { notarizationCostCalculator } from "./notarization-cost";
import { oklahomaPaycheckCalculator } from "./oklahoma-paycheck";
import { oregonPaycheckCalculator } from "./oregon-paycheck";
import { passportRenewalTimeCalculator } from "./passport-renewal-time";
import { pelvicFloorScoreCalculator } from "./pelvic-floor-score";
import { pickleballCourtCostCalculator } from "./pickleball-court-cost";
import { popupShopCostCalculator } from "./popup-shop-cost";
import { postpartumCalorieCalculator } from "./postpartum-calorie";
import { potteryShrinkageCalculator } from "./pottery-shrinkage";
import { prenatalVitaminCalculator } from "./prenatal-vitamin";
import { printOnDemandProfitCalculator } from "./print-on-demand-profit";
import { productPricingCalculator } from "./product-pricing";
import { promBudgetCalculator } from "./prom-budget";
import { quinceaeneraCostCalculator } from "./quinceanera-cost";
import { radonMitigationCostCalculator } from "./radon-mitigation-cost";
import { rcFlightTimeCalculator } from "./rc-flight-time";
import { rentToIncomeCalculator } from "./rent-to-income";
import { rentalArbitrageCalculator } from "./rental-arbitrage";
import { resinArtCalculator } from "./resin-art-calc";
import { restaurantFoodCostCalculator } from "./restaurant-food-cost";
import { restaurantLaborCostCalculator } from "./restaurant-labor-cost";
import { retirementPartyCostCalculator } from "./retirement-party-cost";
import { rhodeIslandPaycheckCalculator } from "./rhode-island-paycheck";
import { roofSnowLoadCalculator } from "./roof-snow-load";
import { rugbyPointsCalculator } from "./rugby-points";
import { saasMetricsCalculator } from "./saas-metrics";
import { sausageMakingCalculator } from "./sausage-making-calc";
import { selfStorageCostCalculator } from "./self-storage-cost";
import { semaglutideSavingsCalculator } from "./semaglutide-savings";
import { seoTrafficValueCalculator } from "./seo-traffic-value";
import { septicPercTestCalculator } from "./septic-perc-test";
import { shippingRateCompareCalculator } from "./shipping-rate-compare";
import { skiBootSizeCalculator } from "./ski-boot-size";
import { skinAgeCalculator } from "./skin-age";
import { smallBusinessTaxCalculator } from "./small-business-tax";
import { smartThermostatSavingsCalculator } from "./smart-thermostat-savings";
import { solarBatteryPaybackCalculator } from "./solar-battery-payback";
import { solarPaybackPeriodCalculator } from "./solar-payback-period";
import { solarTaxCreditCalculator } from "./solar-tax-credit";
import { southDakotaPaycheckCalculator } from "./south-dakota-paycheck";
import { sponsorshipRateCalculator } from "./sponsorship-rate";
import { stoneToPoundsCalcCalculator } from "./stone-to-pounds-calc";
import { summerCampCostCalculator } from "./summer-camp-cost";
import { superbowlPartyCalculator } from "./superbowl-party";
import { supplementTimingCalculator } from "./supplement-timing";
import { surfboardVolumeCalculator } from "./surfboard-volume";
import { taxRefundEstimateCalculator } from "./tax-refund-estimate";
import { therapyCostCalculator } from "./therapy-cost";
import { tiktokEarningsCalculator } from "./tiktok-earnings";
import { tipCreditCalculator } from "./tip-credit-calculator";
import { titleSearchCostCalculator } from "./title-search-cost";
import { turoProfitCalculator } from "./turo-profit";
import { twitchIncomeCalculator } from "./twitch-income";
import { uberDriverEarningsCalculator } from "./uber-driver-earnings";
import { utahPaycheckCalculator } from "./utah-paycheck";
import { valentinesDateCostCalculator } from "./valentines-date-cost";
import { vendingMachineProfitCalculator } from "./vending-machine-profit";
import { vermontPaycheckCalculator } from "./vermont-paycheck";
import { volleyballStatsCalculator } from "./volleyball-stats";
import { waterHeaterComparisonCalculator } from "./water-heater-comparison";
import { weatherizationRoiCalculator } from "./weatherization-roi";
import { wegovyCostCalculator } from "./wegovy-cost";
import { wellWaterTestCalculator } from "./well-water-test";
import { westVirginiaPaycheckCalculator } from "./west-virginia-paycheck";
import { wholesaleMarkupCalculator } from "./wholesale-markup";
import { wineMakingCalculator } from "./wine-making-calc";
import { woodworkingJointCalculator } from "./woodworking-joint";
import { wyomingPaycheckCalculator } from "./wyoming-paycheck";
import { youtubeRevenueCalculator } from "./youtube-revenue";


import { curb65ScoreCalculator } from "./curb-65-score";
import { nihssScoreCalculator } from "./nihss-score";
import { mewsCalculator } from "./mews-calculator";
import { rsbiCalculator } from "./rsbi-calculator";
import { heartScoreCalculator } from "./heart-score";
import { graceScoreCalculator } from "./grace-score";
import { hasBledScoreCalculator } from "./has-bled-score";
import { paduaScoreCalculator } from "./padua-score";
import { percScoreCalculator } from "./perc-score";
import { revisedGenevaCalculator } from "./revised-geneva";
import { alvaradoScoreCalculator } from "./alvarado-score";
import { epdsPostnatalCalculator } from "./epds-postnatal";
import { bodeIndexCalculator } from "./bode-index";
import { gfrCalculator } from "./gfr-calculator";
import { anionGapCalcCalculator } from "./anion-gap-calc";
import { dripRateCalcCalculator } from "./drip-rate-calc";
import { endotrachealTubeCalcCalculator } from "./endotracheal-tube-calc";
import { tidalVolumeCalcCalculator } from "./tidal-volume-calc";
import { aaGradientCalcCalculator } from "./aa-gradient-calc";
import { pfRatioCalculator } from "./pf-ratio";
import { inrCalculator } from "./inr-calculator";
import { hematocritCalcCalculator } from "./hematocrit-calc";
import { fundalHeightCalcCalculator } from "./fundal-height-calc";
import { hcgLevelsCalcCalculator } from "./hcg-levels-calc";
import { nuchalTranslucencyCalculator } from "./nuchal-translucency";
import { steroidConversionCalculator } from "./steroid-conversion";
import { warfarinDoseCalcCalculator } from "./warfarin-dose-calc";
import { insulinDoseCalcCalculator } from "./insulin-dose-calc";
import { drugHalfLifeCalcCalculator } from "./drug-half-life-calc";
import { cardiacIndexCalcCalculator } from "./cardiac-index-calc";
import { strokeVolumeCalcCalculator } from "./stroke-volume-calc";
import { cerebralPerfusionCalculator } from "./cerebral-perfusion";
import { pvrCalculator } from "./pvr-calculator";
import { sortinoRatioCalculator } from "./sortino-ratio";
import { jensenAlphaCalculator } from "./jensen-alpha";
import { treynorRatioCalculator } from "./treynor-ratio";
import { bondConvexityCalculator } from "./bond-convexity";
import { epsGrowthCalcCalculator } from "./eps-growth-calc";
import { futuresContractCalculator } from "./futures-contract";
import { optionsSpreadCalculator } from "./options-spread";
import { yieldToCallCalculator } from "./yield-to-call";
import { altmanZScoreCalculator } from "./altman-z-score";
import { bondPriceCalcCalculator } from "./bond-price-calc";
import { bondYtmCalcCalculator } from "./bond-ytm-calc";
import { dupontAnalysisCalculator } from "./dupont-analysis";
import { pegRatioCalcCalculator } from "./peg-ratio-calc";
import { forwardRateCalcCalculator } from "./forward-rate-calc";
import { hedgeRatioCalcCalculator } from "./hedge-ratio-calc";
import { betaStockCalcCalculator } from "./beta-stock-calc";
import { costOfEquityCalculator } from "./cost-of-equity";
import { costOfCapitalCalculator } from "./cost-of-capital";
import { enterpriseValueCalcCalculator } from "./enterprise-value-calc";
import { mirrCalculator } from "./mirr-calculator";
import { dcfCalculator } from "./dcf-calculator";
import { fireCalculator } from "./fire-calculator";
import { perpetuityCalcCalculator } from "./perpetuity-calc";
import { moneyFactorCalcCalculator } from "./money-factor-calc";
import { opportunityCostCalcCalculator } from "./opportunity-cost-calc";
import { timeValueMoneyCalculator } from "./time-value-money";
import { varValueAtRiskCalculator } from "./var-value-at-risk";
import { grahamNumberCalculator } from "./graham-number";
import { intrinsicValueCalcCalculator } from "./intrinsic-value-calc";
import { burnRateCalcCalculator } from "./burn-rate-calc";
import { ltvSaasCalcCalculator } from "./ltv-saas-calc";
import { debtToEquityCalcCalculator } from "./debt-to-equity-calc";
import { quickRatioCalcCalculator } from "./quick-ratio-calc";
import { economicValueAddedCalculator } from "./economic-value-added";
import { dividendGrowthModelCalculator } from "./dividend-growth-model";
import { ebitdaMultipleCalculator } from "./ebitda-multiple";
import { retentionRatioCalculator } from "./retention-ratio";
import { operatingLeverageCalculator } from "./operating-leverage";
import { financialLeverageCalculator } from "./financial-leverage";
import { evToEbitdaCalculator } from "./ev-to-ebitda";
import { priceToCashFlowCalculator } from "./price-to-cash-flow";
import { residualIncomeCalculator } from "./residual-income";
import { sustainableGrowthRateCalculator } from "./sustainable-growth-rate";
import { netOperatingIncomeCalculator } from "./net-operating-income";
import { capRateNoiCalculator } from "./cap-rate-noi";
import { projectileMotionCalculator } from "./projectile-motion";
import { freeFallCalcCalculator } from "./free-fall-calc";
import { terminalVelocityCalcCalculator } from "./terminal-velocity-calc";
import { rollingResistanceCalcCalculator } from "./rolling-resistance-calc";
import { escapeVelocityCalcCalculator } from "./escape-velocity-calc";
import { orbitalVelocityCalcCalculator } from "./orbital-velocity-calc";
import { rocketEquationCalculator } from "./rocket-equation";
import { deltaVCalcCalculator } from "./delta-v-calc";
import { timeDilationCalculator } from "./time-dilation";
import { lengthContractionCalculator } from "./length-contraction";
import { eMc2CalcCalculator } from "./e-mc2-calc";
import { lorentzForceCalculator } from "./lorentz-force";
import { gaussLawCalcCalculator } from "./gauss-law-calc";
import { faradayLawCalcCalculator } from "./faraday-law-calc";
import { rlcCircuitCalculator } from "./rlc-circuit";
import { n555TimerCalculator } from "./n555-timer";
import { mosfetCalcCalculator } from "./mosfet-calc";
import { transistorBiasingCalculator } from "./transistor-biasing";
import { wireResistanceCalcCalculator } from "./wire-resistance-calc";
import { darcyWeisbachCalculator } from "./darcy-weisbach";
import { hydraulicPressCalculator } from "./hydraulic-press";
import { archimedesPrincipleCalculator } from "./archimedes-principle";
import { dragEquationCalculator } from "./drag-equation";
import { liftCoefficientCalculator } from "./lift-coefficient";
import { braggLawCalculator } from "./bragg-law";
import { snellLawCalcCalculator } from "./snell-law-calc";
import { lensMakerCalcCalculator } from "./lens-maker-calc";
import { thinLensCalcCalculator } from "./thin-lens-calc";
import { speedOfSoundCalcCalculator } from "./speed-of-sound-calc";
import { helmholtzResonatorCalculator } from "./helmholtz-resonator";
import { reverberationTimeCalcCalculator } from "./reverberation-time-calc";
import { youngModulusCalculator } from "./young-modulus";
import { poissonRatioCalculator } from "./poisson-ratio";
import { shearStressCalcCalculator } from "./shear-stress-calc";
import { vonMisesStressCalculator } from "./von-mises-stress";
import { mohrCircleCalculator } from "./mohr-circle";
import { stressConcentrationCalculator } from "./stress-concentration";
import { fulcrumCalcCalculator } from "./fulcrum-calc";
import { mechanicalAdvantageCalculator } from "./mechanical-advantage";
import { beltLengthCalcCalculator } from "./belt-length-calc";
import { torsionSpringCalcCalculator } from "./torsion-spring-calc";
import { alabamaIncomeTaxCalculator } from "./alabama-income-tax";
import { alaskaIncomeTaxCalculator } from "./alaska-income-tax";
import { arizonaIncomeTaxCalculator } from "./arizona-income-tax";
import { arkansasIncomeTaxCalculator } from "./arkansas-income-tax";
import { californiaIncomeTaxCalculator } from "./california-income-tax";
import { coloradoIncomeTaxCalculator } from "./colorado-income-tax";
import { connecticutIncomeTaxCalculator } from "./connecticut-income-tax";
import { delawareIncomeTaxCalculator } from "./delaware-income-tax";
import { floridaIncomeTaxCalculator } from "./florida-income-tax";
import { georgiaIncomeTaxCalculator } from "./georgia-income-tax";
import { hawaiiIncomeTaxCalculator } from "./hawaii-income-tax";
import { idahoIncomeTaxCalculator } from "./idaho-income-tax";
import { illinoisIncomeTaxCalculator } from "./illinois-income-tax";
import { indianaIncomeTaxCalculator } from "./indiana-income-tax";
import { iowaIncomeTaxCalculator } from "./iowa-income-tax";
import { kansasIncomeTaxCalculator } from "./kansas-income-tax";
import { kentuckyIncomeTaxCalculator } from "./kentucky-income-tax";
import { louisianaIncomeTaxCalculator } from "./louisiana-income-tax";
import { maineIncomeTaxCalculator } from "./maine-income-tax";
import { marylandIncomeTaxCalculator } from "./maryland-income-tax";
import { massachusettsIncomeTaxCalculator } from "./massachusetts-income-tax";
import { michiganIncomeTaxCalculator } from "./michigan-income-tax";
import { minnesotaIncomeTaxCalculator } from "./minnesota-income-tax";
import { mississippiIncomeTaxCalculator } from "./mississippi-income-tax";
import { missouriIncomeTaxCalculator } from "./missouri-income-tax";
import { montanaIncomeTaxCalculator } from "./montana-income-tax";
import { nebraskaIncomeTaxCalculator } from "./nebraska-income-tax";
import { nevadaIncomeTaxCalculator } from "./nevada-income-tax";
import { newHampshireIncomeTaxCalculator } from "./new-hampshire-income-tax";
import { newJerseyIncomeTaxCalculator } from "./new-jersey-income-tax";
import { newMexicoIncomeTaxCalculator } from "./new-mexico-income-tax";
import { newYorkIncomeTaxCalculator } from "./new-york-income-tax";
import { northCarolinaIncomeTaxCalculator } from "./north-carolina-income-tax";
import { northDakotaIncomeTaxCalculator } from "./north-dakota-income-tax";
import { ohioIncomeTaxCalculator } from "./ohio-income-tax";
import { oklahomaIncomeTaxCalculator } from "./oklahoma-income-tax";
import { oregonIncomeTaxCalculator } from "./oregon-income-tax";
import { pennsylvaniaIncomeTaxCalculator } from "./pennsylvania-income-tax";
import { rhodeIslandIncomeTaxCalculator } from "./rhode-island-income-tax";
import { southCarolinaIncomeTaxCalculator } from "./south-carolina-income-tax";
import { southDakotaIncomeTaxCalculator } from "./south-dakota-income-tax";
import { tennesseeIncomeTaxCalculator } from "./tennessee-income-tax";
import { texasIncomeTaxCalculator } from "./texas-income-tax";
import { utahIncomeTaxCalculator } from "./utah-income-tax";
import { vermontIncomeTaxCalculator } from "./vermont-income-tax";
import { virginiaIncomeTaxCalculator } from "./virginia-income-tax";
import { washingtonIncomeTaxCalculator } from "./washington-income-tax";
import { westVirginiaIncomeTaxCalculator } from "./west-virginia-income-tax";
import { wisconsinIncomeTaxCalculator } from "./wisconsin-income-tax";
import { wyomingIncomeTaxCalculator } from "./wyoming-income-tax";
import { molarityCalcCalculator } from "./molarity-calc";
import { dilutionEquationCalculator } from "./dilution-equation";
import { idealGasLawCalculator } from "./ideal-gas-law";
import { combinedGasLawCalculator } from "./combined-gas-law";
import { avogadroLawCalculator } from "./avogadro-law";
import { bufferCapacityCalculator } from "./buffer-capacity";
import { electrochemistryCellCalculator } from "./electrochemistry-cell";
import { enthalpyReactionCalculator } from "./enthalpy-reaction";
import { massToMolesCalculator } from "./mass-to-moles";
import { colligativeBoilingCalculator } from "./colligative-boiling";
import { colligativeFreezingCalculator } from "./colligative-freezing";
import { heatOfFusionCalculator } from "./heat-of-fusion";
import { heatOfVaporizationCalculator } from "./heat-of-vaporization";
import { henrysLawCalculator } from "./henrys-law";
import { footingSizeCalcCalculator } from "./footing-size-calc";
import { rebarSpacingCalculator } from "./rebar-spacing";
import { iBeamCalcCalculator } from "./i-beam-calc";
import { pipeSizeCalcCalculator } from "./pipe-size-calc";
import { rampSlopeCalcCalculator } from "./ramp-slope-calc";
import { staircaseDesignCalculator } from "./staircase-design";
import { treadRiserCalcCalculator } from "./tread-riser-calc";
import { concreteVolumeCalculator } from "./concrete-volume";
import { trussLoadCalculator } from "./truss-load";
import { mortarMixCalculator } from "./mortar-mix";
import { plywoodSheetsCalculator } from "./plywood-sheets";
import { shingleCalcCalculator } from "./shingle-calc";
import { gutterSizeCalcCalculator } from "./gutter-size-calc";
import { hvacLoadCalculator } from "./hvac-load";
import { ductSizeCalcCalculator } from "./duct-size-calc";
import { conduitFillCalcCalculator } from "./conduit-fill-calc";
import { joistSpanCalcCalculator } from "./joist-span-calc";
import { postSpacingCalcCalculator } from "./post-spacing-calc";
import { sandGravelCalcCalculator } from "./sand-gravel-calc";
import { wallpaperCalcCalculator } from "./wallpaper-calc";
import { crownMoldingCalcCalculator } from "./crown-molding-calc";
import { baseboardCalcCalculator } from "./baseboard-calc";
import { drywallCalcCalculator } from "./drywall-calc";
import { chiSquareTestCalculator } from "./chi-square-test";
import { tTestCalcCalculator } from "./t-test-calc";
import { fTestCalcCalculator } from "./f-test-calc";
import { anovaTestCalculator } from "./anova-test";
import { regressionLineCalculator } from "./regression-line";
import { correlationCoeffCalculator } from "./correlation-coeff";
import { covarianceCalcCalculator } from "./covariance-calc";
import { quartileCalcCalculator } from "./quartile-calc";
import { varianceCalcCalculator } from "./variance-calc";
import { typeIErrorCalculator } from "./type-i-error";
import { typeIiErrorCalculator } from "./type-ii-error";
import { positivePredictiveCalculator } from "./positive-predictive";
import { sampleSizeMeanCalculator } from "./sample-size-mean";
import { sipCalculator } from "./sip-calculator";
import { homeEquityCalcCalculator } from "./home-equity-calc";
import { helocPaymentCalculator } from "./heloc-payment";
import { fhaLoanCalcCalculator } from "./fha-loan-calc";
import { vaLoanCalcCalculator } from "./va-loan-calc";
import { incomePercentileCalculator } from "./income-percentile";
import { weddingBudgetCalcCalculator } from "./wedding-budget-calc";
import { hourlyToSalaryCalcCalculator } from "./hourly-to-salary-calc";
import { salaryToHourlyCalcCalculator } from "./salary-to-hourly-calc";
import { payrollTaxCalcCalculator } from "./payroll-tax-calc";
import { estateTaxCalcCalculator } from "./estate-tax-calc";
import { giftTaxCalcCalculator } from "./gift-tax-calc";
import { capitalGainsTaxCalculator } from "./capital-gains-tax";
import { annuityPaymentCalculator } from "./annuity-payment";
import { annuityPvCalculator } from "./annuity-pv";
import { annuityFvCalculator } from "./annuity-fv";
import { earlyRetirementCalculator } from "./early-retirement";
import { netWorthCalcCalculator } from "./net-worth-calc";
import { inflationAdjustedCalculator } from "./inflation-adjusted";
import { purchasingPowerCalculator } from "./purchasing-power";


import { vo2maxCalcCalculator } from "./vo2max-calc";
import { mhrCalcCalculator } from "./mhr-calc";
import { n1rmEpleyCalculator } from "./1rm-epley";
import { n1rmBrzyckiCalculator } from "./1rm-brzycki";
import { rmPercentageCalculator } from "./rm-percentage";
import { bodyweightRatioCalculator } from "./bodyweight-ratio";
import { verticalJumpCalculator } from "./vertical-jump";
import { sprintSpeedCalculator } from "./sprint-speed";
import { agilityScoreCalculator } from "./agility-score";
import { beepTestVo2Calculator } from "./beep-test-vo2";
import { runningCaloriePaceCalculator } from "./running-calorie-pace";
import { swimmingCssCalculator } from "./swimming-css";
import { climbingGradeCalculator } from "./climbing-grade";
import { carbonFootprintFlightCalculator } from "./carbon-footprint-flight";
import { carbonFootprintCarCalculator } from "./carbon-footprint-car";
import { carbonFootprintDietCalculator } from "./carbon-footprint-diet";
import { treeCarbonCalculator } from "./tree-carbon";
import { recyclingImpactCalculator } from "./recycling-impact";
import { foodWasteImpactCalculator } from "./food-waste-impact";
import { renewableEnergySavingsCalculator } from "./renewable-energy-savings";
import { rainGardenSizeCalculator } from "./rain-garden-size";
import { compostingMethaneCalculator } from "./composting-methane";
import { paperWasteCalculator } from "./paper-waste";
import { plasticUsageCalculator } from "./plastic-usage";
import { rankineToFahrenheitCalculator } from "./rankine-to-fahrenheit";
import { newtonToCelsiusTempCalculator } from "./newton-to-celsius-temp";
import { barToAtmCalculator } from "./bar-to-atm";
import { atmToBarCalculator } from "./atm-to-bar";
import { torrToAtmCalculator } from "./torr-to-atm";
import { mmhgToKpaCalculator } from "./mmhg-to-kpa";
import { kpaToPsiCalculator } from "./kpa-to-psi";
import { psiToKpaCalculator } from "./psi-to-kpa";
import { newtonToLbfCalculator } from "./newton-to-lbf";
import { lbfToNewtonCalculator } from "./lbf-to-newton";
import { jouleToCalorieCalculator } from "./joule-to-calorie";
import { calorieToJouleCalculator } from "./calorie-to-joule";
import { btuToJouleCalculator } from "./btu-to-joule";
import { jouleToKwhCalculator } from "./joule-to-kwh";
import { wattToHorsepowerCalculator } from "./watt-to-horsepower";
import { horsepowerToWattCalculator } from "./horsepower-to-watt";
import { machToMphCalculator } from "./mach-to-mph";
import { parsecToLyCalculator } from "./parsec-to-ly";
import { astronomicalUnitToKmCalculator } from "./astronomical-unit-to-km";
import { gramToTroyOunceCalculator } from "./gram-to-troy-ounce";
import { mlToCupsCalculator } from "./ml-to-cups";
import { squareMetersToSqftCalculator } from "./square-meters-to-sqft";
import { sqftToSqmCalculator } from "./sqft-to-sqm";
import { hectareToAcreCalculator } from "./hectare-to-acre";
import { fathomToFeetCalculator } from "./fathom-to-feet";
import { chainToFeetCalculator } from "./chain-to-feet";
import { furlongToMetersCalculator } from "./furlong-to-meters";
import { micronToMmCalculator } from "./micron-to-mm";
import { angstromToNmCalculator } from "./angstrom-to-nm";
import { rpmToRadSCalculator } from "./rpm-to-rad-s";
import { radSToRpmCalculator } from "./rad-s-to-rpm";
import { pascalToPsiCalculator } from "./pascal-to-psi";
import { dyneToNewtonCalculator } from "./dyne-to-newton";
import { ergToJouleCalculator } from "./erg-to-joule";
import { slugToKgCalculator } from "./slug-to-kg";
import { pennyweightToGramCalculator } from "./pennyweight-to-gram";
import { butterOilConvertCalculator } from "./butter-oil-convert";
import { flourTypeConvertCalculator } from "./flour-type-convert";
import { pastaServingSizeCalculator } from "./pasta-serving-size";
import { gravyAmountCalculator } from "./gravy-amount";
import { cranberrySauceCalculator } from "./cranberry-sauce";
import { turkeyThawTimeCalculator } from "./turkey-thaw-time";
import { turkeyCookTimeCalculator } from "./turkey-cook-time";
import { primeRibCookCalculator } from "./prime-rib-cook";
import { hamCookTimeCalculator } from "./ham-cook-time";
import { brisketCookCalculator } from "./brisket-cook";
import { pulledPorkAmountCalculator } from "./pulled-pork-amount";
import { pizzaDoughCalcCalculator } from "./pizza-dough-calc";
import { teaSteepingCalculator } from "./tea-steeping";
import { popcornYieldCalculator } from "./popcorn-yield";
import { jerkyYieldCalculator } from "./jerky-yield";
import { pickleBrineCalculator } from "./pickle-brine";
import { marshmallowRecipeCalculator } from "./marshmallow-recipe";
import { salsaRecipeCalculator } from "./salsa-recipe";
import { hummusRecipeCalculator } from "./hummus-recipe";
import { guacamoleCalcCalculator } from "./guacamole-calc";
import { icingAmountCalculator } from "./icing-amount";
import { fondantAmountCalculator } from "./fondant-amount";
import { matrixInverse2x2Calculator } from "./matrix-inverse-2x2";
import { eigenvalue2x2Calculator } from "./eigenvalue-2x2";
import { unitVectorCalculator } from "./unit-vector";
import { vectorAngleCalculator } from "./vector-angle";
import { complexNumberAddCalculator } from "./complex-number-add";
import { complexNumberMultiplyCalculator } from "./complex-number-multiply";
import { complexModulusCalculator } from "./complex-modulus";
import { maclaurinSeriesCalculator } from "./maclaurin-series";
import { numericalDerivativeCalculator } from "./numerical-derivative";
import { numericalIntegralCalculator } from "./numerical-integral";
import { newtonsMethodCalculator } from "./newtons-method";
import { bisectionMethodCalculator } from "./bisection-method";
import { bellNumberCalculator } from "./bell-number";
import { partitionNumberCalculator } from "./partition-number";
import { bernoulliNumberCalculator } from "./bernoulli-number";
import { downsizingChecklistCalculator } from "./downsizing-checklist";
import { electricityPerApplianceCalculator } from "./electricity-per-appliance";
import { airConditionerSizeCalculator } from "./air-conditioner-size";
import { airPurifierRoomCalculator } from "./air-purifier-room";
import { cleaningTimeCalculator } from "./cleaning-time";
import { groceryBudgetPlanCalculator } from "./grocery-budget-plan";
import { commuteCostCalcCalculator } from "./commute-cost-calc";
import { carWashCostCalculator } from "./car-wash-cost";
import { gymValueCalculator } from "./gym-value";
import { birthdayPartyBudgetCalculator } from "./birthday-party-budget";
import { weddingGuestCostCalculator } from "./wedding-guest-cost";
import { backToSchoolBudgetCalculator } from "./back-to-school-budget";
import { petMonthlyCostCalculator } from "./pet-monthly-cost";
import { hobbyBudgetCalculator } from "./hobby-budget";
import { vacationSavingsCalculator } from "./vacation-savings";
import { emergencyFundCalcCalculator } from "./emergency-fund-calc";
import { newBabyCostCalculator } from "./new-baby-cost";
import { allowanceByAgeCalculator } from "./allowance-by-age";
import { chorePayCalculator } from "./chore-pay";
import { giftRegistryCalculator } from "./gift-registry";


import { glasgowComaCalcCalculator } from "./glasgow-coma-calc";
import { painScaleAssessmentCalculator } from "./pain-scale-assessment";
import { fallRiskMorseCalculator } from "./fall-risk-morse";
import { news2ScoreCalculator } from "./news2-score";
import { urineOutputCalcCalculator } from "./urine-output-calc";
import { tubeFeedingRateCalculator } from "./tube-feeding-rate";
import { bmiPediatricCalculator } from "./bmi-pediatric";
import { gestationalDiabetesRiskCalculator } from "./gestational-diabetes-risk";
import { pediatricDoseWeightCalculator } from "./pediatric-dose-weight";
import { woundMeasurementCalculator } from "./wound-measurement";
import { bloodTransfusionVolCalculator } from "./blood-transfusion-vol";
import { dosageByBsaCalculator } from "./dosage-by-bsa";
import { correctedQtcCalculator } from "./corrected-qtc";
import { bloodAlcoholCalcCalculator } from "./blood-alcohol-calc";
import { waterIntakeCalcCalculator } from "./water-intake-calc";
import { sleepCycleCalcCalculator } from "./sleep-cycle-calc";
import { columnBucklingCalculator } from "./column-buckling";
import { weldStrengthCalculator } from "./weld-strength";
import { boltTorqueCalcCalculator } from "./bolt-torque-calc";
import { bearingLifeCalculator } from "./bearing-life";
import { heatExchangerCalculator } from "./heat-exchanger";
import { pumpPowerCalculator } from "./pump-power";
import { pipeFlowVelocityCalculator } from "./pipe-flow-velocity";
import { orificeFlowCalculator } from "./orifice-flow";
import { fanLawCalculator } from "./fan-law";
import { compressorPowerCalculator } from "./compressor-power";
import { thermalConductivityCalculator } from "./thermal-conductivity";
import { radiationHeatCalculator } from "./radiation-heat";
import { convectionHeatCalculator } from "./convection-heat";
import { nusseltNumberCalculator } from "./nusselt-number";
import { prandtlNumberCalculator } from "./prandtl-number";
import { grashofNumberCalculator } from "./grashof-number";
import { rayleighNumberCalculator } from "./rayleigh-number";
import { weberNumberCalculator } from "./weber-number";
import { strouhalNumberCalculator } from "./strouhal-number";
import { eulerNumberFlowCalculator } from "./euler-number-flow";
import { cavitationNumberCalculator } from "./cavitation-number";
import { stressStrainCurveCalculator } from "./stress-strain-curve";
import { fatigueLifeCalculator } from "./fatigue-life";
import { bandwidthCalcCalculator } from "./bandwidth-calc";
import { dataTransferTimeCalculator } from "./data-transfer-time";
import { screenPpiCalculator } from "./screen-ppi";
import { colorHexToRgbCalculator } from "./color-hex-to-rgb";
import { subnetHostsCalculator } from "./subnet-hosts";
import { raidCapacityCalculator } from "./raid-capacity";
import { cloudComputeCostCalculator } from "./cloud-compute-cost";
import { dnsPropagationTimeCalculator } from "./dns-propagation-time";
import { passwordEntropyCalculator } from "./password-entropy";
import { hashRateProfitCalculator } from "./hash-rate-profit";
import { nftRoyaltyCalculator } from "./nft-royalty";
import { saasMrrCalculator } from "./saas-mrr";
import { saasArrCalculator } from "./saas-arr";
import { churnRateCalcCalculator } from "./churn-rate-calc";
import { cohortRetentionCalculator } from "./cohort-retention";
import { emailRoiCalculator } from "./email-roi";
import { cpmCalcCalculator } from "./cpm-calc";
import { ellipsePerimeterCalculator } from "./ellipse-perimeter";
import { ellipsoidVolumeCalculator } from "./ellipsoid-volume";
import { torusSurfaceAreaCalculator } from "./torus-surface-area";
import { paraboloidVolumeCalculator } from "./paraboloid-volume";
import { regularPolygonAreaCalculator } from "./regular-polygon-area";
import { annulusAreaCalculator } from "./annulus-area";
import { arcLengthCalcCalculator } from "./arc-length-calc";
import { heronsFormulaCalculator } from "./herons-formula";
import { fibonacciCalcCalculator } from "./fibonacci-calc";
import { gradiansToDegreesCalculator } from "./gradians-to-degrees";
import { sphericalCoordinatesCalculator } from "./spherical-coordinates";
import { cylindricalCoordinatesCalculator } from "./cylindrical-coordinates";
import { shippingCostCalcCalculator } from "./shipping-cost-calc";
import { importTaxCalculator } from "./import-tax";
import { currencyConversionCalculator } from "./currency-conversion";
import { pricePerUnitCalcCalculator } from "./price-per-unit-calc";
import { salesTaxCalcCalculator } from "./sales-tax-calc";
import { vatCalcCalculator } from "./vat-calc";
import { gstCalcCalculator } from "./gst-calc";
import { propertyStampDutyCalculator } from "./property-stamp-duty";
import { landTransferTaxCalculator } from "./land-transfer-tax";
import { closingCostEstimateCalculator } from "./closing-cost-estimate";
import { titleInsuranceCostCalculator } from "./title-insurance-cost";
import { appraisalCostCalculator } from "./appraisal-cost";
import { cellPhonePlanCostCalculator } from "./cell-phone-plan-cost";
import { internetSpeedNeedsCalculator } from "./internet-speed-needs";
import { electricBillEstimateCalculator } from "./electric-bill-estimate";
import { gasBillEstimateCalculator } from "./gas-bill-estimate";
import { waterBillEstimateCalculator } from "./water-bill-estimate";
import { chimneySweepCostCalculator } from "./chimney-sweep-cost";
import { pestControlCostCalculator } from "./pest-control-cost";
import { hoaCostCalculator } from "./hoa-cost";
import { notaryCostCalculator } from "./notary-cost";
import { passportRenewalCostCalculator } from "./passport-renewal-cost";
import { visaApplicationCostCalculator } from "./visa-application-cost";
import { indiaIncomeTaxCalculator } from "./india-income-tax-calculator";
import { indiaGstCalculator } from "./india-gst-calculator";
import { indiaHraCalculator } from "./india-hra-calculator";
import { indiaEpfCalculator } from "./india-epf-calculator";
import { indiaSipCalculator } from "./india-sip-calculator";
import { indiaHomeLoanEmiCalculator } from "./india-home-loan-emi-calculator";
import { indiaGratuityCalculator } from "./india-gratuity-calculator";
import { indiaFdCalculator } from "./india-fd-calculator";
import { indiaPpfCalculator } from "./india-ppf-calculator";
import { chinaIncomeTaxCalculator } from "./china-income-tax-calculator";
import { chinaSocialInsuranceCalculator } from "./china-social-insurance-calculator";
import { chinaVatCalculator } from "./china-vat-calculator";
import { usaFederalIncomeTax2025Calculator } from "./usa-federal-income-tax-2025-calculator";
import { usaFicaCalculator } from "./usa-fica-calculator";
import { usa401kCalculator } from "./usa-401k-calculator";
import { usaCapitalGainsTaxCalculator } from "./usa-capital-gains-tax-calculator";
import { usaSelfEmploymentTaxCalculator } from "./usa-self-employment-tax-calculator";
import { usaRothIraCalculator } from "./usa-roth-ira-calculator";
import { indonesiaIncomeTaxCalculator } from "./indonesia-income-tax-calculator";
import { indonesiaVatCalculator } from "./indonesia-vat-calculator";
import { indonesiaSalaryCalculator } from "./indonesia-salary-calculator";
import { pakistanIncomeTaxCalculator } from "./pakistan-income-tax-calculator";
import { pakistanVatCalculator } from "./pakistan-vat-calculator";
import { pakistanSalaryCalculator } from "./pakistan-salary-calculator";
import { nigeriaIncomeTaxCalculator } from "./nigeria-income-tax-calculator";
import { nigeriaVatCalculator } from "./nigeria-vat-calculator";
import { nigeriaSalaryCalculator } from "./nigeria-salary-calculator";
import { brazilIncomeTaxCalculator } from "./brazil-income-tax-calculator";
import { brazilSalaryCalculator } from "./brazil-salary-calculator";
import { brazilInssCalculator } from "./brazil-inss-calculator";
import { brazil13thSalaryCalculator } from "./brazil-13th-salary-calculator";
import { bangladeshIncomeTaxCalculator } from "./bangladesh-income-tax-calculator";
import { bangladeshVatCalculator } from "./bangladesh-vat-calculator";
import { bangladeshSalaryCalculator } from "./bangladesh-salary-calculator";
import { russiaIncomeTaxCalculator } from "./russia-income-tax-calculator";
import { russiaVatCalculator } from "./russia-vat-calculator";
import { russiaSalaryCalculator } from "./russia-salary-calculator";
import { russiaSelfEmployedTaxCalculator } from "./russia-self-employed-tax-calculator";
import { ethiopiaIncomeTaxCalculator } from "./ethiopia-income-tax-calculator";
import { ethiopiaVatCalculator } from "./ethiopia-vat-calculator";
import { ethiopiaSalaryCalculator } from "./ethiopia-salary-calculator";
import { mexicoIncomeTaxCalculator } from "./mexico-income-tax-calculator";
import { mexicoVatCalculator } from "./mexico-vat-calculator";
import { mexicoSalaryCalculator } from "./mexico-salary-calculator";
import { mexicoAguinaldoCalculator } from "./mexico-aguinaldo-calculator";
import { japanIncomeTaxCalculator } from "./japan-income-tax-calculator";
import { japanVatCalculator } from "./japan-vat-calculator";
import { japanSalaryCalculator } from "./japan-salary-calculator";
import { philippinesIncomeTaxCalculator } from "./philippines-income-tax-calculator";
import { philippinesSssCalculator } from "./philippines-sss-calculator";
import { egyptIncomeTaxCalculator } from "./egypt-income-tax-calculator";
import { egyptVatCalculator } from "./egypt-vat-calculator";
import { egyptSalaryCalculator } from "./egypt-salary-calculator";
import { drCongoIncomeTaxCalculator } from "./dr-congo-income-tax-calculator";
import { drCongoVatCalculator } from "./dr-congo-vat-calculator";
import { vietnamIncomeTaxCalculator } from "./vietnam-income-tax-calculator";
import { vietnamVatCalculator } from "./vietnam-vat-calculator";
import { vietnamSalaryCalculator } from "./vietnam-salary-calculator";
import { iranIncomeTaxCalculator } from "./iran-income-tax-calculator";
import { iranVatCalculator } from "./iran-vat-calculator";
import { iranSalaryCalculator } from "./iran-salary-calculator";
import { turkeyIncomeTaxCalculator } from "./turkey-income-tax-calculator";
import { turkeySgkCalculator } from "./turkey-sgk-calculator";
import { germanyIncomeTaxCalculator } from "./germany-income-tax-calculator";
import { germanyGrossNetCalculator } from "./germany-gross-net-calculator";
import { germanyMinijobCalculator } from "./germany-minijob-calculator";
import { thailandIncomeTaxCalculator } from "./thailand-income-tax-calculator";
import { thailandVatCalculator } from "./thailand-vat-calculator";
import { thailandSalaryCalculator } from "./thailand-salary-calculator";
import { ukIncomeTaxCalculator } from "./uk-income-tax-calculator";
import { ukVatCalculator } from "./uk-vat-calculator";
import { ukSalaryCalculator } from "./uk-salary-calculator";
import { ukStampDutyCalculator } from "./uk-stamp-duty-calculator";
import { ukStudentLoanCalculator } from "./uk-student-loan-calculator";
import { ukDividendTaxCalculator } from "./uk-dividend-tax-calculator";
import { franceIncomeTaxCalculator } from "./france-income-tax-calculator";
import { franceVatCalculator } from "./france-vat-calculator";
import { franceSalaryCalculator } from "./france-salary-calculator";
import { franceAutoEntrepreneurCalculator } from "./france-auto-entrepreneur-calculator";
import { italyIncomeTaxCalculator } from "./italy-income-tax-calculator";
import { italyVatCalculator } from "./italy-vat-calculator";
import { italySalaryCalculator } from "./italy-salary-calculator";
import { italyRegimeForfettarioCalculator } from "./italy-regime-forfettario-calculator";
import { spainIncomeTaxCalculator } from "./spain-income-tax-calculator";
import { spainVatCalculator } from "./spain-vat-calculator";
import { spainSalaryCalculator } from "./spain-salary-calculator";
import { spainAutonomoCalculator } from "./spain-autonomo-calculator";
import { polandIncomeTaxCalculator } from "./poland-income-tax-calculator";
import { polandVatCalculator } from "./poland-vat-calculator";
import { polandSalaryCalculator } from "./poland-salary-calculator";
import { belgiumIncomeTaxCalculator } from "./belgium-income-tax-calculator";
import { belgiumVatCalculator } from "./belgium-vat-calculator";
import { belgiumSalaryCalculator } from "./belgium-salary-calculator";
import { austriaIncomeTaxCalculator } from "./austria-income-tax-calculator";
import { austriaVatCalculator } from "./austria-vat-calculator";
import { austriaSalaryCalculator } from "./austria-salary-calculator";
import { irelandIncomeTaxCalculator } from "./ireland-income-tax-calculator";
import { irelandVatCalculator } from "./ireland-vat-calculator";
import { irelandSalaryCalculator } from "./ireland-salary-calculator";
import { portugalIncomeTaxCalculator } from "./portugal-income-tax-calculator";
import { portugalVatCalculator } from "./portugal-vat-calculator";
import { portugalSalaryCalculator } from "./portugal-salary-calculator";
import { czechRepublicIncomeTaxCalculator } from "./czech-republic-income-tax-calculator";
import { czechRepublicVatCalculator } from "./czech-republic-vat-calculator";
import { czechRepublicSalaryCalculator } from "./czech-republic-salary-calculator";
import { greeceIncomeTaxCalculator } from "./greece-income-tax-calculator";
import { greeceVatCalculator } from "./greece-vat-calculator";
import { greeceSalaryCalculator } from "./greece-salary-calculator";
import { hungaryIncomeTaxCalculator } from "./hungary-income-tax-calculator";
import { hungaryVatCalculator } from "./hungary-vat-calculator";
import { hungarySalaryCalculator } from "./hungary-salary-calculator";
import { romaniaIncomeTaxCalculator } from "./romania-income-tax-calculator";
import { romaniaVatCalculator } from "./romania-vat-calculator";
import { romaniaSalaryCalculator } from "./romania-salary-calculator";
import { netherlandsIncomeTaxCalculator } from "./netherlands-income-tax-calculator";
import { netherlandsVatCalculator } from "./netherlands-vat-calculator";
import { netherlands30RulingCalculator } from "./netherlands-30-ruling-calculator";
import { swedenIncomeTaxCalculator } from "./sweden-income-tax-calculator";
import { swedenVatCalculator } from "./sweden-vat-calculator";
import { swedenSalaryCalculator } from "./sweden-salary-calculator";
import { denmarkIncomeTaxCalculator } from "./denmark-income-tax-calculator";
import { denmarkVatCalculator } from "./denmark-vat-calculator";
import { denmarkSalaryCalculator } from "./denmark-salary-calculator";
import { norwayIncomeTaxCalculator } from "./norway-income-tax-calculator";
import { norwayVatCalculator } from "./norway-vat-calculator";
import { norwaySalaryCalculator } from "./norway-salary-calculator";
import { finlandIncomeTaxCalculator } from "./finland-income-tax-calculator";
import { finlandVatCalculator } from "./finland-vat-calculator";
import { finlandSalaryCalculator } from "./finland-salary-calculator";
import { switzerlandIncomeTaxCalculator } from "./switzerland-income-tax-calculator";
import { switzerlandVatCalculator } from "./switzerland-vat-calculator";
import { switzerlandSalaryCalculator } from "./switzerland-salary-calculator";
import { euVatRatesCalculator } from "./eu-vat-rates-calculator";
import { debtConsolidationCalculator } from "./debt-consolidation-calculator";
import { carAccidentSettlementCalculator } from "./car-accident-settlement-calculator";
import { medicalMalpracticeCalculator } from "./medical-malpractice-calculator";
import { painSufferingCalculator } from "./pain-suffering-calculator";
import { lostWagesCalculator } from "./lost-wages-calculator";
import { dogBiteCompensationCalculator } from "./dog-bite-compensation-calculator";
import { slipAndFallCalculator } from "./slip-and-fall-calculator";
import { futureMedicalCostCalculator } from "./future-medical-cost-calculator";
import { homeReplacementCostCalculator } from "./home-replacement-cost-calculator";
import { disabilityIncomeGapCalculator } from "./disability-income-gap-calculator";
import { businessLiabilityCalculator } from "./business-liability-calculator";
import { absiCalculator } from "./absi-calculator";
import { adjustedBodyWeightCalculator } from "./adjusted-body-weight-calculator";
import { geriatricBmiCalculator } from "./geriatric-bmi-calculator";
import { mmeCalculator } from "./mme-calculator";
import { acftCalculator } from "./acft-calculator";
import { relativeFatMassCalculator } from "./relative-fat-mass-calculator";
import { bariatricWeightLossCalculator } from "./bariatric-weight-loss-calculator";
import { cssBoxShadowGeneratorCalculator } from "./css-box-shadow-generator";
import { jsonFormatterCalculator } from "./json-formatter";
import { base64EncoderDecoderCalculator } from "./base64-encoder-decoder";
import { regexTesterCalculator } from "./regex-tester";
import { jwtDecoderCalculator } from "./jwt-decoder";
import { cronExpressionGeneratorCalculator } from "./cron-expression-generator";
import { hashGeneratorCalculator } from "./hash-generator";
import { uuidGeneratorCalculator } from "./uuid-generator";
import { timesheetDecimalConverterCalculator } from "./timesheet-decimal-converter";
import { severancePayCalculator } from "./severance-pay-calculator";
import { ecommerceProfitMarginCalculator } from "./ecommerce-profit-margin-calculator";
import { utmBuilderCalculator } from "./utm-builder";
import { emailMetricsCalculator } from "./email-metrics-calculator";
import { cpmToCpcConverterCalculator } from "./cpm-to-cpc-converter";
import { retailDiscountCalculator } from "./retail-discount-calculator";
import { sunroomCostCalculator } from "./sunroom-cost-calculator";
import { porchCostCalculator } from "./porch-cost-calculator";
import { carportCostCalculator } from "./carport-cost-calculator";
import { artificialTurfCostCalculator } from "./artificial-turf-cost-calculator";
import { homeTheaterCostCalculator } from "./home-theater-cost-calculator";
import { closetRemodelCalculator } from "./closet-remodel-calculator";
import { saunaCostCalculator } from "./sauna-cost-calculator";
import { wineCellarCostCalculator } from "./wine-cellar-cost-calculator";
import { mudroomCostCalculator } from "./mudroom-cost-calculator";
import { dogFenceCostCalculator } from "./dog-fence-cost-calculator";
import { chickenRunCalculator } from "./chicken-run-calculator";
import { pizzaOvenCostCalculator } from "./pizza-oven-cost-calculator";
import { outdoorKitchenCostCalculator } from "./outdoor-kitchen-cost-calculator";
import { homeElevatorCostCalculator } from "./home-elevator-cost-calculator";
import { stormShelterCostCalculator } from "./storm-shelter-cost-calculator";
import { backupGeneratorCostCalculator } from "./backup-generator-cost-calculator";
import { homeSecurityCostCalculator } from "./home-security-cost-calculator";
import { soundproofingCostCalculator } from "./soundproofing-cost-calculator";
import { homeOfficeBuildCalculator } from "./home-office-build-calculator";
import { bathroomVanityCostCalculator } from "./bathroom-vanity-cost-calculator";
import { staircaseCostCalculator } from "./staircase-cost-calculator";
import { homeBarCostCalculator } from "./home-bar-cost-calculator";
import { murphyBedCostCalculator } from "./murphy-bed-cost-calculator";
import { atticConversionCalculator } from "./attic-conversion-calculator";
import { garageConversionCalculator } from "./garage-conversion-calculator";
import { laundromatStartupCalculator } from "./laundromat-startup-calculator";
import { vendingMachineRoiCalculator } from "./vending-machine-roi-calculator";
import { carWashStartupCalculator } from "./car-wash-startup-calculator";
import { foodTrailerCostCalculator } from "./food-trailer-cost-calculator";
import { atmBusinessCalculator } from "./atm-business-calculator";
import { storageUnitInvestmentCalculator } from "./storage-unit-investment-calculator";
import { mobileDetailingCalculator } from "./mobile-detailing-calculator";
import { lawnCareBusinessCalculator } from "./lawn-care-business-calculator";
import { cleaningBusinessCalculator } from "./cleaning-business-calculator";
import { pressureWashingBusinessCalculator } from "./pressure-washing-business-calculator";
import { airbnbExpenseCalculator } from "./airbnb-expense-calculator";
import { commercialRentCalculator } from "./commercial-rent-calculator";
import { capRateComparisonCalculator } from "./cap-rate-comparison-calculator";
import { costPerLeadCalculator } from "./cost-per-lead-calculator";
import { stockOptionCalculator } from "./stock-option-calculator";
import { rsuTaxCalculator } from "./rsu-tax-calculator";
import { esppCalculator } from "./espp-calculator";
import { requiredMinimumDistributionCalculator } from "./required-minimum-distribution-calculator";
import { screenTimeImpactCalculator } from "./screen-time-impact-calculator";
import { hearingLossRiskCalculator } from "./hearing-loss-risk-calculator";
import { sunExposureCalculator } from "./sun-exposure-calculator";
import { vaccineScheduleCalculator } from "./vaccine-schedule-calculator";
import { allergySeverityCalculator } from "./allergy-severity-calculator";
import { earthquakeEnergyCalculator } from "./earthquake-energy-calculator";
import { altitudePressureCalculator } from "./altitude-pressure-calculator";
import { terminalVelocityCalculator } from "./terminal-velocity-calculator";
import { orbitalPeriodCalculator } from "./orbital-period-calculator";
import { hexToRgbCalculator } from "./hex-to-rgb-calculator";
import { unixTimestampConverterCalculator } from "./unix-timestamp-converter";
import { numberBaseConverterCalculator } from "./number-base-converter";
import { asciiConverterCalculator } from "./ascii-converter";
import { cookingUnitConverterCalculator } from "./cooking-unit-converter";
import { combinationPermutationCalculator } from "./combination-permutation-calculator";
import { seriesSumCalculator } from "./series-sum-calculator";
import { carDepreciationScheduleCalculator } from "./car-depreciation-schedule-calculator";
import { carLeaseBuyoutCalculator } from "./car-lease-buyout-calculator";
import { carShippingCostCalculator } from "./car-shipping-cost-calculator";
import { carTintCostCalculator } from "./car-tint-cost-calculator";
import { fuelInjectorCalculator } from "./fuel-injector-calculator";
import { turboBoostCalculator } from "./turbo-boost-calculator";
import { spiceBlendCalculator } from "./spice-blend-calculator";
import { fermentationTemperatureCalculator } from "./fermentation-temperature-calculator";
import { sugarSyrupCalculator } from "./sugar-syrup-calculator";
import { dogFoodCostCalculator } from "./dog-food-cost-calculator";
import { dogAgeCalculator } from "./dog-age-calculator";
import { petEmergencyFundCalculator } from "./pet-emergency-fund-calculator";
import { dogExerciseCalculator } from "./dog-exercise-calculator";
import { catLitterCostCalculator } from "./cat-litter-cost-calculator";
import { petSittingRateCalculator } from "./pet-sitting-rate-calculator";
import { emergencyFundTimelineCalculator } from "./emergency-fund-timeline-calculator";
import { noSpendChallengeCalculator } from "./no-spend-challenge-calculator";
import { cashEnvelopeCalculator } from "./cash-envelope-calculator";
import { snowballVsAvalancheCalculator } from "./snowball-vs-avalanche-calculator";
import { collegeComparisonCalculator } from "./college-comparison-calculator";
import { privateSchoolCostCalculator } from "./private-school-cost-calculator";
import { extracurricularCostCalculator } from "./extracurricular-cost-calculator";
import { scienceFairCostCalculator } from "./science-fair-cost-calculator";
import { studentHousingCalculator } from "./student-housing-calculator";
import { gapYearBudgetCalculator } from "./gap-year-budget-calculator";
import { homeschoolCurriculumCalculator } from "./homeschool-curriculum-calculator";
import { schoolLunchCostCalculator } from "./school-lunch-cost-calculator";
import { compostingToiletCalculator } from "./composting-toilet-calculator";
import { greywaterSystemCalculator } from "./greywater-system-calculator";
import { foodForestCalculator } from "./food-forest-calculator";
import { clothDiaperSavingsCalculator } from "./cloth-diaper-savings-calculator";
import { zeroWasteSavingsCalculator } from "./zero-waste-savings-calculator";
import { ledConversionSavingsCalculator } from "./led-conversion-savings-calculator";
import { bicycleCommuteSavingsCalculator } from "./bicycle-commute-savings-calculator";
import { movieNightCostCalculator } from "./movie-night-cost-calculator";
import { concertBudgetCalculator } from "./concert-budget-calculator";
import { themeParkBudgetCalculator } from "./theme-park-budget-calculator";
import { escapeRoomCostCalculator } from "./escape-room-cost-calculator";
import { bowlingCostCalculator } from "./bowling-cost-calculator";
import { gameNightCalculator } from "./game-night-calculator";
import { karaokeCostCalculator } from "./karaoke-cost-calculator";
import { museumVisitCalculator } from "./museum-visit-calculator";
import { zooVisitCostCalculator } from "./zoo-visit-cost-calculator";
import { amusementParkCalculator } from "./amusement-park-calculator";
import { electricianRateCalculator } from "./electrician-rate-calculator";
import { plumberRateCalculator } from "./plumber-rate-calculator";
import { mechanicLaborRateCalculator } from "./mechanic-labor-rate-calculator";
import { contractorMarkupCalculator } from "./contractor-markup-calculator";
import { handymanPricingCalculator } from "./handyman-pricing-calculator";
import { photographerPricingCalculator } from "./photographer-pricing-calculator";
import { djPricingCalculator } from "./dj-pricing-calculator";
import { personalTrainerRateCalculator } from "./personal-trainer-rate-calculator";
import { tutoringRateCalculator } from "./tutoring-rate-calculator";
import { massageTherapistRateCalculator } from "./massage-therapist-rate-calculator";
import { meditationTimerCalculator } from "./meditation-timer-calculator";
import { stretchingRoutineCalculator } from "./stretching-routine-calculator";
import { supplementCostCalculator } from "./supplement-cost-calculator";
import { eyeStrainBreakCalculator } from "./eye-strain-break-calculator";
import { stepsToDistanceCalculator } from "./steps-to-distance-calculator";
import { standingDeskTimerCalculator } from "./standing-desk-timer-calculator";
import { movingDayTipCalculator } from "./moving-day-tip-calculator";
import { garageSalePricingCalculator } from "./garage-sale-pricing-calculator";
import { estateSaleCalculator } from "./estate-sale-calculator";
import { timeZoneMeetingCalculator } from "./time-zone-meeting-calculator";
import { powerOutageCostCalculator } from "./power-outage-cost-calculator";
import { noiseOrdinanceCalculator } from "./noise-ordinance-calculator";
import { radonMitigationCalculator } from "./radon-mitigation-calculator";
import { moldRemediationCalculator } from "./mold-remediation-calculator";
import { racePaceCalculator } from "./race-pace-calculator";
import { benchPressStrengthCalculator } from "./bench-press-strength-calculator";
import { squatStrengthCalculator } from "./squat-strength-calculator";
import { deadliftStrengthCalculator } from "./deadlift-strength-calculator";
import { rowingSplitCalculator } from "./rowing-split-calculator";
import { paddleBoardSizeCalculator } from "./paddle-board-size-calculator";
import { rockClimbingRopeLengthCalculator } from "./rock-climbing-rope-length-calculator";
import { lacrosseStickSizeCalculator } from "./lacrosse-stick-size-calculator";
import { dartCheckoutCalculator } from "./dart-checkout-calculator";
import { audioRoomTreatmentCalculator } from "./audio-room-treatment-calculator";
import { vinylRecordSpeedCalculator } from "./vinyl-record-speed-calculator";
import { paSystemSizeCalculator } from "./pa-system-size-calculator";
import { pianoTuningCostCalculator } from "./piano-tuning-cost-calculator";
import { musicLessonCostCalculator } from "./music-lesson-cost-calculator";
import { bandBookingCalculator } from "./band-booking-calculator";
import { recordingStudioCostCalculator } from "./recording-studio-cost-calculator";
import { audioCableLengthCalculator } from "./audio-cable-length-calculator";
import { snowLoadRoofCalculator } from "./snow-load-roof-calculator";
import { iceDamPreventionCalculator } from "./ice-dam-prevention-calculator";
import { winterHeatingCostCalculator } from "./winter-heating-cost-calculator";
import { summerCoolingCostCalculator } from "./summer-cooling-cost-calculator";
import { lawnWateringCostCalculator } from "./lawn-watering-cost-calculator";
import { snowBlowerSizeCalculator } from "./snow-blower-size-calculator";
import { hurricanePrepCostCalculator } from "./hurricane-prep-cost-calculator";
import { wildfirePrepCalculator } from "./wildfire-prep-calculator";
import { floodDamageCalculator } from "./flood-damage-calculator";
import { showerWaterUsageCalculator } from "./shower-water-usage-calculator";
import { laundryScheduleCalculator } from "./laundry-schedule-calculator";
import { dishwasherVsHandWashCalculator } from "./dishwasher-vs-hand-wash-calculator";
import { vacuumCleanerCostCalculator } from "./vacuum-cleaner-cost-calculator";
import { mattressReplacementCalculator } from "./mattress-replacement-calculator";
import { closetSpaceCalculator } from "./closet-space-calculator";
import { householdChemicalCostCalculator } from "./household-chemical-cost-calculator";
import { airFilterScheduleCalculator } from "./air-filter-schedule-calculator";
import { lightbulbComparisonCalculator } from "./lightbulb-comparison-calculator";
import { structuralBeamCalculator } from "./structural-beam-calculator";
import { torqueConversionCalculator } from "./torque-conversion-calculator";
import { pressureDropCalculator } from "./pressure-drop-calculator";
import { prenupCostCalculator } from "./prenup-cost-calculator";
import { trustFundCalculator } from "./trust-fund-calculator";
import { powerOfAttorneyCostCalculator } from "./power-of-attorney-cost-calculator";
import { sCorpTaxSavingsCalculator } from "./s-corp-tax-savings-calculator";
import { franchiseCostCalculator } from "./franchise-cost-calculator";
import { commercialInsuranceCalculator } from "./commercial-insurance-calculator";
import { landClearingCostCalculator } from "./land-clearing-cost-calculator";
import { wellDrillingCostCalculator } from "./well-drilling-cost-calculator";
import { septicInstallationCostCalculator } from "./septic-installation-cost-calculator";
import { propertyLineSurveyCalculator } from "./property-line-survey-calculator";
import { earnestMoneyCalculator } from "./earnest-money-calculator";
import { homeWarrantyCalculator } from "./home-warranty-calculator";
import { hoaFeeImpactCalculator } from "./hoa-fee-impact-calculator";
import { websiteCostCalculator } from "./website-cost-calculator";
import { saasPricingCalculator } from "./saas-pricing-calculator";
import { serverSizingCalculator } from "./server-sizing-calculator";
import { dataTransferCostCalculator } from "./data-transfer-cost-calculator";
import { bufferCalculator } from "./buffer-calculator";
import { reactionYieldCalculator } from "./reaction-yield-calculator";
import { gasLawCalculator } from "./gas-law-calculator";
import { spectrophotometerCalculator } from "./spectrophotometer-calculator";
import { disabilityBenefitsCalculator } from "./disability-benefits-calculator";
import { mesotheliomaSettlementCalculator } from "./mesothelioma-settlement-calculator";
import { medicalDebtCalculator } from "./medical-debt-calculator";
import { nursingHomeCostCalculator } from "./nursing-home-cost-calculator";
import { assistedLivingCostCalculator } from "./assisted-living-cost-calculator";
import { memoryCareCostCalculator } from "./memory-care-cost-calculator";
import { hospiceCostCalculator } from "./hospice-cost-calculator";
import { veteranBenefitsCalculator } from "./veteran-benefits-calculator";
import { mortgageRefinanceBreakEvenCalculator } from "./mortgage-refinance-break-even-calculator";
import { biweeklyMortgagePaymentCalculator } from "./biweekly-mortgage-payment-calculator";
import { mortgageExtraPaymentsCalculator } from "./mortgage-extra-payments-calculator";
import { mortgagePayoffCalculator } from "./mortgage-payoff-calculator";
import { mortgageQualificationDtiCalculator } from "./mortgage-qualification-dti-calculator";
import { homeValueEstimatorCalculator } from "./home-value-estimator";
import { cashOnCashReturnCalculator } from "./cash-on-cash-return-calculator";
import { n503020Calculator } from "./50-30-20-calculator";
import { monthlyBudgetCalculator } from "./monthly-budget-calculator";
import { sr22InsuranceCostCalculator } from "./sr22-insurance-cost-calculator";
import { medicarePartBPremiumCalculator } from "./medicare-part-b-premium-calculator";
import { medicarePartDCoverageGapCalculator } from "./medicare-part-d-coverage-gap-calculator";
import { medigapPlanComparisonCalculator } from "./medigap-plan-comparison-calculator";
import { longTermCareInsuranceCostCalculator } from "./long-term-care-insurance-cost-calculator";
import { autoInsuranceDeductibleComparisonCalculator } from "./auto-insurance-deductible-comparison-calculator";
import { umbrellaInsuranceCoverageCalculator } from "./umbrella-insurance-coverage-calculator";
import { homeownersInsuranceEstimateCalculator } from "./homeowners-insurance-estimate-calculator";
import { healthInsurancePremiumTaxCreditCalculator } from "./health-insurance-premium-tax-credit-calculator";
import { disabilityInsuranceBenefitCalculator } from "./disability-insurance-benefit-calculator";
import { spousalSupportDurationCalculator } from "./spousal-support-duration-calculator";
import { timeAndAHalfCalculator } from "./time-and-a-half-calculator";
import { doubleTimePayCalculator } from "./double-time-pay-calculator";
import { truckAccidentSettlementCalculator } from "./truck-accident-settlement-calculator";
import { whiplashSettlementCalculator } from "./whiplash-settlement-calculator";
import { painAndSufferingMultiplierCalculator } from "./pain-and-suffering-multiplier-calculator";
import { attorneyContingencyFeeCalculator } from "./attorney-contingency-fee-calculator";
import { structuredSettlementPayoutCalculator } from "./structured-settlement-payout-calculator";
import { backPayCalculator } from "./back-pay-calculator";
import { wageTheftRecoveryCalculator } from "./wage-theft-recovery-calculator";
import { forexPositionSizeCalculator } from "./forex-position-size-calculator";
import { forexPipValueCalculator } from "./forex-pip-value-calculator";
import { forexMarginCalculator } from "./forex-margin-calculator";
import { forexProfitLossCalculator } from "./forex-profit-loss-calculator";
import { forexSwapCalculator } from "./forex-swap-calculator";
import { cryptoLeverageLiquidationCalculator } from "./crypto-leverage-liquidation-calculator";
import { ethereumGasFeeCalculator } from "./ethereum-gas-fee-calculator";
import { ironCondorCalculator } from "./iron-condor-calculator";
import { cryptoPortfolioRebalancingCalculator } from "./crypto-portfolio-rebalancing-calculator";
import { cryptoYieldFarmingApyCalculator } from "./crypto-yield-farming-apy-calculator";
import { estimatedTaxCalculator } from "./estimated-tax-calculator";
import { marginalTaxRateCalculator } from "./marginal-tax-rate-calculator";
import { effectiveTaxRateCalculator } from "./effective-tax-rate-calculator";
import { itemizedDeductionCalculator } from "./itemized-deduction-calculator";
import { charitableDonationCalculator } from "./charitable-donation-calculator";
import { catchUpContributionCalculator } from "./catch-up-contribution-calculator";
import { solo401kCalculator } from "./solo-401k-calculator";
import { rothIraIncomeLimitCalculator } from "./roth-ira-income-limit-calculator";
import { fertilityByAgeCalculator } from "./fertility-by-age-calculator";
import { hcgDoublingTimeCalculator } from "./hcg-doubling-time-calculator";
import { implantationDateCalculator } from "./implantation-date-calculator";
import { reverseDueDateCalculator } from "./reverse-due-date-calculator";
import { fetalWeightPercentileCalculator } from "./fetal-weight-percentile-calculator";
import { birthWeightPercentileCalculator } from "./birth-weight-percentile-calculator";
import { babyFormulaAmountCalculator } from "./baby-formula-amount-calculator";
import { babyMilkIntakeCalculator } from "./baby-milk-intake-calculator";
import { exclusivePumpingCalculator } from "./exclusive-pumping-calculator";
import { vbacSuccessRateCalculator } from "./vbac-success-rate-calculator";
import { chancesOfTwinsCalculator } from "./chances-of-twins-calculator";
import { babyEyeColorCalculator } from "./baby-eye-color-calculator";
import { childHeightPredictionCalculator } from "./child-height-prediction-calculator";
import { pediatricBmiPercentileCalculator } from "./pediatric-bmi-percentile-calculator";
import { sipStepUpCalculator } from "./sip-step-up-calculator";
import { lumpSumInvestmentCalculator } from "./lump-sum-investment-calculator";
import { mutualFundReturnsCalculatorIndiaCalculator } from "./mutual-fund-returns-calculator-india";
import { goldInvestmentCalculatorIndiaCalculator } from "./gold-investment-calculator-india";
import { elssTaxSavingCalculator } from "./elss-tax-saving-calculator";
import { section80cDeductionCalculator } from "./section-80c-deduction-calculator";
import { dearnessAllowanceCalculator } from "./dearness-allowance-calculator";
import { irpfCalculatorBrazilCalculator } from "./irpf-calculator-brazil";
import { fgtsCalculatorBrazilCalculator } from "./fgts-calculator-brazil";
import { financiamentoImobiliarioCalculator } from "./financiamento-imobiliario-calculator";
import { inssContributionCalculatorBrazilCalculator } from "./inss-contribution-calculator-brazil";
import { cltVsPjCalculatorBrazilCalculator } from "./clt-vs-pj-calculator-brazil";
import { decimoTerceiroCalculator } from "./decimo-terceiro-calculator";
import { iptuCalculatorBrazilCalculator } from "./iptu-calculator-brazil";
import { rescisaoCalculatorBrazilCalculator } from "./rescisao-calculator-brazil";
import { simplesNacionalCalculator } from "./simples-nacional-calculator";
import { feriasCalculatorBrazilCalculator } from "./ferias-calculator-brazil";
import { w4Calculator } from "./w4-calculator";
import { taxRefundCalculator } from "./tax-refund-calculator";
import { standardDeductionCalculator } from "./standard-deduction-calculator";
import { energyTaxCreditCalculator } from "./energy-tax-credit-calculator";
import { adoptionTaxCreditCalculator } from "./adoption-tax-credit-calculator";
import { millRateCalculator } from "./mill-rate-calculator";
import { propertyTaxAppealCalculator } from "./property-tax-appeal-calculator";
import { employerPayrollTaxCalculator } from "./employer-payroll-tax-calculator";
import { applianceLifespanCalculator } from "./appliance-lifespan-calculator";
import { homeMaintenanceBudgetCalculator } from "./home-maintenance-budget-calculator";
import { repairVsReplaceCalculator } from "./repair-vs-replace-calculator";
import { streamingComparisonCalculator } from "./streaming-comparison-calculator";
import { mealKitComparisonCalculator } from "./meal-kit-comparison-calculator";
import { hourlyRateCalculator } from "./hourly-rate-calculator";
import { commissionRateCalculator } from "./commission-rate-calculator";
import { realHourlyWageCalculator } from "./real-hourly-wage-calculator";
import { costPerHireCalculator } from "./cost-per-hire-calculator";
import { employeeTurnoverCostCalculator } from "./employee-turnover-cost-calculator";
import { collegeSavingsGapCalculator } from "./college-savings-gap-calculator";
import { scholarshipRoiCalculator } from "./scholarship-roi-calculator";
import { gradSchoolRoiCalculator } from "./grad-school-roi-calculator";
import { n529ContributionCalculator } from "./529-contribution-calculator";
import { financialAidEfcCalculator } from "./financial-aid-efc-calculator";
import { tuitionInflationCalculator } from "./tuition-inflation-calculator";
import { carInsuranceComparisonCalculator } from "./car-insurance-comparison-calculator";
import { carLoanPayoffCalculator } from "./car-loan-payoff-calculator";
import { gasVsElectricCarCalculator } from "./gas-vs-electric-car-calculator";
import { carMaintenanceScheduleCalculator } from "./car-maintenance-schedule-calculator";
import { usedCarValueCalculator } from "./used-car-value-calculator";
import { macronutrientRatioCalculator } from "./macronutrient-ratio-calculator";
import { rentVsBuyBreakEvenCalculator } from "./rent-vs-buy-break-even-calculator";
import { propertyFlipProfitCalculator } from "./property-flip-profit-calculator";
import { vacancyRateImpactCalculator } from "./vacancy-rate-impact-calculator";
import { closingCostEstimatorCalculator } from "./closing-cost-estimator-calculator";
import { bodyFatPercentageCalculator } from "./body-fat-percentage-calculator";
import { dailyStepGoalCalculator } from "./daily-step-goal-calculator";
import { flexibilityAgeCalculator } from "./flexibility-age-calculator";
import { runningPaceConversionCalculator } from "./running-pace-conversion-calculator";
import { breakEvenAnalysisCalculator } from "./break-even-analysis-calculator";
import { markupVsMarginCalculator } from "./markup-vs-margin-calculator";
import { invoiceLateFeeCalculator } from "./invoice-late-fee-calculator";
import { accountsReceivableTurnoverCalculator } from "./accounts-receivable-turnover-calculator";
import { waterUsageCalculator } from "./water-usage-calculator";
import { compostingSavingsCalculator } from "./composting-savings-calculator";
import { treePlantingOffsetCalculator } from "./tree-planting-offset-calculator";
import { ledVsIncandescentCalculator } from "./led-vs-incandescent-calculator";
import { electricBillSplitCalculator } from "./electric-bill-split-calculator";
import { flightCostPerMileCalculator } from "./flight-cost-per-mile-calculator";
import { hotelVsAirbnbCalculator } from "./hotel-vs-airbnb-calculator";
import { travelInsuranceValueCalculator } from "./travel-insurance-value-calculator";
import { pointsValueCalculator } from "./points-value-calculator";
import { retirementTaxCalculator } from "./retirement-tax-calculator";
import { trustDistributionCalculator } from "./trust-distribution-calculator";
import { hydraulicCylinderCalculator } from "./hydraulic-cylinder-calculator";
import { petFoodCostCalculator } from "./pet-food-cost-calculator";
import { aquariumVolumeCalculator } from "./aquarium-volume-calculator";
import { petMedicationDosageCalculator } from "./pet-medication-dosage-calculator";
import { speakerWireGaugeCalculator } from "./speaker-wire-gauge-calculator";
import { musicRoyaltyCalculator } from "./music-royalty-calculator";
import { printResolutionCalculator } from "./print-resolution-calculator";
import { goldenRatioCropCalculator } from "./golden-ratio-crop-calculator";
import { photoStorageCalculator } from "./photo-storage-calculator";
import { yarnYardageCalculator } from "./yarn-yardage-calculator";
import { fertilizerRateCalculator } from "./fertilizer-rate-calculator";
import { anchorRodeCalculator } from "./anchor-rode-calculator";
import { bleedMarginCalculator } from "./bleed-margin-calculator";
import { colorContrastRatioCalculator } from "./color-contrast-ratio-calculator";
import { solarBatterySizingCalculator } from "./solar-battery-sizing-calculator";
import { capacitorChargeCalculator } from "./capacitor-charge-calculator";
import { profitMarginPerUnitCalculator } from "./profit-margin-per-unit-calculator";
import { shippingCostEstimatorCalculator } from "./shipping-cost-estimator-calculator";
import { businessLoanPaymentCalculator } from "./business-loan-payment-calculator";
import { fenceMaterialCalculator } from "./fence-material-calculator";
import { gutterDownspoutCalculator } from "./gutter-downspout-calculator";
import { asphaltPavingCalculator } from "./asphalt-paving-calculator";
import { poolPumpSizingCalculator } from "./pool-pump-sizing-calculator";
import { paverCalculator } from "./paver-calculator";
import { postHoleConcreteCalculator } from "./post-hole-concrete-calculator";
import { rainBarrelSavingsCalculator } from "./rain-barrel-savings-calculator";
import { wellPumpSizingCalculator } from "./well-pump-sizing-calculator";
import { frenchDrainGravelCalculator } from "./french-drain-gravel-calculator";
import { gutterRainCalculator } from "./gutter-rain-calculator";
import { atticVentilationCalculator } from "./attic-ventilation-calculator";
import { crawlSpaceEncapsulationCalculator } from "./crawl-space-encapsulation-calculator";
import { windowUFactorCalculator } from "./window-u-factor-calculator";
import { baseboardLengthCalculator } from "./baseboard-length-calculator";
import { chairRailCalculator } from "./chair-rail-calculator";
import { tileGroutCalculator } from "./tile-grout-calculator";
import { backsplashTileCalculator } from "./backsplash-tile-calculator";
import { firewoodBtuCalculator } from "./firewood-btu-calculator";
import { pelletStoveCostCalculator } from "./pellet-stove-cost-calculator";
import { ductInsulationCalculator } from "./duct-insulation-calculator";
import { airFilterReplacementCalculator } from "./air-filter-replacement-calculator";
import { waterHeaterCostCalculator } from "./water-heater-cost-calculator";
import { tanklessWaterHeaterSavingsCalculator } from "./tankless-water-heater-savings-calculator";
import { sumpPumpSizingCalculator } from "./sump-pump-sizing-calculator";
import { dehumidifierSizingCalculator } from "./dehumidifier-sizing-calculator";
import { humidifierSizingCalculator } from "./humidifier-sizing-calculator";
import { airPurifierRoomSizeCalculator } from "./air-purifier-room-size-calculator";
import { transferSwitchCalculator } from "./transfer-switch-calculator";
import { electricalPanelLoadCalculator } from "./electrical-panel-load-calculator";
import { circuitBreakerSizingCalculator } from "./circuit-breaker-sizing-calculator";
import { pipeFlowRateCalculator } from "./pipe-flow-rate-calculator";
import { pipePressureDropCalculator } from "./pipe-pressure-drop-calculator";
import { pondLinerCalculator } from "./pond-liner-calculator";
import { concreteDrivewayCostCalculator } from "./concrete-driveway-cost-calculator";
import { pergolaShadeCalculator } from "./pergola-shade-calculator";
import { trampolineWeightLimitCalculator } from "./trampoline-weight-limit-calculator";
import { swingSetSpacingCalculator } from "./swing-set-spacing-calculator";
import { sandboxSandCalculator } from "./sandbox-sand-calculator";
import { basketballCourtSizeCalculator } from "./basketball-court-size-calculator";
import { tennisCourtCostCalculator } from "./tennis-court-cost-calculator";
import { battingCageSizeCalculator } from "./batting-cage-size-calculator";
import { archeryRangeCalculator } from "./archery-range-calculator";
import { dartBoardHeightCalculator } from "./dart-board-height-calculator";
import { billiardRoomSizeCalculator } from "./billiard-room-size-calculator";
import { homeGymSpaceCalculator } from "./home-gym-space-calculator";
import { saunaHeaterCalculator } from "./sauna-heater-calculator";
import { steamRoomGeneratorCalculator } from "./steam-room-generator-calculator";
import { wineCellarCapacityCalculator } from "./wine-cellar-capacity-calculator";
import { bookshelfCapacityCalculator } from "./bookshelf-capacity-calculator";
import { kitchenIslandSizeCalculator } from "./kitchen-island-size-calculator";
import { countertopSquareFootageCalculator } from "./countertop-square-footage-calculator";
import { cabinetHardwareCalculator } from "./cabinet-hardware-calculator";
import { lightingLumenCalculator } from "./lighting-lumen-calculator";
import { recessedLightingCalculator } from "./recessed-lighting-calculator";
import { landscapeLightingCalculator } from "./landscape-lighting-calculator";
import { underCabinetLightingCalculator } from "./under-cabinet-lighting-calculator";
import { ceilingHeightCalculator } from "./ceiling-height-calculator";
import { staircaseCarpetCalculator } from "./staircase-carpet-calculator";
import { windowTreatmentCalculator } from "./window-treatment-calculator";
import { blindsSizeCalculator } from "./blinds-size-calculator";
import { tvViewingDistanceCalculator } from "./tv-viewing-distance-calculator";
import { projectorScreenSizeCalculator } from "./projector-screen-size-calculator";
import { ethernetCableCalculator } from "./ethernet-cable-calculator";
import { wifiAccessPointCalculator } from "./wifi-access-point-calculator";
import { upsBatteryCalculator } from "./ups-battery-calculator";
import { serverRackCalculator } from "./server-rack-calculator";
import { ipSubnetCalculator } from "./ip-subnet-calculator";
import { backupStorageCalculator } from "./backup-storage-calculator";
import { printTime3dCalculator } from "./print-time-3d-calculator";
import { laserCuttingCostCalculator } from "./laser-cutting-cost-calculator";
import { cncMachiningCostCalculator } from "./cnc-machining-cost-calculator";
import { injectionMoldingCostCalculator } from "./injection-molding-cost-calculator";
import { heatSinkCalculator } from "./heat-sink-calculator";
import { stepperMotorTorqueCalculator } from "./stepper-motor-torque-calculator";
import { weddingGuestCalculator } from "./wedding-guest-calculator";
import { weddingCakeCalculator } from "./wedding-cake-calculator";
import { eventTentSizeCalculator } from "./event-tent-size-calculator";
import { eventCateringCalculator } from "./event-catering-calculator";
import { eventBarCalculator } from "./event-bar-calculator";
import { retirementHomeCostCalculator } from "./retirement-home-cost-calculator";
import { medicareSupplementCalculator } from "./medicare-supplement-calculator";
import { grabBarPlacementCalculator } from "./grab-bar-placement-calculator";
import { medicationScheduleCalculator } from "./medication-schedule-calculator";
import { visionCorrectionCostCalculator } from "./vision-correction-cost-calculator";
import { servoMotorCalculator } from "./servo-motor-calculator";
import { relaySizingCalculator } from "./relay-sizing-calculator";
import { transformerSizingCalculator } from "./transformer-sizing-calculator";
import { dowelJointCalculator } from "./dowel-joint-calculator";
import { woodScrewPilotHoleCalculator } from "./wood-screw-pilot-hole-calculator";
import { weldFillerMetalCalculator } from "./weld-filler-metal-calculator";
import { weldHeatInputCalculator } from "./weld-heat-input-calculator";
import { sheetMetalBendCalculator } from "./sheet-metal-bend-calculator";
import { tapDrillSizeCalculator } from "./tap-drill-size-calculator";
import { fabricShrinkageCalculator } from "./fabric-shrinkage-calculator";
import { elasticLengthCalculator } from "./elastic-length-calculator";
import { seedRateCalculator } from "./seed-rate-calculator";
import { irrigationWaterCalculator } from "./irrigation-water-calculator";
import { pastureStockingRateCalculator } from "./pasture-stocking-rate-calculator";
import { grainBinCapacityCalculator } from "./grain-bin-capacity-calculator";
import { tractorPtoCalculator } from "./tractor-pto-calculator";
import { runwayLengthCalculator } from "./runway-length-calculator";
import { nauticalMileConverterCalculator } from "./nautical-mile-converter-calculator";
import { trueWindCalculator } from "./true-wind-calculator";
import { tidalRangeCalculator } from "./tidal-range-calculator";
import { chartDistanceCalculator } from "./chart-distance-calculator";
import { fuelRangeCalculator } from "./fuel-range-calculator";
import { barometricPressureAltitudeCalculator } from "./barometric-pressure-altitude-calculator";
import { uvExposureCalculator } from "./uv-exposure-calculator";
import { rainfallIntensityCalculator } from "./rainfall-intensity-calculator";
import { lightYearDistanceCalculator } from "./light-year-distance-calculator";
import { gamingPcWattageCalculator } from "./gaming-pc-wattage-calculator";
import { gamingFpsCalculator } from "./gaming-fps-calculator";
import { keyboardSwitchCalculator } from "./keyboard-switch-calculator";
import { diceProbabilityCalculator } from "./dice-probability-calculator";
import { miniatureScaleCalculator } from "./miniature-scale-calculator";
import { origamiPaperSizeCalculator } from "./origami-paper-size-calculator";
import { wineSulfiteCalculator } from "./wine-sulfite-calculator";
import { kombuchaBrewingCalculator } from "./kombucha-brewing-calculator";
import { essentialOilDilutionCalculator } from "./essential-oil-dilution-calculator";
import { soapLyeCalculator } from "./soap-lye-calculator";
import { leatherThicknessCalculator } from "./leather-thickness-calculator";
import { packingTapeCalculator } from "./packing-tape-calculator";
import { furnitureMovingWeightCalculator } from "./furniture-moving-weight-calculator";
import { relocationCostOfLivingCalculator } from "./relocation-cost-of-living-calculator";
import { commuteComparisonCalculator } from "./commute-comparison-calculator";
import { neighborhoodAffordabilityCalculator } from "./neighborhood-affordability-calculator";
import { pressureWashingCalculator } from "./pressure-washing-calculator";
import { windowCleaningCalculator } from "./window-cleaning-calculator";
import { maidServiceCostCalculator } from "./maid-service-cost-calculator";
import { deepCleaningChecklistCalculator } from "./deep-cleaning-checklist-calculator";
import { laundryLoadCalculator } from "./laundry-load-calculator";
import { dryerEnergyCostCalculator } from "./dryer-energy-cost-calculator";
import { stainRemovalCalculator } from "./stain-removal-calculator";
import { ironingTimeCalculator } from "./ironing-time-calculator";
import { securityCameraCalculator } from "./security-camera-calculator";
import { securitySystemCostCalculator } from "./security-system-cost-calculator";
import { motionSensorCalculator } from "./motion-sensor-calculator";
import { smartLockCostCalculator } from "./smart-lock-cost-calculator";
import { safeSizeCalculator } from "./safe-size-calculator";
import { emergencyWaterSupplyCalculator } from "./emergency-water-supply-calculator";
import { emergencyFoodSupplyCalculator } from "./emergency-food-supply-calculator";
import { emergencyGeneratorFuelCalculator } from "./emergency-generator-fuel-calculator";
import { firstAidKitCalculator } from "./first-aid-kit-calculator";
import { evacuationTimeCalculator } from "./evacuation-time-calculator";
import { fireExtinguisherCalculator } from "./fire-extinguisher-calculator";
import { smokeDetectorCalculator } from "./smoke-detector-calculator";
import { lightningRodCalculator } from "./lightning-rod-calculator";
import { earthquakeRetrofitCalculator } from "./earthquake-retrofit-calculator";
import { oshaNoiseExposureCalculator } from "./osha-noise-exposure-calculator";
import { fireCodeOccupancyCalculator } from "./fire-code-occupancy-calculator";
import { parkingLotStripingCalculator } from "./parking-lot-striping-calculator";
import { signSizeCalculator } from "./sign-size-calculator";
import { loadingDockCalculator } from "./loading-dock-calculator";
import { commercialKitchenVentilationCalculator } from "./commercial-kitchen-ventilation-calculator";
import { restaurantSeatingCalculator } from "./restaurant-seating-calculator";
import { barInventoryCalculator } from "./bar-inventory-calculator";
import { foodWasteCostCalculator } from "./food-waste-cost-calculator";
import { palletLoadCalculator } from "./pallet-load-calculator";
import { containerLoadCalculator } from "./container-load-calculator";
import { freightClassCalculator } from "./freight-class-calculator";
import { dimensionalWeightCalculator } from "./dimensional-weight-calculator";
import { ltlFreightCostCalculator } from "./ltl-freight-cost-calculator";
import { pickPackTimeCalculator } from "./pick-pack-time-calculator";
import { forkliftCapacityCalculator } from "./forklift-capacity-calculator";
import { conveyorSpeedCalculator } from "./conveyor-speed-calculator";
import { fleetFuelCostCalculator } from "./fleet-fuel-cost-calculator";
import { vehicleDepreciationScheduleCalculator } from "./vehicle-depreciation-schedule-calculator";
import { tireRotationScheduleCalculator } from "./tire-rotation-schedule-calculator";
import { trailerTongueWeightCalculator } from "./trailer-tongue-weight-calculator";
import { fuelSurchargeCalculator } from "./fuel-surcharge-calculator";
import { deadheadMilesCalculator } from "./deadhead-miles-calculator";
import { driverPayCalculator } from "./driver-pay-calculator";
import { eldHoursCalculator } from "./eld-hours-calculator";
import { customsDutyCalculator } from "./customs-duty-calculator";
import { landedCostCalculator } from "./landed-cost-calculator";
import { cbmCalculator } from "./cbm-calculator";
import { containerWeightCalculator } from "./container-weight-calculator";
import { palletizingCalculator } from "./palletizing-calculator";
import { antennaGainCalculator } from "./antenna-gain-calculator";
import { linkBudgetCalculator } from "./link-budget-calculator";
import { freeSpacePathLossCalculator } from "./free-space-path-loss-calculator";
import { coaxCableLossCalculator } from "./coax-cable-loss-calculator";
import { fiberOpticLossCalculator } from "./fiber-optic-loss-calculator";
import { samplingRateCalculator } from "./sampling-rate-calculator";
import { fftBinResolutionCalculator } from "./fft-bin-resolution-calculator";
import { soundIntensityCalculator } from "./sound-intensity-calculator";
import { reverberationDistanceCalculator } from "./reverberation-distance-calculator";
import { lensFocalLengthCalculator } from "./lens-focal-length-calculator";
import { magnifyingGlassCalculator } from "./magnifying-glass-calculator";
import { mirrorFocalPointCalculator } from "./mirror-focal-point-calculator";
import { viscosityCalculator } from "./viscosity-calculator";
import { projectileRangeCalculator } from "./projectile-range-calculator";
import { employeeOnboardingCostCalculator } from "./employee-onboarding-cost-calculator";
import { absenteeismCostCalculator } from "./absenteeism-cost-calculator";
import { overtimeCostCalculator } from "./overtime-cost-calculator";
import { ptoAccrualCalculator } from "./pto-accrual-calculator";
import { workersCompRateCalculator } from "./workers-comp-rate-calculator";
import { employeeBenefitsCostCalculator } from "./employee-benefits-cost-calculator";
import { officeSpacePerEmployeeCalculator } from "./office-space-per-employee-calculator";
import { nonprofitOverheadRateCalculator } from "./nonprofit-overhead-rate-calculator";
import { fundraisingRoiCalculator } from "./fundraising-roi-calculator";
import { grantMatchCalculator } from "./grant-match-calculator";
import { donorRetentionCalculator } from "./donor-retention-calculator";
import { volunteerValueCalculator } from "./volunteer-value-calculator";
import { programCostPerOutcomeCalculator } from "./program-cost-per-outcome-calculator";
import { churchTitheCalculator } from "./church-tithe-calculator";
import { churchSeatingCapacityCalculator } from "./church-seating-capacity-calculator";
import { churchBudgetCalculator } from "./church-budget-calculator";
import { missionTripCostCalculator } from "./mission-trip-cost-calculator";
import { vacationBibleSchoolCalculator } from "./vacation-bible-school-calculator";
import { potluckFoodCalculator } from "./potluck-food-calculator";
import { conferenceRoomCalculator } from "./conference-room-calculator";
import { cubicleLayoutCalculator } from "./cubicle-layout-calculator";
import { standingDeskHeightCalculator } from "./standing-desk-height-calculator";
import { dentalCrownCostCalculator } from "./dental-crown-cost-calculator";
import { dentalBridgeCostCalculator } from "./dental-bridge-cost-calculator";
import { dentalVeneerCostCalculator } from "./dental-veneer-cost-calculator";
import { orthodonticPaymentCalculator } from "./orthodontic-payment-calculator";
import { dentalCleaningFrequencyCalculator } from "./dental-cleaning-frequency-calculator";
import { rootCanalCostCalculator } from "./root-canal-cost-calculator";
import { teethWhiteningCostCalculator } from "./teeth-whitening-cost-calculator";
import { vetVisitCostCalculator } from "./vet-visit-cost-calculator";
import { petVaccinationScheduleCalculator } from "./pet-vaccination-schedule-calculator";
import { petSpayNeuterCostCalculator } from "./pet-spay-neuter-cost-calculator";
import { petDentalCostCalculator } from "./pet-dental-cost-calculator";
import { petWeightCalculator } from "./pet-weight-calculator";
import { pillDosageCalculator } from "./pill-dosage-calculator";
import { liquidMedicationCalculator } from "./liquid-medication-calculator";
import { medicationHalfLifeCalculator } from "./medication-half-life-calculator";
import { eyeglassPrescriptionCalculator } from "./eyeglass-prescription-calculator";
import { pupillaryDistanceCalculator } from "./pupillary-distance-calculator";
import { readingGlassesStrengthCalculator } from "./reading-glasses-strength-calculator";
import { eyeExamCostCalculator } from "./eye-exam-cost-calculator";
import { blueLightExposureCalculator } from "./blue-light-exposure-calculator";
import { babysittingRateCalculator } from "./babysitting-rate-calculator";
import { auPairCostCalculator } from "./au-pair-cost-calculator";
import { afterSchoolProgramCostCalculator } from "./after-school-program-cost-calculator";
import { sportsLeagueCostCalculator } from "./sports-league-cost-calculator";
import { homeschoolCurriculumCostCalculator } from "./homeschool-curriculum-cost-calculator";
import { schoolSupplyListCalculator } from "./school-supply-list-calculator";
import { fieldTripCostCalculator } from "./field-trip-cost-calculator";
import { schoolBusRouteCalculator } from "./school-bus-route-calculator";
import { classroomSizeCalculator } from "./classroom-size-calculator";
import { schoolFundraiserCalculator } from "./school-fundraiser-calculator";
import { yearbookCostCalculator } from "./yearbook-cost-calculator";
import { collegeApplicationCostCalculator } from "./college-application-cost-calculator";
import { dormRoomEssentialsCalculator } from "./dorm-room-essentials-calculator";
import { mealPlanComparisonCalculator } from "./meal-plan-comparison-calculator";
import { studyHoursCalculator } from "./study-hours-calculator";
import { classRankPercentileCalculator } from "./class-rank-percentile-calculator";
import { actToSatConverterCalculator } from "./act-to-sat-converter-calculator";
import { hairColorCostCalculator } from "./hair-color-cost-calculator";
import { haircutFrequencyCalculator } from "./haircut-frequency-calculator";
import { hairExtensionCostCalculator } from "./hair-extension-cost-calculator";
import { nailSalonCostCalculator } from "./nail-salon-cost-calculator";
import { eyelashExtensionCostCalculator } from "./eyelash-extension-cost-calculator";
import { facialTreatmentCostCalculator } from "./facial-treatment-cost-calculator";
import { spaDayCostCalculator } from "./spa-day-cost-calculator";
import { massageCostCalculator } from "./massage-cost-calculator";
import { waxingCostCalculator } from "./waxing-cost-calculator";
import { dermalFillerCostCalculator } from "./dermal-filler-cost-calculator";
import { chemicalPeelCostCalculator } from "./chemical-peel-cost-calculator";
import { laserHairRemovalCalculator } from "./laser-hair-removal-calculator";
import { teethStraighteningCostCalculator } from "./teeth-straightening-cost-calculator";
import { skincareRoutineCostCalculator } from "./skincare-routine-cost-calculator";
import { perfumeCostPerWearCalculator } from "./perfume-cost-per-wear-calculator";
import { makeupExpirationCalculator } from "./makeup-expiration-calculator";
import { sunscreenUsageCalculator } from "./sunscreen-usage-calculator";
import { skinTypeHydrationCalculator } from "./skin-type-hydration-calculator";
import { cattleWeightGainCalculator } from "./cattle-weight-gain-calculator";
import { poultryEggProductionCalculator } from "./poultry-egg-production-calculator";
import { farmProfitMarginCalculator } from "./farm-profit-margin-calculator";
import { tractorFuelCostCalculator } from "./tractor-fuel-cost-calculator";
import { silageVolumeCalculator } from "./silage-volume-calculator";
import { cropRotationPlannerCalculator } from "./crop-rotation-planner-calculator";
import { farmLaborCostCalculator } from "./farm-labor-cost-calculator";
import { fertilizerApplicationRateCalculator } from "./fertilizer-application-rate-calculator";
import { livestockWaterNeedsCalculator } from "./livestock-water-needs-calculator";
import { beehiveHoneyYieldCalculator } from "./beehive-honey-yield-calculator";
import { orchardTreeSpacingCalculator } from "./orchard-tree-spacing-calculator";
import { vineyardYieldEstimatorCalculator } from "./vineyard-yield-estimator-calculator";
import { compostPileVolumeCalculator } from "./compost-pile-volume-calculator";
import { soilPhAmendmentCalculator } from "./soil-ph-amendment-calculator";
import { farmFenceCostCalculator } from "./farm-fence-cost-calculator";
import { aquacultureFeedRateCalculator } from "./aquaculture-feed-rate-calculator";
import { grainStorageMoistureCalculator } from "./grain-storage-moisture-calculator";
import { pastureCarryingCapacityCalculator } from "./pasture-carrying-capacity-calculator";
import { greenhouseEnergyCostCalculator } from "./greenhouse-energy-cost-calculator";
import { farmInsuranceCostCalculator } from "./farm-insurance-cost-calculator";
import { feedConversionRatioCalculator } from "./feed-conversion-ratio-calculator";
import { centerPivotIrrigationCalculator } from "./center-pivot-irrigation-calculator";
import { grainDryingCostCalculator } from "./grain-drying-cost-calculator";
import { farmBreakEvenPriceCalculator } from "./farm-break-even-price-calculator";
import { livestockPregnancyDueDateCalculator } from "./livestock-pregnancy-due-date-calculator";
import { legalFeeEstimatorCalculator } from "./legal-fee-estimator-calculator";
import { courtFilingFeeCalculator } from "./court-filing-fee-calculator";
import { settlementValueEstimatorCalculator } from "./settlement-value-estimator-calculator";
import { childSupportGuidelineCalculator } from "./child-support-guideline-calculator";
import { alimonyEstimatorCalculator } from "./alimony-estimator-calculator";
import { bailBondCostCalculator } from "./bail-bond-cost-calculator";
import { legalRetainerCalculator } from "./legal-retainer-calculator";
import { probateCostEstimatorCalculator } from "./probate-cost-estimator-calculator";
import { attorneyHourlyRateComparisonCalculator } from "./attorney-hourly-rate-comparison-calculator";
import { caseTimelineEstimatorCalculator } from "./case-timeline-estimator-calculator";
import { legalMalpracticeDamagesCalculator } from "./legal-malpractice-damages-calculator";
import { contractBreachDamagesCalculator } from "./contract-breach-damages-calculator";
import { intellectualPropertyValueCalculator } from "./intellectual-property-value-calculator";
import { trademarkRegistrationCostCalculator } from "./trademark-registration-cost-calculator";
import { patentFilingCostCalculator } from "./patent-filing-cost-calculator";
import { copyrightRegistrationCostCalculator } from "./copyright-registration-cost-calculator";
import { arbitrationCostCalculator } from "./arbitration-cost-calculator";
import { mediationCostCalculator } from "./mediation-cost-calculator";
import { depositionCostCalculator } from "./deposition-cost-calculator";
import { expertWitnessFeeCalculator } from "./expert-witness-fee-calculator";
import { juryDutyPayCalculator } from "./jury-duty-pay-calculator";
import { immigrationFilingFeeCalculator } from "./immigration-filing-fee-calculator";
import { legalDocumentPreparationCostCalculator } from "./legal-document-preparation-cost-calculator";
import { bpmTempoCalculator } from "./bpm-tempo-calculator";
import { musicKeyTransposerCalculator } from "./music-key-transposer-calculator";
import { chordProgressionCalculator } from "./chord-progression-calculator";
import { concertTicketValueCalculator } from "./concert-ticket-value-calculator";
import { musicStreamingRevenueCalculator } from "./music-streaming-revenue-calculator";
import { djSetTimePlannerCalculator } from "./dj-set-time-planner-calculator";
import { audioBitrateFileSizeCalculator } from "./audio-bitrate-file-size-calculator";
import { guitarStringGaugeCalculator } from "./guitar-string-gauge-calculator";
import { drumTuningFrequencyCalculator } from "./drum-tuning-frequency-calculator";
import { studioRecordingCostCalculator } from "./studio-recording-cost-calculator";
import { albumProductionBudgetCalculator } from "./album-production-budget-calculator";
import { instrumentDepreciationCalculator } from "./instrument-depreciation-calculator";
import { speakerRoomSizeCalculator } from "./speaker-room-size-calculator";
import { subwooferBoxVolumeCalculator } from "./subwoofer-box-volume-calculator";
import { microphoneSensitivityCalculator } from "./microphone-sensitivity-calculator";
import { equalizerFrequencyCalculator } from "./equalizer-frequency-calculator";
import { musicRoyaltySplitCalculator } from "./music-royalty-split-calculator";
import { podcastProductionCostCalculator } from "./podcast-production-cost-calculator";
import { concertVenueCapacityCalculator } from "./concert-venue-capacity-calculator";
import { musicCopyrightValueCalculator } from "./music-copyright-value-calculator";
import { musicPracticeTimeCalculator } from "./music-practice-time-calculator";
import { audioDelayCompensationCalculator } from "./audio-delay-compensation-calculator";
import { tennisRacketStringTensionCalculator } from "./tennis-racket-string-tension-calculator";
import { golfClubFittingCalculator } from "./golf-club-fitting-calculator";
import { bicycleGearRatioCalculator } from "./bicycle-gear-ratio-calculator";
import { runningShoeMileageCalculator } from "./running-shoe-mileage-calculator";
import { boxingReachAdvantageCalculator } from "./boxing-reach-advantage-calculator";
import { hockeyStickFlexCalculator } from "./hockey-stick-flex-calculator";
import { baseballBatWeightCalculator } from "./baseball-bat-weight-calculator";
import { basketballCourtDimensionsCalculator } from "./basketball-court-dimensions-calculator";
import { footballFieldGoalDistanceCalculator } from "./football-field-goal-distance-calculator";
import { soccerFieldAreaCalculator } from "./soccer-field-area-calculator";
import { bowlingBallWeightCalculator } from "./bowling-ball-weight-calculator";
import { rockClimbingGradeConverterCalculator } from "./rock-climbing-grade-converter-calculator";
import { skateboardTruckWidthCalculator } from "./skateboard-truck-width-calculator";
import { lacrosseStickLengthCalculator } from "./lacrosse-stick-length-calculator";
import { martialArtsBeltProgressionCalculator } from "./martial-arts-belt-progression-calculator";
import { rowingStrokeRateCalculator } from "./rowing-stroke-rate-calculator";
import { triathlonTransitionTimeCalculator } from "./triathlon-transition-time-calculator";
import { sportsDrinkHydrationCalculator } from "./sports-drink-hydration-calculator";
import { athleticTapeUsageCalculator } from "./athletic-tape-usage-calculator";
import { cameraSensorCropFactorCalculator } from "./camera-sensor-crop-factor-calculator";
import { timeLapseIntervalCalculator } from "./time-lapse-interval-calculator";
import { videoBitrateEstimatorCalculator } from "./video-bitrate-estimator";
import { filmBudgetEstimatorCalculator } from "./film-budget-estimator";
import { goldenRatioCompositionCalculator } from "./golden-ratio-composition-calculator";
import { videoStorageEstimatorCalculator } from "./video-storage-estimator";
import { greenScreenDistanceCalculator } from "./green-screen-distance-calculator";
import { colorTemperatureConverterCalculator } from "./color-temperature-converter-calculator";
import { photoPrintCostCalculator } from "./photo-print-cost-calculator";
import { videoRenderTimeEstimatorCalculator } from "./video-render-time-estimator";
import { photoBackupStorageCalculator } from "./photo-backup-storage-calculator";
import { weddingVideographyCostCalculator } from "./wedding-videography-cost-calculator";
import { filmCrewSizeEstimatorCalculator } from "./film-crew-size-estimator";
import { motionBlurShutterSpeedCalculator } from "./motion-blur-shutter-speed-calculator";
import { aspectRatioResizeCalculator } from "./aspect-ratio-resize-calculator";
import { filmGrainIsoCalculator } from "./film-grain-iso-calculator";
import { lightingSetupCostCalculator } from "./lighting-setup-cost-calculator";
import { video360StitchingTimeCalculator } from "./video-360-stitching-time-calculator";
import { lensCompressionDistanceCalculator } from "./lens-compression-distance-calculator";
import { pixelDensityPpiCalculator } from "./pixel-density-ppi-calculator";
import { ndFilterExposureCalculator } from "./nd-filter-exposure-calculator";
import { flightFuelCostEstimatorCalculator } from "./flight-fuel-cost-estimator-calculator";
import { jetLagRecoveryTimeCalculator } from "./jet-lag-recovery-time-calculator";
import { travelDailyBudgetCalculator } from "./travel-daily-budget-calculator";
import { cruiseCabinCostComparisonCalculator } from "./cruise-cabin-cost-comparison-calculator";
import { passportRenewalTimelineCalculator } from "./passport-renewal-timeline-calculator";
import { airlineMilesValueCalculator } from "./airline-miles-value-calculator";
import { hotelPointsValueCalculator } from "./hotel-points-value-calculator";
import { luggageWeightConverterCalculator } from "./luggage-weight-converter-calculator";
import { visaProcessingTimeCalculator } from "./visa-processing-time-calculator";
import { internationalCallingCostCalculator } from "./international-calling-cost-calculator";
import { travelVaccinationCostCalculator } from "./travel-vaccination-cost-calculator";
import { airportParkingCostCalculator } from "./airport-parking-cost-calculator";
import { roadTripFuelPlannerCalculator } from "./road-trip-fuel-planner-calculator";
import { flightCarbonOffsetCalculator } from "./flight-carbon-offset-calculator";
import { timezoneOverlapCalculator } from "./timezone-overlap-calculator";
import { sailingDistanceCalculator } from "./sailing-distance-calculator";
import { flightLayoverOptimizerCalculator } from "./flight-layover-optimizer-calculator";
import { travelTipByCountryCalculator } from "./travel-tip-by-country-calculator";
import { backpackingGearWeightCalculator } from "./backpacking-gear-weight-calculator";
import { skiResortValueComparisonCalculator } from "./ski-resort-value-comparison-calculator";
import { rentalCarCostComparisonCalculator } from "./rental-car-cost-comparison-calculator";
import { flightTimeEstimatorCalculator } from "./flight-time-estimator-calculator";
import { cruisePackingListCalculator } from "./cruise-packing-list-calculator";
import { uvProtectionFactorCalculator } from "./uv-protection-factor-calculator";
import { rainfallCollectionCalculator } from "./rainfall-collection-calculator";
import { solarPanelPaybackCalculator } from "./solar-panel-payback-calculator";
import { carbonFootprintOffsetCalculator } from "./carbon-footprint-offset-calculator";
import { rainwaterTankSizeCalculator } from "./rainwater-tank-size-calculator";
import { airQualityHealthImpactCalculator } from "./air-quality-health-impact-calculator";
import { deforestationImpactCalculator } from "./deforestation-impact-calculator";
import { oceanAcidificationCalculator } from "./ocean-acidification-calculator";
import { permafrostThawRateCalculator } from "./permafrost-thaw-rate-calculator";
import { droughtSeverityIndexCalculator } from "./drought-severity-index-calculator";
import { floodRiskAssessmentCalculator } from "./flood-risk-assessment-calculator";
import { wildfireRiskCalculator } from "./wildfire-risk-calculator";
import { tornadoSafetyDistanceCalculator } from "./tornado-safety-distance-calculator";
import { hurricanePreparednessCostCalculator } from "./hurricane-preparedness-cost-calculator";
import { lightningStrikeProbabilityCalculator } from "./lightning-strike-probability-calculator";
import { iceDamRiskCalculator } from "./ice-dam-risk-calculator";
import { growingDegreeDaysCalculator } from "./growing-degree-days-calculator";
import { evapotranspirationRateCalculator } from "./evapotranspiration-rate-calculator";
import { soilErosionRateCalculator } from "./soil-erosion-rate-calculator";
import { compostVolumeCalculator } from "./compost-volume-calculator";
import { windChillExtendedCalculator } from "./wind-chill-extended-calculator";
import { heatIndexActivityCalculator } from "./heat-index-activity-calculator";
import { quiltFabricCalculator } from "./quilt-fabric-calculator";
import { candleMakingWaxCalculator } from "./candle-making-wax-calculator";
import { soapMakingLyeCalculator } from "./soap-making-lye-calculator";
import { resinArtVolumeCalculator } from "./resin-art-volume-calculator";
import { leatherWorkingCostCalculator } from "./leather-working-cost-calculator";
import { potteryKilnFiringCostCalculator } from "./pottery-kiln-firing-cost-calculator";
import { crossStitchFabricCalculator } from "./cross-stitch-fabric-calculator";
import { scrapbookPageLayoutCalculator } from "./scrapbook-page-layout-calculator";
import { woodTurningBlankSizeCalculator } from "./wood-turning-blank-size-calculator";
import { modelRailroadScaleCalculator } from "./model-railroad-scale-calculator";
import { miniaturePaintingCostCalculator } from "./miniature-painting-cost-calculator";
import { beadPatternCalculator } from "./bead-pattern-calculator";
import { calligraphyInkUsageCalculator } from "./calligraphy-ink-usage-calculator";
import { paperCraftingSheetsCalculator } from "./paper-crafting-sheets-calculator";
import { stainedGlassAreaCalculator } from "./stained-glass-area-calculator";
import { mosaicTileCalculator } from "./mosaic-tile-calculator";
import { crochetHookSizeCalculator } from "./crochet-hook-size-calculator";
import { sewingPatternSizingCalculator } from "./sewing-pattern-sizing-calculator";
import { tieDyeFabricCalculator } from "./tie-dye-fabric-calculator";
import { flowerArrangementCostCalculator } from "./flower-arrangement-cost-calculator";
import { cardMakingSuppliesCalculator } from "./card-making-supplies-calculator";
import { jewelryWireCalculator } from "./jewelry-wire-calculator";
import { carDepreciationCurveCalculator } from "./car-depreciation-curve-calculator";
import { carWashFrequencyCostCalculator } from "./car-wash-frequency-cost-calculator";
import { engineOilCapacityCalculator } from "./engine-oil-capacity-calculator";
import { coolantFlushScheduleCalculator } from "./coolant-flush-schedule-calculator";
import { transmissionFluidChangeCalculator } from "./transmission-fluid-change-calculator";
import { sparkPlugReplacementCalculator } from "./spark-plug-replacement-calculator";
import { carBatteryReplacementCostCalculator } from "./car-battery-replacement-cost-calculator";
import { wheelAlignmentFrequencyCalculator } from "./wheel-alignment-frequency-calculator";
import { carWaxApplicationCalculator } from "./car-wax-application-calculator";
import { paintProtectionFilmCostCalculator } from "./paint-protection-film-cost-calculator";
import { windowTintDarknessCalculator } from "./window-tint-darkness-calculator";
import { carSeatFitCalculator } from "./car-seat-fit-calculator";
import { engineHorsepowerToWeightCalculator } from "./engine-horsepower-to-weight-calculator";
import { zeroToSixtyTimeCalculator } from "./zero-to-sixty-time-calculator";
import { quarterMileTimeCalculator } from "./quarter-mile-time-calculator";
import { carLoanRefinanceCalculator } from "./car-loan-refinance-calculator";
import { carSubscriptionVsOwnershipCalculator } from "./car-subscription-vs-ownership-calculator";
import { tireTreadLifeCalculator } from "./tire-tread-life-calculator";
import { carAcRechargeCostCalculator } from "./car-ac-recharge-cost-calculator";
import { timingBeltReplacementCalculator } from "./timing-belt-replacement-calculator";
import { carFuelTankRangeCalculator } from "./car-fuel-tank-range-calculator";
import { carBrakeRotorLifeCalculator } from "./car-brake-rotor-life-calculator";
import { vehicleRegistrationRenewalCalculator } from "./vehicle-registration-renewal-calculator";
import { carAnnualMaintenanceCostCalculator } from "./car-annual-maintenance-cost-calculator";
import { smartphoneScreenRepairCostCalculator } from "./smartphone-screen-repair-cost-calculator";
import { streamingServiceCostComparisonCalculator } from "./streaming-service-cost-comparison-calculator";
import { gamingPcBuildBudgetCalculator } from "./gaming-pc-build-budget-calculator";
import { monitorSizeDistanceCalculator } from "./monitor-size-distance-calculator";
import { usbTransferSpeedCalculator } from "./usb-transfer-speed-calculator";
import { ssdCostPerGbCalculator } from "./ssd-cost-per-gb-calculator";
import { wirelessRouterRangeCalculator } from "./wireless-router-range-calculator";
import { pcPowerSupplyCalculator } from "./pc-power-supply-calculator";
import { rgbLedStripCalculator } from "./rgb-led-strip-calculator";
import { n3dPrinterFilamentCostCalculator } from "./3d-printer-filament-cost-calculator";
import { laserPrinterCostPerPageCalculator } from "./laser-printer-cost-per-page-calculator";
import { securityCameraStorageCalculator } from "./security-camera-storage-calculator";
import { nasDriveCostCalculator } from "./nas-drive-cost-calculator";
import { printerInkCostCalculator } from "./printer-ink-cost-calculator";
import { eReaderBatteryCalculator } from "./e-reader-battery-calculator";
import { wirelessChargerEfficiencyCalculator } from "./wireless-charger-efficiency-calculator";
import { bluetoothRangeEstimatorCalculator } from "./bluetooth-range-estimator-calculator";
import { screenResolutionComparisonCalculator } from "./screen-resolution-comparison-calculator";
import { phoneBatteryHealthCalculator } from "./phone-battery-health-calculator";
import { projectorThrowDistanceCalculator } from "./projector-throw-distance-calculator";
import { electricBillDeviceCostCalculator } from "./electric-bill-device-cost-calculator";
import { babyFoodStageCalculator } from "./baby-food-stage-calculator";
import { nurserySetupCostCalculator } from "./nursery-setup-cost-calculator";
import { maternityLeavePayCalculator } from "./maternity-leave-pay-calculator";
import { adoptionCostEstimatorCalculator } from "./adoption-cost-estimator";
import { surrogacyCostCalculator } from "./surrogacy-cost-calculator";
import { fertilityTreatmentCostCalculator } from "./fertility-treatment-cost-calculator";
import { carSeatExpirationCalculator } from "./car-seat-expiration-calculator";
import { strollerValueComparisonCalculator } from "./stroller-value-comparison-calculator";
import { babyClothesSizePredictorCalculator } from "./baby-clothes-size-predictor";
import { childproofingCostCalculator } from "./childproofing-cost-calculator";
import { nannyShareCostCalculator } from "./nanny-share-cost-calculator";
import { daycareWaitlistEstimatorCalculator } from "./daycare-waitlist-estimator";
import { familyGroceryBudgetCalculator } from "./family-grocery-budget-calculator";
import { familyPhonePlanCostCalculator } from "./family-phone-plan-cost-calculator";
import { college529ProjectorCalculator } from "./college-529-projector-calculator";
import { familyVacationBudgetCalculator } from "./family-vacation-budget-calculator";
import { birthdayPartyPerChildCalculator } from "./birthday-party-per-child-calculator";
import { familyEmergencyFundCalculator } from "./family-emergency-fund-calculator";
import { estatePlanningCostCalculator } from "./estate-planning-cost-calculator";
import { familyLifeInsuranceCalculator } from "./family-life-insurance-calculator";
import { familyHealthInsuranceCostCalculator } from "./family-health-insurance-cost-calculator";
import { lagrangePointCalculator } from "./lagrange-point-calculator";
import { hillSphereCalculator } from "./hill-sphere-calculator";
import { jeansMassCalculator } from "./jeans-mass-calculator";
import { bolometricMagnitudeCalculator } from "./bolometric-magnitude-calculator";
import { hohmannTransferCalculator } from "./hohmann-transfer-calculator";
import { gravitationalLensingCalculator } from "./gravitational-lensing-calculator";
import { cosmicRedshiftDistanceCalculator } from "./cosmic-redshift-distance-calculator";
import { airyDiskCalculator } from "./airy-disk-calculator";
import { schwarzschildRadiusAdvancedCalculator } from "./schwarzschild-radius-advanced-calculator";
import { spectralClassTemperatureCalculator } from "./spectral-class-temperature-calculator";
import { binaryStarMassCalculator } from "./binary-star-mass-calculator";
import { exoplanetTransitDepthCalculator } from "./exoplanet-transit-depth-calculator";
import { atmosphericScaleHeightCalculator } from "./atmospheric-scale-height-calculator";
import { solarLuminosityCalculator } from "./solar-luminosity-calculator";
import { gravitationalWaveStrainCalculator } from "./gravitational-wave-strain-calculator";
import { orbitalDecayCalculator } from "./orbital-decay-calculator";
import { chandrasekharLimitCalculator } from "./chandrasekhar-limit-calculator";
import { keplersEquationSolverCalculator } from "./keplers-equation-solver";
import { restaurantProfitMarginCalculator } from "./restaurant-profit-margin-calculator";
import { menuPricingCalculator } from "./menu-pricing-calculator";
import { kitchenEquipmentCostCalculator } from "./kitchen-equipment-cost-calculator";
import { restaurantSeatingCapacityCalculator } from "./restaurant-seating-capacity-calculator";
import { tableTurnoverRateCalculator } from "./table-turnover-rate-calculator";
import { barPourCostCalculator } from "./bar-pour-cost-calculator";
import { tipPoolDistributionCalculator } from "./tip-pool-distribution-calculator";
import { cateringCostPerHeadCalculator } from "./catering-cost-per-head-calculator";
import { foodTruckStartupCostCalculator } from "./food-truck-startup-cost-calculator";
import { bakeryIngredientCostCalculator } from "./bakery-ingredient-cost-calculator";
import { coffeeShopDailyRevenueCalculator } from "./coffee-shop-daily-revenue-calculator";
import { restaurantLaborCostPercentageCalculator } from "./restaurant-labor-cost-percentage-calculator";
import { inventoryTurnoverRateCalculator } from "./inventory-turnover-rate-calculator";
import { plateCostCalculator } from "./plate-cost-calculator";
import { banquetHallRentalCostCalculator } from "./banquet-hall-rental-cost-calculator";
import { buffetQuantityCalculator } from "./buffet-quantity-calculator";
import { deliveryServiceCommissionCalculator } from "./delivery-service-commission-calculator";
import { happyHourProfitCalculator } from "./happy-hour-profit-calculator";
import { cocktailRecipeCostCalculator } from "./cocktail-recipe-cost-calculator";
import { foodTrailerLicensingCostCalculator } from "./food-trailer-licensing-cost-calculator";
import { restaurantBreakEvenCalculator } from "./restaurant-break-even-calculator";
import { dishwasherCycleCostCalculator } from "./dishwasher-cycle-cost-calculator";
import { gamingMonitorInputLagCalculator } from "./gaming-monitor-input-lag-calculator";
import { esportsPrizePoolSplitCalculator } from "./esports-prize-pool-split-calculator";
import { gameServerHostingCostCalculator } from "./game-server-hosting-cost-calculator";
import { mouseSensitivityEdpiCalculator } from "./mouse-sensitivity-edpi-calculator";
import { gpuBenchmarkScoreEstimatorCalculator } from "./gpu-benchmark-score-estimator";
import { vrHeadsetFovCalculator } from "./vr-headset-fov-calculator";
import { gamingDeskSetupCostCalculator } from "./gaming-desk-setup-cost-calculator";
import { twitchStreamerRevenueCalculator } from "./twitch-streamer-revenue-calculator";
import { youtubeGamingCpmCalculator } from "./youtube-gaming-cpm-calculator";
import { discordServerCostCalculator } from "./discord-server-cost-calculator";
import { gameDevelopmentBudgetCalculator } from "./game-development-budget-calculator";
import { tabletopRpgEncounterBuilderCalculator } from "./tabletop-rpg-encounter-builder-calculator";
import { cardGameDeckValueCalculator } from "./card-game-deck-value-calculator";
import { boardGamePlayTimeCalculator } from "./board-game-play-time-calculator";
import { miniaturesArmyCostCalculator } from "./miniatures-army-cost-calculator";
import { chessEloRatingCalculator } from "./chess-elo-rating-calculator";
import { pokerPotOddsCalculator } from "./poker-pot-odds-calculator";
import { fantasySportsLineupValueCalculator } from "./fantasy-sports-lineup-value-calculator";
import { gamingStreamingBitrateCalculator } from "./gaming-streaming-bitrate-calculator";
import { retroGameCollectionValueCalculator } from "./retro-game-collection-value-calculator";
import { gamingPeripheralBudgetCalculator } from "./gaming-peripheral-budget-calculator";
import { lootBoxProbabilityCalculator } from "./loot-box-probability-calculator";
import { gamingMonitorSizeCalculator } from "./gaming-monitor-size-calculator";
import { centrifugeRcfRpmCalculator } from "./centrifuge-rcf-rpm-calculator";
import { electrolysisTimeCalculator } from "./electrolysis-time-calculator";
import { bacterialGrowthRateCalculator } from "./bacterial-growth-rate-calculator";
import { solutionPreparationCalculator } from "./solution-preparation-calculator";
import { reagentCostPerExperimentCalculator } from "./reagent-cost-per-experiment-calculator";
import { labEquipmentDepreciationCalculator } from "./lab-equipment-depreciation-calculator";
import { pcrCycleNumberCalculator } from "./pcr-cycle-number-calculator";
import { qpcrFoldChangeCalculator } from "./qpcr-fold-change-calculator";
import { od600CellDensityCalculator } from "./od600-cell-density-calculator";
import { cfuColonyCountingCalculator } from "./cfu-colony-counting-calculator";
import { bradfordAssayProteinCalculator } from "./bradford-assay-protein-calculator";
import { cellViabilityCalculator } from "./cell-viability-calculator";
import { cellCultureMediaPrepCalculator } from "./cell-culture-media-prep-calculator";
import { ligationRatioCalculator } from "./ligation-ratio-calculator";
import { transformationEfficiencyCalculator } from "./transformation-efficiency-calculator";
import { transfectionEfficiencyCalculator } from "./transfection-efficiency-calculator";
import { enzymeUnitConversionCalculator } from "./enzyme-unit-conversion-calculator";
import { meltingTemperaturePrimerCalculator } from "./melting-temperature-primer-calculator";
import { gelBandSizeEstimatorCalculator } from "./gel-band-size-estimator";
import { elisaStandardCurveCalculator } from "./elisa-standard-curve-calculator";
import { westernBlotDilutionCalculator } from "./western-blot-dilution-calculator";
import { fluorescenceQuenchingCalculator } from "./fluorescence-quenching-calculator";
import { dnaRnaYieldCalculator } from "./dna-rna-yield-calculator";
import { plasmidCopyNumberCalculator } from "./plasmid-copy-number-calculator";
import { stoichiometryMassCalculator } from "./stoichiometry-mass-calculator";
import { receptionVenueCostCalculator } from "./reception-venue-cost-calculator";
import { djVsBandCostCalculator } from "./dj-vs-band-cost-calculator";
import { weddingPhotographerCostCalculator } from "./wedding-photographer-cost-calculator";
import { bridesmaidDressBudgetCalculator } from "./bridesmaid-dress-budget-calculator";
import { seatingChartOptimizerCalculator } from "./seating-chart-optimizer-calculator";
import { eventTimelinePlannerCalculator } from "./event-timeline-planner-calculator";
import { birthdayMilestoneCostCalculator } from "./birthday-milestone-cost-calculator";
import { anniversaryGiftBudgetCalculator } from "./anniversary-gift-budget-calculator";
import { rehearsalDinnerCostCalculator } from "./rehearsal-dinner-cost-calculator";
import { honeymoonBudgetPlannerCalculator } from "./honeymoon-budget-planner-calculator";
import { weddingRegistryValueCalculator } from "./wedding-registry-value-calculator";
import { bridalShowerCostCalculator } from "./bridal-shower-cost-calculator";
import { engagementRingAffordabilityCalculator } from "./engagement-ring-affordability-calculator";
import { weddingDressAlterationCostCalculator } from "./wedding-dress-alteration-cost-calculator";
import { tentRentalCostCalculator } from "./tent-rental-cost-calculator";
import { eventLightingCostCalculator } from "./event-lighting-cost-calculator";
import { partyRentalEquipmentCostCalculator } from "./party-rental-equipment-cost-calculator";
import { weddingFavorCostCalculator } from "./wedding-favor-cost-calculator";
import { destinationWeddingSavingsCalculator } from "./destination-wedding-savings-calculator";
import { weddingGuestMealCostCalculator } from "./wedding-guest-meal-cost-calculator";
import { floralArrangementBudgetCalculator } from "./floral-arrangement-budget-calculator";
import { weddingCakeCostEstimatorCalculator } from "./wedding-cake-cost-estimator";
import { weddingInvitationQuantityCalculator } from "./wedding-invitation-quantity-calculator";
import { weddingTransportationCostCalculator } from "./wedding-transportation-cost-calculator";
import { boatEngineHoursMaintenanceCalculator } from "./boat-engine-hours-maintenance-calculator";
import { boatBottomPaintCalculator } from "./boat-bottom-paint-calculator";
import { marineBatterySizingCalculator } from "./marine-battery-sizing-calculator";
import { boatTrailerWeightCalculator } from "./boat-trailer-weight-calculator";
import { scubaTankDurationCalculator } from "./scuba-tank-duration-calculator";
import { diveDecompressionCalculator } from "./dive-decompression-calculator";
import { fishingRodPowerCalculator } from "./fishing-rod-power-calculator";
import { boatInsuranceCostCalculator } from "./boat-insurance-cost-calculator";
import { jetSkiCostPerHourCalculator } from "./jet-ski-cost-per-hour-calculator";
import { boatWinterizationCostCalculator } from "./boat-winterization-cost-calculator";
import { marineGeneratorSizingCalculator } from "./marine-generator-sizing-calculator";
import { bilgePumpSizingCalculator } from "./bilge-pump-sizing-calculator";
import { boatCanvasCoverCostCalculator } from "./boat-canvas-cover-cost-calculator";
import { fishingLureWeightCalculator } from "./fishing-lure-weight-calculator";
import { paddleboardSizeCalculator } from "./paddleboard-size-calculator";
import { boatRegistrationCostCalculator } from "./boat-registration-cost-calculator";
import { marineRadioRangeCalculator } from "./marine-radio-range-calculator";
import { boatDepreciationCalculator } from "./boat-depreciation-calculator";
import { dockBuildingCostCalculator } from "./dock-building-cost-calculator";
import { boatLiftCapacityCalculator } from "./boat-lift-capacity-calculator";
import { propellerPitchCalculator } from "./propeller-pitch-calculator";
import { waterHeaterSizingCalculator } from "./water-heater-sizing-calculator";
import { ductSizingCalculator } from "./duct-sizing-calculator";
import { boilerEfficiencyCalculator } from "./boiler-efficiency-calculator";
import { radiantFloorHeatingCalculator } from "./radiant-floor-heating-calculator";
import { miniSplitSizingCalculator } from "./mini-split-sizing-calculator";
import { exhaustFanCfmCalculator } from "./exhaust-fan-cfm-calculator";
import { groundingElectrodeCalculator } from "./grounding-electrode-calculator";
import { motorStarterSizingCalculator } from "./motor-starter-sizing-calculator";
import { powerFactorCorrectionCalculator } from "./power-factor-correction-calculator";
import { harmonicDistortionCalculator } from "./harmonic-distortion-calculator";
import { cableTrayFillCalculator } from "./cable-tray-fill-calculator";
import { emergencyGeneratorSizingCalculator } from "./emergency-generator-sizing-calculator";
import { solarInverterSizingCalculator } from "./solar-inverter-sizing-calculator";
import { retirementIncomeGapCalculator } from "./retirement-income-gap-calculator";
import { pensionBenefitEstimatorCalculator } from "./pension-benefit-estimator-calculator";
import { n401kEmployerMatchMaximizerCalculator } from "./401k-employer-match-maximizer-calculator";
import { annuityIncomeCalculator } from "./annuity-income-calculator";
import { retirementHealthcareCostCalculator } from "./retirement-healthcare-cost-calculator";
import { reverseMortgageEstimatorCalculator } from "./reverse-mortgage-estimator-calculator";
import { retirementTaxBracketCalculator } from "./retirement-tax-bracket-calculator";
import { rothConversionLadderCalculator } from "./roth-conversion-ladder-calculator";
import { retirementPortfolioWithdrawalCalculator } from "./retirement-portfolio-withdrawal-calculator";
import { sequenceOfReturnsRiskCalculator } from "./sequence-of-returns-risk-calculator";
import { bucketStrategyAllocatorCalculator } from "./bucket-strategy-allocator-calculator";
import { seniorHousingCostComparisonCalculator } from "./senior-housing-cost-comparison-calculator";
import { homeCareCostEstimatorCalculator } from "./home-care-cost-estimator-calculator";
import { retirementRelocationCostCalculator } from "./retirement-relocation-cost-calculator";
import { charitableRemainderTrustCalculator } from "./charitable-remainder-trust-calculator";
import { retirementSpendingCalculator } from "./retirement-spending-calculator";
import { pensionColaImpactCalculator } from "./pension-cola-impact-calculator";
import { socialSecuritySpousalBenefitCalculator } from "./social-security-spousal-benefit-calculator";
import { longTermCareNeedsCalculator } from "./long-term-care-needs-calculator";
import { retirementAccountConsolidationCalculator } from "./retirement-account-consolidation-calculator";
import { socialSecurityEarningsTestCalculator } from "./social-security-earnings-test-calculator";
import { medicareIrmaaSurchargeCalculator } from "./medicare-irmaa-surcharge-calculator";
import { retirementWithdrawalSequencingCalculator } from "./retirement-withdrawal-sequencing-calculator";
import { earlyRetirementFireNumberCalculator } from "./early-retirement-fire-number-calculator";
import { earthquakeMagnitudeConverterCalculator } from "./earthquake-magnitude-converter";
import { seismicWaveVelocityCalculator } from "./seismic-wave-velocity-calculator";
import { mineralHardnessComparisonCalculator } from "./mineral-hardness-comparison-calculator";
import { rockDensityCalculator } from "./rock-density-calculator";
import { groundwaterFlowRateCalculator } from "./groundwater-flow-rate-calculator";
import { soilCompactionTestCalculator } from "./soil-compaction-test-calculator";
import { bearingCapacityCalculator } from "./bearing-capacity-calculator";
import { slopeStabilityFactorCalculator } from "./slope-stability-factor-calculator";
import { tsunamiWaveSpeedCalculator } from "./tsunami-wave-speed-calculator";
import { volcanicEruptionIndexCalculator } from "./volcanic-eruption-index-calculator";
import { gemstoneCaratToMmCalculator } from "./gemstone-carat-to-mm-calculator";
import { goldOreGradeValueCalculator } from "./gold-ore-grade-value-calculator";
import { miningEquipmentCostPerTonCalculator } from "./mining-equipment-cost-per-ton-calculator";
import { landSurveyAreaCalculator } from "./land-survey-area-calculator";
import { topographicProminenceCalculator } from "./topographic-prominence-calculator";
import { riverDischargeRateCalculator } from "./river-discharge-rate-calculator";
import { sedimentTransportCalculator } from "./sediment-transport-calculator";
import { aquiferYieldCalculator } from "./aquifer-yield-calculator";
import { geothermalGradientCalculator } from "./geothermal-gradient-calculator";
import { plateTectonicsVelocityCalculator } from "./plate-tectonics-velocity-calculator";
import { coalHeatingValueCalculator } from "./coal-heating-value-calculator";
import { aggregateVolumeCalculator } from "./aggregate-volume-calculator";
import { llmApiCostCalculator } from "./llm-api-cost-calculator";
import { aiTokenCounter } from "./ai-token-counter";
import { llmCostComparison } from "./llm-cost-comparison";
import { aiImageGenerationCost } from "./ai-image-generation-cost";
import { gpuRentalCostCalculator } from "./gpu-rental-cost-calculator";
import { aiTrainingCostEstimator } from "./ai-training-cost-estimator";
import { aiStartupComputeBudget } from "./ai-startup-compute-budget";
import { aiVsHumanLaborCost } from "./ai-vs-human-labor-cost";
import { ragSystemMonthlyCost } from "./rag-system-monthly-cost";
import { aiChatbotTcoCalculator } from "./ai-chatbot-tco-calculator";
import { promptEfficiencyCalculator } from "./prompt-efficiency-calculator";
import { llmContextWindowCost } from "./llm-context-window-cost";
import { aiSaasPricingModel } from "./ai-saas-pricing-model";
import { vectorDatabaseStorageCost } from "./vector-database-storage-cost";
import { aiContentProductionRoi } from "./ai-content-production-roi";
import { fireNumberCalculator } from "./fire-number-calculator";
import { fatfireCalculator } from "./fatfire-calculator";
import { leanfireCalculator } from "./leanfire-calculator";
import { coastfireCalculator } from "./coastfire-calculator";
import { baristaFireCalculator } from "./barista-fire-calculator";
import { chubbyFireCalculator } from "./chubby-fire-calculator";
import { fireWithPensionCalculator } from "./fire-with-pension-calculator";
import { sequenceOfReturnsRisk } from "./sequence-of-returns-risk";
import { safeWithdrawalRateOptimizer } from "./safe-withdrawal-rate-optimizer";
import { fireTaxOptimization } from "./fire-tax-optimization";
import { geographicArbitrageFire } from "./geographic-arbitrage-fire";
import { fireWithKidsCalculator } from "./fire-with-kids-calculator";
import { rothConversionLadder } from "./roth-conversion-ladder";
import { fireHealthcareCostEstimator } from "./fire-healthcare-cost-estimator";
import { yearsToFireCalculator } from "./years-to-fire-calculator";

export const calculators: CalculatorDefinition[] = [
  llmApiCostCalculator,
  aiTokenCounter,
  llmCostComparison,
  aiImageGenerationCost,
  gpuRentalCostCalculator,
  aiTrainingCostEstimator,
  aiStartupComputeBudget,
  aiVsHumanLaborCost,
  ragSystemMonthlyCost,
  aiChatbotTcoCalculator,
  promptEfficiencyCalculator,
  llmContextWindowCost,
  aiSaasPricingModel,
  vectorDatabaseStorageCost,
  aiContentProductionRoi,
  fireNumberCalculator,
  fatfireCalculator,
  leanfireCalculator,
  coastfireCalculator,
  baristaFireCalculator,
  chubbyFireCalculator,
  fireWithPensionCalculator,
  sequenceOfReturnsRisk,
  safeWithdrawalRateOptimizer,
  fireTaxOptimization,
  geographicArbitrageFire,
  fireWithKidsCalculator,
  rothConversionLadder,
  fireHealthcareCostEstimator,
  yearsToFireCalculator,
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
  atvInsuranceCalculator,
  babyBathTempCalculator,
  babyBottleAmountCalculator,
  babyFoodIntroCalculator,
  babyGrowthSpurtCalculator,
  babyNameMeaningCalculator,
  babyProofingCalculator,
  babyShoeSizeCalculator,
  babyToothCalculator,
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
  classScheduleCalculator,
  closetOrganizerCostCalculator,
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
  zeroToSixtyCalculator,
  threeDPrintingCostCalculator,
  wendler531Calculator,
  fiveKPaceCalculator,
  addTimeCalc,
  airbnbProfitCalculator,
  alcoholUnitsCalculator,
  anesthesiaRiskCalculator,
  apyCalculator,
  aquariumCo2Calculator,
  archerySightTapeCalculator,
  arvCalculator,
  ascvdRiskCalculator,
  babyAgeCalc,
  babyPercentileCalculator,
  bailCalculator,
  bbqSmokingTimeCalculator,
  beerBrewingCalculator,
  benadrylDosageCalculator,
  benchPressCalcCalculator,
  bloodTypeInheritanceCalculator,
  boardBattenCalculator,
  boardGamePlayerCalculator,
  breastCancerRiskCalculator,
  brineCalculator,
  bunCreatinineRatioCalculator,
  cakePricingCalculator,
  candleWaxCalcCalculator,
  carAffordabilityMonthlyCalculator,
  carInsuranceEstimateCalculator,
  carLeaseCalculator,
  carbCalculator,
  cardiacOutputCalculator,
  cateringServingCalculator,
  cdCalculator,
  childHeightPercentileCalculator,
  chocolateToxicityCalculator,
  chronologicalAgeCalc,
  clothingSizeConvertCalculator,
  coldBrewRatioCalculator,
  combinationCalc,
  concreteColumnCalculator,
  concreteSlabCalculator,
  concreteStairsCalculator,
  consultingRateCalc,
  continuousCompoundCalculator,
  cookingAltitudeAdjustCalculator,
  countdownCalculator,
  cupsToGramsCalculator,
  cyclingCaloriesCalculator,
  deadliftCalcCalculator,
  debtAvalancheCalculator,
  decimalToFractionConverter,
  discGolfRatingCalculator,
  dividendYieldCalc,
  dndEncounterCalculator,
  dogFoodCalculator,
  droneFlightTimeCalculator,
  drugHalfLifeCalculator,
  effectiveInterestRateCalculator,
  embroideryThreadCalculator,
  engineHpCalculator,
  epoxyResinCalcCalculator,
  epworthSleepinessCalculator,
  factorCalculator,
  fatBurningZoneCalculator,
  fatIntakeCalcCalculator,
  fiberCalculator,
  filamentUsageCalculator,
  fractionToDecimalConverter,
  freshToDryHerbCalculator,
  fuelCostTripCalculator,
  garlicConverterCalculator,
  gcfCalculator,
  gramsToCupsCalculator,
  gramsToTablespoonsCalculator,
  grossRentMultiplierCalculator,
  guitarStringTensionCalculator,
  halfMarathonPaceCalculator,
  hamCookingTimeCalculator,
  heartRateZoneCalculator,
  hexToDecimalConverter,
  hikingCaloriesCalculator,
  homaIrCalculator,
  iifymCalculator,
  immigrationWaitTimeCalculator,
  jumpRopeCaloriesCalculator,
  ketoMacroCalculator,
  knittingYarnCalcCalculator,
  ladderAngleCalculator,
  lcmCalculator,
  leatherWorkingCalculator,
  legalFeeCalc,
  lifeExpectancyCalculator,
  logCalculator,
  lotteryTaxCalculator,
  lumberWeightCalculator,
  maintenanceCaloriesCalculator,
  mapBloodPressureCalculator,
  marathonPaceCalculator,
  maxHeartRateCalculator,
  melatoninDosageCalculator,
  metalWeightCalculator,
  mlToGramsCalculator,
  modelScaleCalculator,
  moneyMarketCalc,
  octalConverter,
  overtimePayCalc,
  ozempicDosageCalculator,
  packYearCalculator,
  paintMixingRatioCalculator,
  pancakeBatchCalculator,
  partyDrinkCalculator,
  paverSandCalculator,
  pediatricDosageCalculator,
  personalInjurySettlementCalculator,
  pondCalculator,
  potteryGlazeCalculator,
  pregnancyWeightGainCalculator,
  puppyWeightCalculator,
  qtcCalculator,
  quiltingFabricCalculator,
  rcCarGearingCalculator,
  romanNumeralCalc,
  rsuTaxCalc,
  salaryComparisonCalculator,
  salesForecastCalculator,
  selfRisingFlourCalculator,
  sellerNetProceedsCalculator,
  sentencingGuidelinesCalculator,
  shiplapCalculator,
  sideHustleTaxCalculator,
  sigFigsCalc,
  smokingRecoveryCalculator,
  soapMakingCalcCalculator,
  songRoyaltyCalcCalculator,
  sourdoughCalculator,
  sousVideCalculator,
  speakerWattageCalculator,
  spiralStaircaseCalculator,
  squatCalcCalculator,
  ssdiBenefitCalculator,
  stairCarpetCalculator,
  startupCostCalc,
  statuteLimitationsCalculator,
  steakCookingTimeCalculator,
  steelWeightCalculator,
  stepsToMilesCalculator,
  stockAverageCalc,
  strideLengthCalcCalculator,
  subtractTimeCalc,
  swimmingCalorieCalculator,
  thanksgivingCalculator,
  thinsetCalculator,
  timeToDecimalConverter,
  tylenolDosageCalculator,
  uncookedToCookedCalculator,
  vinylRecordValueCalculator,
  wainscotingCalculator,
  weddingAlcoholCalculator,
  weightGainCalcCalculator,
  woodturningBlankCalculator,
  wrongfulTerminationCalculator,
  twelveHourShiftPayCalculator,
  fourOhOneKEmployerMatchCalculator,
  acTonnageCalculator,
  adderallDosageCalculator,
  adiabaticProcessCalculator,
  agiCalculator,
  agilityTestCalculator,
  airFilterSizeCalculator,
  angularMomentumCalculator,
  annualIncomeCalculator,
  anovaTwoWayCalculator,
  antibioticDoseCalculator,
  aquariumHeaterSizeCalculator,
  awgToMmCalculator,
  basalBodyTempCalculator,
  bathroomFanSizeCalculator,
  bbqPartyCalculator,
  beamLoadCalculator,
  beehiveHoneyCalculator,
  birthdayPartyCostCalculator,
  blackbodyRadiationCalculator,
  bloodOxygenCalculator,
  bowlingHandicapCalculator,
  breadProofingCalculator,
  breastmilkStorageCalculator,
  brunchPlannerCalculator,
  caffeineNapCalculator,
  calisthenicsProgCalculator,
  capitalGainsTaxDetailedCalculator,
  carnotEfficiencyCalculator,
  catenaryCalculator,
  cellPhonePlanCalculator,
  cementCalculator,
  cfmCalculator,
  cha2ds2VascCalculator,
  charcuterieBoardCalculator,
  cheeseBoardCalculator,
  chickenEggCalculator,
  childGrowthChartCalculator,
  childTaxCreditCalculator,
  clomidOvulationCalculator,
  cocktailRecipeCalculator,
  coffeeSpendingCalculator,
  coldPlungeCalculator,
  colorBlindnessSimCalculator,
  compostingWormCalculator,
  comptonScatteringCalculator,
  concreteBlockFillCalculator,
  concretePatioCalculator,
  concussionAssessmentCalculator,
  continuedFractionCalculator,
  cookieExchangeCalculator,
  couponSavingsCalculator,
  creditCardInterestCalculator,
  crownRumpLengthCalculator,
  crushedStoneCalculator,
  crystalFieldCalculator,
  cupsToPoundsCalculator,
  cyclingTrainingPlanCalculator,
  dartScoreCalculator,
  dataTransferCalculator,
  dayOfYearCalculator,
  deckRailingCalculator,
  dehydratorTimeCalculator,
  dentalCostCalculator,
  diabetesRiskCalculator,
  diaperUsageCalculator,
  diffractionGratingCalculator,
  dividendTaxCalculator,
  dpiPpiCalculator,
  earnedIncomeCreditCalculator,
  electricityApplianceCalculator,
  electromagneticWaveCalculator,
  evChargingTimeCalculator,
  exhaustFanSizeCalculator,
  fantasyTradeCalculator,
  fencePostDepthCalculator,
  fermentationTimeCalculator,
  ficaTaxCalculator,
  flowRateConverterCalculator,
  foodCostPerServingCalculator,
  freezerMealCalculator,
  fuelEconomyConverterCalculator,
  furnaceSizeCalculator,
  futureSalaryCalculator,
  gad7AnxietyCalculator,
  garageSalePriceCalculator,
  gasDiffusionCalculator,
  giftBudgetCalculator,
  glycemicIndexCalculator,
  golfClubDistanceCalculator,
  gramsToTeaspoonsCalculator,
  gravelDrivewayCalculator,
  greenhouseVentilationCalculator,
  guineaPigFoodCalculator,
  gymMembershipRoiCalculator,
  hamPerPersonCalculator,
  hamsterWheelCalculator,
  hardnessConverterCalculator,
  headCircumferenceCalculator,
  houseCleaningTimeCalculator,
  hydrationSweatCalculator,
  ibuprofenDosageCalculator,
  instantPotTimeCalculator,
  isothermalProcessCalculator,
  kayakSizeCalculator,
  kombuchaBrewCalculator,
  latteFactorCalculator,
  laundryCostCalculator,
  levothyroxineDoseCalculator,
  logicGateCalculator,
  lumensToWattsCalculator,
  lutealPhaseCalculator,
  magiCalculator,
  magneticFieldCalculator,
  marathonTrainingCalculator,
  mashedPotatoesServingCalculator,
  mealCalorieCalculator,
  mealPrepCostCalculator,
  momentOfInertiaCalculator,
  mortgageRecastCalculator,
  muscleRecoveryCalculator,
  netToGrossPayCalculator,
  nuclearDecayChainCalculator,
  nutritionGapCalculator,
  pValueCalculator,
  paperWeightConverterCalculator,
  paycheckWithholdingCalculator,
  perfectNumberCalculator,
  phaseChangeCalculator,
  photoelectricCalculator,
  phq9DepressionCalculator,
  pickleballRatingCalculator,
  pilatesCalorieCalculator,
  plankProgressionCalculator,
  postFrameBuildingCalculator,
  potluckPlannerCalculator,
  poundsToCupsCalculator,
  primeCountingCalculator,
  prismDispersionCalculator,
  proratedSalaryCalculator,
  pullUpProgressionCalculator,
  punchRecipeCalculator,
  rValueCalculator,
  radiantFloorHeatCalculator,
  rafterLengthCalculator,
  rainGardenCalculator,
  rainwaterTankCalculator,
  readingSpeedCalculator,
  realEstateDepreciationCalculator,
  rockClimbingGradeCalculator,
  saunaSessionCalculator,
  savingsRateCalculator,
  screenResolutionCalculator,
  setTheoryCalculator,
  skateboardSizeCalculator,
  skinCancerRiskCalculator,
  sleepQualityScoreCalculator,
  socialSecurityBreakEvenCalculator,
  solarBatteryCalculator,
  streamingCostCompareCalculator,
  stressLevelCalculator,
  subscriptionAuditCalculator,
  surfboardSizeCalculator,
  swimmingTrainingCalculator,
  taxEquivalentYieldCalculator,
  taxLossHarvestCalculator,
  threadPitchCalculator,
  thriftStoreMarkupCalculator,
  timeAndHalfCalculator,
  timezoneSalaryCalculator,
  toddlerPortionCalculator,
  torqueConverterCalculator,
  trainingLoadCalculator,
  turkeyDefrostCalculator,
  turkeySizeCalculator,
  typingSpeedTestCalculator,
  vinylFenceCalculator,
  visionAcuityCalculator,
  waffleBatchCalculator,
  wallSquareFootageCalculator,
  weddingTimelineCalculator,
  weightWatchersCalculator,
  whiteboardSizeCalculator,
  wireGaugeAmpacityCalculator,
  woodBeamSpanCalculator,
  woodFenceCalculator,
cryptoStakingCalculator,
  ethereumStakingCalculator,
  nftProfitCalculator,
  bitcoinMiningCalculator,
  coveredCallCalculator,
  fatFireCalculator,
  financialIndependenceCalculator,
  putOptionCalculator,
  callOptionCalculator,
  optionsGreeksCalculator,
  sinkingFundCalculator,
  uberEarningsCalculator,
  lyftEarningsCalculator,
  freelancerRateCalculator,
  etsyProfitCalculator,
  ebayProfitCalculator,
  shopifyProfitCalculator,
  dropshippingProfitCalculator,
  resaleProfitCalculator,
  sideHustleIncomeCalculator,
  passiveIncomeCalculator,
  rentalRoiCalculator,
  houseHackingCalculator,
  brrrrCalculator,
  wholesaleDealCalculator,
  sellerClosingCostCalculator,
  buyerClosingCostCalculator,
  pointsVsRateCalculator,
  armVsFixedCalculator,
  cashOutRefiCalculator,
  jumboMortgageCalculator,
  giftTaxCalculator,
  megaBackdoorRothCalculator,
  hsaSavingsCalculator,
  washSaleCalculator,
  quarterlyEstimatedTaxCalculator,
  tax1099QuarterlyCalculator,
  selfEmploymentFicaCalculator,
  gapInsuranceCalculator,
  pmiRemovalCalculator,
  costOfLivingComparisonCalculator,
  salaryNegotiationCalculator,
  equityCompensationCalculator,
  stockOptionValueCalculator,
  weddingCostCalculator,
  studentLoanForgivenessCalculator,
  rowingCalorieCalculator,
  stairClimbingCalorieCalculator,
  ellipticalCalorieCalculator,
  martialArtsCalorieCalculator,
  danceCalorieCalculator,
  skiingCalorieCalculator,
  snowboardingCalorieCalculator,
  stressScoreCalculator,
  burnoutRiskCalculator,
  sleepQualityCalculator,
  anxietyScoreCalculator,
  depressionScreeningCalculator,
  mindfulnessMinutesCalculator,
  spfCalculator,
  retinolStrengthCalculator,
  vitaminDDosageCalculator,
  omega3DosageCalculator,
  calciumNeedsCalculator,
  magnesiumNeedsCalculator,
  zincNeedsCalculator,
  bloodPressureRiskCalculator,
  a1cToGlucoseCalculator,
  carbToInsulinCalculator,
  kidneyFunctionCalculator,
  liverFunctionCalculator,
  anesthesiaDosageCalculator,
  pediatricWeightCalculator,
  infantGrowthCalculator,
  childGrowthPercentileCalculator,
  formulaFeedingCalculator,
  bracesCostCalculator,
  ivfCostCalculator,
  contactLensCostCalculator,
  wheelchairRampCalculator,
  adaComplianceCalculator,
  dotsScoreCalculator,
  vo2maxFitnessCalculator,
  reverseDietCalculator,
  carbCyclingCalculator,
  veganProteinCalculator,
  electrolyteNeedsCalculator,
  sweatRateCalculator,
  altitudeAdjustmentCalculator,
  heatIndexExerciseCalculator,
  windChillExerciseCalculator,
  matrixDeterminantCalculator,
  matrixMultiplicationCalculator,
  vectorCrossProductCalculator,
  vectorDotProductCalculator,
  vectorMagnitudeCalculator,
  polarToCartesianCalculator,
  cartesianToPolarCalculator,
  eulerFormulaCalculator,
  fourierSeriesCalculator,
  differentialEquationCalculator,
  partialDerivativeCalculator,
  doubleIntegralCalculator,
  tripleIntegralCalculator,
  lineIntegralCalculator,
  surfaceIntegralCalculator,
  divergenceCalculator,
  curlCalculator,
  gradientCalculator,
  truthTableCalculator,
  binaryToHexCalculator,
  hexToBinaryCalculator,
  octalConverterCalculator,
  pascalTriangleCalculator,
  catalanNumberCalculator,
  stirlingNumberCalculator,
  chineseRemainderCalculator,
  quarticEquationCalculator,
  polynomialRootCalculator,
  polynomialDivisionCalculator,
  remainderTheoremCalculator,
  rationalRootCalculator,
  descartesRuleCalculator,
  cramersRuleCalculator,
  gaussEliminationCalculator,
  leastSquaresCalculator,
  fTestCalculator,
  tTestCalculator,
  anovaCalculator,
  exponentialDistributionCalculator,
  geometricDistributionCalculator,
  carbonOffsetCalculator,
  ecologicalFootprintCalculator,
  energySavingsCalculator,
  solarPanelSavingsCalculator,
  solarPanelSizeCalculator,
  evVsGasCalculator,
  electricityCarbonCalculator,
  homeEnergyAuditCalculator,
  insulationRValueCalculator,
  hvacSizingCalculator,
  starMagnitudeCalculator,
  planetaryWeightCalculator,
  hubbleConstantCalculator,
  redshiftCalculator,
  lightYearCalculator,
  parsecCalculator,
  asteroidImpactCalculator,
  radioactiveDecayCalculator,
  nuclearBindingEnergyCalculator,
  massEnergyCalculator,
  deBroglieWavelengthCalculator,
  heisenbergUncertaintyCalculator,
  schrodingerEquationCalculator,
  wienDisplacementCalculator,
  hendersonHasselbalchCalculator,
  nernstEquationCalculator,
  arrheniusEquationCalculator,
  vanDerWaalsCalculator,
  boyleLawCalculator,
  gayLussacLawCalculator,
  daltonLawCalculator,
  grahamsLawCalculator,
  raoultsLawCalculator,
  colligativePropertiesCalculator,
  cellDivisionCalculator,
  hardyWeinbergCalculator,
  dilutionFactorCalculator,
  doublingTimeCalculator,
  nannyCostCalculator,
  babysitterPayCalculator,
  babyFormulaCostCalculator,
  schoolSupplyCostCalculator,
  backToSchoolCalculator,
  christmasGiftBudgetCalculator,
  holidayBudgetCalculator,
  valentinesBudgetCalculator,
  vacationBudgetCalculator,
  roadTripCostCalculator,
  campingCostCalculator,
  travelPerDiemCalculator,
  dryCleaningCostCalculator,
  cleaningSupplyCalculator,
  groceryBudgetCalculator,
  pantryInventoryCalculator,
  coffeeCostCalculator,
  smokingCostCalculator,
  alcoholSpendingCalculator,
  homeGymCostCalculator,
  bookReadingTimeCalculator,
  audiobookListeningTimeCalculator,
  podcastListeningCalculator,
  tvBingeTimeCalculator,
  movieMarathonCalculator,
  videoGameCostPerHourCalculator,
  petLifetimeCostCalculator,
  dogWalkingCostCalculator,
  catFoodCostCalculator,
  aquariumCostCalculator,
  horseOwnershipCostCalculator,
  weddingCateringCalculator,
  weddingPhotographyCalculator,
  weddingVenueCostCalculator,
  obituaryWordCountCalculator,
  storageUnitCostCalculator,
  junkRemovalCostCalculator,
  homeStagingCostCalculator,
  homeAppraisalCostCalculator,
  termiteTreatmentCostCalculator,
  lawnMowingCostCalculator,
  treeRemovalCostCalculator,
  snowRemovalCostCalculator,
  gutterCleaningCostCalculator,
  pressureWashingCostCalculator,
  windowCleaningCostCalculator,
  carpetCleaningCostCalculator,
  upholsteryCleaningCostCalculator,
  carDetailingCostCalculator,
  carWrapCostCalculator,
  parkingCostCalculator,
  tollCostCalculator,
  rideshareVsCarCalculator,
  bikeVsCarCalculator,
  electricScooterCostCalculator,
  internetPlanCalculator,
  cableVsStreamingCalculator,
  cordCuttingSavingsCalculator,
  cloudStorageCostCalculator,
  dataBreachRiskCalculator,
  identityTheftCostCalculator,
  vpnCostCalculator,
  websiteHostingCostCalculator,
  domainNameValueCalculator,
  appDevelopmentCostCalculator,
  freelanceProjectCostCalculator,
  printVsDigitalCalculator,
  paperUsageCalculator,
  inkCostPerPageCalculator,
  envelopeSizeCalculator,
  boxSizeCalculator,
  palletCalculator,
  warehouseSpaceCalculator,
  dumpsterSizeCalculator,
  ppcRoiCalculator,
  mrrCalculator,
  arrCalculator,
  saasValuationCalculator,
  startupRunwayCalculator,
  burnRateCalculator,
  capTableCalculator,
  revenuePerEmployeeCalculator,
  clickThroughRateCalculator,
  pageLoadTimeCalculator,
  serverUptimeCalculator,
  storageIopsCalculator,
  networkThroughputCalculator,
  latencyCalculator,
  concurrentUsersCalculator,
  bandwidthCostCalculator,
  cdnCostCalculator,
  awsEc2CostCalculator,
  awsS3CostCalculator,
  azureVmCostCalculator,
  gcpComputeCostCalculator,
  serverlessCostCalculator,
  dockerResourceCalculator,
  kubernetesNodeCalculator,
  ciCdTimeCalculator,
  storyPointCalculator,
  technicalDebtCalculator,
  developerProductivityCalculator,
  slackMessageCostCalculator,
  freelanceIncomeTaxCalculator,
  contractorVsEmployeeCalculator,
  workFromHomeSavingsCalculator,
  bytesToMegabytesCalculator,
  megabytesToGigabytesCalculator,
  gigabytesToTerabytesCalculator,
  bitrateCalculator,
  dpiToPpiCalculator,
  pixelsToInchesCalculator,
  inchesToPixelsCalculator,
  uploadSpeedCalculator,
  sampleRateCalculator,
  ppiCalculator,
  monitorDistanceCalculator,
  tvSizeCalculator,
  projectorThrowCalculator,
  clothingSizeConverterCalculator,
  ringSizeConverterCalculator,
  braSizeConverterCalculator,
  hatSizeConverterCalculator,
  kidsClothingSizeCalculator,
  internationalPaperSizeCalculator,
  wireGaugeConverterCalculator,
  paintCoverageCalculator,
  curtainSizeCalculator,
  rugSizeCalculator,
  bedsheetSizeCalculator,
  posterSizeCalculator,

afterRepairValueCalculator,
  pricePerSquareFootCalculator,
  houseFlipCalculator,
  landValueCalculator,
  triplexInvestmentCalculator,
  fourplexInvestmentCalculator,
  airbnbRevenueCalculator,
  vacationRentalIncomeCalculator,
  realEstateSyndicationCalculator,
  tripleNetLeaseCalculator,
  leaseVsBuyCalculator,
  costSegregationCalculator,
  depreciationRecaptureCalculator,
  qualifiedOpportunityZoneCalculator,
  muniBondCalculator,
  treasuryBondCalculator,
  seriesIBondCalculator,
  cdLadderCalculator,
  cryptoPortfolioCalculator,
  defiImpermanentLossSimulatorCalculator,
  cryptoMiningElectricityCalculator,
  altcoinProfitCalculator,
  cryptoAirdropValueCalculator,
  cryptoLendingCalculator,
  flashLoanCalculator,
  cryptoArbitrageCalculator,
  tokenomicsCalculator,
  cryptoMarketCapCalculator,
  bitcoinHalvingCalculator,
  ethereumGasEstimatorCalculator,
  solanaStakingCalculator,
  cardanoStakingCalculator,
  polkadotStakingCalculator,
  cosmosStakingCalculator,
  avalancheStakingCalculator,
  polygonStakingCalculator,
  cryptoFearGreedCalculator,
  bitcoinRainbowChartCalculator,
  unitEconomicsCalculator,
  ltvCacRatioCalculator,
  paybackPeriodCalculator,
  contributionMarginCalculator,
  operatingMarginCalculator,
  grossMarginCalculator,
  ebitdaCalculator,
  priceElasticityCalculator,
  marketShareCalculator,
  daysSalesOutstandingCalculator,
  accountsPayableTurnoverCalculator,
  interestCoverageRatioCalculator,
  freeCashFlowCalculator,
  disposableIncomeCalculator,
  discretionaryIncomeCalculator,
  debtSnowballMethodCalculator,
  zeroBasedBudgetCalculator,
  envelopeBudgetCalculator,
  fiftyThirtyTwentyCalculator,
  needsVsWantsCalculator,
  financialHealthScoreCalculator,
  moneyMarketCalculator,
  highYieldSavingsCalculator,
  certificateOfDepositCalculator,
  emergencySavingsCalculator,
  rainyDayFundCalculator,
  wealthTaxCalculator,
  luxuryTaxCalculator,
  sinTaxCalculator,
  carbonTaxCalculator,
  netCarbsCalculator,
  potassiumNeedsCalculator,
  vitaminCCalculator,
  vitaminB12Calculator,
  folateNeedsCalculator,
  biotinCalculator,
  collagenDosageCalculator,
  probioticsCalculator,
  turmericDosageCalculator,
  ashwagandhaDosageCalculator,
  coq10DosageCalculator,
  fishOilCalculator,
  glucosamineDosageCalculator,
  preWorkoutCalculator,
  postWorkoutNutritionCalculator,
  mealFrequencyCalculator,
  cheatMealCalculator,
  refeedDayCalculator,
  dietBreakCalculator,
  thermicEffectFoodCalculator,
  neatCalculator,
  restingEnergyExpenditureCalculator,
  mifflinStJeorCalculator,
  katchMcardleCalculator,
  benchPressMaxCalculator,
  overheadPressMaxCalculator,
  bodyRecompositionCalculator,
  leanBulkCalculator,
  miniCutCalculator,
  targetHeartRateZoneCalculator,
  functionalThresholdPowerCalculator,
  cooperTestCalculator,
  beepTestCalculator,
  pushupTestCalculator,
  situpTestCalculator,
  plankTestCalculator,
  bodyTypeCalculator,
  wristSizeCalculator,
  ankleSizeCalculator,
  rockClimbingCalorieCalculator,
  surfingCalorieCalculator,
  skateboardingCalorieCalculator,
  kayakingCalorieCalculator,
  tennisCalorieCalculator,
  basketballCalorieCalculator,
  soccerCalorieCalculator,
  volleyballCalorieCalculator,
  badmintonCalorieCalculator,
  tableTennisCalorieCalculator,
  golfCalorieCalculator,
  horsebackRidingCalorieCalculator,
  iceSkatingCalorieCalculator,
  rollerSkatingCalorieCalculator,
  trampolineCalorieCalculator,
  waterPoloCalorieCalculator,
  crossfitCalorieCalculator,
  spinningCalorieCalculator,
  zumbaCalorieCalculator,
  hexagonCalculator,
  octagonCalculator,
  pentagonCalculator,
  rhombusCalculator,
  parallelogramCalculator,
  ellipseCalculator,
  ellipsoidCalculator,
  torusCalculator,
  frustumCalculator,
  tetrahedronCalculator,
  dodecahedronCalculator,
  icosahedronCalculator,
  irregularPolygonCalculator,
  segmentAreaCalculator,
  annulusCalculator,
  centralAngleCalculator,
  tangentLineCalculator,
  greatCircleCalculator,
  sphericalTriangleCalculator,
  primeFactorizationCalculator,
  lcmHcfCalculator,
  modularExponentiationCalculator,
  eulersTotientCalculator,
  lucasNumberCalculator,
  tribonacciCalculator,
  collatzConjectureCalculator,
  happyNumberCalculator,
  amicableNumberCalculator,
  narcissisticNumberCalculator,
  palindromeNumberCalculator,
  armstrongNumberCalculator,
  abundantNumberCalculator,
  deficientNumberCalculator,
  harshadNumberCalculator,
  kaprekarNumberCalculator,
  smithNumberCalculator,
  mersennePrimeCalculator,
  twinPrimeCalculator,
  hypergeometricCalculator,
  negativeBinomialCalculator,
  betaDistributionCalculator,
  gammaDistributionCalculator,
  weibullDistributionCalculator,
  logNormalCalculator,
  uniformDistributionCalculator,
  multinomialCalculator,
  kurtosisCalculator,
  skewnessCalculator,
  percentileCalculator,
  quartileCalculator,
  outlierCalculator,
  machNumberCalculator,
  poiseuilleLawCalculator,
  hookesLawCalculator,
  youngsModulusCalculator,
  shearStressCalculator,
  bulkModulusCalculator,
  centrifugalForceCalculator,
  coriolisEffectCalculator,
  gravitationalPotentialCalculator,
  simpleHarmonicMotionCalculator,
  molecularWeightCalculator,
  dilutionCalculatorChemCalculator,
  cellPotentialCalculator,
  bornHaberCycleCalculator,
  earthquakeMagnitudeCalculator,
  richterScaleCalculator,
  windSpeedCalculator,
  airQualityCalculator,
  soundWavelengthCalculator,
  lightPollutionCalculator,
  rainwaterHarvestingCalculator,
  greywaterCalculator,
  treeCarbonSequestrationCalculator,
  roomPaintCalculator,
  fenceStainCalculator,
  epoxyFloorCalculator,
  kitchenRemodelCalculator,
  bathroomRemodelCalculator,
  basementFinishingCalculator,
  atticInsulationCalculator,
  sprayFoamCalculator,
  blownInInsulationCalculator,
  radiantFloorCostCalculator,
  tanklessWaterHeaterCalculator,
  solarWaterHeaterCalculator,
  sumpPumpSizeCalculator,
  generatorSizeCalculator,
  standbyGeneratorCalculator,
  batteryBackupCalculator,
  surgeProtectorCalculator,
  wholeHouseFanCalculator,
  airPurifierSizeCalculator,
  waterFilterCalculator,
  reverseOsmosisCalculator,
  toddlerShoeSizeCalculator,
  childWeightPercentileCalculator,
  screenTimeKidsCalculator,
  allowanceCalculator,
  choreChartCalculator,
  birthdayAgeCalculator,
  petFoodAmountCalculator,
  fishTankVolumeCalculator,
  terrariumSizeCalculator,
  hotTubVolumeCalculator,
  airportTransferCalculator,
  hotelTaxCalculator,
  resortFeeCalculator,
  travelInsuranceCostCalculator,
  passportRenewalCalculator,
  visaCostCalculator,
  currencyExchangeFeeCalculator,
  dutyFreeSavingsCalculator,
  milesToKmWalkingCalculator,
  walkingTimeCalculator,
  hikingTimeCalculator,
  cyclingDistanceCalculator,
  motorcycleFuelCalculator,
  electricBikeRangeCalculator,
  scooterRangeCalculator,
  breadFlourCalculator,
  cocktailMixerCalculator,
  coffeeWaterRatioCalculator,
  espressoDoseCalculator,
  teaBrewingCalculator,
  smokerCookTimeCalculator,
  bbqMeatCalculator,
  hamSizeCalculator,
  roastSizeCalculator,
  pastaPortionCalculator,
  frostingAmountCalculator,
  fondantCalculator,
  jamSugarRatioCalculator,
  canningJarCalculator,
  foodCostPercentageCalculator,
  eventBudgetCalculator,
  seatingArrangementCalculator,
  tentSizeCalculator,
  stageSizeCalculator,
  soundSystemCalculator,
  photoBoothCostCalculator,
  djCostCalculator,
  bandCostCalculator,
  floristCostCalculator,
  invitationCostCalculator,
  thankYouCardCalculator,
  babyShowerCalculator,
  bridalShowerCalculator,
  bachelorPartyCalculator,
  retirementPartyCalculator,
  anniversaryPartyCalculator,
  newtonToPoundForceCalculator,
  pascalToAtmCalculator,
  barToPsiCalculator,
  torrToPascalCalculator,
  calorieToKilojouleCalculator,
  btuToWattCalculator,
  horsepowerToKilowattCalculator,
  knotToMphCalculator,
  lightYearToKmCalculator,
  astronomicalUnitCalculator,
  nauticalMileToKmCalculator,
  fathomToMeterCalculator,
  furlongToMeterCalculator,
  chainToMeterCalculator,
  rodToMeterCalculator,
  leagueToKmCalculator,
  handToCmCalculator,
  stoneToKgCalculator,
  troyOunceToGramCalculator,
  caratToGramCalculator,
  grainToGramCalculator,
  dramToGramCalculator,
  bushelToLiterCalculator,
  gillToMlCalculator,
  firkinToLiterCalculator,
  hogsheadToLiterCalculator,
  rankineToKelvinCalculator,
  radianToGradianCalculator,
  steradianToDegreeCalculator,
  weberToMaxwellCalculator,
  wifiSpeedTestCalculator,
  internetBandwidthCalculator,
  vpnSpeedCalculator,
  dnsPropagationCalculator,
  sslCertificateCostCalculator,
  emailStorageCalculator,
  cloudBackupCalculator,
  nasStorageCalculator,
  raidCalculator,
  monitorRefreshRateCalculator,
  gpuBenchmarkCalculator,
  powerSupplyCalculator,
  upsRuntimeCalculator,
  pcBuildCostCalculator,
  laptopBatteryLifeCalculator,
  phoneBatteryLifeCalculator,
  tabletBatteryLifeCalculator,
  stellarLuminosityCalculator,
  stellarMassCalculator,
  stellarRadiusCalculator,
  neutronStarCalculator,
  blackHoleMassCalculator,
  cosmicDistanceLadderCalculator,
  galaxyRecessionVelocityCalculator,
  darkMatterCalculator,
  cosmicMicrowaveBackgroundCalculator,
  solarEclipseCalculator,
  lunarEclipseCalculator,
  planetTransitCalculator,
  cometOrbitCalculator,
  commuteTimeValueCalculator,
  workLifeBalanceCalculator,
  salaryPerHourCalculator,
  onCallPayCalculator,
  hazardPayCalculator,
  businessMealDeductionCalculator,
  professionalDevelopmentRoiCalculator,
  certificationRoiCalculator,
  degreeRoiCalculator,
  careerChangeCalculator,
  teaspoonToMlCalculator,
  tablespoonToMlCalculator,
  cupToMlCalculator,
  pintToMlCalculator,
  quartToLiterCalculator,
  gallonToLiterExactCalculator,
  fluidOunceToMlCalculator,
  dryOunceToGramCalculator,
  groupExpenseCalculator,
  roommateExpenseCalculator,
  utilitySplitCalculator,
  choreTimeCalculator,
  errandTimeCalculator,
  mealPlanningCalculator,
  weeklyGroceryCalculator,
  cashbackCalculator,
  rewardsPointsCalculator,
  frequentFlyerCalculator,
  hotelPointsCalculator,
  creditCardRewardsCalculator,
  priceMatchCalculator,
  unitPriceCalculator,
  costPerUseCalculator,
  costPerWearCalculator,
  subscriptionCancelCalculator,
  freeTrialTrackerCalculator,

tattooCostCalculator,
  tattooSizeCalculator,
  tattooSessionTimeCalculator,
  tattooHealingTimeCalculator,
  tattooRemovalCostCalculator,
  tattooTipCalculator,
  tattooTouchUpCalculator,
  tattooAftercareCalculator,
  tattooPlacementCalculator,
  tattooPainLevelCalculator,
  foundationShadeCalculator,
  concealerShadeCalculator,
  hairDyeAmountCalculator,
  nailPolishAmountCalculator,
  moisturizerAmountCalculator,
  sunlessTannerCalculator,
  eyelashExtensionCalculator,
  lipFillerCostCalculator,
  facialCostCalculator,
  hairTransplantCostCalculator,
  microbladingCostCalculator,
  dpsCalculator,
  gamingPcBottleneckCalculator,
  gameServerCostCalculator,
  fpsCalculator,
  inputLagCalculator,
  gamingChairSizeCalculator,
  gameDownloadTimeCalculator,
  esportsPrizeCalculator,
  dndDamageCalculator,
  rpgStatCalculator,
  lootDropCalculator,
  lawsuitSettlementCalculator,
  attorneyFeeCalculator,
  courtCostCalculator,
  bailAmountCalculator,
  childCustodyCalculator,
  spousalSupportCalculator,
  personalInjuryCalculator,
  wrongfulDeathCalculator,
  smallClaimsCalculator,
  trafficTicketCalculator,
  duiCostCalculator,
  divorceSettlementCalculator,
  legalMalpracticeCalculator,
  cropYieldCalculator,
  livestockFeedCalculator,
  cattleWeightCalculator,
  stockingRateCalculator,
  hayBaleCalculator,
  grainBinCalculator,
  farmProfitCalculator,
  tractorFuelCalculator,
  fencePostCalculator,
  pondStockingCalculator,
  chickenCoopCalculator,
  coverCropCalculator,
  cropInsuranceCalculator,
  farmLoanCalculator,
  dairyProductionCalculator,
  densityAltitudeCalculator,
  aircraftWeightBalanceCalculator,
  fuelBurnRateCalculator,
  takeoffDistanceCalculator,
  landingDistanceCalculator,
  crosswindComponentCalculator,
  trueAirspeedCalculator,
  groundSpeedCalculator,
  flightFuelCalculator,
  pilotLogbookCalculator,
  aircraftRangeCalculator,
  windCorrectionAngleCalculator,
  hullSpeedCalculator,
  anchorSizeCalculator,
  boatFuelConsumptionCalculator,
  engineHoursCalculator,
  boatInsuranceCalculator,
  marinaSlipCostCalculator,
  boatWinterizationCalculator,
  sailAreaCalculator,
  displacementCalculator,
  boatTrailerCalculator,
  watermakerCalculator,
  marineBatteryCalculator,
  lifePathNumberCalculator,
  zodiacCompatibilityCalculator,
  birthChartCalculator,
  moonSignCalculator,
  risingSignCalculator,
  chineseZodiacYearCalculator,
  destinyNumberCalculator,
  soulUrgeNumberCalculator,
  personalYearCalculator,
  karmicDebtCalculator,
  biorhythmCalculator,
  keyTranspositionCalculator,
  delayTimeCalculator,
  reverbTimeCalculator,
  decibelAdditionCalculator,
  paSystemCalculator,
  headphoneAmpCalculator,
  vinylRecordCalculator,
  songLengthCalculator,
  studioCostCalculator,
  musicStreamingRoyaltyCalculator,
  metronomeSubdivisionCalculator,
  capoTranspositionCalculator,
  boardFeetCalculator,
  mortiseTenonCalculator,
  woodGlueCalculator,
  sawmillYieldCalculator,
  plywoodSheetCalculator,
  hardwoodCostCalculator,
  woodFinishCalculator,
  woodStainCalculator,
  pipeDiameterCalculator,
  drainSlopeCalculator,
  toiletFlushCalculator,
  faucetFlowRateCalculator,
  sprinklerHeadCalculator,
  breakerSizeCalculator,
  wireSizeCalculator,
  conduitFillCalculator,
  electricalPanelCalculator,
  groundRodCalculator,
  printTimeEstimatorCalculator,
  resinVolumeCalculator,
  printBedCalculator,
  layerHeightCalculator,
  infillCalculator,
  nozzleFlowCalculator,
  filamentDryingCalculator,
  printFarmCalculator,
  stlScalingCalculator,
  tireSizeComparisonCalculator,
  gearRatioFinalDriveCalculator,
  turboSizingCalculator,
  compressionRatioCalculator,
  engineBoreStrokeCalculator,
  fuelInjectorSizeCalculator,
  intercoolerCalculator,
  exhaustPipeSizeCalculator,
  carPaintCalculator,
  windshieldReplacementCalculator,
  carShippingCalculator,
  vehicleRegistrationCalculator,
  sewingThreadCalculator,
  zipperLengthCalculator,
  elasticCalculator,
  biasTapeCalculator,
  buttonSpacingCalculator,
  hemAllowanceCalculator,
  patternGradingCalculator,
  seamAllowanceCalculator,
  interfacingCalculator,
  liningFabricCalculator,
  macrameCordCalculator,
  aquariumWaterVolumeCalculator,
  fishStockingCalculator,
  co2InjectionCalculator,
  waterChangeCalculator,
  aquariumSaltCalculator,
  substrateCalculator,
  aquariumGlassThicknessCalculator,
  exposureTriangleCalculator,
  shutterSpeedCalculator,
  apertureCalculator,
  isoCalculator,
  circleOfConfusionCalculator,
  sensorSizeCalculator,
  photoAspectRatioCalculator,
  timeLapseCalculator,
  butterConversionCalculator,
  sugarConversionCalculator,
  flourConversionCalculator,
  honeyConversionCalculator,
  milkConversionCalculator,
  oilConversionCalculator,
  eggConversionCalculator,
  bakingPowderConversionCalculator,
  saltConversionCalculator,
  vanillaConversionCalculator,
  chocolateConversionCalculator,
  creamConversionCalculator,
  cheeseConversionCalculator,
  riceConversionCalculator,
  photosynthesisCalculator,
  respirationRateCalculator,
  osmosisCalculator,
  enzymeKineticsCalculator,
  geneFrequencyCalculator,
  mutationRateCalculator,
  geneticDistanceCalculator,
  biodiversityIndexCalculator,
  trophicLevelCalculator,
  foodWebCalculator,
  biomassCalculator,
  carbonCycleCalculator,
  mriCostCalculator,
  ctScanCostCalculator,
  xRayCostCalculator,
  bloodTestCostCalculator,
  physicalTherapyCostCalculator,
  chiropractorCostCalculator,
  dermatologistCostCalculator,
  orthodontistCostCalculator,
  optometristCostCalculator,
  psychiatristCostCalculator,
  urgentCareCostCalculator,
  ambulanceCostCalculator,
  prescriptionCostCalculator,
  medicalBillNegotiationCalculator,
  healthSavingsCalculator,
  vennDiagramCalculator,
  binaryAdditionCalculator,
  hexadecimalArithmeticCalculator,
  ieee754Calculator,
  floatingPointCalculator,
  errorPropagationCalculator,
  dimensionalAnalysisCalculator,
  unitConversionChainCalculator,
  extrapolationCalculator,
  curveFittingCalculator,
  condoInsuranceCalculator,
  earthquakeInsuranceCalculator,
  petInsuranceCostCalculator,
  travelMedicalInsuranceCalculator,
  supplementalInsuranceCalculator,
  cobraInsuranceCalculator,
  marketplaceInsuranceCalculator,
  lifeInsuranceNeedsCalculator,
  accidentalDeathInsuranceCalculator,
  criticalIllnessInsuranceCalculator,
  declutterCalculator,
  closetOrganizationCalculator,
  garageOrganizationCalculator,
  pantryOrganizationCalculator,
  bathroomCleaningCalculator,
  kitchenDeepCleanCalculator,
  springCleaningCalculator,
  moveInCleaningCalculator,
  moveOutCleaningCalculator,
  officeCleaningCalculator,
  windowWashingCalculator,
  powerWashingTimeCalculator,
  examScoreCalculator,
  scholarshipValueCalculator,
  studentDebtPayoffCalculator,
  graduateSchoolRoiCalculator,

meadMakingCalculator,
  homebrewAbvCalculator,
  homebrewEquipmentCalculator,
  distillationYieldCalculator,
  wineryStartupCalculator,
  fermentationTempCalculator,
  wineCellarCalculator,
  carbonationLevelCalculator,
  primingSugarCalculator,
  taproomRevenueCalculator,
  tinyHouseCostCalculator,
  vanConversionCalculator,
  rvTripCostCalculator,
  cabinBuildCalculator,
  shedCostCalculator,
  yurtCostCalculator,
  pergolaCostCalculator,
  gazeboCostCalculator,
  screenedPorchCalculator,
  hotTubCostCalculator,
  outdoorKitchenCalculator,
  firePitCostCalculator,
  poolCostCalculator,
  arduinoPowerCalculator,
  raspberryPiPowerCalculator,
  rcCircuitCalculator,
  inductorEnergyCalculator,
  robotBuildCalculator,
  droneBuildCalculator,
  servoTorqueCalculator,
  stepperSpeedCalculator,
  solarChargeCalculator,
  seedSpacingCalculator,
  irrigationFlowCalculator,
  cropYieldEstimateCalculator,
  beekeepingStartupCalculator,
  hydroponicsNutrientCalculator,
  aquaponicsRatioCalculator,
  mushroomSubstrateCalculator,
  orchardPlanningCalculator,
  bowlingAverageCalculator,
  dartsCheckoutCalculator,
  fishingLineStrengthCalculator,
  huntingBallisticsCalculator,
  archeryArrowSpineCalculator,
  climbingRopeCalculator,
  tennisRacketSizeCalculator,
  baseballBatSizeCalculator,
  bicycleSizeCalculator,
  foodTruckStartupCalculator,
  restaurantStartupCalculator,
  recipeScalingCalculator,
  pizzaSizeValueCalculator,
  bakingAltitudeCalculator,
  sourdoughHydrationCalculator,
  smokingMeatTimeCalculator,
  mealDeliveryCalculator,
  breadBakingFlourCalculator,
  butterYieldCalculator,
  coffeeShopStartupCalculator,
  bakeryStartupCalculator,
  wardrobeCapsuleCalculator,
  clothingCostPerWearCalculator,
  dressAlterationCalculator,
  tailorCostCalculator,
  shoeSizeAgeCalculator,
  weddingDressCalculator,
  suitCostCalculator,
  uniformCostCalculator,
  fabricNeededCalculator,
  jewelryMetalWeightCalculator,
  customJewelryCalculator,
  watchCollectionCalculator,
  airbnbOccupancyCalculator,
  rentalYieldGrossCalculator,
  rentToPriceCalculator,
  n1PercentRuleCalculator,
  propertyTaxEstimateCalculator,
  renovationBudgetCalculator,
  bpmToMsCalculator,
  speakerBoxVolumeCalculator,
  roomReverbCalculator,
  cableLengthSignalCalculator,
  homeStudioCalculator,
  vinylRecordTimeCalculator,
  concertSoundCalculator,
  llcFormationCalculator,
  ndaCostCalculator,
  incorporationCostCalculator,
  breakEvenUnitsCalculator,
  accountsReceivableDaysCalculator,
  workingCapitalRatioCalculator,
  puppyFirstYearCalculator,
  kittenFirstYearCalculator,
  reptileTankSizeCalculator,
  petInsuranceCompareCalculator,
  horseMonthlyCalculator,
  petGroomingCalculator,
  passportTimelineCalculator,
  backpackingBudgetCalculator,
  destinationWeddingCalculator,
  travelPointsValueCalculator,
  studyAbroadCalculator,
  gapYearCalculator,
  skiTripCalculator,
  disneyVacationCalculator,
  safariTripCalculator,
  yachtCharterCalculator,
  glampingCostCalculator,
  postureScoreCalculator,
  hydrationNeedsCalculator,
  eyeStrainRiskCalculator,
  hearingDamageRiskCalculator,
  sittingHealthRiskCalculator,
  circadianRhythmCalculator,
  napDurationCalculator,
  handwashingTimeCalculator,
  sunlightExposureCalculator,
  ergonomicDeskCalculator,
  classGradeCalculator,
  homeschoolCostCalculator,
  tutoringCostCalculator,
  semesterCreditsCalculator,
  collegeApplicationCalculator,
  scholarshipChanceCalculator,
  totientFunctionCalculator,
  mobiusFunctionCalculator,
  perfectNumberCheckCalculator,
  twinPrimeFinderCalculator,
  digitSumCalculator,
  numberPalindromeCalculator,
  triangularNumberCalculator,
  pentagonalNumberCalculator,
  hexagonalNumberCalculator,
  ouncesToCupsCalculator,
  sticksToCupsCalculator,
  fahrenheitToGasCalculator,
  quartsToLitersCalculator,
  pintsToCupsCalculator,
  gallonsToLitersCalculator,
  fluidOzToMlCalculator,
  richterScaleEnergyCalculator,
  windPowerCalculator,
  waterPressureDepthCalculator,
  pendulumPeriodCalculator,
  buoyancyForceCalculator,
  kineticEnergyCalculator,
  potentialEnergyGravCalculator,
  frictionForceCalculator,
  angularVelocityCalculator,
  roofReplacementCalculator,
  windowReplacementCalculator,
  doorReplacementCalculator,
  flooringInstallCalculator,
  hardwoodRefinishCalculator,
  countertopCostCalculator,
  backsplashCostCalculator,
  paintingCostCalculator,
  exteriorPaintingCalculator,
  plumbingRepairCalculator,
  electricalRewiringCalculator,
  garageDoorCalculator,

babyWeightGainCalculator,
  breastPumpScheduleCalculator,
  dueDateIvfCalculator,
  strollerBudgetCalculator,
  retirementSavingsGapCalculator,
  retirementWithdrawalCalculator,
  downsizingSavingsCalculator,
  elderCareCostCalculator,
  inheritanceSplitCalculator,
  freelanceHourlyRateCalculator,
  projectQuoteCalculator,
  gigTaxEstimateCalculator,
  deliveryDriverProfitCalculator,
  contentCreatorRevenueCalculator,
  podcastMonetizationCalculator,
  onlineCourseRevenueCalculator,
  ebookRoyaltyCalculator,
  patreonIncomeCalculator,
  printOnDemandCalculator,
  compostSavingsCalculator,
  waterConservationCalculator,
  energyStarSavingsCalculator,
  reusableBagCalculator,
  ledBulbSavingsCalculator,
  thermostatSavingsCalculator,
  lowFlowToiletCalculator,
  clotheslineSavingsCalculator,
  windChillTempCalculator,
  uvExposureTimeCalculator,
  lightningDistanceCalculator,
  barometricAltitudeCalculator,
  gasPriceOptimizerCalculator,
  miningElectricityCalculator,
  stakingRewardCalculator,
  tokenUnlockCalculator,
  yieldFarmingCalculator,
  nftFloorPriceCalculator,
  defiPortfolioCalculator,
  tippingEtiquetteCalculator,
  splitRentCalculator,
  garageSaleCalculator,
  cashbackRewardsCalculator,
  warrantyValueCalculator,
  depreciationVehicleCalculator,
  leaseVsBuyCarCalculator,

smartHomeCostCalculator,
  smartLockRoiCalculator,
  solarBatterySizeCalculator,
  evHomeChargerCalculator,
  smartSprinklerCalculator,
  treadmillCostCalculator,
  pelotonCostCalculator,
  homeSaunaCostCalculator,
  coldPlungeCostCalculator,
  massageGunValueCalculator,
  boardGameValueCalculator,
  legoCostPerPieceCalculator,
  modelTrainTrackCalculator,
  stampCollectionValueCalculator,
  coinCollectionValueCalculator,
  cyberInsuranceCalculator,
  napierLogarithmCalculator,
  hyperbolicSineCalculator,
  hyperbolicCosineCalculator,
  sigmoidFunctionCalculator,
  softmaxCalculator,

  tenNinetyNineDeductionCalculator,
  adoptionCostCalculator,
  aduCostCalculator,
  aiApiCostCalculator,
  aiImageCostCalculator,
  aiTrainingCostCalculator,
  airbnbOccupancyRateCalculator,
  alaskaPaycheckCalculator,
  amazonFbaProfitCalculator,
  appRevenueCalculator,
  aquaponicsSizingCalculator,
  arkansasPaycheckCalculator,
  asbestosRemovalCostCalculator,
  babyFirstYearCostCalculator,
  backToSchoolCostCalculator,
  backpackingFoodCalculator,
  barMitzvahCostCalculator,
  beekeepingCostCalculator,
  beerRecipeScaleCalculator,
  bloodDonationEligibilityCalculator,
  bloodGlucoseA1cCalculator,
  botoxCostCalculator,
  btuToKwCalculator,
  businessInsuranceCostCalculator,
  carbonCreditValueCalculator,
  cashRegisterCalculator,
  cheeseMakingCalculator,
  chickenCoopCostCalculator,
  christmasBudgetCalculator,
  christmasLightCostCalculator,
  climbingTrainingLoadCalculator,
  cloudHostingCostCalculator,
  collagenIntakeCalculator,
  collegeMoveInCostCalculator,
  communitySolarSavingsCalculator,
  connecticutPaycheckCalculator,
  cosmeticSurgeryCostCalculator,
  coursePricingCalculator,
  cpapPressureCalculator,
  creatineDosageCalculator,
  cricketRunRateCalculator,
  delawarePaycheckCalculator,
  dentalImplantCostCalculator,
  destinationWeddingCostCalculator,
  divorceCostCalculator,
  domainValueCalculator,
  doordashEarningsCalculator,
  dropshippingMarginCalculator,
  easterEggHuntCalculator,
  electricBikeSavingsCalculator,
  electricityTimeOfUseCalculator,
  electrolyteCalculator,
  energyRebateCalculator,
  equityDilutionCalculator,
  evBatteryDegradationCalculator,
  evHomeChargerCostCalculator,
  evLeaseVsBuyCalculator,
  evRoadTripPlannerCalculator,
  evTaxCreditCalculator,
  evVsGasTotalCostCalculator,
  familyReunionCostCalculator,
  fishingRodWeightCalculator,
  foodTruckCostCalculator,
  fourthOfJulyPartyCalculator,
  freelanceProjectBidCalculator,
  funeralCostCalculator,
  gallonsPerMinuteCalculator,
  geothermalCostCalculator,
  gigTaxCalculator,
  globalEntryRoiCalculator,
  glp1WeightLossCalculator,
  greenBuildingPremiumCalculator,
  halloweenCandyCalcCalculator,
  halloweenCostumeCostCalculator,
  hawaiiPaycheckCalculator,
  hearingAidCostCalculator,
  heatPumpSavingsCalculator,
  hoaFeeComparisonCalculator,
  holidayShippingDeadlineCalculator,
  homeAppraisalValueCalculator,
  homeElectrificationCalculator,
  homeEnergyScoreCalculator,
  homeSolarLoanCalculator,
  homesteadGardenSizeCalculator,
  horsepowerToTorqueCalculator,
  housewarmingPartyCalculator,
  idahoPaycheckCalculator,
  instacartEarningsCalculator,
  inventoryReorderCalculator,
  invisalignCostCalculator,
  iowaPaycheckCalculator,
  iudTimelineCalculator,
  kansasPaycheckCalculator,
  kentuckyPaycheckCalculator,
  lasikCostCalculator,
  ledUpgradeRoiCalculator,
  lightYearsToKmCalculator,
  llcVsScorpCalculator,
  llmTokenCalculator,
  lyftDriverEarningsCalculator,
  mainePaycheckCalculator,
  mapleSyrupYieldCalculator,
  menstrualCycleLengthCalculator,
  microgramsToMgCalculator,
  migraineTriggerScoreCalculator,
  mississippiPaycheckCalculator,
  mmaReachAdvantageCalculator,
  modelTrainScaleCalculator,
  moldRemediationCostCalculator,
  montanaPaycheckCalculator,
  mounjaroDosageCalculator,
  movingTimelineCalculator,
  mushroomGrowingCalculator,
  nauticalMilesToKmCalculator,
  nebraskaPaycheckCalculator,
  netMeteringSavingsCalculator,
  nevadaPaycheckCalculator,
  newHampshirePaycheckCalculator,
  newMexicoPaycheckCalculator,
  newYearsPartyCalculator,
  newsletterRevenueCalculator,
  newtonsToPoundsCalculator,
  northDakotaPaycheckCalculator,
  notarizationCostCalculator,
  oklahomaPaycheckCalculator,
  oregonPaycheckCalculator,
  passportRenewalTimeCalculator,
  pelvicFloorScoreCalculator,
  pickleballCourtCostCalculator,
  popupShopCostCalculator,
  postpartumCalorieCalculator,
  potteryShrinkageCalculator,
  prenatalVitaminCalculator,
  printOnDemandProfitCalculator,
  productPricingCalculator,
  promBudgetCalculator,
  quinceaeneraCostCalculator,
  radonMitigationCostCalculator,
  rcFlightTimeCalculator,
  rentToIncomeCalculator,
  rentalArbitrageCalculator,
  resinArtCalculator,
  restaurantFoodCostCalculator,
  restaurantLaborCostCalculator,
  retirementPartyCostCalculator,
  rhodeIslandPaycheckCalculator,
  roofSnowLoadCalculator,
  rugbyPointsCalculator,
  saasMetricsCalculator,
  sausageMakingCalculator,
  selfStorageCostCalculator,
  semaglutideSavingsCalculator,
  seoTrafficValueCalculator,
  septicPercTestCalculator,
  shippingRateCompareCalculator,
  skiBootSizeCalculator,
  skinAgeCalculator,
  smallBusinessTaxCalculator,
  smartThermostatSavingsCalculator,
  solarBatteryPaybackCalculator,
  solarPaybackPeriodCalculator,
  solarTaxCreditCalculator,
  southDakotaPaycheckCalculator,
  sponsorshipRateCalculator,
  stoneToPoundsCalcCalculator,
  summerCampCostCalculator,
  superbowlPartyCalculator,
  supplementTimingCalculator,
  surfboardVolumeCalculator,
  taxRefundEstimateCalculator,
  therapyCostCalculator,
  tiktokEarningsCalculator,
  tipCreditCalculator,
  titleSearchCostCalculator,
  turoProfitCalculator,
  twitchIncomeCalculator,
  uberDriverEarningsCalculator,
  utahPaycheckCalculator,
  valentinesDateCostCalculator,
  vendingMachineProfitCalculator,
  vermontPaycheckCalculator,
  volleyballStatsCalculator,
  waterHeaterComparisonCalculator,
  weatherizationRoiCalculator,
  wegovyCostCalculator,
  wellWaterTestCalculator,
  westVirginiaPaycheckCalculator,
  wholesaleMarkupCalculator,
  wineMakingCalculator,
  woodworkingJointCalculator,
  wyomingPaycheckCalculator,
  youtubeRevenueCalculator,

curb65ScoreCalculator,
  nihssScoreCalculator,
  mewsCalculator,
  rsbiCalculator,
  heartScoreCalculator,
  graceScoreCalculator,
  hasBledScoreCalculator,
  paduaScoreCalculator,
  percScoreCalculator,
  revisedGenevaCalculator,
  alvaradoScoreCalculator,
  epdsPostnatalCalculator,
  bodeIndexCalculator,
  gfrCalculator,
  anionGapCalcCalculator,
  dripRateCalcCalculator,
  endotrachealTubeCalcCalculator,
  tidalVolumeCalcCalculator,
  aaGradientCalcCalculator,
  pfRatioCalculator,
  inrCalculator,
  hematocritCalcCalculator,
  fundalHeightCalcCalculator,
  hcgLevelsCalcCalculator,
  nuchalTranslucencyCalculator,
  steroidConversionCalculator,
  warfarinDoseCalcCalculator,
  insulinDoseCalcCalculator,
  drugHalfLifeCalcCalculator,
  cardiacIndexCalcCalculator,
  strokeVolumeCalcCalculator,
  cerebralPerfusionCalculator,
  pvrCalculator,
  sortinoRatioCalculator,
  jensenAlphaCalculator,
  treynorRatioCalculator,
  bondConvexityCalculator,
  epsGrowthCalcCalculator,
  futuresContractCalculator,
  optionsSpreadCalculator,
  yieldToCallCalculator,
  altmanZScoreCalculator,
  bondPriceCalcCalculator,
  bondYtmCalcCalculator,
  dupontAnalysisCalculator,
  pegRatioCalcCalculator,
  forwardRateCalcCalculator,
  hedgeRatioCalcCalculator,
  betaStockCalcCalculator,
  costOfEquityCalculator,
  costOfCapitalCalculator,
  enterpriseValueCalcCalculator,
  mirrCalculator,
  dcfCalculator,
  fireCalculator,
  perpetuityCalcCalculator,
  moneyFactorCalcCalculator,
  opportunityCostCalcCalculator,
  timeValueMoneyCalculator,
  varValueAtRiskCalculator,
  grahamNumberCalculator,
  intrinsicValueCalcCalculator,
  burnRateCalcCalculator,
  ltvSaasCalcCalculator,
  debtToEquityCalcCalculator,
  quickRatioCalcCalculator,
  economicValueAddedCalculator,
  dividendGrowthModelCalculator,
  ebitdaMultipleCalculator,
  retentionRatioCalculator,
  operatingLeverageCalculator,
  financialLeverageCalculator,
  evToEbitdaCalculator,
  priceToCashFlowCalculator,
  residualIncomeCalculator,
  sustainableGrowthRateCalculator,
  netOperatingIncomeCalculator,
  capRateNoiCalculator,
  projectileMotionCalculator,
  freeFallCalcCalculator,
  terminalVelocityCalcCalculator,
  rollingResistanceCalcCalculator,
  escapeVelocityCalcCalculator,
  orbitalVelocityCalcCalculator,
  rocketEquationCalculator,
  deltaVCalcCalculator,
  timeDilationCalculator,
  lengthContractionCalculator,
  eMc2CalcCalculator,
  lorentzForceCalculator,
  gaussLawCalcCalculator,
  faradayLawCalcCalculator,
  rlcCircuitCalculator,
  n555TimerCalculator,
  mosfetCalcCalculator,
  transistorBiasingCalculator,
  wireResistanceCalcCalculator,
  darcyWeisbachCalculator,
  hydraulicPressCalculator,
  archimedesPrincipleCalculator,
  dragEquationCalculator,
  liftCoefficientCalculator,
  braggLawCalculator,
  snellLawCalcCalculator,
  lensMakerCalcCalculator,
  thinLensCalcCalculator,
  speedOfSoundCalcCalculator,
  helmholtzResonatorCalculator,
  reverberationTimeCalcCalculator,
  youngModulusCalculator,
  poissonRatioCalculator,
  shearStressCalcCalculator,
  vonMisesStressCalculator,
  mohrCircleCalculator,
  stressConcentrationCalculator,
  fulcrumCalcCalculator,
  mechanicalAdvantageCalculator,
  beltLengthCalcCalculator,
  torsionSpringCalcCalculator,
  alabamaIncomeTaxCalculator,
  alaskaIncomeTaxCalculator,
  arizonaIncomeTaxCalculator,
  arkansasIncomeTaxCalculator,
  californiaIncomeTaxCalculator,
  coloradoIncomeTaxCalculator,
  connecticutIncomeTaxCalculator,
  delawareIncomeTaxCalculator,
  floridaIncomeTaxCalculator,
  georgiaIncomeTaxCalculator,
  hawaiiIncomeTaxCalculator,
  idahoIncomeTaxCalculator,
  illinoisIncomeTaxCalculator,
  indianaIncomeTaxCalculator,
  iowaIncomeTaxCalculator,
  kansasIncomeTaxCalculator,
  kentuckyIncomeTaxCalculator,
  louisianaIncomeTaxCalculator,
  maineIncomeTaxCalculator,
  marylandIncomeTaxCalculator,
  massachusettsIncomeTaxCalculator,
  michiganIncomeTaxCalculator,
  minnesotaIncomeTaxCalculator,
  mississippiIncomeTaxCalculator,
  missouriIncomeTaxCalculator,
  montanaIncomeTaxCalculator,
  nebraskaIncomeTaxCalculator,
  nevadaIncomeTaxCalculator,
  newHampshireIncomeTaxCalculator,
  newJerseyIncomeTaxCalculator,
  newMexicoIncomeTaxCalculator,
  newYorkIncomeTaxCalculator,
  northCarolinaIncomeTaxCalculator,
  northDakotaIncomeTaxCalculator,
  ohioIncomeTaxCalculator,
  oklahomaIncomeTaxCalculator,
  oregonIncomeTaxCalculator,
  pennsylvaniaIncomeTaxCalculator,
  rhodeIslandIncomeTaxCalculator,
  southCarolinaIncomeTaxCalculator,
  southDakotaIncomeTaxCalculator,
  tennesseeIncomeTaxCalculator,
  texasIncomeTaxCalculator,
  utahIncomeTaxCalculator,
  vermontIncomeTaxCalculator,
  virginiaIncomeTaxCalculator,
  washingtonIncomeTaxCalculator,
  westVirginiaIncomeTaxCalculator,
  wisconsinIncomeTaxCalculator,
  wyomingIncomeTaxCalculator,
  molarityCalcCalculator,
  dilutionEquationCalculator,
  idealGasLawCalculator,
  combinedGasLawCalculator,
  avogadroLawCalculator,
  bufferCapacityCalculator,
  electrochemistryCellCalculator,
  enthalpyReactionCalculator,
  massToMolesCalculator,
  colligativeBoilingCalculator,
  colligativeFreezingCalculator,
  heatOfFusionCalculator,
  heatOfVaporizationCalculator,
  henrysLawCalculator,
  footingSizeCalcCalculator,
  rebarSpacingCalculator,
  iBeamCalcCalculator,
  pipeSizeCalcCalculator,
  rampSlopeCalcCalculator,
  staircaseDesignCalculator,
  treadRiserCalcCalculator,
  concreteVolumeCalculator,
  trussLoadCalculator,
  mortarMixCalculator,
  plywoodSheetsCalculator,
  shingleCalcCalculator,
  gutterSizeCalcCalculator,
  hvacLoadCalculator,
  ductSizeCalcCalculator,
  conduitFillCalcCalculator,
  joistSpanCalcCalculator,
  postSpacingCalcCalculator,
  sandGravelCalcCalculator,
  wallpaperCalcCalculator,
  crownMoldingCalcCalculator,
  baseboardCalcCalculator,
  drywallCalcCalculator,
  chiSquareTestCalculator,
  tTestCalcCalculator,
  fTestCalcCalculator,
  anovaTestCalculator,
  regressionLineCalculator,
  correlationCoeffCalculator,
  covarianceCalcCalculator,
  quartileCalcCalculator,
  varianceCalcCalculator,
  typeIErrorCalculator,
  typeIiErrorCalculator,
  positivePredictiveCalculator,
  sampleSizeMeanCalculator,
  sipCalculator,
  homeEquityCalcCalculator,
  helocPaymentCalculator,
  fhaLoanCalcCalculator,
  vaLoanCalcCalculator,
  incomePercentileCalculator,
  weddingBudgetCalcCalculator,
  hourlyToSalaryCalcCalculator,
  salaryToHourlyCalcCalculator,
  payrollTaxCalcCalculator,
  estateTaxCalcCalculator,
  giftTaxCalcCalculator,
  capitalGainsTaxCalculator,
  annuityPaymentCalculator,
  annuityPvCalculator,
  annuityFvCalculator,
  earlyRetirementCalculator,
  netWorthCalcCalculator,
  inflationAdjustedCalculator,
  purchasingPowerCalculator,

vo2maxCalcCalculator,
  mhrCalcCalculator,
  n1rmEpleyCalculator,
  n1rmBrzyckiCalculator,
  rmPercentageCalculator,
  bodyweightRatioCalculator,
  verticalJumpCalculator,
  sprintSpeedCalculator,
  agilityScoreCalculator,
  beepTestVo2Calculator,
  runningCaloriePaceCalculator,
  swimmingCssCalculator,
  climbingGradeCalculator,
  carbonFootprintFlightCalculator,
  carbonFootprintCarCalculator,
  carbonFootprintDietCalculator,
  treeCarbonCalculator,
  recyclingImpactCalculator,
  foodWasteImpactCalculator,
  renewableEnergySavingsCalculator,
  rainGardenSizeCalculator,
  compostingMethaneCalculator,
  paperWasteCalculator,
  plasticUsageCalculator,
  rankineToFahrenheitCalculator,
  newtonToCelsiusTempCalculator,
  barToAtmCalculator,
  atmToBarCalculator,
  torrToAtmCalculator,
  mmhgToKpaCalculator,
  kpaToPsiCalculator,
  psiToKpaCalculator,
  newtonToLbfCalculator,
  lbfToNewtonCalculator,
  jouleToCalorieCalculator,
  calorieToJouleCalculator,
  btuToJouleCalculator,
  jouleToKwhCalculator,
  wattToHorsepowerCalculator,
  horsepowerToWattCalculator,
  machToMphCalculator,
  parsecToLyCalculator,
  astronomicalUnitToKmCalculator,
  gramToTroyOunceCalculator,
  mlToCupsCalculator,
  squareMetersToSqftCalculator,
  sqftToSqmCalculator,
  hectareToAcreCalculator,
  fathomToFeetCalculator,
  chainToFeetCalculator,
  furlongToMetersCalculator,
  micronToMmCalculator,
  angstromToNmCalculator,
  rpmToRadSCalculator,
  radSToRpmCalculator,
  pascalToPsiCalculator,
  dyneToNewtonCalculator,
  ergToJouleCalculator,
  slugToKgCalculator,
  pennyweightToGramCalculator,
  butterOilConvertCalculator,
  flourTypeConvertCalculator,
  pastaServingSizeCalculator,
  gravyAmountCalculator,
  cranberrySauceCalculator,
  turkeyThawTimeCalculator,
  turkeyCookTimeCalculator,
  primeRibCookCalculator,
  hamCookTimeCalculator,
  brisketCookCalculator,
  pulledPorkAmountCalculator,
  pizzaDoughCalcCalculator,
  teaSteepingCalculator,
  popcornYieldCalculator,
  jerkyYieldCalculator,
  pickleBrineCalculator,
  marshmallowRecipeCalculator,
  salsaRecipeCalculator,
  hummusRecipeCalculator,
  guacamoleCalcCalculator,
  icingAmountCalculator,
  fondantAmountCalculator,
  matrixInverse2x2Calculator,
  eigenvalue2x2Calculator,
  unitVectorCalculator,
  vectorAngleCalculator,
  complexNumberAddCalculator,
  complexNumberMultiplyCalculator,
  complexModulusCalculator,
  maclaurinSeriesCalculator,
  numericalDerivativeCalculator,
  numericalIntegralCalculator,
  newtonsMethodCalculator,
  bisectionMethodCalculator,
  bellNumberCalculator,
  partitionNumberCalculator,
  bernoulliNumberCalculator,
  downsizingChecklistCalculator,
  electricityPerApplianceCalculator,
  airConditionerSizeCalculator,
  airPurifierRoomCalculator,
  cleaningTimeCalculator,
  groceryBudgetPlanCalculator,
  commuteCostCalcCalculator,
  carWashCostCalculator,
  gymValueCalculator,
  birthdayPartyBudgetCalculator,
  weddingGuestCostCalculator,
  backToSchoolBudgetCalculator,
  petMonthlyCostCalculator,
  hobbyBudgetCalculator,
  vacationSavingsCalculator,
  emergencyFundCalcCalculator,
  newBabyCostCalculator,
  allowanceByAgeCalculator,
  chorePayCalculator,
  giftRegistryCalculator,

glasgowComaCalcCalculator,
  painScaleAssessmentCalculator,
  fallRiskMorseCalculator,
  news2ScoreCalculator,
  urineOutputCalcCalculator,
  tubeFeedingRateCalculator,
  bmiPediatricCalculator,
  gestationalDiabetesRiskCalculator,
  pediatricDoseWeightCalculator,
  woundMeasurementCalculator,
  bloodTransfusionVolCalculator,
  dosageByBsaCalculator,
  correctedQtcCalculator,
  bloodAlcoholCalcCalculator,
  waterIntakeCalcCalculator,
  sleepCycleCalcCalculator,
  columnBucklingCalculator,
  weldStrengthCalculator,
  boltTorqueCalcCalculator,
  bearingLifeCalculator,
  heatExchangerCalculator,
  pumpPowerCalculator,
  pipeFlowVelocityCalculator,
  orificeFlowCalculator,
  fanLawCalculator,
  compressorPowerCalculator,
  thermalConductivityCalculator,
  radiationHeatCalculator,
  convectionHeatCalculator,
  nusseltNumberCalculator,
  prandtlNumberCalculator,
  grashofNumberCalculator,
  rayleighNumberCalculator,
  weberNumberCalculator,
  strouhalNumberCalculator,
  eulerNumberFlowCalculator,
  cavitationNumberCalculator,
  stressStrainCurveCalculator,
  fatigueLifeCalculator,
  bandwidthCalcCalculator,
  dataTransferTimeCalculator,
  screenPpiCalculator,
  colorHexToRgbCalculator,
  subnetHostsCalculator,
  raidCapacityCalculator,
  cloudComputeCostCalculator,
  dnsPropagationTimeCalculator,
  passwordEntropyCalculator,
  hashRateProfitCalculator,
  nftRoyaltyCalculator,
  saasMrrCalculator,
  saasArrCalculator,
  churnRateCalcCalculator,
  cohortRetentionCalculator,
  emailRoiCalculator,
  cpmCalcCalculator,
  ellipsePerimeterCalculator,
  ellipsoidVolumeCalculator,
  torusSurfaceAreaCalculator,
  paraboloidVolumeCalculator,
  regularPolygonAreaCalculator,
  annulusAreaCalculator,
  arcLengthCalcCalculator,
  heronsFormulaCalculator,
  fibonacciCalcCalculator,
  gradiansToDegreesCalculator,
  sphericalCoordinatesCalculator,
  cylindricalCoordinatesCalculator,
  shippingCostCalcCalculator,
  importTaxCalculator,
  currencyConversionCalculator,
  pricePerUnitCalcCalculator,
  salesTaxCalcCalculator,
  vatCalcCalculator,
  gstCalcCalculator,
  propertyStampDutyCalculator,
  landTransferTaxCalculator,
  closingCostEstimateCalculator,
  titleInsuranceCostCalculator,
  appraisalCostCalculator,
  cellPhonePlanCostCalculator,
  internetSpeedNeedsCalculator,
  electricBillEstimateCalculator,
  gasBillEstimateCalculator,
  waterBillEstimateCalculator,
  chimneySweepCostCalculator,
  pestControlCostCalculator,
  hoaCostCalculator,
  notaryCostCalculator,
  passportRenewalCostCalculator,
  visaApplicationCostCalculator,

indiaIncomeTaxCalculator,
  indiaGstCalculator,
  indiaHraCalculator,
  indiaEpfCalculator,
  indiaSipCalculator,
  indiaHomeLoanEmiCalculator,
  indiaGratuityCalculator,
  indiaFdCalculator,
  indiaPpfCalculator,
  chinaIncomeTaxCalculator,
  chinaSocialInsuranceCalculator,
  chinaVatCalculator,
  usaFederalIncomeTax2025Calculator,
  usaFicaCalculator,
  usa401kCalculator,
  usaCapitalGainsTaxCalculator,
  usaSelfEmploymentTaxCalculator,
  usaRothIraCalculator,
  indonesiaIncomeTaxCalculator,
  indonesiaVatCalculator,
  indonesiaSalaryCalculator,
  pakistanIncomeTaxCalculator,
  pakistanVatCalculator,
  pakistanSalaryCalculator,
  nigeriaIncomeTaxCalculator,
  nigeriaVatCalculator,
  nigeriaSalaryCalculator,
  brazilIncomeTaxCalculator,
  brazilSalaryCalculator,
  brazilInssCalculator,
  brazil13thSalaryCalculator,
  bangladeshIncomeTaxCalculator,
  bangladeshVatCalculator,
  bangladeshSalaryCalculator,
  russiaIncomeTaxCalculator,
  russiaVatCalculator,
  russiaSalaryCalculator,
  russiaSelfEmployedTaxCalculator,
  ethiopiaIncomeTaxCalculator,
  ethiopiaVatCalculator,
  ethiopiaSalaryCalculator,
  mexicoIncomeTaxCalculator,
  mexicoVatCalculator,
  mexicoSalaryCalculator,
  mexicoAguinaldoCalculator,
  japanIncomeTaxCalculator,
  japanVatCalculator,
  japanSalaryCalculator,
  philippinesIncomeTaxCalculator,
  philippinesSssCalculator,
  egyptIncomeTaxCalculator,
  egyptVatCalculator,
  egyptSalaryCalculator,
  drCongoIncomeTaxCalculator,
  drCongoVatCalculator,
  vietnamIncomeTaxCalculator,
  vietnamVatCalculator,
  vietnamSalaryCalculator,
  iranIncomeTaxCalculator,
  iranVatCalculator,
  iranSalaryCalculator,
  turkeyIncomeTaxCalculator,
  turkeySgkCalculator,
  germanyIncomeTaxCalculator,
  germanyGrossNetCalculator,
  germanyMinijobCalculator,
  thailandIncomeTaxCalculator,
  thailandVatCalculator,
  thailandSalaryCalculator,
ukIncomeTaxCalculator,
  ukVatCalculator,
  ukSalaryCalculator,
  ukStampDutyCalculator,
  ukStudentLoanCalculator,
  ukDividendTaxCalculator,
  franceIncomeTaxCalculator,
  franceVatCalculator,
  franceSalaryCalculator,
  franceAutoEntrepreneurCalculator,
  italyIncomeTaxCalculator,
  italyVatCalculator,
  italySalaryCalculator,
  italyRegimeForfettarioCalculator,
  spainIncomeTaxCalculator,
  spainVatCalculator,
  spainSalaryCalculator,
  spainAutonomoCalculator,
  polandIncomeTaxCalculator,
  polandVatCalculator,
  polandSalaryCalculator,
  belgiumIncomeTaxCalculator,
  belgiumVatCalculator,
  belgiumSalaryCalculator,
  austriaIncomeTaxCalculator,
  austriaVatCalculator,
  austriaSalaryCalculator,
  irelandIncomeTaxCalculator,
  irelandVatCalculator,
  irelandSalaryCalculator,
  portugalIncomeTaxCalculator,
  portugalVatCalculator,
  portugalSalaryCalculator,
  czechRepublicIncomeTaxCalculator,
  czechRepublicVatCalculator,
  czechRepublicSalaryCalculator,
  greeceIncomeTaxCalculator,
  greeceVatCalculator,
  greeceSalaryCalculator,
  hungaryIncomeTaxCalculator,
  hungaryVatCalculator,
  hungarySalaryCalculator,
  romaniaIncomeTaxCalculator,
  romaniaVatCalculator,
  romaniaSalaryCalculator,
  netherlandsIncomeTaxCalculator,
  netherlandsVatCalculator,
  netherlands30RulingCalculator,
  swedenIncomeTaxCalculator,
  swedenVatCalculator,
  swedenSalaryCalculator,
  denmarkIncomeTaxCalculator,
  denmarkVatCalculator,
  denmarkSalaryCalculator,
  norwayIncomeTaxCalculator,
  norwayVatCalculator,
  norwaySalaryCalculator,
  finlandIncomeTaxCalculator,
  finlandVatCalculator,
  finlandSalaryCalculator,
  switzerlandIncomeTaxCalculator,
  switzerlandVatCalculator,
  switzerlandSalaryCalculator,
  euVatRatesCalculator,
debtConsolidationCalculator,
  carAccidentSettlementCalculator,
  medicalMalpracticeCalculator,
  painSufferingCalculator,
  lostWagesCalculator,
  dogBiteCompensationCalculator,
  slipAndFallCalculator,
  futureMedicalCostCalculator,
  homeReplacementCostCalculator,
  disabilityIncomeGapCalculator,
  businessLiabilityCalculator,
  absiCalculator,
  adjustedBodyWeightCalculator,
  geriatricBmiCalculator,
  mmeCalculator,
  acftCalculator,
  relativeFatMassCalculator,
  bariatricWeightLossCalculator,
  cssBoxShadowGeneratorCalculator,
  jsonFormatterCalculator,
  base64EncoderDecoderCalculator,
  regexTesterCalculator,
  jwtDecoderCalculator,
  cronExpressionGeneratorCalculator,
  hashGeneratorCalculator,
  uuidGeneratorCalculator,
  timesheetDecimalConverterCalculator,
  severancePayCalculator,
  ecommerceProfitMarginCalculator,
  utmBuilderCalculator,
  emailMetricsCalculator,
  cpmToCpcConverterCalculator,
  retailDiscountCalculator,
sunroomCostCalculator,
  porchCostCalculator,
  carportCostCalculator,
  artificialTurfCostCalculator,
  homeTheaterCostCalculator,
  closetRemodelCalculator,
  saunaCostCalculator,
  wineCellarCostCalculator,
  mudroomCostCalculator,
  dogFenceCostCalculator,
  chickenRunCalculator,
  pizzaOvenCostCalculator,
  outdoorKitchenCostCalculator,
  homeElevatorCostCalculator,
  stormShelterCostCalculator,
  backupGeneratorCostCalculator,
  homeSecurityCostCalculator,
  soundproofingCostCalculator,
  homeOfficeBuildCalculator,
  bathroomVanityCostCalculator,
  staircaseCostCalculator,
  homeBarCostCalculator,
  murphyBedCostCalculator,
  atticConversionCalculator,
  garageConversionCalculator,
  laundromatStartupCalculator,
  vendingMachineRoiCalculator,
  carWashStartupCalculator,
  foodTrailerCostCalculator,
  atmBusinessCalculator,
  storageUnitInvestmentCalculator,
  mobileDetailingCalculator,
  lawnCareBusinessCalculator,
  cleaningBusinessCalculator,
  pressureWashingBusinessCalculator,
  airbnbExpenseCalculator,
  commercialRentCalculator,
  capRateComparisonCalculator,
  costPerLeadCalculator,
  stockOptionCalculator,
  rsuTaxCalculator,
  esppCalculator,
  requiredMinimumDistributionCalculator,
  screenTimeImpactCalculator,
  hearingLossRiskCalculator,
  sunExposureCalculator,
  vaccineScheduleCalculator,
  allergySeverityCalculator,
  earthquakeEnergyCalculator,
  altitudePressureCalculator,
  terminalVelocityCalculator,
  orbitalPeriodCalculator,
  hexToRgbCalculator,
  unixTimestampConverterCalculator,
  numberBaseConverterCalculator,
  asciiConverterCalculator,
  cookingUnitConverterCalculator,
  combinationPermutationCalculator,
  seriesSumCalculator,
carDepreciationScheduleCalculator,
  carLeaseBuyoutCalculator,
  carShippingCostCalculator,
  carTintCostCalculator,
  fuelInjectorCalculator,
  turboBoostCalculator,
  spiceBlendCalculator,
  fermentationTemperatureCalculator,
  sugarSyrupCalculator,
  dogFoodCostCalculator,
  dogAgeCalculator,
  petEmergencyFundCalculator,
  dogExerciseCalculator,
  catLitterCostCalculator,
  petSittingRateCalculator,
  emergencyFundTimelineCalculator,
  noSpendChallengeCalculator,
  cashEnvelopeCalculator,
  snowballVsAvalancheCalculator,
  collegeComparisonCalculator,
  privateSchoolCostCalculator,
  extracurricularCostCalculator,
  scienceFairCostCalculator,
  studentHousingCalculator,
  gapYearBudgetCalculator,
  homeschoolCurriculumCalculator,
  schoolLunchCostCalculator,
  compostingToiletCalculator,
  greywaterSystemCalculator,
  foodForestCalculator,
  clothDiaperSavingsCalculator,
  zeroWasteSavingsCalculator,
  ledConversionSavingsCalculator,
  bicycleCommuteSavingsCalculator,
  movieNightCostCalculator,
  concertBudgetCalculator,
  themeParkBudgetCalculator,
  escapeRoomCostCalculator,
  bowlingCostCalculator,
  gameNightCalculator,
  karaokeCostCalculator,
  museumVisitCalculator,
  zooVisitCostCalculator,
  amusementParkCalculator,
  electricianRateCalculator,
  plumberRateCalculator,
  mechanicLaborRateCalculator,
  contractorMarkupCalculator,
  handymanPricingCalculator,
  photographerPricingCalculator,
  djPricingCalculator,
  personalTrainerRateCalculator,
  tutoringRateCalculator,
  massageTherapistRateCalculator,
  meditationTimerCalculator,
  stretchingRoutineCalculator,
  supplementCostCalculator,
  eyeStrainBreakCalculator,
  stepsToDistanceCalculator,
  standingDeskTimerCalculator,
  movingDayTipCalculator,
  garageSalePricingCalculator,
  estateSaleCalculator,
  timeZoneMeetingCalculator,
  powerOutageCostCalculator,
  noiseOrdinanceCalculator,
  radonMitigationCalculator,
  moldRemediationCalculator,
racePaceCalculator,
  benchPressStrengthCalculator,
  squatStrengthCalculator,
  deadliftStrengthCalculator,
  rowingSplitCalculator,
  paddleBoardSizeCalculator,
  rockClimbingRopeLengthCalculator,
  lacrosseStickSizeCalculator,
  dartCheckoutCalculator,
  audioRoomTreatmentCalculator,
  vinylRecordSpeedCalculator,
  paSystemSizeCalculator,
  pianoTuningCostCalculator,
  musicLessonCostCalculator,
  bandBookingCalculator,
  recordingStudioCostCalculator,
  audioCableLengthCalculator,
  snowLoadRoofCalculator,
  iceDamPreventionCalculator,
  winterHeatingCostCalculator,
  summerCoolingCostCalculator,
  lawnWateringCostCalculator,
  snowBlowerSizeCalculator,
  hurricanePrepCostCalculator,
  wildfirePrepCalculator,
  floodDamageCalculator,
  showerWaterUsageCalculator,
  laundryScheduleCalculator,
  dishwasherVsHandWashCalculator,
  vacuumCleanerCostCalculator,
  mattressReplacementCalculator,
  closetSpaceCalculator,
  householdChemicalCostCalculator,
  airFilterScheduleCalculator,
  lightbulbComparisonCalculator,
  structuralBeamCalculator,
  torqueConversionCalculator,
  pressureDropCalculator,
  prenupCostCalculator,
  trustFundCalculator,
  powerOfAttorneyCostCalculator,
  sCorpTaxSavingsCalculator,
  franchiseCostCalculator,
  commercialInsuranceCalculator,
  landClearingCostCalculator,
  wellDrillingCostCalculator,
  septicInstallationCostCalculator,
  propertyLineSurveyCalculator,
  earnestMoneyCalculator,
  homeWarrantyCalculator,
  hoaFeeImpactCalculator,
  websiteCostCalculator,
  saasPricingCalculator,
  serverSizingCalculator,
  dataTransferCostCalculator,
  bufferCalculator,
  reactionYieldCalculator,
  gasLawCalculator,
  spectrophotometerCalculator,
  disabilityBenefitsCalculator,
  mesotheliomaSettlementCalculator,
  medicalDebtCalculator,
  nursingHomeCostCalculator,
  assistedLivingCostCalculator,
  memoryCareCostCalculator,
  hospiceCostCalculator,
  veteranBenefitsCalculator,
  mortgageRefinanceBreakEvenCalculator,
  biweeklyMortgagePaymentCalculator,
  mortgageExtraPaymentsCalculator,
  mortgagePayoffCalculator,
  mortgageQualificationDtiCalculator,
  homeValueEstimatorCalculator,
  cashOnCashReturnCalculator,
  n503020Calculator,
  monthlyBudgetCalculator,
  sr22InsuranceCostCalculator,
  medicarePartBPremiumCalculator,
  medicarePartDCoverageGapCalculator,
  medigapPlanComparisonCalculator,
  longTermCareInsuranceCostCalculator,
  autoInsuranceDeductibleComparisonCalculator,
  umbrellaInsuranceCoverageCalculator,
  homeownersInsuranceEstimateCalculator,
  healthInsurancePremiumTaxCreditCalculator,
  disabilityInsuranceBenefitCalculator,
  spousalSupportDurationCalculator,
  timeAndAHalfCalculator,
  doubleTimePayCalculator,
  truckAccidentSettlementCalculator,
  whiplashSettlementCalculator,
  painAndSufferingMultiplierCalculator,
  attorneyContingencyFeeCalculator,
  structuredSettlementPayoutCalculator,
  backPayCalculator,
  wageTheftRecoveryCalculator,
  forexPositionSizeCalculator,
  forexPipValueCalculator,
  forexMarginCalculator,
  forexProfitLossCalculator,
  forexSwapCalculator,
  cryptoLeverageLiquidationCalculator,
  ethereumGasFeeCalculator,
  ironCondorCalculator,
  cryptoPortfolioRebalancingCalculator,
  cryptoYieldFarmingApyCalculator,
  estimatedTaxCalculator,
  marginalTaxRateCalculator,
  effectiveTaxRateCalculator,
  itemizedDeductionCalculator,
  charitableDonationCalculator,
  catchUpContributionCalculator,
  solo401kCalculator,
  rothIraIncomeLimitCalculator,
  fertilityByAgeCalculator,
  hcgDoublingTimeCalculator,
  implantationDateCalculator,
  reverseDueDateCalculator,
  fetalWeightPercentileCalculator,
  birthWeightPercentileCalculator,
  babyFormulaAmountCalculator,
  babyMilkIntakeCalculator,
  exclusivePumpingCalculator,
  vbacSuccessRateCalculator,
  chancesOfTwinsCalculator,
  babyEyeColorCalculator,
  childHeightPredictionCalculator,
  pediatricBmiPercentileCalculator,
  sipStepUpCalculator,
  lumpSumInvestmentCalculator,
  mutualFundReturnsCalculatorIndiaCalculator,
  goldInvestmentCalculatorIndiaCalculator,
  elssTaxSavingCalculator,
  section80cDeductionCalculator,
  dearnessAllowanceCalculator,
  irpfCalculatorBrazilCalculator,
  fgtsCalculatorBrazilCalculator,
  financiamentoImobiliarioCalculator,
  inssContributionCalculatorBrazilCalculator,
  cltVsPjCalculatorBrazilCalculator,
  decimoTerceiroCalculator,
  iptuCalculatorBrazilCalculator,
  rescisaoCalculatorBrazilCalculator,
  simplesNacionalCalculator,
  feriasCalculatorBrazilCalculator,
  w4Calculator,
  taxRefundCalculator,
  standardDeductionCalculator,
  energyTaxCreditCalculator,
  adoptionTaxCreditCalculator,
  millRateCalculator,
  propertyTaxAppealCalculator,
  employerPayrollTaxCalculator,
  applianceLifespanCalculator,
  homeMaintenanceBudgetCalculator,
  repairVsReplaceCalculator,
  streamingComparisonCalculator,
  mealKitComparisonCalculator,
  hourlyRateCalculator,
  commissionRateCalculator,
  realHourlyWageCalculator,
  costPerHireCalculator,
  employeeTurnoverCostCalculator,
collegeSavingsGapCalculator,
  scholarshipRoiCalculator,
  gradSchoolRoiCalculator,
  n529ContributionCalculator,
  financialAidEfcCalculator,
  tuitionInflationCalculator,
  carInsuranceComparisonCalculator,
  carLoanPayoffCalculator,
  gasVsElectricCarCalculator,
  carMaintenanceScheduleCalculator,
  usedCarValueCalculator,
  macronutrientRatioCalculator,
  rentVsBuyBreakEvenCalculator,
  propertyFlipProfitCalculator,
  vacancyRateImpactCalculator,
  closingCostEstimatorCalculator,
  bodyFatPercentageCalculator,
  dailyStepGoalCalculator,
  flexibilityAgeCalculator,
  runningPaceConversionCalculator,
  breakEvenAnalysisCalculator,
  markupVsMarginCalculator,
  invoiceLateFeeCalculator,
  accountsReceivableTurnoverCalculator,
  waterUsageCalculator,
  compostingSavingsCalculator,
  treePlantingOffsetCalculator,
  ledVsIncandescentCalculator,
  electricBillSplitCalculator,
  flightCostPerMileCalculator,
  hotelVsAirbnbCalculator,
  travelInsuranceValueCalculator,
  pointsValueCalculator,
  retirementTaxCalculator,
  trustDistributionCalculator,
  hydraulicCylinderCalculator,
petFoodCostCalculator,
  aquariumVolumeCalculator,
  petMedicationDosageCalculator,
  speakerWireGaugeCalculator,
  musicRoyaltyCalculator,
  printResolutionCalculator,
  goldenRatioCropCalculator,
  photoStorageCalculator,
  yarnYardageCalculator,
  fertilizerRateCalculator,
  anchorRodeCalculator,
  bleedMarginCalculator,
  colorContrastRatioCalculator,
  solarBatterySizingCalculator,
  capacitorChargeCalculator,
  profitMarginPerUnitCalculator,
  shippingCostEstimatorCalculator,
  businessLoanPaymentCalculator,
  fenceMaterialCalculator,
  gutterDownspoutCalculator,
asphaltPavingCalculator,
  poolPumpSizingCalculator,
  paverCalculator,
  postHoleConcreteCalculator,
  rainBarrelSavingsCalculator,
  wellPumpSizingCalculator,
  frenchDrainGravelCalculator,
  gutterRainCalculator,
  atticVentilationCalculator,
  crawlSpaceEncapsulationCalculator,
  windowUFactorCalculator,
  baseboardLengthCalculator,
  chairRailCalculator,
  tileGroutCalculator,
  backsplashTileCalculator,
  firewoodBtuCalculator,
  pelletStoveCostCalculator,
  ductInsulationCalculator,
  airFilterReplacementCalculator,
  waterHeaterCostCalculator,
  tanklessWaterHeaterSavingsCalculator,
  sumpPumpSizingCalculator,
  dehumidifierSizingCalculator,
  humidifierSizingCalculator,
  airPurifierRoomSizeCalculator,
  transferSwitchCalculator,
  electricalPanelLoadCalculator,
  circuitBreakerSizingCalculator,
  pipeFlowRateCalculator,
  pipePressureDropCalculator,
  pondLinerCalculator,
  concreteDrivewayCostCalculator,
  pergolaShadeCalculator,
  trampolineWeightLimitCalculator,
  swingSetSpacingCalculator,
  sandboxSandCalculator,
  basketballCourtSizeCalculator,
  tennisCourtCostCalculator,
  battingCageSizeCalculator,
  archeryRangeCalculator,
  dartBoardHeightCalculator,
  billiardRoomSizeCalculator,
  homeGymSpaceCalculator,
  saunaHeaterCalculator,
  steamRoomGeneratorCalculator,
  wineCellarCapacityCalculator,
  bookshelfCapacityCalculator,
  kitchenIslandSizeCalculator,
  countertopSquareFootageCalculator,
  cabinetHardwareCalculator,
  lightingLumenCalculator,
  recessedLightingCalculator,
  landscapeLightingCalculator,
  underCabinetLightingCalculator,
  ceilingHeightCalculator,
  staircaseCarpetCalculator,
  windowTreatmentCalculator,
  blindsSizeCalculator,
  tvViewingDistanceCalculator,
  projectorScreenSizeCalculator,
  ethernetCableCalculator,
  wifiAccessPointCalculator,
  upsBatteryCalculator,
  serverRackCalculator,
  ipSubnetCalculator,
  backupStorageCalculator,
  printTime3dCalculator,
  laserCuttingCostCalculator,
  cncMachiningCostCalculator,
  injectionMoldingCostCalculator,
  heatSinkCalculator,
  stepperMotorTorqueCalculator,
weddingGuestCalculator,
  weddingCakeCalculator,
  eventTentSizeCalculator,
  eventCateringCalculator,
  eventBarCalculator,
  retirementHomeCostCalculator,
  medicareSupplementCalculator,
  grabBarPlacementCalculator,
  medicationScheduleCalculator,
  visionCorrectionCostCalculator,
  servoMotorCalculator,
  relaySizingCalculator,
  transformerSizingCalculator,
  dowelJointCalculator,
  woodScrewPilotHoleCalculator,
  weldFillerMetalCalculator,
  weldHeatInputCalculator,
  sheetMetalBendCalculator,
  tapDrillSizeCalculator,
  fabricShrinkageCalculator,
  elasticLengthCalculator,
  seedRateCalculator,
  irrigationWaterCalculator,
  pastureStockingRateCalculator,
  grainBinCapacityCalculator,
  tractorPtoCalculator,
  runwayLengthCalculator,
  nauticalMileConverterCalculator,
  trueWindCalculator,
  tidalRangeCalculator,
  chartDistanceCalculator,
  fuelRangeCalculator,
  barometricPressureAltitudeCalculator,
  uvExposureCalculator,
  rainfallIntensityCalculator,
  lightYearDistanceCalculator,
  gamingPcWattageCalculator,
  gamingFpsCalculator,
  keyboardSwitchCalculator,
  diceProbabilityCalculator,
  miniatureScaleCalculator,
  origamiPaperSizeCalculator,
  wineSulfiteCalculator,
  kombuchaBrewingCalculator,
  essentialOilDilutionCalculator,
  soapLyeCalculator,
  leatherThicknessCalculator,
  packingTapeCalculator,
  furnitureMovingWeightCalculator,
  relocationCostOfLivingCalculator,
  commuteComparisonCalculator,
  neighborhoodAffordabilityCalculator,
  pressureWashingCalculator,
  windowCleaningCalculator,
  maidServiceCostCalculator,
  deepCleaningChecklistCalculator,
  laundryLoadCalculator,
  dryerEnergyCostCalculator,
  stainRemovalCalculator,
  ironingTimeCalculator,
  securityCameraCalculator,
  securitySystemCostCalculator,
  motionSensorCalculator,
  smartLockCostCalculator,
  safeSizeCalculator,
  emergencyWaterSupplyCalculator,
  emergencyFoodSupplyCalculator,
  emergencyGeneratorFuelCalculator,
  firstAidKitCalculator,
  evacuationTimeCalculator,
  fireExtinguisherCalculator,
  smokeDetectorCalculator,
  lightningRodCalculator,
  earthquakeRetrofitCalculator,
  oshaNoiseExposureCalculator,
  fireCodeOccupancyCalculator,
  parkingLotStripingCalculator,
  signSizeCalculator,
  loadingDockCalculator,
  commercialKitchenVentilationCalculator,
  restaurantSeatingCalculator,
  barInventoryCalculator,
  foodWasteCostCalculator,
  palletLoadCalculator,
  containerLoadCalculator,
  freightClassCalculator,
  dimensionalWeightCalculator,
  ltlFreightCostCalculator,
  pickPackTimeCalculator,
  forkliftCapacityCalculator,
  conveyorSpeedCalculator,
  fleetFuelCostCalculator,
  vehicleDepreciationScheduleCalculator,
  tireRotationScheduleCalculator,
  trailerTongueWeightCalculator,
  fuelSurchargeCalculator,
  deadheadMilesCalculator,
  driverPayCalculator,
  eldHoursCalculator,
  customsDutyCalculator,
  landedCostCalculator,
  cbmCalculator,
  containerWeightCalculator,
  palletizingCalculator,
  antennaGainCalculator,
  linkBudgetCalculator,
  freeSpacePathLossCalculator,
  coaxCableLossCalculator,
  fiberOpticLossCalculator,
  samplingRateCalculator,
  fftBinResolutionCalculator,
  soundIntensityCalculator,
  reverberationDistanceCalculator,
  lensFocalLengthCalculator,
  magnifyingGlassCalculator,
  mirrorFocalPointCalculator,
  viscosityCalculator,
  projectileRangeCalculator,
employeeOnboardingCostCalculator,
  absenteeismCostCalculator,
  overtimeCostCalculator,
  ptoAccrualCalculator,
  workersCompRateCalculator,
  employeeBenefitsCostCalculator,
  officeSpacePerEmployeeCalculator,
  nonprofitOverheadRateCalculator,
  fundraisingRoiCalculator,
  grantMatchCalculator,
  donorRetentionCalculator,
  volunteerValueCalculator,
  programCostPerOutcomeCalculator,
  churchTitheCalculator,
  churchSeatingCapacityCalculator,
  churchBudgetCalculator,
  missionTripCostCalculator,
  vacationBibleSchoolCalculator,
  potluckFoodCalculator,
  conferenceRoomCalculator,
  cubicleLayoutCalculator,
  standingDeskHeightCalculator,
  dentalCrownCostCalculator,
  dentalBridgeCostCalculator,
  dentalVeneerCostCalculator,
  orthodonticPaymentCalculator,
  dentalCleaningFrequencyCalculator,
  rootCanalCostCalculator,
  teethWhiteningCostCalculator,
  vetVisitCostCalculator,
  petVaccinationScheduleCalculator,
  petSpayNeuterCostCalculator,
  petDentalCostCalculator,
  petWeightCalculator,
  pillDosageCalculator,
  liquidMedicationCalculator,
  medicationHalfLifeCalculator,
  eyeglassPrescriptionCalculator,
  pupillaryDistanceCalculator,
  readingGlassesStrengthCalculator,
  eyeExamCostCalculator,
  blueLightExposureCalculator,
  babysittingRateCalculator,
  auPairCostCalculator,
  afterSchoolProgramCostCalculator,
  sportsLeagueCostCalculator,
  homeschoolCurriculumCostCalculator,
  schoolSupplyListCalculator,
  fieldTripCostCalculator,
  schoolBusRouteCalculator,
  classroomSizeCalculator,
  schoolFundraiserCalculator,
  yearbookCostCalculator,
  collegeApplicationCostCalculator,
  dormRoomEssentialsCalculator,
  mealPlanComparisonCalculator,
  studyHoursCalculator,
  classRankPercentileCalculator,
  actToSatConverterCalculator,
  hairColorCostCalculator,
  haircutFrequencyCalculator,
  hairExtensionCostCalculator,
  nailSalonCostCalculator,
  eyelashExtensionCostCalculator,
  facialTreatmentCostCalculator,
  spaDayCostCalculator,
  massageCostCalculator,
  waxingCostCalculator,
  dermalFillerCostCalculator,
  chemicalPeelCostCalculator,
  laserHairRemovalCalculator,
  teethStraighteningCostCalculator,
  skincareRoutineCostCalculator,
  perfumeCostPerWearCalculator,
  makeupExpirationCalculator,
  sunscreenUsageCalculator,
  skinTypeHydrationCalculator,
cattleWeightGainCalculator,
  poultryEggProductionCalculator,
  farmProfitMarginCalculator,
  tractorFuelCostCalculator,
  silageVolumeCalculator,
  cropRotationPlannerCalculator,
  farmLaborCostCalculator,
  fertilizerApplicationRateCalculator,
  livestockWaterNeedsCalculator,
  beehiveHoneyYieldCalculator,
  orchardTreeSpacingCalculator,
  vineyardYieldEstimatorCalculator,
  compostPileVolumeCalculator,
  soilPhAmendmentCalculator,
  farmFenceCostCalculator,
  aquacultureFeedRateCalculator,
  grainStorageMoistureCalculator,
  pastureCarryingCapacityCalculator,
  greenhouseEnergyCostCalculator,
  farmInsuranceCostCalculator,
  feedConversionRatioCalculator,
  centerPivotIrrigationCalculator,
  grainDryingCostCalculator,
  farmBreakEvenPriceCalculator,
  livestockPregnancyDueDateCalculator,
  legalFeeEstimatorCalculator,
  courtFilingFeeCalculator,
  settlementValueEstimatorCalculator,
  childSupportGuidelineCalculator,
  alimonyEstimatorCalculator,
  bailBondCostCalculator,
  legalRetainerCalculator,
  probateCostEstimatorCalculator,
  attorneyHourlyRateComparisonCalculator,
  caseTimelineEstimatorCalculator,
  legalMalpracticeDamagesCalculator,
  contractBreachDamagesCalculator,
  intellectualPropertyValueCalculator,
  trademarkRegistrationCostCalculator,
  patentFilingCostCalculator,
  copyrightRegistrationCostCalculator,
  arbitrationCostCalculator,
  mediationCostCalculator,
  depositionCostCalculator,
  expertWitnessFeeCalculator,
  juryDutyPayCalculator,
  immigrationFilingFeeCalculator,
  legalDocumentPreparationCostCalculator,
  bpmTempoCalculator,
  musicKeyTransposerCalculator,
  chordProgressionCalculator,
  concertTicketValueCalculator,
  musicStreamingRevenueCalculator,
  djSetTimePlannerCalculator,
  audioBitrateFileSizeCalculator,
  guitarStringGaugeCalculator,
  drumTuningFrequencyCalculator,
  studioRecordingCostCalculator,
  albumProductionBudgetCalculator,
  instrumentDepreciationCalculator,
  speakerRoomSizeCalculator,
  subwooferBoxVolumeCalculator,
  microphoneSensitivityCalculator,
  equalizerFrequencyCalculator,
  musicRoyaltySplitCalculator,
  podcastProductionCostCalculator,
  concertVenueCapacityCalculator,
  musicCopyrightValueCalculator,
  musicPracticeTimeCalculator,
  audioDelayCompensationCalculator,
  tennisRacketStringTensionCalculator,
  golfClubFittingCalculator,
  bicycleGearRatioCalculator,
  runningShoeMileageCalculator,
  boxingReachAdvantageCalculator,
  hockeyStickFlexCalculator,
  baseballBatWeightCalculator,
  basketballCourtDimensionsCalculator,
  footballFieldGoalDistanceCalculator,
  soccerFieldAreaCalculator,
  bowlingBallWeightCalculator,
  rockClimbingGradeConverterCalculator,
  skateboardTruckWidthCalculator,
  lacrosseStickLengthCalculator,
  martialArtsBeltProgressionCalculator,
  rowingStrokeRateCalculator,
  triathlonTransitionTimeCalculator,
  sportsDrinkHydrationCalculator,
  athleticTapeUsageCalculator,
cameraSensorCropFactorCalculator,
  timeLapseIntervalCalculator,
  videoBitrateEstimatorCalculator,
  filmBudgetEstimatorCalculator,
  goldenRatioCompositionCalculator,
  videoStorageEstimatorCalculator,
  greenScreenDistanceCalculator,
  colorTemperatureConverterCalculator,
  photoPrintCostCalculator,
  videoRenderTimeEstimatorCalculator,
  photoBackupStorageCalculator,
  weddingVideographyCostCalculator,
  filmCrewSizeEstimatorCalculator,
  motionBlurShutterSpeedCalculator,
  aspectRatioResizeCalculator,
  filmGrainIsoCalculator,
  lightingSetupCostCalculator,
  video360StitchingTimeCalculator,
  lensCompressionDistanceCalculator,
  pixelDensityPpiCalculator,
  ndFilterExposureCalculator,
  flightFuelCostEstimatorCalculator,
  jetLagRecoveryTimeCalculator,
  travelDailyBudgetCalculator,
  cruiseCabinCostComparisonCalculator,
  passportRenewalTimelineCalculator,
  airlineMilesValueCalculator,
  hotelPointsValueCalculator,
  luggageWeightConverterCalculator,
  visaProcessingTimeCalculator,
  internationalCallingCostCalculator,
  travelVaccinationCostCalculator,
  airportParkingCostCalculator,
  roadTripFuelPlannerCalculator,
  flightCarbonOffsetCalculator,
  timezoneOverlapCalculator,
  sailingDistanceCalculator,
  flightLayoverOptimizerCalculator,
  travelTipByCountryCalculator,
  backpackingGearWeightCalculator,
  skiResortValueComparisonCalculator,
  rentalCarCostComparisonCalculator,
  flightTimeEstimatorCalculator,
  cruisePackingListCalculator,
  uvProtectionFactorCalculator,
  rainfallCollectionCalculator,
  solarPanelPaybackCalculator,
  carbonFootprintOffsetCalculator,
  rainwaterTankSizeCalculator,
  airQualityHealthImpactCalculator,
  deforestationImpactCalculator,
  oceanAcidificationCalculator,
  permafrostThawRateCalculator,
  droughtSeverityIndexCalculator,
  floodRiskAssessmentCalculator,
  wildfireRiskCalculator,
  tornadoSafetyDistanceCalculator,
  hurricanePreparednessCostCalculator,
  lightningStrikeProbabilityCalculator,
  iceDamRiskCalculator,
  growingDegreeDaysCalculator,
  evapotranspirationRateCalculator,
  soilErosionRateCalculator,
  compostVolumeCalculator,
  windChillExtendedCalculator,
  heatIndexActivityCalculator,
  quiltFabricCalculator,
  candleMakingWaxCalculator,
  soapMakingLyeCalculator,
  resinArtVolumeCalculator,
  leatherWorkingCostCalculator,
  potteryKilnFiringCostCalculator,
  crossStitchFabricCalculator,
  scrapbookPageLayoutCalculator,
  woodTurningBlankSizeCalculator,
  modelRailroadScaleCalculator,
  miniaturePaintingCostCalculator,
  beadPatternCalculator,
  calligraphyInkUsageCalculator,
  paperCraftingSheetsCalculator,
  stainedGlassAreaCalculator,
  mosaicTileCalculator,
  crochetHookSizeCalculator,
  sewingPatternSizingCalculator,
  tieDyeFabricCalculator,
  flowerArrangementCostCalculator,
  cardMakingSuppliesCalculator,
  jewelryWireCalculator,
carDepreciationCurveCalculator,
  carWashFrequencyCostCalculator,
  engineOilCapacityCalculator,
  coolantFlushScheduleCalculator,
  transmissionFluidChangeCalculator,
  sparkPlugReplacementCalculator,
  carBatteryReplacementCostCalculator,
  wheelAlignmentFrequencyCalculator,
  carWaxApplicationCalculator,
  paintProtectionFilmCostCalculator,
  windowTintDarknessCalculator,
  carSeatFitCalculator,
  engineHorsepowerToWeightCalculator,
  zeroToSixtyTimeCalculator,
  quarterMileTimeCalculator,
  carLoanRefinanceCalculator,
  carSubscriptionVsOwnershipCalculator,
  tireTreadLifeCalculator,
  carAcRechargeCostCalculator,
  timingBeltReplacementCalculator,
  carFuelTankRangeCalculator,
  carBrakeRotorLifeCalculator,
  vehicleRegistrationRenewalCalculator,
  carAnnualMaintenanceCostCalculator,
  smartphoneScreenRepairCostCalculator,
  streamingServiceCostComparisonCalculator,
  gamingPcBuildBudgetCalculator,
  monitorSizeDistanceCalculator,
  usbTransferSpeedCalculator,
  ssdCostPerGbCalculator,
  wirelessRouterRangeCalculator,
  pcPowerSupplyCalculator,
  rgbLedStripCalculator,
  n3dPrinterFilamentCostCalculator,
  laserPrinterCostPerPageCalculator,
  securityCameraStorageCalculator,
  nasDriveCostCalculator,
  printerInkCostCalculator,
  eReaderBatteryCalculator,
  wirelessChargerEfficiencyCalculator,
  bluetoothRangeEstimatorCalculator,
  screenResolutionComparisonCalculator,
  phoneBatteryHealthCalculator,
  projectorThrowDistanceCalculator,
  electricBillDeviceCostCalculator,
  babyFoodStageCalculator,
  nurserySetupCostCalculator,
  maternityLeavePayCalculator,
  adoptionCostEstimatorCalculator,
  surrogacyCostCalculator,
  fertilityTreatmentCostCalculator,
  carSeatExpirationCalculator,
  strollerValueComparisonCalculator,
  babyClothesSizePredictorCalculator,
  childproofingCostCalculator,
  nannyShareCostCalculator,
  daycareWaitlistEstimatorCalculator,
  familyGroceryBudgetCalculator,
  familyPhonePlanCostCalculator,
  college529ProjectorCalculator,
  familyVacationBudgetCalculator,
  birthdayPartyPerChildCalculator,
  familyEmergencyFundCalculator,
  estatePlanningCostCalculator,
  familyLifeInsuranceCalculator,
  familyHealthInsuranceCostCalculator,
  lagrangePointCalculator,
  hillSphereCalculator,
  jeansMassCalculator,
  bolometricMagnitudeCalculator,
  hohmannTransferCalculator,
  gravitationalLensingCalculator,
  cosmicRedshiftDistanceCalculator,
  airyDiskCalculator,
  schwarzschildRadiusAdvancedCalculator,
  spectralClassTemperatureCalculator,
  binaryStarMassCalculator,
  exoplanetTransitDepthCalculator,
  atmosphericScaleHeightCalculator,
  solarLuminosityCalculator,
  gravitationalWaveStrainCalculator,
  orbitalDecayCalculator,
  chandrasekharLimitCalculator,
  keplersEquationSolverCalculator,
restaurantProfitMarginCalculator,
  menuPricingCalculator,
  kitchenEquipmentCostCalculator,
  restaurantSeatingCapacityCalculator,
  tableTurnoverRateCalculator,
  barPourCostCalculator,
  tipPoolDistributionCalculator,
  cateringCostPerHeadCalculator,
  foodTruckStartupCostCalculator,
  bakeryIngredientCostCalculator,
  coffeeShopDailyRevenueCalculator,
  restaurantLaborCostPercentageCalculator,
  inventoryTurnoverRateCalculator,
  plateCostCalculator,
  banquetHallRentalCostCalculator,
  buffetQuantityCalculator,
  deliveryServiceCommissionCalculator,
  happyHourProfitCalculator,
  cocktailRecipeCostCalculator,
  foodTrailerLicensingCostCalculator,
  restaurantBreakEvenCalculator,
  dishwasherCycleCostCalculator,
  gamingMonitorInputLagCalculator,
  esportsPrizePoolSplitCalculator,
  gameServerHostingCostCalculator,
  mouseSensitivityEdpiCalculator,
  gpuBenchmarkScoreEstimatorCalculator,
  vrHeadsetFovCalculator,
  gamingDeskSetupCostCalculator,
  twitchStreamerRevenueCalculator,
  youtubeGamingCpmCalculator,
  discordServerCostCalculator,
  gameDevelopmentBudgetCalculator,
  tabletopRpgEncounterBuilderCalculator,
  cardGameDeckValueCalculator,
  boardGamePlayTimeCalculator,
  miniaturesArmyCostCalculator,
  chessEloRatingCalculator,
  pokerPotOddsCalculator,
  fantasySportsLineupValueCalculator,
  gamingStreamingBitrateCalculator,
  retroGameCollectionValueCalculator,
  gamingPeripheralBudgetCalculator,
  lootBoxProbabilityCalculator,
  gamingMonitorSizeCalculator,
  centrifugeRcfRpmCalculator,
  electrolysisTimeCalculator,
  bacterialGrowthRateCalculator,
  solutionPreparationCalculator,
  reagentCostPerExperimentCalculator,
  labEquipmentDepreciationCalculator,
  pcrCycleNumberCalculator,
  qpcrFoldChangeCalculator,
  od600CellDensityCalculator,
  cfuColonyCountingCalculator,
  bradfordAssayProteinCalculator,
  cellViabilityCalculator,
  cellCultureMediaPrepCalculator,
  ligationRatioCalculator,
  transformationEfficiencyCalculator,
  transfectionEfficiencyCalculator,
  enzymeUnitConversionCalculator,
  meltingTemperaturePrimerCalculator,
  gelBandSizeEstimatorCalculator,
  elisaStandardCurveCalculator,
  westernBlotDilutionCalculator,
  fluorescenceQuenchingCalculator,
  dnaRnaYieldCalculator,
  plasmidCopyNumberCalculator,
  stoichiometryMassCalculator,
  receptionVenueCostCalculator,
  djVsBandCostCalculator,
  weddingPhotographerCostCalculator,
  bridesmaidDressBudgetCalculator,
  seatingChartOptimizerCalculator,
  eventTimelinePlannerCalculator,
  birthdayMilestoneCostCalculator,
  anniversaryGiftBudgetCalculator,
  rehearsalDinnerCostCalculator,
  honeymoonBudgetPlannerCalculator,
  weddingRegistryValueCalculator,
  bridalShowerCostCalculator,
  engagementRingAffordabilityCalculator,
  weddingDressAlterationCostCalculator,
  tentRentalCostCalculator,
  eventLightingCostCalculator,
  partyRentalEquipmentCostCalculator,
  weddingFavorCostCalculator,
  destinationWeddingSavingsCalculator,
  weddingGuestMealCostCalculator,
  floralArrangementBudgetCalculator,
  weddingCakeCostEstimatorCalculator,
  weddingInvitationQuantityCalculator,
  weddingTransportationCostCalculator,
boatEngineHoursMaintenanceCalculator,
  boatBottomPaintCalculator,
  marineBatterySizingCalculator,
  boatTrailerWeightCalculator,
  scubaTankDurationCalculator,
  diveDecompressionCalculator,
  fishingRodPowerCalculator,
  boatInsuranceCostCalculator,
  jetSkiCostPerHourCalculator,
  boatWinterizationCostCalculator,
  marineGeneratorSizingCalculator,
  bilgePumpSizingCalculator,
  boatCanvasCoverCostCalculator,
  fishingLureWeightCalculator,
  paddleboardSizeCalculator,
  boatRegistrationCostCalculator,
  marineRadioRangeCalculator,
  boatDepreciationCalculator,
  dockBuildingCostCalculator,
  boatLiftCapacityCalculator,
  propellerPitchCalculator,
  waterHeaterSizingCalculator,
  ductSizingCalculator,
  boilerEfficiencyCalculator,
  radiantFloorHeatingCalculator,
  miniSplitSizingCalculator,
  exhaustFanCfmCalculator,
  groundingElectrodeCalculator,
  motorStarterSizingCalculator,
  powerFactorCorrectionCalculator,
  harmonicDistortionCalculator,
  cableTrayFillCalculator,
  emergencyGeneratorSizingCalculator,
  solarInverterSizingCalculator,
  retirementIncomeGapCalculator,
  pensionBenefitEstimatorCalculator,
  n401kEmployerMatchMaximizerCalculator,
  annuityIncomeCalculator,
  retirementHealthcareCostCalculator,
  reverseMortgageEstimatorCalculator,
  retirementTaxBracketCalculator,
  rothConversionLadderCalculator,
  retirementPortfolioWithdrawalCalculator,
  sequenceOfReturnsRiskCalculator,
  bucketStrategyAllocatorCalculator,
  seniorHousingCostComparisonCalculator,
  homeCareCostEstimatorCalculator,
  retirementRelocationCostCalculator,
  charitableRemainderTrustCalculator,
  retirementSpendingCalculator,
  pensionColaImpactCalculator,
  socialSecuritySpousalBenefitCalculator,
  longTermCareNeedsCalculator,
  retirementAccountConsolidationCalculator,
  socialSecurityEarningsTestCalculator,
  medicareIrmaaSurchargeCalculator,
  retirementWithdrawalSequencingCalculator,
  earlyRetirementFireNumberCalculator,
  earthquakeMagnitudeConverterCalculator,
  seismicWaveVelocityCalculator,
  mineralHardnessComparisonCalculator,
  rockDensityCalculator,
  groundwaterFlowRateCalculator,
  soilCompactionTestCalculator,
  bearingCapacityCalculator,
  slopeStabilityFactorCalculator,
  tsunamiWaveSpeedCalculator,
  volcanicEruptionIndexCalculator,
  gemstoneCaratToMmCalculator,
  goldOreGradeValueCalculator,
  miningEquipmentCostPerTonCalculator,
  landSurveyAreaCalculator,
  topographicProminenceCalculator,
  riverDischargeRateCalculator,
  sedimentTransportCalculator,
  aquiferYieldCalculator,
  geothermalGradientCalculator,
  plateTectonicsVelocityCalculator,
  coalHeatingValueCalculator,
  aggregateVolumeCalculator,
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
