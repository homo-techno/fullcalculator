import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ledConversionSavingsCalculator: CalculatorDefinition = {
  slug: "led-conversion-savings-calculator",
  title: "LED Conversion Savings Calculator",
  description: "Calculate how much you can save by replacing traditional light bulbs with LED bulbs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["LED savings", "LED bulb conversion", "light bulb upgrade savings"],
  variants: [{
    id: "standard",
    name: "LED Conversion Savings",
    description: "Calculate how much you can save by replacing traditional light bulbs with LED bulbs",
    fields: [
      { name: "bulbCount", label: "Number of Bulbs to Replace", type: "number", suffix: "bulbs", min: 1, max: 200, defaultValue: 20 },
      { name: "hoursPerDay", label: "Average Daily Use per Bulb", type: "number", suffix: "hours", min: 1, max: 24, defaultValue: 5 },
      { name: "electricityRate", label: "Electricity Rate", type: "number", prefix: "$", suffix: "/kWh", min: 0.01, max: 1, step: 0.01, defaultValue: 0.13 },
      { name: "oldBulbType", label: "Current Bulb Type", type: "select", options: [{value:"incandescent",label:"Incandescent (60W)"},{value:"halogen",label:"Halogen (43W)"},{value:"cfl",label:"CFL (13W)"}], defaultValue: "incandescent" },
    ],
    calculate: (inputs) => {
      const bulbs = inputs.bulbCount as number;
      const hours = inputs.hoursPerDay as number;
      const rate = inputs.electricityRate as number;
      const oldType = inputs.oldBulbType as string;
      if (!bulbs || !hours) return null;
      const oldWatts: Record<string, number> = { incandescent: 60, halogen: 43, cfl: 13 };
      const ledWatts = 9;
      const oldW = oldWatts[oldType] || 60;
      const savingsPerBulbPerYear = (oldW - ledWatts) / 1000 * hours * 365 * rate;
      const totalAnnualSavings = savingsPerBulbPerYear * bulbs;
      const ledCost = bulbs * 3;
      const paybackMonths = ledCost / (totalAnnualSavings / 12);
      const kwhSaved = (oldW - ledWatts) / 1000 * hours * 365 * bulbs;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(totalAnnualSavings * 100) / 100) },
        details: [
          { label: "Energy Saved per Year", value: formatNumber(Math.round(kwhSaved)) + " kWh" },
          { label: "LED Upgrade Cost", value: "$" + formatNumber(ledCost) },
          { label: "Payback Period", value: formatNumber(Math.round(paybackMonths * 10) / 10) + " months" },
        ],
      };
    },
  }],
  relatedSlugs: ["home-energy-score-calculator", "bicycle-commute-savings-calculator"],
  faq: [
    { question: "How much can LED bulbs save on electricity?", answer: "LED bulbs use 75 to 80 percent less energy than incandescent bulbs. A typical household can save $100 to $300 per year by switching all bulbs to LED." },
    { question: "How long do LED bulbs last?", answer: "Most LED bulbs last 25,000 to 50,000 hours, which is 15 to 25 times longer than traditional incandescent bulbs." },
  ],
  formula: "Annual Savings = Bulbs x (Old Watts - LED Watts) / 1000 x Hours/Day x 365 x Rate",
};
