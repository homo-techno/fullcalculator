import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const iranSalaryCalculator: CalculatorDefinition = {
  slug: "iran-salary-calculator",
  title: "Iran Salary Calculator",
  description: "Free Iran gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["iran salary calculator", "iran gross to net calculator", "iran take home pay"],
  variants: [{
    id: "standard",
    name: "Iran Salary",
    description: "Free Iran gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "IRR", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.07;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:2880000000000,r:0},{l:4320000000000,r:0.1},{l:7200000000000,r:0.15},{l:10080000000000,r:0.2},{l:14400000000000,r:0.25},{l:20160000000000,r:0.3},{l:Infinity,r:0.35}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "IRR" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "IRR" + formatNumber(gross) },
            { label: "Social contributions (7.0%)", value: "IRR" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "IRR" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "IRR" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "IRR" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Iran?", answer: "Your total deductions include social contributions (7.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Iran?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (7.0%) - Income Tax (progressive)",
};
