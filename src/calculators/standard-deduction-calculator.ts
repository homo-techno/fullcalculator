import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const standardDeductionCalculator: CalculatorDefinition = {
  slug: "standard-deduction-calculator",
  title: "Standard Deduction Calculator",
  description: "Determine your standard deduction amount based on filing status, age, and blindness status for federal income tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["standard deduction", "standard deduction calculator", "tax deduction amount"],
  variants: [{
    id: "standard",
    name: "Standard Deduction",
    description: "Determine your standard deduction amount based on filing status, age, and blindness status for federal income tax",
    fields: [
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"head",label:"Head of Household"},{value:"marriedSeparate",label:"Married Filing Separately"}], defaultValue: "single" },
      { name: "age", label: "Age", type: "number", suffix: "years", min: 16, max: 100, defaultValue: 35 },
      { name: "isBlind", label: "Legally Blind", type: "select", options: [{value:"no",label:"No"},{value:"yes",label:"Yes"}], defaultValue: "no" },
    ],
    calculate: (inputs) => {
      const filing = inputs.filingStatus as string;
      const age = inputs.age as number;
      const blind = inputs.isBlind as string;
      if (!age) return null;
      const baseDeductions: Record<string, number> = { single: 14600, married: 29200, head: 21900, marriedSeparate: 14600 };
      const base = baseDeductions[filing] || 14600;
      let additional = 0;
      const isMarried = filing === "married" || filing === "marriedSeparate";
      const additionalAmount = isMarried ? 1550 : 1950;
      if (age >= 65) additional += additionalAmount;
      if (blind === "yes") additional += additionalAmount;
      const totalDeduction = base + additional;
      const taxSavingsAt22 = totalDeduction * 0.22;
      return {
        primary: { label: "Standard Deduction", value: "$" + formatNumber(totalDeduction) },
        details: [
          { label: "Base Deduction", value: "$" + formatNumber(base) },
          { label: "Additional Amount", value: "$" + formatNumber(additional) },
          { label: "Estimated Tax Savings (at 22% bracket)", value: "$" + formatNumber(Math.round(taxSavingsAt22)) },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-refund-calculator", "w4-calculator"],
  faq: [
    { question: "Should I take the standard deduction or itemize?", answer: "Take the standard deduction if your total itemized deductions (mortgage interest, state and local taxes, charitable contributions, etc.) are less than the standard deduction amount for your filing status." },
    { question: "Do seniors get a higher standard deduction?", answer: "Yes. Taxpayers age 65 or older receive an additional standard deduction of $1,950 for single filers or $1,550 per qualifying spouse for married filers. This is in addition to the base standard deduction." },
  ],
  formula: "Standard Deduction = Base Amount (by filing status) + Additional Amount (if age 65+ or blind)",
};
