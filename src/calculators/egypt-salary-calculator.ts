import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const egyptSalaryCalculator: CalculatorDefinition = {
  slug: "egypt-salary-calculator",
  title: "Egypt Salary Calculator",
  description: "Free Egypt gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["egypt salary calculator", "egypt gross to net calculator", "egypt take home pay"],
  variants: [{
    id: "standard",
    name: "Egypt Salary",
    description: "Free Egypt gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "EGP", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.11;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:40000,r:0},{l:55000,r:0.1},{l:70000,r:0.15},{l:200000,r:0.2},{l:400000,r:0.225},{l:1200000,r:0.25},{l:Infinity,r:0.275}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "EGP" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "EGP" + formatNumber(gross) },
            { label: "Social contributions (11.0%)", value: "EGP" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "EGP" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "EGP" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "EGP" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Egypt?", answer: "Your total deductions include social contributions (11.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Egypt?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (11.0%) - Income Tax (progressive)",
};
