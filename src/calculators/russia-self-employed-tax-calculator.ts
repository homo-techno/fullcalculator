import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const russiaSelfEmployedTaxCalculator: CalculatorDefinition = {
  slug: "russia-self-employed-tax-calculator",
  title: "Russia Self-Employed Tax (NPD) Calculator",
  description: "Free Russia self-employed tax calculator. Calculate NPD (professional income tax) at 4% from individuals and 6% from businesses.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["russia self employed tax", "russia npd calculator", "samozanyatiy calculator"],
  variants: [{
    id: "standard",
    name: "Russia Self-Employed Tax (NPD)",
    description: "Free Russia self-employed tax calculator",
    fields: [
      { name: "fromIndividuals", label: "Monthly Income from Individuals", type: "number", prefix: "₽", defaultValue: 0, min: 0 },
      { name: "fromBusiness", label: "Monthly Income from Businesses", type: "number", prefix: "₽", defaultValue: 0, min: 0 },
    ],
    calculate: (inputs) => {
      const fromInd = (inputs.fromIndividuals as number) || 0;
      const fromBiz = (inputs.fromBusiness as number) || 0;
      if (!fromInd && !fromBiz) return null;
      const total = fromInd + fromBiz;
      const taxInd = fromInd * 0.04;
      const taxBiz = fromBiz * 0.06;
      const totalTax = taxInd + taxBiz;
      const annual = total * 12;
      return {
        primary: { label: "Monthly Tax", value: "₽" + formatNumber(totalTax) },
        details: [
          { label: "Tax on individual income (4%)", value: "₽" + formatNumber(taxInd) },
          { label: "Tax on business income (6%)", value: "₽" + formatNumber(taxBiz) },
          { label: "Effective rate", value: formatNumber((totalTax / total) * 100) + "%" },
          { label: "Annual income", value: "₽" + formatNumber(annual) },
          { label: "Annual tax", value: "₽" + formatNumber(totalTax * 12) },
        ],
        note: "NPD annual revenue cap: ₽2,400,000. Initial bonus deduction of ₽10,000 reduces rates to 3%/4% until exhausted.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What is NPD in Russia?", answer: "NPD (tax on professional income) is a simplified tax for self-employed: 4% on income from individuals, 6% from businesses. Annual cap: ₽2.4M. No social contributions required." },
    { question: "Who can register as self-employed in Russia?", answer: "Any individual with annual income under ₽2.4M who provides services or sells goods they produced. No employees allowed." },
  ],
  formula: "NPD = Income from individuals × 4% + Income from businesses × 6%",
};
