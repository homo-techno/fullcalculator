import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaGratuityCalculator: CalculatorDefinition = {
  slug: "india-gratuity-calculator",
  title: "India Gratuity Calculator",
  description: "Free gratuity calculator for India. Calculate gratuity amount based on years of service and last drawn salary.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["gratuity calculator india", "gratuity calculation", "gratuity amount calculator"],
  variants: [{
    id: "standard",
    name: "India Gratuity",
    description: "Free gratuity calculator for India",
    fields: [
      { name: "salary", label: "Last Drawn Salary (Basic + DA)", type: "number", prefix: "₹", min: 0 },
      { name: "years", label: "Years of Service", type: "number", min: 5, max: 50 },
    ],
    calculate: (inputs) => {
      const salary = inputs.salary as number;
      const years = inputs.years as number;
      if (!salary || !years || years < 5) return null;
      const gratuity = Math.min(years * salary * 15 / 26, 2000000);
      const taxFree = Math.min(gratuity, 2000000);
      return {
        primary: { label: "Gratuity Amount", value: "₹" + formatNumber(gratuity) },
        details: [
          { label: "Tax-free limit", value: "₹20,00,000" },
          { label: "Tax-free amount", value: "₹" + formatNumber(taxFree) },
          { label: "Years of service", value: String(years) },
          { label: "Last drawn salary", value: "₹" + formatNumber(salary) },
        ],
        note: "Minimum 5 years of continuous service required. Gratuity = n × salary × 15/26.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is gratuity calculated in India?", answer: "Gratuity = (Years of service × Last drawn salary × 15) / 26. Minimum 5 years of service required. Tax exemption up to ₹20 lakh." },
    { question: "Is gratuity taxable?", answer: "Gratuity is tax-free up to ₹20,00,000. Any amount above this limit is taxable as per your income tax slab." },
  ],
  formula: "Gratuity = Years × Last Salary × 15 / 26 (max ₹20,00,000 tax-free)",
};
