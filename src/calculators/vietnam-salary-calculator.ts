import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vietnamSalaryCalculator: CalculatorDefinition = {
  slug: "vietnam-salary-calculator",
  title: "Vietnam Salary Calculator",
  description: "Free Vietnam gross to net salary calculator. Calculate take-home pay after tax and social contributions.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vietnam salary calculator", "vietnam gross to net calculator", "vietnam take home pay"],
  variants: [{
    id: "standard",
    name: "Vietnam Salary",
    description: "Free Vietnam gross to net salary calculator",
    fields: [
      { name: "gross", label: "Monthly Gross Salary", type: "number", prefix: "₫", min: 0 },
    ],
    calculate: (inputs) => {
        const gross = inputs.gross as number;
        if (!gross || gross <= 0) return null;
        const socialRate = 0.105;
        const social = gross * socialRate;
        const annual = (gross - social) * 12;
        const brackets = [{l:60000000,r:0.05},{l:120000000,r:0.1},{l:216000000,r:0.15},{l:384000000,r:0.2},{l:624000000,r:0.25},{l:960000000,r:0.3},{l:Infinity,r:0.35}];
        let tax = 0, rem = annual, prev = 0;
        for (const s of brackets) { const t = Math.min(rem, s.l - prev); if (t <= 0) break; tax += t * s.r; rem -= t; prev = s.l; }
        const monthlyTax = tax / 12;
        const net = gross - social - monthlyTax;
        return {
          primary: { label: "Monthly Net Salary", value: "₫" + formatNumber(net) },
          details: [
            { label: "Gross salary", value: "₫" + formatNumber(gross) },
            { label: "Social contributions (10.5%)", value: "₫" + formatNumber(social) },
            { label: "Income tax (monthly)", value: "₫" + formatNumber(monthlyTax) },
            { label: "Total deductions", value: "₫" + formatNumber(social + monthlyTax) },
            { label: "Annual net", value: "₫" + formatNumber(net * 12) },
          ],
        };
      },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "How much tax do I pay on my salary in Vietnam?", answer: "Your total deductions include social contributions (10.5% employee share) plus progressive income tax." },
    { question: "What is the take-home pay in Vietnam?", answer: "Take-home pay = Gross salary minus social contributions minus income tax. Use this calculator for an estimate." },
  ],
  formula: "Net = Gross - Social (10.5%) - Income Tax (progressive)",
};
