import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taxRefundCalculator: CalculatorDefinition = {
  slug: "tax-refund-calculator",
  title: "Tax Refund Calculator",
  description: "Estimate your federal tax refund or amount owed based on income, withholdings, and credits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tax refund calculator", "estimated tax refund", "will i get a tax refund"],
  variants: [{
    id: "standard",
    name: "Tax Refund",
    description: "Estimate your federal tax refund or amount owed based on income, withholdings, and credits",
    fields: [
      { name: "annualIncome", label: "Annual Gross Income", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 65000 },
      { name: "totalWithheld", label: "Total Federal Tax Withheld", type: "number", prefix: "$", min: 0, max: 200000, step: 100, defaultValue: 8500 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"head",label:"Head of Household"}], defaultValue: "single" },
      { name: "credits", label: "Total Tax Credits", type: "number", prefix: "$", min: 0, max: 50000, step: 100, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.annualIncome as number;
      const withheld = inputs.totalWithheld as number;
      const filing = inputs.filingStatus as string;
      const credits = inputs.credits as number;
      if (!income || income <= 0) return null;
      const standardDeduction: Record<string, number> = { single: 14600, married: 29200, head: 21900 };
      const deduction = standardDeduction[filing] || 14600;
      const taxableIncome = Math.max(0, income - deduction);
      let tax = 0;
      if (filing === "married") {
        if (taxableIncome <= 23200) tax = taxableIncome * 0.10;
        else if (taxableIncome <= 94300) tax = 2320 + (taxableIncome - 23200) * 0.12;
        else if (taxableIncome <= 201050) tax = 10852 + (taxableIncome - 94300) * 0.22;
        else tax = 34337 + (taxableIncome - 201050) * 0.24;
      } else {
        if (taxableIncome <= 11600) tax = taxableIncome * 0.10;
        else if (taxableIncome <= 47150) tax = 1160 + (taxableIncome - 11600) * 0.12;
        else if (taxableIncome <= 100525) tax = 5426 + (taxableIncome - 47150) * 0.22;
        else tax = 17168.50 + (taxableIncome - 100525) * 0.24;
      }
      const netTax = Math.max(0, tax - (credits || 0));
      const refundOrOwed = (withheld || 0) - netTax;
      return {
        primary: { label: refundOrOwed >= 0 ? "Estimated Refund" : "Estimated Amount Owed", value: "$" + formatNumber(Math.abs(Math.round(refundOrOwed))) },
        details: [
          { label: "Total Tax Liability", value: "$" + formatNumber(Math.round(netTax)) },
          { label: "Total Withheld", value: "$" + formatNumber(Math.round(withheld || 0)) },
          { label: "Taxable Income", value: "$" + formatNumber(Math.round(taxableIncome)) },
        ],
      };
    },
  }],
  relatedSlugs: ["w4-calculator", "standard-deduction-calculator"],
  faq: [
    { question: "When will I receive my tax refund?", answer: "The IRS typically issues refunds within 21 days of accepting an electronically filed return. Paper returns may take 6 to 8 weeks. Refunds with the Earned Income Tax Credit or Additional Child Tax Credit may be delayed until mid-February." },
    { question: "Is it better to get a large refund or owe a small amount?", answer: "Financially, it is better to owe a small amount because a large refund means you gave the government an interest-free loan. However, many people prefer the forced savings effect of a refund." },
  ],
  formula: "Refund = Total Withheld - (Tax on Taxable Income - Credits); Taxable Income = Gross Income - Standard Deduction",
};
