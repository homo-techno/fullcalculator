import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const norwaySalaryCalculator: CalculatorDefinition = {
  slug: "norway-salary-calculator",
  title: "Norway Salary Calculator",
  description: "Free Norway gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["norway salary calculator", "norway gross to net calculator", "norway take home pay"],
  variants: [{
    id: "standard",
    name: "Norway Salary",
    description: "Free Norway gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "kr", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.078;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:88250,r:0},{l:208050,r:0.22},{l:292850,r:0.237},{l:670000,r:0.26},{l:937900,r:0.356},{l:1350000,r:0.386},{l:Infinity,r:0.396}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "kr" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "kr" + formatNumber(gross) },
            { label: "Social contributions (7.8%)", value: "kr" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "kr" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "kr" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "kr" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Norway?", answer: "Your total deductions include social contributions (7.8% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Norway?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (7.8%) - Income Tax (progressive)",
};
