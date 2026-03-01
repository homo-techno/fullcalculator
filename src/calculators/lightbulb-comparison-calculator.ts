import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lightbulbComparisonCalculator: CalculatorDefinition = {
  slug: "lightbulb-comparison-calculator",
  title: "Lightbulb Comparison Calculator",
  description: "Compare the total cost of LED, CFL, and incandescent bulbs including purchase price and energy usage.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lightbulb comparison", "LED vs CFL", "light bulb cost"],
  variants: [{
    id: "standard",
    name: "Lightbulb Comparison",
    description: "Compare the total cost of LED, CFL, and incandescent bulbs including purchase price and energy usage",
    fields: [
      { name: "bulbCount", label: "Number of Bulbs", type: "number", min: 1, max: 100, defaultValue: 20 },
      { name: "hoursPerDay", label: "Hours On per Day", type: "number", min: 1, max: 24, defaultValue: 5 },
      { name: "electricRate", label: "Electric Rate", type: "number", suffix: "cents/kWh", min: 5, max: 50, defaultValue: 13 },
      { name: "years", label: "Years to Compare", type: "number", min: 1, max: 20, defaultValue: 10 },
    ],
    calculate: (inputs) => {
      const count = inputs.bulbCount as number;
      const hours = inputs.hoursPerDay as number;
      const rate = inputs.electricRate as number;
      const years = inputs.years as number;
      if (!count || !hours || !rate || !years) return null;
      const annualHours = hours * 365;
      const ledWatts = 9; const ledLife = 25000; const ledPrice = 3;
      const cflWatts = 13; const cflLife = 10000; const cflPrice = 2;
      const incWatts = 60; const incLife = 1000; const incPrice = 1;
      const calcCost = (watts: number, life: number, price: number) => {
        const replacements = Math.ceil((annualHours * years) / life);
        const bulbCost = replacements * price * count;
        const energyCost = (watts / 1000) * annualHours * years * count * (rate / 100);
        return Math.round(bulbCost + energyCost);
      };
      const ledTotal = calcCost(ledWatts, ledLife, ledPrice);
      const cflTotal = calcCost(cflWatts, cflLife, cflPrice);
      const incTotal = calcCost(incWatts, incLife, incPrice);
      const savings = incTotal - ledTotal;
      return {
        primary: { label: "LED Savings vs Incandescent", value: "$" + formatNumber(savings) },
        details: [
          { label: "LED Total Cost", value: "$" + formatNumber(ledTotal) },
          { label: "CFL Total Cost", value: "$" + formatNumber(cflTotal) },
          { label: "Incandescent Total Cost", value: "$" + formatNumber(incTotal) },
        ],
      };
    },
  }],
  relatedSlugs: ["air-filter-schedule-calculator", "household-chemical-cost-calculator"],
  faq: [
    { question: "Are LED bulbs worth the higher price?", answer: "Yes, LED bulbs use 85% less energy than incandescent bulbs and last 25 times longer. The energy savings pay for the higher upfront cost within a few months." },
    { question: "How much can I save by switching to LED?", answer: "Switching 20 bulbs from incandescent to LED saves approximately $100-$200 per year in electricity costs depending on usage and local rates." },
  ],
  formula: "Total Cost = (Replacements x Bulb Price x Count) + (Watts/1000 x Hours x Years x Count x Rate)",
};
