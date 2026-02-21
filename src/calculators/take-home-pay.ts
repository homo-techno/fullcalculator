import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const takeHomePayCalculator: CalculatorDefinition = {
  slug: "take-home-pay-calculator",
  title: "Take Home Pay Calculator",
  description:
    "Free take home pay calculator. Estimate your net pay after federal taxes, state taxes, and FICA deductions. See your actual paycheck amount by pay frequency.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "take home pay calculator",
    "net pay calculator",
    "paycheck calculator after taxes",
    "salary after tax",
    "take home salary calculator",
  ],
  variants: [
    {
      id: "net-pay",
      name: "Calculate Take Home Pay",
      description: "Estimate your take home pay after all deductions",
      fields: [
        {
          name: "grossSalary",
          label: "Gross Annual Salary",
          type: "number",
          placeholder: "e.g. 75000",
          prefix: "$",
          min: 0,
        },
        {
          name: "payFrequency",
          label: "Pay Frequency",
          type: "select",
          options: [
            { label: "Weekly (52/yr)", value: "weekly" },
            { label: "Biweekly (26/yr)", value: "biweekly" },
            { label: "Semi-monthly (24/yr)", value: "semimonthly" },
            { label: "Monthly (12/yr)", value: "monthly" },
          ],
          defaultValue: "biweekly",
        },
        {
          name: "filingStatus",
          label: "Filing Status",
          type: "select",
          options: [
            { label: "Single", value: "single" },
            { label: "Married Filing Jointly", value: "married" },
            { label: "Head of Household", value: "hoh" },
          ],
          defaultValue: "single",
        },
        {
          name: "stateRate",
          label: "State Tax Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 15,
          step: 0.1,
          defaultValue: 5,
        },
      ],
      calculate: (inputs) => {
        const gross = inputs.grossSalary as number;
        const frequency = inputs.payFrequency as string;
        const status = inputs.filingStatus as string;
        const stateRate = (inputs.stateRate as number) ?? 5;
        if (!gross) return null;

        // Standard deduction (2024)
        const standardDeduction: Record<string, number> = {
          single: 14600,
          married: 29200,
          hoh: 21900,
        };
        const deduction = standardDeduction[status] || 14600;
        const taxableIncome = Math.max(0, gross - deduction);

        // Federal tax brackets (2024)
        const brackets: Record<string, { limit: number; rate: number }[]> = {
          single: [
            { limit: 11600, rate: 0.10 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 },
            { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          married: [
            { limit: 23200, rate: 0.10 },
            { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 },
            { limit: 383900, rate: 0.24 },
            { limit: 487450, rate: 0.32 },
            { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          hoh: [
            { limit: 16550, rate: 0.10 },
            { limit: 63100, rate: 0.12 },
            { limit: 100500, rate: 0.22 },
            { limit: 191950, rate: 0.24 },
            { limit: 243700, rate: 0.32 },
            { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
        };

        let federalTax = 0;
        let remaining = taxableIncome;
        let prevLimit = 0;
        for (const b of brackets[status] || brackets.single) {
          const taxable = Math.min(remaining, b.limit - prevLimit);
          if (taxable <= 0) break;
          federalTax += taxable * b.rate;
          remaining -= taxable;
          prevLimit = b.limit;
        }

        // FICA: Social Security 6.2% (up to $168,600) + Medicare 1.45%
        const ssWageLimit = 168600;
        const socialSecurity = Math.min(gross, ssWageLimit) * 0.062;
        const medicare = gross * 0.0145;
        const additionalMedicare = gross > 200000 ? (gross - 200000) * 0.009 : 0;
        const fica = socialSecurity + medicare + additionalMedicare;

        // State tax
        const stateTax = gross * (stateRate / 100);

        const totalDeductions = federalTax + fica + stateTax;
        const annualNet = gross - totalDeductions;

        const periodsPerYear: Record<string, number> = {
          weekly: 52,
          biweekly: 26,
          semimonthly: 24,
          monthly: 12,
        };
        const periods = periodsPerYear[frequency] || 26;
        const perPaycheck = annualNet / periods;
        const effectiveRate = (totalDeductions / gross) * 100;

        return {
          primary: {
            label: "Take Home Per Paycheck",
            value: `$${formatNumber(perPaycheck)}`,
          },
          details: [
            { label: "Annual gross", value: `$${formatNumber(gross)}` },
            { label: "Federal income tax", value: `$${formatNumber(federalTax)}` },
            { label: "Social Security", value: `$${formatNumber(socialSecurity)}` },
            { label: "Medicare", value: `$${formatNumber(medicare + additionalMedicare)}` },
            { label: "State tax", value: `$${formatNumber(stateTax)}` },
            { label: "Total annual deductions", value: `$${formatNumber(totalDeductions)}` },
            { label: "Annual net pay", value: `$${formatNumber(annualNet)}` },
            { label: "Monthly net pay", value: `$${formatNumber(annualNet / 12)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 1)}%` },
          ],
          note: "Estimates use 2024 federal brackets with standard deduction. Actual take home may vary based on pre-tax deductions (401k, health insurance), local taxes, and other withholdings.",
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "paycheck-calculator", "tax-calculator"],
  faq: [
    {
      question: "How is take home pay calculated?",
      answer:
        "Take home pay = Gross salary - Federal income tax - State income tax - Social Security (6.2%) - Medicare (1.45%) - any pre-tax deductions. Federal tax is calculated on taxable income (gross minus standard deduction) using progressive brackets.",
    },
    {
      question: "What percentage of my salary goes to taxes?",
      answer:
        "Most workers pay 25-35% of gross income in combined taxes and deductions. This includes federal tax (10-37% marginal), state tax (0-13%), Social Security (6.2%), and Medicare (1.45%). The effective rate depends on income level and deductions.",
    },
    {
      question: "How much is take home pay on a $60,000 salary?",
      answer:
        "On a $60,000 salary (single, 5% state tax), approximate take home is about $47,000-$49,000 annually or $1,800-$1,880 biweekly, after federal tax, state tax, and FICA deductions.",
    },
  ],
  formula:
    "Net Pay = Gross - Federal Tax - State Tax - Social Security (6.2%) - Medicare (1.45%). Federal Tax uses progressive brackets on (Gross - Standard Deduction).",
};
