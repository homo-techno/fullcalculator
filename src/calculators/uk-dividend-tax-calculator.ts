import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ukDividendTaxCalculator: CalculatorDefinition = {
  slug: "uk-dividend-tax-calculator",
  title: "UK Dividend Tax Calculator",
  description: "Free UK dividend tax calculator 2025. Calculate tax on dividends with the £500 tax-free allowance and current rates.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["uk dividend tax calculator", "dividend tax calculator 2025", "uk dividend allowance"],
  variants: [{
    id: "standard",
    name: "UK Dividend Tax",
    description: "Free UK dividend tax calculator 2025",
    fields: [
      { name: "dividends", label: "Annual Dividends", type: "number", prefix: "£", min: 0 },
      { name: "otherIncome", label: "Other Taxable Income", type: "number", prefix: "£", min: 0, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const divs = inputs.dividends as number;
      const other = (inputs.otherIncome as number) || 0;
      if (!divs || divs <= 0) return null;
      const allowance = 500;
      const taxable = Math.max(0, divs - allowance);
      const totalIncome = other + divs;
      let tax = 0;
      const basicLimit = 50270;
      const higherLimit = 125140;
      const usedByOther = other;
      let remaining = taxable;
      const basicLeft = Math.max(0, basicLimit - usedByOther);
      const higherLeft = Math.max(0, higherLimit - usedByOther - basicLeft);
      const inBasic = Math.min(remaining, basicLeft);
      remaining -= inBasic;
      const inHigher = Math.min(remaining, higherLeft > 0 ? higherLimit - basicLimit : 0);
      remaining -= inHigher;
      tax = inBasic * 0.0875 + inHigher * 0.3375 + remaining * 0.3935;
      return {
        primary: { label: "Dividend Tax", value: "£" + formatNumber(tax) },
        details: [
          { label: "Total dividends", value: "£" + formatNumber(divs) },
          { label: "Tax-free allowance", value: "£" + formatNumber(allowance) },
          { label: "Taxable dividends", value: "£" + formatNumber(taxable) },
          { label: "Effective rate", value: formatNumber(divs > 0 ? (tax / divs) * 100 : 0) + "%" },
        ],
        note: "Rates: 8.75% (basic), 33.75% (higher), 39.35% (additional). £500 tax-free allowance.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the dividend tax-free allowance?", answer: "The dividend allowance is £500 per year (2024/25). Dividends within this allowance are tax-free regardless of your tax band." },
    { question: "What are UK dividend tax rates?", answer: "Basic rate: 8.75%, Higher rate: 33.75%, Additional rate: 39.35%. These apply after the £500 allowance." },
  ],
  formula: "Dividend Tax = (Dividends - £500 allowance) × rate based on income band",
};
