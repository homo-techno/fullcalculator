import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const incomeTaxIndiaCalculator: CalculatorDefinition = {
  slug: "income-tax-india-calculator",
  title: "Income Tax Calculator India",
  description:
    "Free income tax calculator for India. Compare old vs new tax regime. Calculate tax liability, deductions, and effective tax rate for FY 2024-25.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "income tax calculator India",
    "income tax calculator",
    "old vs new regime",
    "tax calculator India",
    "income tax slab",
    "tax liability calculator",
  ],
  variants: [
    {
      id: "old-regime",
      name: "Old Tax Regime",
      description: "Calculate tax under old regime with deductions (Section 80C, 80D, HRA, etc.)",
      fields: [
        {
          name: "grossIncome",
          label: "Gross Annual Income",
          type: "number",
          placeholder: "e.g. 1200000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "section80C",
          label: "Section 80C Deductions (PPF, ELSS, LIC, etc.)",
          type: "number",
          placeholder: "e.g. 150000",
          prefix: "₹",
          min: 0,
          max: 150000,
          defaultValue: 150000,
        },
        {
          name: "section80D",
          label: "Section 80D (Health Insurance)",
          type: "number",
          placeholder: "e.g. 25000",
          prefix: "₹",
          min: 0,
          max: 100000,
          defaultValue: 25000,
        },
        {
          name: "hra",
          label: "HRA Exemption",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "otherDeductions",
          label: "Other Deductions (80E, 80G, NPS, etc.)",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "ageGroup",
          label: "Age Group",
          type: "select",
          options: [
            { label: "Below 60 years", value: "general" },
            { label: "60-80 years (Senior Citizen)", value: "senior" },
            { label: "Above 80 years (Super Senior)", value: "superSenior" },
          ],
          defaultValue: "general",
        },
      ],
      calculate: (inputs) => {
        const grossIncome = inputs.grossIncome as number;
        const section80C = (inputs.section80C as number) || 0;
        const section80D = (inputs.section80D as number) || 0;
        const hra = (inputs.hra as number) || 0;
        const otherDeductions = (inputs.otherDeductions as number) || 0;
        const ageGroup = inputs.ageGroup as string;
        if (!grossIncome) return null;

        const standardDeduction = 50000;
        const totalDeductions = standardDeduction + Math.min(section80C, 150000) + Math.min(section80D, 100000) + hra + otherDeductions;
        const taxableIncome = Math.max(0, grossIncome - totalDeductions);

        let tax = 0;
        const exemptionLimit = ageGroup === "superSenior" ? 500000 : ageGroup === "senior" ? 300000 : 250000;

        // Old regime slabs
        if (taxableIncome > exemptionLimit) {
          if (taxableIncome <= 500000) {
            tax = (taxableIncome - exemptionLimit) * 0.05;
          } else if (taxableIncome <= 1000000) {
            tax = (500000 - exemptionLimit) * 0.05 + (taxableIncome - 500000) * 0.2;
          } else {
            tax = (500000 - exemptionLimit) * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3;
          }
        }

        // Section 87A rebate
        if (taxableIncome <= 500000) tax = 0;

        const cess = tax * 0.04;
        const totalTax = tax + cess;
        const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

        return {
          primary: { label: "Total Tax (Old Regime)", value: `₹${formatNumber(totalTax)}` },
          details: [
            { label: "Gross income", value: `₹${formatNumber(grossIncome)}` },
            { label: "Total deductions", value: `₹${formatNumber(totalDeductions)}` },
            { label: "Taxable income", value: `₹${formatNumber(taxableIncome)}` },
            { label: "Income tax", value: `₹${formatNumber(tax)}` },
            { label: "Health & Education Cess (4%)", value: `₹${formatNumber(cess)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 2)}%` },
          ],
        };
      },
    },
    {
      id: "new-regime",
      name: "New Tax Regime",
      description: "Calculate tax under new regime (lower rates, no deductions)",
      fields: [
        {
          name: "grossIncome",
          label: "Gross Annual Income",
          type: "number",
          placeholder: "e.g. 1200000",
          prefix: "₹",
          min: 0,
        },
        {
          name: "npsEmployer",
          label: "Employer NPS Contribution (if any)",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "₹",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const grossIncome = inputs.grossIncome as number;
        const npsEmployer = (inputs.npsEmployer as number) || 0;
        if (!grossIncome) return null;

        const standardDeduction = 75000; // New regime standard deduction (Budget 2024)
        const taxableIncome = Math.max(0, grossIncome - standardDeduction - npsEmployer);

        // New regime slabs (FY 2024-25 / AY 2025-26)
        let tax = 0;
        if (taxableIncome > 300000) {
          if (taxableIncome <= 700000) {
            tax = (taxableIncome - 300000) * 0.05;
          } else if (taxableIncome <= 1000000) {
            tax = 400000 * 0.05 + (taxableIncome - 700000) * 0.10;
          } else if (taxableIncome <= 1200000) {
            tax = 400000 * 0.05 + 300000 * 0.10 + (taxableIncome - 1000000) * 0.15;
          } else if (taxableIncome <= 1500000) {
            tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + (taxableIncome - 1200000) * 0.20;
          } else {
            tax = 400000 * 0.05 + 300000 * 0.10 + 200000 * 0.15 + 300000 * 0.20 + (taxableIncome - 1500000) * 0.30;
          }
        }

        // Section 87A rebate for new regime
        if (taxableIncome <= 700000) tax = 0;

        const cess = tax * 0.04;
        const totalTax = tax + cess;
        const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

        return {
          primary: { label: "Total Tax (New Regime)", value: `₹${formatNumber(totalTax)}` },
          details: [
            { label: "Gross income", value: `₹${formatNumber(grossIncome)}` },
            { label: "Standard deduction", value: `₹${formatNumber(standardDeduction)}` },
            { label: "Taxable income", value: `₹${formatNumber(taxableIncome)}` },
            { label: "Income tax", value: `₹${formatNumber(tax)}` },
            { label: "Health & Education Cess (4%)", value: `₹${formatNumber(cess)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["hra-calculator", "tds-calculator", "in-hand-salary-calculator"],
  faq: [
    {
      question: "What is the difference between old and new tax regime?",
      answer:
        "The old regime has higher tax rates but allows deductions (80C, 80D, HRA, etc.). The new regime has lower tax rates and higher rebate limits but most deductions are not available. You should compare both to choose the more beneficial one.",
    },
    {
      question: "What are the new regime tax slabs for FY 2024-25?",
      answer:
        "New regime slabs: ₹0-3L: Nil, ₹3L-7L: 5%, ₹7L-10L: 10%, ₹10L-12L: 15%, ₹12L-15L: 20%, Above ₹15L: 30%. Section 87A rebate makes income up to ₹7L tax-free.",
    },
    {
      question: "Which tax regime should I choose?",
      answer:
        "If your total deductions (80C + 80D + HRA + others) exceed approximately ₹3.75 lakh, the old regime may be more beneficial. For lower deductions, the new regime with its lower slab rates is usually better. Use this calculator to compare both.",
    },
  ],
  formula: "Tax = Sum of (Income in each slab × Slab rate) + 4% Cess",
};
