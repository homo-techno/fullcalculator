import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const romaniaSalaryCalculator: CalculatorDefinition = {
  slug: "romania-salary-calculator",
  title: "Romania Salary Calculator",
  description: "Free Romania gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["romania salary calculator", "romania gross to net calculator", "romania take home pay"],
  variants: [{
    id: "standard",
    name: "Romania Salary",
    description: "Free Romania gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "lei", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.35;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:Infinity,r:0.1}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "lei" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "lei" + formatNumber(gross) },
            { label: "Social contributions (35.0%)", value: "lei" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "lei" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "lei" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "lei" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Romania?", answer: "Your total deductions include social contributions (35.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Romania?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (35.0%) - Income Tax (progressive)",
};
