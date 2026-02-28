import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaHraCalculator: CalculatorDefinition = {
  slug: "india-hra-calculator",
  title: "India HRA Exemption Calculator",
  description: "Free HRA exemption calculator for India. Calculate your House Rent Allowance tax exemption under the old regime.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["hra calculator", "hra exemption calculator india", "house rent allowance calculator"],
  variants: [{
    id: "standard",
    name: "India HRA Exemption",
    description: "Free HRA exemption calculator for India",
    fields: [
      { name: "basic", label: "Basic Salary (monthly)", type: "number", prefix: "₹", min: 0 },
      { name: "da", label: "Dearness Allowance (monthly)", type: "number", prefix: "₹", min: 0, defaultValue: 0 },
      { name: "hra", label: "HRA Received (monthly)", type: "number", prefix: "₹", min: 0 },
      { name: "rent", label: "Rent Paid (monthly)", type: "number", prefix: "₹", min: 0 },
      { name: "metro", label: "City", type: "select", options: [{ label: "Metro (Delhi/Mumbai/Kolkata/Chennai)", value: "50" }, { label: "Non-Metro", value: "40" }], defaultValue: "50" },
    ],
    calculate: (inputs) => {
      const basic = inputs.basic as number;
      const da = inputs.da as number || 0;
      const hra = inputs.hra as number;
      const rent = inputs.rent as number;
      const metroRate = parseFloat(inputs.metro as string) / 100;
      if (!basic || !hra || !rent) return null;
      const salary = basic + da;
      const a = hra;
      const b = salary * metroRate;
      const c = Math.max(0, rent - salary * 0.10);
      const exempt = Math.min(a, b, c);
      const taxable = hra - exempt;
      return {
        primary: { label: "HRA Exemption", value: "₹" + formatNumber(exempt) + "/month" },
        details: [
          { label: "Actual HRA received", value: "₹" + formatNumber(a) },
          { label: metroRate === 0.5 ? "50% of salary" : "40% of salary", value: "₹" + formatNumber(b) },
          { label: "Rent - 10% of salary", value: "₹" + formatNumber(c) },
          { label: "Taxable HRA", value: "₹" + formatNumber(taxable) },
          { label: "Annual exemption", value: "₹" + formatNumber(exempt * 12) },
        ],
        note: "HRA exemption is available only under the old tax regime.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is HRA exemption calculated?", answer: "HRA exemption is the minimum of: (1) Actual HRA received, (2) 50% of salary for metro cities or 40% for non-metro, (3) Rent paid minus 10% of salary." },
    { question: "Is HRA available under the new tax regime?", answer: "No, HRA exemption is only available under the old tax regime. Under the new regime, you get a standard deduction of ₹75,000 instead." },
  ],
  formula: "HRA Exemption = MIN(Actual HRA, 50%/40% of Salary, Rent - 10% of Salary)",
};
