import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bucketStrategyAllocatorCalculator: CalculatorDefinition = {
  slug: "bucket-strategy-allocator-calculator",
  title: "Bucket Strategy Allocator Calculator",
  description: "Allocate your retirement portfolio across short-term, medium-term, and long-term buckets to manage cash flow and reduce sequence-of-returns risk.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["bucket strategy","retirement bucket plan","time segmentation strategy","retirement allocation buckets"],
  variants: [{
    id: "standard",
    name: "Bucket Strategy Allocator",
    description: "Allocate your retirement portfolio across short-term, medium-term, and long-term buckets to manage cash flow and reduce sequence-of-returns risk.",
    fields: [
      { name: "totalPortfolio", label: "Total Portfolio Value ($)", type: "number", min: 50000, max: 20000000, defaultValue: 1000000 },
      { name: "annualSpending", label: "Annual Spending Need ($)", type: "number", min: 10000, max: 500000, defaultValue: 50000 },
      { name: "shortTermYears", label: "Short-Term Bucket (Years)", type: "number", min: 1, max: 5, defaultValue: 2 },
      { name: "medTermYears", label: "Medium-Term Bucket (Years)", type: "number", min: 2, max: 10, defaultValue: 5 },
      { name: "medTermReturn", label: "Medium-Term Expected Return (%)", type: "number", min: 1, max: 10, defaultValue: 4 },
      { name: "longTermReturn", label: "Long-Term Expected Return (%)", type: "number", min: 3, max: 15, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const total = inputs.totalPortfolio as number;
    const spending = inputs.annualSpending as number;
    const shortYrs = inputs.shortTermYears as number;
    const medYrs = inputs.medTermYears as number;
    const medReturn = inputs.medTermReturn as number;
    const longReturn = inputs.longTermReturn as number;
    const shortBucket = spending * shortYrs;
    const medBucket = spending * medYrs;
    const longBucket = Math.max(0, total - shortBucket - medBucket);
    const shortPct = total > 0 ? (shortBucket / total) * 100 : 0;
    const medPct = total > 0 ? (medBucket / total) * 100 : 0;
    const longPct = total > 0 ? (longBucket / total) * 100 : 0;
    const longGrowth5yr = longBucket * Math.pow(1 + longReturn / 100, 5);
    return {
      primary: { label: "Long-Term Growth Bucket", value: "$" + formatNumber(Math.round(longBucket)) },
      details: [
        { label: "Short-Term Cash Bucket", value: "$" + formatNumber(Math.round(shortBucket)) + " (" + formatNumber(Math.round(shortPct)) + "%)" },
        { label: "Medium-Term Bond Bucket", value: "$" + formatNumber(Math.round(medBucket)) + " (" + formatNumber(Math.round(medPct)) + "%)" },
        { label: "Long-Term Growth Bucket", value: "$" + formatNumber(Math.round(longBucket)) + " (" + formatNumber(Math.round(longPct)) + "%)" },
        { label: "Growth Bucket in 5 Years", value: "$" + formatNumber(Math.round(longGrowth5yr)) },
        { label: "Total Coverage", value: formatNumber(shortYrs + medYrs) + " years before growth bucket" }
      ]
    };
  },
  }],
  relatedSlugs: ["sequence-of-returns-risk-calculator","retirement-portfolio-withdrawal-calculator"],
  faq: [
    { question: "What is the bucket strategy for retirement?", answer: "The bucket strategy divides your retirement portfolio into three time-based segments: a short-term bucket of cash or equivalents for 1 to 2 years of expenses, a medium-term bucket of bonds and stable investments for 3 to 7 years, and a long-term growth bucket of stocks for beyond 7 years." },
    { question: "How does the bucket strategy reduce risk?", answer: "By keeping several years of spending in safe, liquid investments, you avoid selling stocks during market downturns. The growth bucket has years to recover from volatility before you need to tap it." },
    { question: "How often should I refill the buckets?", answer: "Typically you refill the short-term bucket annually by selling from the medium-term bucket when bonds perform well, or from the growth bucket during strong market years. Some advisors refill on a set schedule while others use market conditions as a guide." },
  ],
  formula: "Short-Term Bucket = Annual Spending x Short-Term Years; Medium-Term Bucket = Annual Spending x Medium-Term Years; Long-Term Bucket = Total Portfolio - Short Bucket - Medium Bucket",
};
