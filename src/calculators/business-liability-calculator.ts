import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const businessLiabilityCalculator: CalculatorDefinition = {
  slug: "business-liability-calculator",
  title: "Business Liability Insurance Calculator",
  description: "Free business liability insurance needs estimator. Calculate recommended coverage limits based on revenue and industry risk.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["business liability insurance calculator", "commercial insurance calculator", "business insurance needs estimator"],
  variants: [{
    id: "standard",
    name: "Business Liability Insurance",
    description: "Free business liability insurance needs estimator",
    fields: [
      { name: "revenue", label: "Annual Revenue", type: "number", prefix: "$", min: 0 },
      { name: "employees", label: "Number of Employees", type: "number", min: 0, defaultValue: 1 },
      { name: "industry", label: "Industry Risk Level", type: "select", options: [{ label: "Low (consulting, IT) - 1x", value: "1" }, { label: "Medium (retail, food) - 2x", value: "2" }, { label: "High (construction, manufacturing) - 3x", value: "3" }, { label: "Very High (healthcare, hazmat) - 4x", value: "4" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
      const revenue = inputs.revenue as number;
      const employees = inputs.employees as number;
      const risk = parseFloat(inputs.industry as string);
      if (!revenue || revenue <= 0) return null;
      const baseLimit = Math.max(1000000, revenue);
      const adjustedLimit = baseLimit * risk;
      const employeeRisk = employees * 50000;
      const recommended = Math.min(adjustedLimit + employeeRisk, 10000000);
      const estimatedPremium = recommended * 0.003 * risk;
      return {
        primary: { label: "Recommended Coverage", value: "$" + formatNumber(recommended) },
        details: [
          { label: "Base (revenue or $1M min)", value: "$" + formatNumber(baseLimit) },
          { label: "Risk-adjusted limit", value: "$" + formatNumber(adjustedLimit) },
          { label: "Employee risk add-on", value: "$" + formatNumber(employeeRisk) },
          { label: "Estimated annual premium", value: "$" + formatNumber(estimatedPremium) },
        ],
        note: "General liability typically covers bodily injury, property damage, and advertising injury. Consider umbrella policy for coverage above $1-2M.",
      };
    },
  }],
  relatedSlugs: ["self-employment-tax-calculator", "employee-cost-calculator"],
  faq: [
    { question: "How much business liability insurance do I need?", answer: "Minimum $1M per occurrence is standard. Higher-risk industries (construction, healthcare) and larger revenues require $2-5M+. Consider an umbrella policy." },
    { question: "What does general liability insurance cover?", answer: "Third-party bodily injury, property damage, personal/advertising injury, medical payments, and legal defense costs." },
  ],
  formula: "Coverage = MAX($1M, Revenue) × Industry Risk + Employees × $50K",
};
