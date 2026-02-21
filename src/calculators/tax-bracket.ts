import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taxBracketCalculator: CalculatorDefinition = {
  slug: "tax-bracket-calculator",
  title: "Tax Bracket Calculator",
  description:
    "Free 2024 US federal tax bracket calculator. Find your marginal and effective tax rate based on taxable income and filing status.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tax bracket", "income tax", "marginal rate", "effective rate", "federal tax"],
  variants: [
    {
      id: "single",
      name: "Single Filer",
      fields: [
        { name: "taxableIncome", label: "Taxable Income ($)", type: "number", placeholder: "e.g. 85000" },
      ],
      calculate: (inputs) => {
        const taxableIncome = inputs.taxableIncome as number;
        if (!taxableIncome) return null;

        // 2024 Single brackets
        const brackets = [
          { min: 0, max: 11600, rate: 0.10 },
          { min: 11600, max: 47150, rate: 0.12 },
          { min: 47150, max: 100525, rate: 0.22 },
          { min: 100525, max: 191950, rate: 0.24 },
          { min: 191950, max: 243725, rate: 0.32 },
          { min: 243725, max: 609350, rate: 0.35 },
          { min: 609350, max: Infinity, rate: 0.37 },
        ];

        let totalTax = 0;
        let marginalRate = 0;
        const breakdownDetails: { label: string; value: string }[] = [];

        for (const bracket of brackets) {
          if (taxableIncome > bracket.min) {
            const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
            const taxInBracket = taxableInBracket * bracket.rate;
            totalTax += taxInBracket;
            marginalRate = bracket.rate * 100;

            if (taxableInBracket > 0) {
              breakdownDetails.push({
                label: `${bracket.rate * 100}% on $${formatNumber(bracket.min, 0)} - $${bracket.max === Infinity ? "+" : formatNumber(bracket.max, 0)}`,
                value: `$${formatNumber(taxInBracket, 2)}`,
              });
            }
          }
        }

        const effectiveRate = (totalTax / taxableIncome) * 100;
        const afterTax = taxableIncome - totalTax;

        return {
          primary: { label: "Total Federal Tax", value: `$${formatNumber(totalTax, 2)}` },
          details: [
            { label: "Marginal Tax Rate", value: `${formatNumber(marginalRate, 0)}%` },
            { label: "Effective Tax Rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "After-Tax Income", value: `$${formatNumber(afterTax, 2)}` },
            ...breakdownDetails,
          ],
        };
      },
    },
    {
      id: "married",
      name: "Married Filing Jointly",
      fields: [
        { name: "taxableIncome", label: "Taxable Income ($)", type: "number", placeholder: "e.g. 150000" },
      ],
      calculate: (inputs) => {
        const taxableIncome = inputs.taxableIncome as number;
        if (!taxableIncome) return null;

        // 2024 Married Filing Jointly brackets
        const brackets = [
          { min: 0, max: 23200, rate: 0.10 },
          { min: 23200, max: 94300, rate: 0.12 },
          { min: 94300, max: 201050, rate: 0.22 },
          { min: 201050, max: 383900, rate: 0.24 },
          { min: 383900, max: 487450, rate: 0.32 },
          { min: 487450, max: 731200, rate: 0.35 },
          { min: 731200, max: Infinity, rate: 0.37 },
        ];

        let totalTax = 0;
        let marginalRate = 0;
        const breakdownDetails: { label: string; value: string }[] = [];

        for (const bracket of brackets) {
          if (taxableIncome > bracket.min) {
            const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
            const taxInBracket = taxableInBracket * bracket.rate;
            totalTax += taxInBracket;
            marginalRate = bracket.rate * 100;

            if (taxableInBracket > 0) {
              breakdownDetails.push({
                label: `${bracket.rate * 100}% on $${formatNumber(bracket.min, 0)} - $${bracket.max === Infinity ? "+" : formatNumber(bracket.max, 0)}`,
                value: `$${formatNumber(taxInBracket, 2)}`,
              });
            }
          }
        }

        const effectiveRate = (totalTax / taxableIncome) * 100;
        const afterTax = taxableIncome - totalTax;

        return {
          primary: { label: "Total Federal Tax", value: `$${formatNumber(totalTax, 2)}` },
          details: [
            { label: "Marginal Tax Rate", value: `${formatNumber(marginalRate, 0)}%` },
            { label: "Effective Tax Rate", value: `${formatNumber(effectiveRate, 2)}%` },
            { label: "After-Tax Income", value: `$${formatNumber(afterTax, 2)}` },
            ...breakdownDetails,
          ],
        };
      },
    },
  ],
  relatedSlugs: ["payroll-tax-calculator", "capital-gains-calculator", "estate-tax-calculator"],
  faq: [
    { question: "What is the difference between marginal and effective tax rate?", answer: "Your marginal tax rate is the rate on your last dollar of income (your highest bracket). Your effective tax rate is the average rate across all your income, calculated as total tax divided by total income. The effective rate is always lower than the marginal rate." },
    { question: "Are these the only taxes I pay?", answer: "No, federal income tax is just one component. You also pay FICA taxes (Social Security and Medicare), and potentially state and local income taxes. This calculator only covers federal income tax." },
  ],
  formula: "Tax = Σ (Income in each bracket × bracket rate); Effective Rate = Total Tax / Taxable Income",
};
