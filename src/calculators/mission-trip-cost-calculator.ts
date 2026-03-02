import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const missionTripCostCalculator: CalculatorDefinition = {
  slug: "mission-trip-cost-calculator",
  title: "Mission Trip Cost Calculator",
  description: "Estimate the total budget for a church mission trip.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mission trip","church","travel","budget"],
  variants: [{
    id: "standard",
    name: "Mission Trip Cost",
    description: "Estimate the total budget for a church mission trip.",
    fields: [
      { name: "travelers", label: "Number of Travelers", type: "number", min: 1, max: 100, defaultValue: 12 },
      { name: "airfare", label: "Airfare Per Person ($)", type: "number", min: 0, max: 5000, defaultValue: 800 },
      { name: "days", label: "Trip Duration (days)", type: "number", min: 1, max: 60, defaultValue: 10 },
      { name: "dailyCost", label: "Daily Expenses Per Person ($)", type: "number", min: 10, max: 300, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const travelers = inputs.travelers as number;
    const airfare = inputs.airfare as number;
    const days = inputs.days as number;
    const dailyCost = inputs.dailyCost as number;
    const totalAirfare = travelers * airfare;
    const totalDaily = travelers * days * dailyCost;
    const insurance = travelers * 50;
    const supplies = travelers * 100;
    const totalCost = totalAirfare + totalDaily + insurance + supplies;
    const costPerPerson = totalCost / travelers;
    return { primary: { label: "Total Trip Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "Total Airfare", value: "$" + formatNumber(totalAirfare) }, { label: "Living Expenses", value: "$" + formatNumber(totalDaily) }, { label: "Travel Insurance", value: "$" + formatNumber(insurance) }, { label: "Supplies & Materials", value: "$" + formatNumber(supplies) }, { label: "Cost Per Person", value: "$" + formatNumber(costPerPerson) }] };
  },
  }],
  relatedSlugs: ["church-budget-calculator","church-tithe-calculator","potluck-food-calculator"],
  faq: [
    { question: "How much does a mission trip typically cost?", answer: "Domestic trips cost $500 to $2,000; international trips run $1,500 to $5,000." },
    { question: "What expenses are included in a mission trip?", answer: "Airfare, lodging, meals, supplies, insurance, and local transport." },
    { question: "Can mission trip costs be tax deductible?", answer: "Personal expenses on mission trips may be deductible if through a church." },
  ],
  formula: "TotalCost = Airfare + DailyExpenses + Insurance + Supplies",
};
