import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const polandSalaryCalculator: CalculatorDefinition = {
  slug: "poland-salary-calculator",
  title: "Poland Salary Calculator",
  description: "Free Poland gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["poland salary calculator", "poland gross to net calculator", "poland take home pay"],
  variants: [{
    id: "standard",
    name: "Poland Salary",
    description: "Free Poland gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "zł", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.1371;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:120000,r:0.12},{l:Infinity,r:0.32}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "zł" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "zł" + formatNumber(gross) },
            { label: "Social contributions (13.7%)", value: "zł" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "zł" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "zł" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "zł" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Poland?", answer: "Your total deductions include social contributions (13.7% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Poland?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (13.7%) - Income Tax (progressive)",
};
