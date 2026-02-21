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
