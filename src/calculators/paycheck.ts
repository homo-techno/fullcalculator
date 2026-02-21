import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paycheckCalculator: CalculatorDefinition = {
  slug: "paycheck-calculator",
  title: "Paycheck Calculator",
  description: "Free paycheck calculator. Estimate your take-home pay after federal and state taxes, Social Security, and Medicare deductions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["paycheck calculator", "take home pay calculator", "net pay calculator", "salary after taxes", "payroll calculator"],
  variants: [
    {
      id: "annual",
      name: "Annual Salary to Take-Home",
      description: "Estimate net pay from gross annual salary (US simplified)",
      fields: [
        { name: "salary", label: "Annual Gross Salary", type: "number", placeholder: "e.g. 75000", prefix: "$" },
        { name: "filingStatus", label: "Filing Status", type: "select", options: [
          { label: "Single", value: "single" },
          { label: "Married Filing Jointly", value: "married" },
        ], defaultValue: "single" },
        { name: "stateTax", label: "State Tax Rate", type: "number", placeholder: "e.g. 5", suffix: "%", defaultValue: 5, min: 0, max: 15 },
        { name: "payFrequency", label: "Pay Frequency", type: "select", options: [
          { label: "Bi-weekly (26/year)", value: "26" },
          { label: "Semi-monthly (24/year)", value: "24" },
          { label: "Monthly (12/year)", value: "12" },
          { label: "Weekly (52/year)", value: "52" },
        ], defaultValue: "26" },
      ],
      calculate: (inputs) => {
        const salary = inputs.salary as number;
        const status = inputs.filingStatus as string;
        const stateTaxRate = (inputs.stateTax as number) || 0;
        const freq = parseInt(inputs.payFrequency as string) || 26;
        if (!salary) return null;

        // 2026 simplified US federal tax brackets
        const standardDeduction = status === "married" ? 30000 : 15000;
        const taxableIncome = Math.max(0, salary - standardDeduction);

        let federalTax = 0;
        const brackets = status === "married"
          ? [{ limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 }, { limit: 201050, rate: 0.22 }, { limit: 383900, rate: 0.24 }, { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 }, { limit: Infinity, rate: 0.37 }]
          : [{ limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 }, { limit: 100525, rate: 0.22 }, { limit: 191950, rate: 0.24 }, { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 }, { limit: Infinity, rate: 0.37 }];

        let remaining = taxableIncome;
        let prevLimit = 0;
        for (const bracket of brackets) {
          const taxableAtBracket = Math.min(remaining, bracket.limit - prevLimit);
          if (taxableAtBracket <= 0) break;
          federalTax += taxableAtBracket * bracket.rate;
          remaining -= taxableAtBracket;
          prevLimit = bracket.limit;
        }

        const socialSecurity = Math.min(salary, 168600) * 0.062;
        const medicare = salary * 0.0145;
        const stateTax = salary * (stateTaxRate / 100);
        const totalDeductions = federalTax + socialSecurity + medicare + stateTax;
        const netAnnual = salary - totalDeductions;
        const netPerPaycheck = netAnnual / freq;

        return {
          primary: { label: "Net Per Paycheck", value: `$${formatNumber(netPerPaycheck)}` },
          details: [
            { label: "Annual net pay", value: `$${formatNumber(netAnnual)}` },
            { label: "Federal tax", value: `$${formatNumber(federalTax)} (${formatNumber((federalTax / salary) * 100)}%)` },
            { label: "State tax", value: `$${formatNumber(stateTax)} (${stateTaxRate}%)` },
            { label: "Social Security", value: `$${formatNumber(socialSecurity)}` },
            { label: "Medicare", value: `$${formatNumber(medicare)}` },
            { label: "Effective tax rate", value: `${formatNumber((totalDeductions / salary) * 100)}%` },
          ],
          note: "This is a simplified estimate. Actual taxes depend on deductions, credits, local taxes, and pre-tax contributions (401k, HSA, etc.).",
        };
      },
    },
  ],
  relatedSlugs: ["salary-calculator", "percentage-calculator", "compound-interest-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary?", answer: "In the US, you pay federal income tax (10-37% marginal rates), state tax (0-13%), Social Security (6.2% on first ~$168k), and Medicare (1.45%). The effective rate for a $75k salary is typically 22-28%." },
    { question: "What is the difference between gross and net pay?", answer: "Gross pay is your total salary before deductions. Net pay (take-home pay) is what you actually receive after taxes, Social Security, Medicare, and other deductions." },
  ],
  formula: "Net Pay = Gross - Federal Tax - State Tax - SS (6.2%) - Medicare (1.45%)",
};
