import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bangladeshSalaryCalculator: CalculatorDefinition = {
  slug: "bangladesh-salary-calculator",
  title: "Bangladesh Salary Calculator",
  description: "Free Bangladesh gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bangladesh salary calculator", "bangladesh gross to net calculator", "bangladesh take home pay"],
  variants: [{
    id: "standard",
    name: "Bangladesh Salary",
    description: "Free Bangladesh gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "৳", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.075;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:375000,r:0},{l:675000,r:0.1},{l:1075000,r:0.15},{l:1575000,r:0.2},{l:3575000,r:0.25},{l:Infinity,r:0.3}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "৳" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "৳" + formatNumber(gross) },
            { label: "Social contributions (7.5%)", value: "৳" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "৳" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "৳" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "৳" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Bangladesh?", answer: "Your total deductions include social contributions (7.5% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Bangladesh?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (7.5%) - Income Tax (progressive)",
};
