import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const irelandSalaryCalculator: CalculatorDefinition = {
  slug: "ireland-salary-calculator",
  title: "Ireland Salary Calculator",
  description: "Free Ireland gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ireland salary calculator", "ireland gross to net calculator", "ireland take home pay"],
  variants: [{
    id: "standard",
    name: "Ireland Salary",
    description: "Free Ireland gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.04;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:44000,r:0.2},{l:Infinity,r:0.4}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "€" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "€" + formatNumber(gross) },
            { label: "Social contributions (4.0%)", value: "€" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "€" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "€" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "€" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Ireland?", answer: "Your total deductions include social contributions (4.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Ireland?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (4.0%) - Income Tax (progressive)",
};
