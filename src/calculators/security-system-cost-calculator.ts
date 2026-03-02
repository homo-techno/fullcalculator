import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const securitySystemCostCalculator: CalculatorDefinition = {
  slug: "security-system-cost-calculator",
  title: "Security System Cost Calculator",
  description: "Estimate the total cost of a home security system.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["security system cost","home security price"],
  variants: [{
    id: "standard",
    name: "Security System Cost",
    description: "Estimate the total cost of a home security system.",
    fields: [
      { name: "cameras", label: "Number of Cameras", type: "number", min: 0, max: 50, defaultValue: 4 },
      { name: "cameraCost", label: "Cost Per Camera ($)", type: "number", min: 20, max: 500, defaultValue: 100 },
      { name: "sensors", label: "Door/Window Sensors", type: "number", min: 0, max: 50, defaultValue: 8 },
      { name: "sensorCost", label: "Cost Per Sensor ($)", type: "number", min: 5, max: 100, defaultValue: 25 },
      { name: "monthlySub", label: "Monthly Monitoring ($)", type: "number", min: 0, max: 100, defaultValue: 30 },
      { name: "installFee", label: "Installation Fee ($)", type: "number", min: 0, max: 2000, defaultValue: 200 },
    ],
    calculate: (inputs) => {
      const cams = inputs.cameras as number;
      const camCost = inputs.cameraCost as number;
      const sens = inputs.sensors as number;
      const sensCost = inputs.sensorCost as number;
      const monthly = inputs.monthlySub as number;
      const install = inputs.installFee as number;
      const equipTotal = cams * camCost + sens * sensCost;
      const yearOne = equipTotal + install + monthly * 12;
      const yearlyAfter = monthly * 12;
      return {
        primary: { label: "First Year Cost", value: "$" + formatNumber(Math.round(yearOne)) },
        details: [
          { label: "Equipment Cost", value: "$" + formatNumber(Math.round(equipTotal)) },
          { label: "Installation Fee", value: "$" + formatNumber(Math.round(install)) },
          { label: "Annual Monitoring", value: "$" + formatNumber(Math.round(yearlyAfter)) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much does a home security system cost?", answer: "A basic system costs $200 to $600 for equipment plus $20 to $50 per month." },
    { question: "Is professional monitoring worth it?", answer: "Professional monitoring provides 24/7 response and may lower insurance costs." },
  ],
  formula: "Year 1 = Equipment + Install + Monthly x 12",
};
