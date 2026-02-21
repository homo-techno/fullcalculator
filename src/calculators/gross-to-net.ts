import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const grossToNetCalculator: CalculatorDefinition = {
  slug: "gross-to-net-calculator",
  title: "Gross to Net Salary Calculator",
  description:
    "Free gross to net salary calculator. Convert your gross annual salary to net take-home pay. See federal tax, FICA, and state tax deductions with monthly and annual breakdowns.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "gross to net calculator",
    "gross to net salary",
    "salary after tax calculator",
    "gross pay to net pay",
    "annual salary to net",
  ],
  variants: [
    {
      id: "gross-net",
      name: "Gross to Net Salary",
      description: "Convert gross annual salary to net pay after taxes",
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
          label: "State Income Tax Rate",
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
        const status = inputs.filingStatus as string;
        const stateRate = (inputs.stateRate as number) ?? 5;
        if (!gross) return null;

        // Standard deduction (2024)
        const stdDeduction: Record<string, number> = {
          single: 14600,
          married: 29200,
          hoh: 21900,
        };
        const deduction = stdDeduction[status] || 14600;
        const taxableIncome = Math.max(0, gross - deduction);

        // Federal brackets (2024)
        const brackets: Record<string, { limit: number; rate: number }[]> = {
          single: [
            { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 },
            { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          married: [
            { limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 },
            { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          hoh: [
            { limit: 16550, rate: 0.10 }, { limit: 63100, rate: 0.12 },
            { limit: 100500, rate: 0.22 }, { limit: 191950, rate: 0.24 },
            { limit: 243700, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
        };

        let federalTax = 0;
        let remaining = taxableIncome;
        let prevLimit = 0;
        let marginalRate = 0;
        for (const b of brackets[status] || brackets.single) {
          const taxable = Math.min(remaining, b.limit - prevLimit);
          if (taxable <= 0) break;
          federalTax += taxable * b.rate;
          marginalRate = b.rate;
          remaining -= taxable;
          prevLimit = b.limit;
        }

        // FICA
        const ssLimit = 168600;
        const socialSecurity = Math.min(gross, ssLimit) * 0.062;
        const medicare = gross * 0.0145;
        const additionalMedicare = gross > 200000 ? (gross - 200000) * 0.009 : 0;
        const totalFICA = socialSecurity + medicare + additionalMedicare;

        // State tax
        const stateTax = gross * (stateRate / 100);

        const totalDeductions = federalTax + totalFICA + stateTax;
        const annualNet = gross - totalDeductions;
        const monthlyGross = gross / 12;
        const monthlyNet = annualNet / 12;
        const biweeklyNet = annualNet / 26;
        const weeklyNet = annualNet / 52;
        const effectiveRate = (totalDeductions / gross) * 100;

        return {
          primary: {
            label: "Annual Net Salary",
            value: `$${formatNumber(annualNet)}`,
          },
          details: [
            { label: "Gross annual salary", value: `$${formatNumber(gross)}` },
            { label: "Standard deduction", value: `$${formatNumber(deduction)}` },
            { label: "Federal income tax", value: `$${formatNumber(federalTax)}` },
            { label: "Marginal tax bracket", value: `${(marginalRate * 100).toFixed(0)}%` },
            { label: "Social Security (6.2%)", value: `$${formatNumber(socialSecurity)}` },
            { label: "Medicare (1.45%)", value: `$${formatNumber(medicare + additionalMedicare)}` },
            { label: "State tax", value: `$${formatNumber(stateTax)}` },
            { label: "Total deductions", value: `$${formatNumber(totalDeductions)}` },
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate, 1)}%` },
            { label: "Monthly gross", value: `$${formatNumber(monthlyGross)}` },
            { label: "Monthly net", value: `$${formatNumber(monthlyNet)}` },
            { label: "Biweekly net", value: `$${formatNumber(biweeklyNet)}` },
            { label: "Weekly net", value: `$${formatNumber(weeklyNet)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["take-home-pay-calculator", "salary-calculator", "tax-calculator"],
  faq: [
    {
      question: "How do I convert gross salary to net?",
      answer:
        "Net salary = Gross salary - Federal income tax - State income tax - Social Security (6.2%) - Medicare (1.45%). Federal tax is computed on taxable income (gross minus standard deduction) using progressive brackets. The result is your actual take-home pay.",
    },
    {
      question: "What is the difference between gross and net salary?",
      answer:
        "Gross salary is your total pay before any deductions. Net salary (take-home pay) is what you actually receive after federal tax, state tax, Social Security, Medicare, and any voluntary deductions (401k, health insurance) are subtracted.",
    },
    {
      question: "What percentage of gross salary is net?",
      answer:
        "Most workers take home 65-75% of their gross salary. For a $75,000 salary (single, 5% state tax), you keep roughly $56,000-$58,000 (about 75%). Higher earners keep a smaller percentage due to progressive tax brackets.",
    },
  ],
  formula:
    "Net Salary = Gross - Federal Tax - State Tax - FICA (7.65%). Federal Tax calculated on (Gross - Standard Deduction) using progressive brackets.",
};
