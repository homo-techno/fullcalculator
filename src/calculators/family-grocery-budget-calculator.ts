import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const familyGroceryBudgetCalculator: CalculatorDefinition = {
  slug: "family-grocery-budget-calculator",
  title: "Family Grocery Budget Calculator",
  description: "Calculate a realistic monthly grocery budget for your family based on household size, dietary preferences, and cost-saving strategies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["family grocery budget","food budget calculator","grocery spending","family food cost","meal planning budget"],
  variants: [{
    id: "standard",
    name: "Family Grocery Budget",
    description: "Calculate a realistic monthly grocery budget for your family based on household size, dietary preferences, and cost-saving strategies.",
    fields: [
      { name: "adults", label: "Number of Adults", type: "number", min: 1, max: 6, defaultValue: 2 },
      { name: "children", label: "Number of Children", type: "number", min: 0, max: 8, defaultValue: 2 },
      { name: "dietType", label: "Diet Type", type: "select", options: [{ value: "1.0", label: "Standard" }, { value: "1.15", label: "Mostly Organic" }, { value: "1.3", label: "Fully Organic" }, { value: "0.9", label: "Budget-Focused" }], defaultValue: "1.0" },
      { name: "mealPlanPercent", label: "Meals Cooked at Home (%)", type: "number", min: 30, max: 100, defaultValue: 75 },
      { name: "region", label: "Cost of Living Region", type: "select", options: [{ value: "0.85", label: "Low Cost Area" }, { value: "1.0", label: "Average Cost Area" }, { value: "1.2", label: "High Cost Area" }, { value: "1.4", label: "Very High Cost Area" }], defaultValue: "1.0" },
    ],
    calculate: (inputs) => {
    const adults = inputs.adults as number;
    const children = inputs.children as number;
    const dietType = inputs.dietType as number;
    const mealPlanPercent = inputs.mealPlanPercent as number;
    const region = inputs.region as number;
    const adultMonthly = 325;
    const childMonthly = 200;
    const baseMonthly = (adults * adultMonthly + children * childMonthly) * dietType * region;
    const cookedRatio = mealPlanPercent / 100;
    const adjustedMonthly = baseMonthly * (0.5 + 0.5 * cookedRatio);
    const weekly = adjustedMonthly / 4.33;
    const annual = adjustedMonthly * 12;
    const perPerson = adjustedMonthly / (adults + children);
    const dailyPerPerson = perPerson / 30.44;
    return {
      primary: { label: "Monthly Grocery Budget", value: "$" + formatNumber(Math.round(adjustedMonthly)) },
      details: [
        { label: "Weekly Budget", value: "$" + formatNumber(Math.round(weekly)) },
        { label: "Annual Budget", value: "$" + formatNumber(Math.round(annual)) },
        { label: "Per Person Monthly", value: "$" + formatNumber(Math.round(perPerson)) },
        { label: "Daily Per Person", value: "$" + formatNumber(Math.round(dailyPerPerson * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["family-vacation-budget-calculator","birthday-party-per-child-calculator","family-phone-plan-cost-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Base Monthly = (Adults x $325 + Children x $200) x Diet Multiplier x Region; Adjusted = Base x (0.5 + 0.5 x Home Cooking Ratio)",
};
