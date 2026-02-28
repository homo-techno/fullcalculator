import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const brazilSalaryCalculator: CalculatorDefinition = {
  slug: "brazil-salary-calculator",
  title: "Brazil Salary Calculator",
  description: "Free Brazil gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["brazil salary calculator", "brazil gross to net calculator", "brazil take home pay"],
  variants: [{
    id: "standard",
    name: "Brazil Salary",
    description: "Free Brazil gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "R$", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.14;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:27108,r:0},{l:33919.8,r:0.075},{l:45012.6,r:0.15},{l:55976.16,r:0.225},{l:Infinity,r:0.275}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "R$" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "R$" + formatNumber(gross) },
            { label: "Social contributions (14.0%)", value: "R$" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "R$" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "R$" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "R$" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Brazil?", answer: "Your total deductions include social contributions (14.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Brazil?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (14.0%) - Income Tax (progressive)",
};
