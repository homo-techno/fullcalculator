import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gapYearBudgetCalculator: CalculatorDefinition = {
  slug: "gap-year-budget-calculator",
  title: "Gap Year Budget Calculator",
  description: "Plan and estimate the costs of a gap year including travel, housing, insurance, and activities.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gap year cost", "gap year budget", "year off planning"],
  variants: [{
    id: "standard",
    name: "Gap Year Budget",
    description: "Plan and estimate the costs of a gap year including travel, housing, insurance, and activities",
    fields: [
      { name: "months", label: "Gap Year Duration", type: "number", suffix: "months", min: 1, max: 18, defaultValue: 12 },
      { name: "destination", label: "Destination Type", type: "select", options: [{value:"domestic",label:"Domestic"},{value:"europe",label:"Europe/Developed"},{value:"asia",label:"Asia/South America"},{value:"mixed",label:"Mixed Travel"}], defaultValue: "mixed" },
      { name: "style", label: "Travel Style", type: "select", options: [{value:"budget",label:"Budget/Hostel"},{value:"moderate",label:"Moderate"},{value:"comfortable",label:"Comfortable"}], defaultValue: "moderate" },
      { name: "flights", label: "Number of Flights", type: "number", min: 1, max: 20, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const months = inputs.months as number;
      const dest = inputs.destination as string;
      const style = inputs.style as string;
      const flights = inputs.flights as number;
      if (!months || months <= 0) return null;
      const dailyCost: Record<string, Record<string, number>> = {
        domestic: { budget: 50, moderate: 100, comfortable: 175 },
        europe: { budget: 60, moderate: 120, comfortable: 200 },
        asia: { budget: 30, moderate: 60, comfortable: 120 },
        mixed: { budget: 45, moderate: 90, comfortable: 160 }
      };
      const daily = (dailyCost[dest] || dailyCost.mixed)[style] || 90;
      const livingCost = daily * months * 30;
      const flightCost = flights * 450;
      const insurance = months * 120;
      const total = livingCost + flightCost + insurance;
      return {
        primary: { label: "Total Gap Year Budget", value: "$" + formatNumber(Math.round(total)) },
        details: [
          { label: "Daily Budget", value: "$" + formatNumber(daily) },
          { label: "Living Costs", value: "$" + formatNumber(Math.round(livingCost)) },
          { label: "Flights", value: "$" + formatNumber(Math.round(flightCost)) },
          { label: "Travel Insurance", value: "$" + formatNumber(Math.round(insurance)) },
        ],
      };
    },
  }],
  relatedSlugs: ["student-housing-calculator", "college-comparison-calculator"],
  faq: [
    { question: "How much does a gap year cost?", answer: "A gap year typically costs $10,000-$30,000 depending on destinations and travel style. Budget travelers can manage on less." },
    { question: "How do I fund a gap year?", answer: "Common funding sources include savings, part-time work, gap year scholarships, and working holiday programs abroad." },
  ],
  formula: "Total = (Daily Cost x 30 x Months) + (Flights x Avg Fare) + (Months x Insurance)",
};
