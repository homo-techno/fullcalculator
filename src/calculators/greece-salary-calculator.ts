import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const greeceSalaryCalculator: CalculatorDefinition = {
  slug: "greece-salary-calculator",
  title: "Greece Salary Calculator",
  description: "Free Greece gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["greece salary calculator", "greece gross to net calculator", "greece take home pay"],
  variants: [{
    id: "standard",
    name: "Greece Salary",
    description: "Free Greece gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.1387;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:10000,r:0.09},{l:20000,r:0.22},{l:30000,r:0.28},{l:40000,r:0.36},{l:Infinity,r:0.44}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "€" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "€" + formatNumber(gross) },
            { label: "Social contributions (13.9%)", value: "€" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "€" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "€" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "€" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Greece?", answer: "Your total deductions include social contributions (13.9% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Greece?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (13.9%) - Income Tax (progressive)",
};
