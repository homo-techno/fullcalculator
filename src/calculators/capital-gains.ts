import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const capitalGainsCalculator: CalculatorDefinition = {
  slug: "capital-gains-calculator",
  title: "Capital Gains Tax Calculator",
  description:
    "Free capital gains tax calculator. Estimate short-term and long-term capital gains taxes on your investment profits.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["capital gains", "capital gains tax", "short-term", "long-term", "investment tax"],
  variants: [
    {
      id: "standard",
      name: "Capital Gains Tax",
      fields: [
        { name: "purchasePrice", label: "Purchase Price ($)", type: "number", placeholder: "e.g. 10000" },
        { name: "salePrice", label: "Sale Price ($)", type: "number", placeholder: "e.g. 15000" },
        { name: "holdingMonths", label: "Holding Period (months)", type: "number", placeholder: "e.g. 18" },
        { name: "taxableIncome", label: "Annual Taxable Income ($)", type: "number", placeholder: "e.g. 80000" },
        { name: "filingStatus", label: "Filing Status (1=Single, 2=Married)", type: "number", placeholder: "1 or 2" },
      ],
      calculate: (inputs) => {
        const purchasePrice = inputs.purchasePrice as number;
        const salePrice = inputs.salePrice as number;
        const holdingMonths = inputs.holdingMonths as number;
        const taxableIncome = inputs.taxableIncome as number;
        const filingStatus = inputs.filingStatus as number || 1;

        if (!purchasePrice || !salePrice || !holdingMonths) return null;

        const gain = salePrice - purchasePrice;
        const isLongTerm = holdingMonths > 12;

        let taxRate: number;
        if (!isLongTerm) {
          // Short-term: taxed as ordinary income
          if (filingStatus === 2) {
            if ((taxableIncome || 0) > 693750) taxRate = 37;
            else if ((taxableIncome || 0) > 462500) taxRate = 35;
            else if ((taxableIncome || 0) > 364200) taxRate = 32;
            else if ((taxableIncome || 0) > 190750) taxRate = 24;
            else if ((taxableIncome || 0) > 89075) taxRate = 22;
            else if ((taxableIncome || 0) > 22000) taxRate = 12;
            else taxRate = 10;
          } else {
            if ((taxableIncome || 0) > 578125) taxRate = 37;
            else if ((taxableIncome || 0) > 231250) taxRate = 35;
            else if ((taxableIncome || 0) > 182100) taxRate = 32;
            else if ((taxableIncome || 0) > 95375) taxRate = 24;
            else if ((taxableIncome || 0) > 44725) taxRate = 22;
            else if ((taxableIncome || 0) > 11000) taxRate = 12;
            else taxRate = 10;
          }
        } else {
          // Long-term rates
          if (filingStatus === 2) {
            if ((taxableIncome || 0) > 583750) taxRate = 20;
            else if ((taxableIncome || 0) > 89250) taxRate = 15;
            else taxRate = 0;
          } else {
            if ((taxableIncome || 0) > 518900) taxRate = 20;
            else if ((taxableIncome || 0) > 44625) taxRate = 15;
            else taxRate = 0;
          }
        }

        const taxAmount = gain > 0 ? gain * (taxRate / 100) : 0;
        const netProceeds = salePrice - taxAmount;
        const netGain = gain - taxAmount;
        const roi = ((gain / purchasePrice) * 100);

        return {
          primary: { label: "Estimated Tax", value: `$${formatNumber(taxAmount, 2)}` },
          details: [
            { label: "Capital Gain/Loss", value: `$${formatNumber(gain, 2)}` },
            { label: "Type", value: isLongTerm ? "Long-Term (>12 months)" : "Short-Term (≤12 months)" },
            { label: "Tax Rate", value: `${taxRate}%` },
            { label: "Net Proceeds (after tax)", value: `$${formatNumber(netProceeds, 2)}` },
            { label: "Net Gain (after tax)", value: `$${formatNumber(netGain, 2)}` },
            { label: "ROI (before tax)", value: `${formatNumber(roi, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tax-bracket-calculator", "crypto-profit-calculator", "cost-basis-calculator"],
  faq: [
    { question: "What is the difference between short-term and long-term capital gains?", answer: "Short-term capital gains (assets held 12 months or less) are taxed as ordinary income. Long-term capital gains (held over 12 months) are taxed at preferential rates of 0%, 15%, or 20% depending on your income." },
    { question: "Can I offset capital gains with losses?", answer: "Yes, capital losses can offset capital gains. If losses exceed gains, you can deduct up to $3,000 per year against ordinary income, carrying forward the rest." },
  ],
  formula: "Capital Gain = Sale Price - Purchase Price; Tax = Gain × Tax Rate (short-term: ordinary income rates; long-term: 0%/15%/20%)",
};
