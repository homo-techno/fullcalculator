import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greenhouseEnergyCostCalculator: CalculatorDefinition = {
  slug: "greenhouse-energy-cost-calculator",
  title: "Greenhouse Energy Cost Calculator",
  description: "Estimate monthly and annual heating and cooling energy costs for a greenhouse based on dimensions, climate zone, and covering material.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["greenhouse energy cost","greenhouse heating cost","greenhouse operating cost"],
  variants: [{
    id: "standard",
    name: "Greenhouse Energy Cost",
    description: "Estimate monthly and annual heating and cooling energy costs for a greenhouse based on dimensions, climate zone, and covering material.",
    fields: [
      { name: "lengthFt", label: "Greenhouse Length (feet)", type: "number", min: 10, max: 500, defaultValue: 96 },
      { name: "widthFt", label: "Greenhouse Width (feet)", type: "number", min: 10, max: 100, defaultValue: 30 },
      { name: "coverType", label: "Covering Type", type: "select", options: [{ value: "1", label: "Single Poly" }, { value: "2", label: "Double Poly" }, { value: "3", label: "Polycarbonate" }, { value: "4", label: "Glass" }], defaultValue: "2" },
      { name: "heatingMonths", label: "Months Needing Heat", type: "number", min: 0, max: 12, defaultValue: 5 },
      { name: "fuelCostPerGal", label: "Propane Cost ($/gallon)", type: "number", min: 0.5, max: 8, defaultValue: 2.5 },
      { name: "avgTempDiff", label: "Avg Inside-Outside Temp Diff (F)", type: "number", min: 5, max: 80, defaultValue: 35 },
    ],
    calculate: (inputs) => {
      const len = inputs.lengthFt as number;
      const wid = inputs.widthFt as number;
      const ct = inputs.coverType as number;
      const hm = inputs.heatingMonths as number;
      const fc = inputs.fuelCostPerGal as number;
      const td = inputs.avgTempDiff as number;
      if (!len || !wid || !hm || !fc || !td) return null;
      var uFactor = ct == 1 ? 1.13 : ct == 2 ? 0.7 : ct == 3 ? 0.58 : 1.1;
      var wallHeight = 8;
      var surfaceArea = 2 * (len * wallHeight) + 2 * (wid * wallHeight) + len * wid * 1.2;
      var btuPerHour = Math.round(surfaceArea * uFactor * td);
      var btuPerMonth = btuPerHour * 24 * 30;
      var gallonsPerMonth = Math.round(btuPerMonth / 91500);
      var monthlyCost = Math.round(gallonsPerMonth * fc * 100) / 100;
      var annualCost = Math.round(monthlyCost * hm * 100) / 100;
      return {
        primary: { label: "Annual Heating Cost", value: "$" + formatNumber(annualCost) },
        details: [
          { label: "Monthly Heating Cost", value: "$" + formatNumber(monthlyCost) },
          { label: "BTU/Hour Heat Loss", value: formatNumber(btuPerHour) },
          { label: "Propane Per Month", value: formatNumber(gallonsPerMonth) + " gal" },
          { label: "Surface Area", value: formatNumber(Math.round(surfaceArea)) + " sq ft" },
        ],
      };
  },
  }],
  relatedSlugs: ["greenhouse-heating-calculator","farm-profit-margin-calculator"],
  faq: [
    { question: "How can I reduce greenhouse heating costs?", answer: "Use double-layer poly or polycarbonate covering, add thermal curtains, seal air leaks, use thermal mass like water barrels, and consider zone heating. Double poly can reduce costs by 30 to 40 percent versus single layer." },
    { question: "What temperature should a greenhouse be?", answer: "Most vegetables and flowers grow best at 65 to 75 degrees F during the day and 55 to 65 degrees F at night. Cool-season crops can be grown at 50 to 60 degrees F." },
  ],
  formula: "Heat Loss (BTU/hr) = Surface Area x U-Factor x Temperature Difference; Monthly Fuel = BTU/hr x 24 x 30 / BTU per Gallon; Annual Cost = Monthly Cost x Heating Months",
};
