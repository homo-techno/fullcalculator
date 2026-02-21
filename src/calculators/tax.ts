import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const taxCalculator: CalculatorDefinition = {
  slug: "tax-calculator",
  title: "Tax Calculator",
  description: "Free income tax calculator. Estimate your federal and state income tax for the current year. See your effective tax rate and tax bracket.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["tax calculator", "income tax calculator", "federal tax calculator", "tax estimator", "tax bracket calculator"],
  variants: [
    {
      id: "federal",
      name: "Federal Income Tax Estimator",
      description: "Estimate federal income tax based on taxable income and filing status (2024 brackets)",
      fields: [
        { name: "income", label: "Taxable Income", type: "number", placeholder: "e.g. 85000", prefix: "$" },
        { name: "status", label: "Filing Status", type: "select", options: [
          { label: "Single", value: "single" },
          { label: "Married Filing Jointly", value: "married" },
          { label: "Head of Household", value: "hoh" },
        ], defaultValue: "single" },
      ],
      calculate: (inputs) => {
        const income = inputs.income as number;
        const status = inputs.status as string;
        if (!income || income <= 0) return null;

        const brackets: Record<string, { limit: number; rate: number }[]> = {
          single: [
            { limit: 11600, rate: 0.10 }, { limit: 47150, rate: 0.12 }, { limit: 100525, rate: 0.22 },
            { limit: 191950, rate: 0.24 }, { limit: 243725, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          married: [
            { limit: 23200, rate: 0.10 }, { limit: 94300, rate: 0.12 }, { limit: 201050, rate: 0.22 },
            { limit: 383900, rate: 0.24 }, { limit: 487450, rate: 0.32 }, { limit: 731200, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
          hoh: [
            { limit: 16550, rate: 0.10 }, { limit: 63100, rate: 0.12 }, { limit: 100500, rate: 0.22 },
            { limit: 191950, rate: 0.24 }, { limit: 243700, rate: 0.32 }, { limit: 609350, rate: 0.35 },
            { limit: Infinity, rate: 0.37 },
          ],
        };

        const b = brackets[status] || brackets.single;
        let tax = 0;
        let remaining = income;
        let prevLimit = 0;
        let marginalRate = 0;
        for (const bracket of b) {
          const taxable = Math.min(remaining, bracket.limit - prevLimit);
          if (taxable <= 0) break;
          tax += taxable * bracket.rate;
          marginalRate = bracket.rate;
          remaining -= taxable;
          prevLimit = bracket.limit;
        }

        const effectiveRate = (tax / income) * 100;

        return {
          primary: { label: "Estimated Federal Tax", value: `$${formatNumber(tax)}` },
          details: [
            { label: "Effective tax rate", value: `${formatNumber(effectiveRate)}%` },
            { label: "Marginal tax bracket", value: `${(marginalRate * 100).toFixed(0)}%` },
            { label: "After-tax income", value: `$${formatNumber(income - tax)}` },
            { label: "Monthly after-tax", value: `$${formatNumber((income - tax) / 12)}` },
          ],
          note: "This estimates federal income tax only. State taxes, FICA (Social Security + Medicare), and deductions/credits are not included.",
        };
      },
    },
    {
      id: "sales",
      name: "Sales Tax Calculator",
      description: "Calculate total price including sales tax",
      fields: [
        { name: "price", label: "Price Before Tax", type: "number", placeholder: "e.g. 49.99", prefix: "$" },
        { name: "rate", label: "Sales Tax Rate", type: "number", placeholder: "e.g. 8.25", suffix: "%" },
      ],
      calculate: (inputs) => {
        const price = inputs.price as number;
        const rate = (inputs.rate as number) || 0;
        if (!price) return null;
        const tax = price * (rate / 100);
        const total = price + tax;
        return {
          primary: { label: "Total Price", value: `$${formatNumber(total)}` },
          details: [
            { label: "Sales tax amount", value: `$${formatNumber(tax)}` },
            { label: "Pre-tax price", value: `$${formatNumber(price)}` },
            { label: "Tax rate", value: `${rate}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["paycheck-calculator", "salary-calculator", "percentage-calculator"],
  faq: [
    { question: "What are the 2024 federal tax brackets?", answer: "For single filers: 10% up to $11,600; 12% up to $47,150; 22% up to $100,525; 24% up to $191,950; 32% up to $243,725; 35% up to $609,350; 37% above that." },
    { question: "What is the difference between marginal and effective tax rate?", answer: "Marginal rate is the tax rate on your last dollar of income (your bracket). Effective rate is the average rate across all your income. A $100k earner (single) pays ~17.4% effective rate despite being in the 22% bracket." },
  ],
  formula: "Federal Tax = Sum of (income in each bracket × bracket rate)",
};
