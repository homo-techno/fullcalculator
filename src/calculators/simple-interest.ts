import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const simpleInterestCalculator: CalculatorDefinition = {
  slug: "simple-interest-calculator",
  title: "Simple Interest Calculator",
  description: "Free simple interest calculator. Calculate simple interest on loans or savings using the formula I = P × R × T.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["simple interest calculator", "simple interest formula", "interest calculator", "I=PRT calculator", "basic interest"],
  variants: [
    {
      id: "calculate",
      name: "Calculate Simple Interest",
      fields: [
        { name: "principal", label: "Principal Amount", type: "number", placeholder: "e.g. 10000", prefix: "$" },
        { name: "rate", label: "Annual Interest Rate", type: "number", placeholder: "e.g. 5", suffix: "%" },
        { name: "time", label: "Time (Years)", type: "number", placeholder: "e.g. 3" },
      ],
      calculate: (inputs) => {
        const p = inputs.principal as number;
        const r = (inputs.rate as number) || 0;
        const t = inputs.time as number;
        if (!p || !t) return null;
        const interest = p * (r / 100) * t;
        const total = p + interest;
        return {
          primary: { label: "Simple Interest", value: `$${formatNumber(interest)}` },
          details: [
            { label: "Total amount", value: `$${formatNumber(total)}` },
            { label: "Principal", value: `$${formatNumber(p)}` },
            { label: "Daily interest", value: `$${formatNumber(interest / (t * 365))}` },
            { label: "Monthly interest", value: `$${formatNumber(interest / (t * 12))}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compound-interest-calculator", "loan-calculator", "investment-calculator"],
  faq: [
    { question: "What is simple interest?", answer: "Simple interest is calculated only on the original principal: I = P × R × T. Unlike compound interest, it doesn't earn interest on interest. It's used for short-term loans and some bonds." },
    { question: "Simple vs compound interest?", answer: "Simple: interest on principal only. Compound: interest on principal + accumulated interest. $1000 at 5% for 3 years: Simple = $1150, Compound (annual) = $1157.63." },
  ],
  formula: "I = P × R × T | Total = P + I",
};
