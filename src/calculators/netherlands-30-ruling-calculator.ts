import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const netherlands30RulingCalculator: CalculatorDefinition = {
  slug: "netherlands-30-ruling-calculator",
  title: "Netherlands 30% Ruling Calculator",
  description: "Free Netherlands 30% ruling calculator. Calculate tax savings for qualifying expats with the 30% tax-free allowance.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["netherlands 30 ruling calculator", "30 percent ruling calculator", "dutch expat tax calculator"],
  variants: [{
    id: "standard",
    name: "Netherlands 30% Ruling",
    description: "Free Netherlands 30% ruling calculator",
    fields: [
      { name: "gross", label: "Annual Gross Salary", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
      const gross = inputs.gross as number;
      if (!gross || gross <= 0) return null;
      const ruling = gross * 0.30;
      const taxable = gross - ruling;
      const brackets = [{l:75518,r:0.3697},{l:Infinity,r:0.4950}];
      let taxWith = 0, rem1 = taxable, prev1 = 0;
      for (const s of brackets) { const t = Math.min(rem1, s.l - prev1); if (t <= 0) break; taxWith += t * s.r; rem1 -= t; prev1 = s.l; }
      let taxWithout = 0, rem2 = gross, prev2 = 0;
      for (const s of brackets) { const t = Math.min(rem2, s.l - prev2); if (t <= 0) break; taxWithout += t * s.r; rem2 -= t; prev2 = s.l; }
      const saving = taxWithout - taxWith;
      return {
        primary: { label: "Annual Tax Saving", value: "€" + formatNumber(saving) },
        details: [
          { label: "Tax-free allowance (30%)", value: "€" + formatNumber(ruling) },
          { label: "Taxable salary", value: "€" + formatNumber(taxable) },
          { label: "Tax with 30% ruling", value: "€" + formatNumber(taxWith) },
          { label: "Tax without ruling", value: "€" + formatNumber(taxWithout) },
          { label: "Monthly net (with ruling)", value: "€" + formatNumber((gross - taxWith) / 12) },
        ],
        note: "30% ruling lasts max 5 years. Minimum salary requirement: €46,107 (2025), or €35,048 for under-30 with MSc. Capped at €233,000 from 2024.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is the 30% ruling?", answer: "A Dutch tax benefit for expat workers: 30% of gross salary is tax-free for up to 5 years. Requires minimum salary of €46,107 and specific expertise not readily available in NL." },
    { question: "Is the 30% ruling capped?", answer: "From 2024, the ruling is capped at the Balkenende norm (~€233,000). The first 20 months: 30%, next 20 months: 20%, final 20 months: 10%." },
  ],
  formula: "Tax saving = Tax on full salary - Tax on (salary × 70%)",
};
