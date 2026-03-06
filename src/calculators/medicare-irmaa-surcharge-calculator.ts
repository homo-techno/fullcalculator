import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const medicareIrmaaSurchargeCalculator: CalculatorDefinition = {
  slug: "medicare-irmaa-surcharge-calculator",
  title: "Medicare IRMAA Surcharge Calculator",
  description: "Calculate your Medicare Income-Related Monthly Adjustment Amount (IRMAA) surcharge based on your modified adjusted gross income from two years prior.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["Medicare IRMAA","Medicare surcharge","Medicare income surcharge","IRMAA calculator"],
  variants: [{
    id: "standard",
    name: "Medicare IRMAA Surcharge",
    description: "Calculate your Medicare Income-Related Monthly Adjustment Amount (IRMAA) surcharge based on your modified adjusted gross income from two years prior.",
    fields: [
      { name: "magi", label: "Modified Adjusted Gross Income ($)", type: "number", min: 0, max: 5000000, defaultValue: 120000 },
      { name: "filingStatus", label: "Filing Status", type: "select", options: [{ value: "1", label: "Single / Head of Household" }, { value: "2", label: "Married Filing Jointly" }, { value: "3", label: "Married Filing Separately" }], defaultValue: "1" },
      { name: "basePartB", label: "Standard Part B Premium ($/mo)", type: "number", min: 100, max: 500, defaultValue: 174.70 },
      { name: "basePartD", label: "Base Part D Premium ($/mo)", type: "number", min: 0, max: 200, defaultValue: 55 },
    ],
    calculate: (inputs) => {
    const magi = inputs.magi as number;
    const status = parseInt(inputs.filingStatus as string);
    const baseB = inputs.basePartB as number;
    const baseD = inputs.basePartD as number;
    const single = [
      [103000, 0], [129000, 69.90], [161000, 174.70], [193000, 279.50], [500000, 384.30], [Infinity, 419.30]
    ];
    const joint = [
      [206000, 0], [258000, 69.90], [322000, 174.70], [386000, 279.50], [750000, 384.30], [Infinity, 419.30]
    ];
    const sep = [
      [103000, 0], [397000, 384.30], [Infinity, 419.30]
    ];
    const brackets = status === 2 ? joint : status === 3 ? sep : single;
    let partBSurcharge = 0;
    for (const [threshold, surcharge] of brackets) {
      if (magi <= threshold) { partBSurcharge = surcharge; break; }
    }
    const partDSurcharges = [0, 12.90, 33.30, 53.80, 74.20, 81.00];
    let bracketIndex = 0;
    for (let i = 0; i < brackets.length; i++) {
      if (magi <= brackets[i][0]) { bracketIndex = i; break; }
    }
    const partDSurcharge = partDSurcharges[Math.min(bracketIndex, partDSurcharges.length - 1)] || 0;
    const totalMonthlyPartB = baseB + partBSurcharge;
    const totalMonthlyPartD = baseD + partDSurcharge;
    const annualSurcharge = (partBSurcharge + partDSurcharge) * 12;
    return {
      primary: { label: "Monthly IRMAA Surcharge", value: "$" + formatNumber(Math.round((partBSurcharge + partDSurcharge) * 100) / 100) },
      details: [
        { label: "Part B Monthly (with IRMAA)", value: "$" + formatNumber(Math.round(totalMonthlyPartB * 100) / 100) },
        { label: "Part D Monthly (with IRMAA)", value: "$" + formatNumber(Math.round(totalMonthlyPartD * 100) / 100) },
        { label: "Part B Surcharge", value: "$" + formatNumber(Math.round(partBSurcharge * 100) / 100) + "/mo" },
        { label: "Part D Surcharge", value: "$" + formatNumber(Math.round(partDSurcharge * 100) / 100) + "/mo" },
        { label: "Annual IRMAA Cost", value: "$" + formatNumber(Math.round(annualSurcharge)) }
      ]
    };
  },
  }],
  relatedSlugs: ["retirement-tax-bracket-calculator","retirement-healthcare-cost-calculator"],
  faq: [
    { question: "What is IRMAA?", answer: "IRMAA is the Income-Related Monthly Adjustment Amount, a surcharge added to Medicare Part B and Part D premiums for higher-income beneficiaries. It is based on your modified adjusted gross income from two years prior." },
    { question: "How can I avoid or reduce IRMAA?", answer: "Strategies include managing income in the two years before Medicare enrollment, timing Roth conversions carefully, using qualified charitable distributions from IRAs, and filing a life-changing event appeal (Form SSA-44) if your income has decreased due to retirement, divorce, or death of a spouse." },
    { question: "Does IRMAA apply every year?", answer: "Yes, IRMAA is recalculated annually based on your most recent tax return available to Social Security (typically from two years prior). If your income drops, the surcharge may decrease or be eliminated the following year." },
  ],
  formula: "IRMAA is determined by MAGI from 2 years prior; Part B Surcharge ranges from $0 to $419.30/month based on income brackets; Part D Surcharge ranges from $0 to $81.00/month; Total Monthly = Base Premium + IRMAA Surcharge",
};
