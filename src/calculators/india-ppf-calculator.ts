import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaPpfCalculator: CalculatorDefinition = {
  slug: "india-ppf-calculator",
  title: "India PPF Calculator",
  description: "Free PPF calculator. Calculate Public Provident Fund maturity with 7.1% interest over 15 years.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ppf calculator", "ppf calculator india", "public provident fund calculator"],
  variants: [{
    id: "standard",
    name: "India PPF",
    description: "Free PPF calculator",
    fields: [
      { name: "yearly", label: "Annual Investment", type: "number", prefix: "₹", min: 500, max: 150000, defaultValue: 150000 },
      { name: "years", label: "Period", type: "number", suffix: "years", defaultValue: 15, min: 15, max: 50 },
    ],
    calculate: (inputs) => {
      const yearly = inputs.yearly as number;
      const years = inputs.years as number;
      if (!yearly || !years) return null;
      const rate = 0.071;
      let balance = 0;
      for (let i = 0; i < years; i++) {
        balance = (balance + yearly) * (1 + rate);
      }
      const invested = yearly * years;
      const interest = balance - invested;
      return {
        primary: { label: "Maturity Value", value: "₹" + formatNumber(balance) },
        details: [
          { label: "Total invested", value: "₹" + formatNumber(invested) },
          { label: "Total interest earned", value: "₹" + formatNumber(interest) },
          { label: "Interest rate", value: "7.1% p.a." },
          { label: "Tax status", value: "EEE (fully exempt)" },
        ],
        note: "PPF has a 15-year lock-in. Interest rate is 7.1% p.a. (subject to quarterly review). Max ₹1.5L/year.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is PPF interest rate?", answer: "The current PPF interest rate is 7.1% per annum, compounded annually. It is reviewed quarterly by the government." },
    { question: "Is PPF tax-free?", answer: "Yes, PPF enjoys EEE (Exempt-Exempt-Exempt) status: investment up to ₹1.5L is deductible u/s 80C, interest is tax-free, and maturity amount is tax-free." },
  ],
  formula: "PPF Maturity = Sum of (Annual Investment × (1+7.1%)^remaining years)",
};
