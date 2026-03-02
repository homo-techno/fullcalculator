import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tanklessWaterHeaterSavingsCalculator: CalculatorDefinition = {
  slug: "tankless-water-heater-savings-calculator",
  title: "Tankless Water Heater Savings Calculator",
  description: "Compare tankless versus tank water heater costs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tankless savings","tankless vs tank"],
  variants: [{
    id: "standard",
    name: "Tankless Water Heater Savings",
    description: "Compare tankless versus tank water heater costs.",
    fields: [
      { name: "tankAnnual", label: "Tank Annual Cost ($)", type: "number", min: 50, max: 3000, defaultValue: 500 },
      { name: "tanklessAnnual", label: "Tankless Annual Cost ($)", type: "number", min: 50, max: 3000, defaultValue: 350 },
      { name: "installDiff", label: "Extra Install Cost ($)", type: "number", min: 0, max: 10000, defaultValue: 1500 },
    ],
    calculate: (inputs) => {
      const tank = inputs.tankAnnual as number;
      const tankless = inputs.tanklessAnnual as number;
      const install = inputs.installDiff as number;
      const annual = tank - tankless;
      const payback = annual > 0 ? install / annual : 0;
      const tenYear = annual * 10 - install;
      return {
        primary: { label: "Annual Savings", value: "$" + formatNumber(Math.round(annual)) },
        details: [
          { label: "Payback Period", value: payback > 0 ? formatNumber(Math.round(payback * 10) / 10) + " years" : "No savings" },
          { label: "10-Year Net Savings", value: "$" + formatNumber(Math.round(tenYear)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How long do tankless water heaters last?", answer: "Tankless water heaters typically last 20 or more years." },
    { question: "Are tankless heaters worth it?", answer: "They are worth it if your payback period is under 5 years." },
  ],
  formula: "Annual Savings = Tank Cost - Tankless Cost",
};
