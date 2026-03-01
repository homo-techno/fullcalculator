import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fertilityByAgeCalculator: CalculatorDefinition = {
  slug: "fertility-by-age-calculator",
  title: "Fertility by Age Calculator",
  description: "Estimate fertility potential based on age, providing probability of conception per cycle and time-to-pregnancy estimates.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["fertility by age", "age fertility decline", "conception probability by age"],
  variants: [{
    id: "standard",
    name: "Fertility by Age",
    description: "Estimate fertility potential based on age, providing probability of conception per cycle and time-to-pregnancy estimates",
    fields: [
      { name: "age", label: "Current Age", type: "number", suffix: "years", min: 18, max: 50, defaultValue: 30 },
      { name: "cyclesPerYear", label: "Cycles Per Year", type: "number", min: 6, max: 13, defaultValue: 12 },
      { name: "healthStatus", label: "General Health", type: "select", options: [{value:"excellent",label:"Excellent"},{value:"good",label:"Good"},{value:"fair",label:"Fair"}], defaultValue: "good" },
    ],
    calculate: (inputs) => {
      const age = inputs.age as number;
      const cycles = inputs.cyclesPerYear as number;
      const health = inputs.healthStatus as string;
      if (!age || age <= 0 || !cycles) return null;
      const baseFertility: Record<number, number> = {};
      for (let a = 18; a <= 50; a++) {
        if (a <= 25) baseFertility[a] = 0.25;
        else if (a <= 30) baseFertility[a] = 0.25 - (a - 25) * 0.01;
        else if (a <= 35) baseFertility[a] = 0.20 - (a - 30) * 0.02;
        else if (a <= 40) baseFertility[a] = 0.10 - (a - 35) * 0.015;
        else baseFertility[a] = Math.max(0.01, 0.025 - (a - 40) * 0.003);
      }
      const baseRate = baseFertility[Math.min(Math.max(Math.round(age), 18), 50)] || 0.05;
      const healthMod: Record<string, number> = { excellent: 1.1, good: 1.0, fair: 0.85 };
      const adjRate = baseRate * (healthMod[health] || 1.0);
      const annualProb = 1 - Math.pow(1 - adjRate, cycles);
      const monthsToConceive = adjRate > 0 ? Math.round(1 / adjRate) : 0;
      return {
        primary: { label: "Conception Chance Per Cycle", value: formatNumber(Math.round(adjRate * 1000) / 10) + "%" },
        details: [
          { label: "Annual Conception Probability", value: formatNumber(Math.round(annualProb * 1000) / 10) + "%" },
          { label: "Estimated Months to Conceive", value: formatNumber(monthsToConceive) + " months" },
          { label: "Cycles Per Year", value: formatNumber(cycles) },
        ],
      };
    },
  }],
  relatedSlugs: ["implantation-date-calculator", "chances-of-twins-calculator"],
  faq: [
    { question: "At what age does fertility start to decline significantly?", answer: "Fertility begins a gradual decline after age 30 and drops more steeply after age 35. By age 40, the chance of conceiving per cycle is significantly lower than at age 25." },
    { question: "Can lifestyle factors improve fertility at older ages?", answer: "Maintaining a healthy weight, avoiding smoking and excessive alcohol, managing stress, and regular exercise can support fertility at any age, though they do not fully offset age-related decline." },
  ],
  formula: "Conception Rate Per Cycle = Base Fertility Rate x Health Modifier; Annual Probability = 1 - (1 - Cycle Rate) ^ Cycles Per Year",
};
