import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pakistanSalaryCalculator: CalculatorDefinition = {
  slug: "pakistan-salary-calculator",
  title: "Pakistan Salary Calculator",
  description: "Free Pakistan gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["pakistan salary calculator", "pakistan gross to net calculator", "pakistan take home pay"],
  variants: [{
    id: "standard",
    name: "Pakistan Salary",
    description: "Free Pakistan gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "Rs", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.08;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:600000,r:0},{l:1200000,r:0.01},{l:2200000,r:0.11},{l:3200000,r:0.23},{l:4100000,r:0.3},{l:Infinity,r:0.35}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "Rs" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "Rs" + formatNumber(gross) },
            { label: "Social contributions (8.0%)", value: "Rs" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "Rs" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "Rs" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "Rs" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Pakistan?", answer: "Your total deductions include social contributions (8.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Pakistan?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (8.0%) - Income Tax (progressive)",
};
