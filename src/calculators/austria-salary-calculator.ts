import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const austriaSalaryCalculator: CalculatorDefinition = {
  slug: "austria-salary-calculator",
  title: "Austria Salary Calculator",
  description: "Free Austria gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["austria salary calculator", "austria gross to net calculator", "austria take home pay"],
  variants: [{
    id: "standard",
    name: "Austria Salary",
    description: "Free Austria gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.18;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:12816,r:0},{l:21818,r:0.2},{l:35218,r:0.3},{l:69218,r:0.4},{l:103718,r:0.48},{l:1000000,r:0.5},{l:Infinity,r:0.55}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "€" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "€" + formatNumber(gross) },
            { label: "Social contributions (18.0%)", value: "€" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "€" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "€" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "€" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Austria?", answer: "Your total deductions include social contributions (18.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Austria?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (18.0%) - Income Tax (progressive)",
};
