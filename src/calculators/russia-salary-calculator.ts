import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const russiaSalaryCalculator: CalculatorDefinition = {
  slug: "russia-salary-calculator",
  title: "Russia Salary Calculator",
  description: "Free Russia gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["russia salary calculator", "russia gross to net calculator", "russia take home pay"],
  variants: [{
    id: "standard",
    name: "Russia Salary",
    description: "Free Russia gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "₽", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:2400000,r:0.13},{l:5000000,r:0.15},{l:20000000,r:0.18},{l:50000000,r:0.2},{l:Infinity,r:0.22}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "₽" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "₽" + formatNumber(gross) },
            { label: "Social contributions (0.0%)", value: "₽" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "₽" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "₽" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "₽" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Russia?", answer: "Your total deductions include social contributions (0.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Russia?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (0.0%) - Income Tax (progressive)",
};
