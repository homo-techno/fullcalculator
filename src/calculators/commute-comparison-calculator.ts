import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const commuteComparisonCalculator: CalculatorDefinition = {
  slug: "commute-comparison-calculator",
  title: "Commute Comparison Calculator",
  description: "Compare commute costs between two options.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["commute","comparison","driving","transit"],
  variants: [{
    id: "standard",
    name: "Commute Comparison",
    description: "Compare commute costs between two options.",
    fields: [
      { name: "driveMiles", label: "Driving Distance (miles one way)", type: "number", min: 1, max: 100, defaultValue: 20 },
      { name: "mpg", label: "Vehicle MPG", type: "number", min: 10, max: 60, defaultValue: 28 },
      { name: "gasPrice", label: "Gas Price ($/gallon)", type: "number", min: 1, max: 8, defaultValue: 3.5 },
      { name: "transitMonthly", label: "Monthly Transit Pass ($)", type: "number", min: 0, max: 500, defaultValue: 100 },
    ],
    calculate: (inputs) => {
    const driveMiles = inputs.driveMiles as number;
    const mpg = inputs.mpg as number;
    const gasPrice = inputs.gasPrice as number;
    const transitMonthly = inputs.transitMonthly as number;
    const dailyGasCost = (driveMiles * 2 / mpg) * gasPrice;
    const monthlyDriveCost = dailyGasCost * 22;
    const yearlyDriveCost = monthlyDriveCost * 12;
    const yearlyTransitCost = transitMonthly * 12;
    const savings = yearlyDriveCost - yearlyTransitCost;
    return { primary: { label: "Monthly Driving Cost", value: "$" + formatNumber(monthlyDriveCost) }, details: [{ label: "Daily Gas Cost", value: "$" + formatNumber(dailyGasCost) }, { label: "Yearly Driving Cost", value: "$" + formatNumber(yearlyDriveCost) }, { label: "Yearly Transit Cost", value: "$" + formatNumber(yearlyTransitCost) }, { label: "Annual Savings with Transit", value: "$" + formatNumber(savings) }] };
  },
  }],
  relatedSlugs: ["relocation-cost-of-living-calculator","neighborhood-affordability-calculator","moving-cost-calculator"],
  faq: [
    { question: "Is driving or transit cheaper?", answer: "Transit is usually cheaper if your commute is over 15 miles." },
    { question: "What costs are not included in driving?", answer: "Parking, insurance, maintenance, and depreciation." },
    { question: "How many work days per month?", answer: "This calculator uses 22 work days per month." },
  ],
  formula: "MonthlyDrive = (Miles * 2 / MPG) * GasPrice * 22",
};
