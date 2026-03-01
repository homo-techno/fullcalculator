import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const energyTaxCreditCalculator: CalculatorDefinition = {
  slug: "energy-tax-credit-calculator",
  title: "Energy Tax Credit Calculator",
  description: "Estimate the federal tax credits available for energy-efficient home improvements and renewable energy installations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["energy tax credit", "solar tax credit", "energy efficiency tax credit"],
  variants: [{
    id: "standard",
    name: "Energy Tax Credit",
    description: "Estimate the federal tax credits available for energy-efficient home improvements and renewable energy installations",
    fields: [
      { name: "improvementType", label: "Improvement Type", type: "select", options: [{value:"solar",label:"Solar Panels"},{value:"heatpump",label:"Heat Pump"},{value:"insulation",label:"Insulation and Windows"},{value:"battery",label:"Battery Storage"}], defaultValue: "solar" },
      { name: "totalCost", label: "Total Project Cost", type: "number", prefix: "$", min: 500, max: 200000, step: 500, defaultValue: 25000 },
      { name: "taxLiability", label: "Expected Tax Liability", type: "number", prefix: "$", min: 0, max: 200000, step: 500, defaultValue: 10000 },
    ],
    calculate: (inputs) => {
      const type = inputs.improvementType as string;
      const cost = inputs.totalCost as number;
      const liability = inputs.taxLiability as number;
      if (!cost || cost <= 0) return null;
      let creditRate = 0;
      let maxCredit = Infinity;
      if (type === "solar" || type === "battery") {
        creditRate = 0.30;
      } else if (type === "heatpump") {
        creditRate = 0.30;
        maxCredit = 2000;
      } else {
        creditRate = 0.30;
        maxCredit = 1200;
      }
      const rawCredit = cost * creditRate;
      const credit = Math.min(rawCredit, maxCredit);
      const usableCredit = Math.min(credit, liability || credit);
      const carryForward = credit - usableCredit;
      const effectiveDiscount = (credit / cost) * 100;
      return {
        primary: { label: "Estimated Tax Credit", value: "$" + formatNumber(Math.round(credit)) },
        details: [
          { label: "Credit Rate", value: formatNumber(creditRate * 100) + "%" },
          { label: "Usable This Year", value: "$" + formatNumber(Math.round(usableCredit)) },
          { label: "Effective Discount", value: formatNumber(Math.round(effectiveDiscount * 10) / 10) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["adoption-tax-credit-calculator", "standard-deduction-calculator"],
  faq: [
    { question: "What is the federal solar tax credit percentage?", answer: "The federal solar Investment Tax Credit (ITC) is 30 percent of the total system cost for installations through 2032. This includes solar panels, inverters, mounting equipment, and installation labor." },
    { question: "Can energy tax credits be carried forward?", answer: "The residential clean energy credit (for solar, wind, and geothermal) can be carried forward to future tax years if the credit exceeds your tax liability. The energy efficient home improvement credit cannot be carried forward." },
  ],
  formula: "Tax Credit = Project Cost x Credit Rate (30%); subject to annual maximums for certain improvement types",
};
