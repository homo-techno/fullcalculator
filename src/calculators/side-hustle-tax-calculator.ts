import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sideHustleTaxCalculator: CalculatorDefinition = {
  slug: "side-hustle-tax-calculator",
  title: "Side Hustle Tax Calculator",
  description: "Estimate taxes owed on side hustle and freelance income including self-employment tax.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["side hustle taxes", "freelance tax calculator", "self employment tax"],
  variants: [{
    id: "standard",
    name: "Side Hustle Tax",
    description: "Estimate taxes owed on side hustle and freelance income including self-employment tax",
    fields: [
      { name: "sideIncome", label: "Annual Side Hustle Income", type: "number", prefix: "$", min: 100, max: 500000, defaultValue: 15000 },
      { name: "expenses", label: "Business Expenses", type: "number", prefix: "$", min: 0, max: 200000, defaultValue: 2000 },
      { name: "taxBracket", label: "Federal Tax Bracket", type: "select", options: [{value:"12",label:"12%"},{value:"22",label:"22%"},{value:"24",label:"24%"},{value:"32",label:"32%"}], defaultValue: "22" },
      { name: "stateTax", label: "State Tax Rate", type: "number", suffix: "%", min: 0, max: 13, defaultValue: 5 },
    ],
    calculate: (inputs) => {
      const income = inputs.sideIncome as number;
      const expenses = inputs.expenses as number;
      const bracket = parseInt(inputs.taxBracket as string) || 22;
      const stateTax = inputs.stateTax as number;
      if (!income || income <= 0) return null;
      const netProfit = income - expenses;
      const selfEmploymentTax = netProfit * 0.9235 * 0.153;
      const federalTax = netProfit * (bracket / 100);
      const stateAmount = netProfit * (stateTax / 100);
      const totalTax = selfEmploymentTax + federalTax + stateAmount;
      const effectiveRate = (totalTax / income) * 100;
      const quarterlyPayment = totalTax / 4;
      return {
        primary: { label: "Estimated Total Tax", value: "$" + formatNumber(Math.round(totalTax)) },
        details: [
          { label: "Self-Employment Tax", value: "$" + formatNumber(Math.round(selfEmploymentTax)) },
          { label: "Federal Income Tax", value: "$" + formatNumber(Math.round(federalTax)) },
          { label: "State Tax", value: "$" + formatNumber(Math.round(stateAmount)) },
          { label: "Quarterly Payment", value: "$" + formatNumber(Math.round(quarterlyPayment)) },
        ],
      };
    },
  }],
  relatedSlugs: ["house-hacking-calculator", "cash-envelope-calculator"],
  faq: [
    { question: "Do I have to pay taxes on side hustle income?", answer: "Yes. All net income over $400 from self-employment is subject to both income tax and self-employment tax (15.3%)." },
    { question: "What is self-employment tax?", answer: "Self-employment tax is 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of net self-employment income." },
  ],
  formula: "Total Tax = Self-Employment Tax (15.3% of 92.35% net) + Federal Tax + State Tax",
};
