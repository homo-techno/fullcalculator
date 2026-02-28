import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const indonesiaSalaryCalculator: CalculatorDefinition = {
  slug: "indonesia-salary-calculator",
  title: "Indonesia Salary Calculator",
  description: "Free Indonesia gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["indonesia salary calculator", "indonesia gross to net calculator", "indonesia take home pay"],
  variants: [{
    id: "standard",
    name: "Indonesia Salary",
    description: "Free Indonesia gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "Rp", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.04;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:60000000,r:0.05},{l:250000000,r:0.15},{l:500000000,r:0.25},{l:5000000000,r:0.3},{l:Infinity,r:0.35}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "Rp" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "Rp" + formatNumber(gross) },
            { label: "Social contributions (4.0%)", value: "Rp" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "Rp" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "Rp" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "Rp" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Indonesia?", answer: "Your total deductions include social contributions (4.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Indonesia?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (4.0%) - Income Tax (progressive)",
};
