import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const usaCapitalGainsTaxCalculator: CalculatorDefinition = {
  slug: "usa-capital-gains-tax-calculator",
  title: "USA Capital Gains Tax Calculator",
  description: "Free capital gains tax calculator. Calculate short-term and long-term capital gains tax with 2025 brackets and NIIT.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["capital gains tax calculator", "stock tax calculator", "investment tax calculator usa"],
  variants: [{
    id: "standard",
    name: "USA Capital Gains Tax",
    description: "Free capital gains tax calculator",
    fields: [
      { name: "gain", label: "Capital Gain", type: "number", prefix: "$", min: 0 },
      { name: "holdingPeriod", label: "Holding Period", type: "select", options: [{ label: "Long-term (>1 year)", value: "long" }, { label: "Short-term (≤1 year)", value: "short" }], defaultValue: "long" },
      { name: "income", label: "Other Taxable Income", type: "number", prefix: "$", defaultValue: 0, min: 0 },
      { name: "status", label: "Filing Status", type: "select", options: [{ label: "Single", value: "single" }, { label: "Married Filing Jointly", value: "married" }], defaultValue: "single" },
    ],
    calculate: (inputs) => {
      const gain = inputs.gain as number;
      const period = inputs.status as string;
      const otherIncome = (inputs.income as number) || 0;
      const status = inputs.status as string;
      const isLong = inputs.holdingPeriod === "long";
      if (!gain || gain <= 0) return null;
      let tax = 0;
      if (!isLong) {
        const brackets = status === "married" ?
          [{l:23850,r:0.10},{l:96950,r:0.12},{l:206700,r:0.22},{l:394600,r:0.24},{l:501050,r:0.32},{l:751600,r:0.35},{l:Infinity,r:0.37}] :
          [{l:11925,r:0.10},{l:48475,r:0.12},{l:103350,r:0.22},{l:197300,r:0.24},{l:250525,r:0.32},{l:626350,r:0.35},{l:Infinity,r:0.37}];
        let rem = gain + otherIncome, prev = 0, totalTaxAll = 0, totalTaxIncome = 0;
        for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; totalTaxAll += t * b.r; rem -= t; prev = b.l; }
        rem = otherIncome; prev = 0;
        for (const b of brackets) { const t = Math.min(rem, b.l - prev); if (t <= 0) break; totalTaxIncome += t * b.r; rem -= t; prev = b.l; }
        tax = totalTaxAll - totalTaxIncome;
      } else {
        const thresholds = status === "married" ? [96700, 600050] : [48350, 533400];
        const totalIncome = gain + otherIncome;
        if (totalIncome <= thresholds[0]) { tax = 0; }
        else if (totalIncome <= thresholds[1]) { tax = Math.max(0, totalIncome - thresholds[0]) * 0.15; tax = Math.min(tax, gain * 0.15); }
        else { const at20 = Math.max(0, totalIncome - thresholds[1]); const at15 = gain - at20; tax = Math.min(at20, gain) * 0.20 + Math.max(0, at15) * 0.15; }
      }
      const niitThreshold = status === "married" ? 250000 : 200000;
      const niit = Math.max(0, (gain + otherIncome) - niitThreshold) * 0.038;
      const niitOnGain = Math.min(niit, gain * 0.038);
      return {
        primary: { label: "Capital Gains Tax", value: "$" + formatNumber(tax + niitOnGain) },
        details: [
          { label: "Base tax", value: "$" + formatNumber(tax) },
          { label: "NIIT (3.8%)", value: "$" + formatNumber(niitOnGain) },
          { label: "Effective rate on gain", value: formatNumber(((tax + niitOnGain) / gain) * 100) + "%" },
          { label: "After-tax proceeds", value: "$" + formatNumber(gain - tax - niitOnGain) },
        ],
        note: isLong ? "Long-term rates: 0%, 15%, or 20%. NIIT: 3.8% above $200K/$250K AGI." : "Short-term gains taxed at ordinary income rates.",
      };
    },
  }],
  relatedSlugs: ["tax-calculator", "salary-calculator"],
  faq: [
    { question: "What are long-term capital gains rates for 2025?", answer: "0% for income up to $48,350 (single) / $96,700 (MFJ). 15% up to $533,400 / $600,050. 20% above that. Plus potential 3.8% NIIT." },
    { question: "What is NIIT?", answer: "Net Investment Income Tax is an additional 3.8% tax on investment income (including capital gains) for AGI above $200,000 (single) or $250,000 (married filing jointly)." },
  ],
  formula: "Long-term: 0% / 15% / 20% based on total income. Short-term: ordinary income rates. NIIT: 3.8% above threshold.",
};
