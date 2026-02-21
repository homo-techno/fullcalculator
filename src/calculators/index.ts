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
