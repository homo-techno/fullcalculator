import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const intellectualPropertyValueCalculator: CalculatorDefinition = {
  slug: "intellectual-property-value-calculator",
  title: "Intellectual Property Value Calculator",
  description: "Estimate the value of intellectual property including patents, trademarks, and copyrights.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["IP valuation","intellectual property value","patent value","trademark value"],
  variants: [{
    id: "standard",
    name: "Intellectual Property Value",
    description: "Estimate the value of intellectual property including patents, trademarks, and copyrights.",
    fields: [
      { name: "ipType", label: "IP Type", type: "select", options: [{ value: "1", label: "Patent" }, { value: "2", label: "Trademark" }, { value: "3", label: "Copyright" }, { value: "4", label: "Trade Secret" }], defaultValue: "1" },
      { name: "annualRevenue", label: "Annual Revenue from IP ($)", type: "number", min: 0, max: 100000000, defaultValue: 500000 },
      { name: "remainingLife", label: "Remaining Useful Life (years)", type: "number", min: 1, max: 70, defaultValue: 10 },
      { name: "growthRate", label: "Annual Growth Rate (%)", type: "number", min: -20, max: 50, defaultValue: 5 },
      { name: "discountRate", label: "Discount Rate (%)", type: "number", min: 1, max: 30, defaultValue: 12 },
    ],
    calculate: (inputs) => {
    const ipType = inputs.ipType as string;
    const annualRevenue = inputs.annualRevenue as number;
    const remainingLife = inputs.remainingLife as number;
    const growthRate = inputs.growthRate as number;
    const discountRate = inputs.discountRate as number;
    const ipNames: Record<string, string> = { "1": "Patent", "2": "Trademark", "3": "Copyright", "4": "Trade Secret" };
    let totalValue = 0;
    for (let i = 1; i <= remainingLife; i++) {
      const futureRevenue = annualRevenue * Math.pow(1 + growthRate / 100, i);
      totalValue += futureRevenue / Math.pow(1 + discountRate / 100, i);
    }
    const royaltyRates: Record<string, number> = { "1": 0.05, "2": 0.03, "3": 0.04, "4": 0.06 };
    const royaltyValue = totalValue * (royaltyRates[ipType] || 0.05) * 10;
    return {
      primary: { label: "Estimated IP Value (Income Method)", value: "$" + formatNumber(totalValue) },
      details: [
        { label: "IP Type", value: ipNames[ipType] || "Patent" },
        { label: "First Year Revenue", value: "$" + formatNumber(annualRevenue) },
        { label: "Remaining Life", value: formatNumber(remainingLife) + " years" },
        { label: "Relief from Royalty Value", value: "$" + formatNumber(royaltyValue) }
      ]
    };
  },
  }],
  relatedSlugs: ["trademark-registration-cost-calculator","patent-filing-cost-calculator","copyright-registration-cost-calculator"],
  faq: [
    { question: "How is intellectual property valued?", answer: "IP is commonly valued using three approaches: the income method (discounted future cash flows), the market method (comparable transactions), and the cost method (cost to recreate)." },
    { question: "How long does a patent last?", answer: "Utility patents last 20 years from the filing date. Design patents last 15 years from the grant date. Maintenance fees are required to keep utility patents in force." },
    { question: "What affects IP value?", answer: "Key factors include remaining life, revenue generated, market exclusivity, enforceability, breadth of protection, and competitive landscape." },
  ],
  formula: "IP Value = Sum of [Annual Revenue x (1 + Growth)^n / (1 + Discount)^n] for each year",
};
