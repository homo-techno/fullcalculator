import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landedCostCalculator: CalculatorDefinition = {
  slug: "landed-cost-calculator",
  title: "Landed Cost Calculator",
  description: "Calculate total landed cost of imported goods.",
  category: "Finance",
  categorySlug: "$",
  icon: "DollarSign",
  keywords: ["landed","cost","import","shipping","total"],
  variants: [{
    id: "standard",
    name: "Landed Cost",
    description: "Calculate total landed cost of imported goods.",
    fields: [
      { name: "productCost", label: "Product Cost ($)", type: "number", min: 1, max: 10000000, defaultValue: 10000 },
      { name: "shippingCost", label: "Shipping Cost ($)", type: "number", min: 0, max: 500000, defaultValue: 2000 },
      { name: "insurance", label: "Insurance ($)", type: "number", min: 0, max: 100000, defaultValue: 300 },
      { name: "customsDuty", label: "Customs Duty ($)", type: "number", min: 0, max: 1000000, defaultValue: 500 },
      { name: "handlingFees", label: "Handling Fees ($)", type: "number", min: 0, max: 50000, defaultValue: 250 },
      { name: "units", label: "Total Units", type: "number", min: 1, max: 1000000, defaultValue: 500 },
    ],
    calculate: (inputs) => {
    const productCost = inputs.productCost as number;
    const shippingCost = inputs.shippingCost as number;
    const insurance = inputs.insurance as number;
    const customsDuty = inputs.customsDuty as number;
    const handlingFees = inputs.handlingFees as number;
    const units = inputs.units as number;
    const totalLanded = productCost + shippingCost + insurance + customsDuty + handlingFees;
    const costPerUnit = totalLanded / units;
    const addonCosts = shippingCost + insurance + customsDuty + handlingFees;
    const addonPercent = (addonCosts / productCost) * 100;
    return {
      primary: { label: "Total Landed Cost", value: "$" + formatNumber(totalLanded) },
      details: [
        { label: "Cost Per Unit", value: "$" + formatNumber(costPerUnit) },
        { label: "Add-On Costs", value: "$" + formatNumber(addonCosts) },
        { label: "Add-On Percentage", value: formatNumber(addonPercent) + "%" },
        { label: "Product Cost", value: "$" + formatNumber(productCost) }
      ]
    };
  },
  }],
  relatedSlugs: ["customs-duty-calculator","cbm-calculator","ltl-freight-cost-calculator"],
  faq: [
    { question: "What is landed cost?", answer: "The total cost of a product including purchase, shipping, duty, and fees." },
    { question: "Why is landed cost important?", answer: "It gives the true cost of imported goods for accurate pricing and margins." },
  ],
  formula: "Landed Cost = Product + Shipping + Insurance + Duty + Handling",
};
