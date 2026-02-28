import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const czechRepublicSalaryCalculator: CalculatorDefinition = {
  slug: "czech-republic-salary-calculator",
  title: "Czech Republic Salary Calculator",
  description: "Free Czech Republic gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["czech republic salary calculator", "czech-republic gross to net calculator", "czech republic take home pay"],
  variants: [{
    id: "standard",
    name: "Czech Republic Salary",
    description: "Free Czech Republic gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "Kč", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.11;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:1935552,r:0.15},{l:Infinity,r:0.23}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "Kč" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "Kč" + formatNumber(gross) },
            { label: "Social contributions (11.0%)", value: "Kč" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "Kč" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "Kč" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "Kč" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Czech Republic?", answer: "Your total deductions include social contributions (11.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Czech Republic?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (11.0%) - Income Tax (progressive)",
};
