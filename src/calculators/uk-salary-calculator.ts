import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ukSalaryCalculator: CalculatorDefinition = {
  slug: "uk-salary-calculator",
  title: "United Kingdom Salary Calculator",
  description: "Free United Kingdom gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["united kingdom salary calculator", "uk gross to net calculator", "united kingdom take home pay"],
  variants: [{
    id: "standard",
    name: "United Kingdom Salary",
    description: "Free United Kingdom gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "£", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.08;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:12570,r:0},{l:50270,r:0.2},{l:125140,r:0.4},{l:Infinity,r:0.45}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "£" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "£" + formatNumber(gross) },
            { label: "Social contributions (8.0%)", value: "£" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "£" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "£" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "£" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in United Kingdom?", answer: "Your total deductions include social contributions (8.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in United Kingdom?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (8.0%) - Income Tax (progressive)",
};
