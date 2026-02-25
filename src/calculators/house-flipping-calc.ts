import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const houseFlippingCalculator: CalculatorDefinition = {
  slug: "house-flipping-calculator",
  title: "House Flipping Profit Calculator",
  description:
    "Free house flipping profit calculator. Analyze fix-and-flip deals including purchase price, renovation costs, holding costs, and projected profit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "house flipping calculator",
    "flip profit calculator",
    "fix and flip calculator",
    "house flip roi",
    "flipping houses profit",
  ],
  variants: [
    {
      id: "flip-analysis",
      name: "Flip Deal Analysis",
      description: "Analyze a house flipping deal for profit potential",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 200000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rehabCost",
          label: "Renovation / Rehab Cost",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "afterRepairValue",
          label: "After Repair Value (ARV)",
          type: "number",
          placeholder: "e.g. 320000",
          prefix: "$",
          min: 0,
        },
        {
          name: "closingCostsBuy",
          label: "Closing Costs (Purchase)",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
          min: 0,
        },
        {
          name: "holdingMonths",
          label: "Estimated Holding Period",
          type: "select",
          options: [
            { label: "3 months", value: "3" },
            { label: "4 months", value: "4" },
            { label: "5 months", value: "5" },
            { label: "6 months", value: "6" },
            { label: "8 months", value: "8" },
            { label: "10 months", value: "10" },
            { label: "12 months", value: "12" },
          ],
          defaultValue: "5",
        },
        {
          name: "monthlyHoldingCost",
          label: "Monthly Holding Cost (loan, taxes, ins, util)",
          type: "number",
          placeholder: "e.g. 2000",
          prefix: "$",
          min: 0,
        },
        {
          name: "sellingCostPct",
          label: "Selling Costs (agent, closing)",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "%",
          min: 0,
          max: 20,
          step: 0.1,
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const purchase = inputs.purchasePrice as number;
        const rehab = inputs.rehabCost as number;
        const arv = inputs.afterRepairValue as number;
        const closingBuy = (inputs.closingCostsBuy as number) || 0;
        const months = parseInt(inputs.holdingMonths as string) || 5;
        const monthlyHolding = (inputs.monthlyHoldingCost as number) || 0;
        const sellingPct = (inputs.sellingCostPct as number) || 8;
        if (!purchase || !rehab || !arv) return null;

        const holdingCosts = monthlyHolding * months;
        const sellingCosts = arv * (sellingPct / 100);
        const totalInvestment = purchase + rehab + closingBuy + holdingCosts + sellingCosts;
        const profit = arv - totalInvestment;
        const roi = (profit / (purchase + rehab + closingBuy)) * 100;
        const profitMargin = (profit / arv) * 100;
        const seventyPercentRule = arv * 0.7 - rehab;

        return {
          primary: {
            label: "Estimated Profit",
            value: `$${formatNumber(profit)}`,
          },
          details: [
            { label: "Total investment", value: `$${formatNumber(totalInvestment)}` },
            { label: "After Repair Value (ARV)", value: `$${formatNumber(arv)}` },
            { label: "ROI", value: `${formatNumber(roi)}%` },
            { label: "Profit margin", value: `${formatNumber(profitMargin)}%` },
            { label: "Holding costs total", value: `$${formatNumber(holdingCosts)}` },
            { label: "Selling costs", value: `$${formatNumber(sellingCosts)}` },
            { label: "70% rule max purchase", value: `$${formatNumber(seventyPercentRule)}` },
          ],
        };
      },
    },
    {
      id: "arv-analysis",
      name: "70% Rule (MAO)",
      description: "Calculate Maximum Allowable Offer using the 70% rule",
      fields: [
        {
          name: "afterRepairValue",
          label: "After Repair Value (ARV)",
          type: "number",
          placeholder: "e.g. 320000",
          prefix: "$",
          min: 0,
        },
        {
          name: "rehabCost",
          label: "Estimated Rehab Cost",
          type: "number",
          placeholder: "e.g. 50000",
          prefix: "$",
          min: 0,
        },
        {
          name: "percentageRule",
          label: "ARV Percentage Rule",
          type: "select",
          options: [
            { label: "65% (conservative)", value: "65" },
            { label: "70% (standard)", value: "70" },
            { label: "75% (aggressive)", value: "75" },
          ],
          defaultValue: "70",
        },
      ],
      calculate: (inputs) => {
        const arv = inputs.afterRepairValue as number;
        const rehab = inputs.rehabCost as number;
        const pct = parseInt(inputs.percentageRule as string) || 70;
        if (!arv || !rehab) return null;

        const maxOffer = arv * (pct / 100) - rehab;
        const potentialProfit = arv - maxOffer - rehab - arv * 0.08;

        return {
          primary: {
            label: "Maximum Allowable Offer",
            value: `$${formatNumber(maxOffer)}`,
          },
          details: [
            { label: "After Repair Value", value: `$${formatNumber(arv)}` },
            { label: `ARV x ${pct}%`, value: `$${formatNumber(arv * (pct / 100))}` },
            { label: "Minus rehab costs", value: `-$${formatNumber(rehab)}` },
            { label: "Est. profit at MAO (before holding)", value: `$${formatNumber(potentialProfit)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["property-roi-calculator", "building-cost-per-sqft-calculator", "home-appreciation-rate-calculator"],
  faq: [
    {
      question: "What is the 70% rule in house flipping?",
      answer:
        "The 70% rule states that investors should pay no more than 70% of the After Repair Value (ARV) minus repair costs. For a home with $320,000 ARV and $50,000 in repairs: $320,000 x 0.70 - $50,000 = $174,000 maximum purchase price.",
    },
    {
      question: "What is a good profit margin on a house flip?",
      answer:
        "Most successful flippers aim for a minimum profit of $25,000-$30,000 or a 10-20% return on total investment. The average profit on a house flip in the U.S. is around $50,000-$70,000, but results vary greatly by market and deal quality.",
    },
    {
      question: "What are common house flipping expenses?",
      answer:
        "Key expenses include purchase price, renovation costs, closing costs (2-5% both buying and selling), agent commissions (5-6%), holding costs (loan payments, insurance, taxes, utilities), and permits. Unexpected repairs are common, so add a 10-20% contingency to rehab estimates.",
    },
  ],
  formula: "Profit = ARV - Purchase Price - Rehab - Closing Costs - Holding Costs - Selling Costs",
};
