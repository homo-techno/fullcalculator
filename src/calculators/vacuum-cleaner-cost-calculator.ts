import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vacuumCleanerCostCalculator: CalculatorDefinition = {
  slug: "vacuum-cleaner-cost-calculator",
  title: "Vacuum Cleaner Cost Calculator",
  description: "Calculate the total ownership cost of a vacuum cleaner including purchase price, bags, filters, and energy.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["vacuum cleaner cost", "vacuum ownership cost", "vacuum comparison"],
  variants: [{
    id: "standard",
    name: "Vacuum Cleaner Cost",
    description: "Calculate the total ownership cost of a vacuum cleaner including purchase price, bags, filters, and energy",
    fields: [
      { name: "purchasePrice", label: "Purchase Price", type: "number", prefix: "$", min: 50, max: 2000, defaultValue: 300 },
      { name: "vacuumType", label: "Vacuum Type", type: "select", options: [{value:"upright",label:"Upright (Bagged)"},{value:"bagless",label:"Upright (Bagless)"},{value:"canister",label:"Canister"},{value:"robot",label:"Robot Vacuum"}], defaultValue: "bagless" },
      { name: "usePerWeek", label: "Uses per Week", type: "number", min: 1, max: 7, defaultValue: 2 },
      { name: "yearsOwned", label: "Expected Lifespan", type: "number", suffix: "years", min: 1, max: 20, defaultValue: 7 },
    ],
    calculate: (inputs) => {
      const price = inputs.purchasePrice as number;
      const type = inputs.vacuumType as string;
      const uses = inputs.usePerWeek as number;
      const years = inputs.yearsOwned as number;
      if (!price || !uses || !years) return null;
      const annualBags = type === "upright" ? uses * 52 / 4 * 2 : 0;
      const annualFilters = type === "robot" ? 40 : 20;
      const annualBelt = type === "robot" ? 0 : 8;
      const annualEnergy = uses * 52 * 0.5 * 0.13;
      const annualMaint = annualBags + annualFilters + annualBelt + annualEnergy;
      const totalCost = Math.round(price + annualMaint * years);
      const costPerYear = Math.round(totalCost / years);
      return {
        primary: { label: "Total Ownership Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cost per Year", value: "$" + formatNumber(costPerYear) },
          { label: "Annual Maintenance", value: "$" + formatNumber(Math.round(annualMaint)) },
          { label: "Lifespan", value: years + " years" },
        ],
      };
    },
  }],
  relatedSlugs: ["lightbulb-comparison-calculator", "household-chemical-cost-calculator"],
  faq: [
    { question: "How long does a vacuum cleaner last?", answer: "A quality vacuum cleaner lasts 5-10 years with proper maintenance. Robot vacuums typically last 4-6 years while commercial models can last 10+ years." },
    { question: "Are bagless vacuums cheaper to own?", answer: "Bagless vacuums save on bag costs but still need filter replacements. Over the lifetime, the cost difference is modest at about $50-$100." },
  ],
  formula: "Total Cost = Purchase Price + (Annual Maintenance x Years)",
};
