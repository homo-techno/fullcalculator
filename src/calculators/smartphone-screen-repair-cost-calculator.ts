import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const smartphoneScreenRepairCostCalculator: CalculatorDefinition = {
  slug: "smartphone-screen-repair-cost-calculator",
  title: "Smartphone Screen Repair Cost Calculator",
  description: "Estimate the cost of repairing a cracked or broken smartphone screen based on phone brand, model tier, and repair method to help you decide between DIY and professional service.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["smartphone screen repair cost","phone screen replacement","cracked screen fix price","phone repair estimate"],
  variants: [{
    id: "standard",
    name: "Smartphone Screen Repair Cost",
    description: "Estimate the cost of repairing a cracked or broken smartphone screen based on phone brand, model tier, and repair method to help you decide between DIY and professional service.",
    fields: [
      { name: "phoneBrand", label: "Phone Brand", type: "select", options: [{ value: "1", label: "Apple iPhone" }, { value: "2", label: "Samsung Galaxy" }, { value: "3", label: "Google Pixel" }, { value: "4", label: "OnePlus" }, { value: "5", label: "Other Android" }], defaultValue: "1" },
      { name: "modelTier", label: "Model Tier", type: "select", options: [{ value: "1", label: "Budget" }, { value: "2", label: "Mid-Range" }, { value: "3", label: "Flagship" }, { value: "4", label: "Ultra/Pro Max" }], defaultValue: "3" },
      { name: "repairMethod", label: "Repair Method", type: "select", options: [{ value: "1", label: "Official Service Center" }, { value: "2", label: "Third-Party Shop" }, { value: "3", label: "DIY Repair" }], defaultValue: "2" },
      { name: "hasInsurance", label: "Has Insurance/Protection Plan", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const brand = parseInt(inputs.phoneBrand as string);
    const tier = parseInt(inputs.modelTier as string);
    const method = parseInt(inputs.repairMethod as string);
    const insured = parseInt(inputs.hasInsurance as string);
    const baseCosts = { 1: [129, 199, 279, 379], 2: [99, 169, 249, 329], 3: [89, 149, 219, 279], 4: [79, 129, 199, 249], 5: [69, 109, 179, 229] };
    const brandCosts = baseCosts[brand] || baseCosts[5];
    const baseCost = brandCosts[tier - 1] || brandCosts[2];
    const methodMultiplier = { 1: 1.0, 2: 0.7, 3: 0.4 };
    const repairCost = Math.round(baseCost * (methodMultiplier[method] || 0.7));
    const insuranceDeductible = insured === 1 ? Math.round(repairCost * 0.3) : repairCost;
    const savings = repairCost - insuranceDeductible;
    const phoneValue = tier * 250 + brand * 50;
    const repairPercent = Math.round((insuranceDeductible / phoneValue) * 100);
    return {
      primary: { label: "Estimated Repair Cost", value: "$" + formatNumber(insuranceDeductible) },
      details: [
        { label: "Full Price Without Insurance", value: "$" + formatNumber(repairCost) },
        { label: "Insurance Savings", value: "$" + formatNumber(savings) },
        { label: "Repair as % of Phone Value", value: formatNumber(repairPercent) + "%" },
        { label: "Recommendation", value: repairPercent > 50 ? "Consider upgrading" : "Repair is worthwhile" }
      ]
    };
  },
  }],
  relatedSlugs: ["electric-bill-device-cost-calculator","phone-battery-health-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Repair Cost = Base Cost (by brand and tier) x Method Multiplier; Insurance Cost = Repair Cost x Deductible Rate (30%); Repair % of Value = Insurance Cost / Estimated Phone Value x 100",
};
