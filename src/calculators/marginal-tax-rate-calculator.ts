import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const marginalTaxRateCalculator: CalculatorDefinition = {
  slug: "marginal-tax-rate-calculator",
  title: "Marginal Tax Rate Calculator",
  description: "Determine your marginal and effective federal income tax rate by bracket.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["marginal tax rate", "tax bracket calculator", "federal income tax rate"],
  variants: [{
    id: "standard",
    name: "Marginal Tax Rate",
    description: "Determine your marginal and effective federal income tax rate by bracket",
    fields: [
      { name: "taxableIncome", label: "Taxable Income", type: "number", prefix: "$", min: 0, max: 10000000, defaultValue: 85000 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{value:"single",label:"Single"},{value:"married",label:"Married Filing Jointly"},{value:"hoh",label:"Head of Household"}], defaultValue: "single" },
    ],
    calculate: (inputs) => {
      const income = inputs.taxableIncome as number;
      const status = inputs.filingStatus as string;
      if (!income || income <= 0) return null;
      const brackets: Record<string, number[][]> = {
        single: [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]],
        married: [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]],
        hoh: [[16550,0.10],[63100,0.12],[100500,0.22],[191950,0.24],[243700,0.32],[609350,0.35],[Infinity,0.37]]
      };
      const b = brackets[status] || brackets.single;
      let tax = 0; let prev = 0; let marginalRate = 0.10;
      for (const [limit, rate] of b) {
        if (income <= prev) break;
        const taxable = Math.min(income, limit) - prev;
        tax += taxable * rate;
        marginalRate = rate;
        prev = limit;
      }
      const effectiveRate = (tax / income) * 100;
      return {
        primary: { label: "Marginal Tax Rate", value: (marginalRate * 100).toFixed(0) + "%" },
        details: [
          { label: "Effective Tax Rate", value: effectiveRate.toFixed(1) + "%" },
          { label: "Total Federal Tax", value: "$" + formatNumber(Math.round(tax)) },
          { label: "After-Tax Income", value: "$" + formatNumber(Math.round(income - tax)) },
        ],
      };
    },
  }],
  relatedSlugs: ["effective-tax-rate-calculator", "estimated-tax-calculator"],
  faq: [
    { question: "What is the difference between marginal and effective tax rate?", answer: "Your marginal rate is the tax on your last dollar of income, while your effective rate is the total tax divided by total income." },
    { question: "How do tax brackets work?", answer: "Each bracket taxes only the income within that range. Moving into a higher bracket does not increase the rate on all your income." },
  ],
  formula: "Marginal Rate = Rate of the bracket containing your last dollar of income",
};
