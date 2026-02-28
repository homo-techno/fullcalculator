import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const switzerlandSalaryCalculator: CalculatorDefinition = {
  slug: "switzerland-salary-calculator",
  title: "Switzerland Salary Calculator",
  description: "Free Switzerland gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["switzerland salary calculator", "switzerland gross to net calculator", "switzerland take home pay"],
  variants: [{
    id: "standard",
    name: "Switzerland Salary",
    description: "Free Switzerland gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "CHF", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.0625;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:17800,r:0},{l:31600,r:0.01},{l:55200,r:0.02},{l:103600,r:0.05},{l:176000,r:0.09},{l:Infinity,r:0.115}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "CHF" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "CHF" + formatNumber(gross) },
            { label: "Social contributions (6.3%)", value: "CHF" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "CHF" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "CHF" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "CHF" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Switzerland?", answer: "Your total deductions include social contributions (6.3% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Switzerland?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (6.3%) - Income Tax (progressive)",
};
