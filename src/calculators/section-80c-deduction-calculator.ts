import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const section80cDeductionCalculator: CalculatorDefinition = {
  slug: "section-80c-deduction-calculator",
  title: "Section 80C Deduction Calculator",
  description: "Calculate total Section 80C tax deductions from various qualifying investments and expenses under Indian Income Tax Act.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["section 80c calculator", "80c deduction", "tax deduction calculator india"],
  variants: [{
    id: "standard",
    name: "Section 80C Deduction",
    description: "Calculate total Section 80C tax deductions from various qualifying investments and expenses under Indian Income Tax Act",
    fields: [
      { name: "ppf", label: "PPF / EPF Contribution", type: "number", prefix: "Rs.", min: 0, max: 150000, step: 500, defaultValue: 50000 },
      { name: "elss", label: "ELSS / Tax Saving FD", type: "number", prefix: "Rs.", min: 0, max: 150000, step: 500, defaultValue: 50000 },
      { name: "insurance", label: "Life Insurance Premium", type: "number", prefix: "Rs.", min: 0, max: 150000, step: 500, defaultValue: 30000 },
      { name: "taxBracket", label: "Tax Bracket", type: "select", options: [{value:"5",label:"5%"},{value:"20",label:"20%"},{value:"30",label:"30%"}], defaultValue: "30" },
    ],
    calculate: (inputs) => {
      const ppf = inputs.ppf as number;
      const elss = inputs.elss as number;
      const insurance = inputs.insurance as number;
      const taxRate = parseFloat(inputs.taxBracket as string) || 30;
      const totalDeduction = Math.min(150000, (ppf || 0) + (elss || 0) + (insurance || 0));
      const taxSaved = totalDeduction * (taxRate / 100);
      const cessOnTax = taxSaved * 0.04;
      const totalSaving = taxSaved + cessOnTax;
      const remaining = Math.max(0, 150000 - totalDeduction);
      return {
        primary: { label: "Total Tax Saving", value: "Rs. " + formatNumber(Math.round(totalSaving)) },
        details: [
          { label: "Section 80C Deduction Claimed", value: "Rs. " + formatNumber(totalDeduction) },
          { label: "Remaining 80C Limit", value: "Rs. " + formatNumber(remaining) },
          { label: "Tax Saved (including cess)", value: "Rs. " + formatNumber(Math.round(totalSaving)) },
        ],
      };
    },
  }],
  relatedSlugs: ["elss-tax-saving-calculator", "dearness-allowance-calculator"],
  faq: [
    { question: "What is the maximum deduction under Section 80C?", answer: "The maximum deduction allowed under Section 80C of the Income Tax Act is Rs. 1,50,000 per financial year. This includes all qualifying investments and expenses combined." },
    { question: "What investments qualify under Section 80C?", answer: "Qualifying investments include PPF, EPF, ELSS mutual funds, NSC, 5-year tax saving FD, life insurance premiums, home loan principal repayment, SSY, and tuition fees for up to two children." },
  ],
  formula: "Total Deduction = Min(150000, PPF + ELSS + Insurance + Others); Tax Saved = Deduction x Tax Rate x 1.04 (cess)",
};
