import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const spousalSupportDurationCalculator: CalculatorDefinition = {
  slug: "spousal-support-duration-calculator",
  title: "Spousal Support Duration Calculator",
  description: "Estimate the duration and amount of spousal support based on marriage length and income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["spousal support duration", "alimony calculator", "spousal maintenance"],
  variants: [{
    id: "standard",
    name: "Spousal Support Duration",
    description: "Estimate the duration and amount of spousal support based on marriage length and income",
    fields: [
      { name: "marriageYears", label: "Years of Marriage", type: "number", min: 1, max: 60, defaultValue: 10 },
      { name: "payerIncome", label: "Payer Annual Income", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 120000 },
      { name: "payeeIncome", label: "Payee Annual Income", type: "number", prefix: "$", min: 0, max: 5000000, defaultValue: 40000 },
    ],
    calculate: (inputs) => {
      const years = inputs.marriageYears as number;
      const payer = inputs.payerIncome as number;
      const payee = inputs.payeeIncome as number;
      if (!years || !payer || payer <= 0) return null;
      const incomeDiff = payer - payee;
      if (incomeDiff <= 0) return null;
      const monthlySupport = Math.round(incomeDiff * 0.30 / 12);
      const durationMonths = Math.round(years * 0.5 * 12);
      const totalCost = monthlySupport * durationMonths;
      return {
        primary: { label: "Estimated Monthly Support", value: "$" + formatNumber(monthlySupport) },
        details: [
          { label: "Estimated Duration", value: Math.floor(durationMonths / 12) + " yrs " + (durationMonths % 12) + " mo" },
          { label: "Total Estimated Cost", value: "$" + formatNumber(totalCost) },
          { label: "Income Difference", value: "$" + formatNumber(incomeDiff) },
        ],
      };
    },
  }],
  relatedSlugs: ["back-pay-calculator", "attorney-contingency-fee-calculator"],
  faq: [
    { question: "How long does spousal support last?", answer: "Duration generally depends on the length of marriage, often lasting half the number of years married for shorter marriages." },
    { question: "How is spousal support amount determined?", answer: "Courts typically consider the income difference between spouses, length of marriage, and each party ability to be self-supporting." },
  ],
  formula: "Monthly Support = (Payer Income - Payee Income) x 30% / 12; Duration = Marriage Years x 0.5",
};
