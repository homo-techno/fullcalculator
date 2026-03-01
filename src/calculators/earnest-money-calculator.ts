import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earnestMoneyCalculator: CalculatorDefinition = {
  slug: "earnest-money-calculator",
  title: "Earnest Money Calculator",
  description: "Calculate the recommended earnest money deposit for a home purchase based on market conditions and price.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["earnest money deposit", "earnest money calculator", "good faith deposit"],
  variants: [{
    id: "standard",
    name: "Earnest Money",
    description: "Calculate the recommended earnest money deposit for a home purchase based on market conditions and price",
    fields: [
      { name: "purchasePrice", label: "Home Purchase Price", type: "number", prefix: "$", min: 10000, max: 10000000, step: 5000, defaultValue: 350000 },
      { name: "marketCondition", label: "Market Condition", type: "select", options: [{value:"buyers",label:"Buyers Market"},{value:"balanced",label:"Balanced Market"},{value:"sellers",label:"Sellers Market"},{value:"hot",label:"Very Competitive"}], defaultValue: "balanced" },
      { name: "offerStrength", label: "Offer Strength", type: "select", options: [{value:"below",label:"Below Asking Price"},{value:"at",label:"At Asking Price"},{value:"above",label:"Above Asking Price"}], defaultValue: "at" },
    ],
    calculate: (inputs) => {
      const price = inputs.purchasePrice as number;
      const market = inputs.marketCondition as string;
      const offer = inputs.offerStrength as string;
      if (!price || price <= 0) return null;
      const marketRates: Record<string, number> = { buyers: 0.01, balanced: 0.02, sellers: 0.03, hot: 0.05 };
      const offerMod: Record<string, number> = { below: 0.8, at: 1.0, above: 1.2 };
      const rate = (marketRates[market] || 0.02) * (offerMod[offer] || 1.0);
      const earnestMoney = price * rate;
      const minRecommended = price * 0.01;
      const maxRecommended = price * 0.05;
      return {
        primary: { label: "Recommended Earnest Money", value: "$" + formatNumber(Math.round(earnestMoney)) },
        details: [
          { label: "Percentage of Purchase Price", value: formatNumber(Math.round(rate * 10000) / 100) + "%" },
          { label: "Minimum Recommended", value: "$" + formatNumber(Math.round(minRecommended)) },
          { label: "Maximum Typical", value: "$" + formatNumber(Math.round(maxRecommended)) },
        ],
      };
    },
  }],
  relatedSlugs: ["title-insurance-calculator", "home-appraisal-cost-calculator"],
  faq: [
    { question: "How much earnest money should I put down?", answer: "Earnest money typically ranges from 1 to 5 percent of the purchase price, depending on local customs and market conditions. In competitive markets, higher deposits can strengthen your offer." },
    { question: "Is earnest money refundable?", answer: "Earnest money is typically refundable if the buyer backs out due to a contingency specified in the contract, such as a failed inspection or inability to secure financing." },
  ],
  formula: "Earnest Money = Purchase Price x Market Rate x Offer Strength Modifier",
};
