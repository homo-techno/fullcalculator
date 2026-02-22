import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const enterpriseValueCalculator: CalculatorDefinition = {
  slug: "enterprise-value-calculator",
  title: "Enterprise Value Calculator",
  description: "Free enterprise value (EV) calculator. Calculate a company's total value including debt, cash, and market cap for M&A analysis.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["enterprise value", "EV", "company valuation", "EV/EBITDA", "takeover value", "firm value"],
  variants: [
    {
      id: "basic",
      name: "Enterprise Value",
      description: "Calculate enterprise value from components",
      fields: [
        { name: "marketCap", label: "Market Capitalization", type: "number", prefix: "$", placeholder: "e.g. 50000000000" },
        { name: "totalDebt", label: "Total Debt", type: "number", prefix: "$", placeholder: "e.g. 10000000000" },
        { name: "cash", label: "Cash & Cash Equivalents", type: "number", prefix: "$", placeholder: "e.g. 5000000000" },
        { name: "preferredStock", label: "Preferred Stock (optional)", type: "number", prefix: "$", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "minorityInterest", label: "Minority Interest (optional)", type: "number", prefix: "$", placeholder: "e.g. 0", defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const mc = inputs.marketCap as number;
        const debt = inputs.totalDebt as number;
        const cash = inputs.cash as number;
        const pref = (inputs.preferredStock as number) || 0;
        const minority = (inputs.minorityInterest as number) || 0;
        if (!mc || debt === undefined || cash === undefined) return null;
        const ev = mc + debt - cash + pref + minority;
        return {
          primary: { label: "Enterprise Value", value: `$${formatNumber(ev)}` },
          details: [
            { label: "Market cap", value: `$${formatNumber(mc)}` },
            { label: "Total debt", value: `$${formatNumber(debt)}` },
            { label: "Cash", value: `$${formatNumber(cash)}` },
            { label: "Net debt", value: `$${formatNumber(debt - cash)}` },
            { label: "EV / Market Cap", value: `${formatNumber(ev / mc, 2)}x` },
          ],
        };
      },
    },
    {
      id: "evToEbitda",
      name: "EV/EBITDA",
      description: "Calculate EV/EBITDA multiple",
      fields: [
        { name: "enterpriseValue", label: "Enterprise Value", type: "number", prefix: "$", placeholder: "e.g. 55000000000" },
        { name: "ebitda", label: "EBITDA", type: "number", prefix: "$", placeholder: "e.g. 5000000000" },
      ],
      calculate: (inputs) => {
        const ev = inputs.enterpriseValue as number;
        const ebitda = inputs.ebitda as number;
        if (!ev || !ebitda) return null;
        const multiple = ev / ebitda;
        return {
          primary: { label: "EV/EBITDA", value: `${formatNumber(multiple, 2)}x` },
          details: [
            { label: "Enterprise value", value: `$${formatNumber(ev)}` },
            { label: "EBITDA", value: `$${formatNumber(ebitda)}` },
            { label: "Interpretation", value: multiple < 10 ? "Potentially undervalued" : multiple > 20 ? "Potentially overvalued" : "Moderate valuation" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["market-cap-calculator", "debt-to-equity-calculator", "pe-ratio-calculator"],
  faq: [
    { question: "What is enterprise value?", answer: "Enterprise value (EV) represents the total value of a company, including both equity and debt holders' claims minus cash. It is often considered a more comprehensive measure than market cap alone because it accounts for capital structure." },
    { question: "Why subtract cash from enterprise value?", answer: "Cash is subtracted because an acquirer effectively gets the company's cash upon purchase, reducing the net cost of acquisition. Enterprise value represents the theoretical takeover price." },
    { question: "What is a good EV/EBITDA ratio?", answer: "EV/EBITDA varies by industry. Generally, below 10 may indicate undervaluation, 10-15 is moderate, and above 15-20 may suggest overvaluation. Capital-intensive industries typically have lower ratios." },
  ],
  formula: "EV = Market Cap + Total Debt - Cash + Preferred Stock + Minority Interest",
};
