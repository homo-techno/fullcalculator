import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taxRefundEstimateCalculator: CalculatorDefinition = {
  slug: "tax-refund-estimate-calculator",
  title: "Tax Refund Estimator",
  description:
    "Estimate your federal tax refund or balance due. Calculate based on income, withholdings, filing status, and common deductions and credits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "tax refund",
    "tax estimator",
    "federal tax",
    "tax return",
    "tax calculator",
  ],
  variants: [
    {
      id: "simple",
      name: "Simple Estimate",
      description: "Quick refund estimate based on income and withholding",
      fields: [
        { name: "filingStatus", label: "Filing Status", type: "select", options: [
          { label: "Single", value: "single" },
          { label: "Married Filing Jointly", value: "joint" },
          { label: "Married Filing Separately", value: "separate" },
          { label: "Head of Household", value: "hoh" },
        ], defaultValue: "single" },
        { name: "grossIncome", label: "Annual Gross Income ($)", type: "number", placeholder: "e.g. 65000", defaultValue: 65000 },
        { name: "federalWithheld", label: "Federal Tax Withheld ($)", type: "number", placeholder: "e.g. 8000", defaultValue: 8000 },
        { name: "numDependents", label: "Number of Dependents", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "deductionType", label: "Deduction Type", type: "select", options: [
          { label: "Standard Deduction", value: "standard" },
          { label: "Itemized Deductions", value: "itemized" },
        ], defaultValue: "standard" },
        { name: "itemizedAmount", label: "Itemized Deduction Amount ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const filingStatus = inputs.filingStatus as string;
        const grossIncome = parseFloat(inputs.grossIncome as string) || 0;
        const federalWithheld = parseFloat(inputs.federalWithheld as string) || 0;
        const numDependents = parseFloat(inputs.numDependents as string) || 0;
        const deductionType = inputs.deductionType as string;
        const itemizedAmount = parseFloat(inputs.itemizedAmount as string) || 0;

        if (grossIncome <= 0) return null;

        const standardDeductions: Record<string, number> = {
          single: 14600,
          joint: 29200,
          separate: 14600,
          hoh: 21900,
        };

        const deduction = deductionType === "itemized" && itemizedAmount > 0
          ? itemizedAmount
          : standardDeductions[filingStatus] || 14600;

        const taxableIncome = Math.max(0, grossIncome - deduction);

        let tax = 0;
        if (filingStatus === "joint") {
          const brackets = [
            { limit: 23200, rate: 0.10 },
            { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 },
            { limit: 383900, rate: 0.24 },
            { limit: 487450, rate: 0.32 },
            { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ];
          let remaining = taxableIncome;
          let prev = 0;
          for (const bracket of brackets) {
            const chunk = Math.min(remaining, bracket.limit - prev);
            tax += chunk * bracket.rate;
            remaining -= chunk;
            prev = bracket.limit;
            if (remaining <= 0) break;
          }
        } else {
          const brackets = [
            { limit: 11600, rate: 0.10 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 },
            { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ];
          let remaining = taxableIncome;
          let prev = 0;
          for (const bracket of brackets) {
            const chunk = Math.min(remaining, bracket.limit - prev);
            tax += chunk * bracket.rate;
            remaining -= chunk;
            prev = bracket.limit;
            if (remaining <= 0) break;
          }
        }

        const childTaxCredit = numDependents * 2000;
        const totalTax = Math.max(0, tax - childTaxCredit);
        const refundOrOwed = federalWithheld - totalTax;
        const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

        return {
          primary: {
            label: refundOrOwed >= 0 ? "Estimated Refund" : "Estimated Balance Due",
            value: `$${formatNumber(Math.abs(refundOrOwed), 2)}`,
          },
          details: [
            { label: "Gross Income", value: `$${formatNumber(grossIncome, 2)}` },
            { label: "Deduction", value: `$${formatNumber(deduction, 2)}` },
            { label: "Taxable Income", value: `$${formatNumber(taxableIncome, 2)}` },
            { label: "Tax Before Credits", value: `$${formatNumber(tax, 2)}` },
            { label: "Child Tax Credits", value: `$${formatNumber(childTaxCredit, 2)}` },
            { label: "Total Tax Liability", value: `$${formatNumber(totalTax, 2)}` },
            { label: "Federal Withheld", value: `$${formatNumber(federalWithheld, 2)}` },
            { label: "Effective Tax Rate", value: `${formatNumber(effectiveRate, 1)}%` },
          ],
          note: refundOrOwed >= 0
            ? "You are expected to receive a refund!"
            : "You may owe additional taxes. Consider adjusting your withholding.",
        };
      },
    },
    {
      id: "withCredits",
      name: "With Additional Credits",
      description: "Include common tax credits and adjustments",
      fields: [
        { name: "filingStatus", label: "Filing Status", type: "select", options: [
          { label: "Single", value: "single" },
          { label: "Married Filing Jointly", value: "joint" },
          { label: "Head of Household", value: "hoh" },
        ], defaultValue: "single" },
        { name: "grossIncome", label: "Annual Gross Income ($)", type: "number", placeholder: "e.g. 65000", defaultValue: 65000 },
        { name: "federalWithheld", label: "Federal Tax Withheld ($)", type: "number", placeholder: "e.g. 8000", defaultValue: 8000 },
        { name: "numDependents", label: "Number of Dependents (under 17)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "studentLoanInterest", label: "Student Loan Interest Paid ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "iraContribution", label: "Traditional IRA Contribution ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "educationCredits", label: "Education Credits ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "estimatedPayments", label: "Estimated Tax Payments Made ($)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const filingStatus = inputs.filingStatus as string;
        const grossIncome = parseFloat(inputs.grossIncome as string) || 0;
        const federalWithheld = parseFloat(inputs.federalWithheld as string) || 0;
        const numDependents = parseFloat(inputs.numDependents as string) || 0;
        const studentLoanInterest = parseFloat(inputs.studentLoanInterest as string) || 0;
        const iraContribution = parseFloat(inputs.iraContribution as string) || 0;
        const educationCredits = parseFloat(inputs.educationCredits as string) || 0;
        const estimatedPayments = parseFloat(inputs.estimatedPayments as string) || 0;

        if (grossIncome <= 0) return null;

        const standardDeductions: Record<string, number> = { single: 14600, joint: 29200, hoh: 21900 };
        const deduction = standardDeductions[filingStatus] || 14600;
        const adjustments = Math.min(studentLoanInterest, 2500) + Math.min(iraContribution, 7000);
        const agi = Math.max(0, grossIncome - adjustments);
        const taxableIncome = Math.max(0, agi - deduction);

        let tax = 0;
        const brackets = filingStatus === "joint"
          ? [{ l: 23200, r: 0.10 }, { l: 94300, r: 0.12 }, { l: 201050, r: 0.22 }, { l: 383900, r: 0.24 }, { l: 487450, r: 0.32 }, { l: 731200, r: 0.35 }, { l: Infinity, r: 0.37 }]
          : [{ l: 11600, r: 0.10 }, { l: 47150, r: 0.12 }, { l: 100525, r: 0.22 }, { l: 191950, r: 0.24 }, { l: 243725, r: 0.32 }, { l: 609350, r: 0.35 }, { l: Infinity, r: 0.37 }];

        let remaining = taxableIncome;
        let prev = 0;
        for (const b of brackets) {
          const chunk = Math.min(remaining, b.l - prev);
          tax += chunk * b.r;
          remaining -= chunk;
          prev = b.l;
          if (remaining <= 0) break;
        }

        const childCredit = numDependents * 2000;
        const totalCredits = childCredit + educationCredits;
        const totalTax = Math.max(0, tax - totalCredits);
        const totalPaid = federalWithheld + estimatedPayments;
        const refundOrOwed = totalPaid - totalTax;

        return {
          primary: {
            label: refundOrOwed >= 0 ? "Estimated Refund" : "Estimated Balance Due",
            value: `$${formatNumber(Math.abs(refundOrOwed), 2)}`,
          },
          details: [
            { label: "Adjusted Gross Income", value: `$${formatNumber(agi, 2)}` },
            { label: "Taxable Income", value: `$${formatNumber(taxableIncome, 2)}` },
            { label: "Tax Before Credits", value: `$${formatNumber(tax, 2)}` },
            { label: "Total Credits", value: `$${formatNumber(totalCredits, 2)}` },
            { label: "Total Tax Liability", value: `$${formatNumber(totalTax, 2)}` },
            { label: "Total Paid (withheld + estimated)", value: `$${formatNumber(totalPaid, 2)}` },
            { label: "Effective Tax Rate", value: `${formatNumber(grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0, 1)}%` },
          ],
          note: refundOrOwed >= 0 ? "You are expected to receive a refund!" : "You may owe additional taxes.",
        };
      },
    },
  ],
  relatedSlugs: ["1099-tax-calculator", "budget-calculator", "401k-calculator"],
  faq: [
    {
      question: "How long does it take to receive a tax refund?",
      answer:
        "E-filed returns with direct deposit typically receive refunds in 10-21 days. Paper returns take 6-8 weeks. The IRS Where's My Refund tool can track your refund status 24 hours after e-filing.",
    },
    {
      question: "Why is my refund smaller than expected?",
      answer:
        "Common reasons include: changes in income, fewer withholding allowances, lost tax credits (child aging out), changes in deductions, or owing back taxes/student loans that offset your refund.",
    },
    {
      question: "Is a big refund good or bad?",
      answer:
        "A large refund means you overpaid throughout the year, essentially giving the government an interest-free loan. Consider adjusting your W-4 to keep more money in each paycheck. However, some people prefer the forced savings aspect.",
    },
  ],
  formula:
    "Refund = Federal Tax Withheld - (Tax on Taxable Income - Credits); Taxable Income = Gross Income - Adjustments - Deductions",
};
