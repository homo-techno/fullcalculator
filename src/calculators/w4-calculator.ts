import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const w4Calculator: CalculatorDefinition = {
  slug: "w4-calculator",
  title: "W-4 Calculator",
  description: "Estimate the optimal number of withholding allowances on your W-4 form to match your expected federal tax liability.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["w4 calculator", "withholding calculator", "federal withholding allowances"],
  variants: [{
    id: "standard",
    name: "W-4",
    description: "Estimate the optimal number of withholding allowances on your W-4 form to match your expected federal tax liability",
    fields: [
      { name: "annualIncome", label: "Annual Gross Income", type: "number", prefix: "$", min: 10000, max: 1000000, step: 1000, defaultValue: 75000 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"head",label:"Head of Household"}], defaultValue: "single" },
      { name: "dependents", label: "Number of Dependents", type: "number", min: 0, max: 10, defaultValue: 0 },
      { name: "otherIncome", label: "Other Annual Income", type: "number", prefix: "$", min: 0, max: 500000, step: 1000, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const income = inputs.annualIncome as number;
      const filing = inputs.filingStatus as string;
      const deps = inputs.dependents as number;
      const other = inputs.otherIncome as number;
      if (!income || income <= 0) return null;
      const totalIncome = income + (other || 0);
      const standardDeduction: Record<string, number> = { single: 14600, married: 29200, head: 21900 };
      const deduction = standardDeduction[filing] || 14600;
      const taxableIncome = Math.max(0, totalIncome - deduction);
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
      const childCredit = (deps || 0) * 2000;
      const netTax = Math.max(0, tax - childCredit);
      const monthlyWithholding = netTax / 12;
      const perPaycheck = netTax / 26;
      return {
        primary: { label: "Estimated Annual Federal Tax", value: "$" + formatNumber(Math.round(netTax)) },
        details: [
          { label: "Monthly Withholding Needed", value: "$" + formatNumber(Math.round(monthlyWithholding)) },
          { label: "Per Paycheck (biweekly)", value: "$" + formatNumber(Math.round(perPaycheck)) },
          { label: "Effective Tax Rate", value: formatNumber(Math.round(netTax / totalIncome * 10000) / 100) + "%" },
        ],
      };
    },
  }],
  relatedSlugs: ["tax-refund-calculator", "standard-deduction-calculator"],
  faq: [
    { question: "How do I fill out a W-4 correctly?", answer: "The W-4 form requires your filing status, information about multiple jobs or working spouse, dependent credits, other adjustments, and any extra withholding. Use the IRS estimator tool or this calculator to ensure accurate withholding." },
    { question: "Should I claim 0 or 1 on my W-4?", answer: "The current W-4 form no longer uses allowances (0 or 1). Instead it uses a five-step process. Claiming fewer deductions results in more tax withheld, reducing the risk of owing at tax time." },
  ],
  formula: "Tax = Progressive rates on (Income - Standard Deduction); Net Tax = Tax - Child Tax Credits",
};
