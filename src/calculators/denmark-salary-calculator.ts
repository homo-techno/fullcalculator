import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const denmarkSalaryCalculator: CalculatorDefinition = {
  slug: "denmark-salary-calculator",
  title: "Denmark Salary Calculator",
  description: "Free Denmark gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["denmark salary calculator", "denmark gross to net calculator", "denmark take home pay"],
  variants: [{
    id: "standard",
    name: "Denmark Salary",
    description: "Free Denmark gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "kr", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.08;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:49700,r:0},{l:588900,r:0.37},{l:Infinity,r:0.52}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "kr" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "kr" + formatNumber(gross) },
            { label: "Social contributions (8.0%)", value: "kr" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "kr" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "kr" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "kr" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Denmark?", answer: "Your total deductions include social contributions (8.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Denmark?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (8.0%) - Income Tax (progressive)",
};
