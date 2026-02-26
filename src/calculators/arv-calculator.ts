import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const arvCalculator: CalculatorDefinition = {
  slug: "arv-calculator",
  title: "After Repair Value (ARV) Calculator",
  description:
    "Free online ARV calculator. Estimate the after repair value of a property and determine max purchase price using the 70% rule for real estate investing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ARV calculator",
    "after repair value calculator",
    "house flip calculator",
    "70 percent rule calculator",
    "real estate investment calculator",
  ],
  variants: [
    {
      id: "arv",
      name: "ARV & 70% Rule",
      description: "Calculate after repair value and max offer using the 70% rule",
      fields: [
        { name: "arv", label: "Estimated After Repair Value", type: "number", placeholder: "e.g. 300000", prefix: "$" },
        { name: "repairCost", label: "Estimated Repair Costs", type: "number", placeholder: "e.g. 40000", prefix: "$" },
        { name: "holdingCosts", label: "Holding Costs (monthly)", type: "number", placeholder: "e.g. 1500", prefix: "$" },
        { name: "holdingMonths", label: "Holding Period (months)", type: "number", placeholder: "e.g. 4" },
        { name: "closingPercent", label: "Closing & Selling Costs %", type: "number", placeholder: "e.g. 8", suffix: "%" },
      ],
      calculate: (inputs) => {
        const arv = parseFloat(inputs.arv as string) || 0;
        const repairs = parseFloat(inputs.repairCost as string) || 0;
        const holdingMonthly = parseFloat(inputs.holdingCosts as string) || 0;
        const holdingMonths = parseFloat(inputs.holdingMonths as string) || 0;
        const closingPct = parseFloat(inputs.closingPercent as string) || 0;
        if (!arv) return null;

        const maxOffer70 = arv * 0.70 - repairs;
        const totalHolding = holdingMonthly * holdingMonths;
        const closingCosts = arv * (closingPct / 100);
        const totalCosts = repairs + totalHolding + closingCosts;
        const maxOfferDetailed = arv - totalCosts - (arv * 0.10); // 10% min profit
        const potentialProfit = arv - maxOffer70 - totalCosts;

        return {
          primary: { label: "Max Offer (70% Rule)", value: `$${formatNumber(maxOffer70)}` },
          details: [
            { label: "After repair value", value: `$${formatNumber(arv)}` },
            { label: "Repair costs", value: `$${formatNumber(repairs)}` },
            { label: "Total holding costs", value: `$${formatNumber(totalHolding)}` },
            { label: "Closing/selling costs", value: `$${formatNumber(closingCosts)}` },
            { label: "Total project costs", value: `$${formatNumber(totalCosts)}` },
            { label: "Est. profit (at 70% offer)", value: `$${formatNumber(potentialProfit)}` },
            { label: "Max offer (detailed, 10% profit)", value: `$${formatNumber(maxOfferDetailed)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mortgage-calculator", "roi-calculator", "noi-calculator"],
  faq: [
    {
      question: "What is the 70% rule in house flipping?",
      answer:
        "The 70% rule states that an investor should pay no more than 70% of a property's after repair value (ARV) minus repair costs. For example, if the ARV is $300,000 and repairs cost $40,000, the max offer is $300,000 x 0.70 - $40,000 = $170,000.",
    },
    {
      question: "How do I estimate after repair value?",
      answer:
        "ARV is estimated by looking at comparable properties (comps) that have recently sold in the same area in similar condition to what the property will be after rehab. Most investors use 3-5 comps within a 1-mile radius sold in the last 6 months.",
    },
  ],
  formula: "Max Offer = ARV x 0.70 - Repair Costs",
};
