import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ethiopiaSalaryCalculator: CalculatorDefinition = {
  slug: "ethiopia-salary-calculator",
  title: "Ethiopia Salary Calculator",
  description: "Free Ethiopia gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ethiopia salary calculator", "ethiopia gross to net calculator", "ethiopia take home pay"],
  variants: [{
    id: "standard",
    name: "Ethiopia Salary",
    description: "Free Ethiopia gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "ETB", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.07;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:7200,r:0},{l:19800,r:0.1},{l:38400,r:0.15},{l:63000,r:0.2},{l:93600,r:0.25},{l:130800,r:0.3},{l:Infinity,r:0.35}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "ETB" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "ETB" + formatNumber(gross) },
            { label: "Social contributions (7.0%)", value: "ETB" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "ETB" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "ETB" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "ETB" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Ethiopia?", answer: "Your total deductions include social contributions (7.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Ethiopia?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (7.0%) - Income Tax (progressive)",
};
