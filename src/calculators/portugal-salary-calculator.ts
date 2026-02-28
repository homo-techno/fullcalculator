import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const portugalSalaryCalculator: CalculatorDefinition = {
  slug: "portugal-salary-calculator",
  title: "Portugal Salary Calculator",
  description: "Free Portugal gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["portugal salary calculator", "portugal gross to net calculator", "portugal take home pay"],
  variants: [{
    id: "standard",
    name: "Portugal Salary",
    description: "Free Portugal gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "€", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.11;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:7703,r:0.1325},{l:11623,r:0.18},{l:16472,r:0.23},{l:21321,r:0.26},{l:27146,r:0.3275},{l:39791,r:0.37},{l:51997,r:0.435},{l:81199,r:0.45},{l:Infinity,r:0.48}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "€" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "€" + formatNumber(gross) },
            { label: "Social contributions (11.0%)", value: "€" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "€" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "€" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "€" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Portugal?", answer: "Your total deductions include social contributions (11.0% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Portugal?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (11.0%) - Income Tax (progressive)",
};
