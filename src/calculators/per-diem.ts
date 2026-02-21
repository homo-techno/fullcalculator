import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const perDiemCalculator: CalculatorDefinition = {
  slug: "per-diem-calculator",
  title: "Per Diem Calculator",
  description: "Free per diem calculator. Calculate daily travel allowance for meals, lodging, and incidental expenses based on GSA rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["per diem calculator", "per diem rates", "travel allowance calculator", "GSA per diem", "business travel calculator"],
  variants: [
    {
      id: "basic",
      name: "Per Diem Allowance",
      description: "Calculate total per diem for a business trip",
      fields: [
        { name: "lodgingRate", label: "Lodging Rate (per night)", type: "number", placeholder: "e.g. 107", prefix: "$" },
        { name: "mealRate", label: "Meals & Incidentals (M&IE) Rate", type: "number", placeholder: "e.g. 64", prefix: "$" },
        { name: "nights", label: "Number of Nights", type: "number", placeholder: "e.g. 4", min: 0 },
        { name: "travelDays", label: "Total Travel Days", type: "number", placeholder: "e.g. 5", min: 1 },
        { name: "firstLastDayPct", label: "First/Last Day Meal %", type: "number", placeholder: "e.g. 75", suffix: "%", defaultValue: 75 },
      ],
      calculate: (inputs) => {
        const lodging = inputs.lodgingRate as number;
        const meals = inputs.mealRate as number;
        const nights = inputs.nights as number;
        const travelDays = inputs.travelDays as number;
        const firstLastPct = (inputs.firstLastDayPct as number) || 75;
        if (!meals || !travelDays) return null;
        const lodgingTotal = (lodging || 0) * (nights || 0);
        const firstLastDayMeals = meals * (firstLastPct / 100);
        const fullDays = Math.max(0, travelDays - 2);
        const mealsTotal = (2 * firstLastDayMeals) + (fullDays * meals);
        const adjustedMeals = travelDays === 1 ? firstLastDayMeals : mealsTotal;
        const totalPerDiem = lodgingTotal + adjustedMeals;
        return {
          primary: { label: "Total Per Diem", value: `$${formatNumber(totalPerDiem)}` },
          details: [
            { label: "Lodging Total", value: `$${formatNumber(lodgingTotal)}` },
            { label: "M&IE Total", value: `$${formatNumber(adjustedMeals)}` },
            { label: "Full Day M&IE", value: `$${formatNumber(meals)}` },
            { label: "First/Last Day M&IE", value: `$${formatNumber(firstLastDayMeals)}` },
            { label: "Average per Day", value: `$${formatNumber(totalPerDiem / travelDays)}` },
          ],
        };
      },
    },
    {
      id: "mealsBreakdown",
      name: "M&IE Breakdown",
      description: "Break down the meals and incidentals rate by meal",
      fields: [
        { name: "mieRate", label: "Total M&IE Rate", type: "number", placeholder: "e.g. 64", prefix: "$" },
        { name: "tier", label: "M&IE Tier", type: "select", options: [
          { label: "$59 tier", value: "59" },
          { label: "$64 tier", value: "64" },
          { label: "$69 tier", value: "69" },
          { label: "$74 tier", value: "74" },
          { label: "$79 tier", value: "79" },
        ], defaultValue: "64" },
        { name: "travelDays", label: "Total Travel Days", type: "number", placeholder: "e.g. 5" },
        { name: "mealsProvided", label: "Meals Provided by Employer/Conference", type: "number", placeholder: "e.g. 3", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const tier = parseInt(inputs.tier as string) || 64;
        const days = inputs.travelDays as number;
        const mealsProvided = (inputs.mealsProvided as number) || 0;
        if (!days) return null;
        const breakdowns: Record<number, { breakfast: number; lunch: number; dinner: number; incidental: number }> = {
          59: { breakfast: 13, lunch: 15, dinner: 26, incidental: 5 },
          64: { breakfast: 14, lunch: 16, dinner: 29, incidental: 5 },
          69: { breakfast: 16, lunch: 17, dinner: 31, incidental: 5 },
          74: { breakfast: 17, lunch: 18, dinner: 34, incidental: 5 },
          79: { breakfast: 18, lunch: 20, dinner: 36, incidental: 5 },
        };
        const bd = breakdowns[tier] || breakdowns[64];
        const totalMeals = (bd.breakfast + bd.lunch + bd.dinner) * days;
        const totalIncidentals = bd.incidental * days;
        const avgMealDeduction = (bd.breakfast + bd.lunch + bd.dinner) / 3;
        const adjustedTotal = totalMeals + totalIncidentals - (mealsProvided * avgMealDeduction);
        return {
          primary: { label: "Total M&IE Allowance", value: `$${formatNumber(adjustedTotal)}` },
          details: [
            { label: "Breakfast Allowance", value: `$${formatNumber(bd.breakfast)}/day` },
            { label: "Lunch Allowance", value: `$${formatNumber(bd.lunch)}/day` },
            { label: "Dinner Allowance", value: `$${formatNumber(bd.dinner)}/day` },
            { label: "Incidentals", value: `$${formatNumber(bd.incidental)}/day` },
            { label: "Total Meals (before adj)", value: `$${formatNumber(totalMeals + totalIncidentals)}` },
            { label: "Meals Provided Deduction", value: `$${formatNumber(mealsProvided * avgMealDeduction)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mileage-reimbursement-calculator", "employee-cost-calculator", "shipping-cost-calculator"],
  faq: [
    { question: "What is per diem?", answer: "Per diem (Latin for 'per day') is a daily allowance for travel expenses including lodging, meals, and incidental expenses (tips, fees). The GSA sets standard rates that vary by location. Per diem simplifies expense tracking and reimbursement." },
    { question: "What are the GSA per diem rates?", answer: "GSA rates vary by city. The standard CONUS rate is $107 for lodging and $64 for M&IE. High-cost cities like NYC, SF, and DC have much higher rates. Rates are updated annually on October 1st. Check gsa.gov for current rates." },
    { question: "Is per diem taxable?", answer: "Per diem paid at or below the federal rate is NOT taxable if the employee provides an expense report. If per diem exceeds the federal rate, the excess is taxable income. If no expense report is filed, the entire amount is taxable." },
  ],
  formula: "Total Per Diem = (Lodging Rate × Nights) + (M&IE Rate × Full Days) + (M&IE × 75% × First/Last Days) | First/Last day meals are typically 75% of the full M&IE rate",
};
