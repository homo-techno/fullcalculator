import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indiaEpfCalculator: CalculatorDefinition = {
  slug: "india-epf-calculator",
  title: "India EPF Calculator",
  description: "Free EPF (Employee Provident Fund) calculator. Calculate your EPF balance at retirement with employer contribution and 8.25% interest.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["epf calculator", "pf calculator india", "provident fund calculator"],
  variants: [{
    id: "standard",
    name: "India EPF",
    description: "Free EPF (Employee Provident Fund) calculator",
    fields: [
      { name: "basic", label: "Monthly Basic + DA", type: "number", prefix: "₹", min: 0 },
      { name: "age", label: "Current Age", type: "number", min: 18, max: 58 },
      { name: "existing", label: "Existing EPF Balance", type: "number", prefix: "₹", defaultValue: 0, min: 0 },
    ],
    calculate: (inputs) => {
      const basic = inputs.basic as number;
      const age = inputs.age as number;
      const existing = (inputs.existing as number) || 0;
      if (!basic || !age) return null;
      const years = Math.max(0, 58 - age);
      const empContrib = basic * 0.12;
      const epsContrib = Math.min(basic, 15000) * 0.0833;
      const employerEpf = empContrib - epsContrib;
      const monthlyTotal = empContrib + employerEpf;
      const r = 0.0825 / 12;
      let balance = existing;
      for (let i = 0; i < years * 12; i++) {
        balance = (balance + monthlyTotal) * (1 + r);
      }
      return {
        primary: { label: "EPF at Retirement", value: "₹" + formatNumber(balance) },
        details: [
          { label: "Your monthly contribution (12%)", value: "₹" + formatNumber(empContrib) },
          { label: "Employer EPF contribution", value: "₹" + formatNumber(employerEpf) },
          { label: "Employer EPS contribution", value: "₹" + formatNumber(epsContrib) },
          { label: "Years to retirement (58)", value: String(years) },
          { label: "Total invested", value: "₹" + formatNumber(monthlyTotal * years * 12 + existing) },
        ],
        note: "Interest rate: 8.25% p.a. (FY 2024-25). EPS capped at ₹15,000 basic.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the EPF interest rate?", answer: "The EPF interest rate for FY 2024-25 is 8.25% per annum, compounded monthly." },
    { question: "How much does employer contribute to EPF?", answer: "Employer contributes 12% of Basic+DA, of which 8.33% (max on ₹15,000) goes to EPS and the rest to EPF." },
  ],
  formula: "EPF = Compound Interest on (Employee 12% + Employer ~3.67%) at 8.25% p.a.",
};
