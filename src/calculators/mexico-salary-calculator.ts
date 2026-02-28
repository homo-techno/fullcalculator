import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mexicoSalaryCalculator: CalculatorDefinition = {
  slug: "mexico-salary-calculator",
  title: "Mexico Salary Calculator",
  description: "Free Mexico gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["mexico salary calculator", "mexico gross to net calculator", "mexico take home pay"],
  variants: [{
    id: "standard",
    name: "Mexico Salary",
    description: "Free Mexico gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "MX$", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.025;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:8952.48,r:0.0192},{l:75984.6,r:0.064},{l:133536.12,r:0.1088},{l:155229.84,r:0.16},{l:185852.52,r:0.1792},{l:374837.88,r:0.2136},{l:590796,r:0.2352},{l:1127926.8,r:0.3},{l:1503902.4,r:0.32},{l:4511707.32,r:0.34},{l:Infinity,r:0.35}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "MX$" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "MX$" + formatNumber(gross) },
            { label: "Social contributions (2.5%)", value: "MX$" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "MX$" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "MX$" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "MX$" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Mexico?", answer: "Your total deductions include social contributions (2.5% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Mexico?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (2.5%) - Income Tax (progressive)",
};
