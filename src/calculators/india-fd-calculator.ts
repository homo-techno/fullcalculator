import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaFdCalculator: CalculatorDefinition = {
  slug: "india-fd-calculator",
  title: "India FD Calculator",
  description: "Free Fixed Deposit calculator for India. Calculate FD maturity amount with compound interest for all major banks.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["fd calculator", "fixed deposit calculator india", "fd interest calculator"],
  variants: [{
    id: "standard",
    name: "India FD",
    description: "Free Fixed Deposit calculator for India",
    fields: [
      { name: "principal", label: "Deposit Amount", type: "number", prefix: "₹", min: 1000 },
      { name: "rate", label: "Annual Interest Rate", type: "number", suffix: "%", defaultValue: 7, min: 1, max: 15, step: 0.1 },
      { name: "years", label: "Tenure", type: "number", suffix: "years", min: 1, max: 10 },
      { name: "compound", label: "Compounding", type: "select", options: [{ label: "Quarterly", value: "4" }, { label: "Monthly", value: "12" }, { label: "Half-yearly", value: "2" }, { label: "Yearly", value: "1" }], defaultValue: "4" },
    ],
    calculate: (inputs) => {
      const p = inputs.principal as number;
      const rate = inputs.rate as number;
      const years = inputs.years as number;
      const n = parseFloat(inputs.compound as string);
      if (!p || !rate || !years) return null;
      const maturity = p * Math.pow(1 + rate / 100 / n, n * years);
      const interest = maturity - p;
      return {
        primary: { label: "Maturity Amount", value: "₹" + formatNumber(maturity) },
        details: [
          { label: "Principal", value: "₹" + formatNumber(p) },
          { label: "Total interest earned", value: "₹" + formatNumber(interest) },
          { label: "Effective annual rate", value: formatNumber((Math.pow(1 + rate/100/n, n) - 1) * 100, 2) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How is FD interest calculated?", answer: "FD interest is calculated using compound interest: A = P × (1 + r/n)^(n×t), where P is principal, r is annual rate, n is compounding frequency, t is years." },
    { question: "Is FD interest taxable in India?", answer: "Yes, FD interest is taxable. TDS of 10% is deducted if interest exceeds ₹40,000/year (₹50,000 for senior citizens)." },
  ],
  formula: "Maturity = P × (1 + r/n)^(n×t)",
};
