import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacancyRateImpactCalculator: CalculatorDefinition = {
  slug: "vacancy-rate-impact-calculator",
  title: "Vacancy Rate Impact Calculator",
  description: "See how vacancy rates affect your rental property returns",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vacancy rate","rental vacancy","vacancy impact"],
  variants: [{
    id: "standard",
    name: "Vacancy Rate Impact",
    description: "See how vacancy rates affect your rental property returns",
    fields: [
      { name: "monthlyRent", label: "Monthly Rent ($)", type: "number", defaultValue: 2000, min: 0, step: 100 },
      { name: "vacancyRate", label: "Vacancy Rate (%)", type: "number", defaultValue: 8, min: 0, max: 50, step: 1 },
      { name: "monthlyExpenses", label: "Monthly Fixed Expenses ($)", type: "number", defaultValue: 1200, min: 0, step: 100 },
      { name: "propertyValue", label: "Property Value ($)", type: "number", defaultValue: 250000, min: 0, step: 10000 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const rent = inputs.monthlyRent as number || 2000;
      const vacancy = (inputs.vacancyRate as number || 8) / 100;
      const expenses = inputs.monthlyExpenses as number || 1200;
      const value = inputs.propertyValue as number || 250000;
      const annualGross = rent * 12;
      const vacancyLoss = annualGross * vacancy;
      const effectiveIncome = annualGross - vacancyLoss;
      const annualExpenses = expenses * 12;
      const netIncome = effectiveIncome - annualExpenses;
      const netWithNoVacancy = annualGross - annualExpenses;
      const incomeLost = netWithNoVacancy - netIncome;
      const capRate = (netIncome / value) * 100;
      return {
        primary: { label: "Annual Vacancy Loss", value: "$" + formatNumber(Math.round(vacancyLoss)) },
        details: [
          { label: "Effective Annual Income", value: "$" + formatNumber(Math.round(effectiveIncome)) },
          { label: "Net Income (with vacancy)", value: "$" + formatNumber(Math.round(netIncome)) },
          { label: "Net Income (no vacancy)", value: "$" + formatNumber(Math.round(netWithNoVacancy)) },
          { label: "Cap Rate", value: formatNumber(Math.round(capRate * 100) / 100) + "%" }
        ]
      };
    },
  }],
  relatedSlugs: ["rental-cash-flow-calculator"],
  faq: [
    { question: "What is a normal vacancy rate?", answer: "Residential vacancy rates typically range from 5-10%. Urban areas may be lower, rural areas higher." },
    { question: "How does vacancy affect returns?", answer: "Each percent of vacancy directly reduces gross income. An 8% vacancy on $2000/mo rent loses $1920/yr." },
  ],
  formula: "Vacancy Loss = Annual Rent x Vacancy Rate. Net = Effective Income - Expenses.",
};
