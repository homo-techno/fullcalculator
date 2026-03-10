import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amazonFbaFeeCalculator: CalculatorDefinition = {
  slug: "amazon-fba-fee-calculator",
  title: "Amazon FBA Fee Calculator",
  description:
    "Calculate Amazon FBA fees including fulfillment, storage, and referral fees. See true profit margin for any FBA product before sourcing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Amazon FBA fee calculator",
    "FBA fulfillment fee",
    "Amazon FBA profit calculator",
    "FBA storage fee",
    "how much are Amazon FBA fees",
  ],
  variants: [
    {
      id: "fees",
      name: "FBA Fee & Profit Calculator",
      description: "Calculate all Amazon FBA fees and net profit",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price on Amazon",
          type: "number",
          placeholder: "e.g. 29.99",
          prefix: "$",
        },
        {
          name: "productCost",
          label: "Product Cost (landed)",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
        },
        {
          name: "weight",
          label: "Product Weight",
          type: "number",
          placeholder: "e.g. 0.5",
          suffix: "lbs",
          defaultValue: 0.5,
        },
        {
          name: "category",
          label: "Product Category",
          type: "select",
          options: [
            { label: "Most categories (15%)", value: "15" },
            { label: "Electronics (8%)", value: "8" },
            { label: "Clothing / Apparel (17%)", value: "17" },
            { label: "Books (15%)", value: "15b" },
            { label: "Jewelry (20%)", value: "20" },
          ],
          defaultValue: "15",
        },
        {
          name: "monthlySales",
          label: "Monthly Units Sold",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "units",
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.salePrice as string) || 0;
        const cost = parseFloat(inputs.productCost as string) || 0;
        const weight = parseFloat(inputs.weight as string) || 0.5;
        const category = inputs.category as string;
        const sales = parseFloat(inputs.monthlySales as string) || 0;

        const refRates: Record<string, number> = {
          "15": 0.15, "8": 0.08, "17": 0.17, "15b": 0.15, "20": 0.20,
        };
        const referralFee = price * (refRates[category] || 0.15);

        // FBA fulfillment fee by weight (small standard)
        let fulfillmentFee = 3.22;
        if (weight <= 0.25) fulfillmentFee = 3.22;
        else if (weight <= 0.5) fulfillmentFee = 3.40;
        else if (weight <= 0.75) fulfillmentFee = 3.58;
        else if (weight <= 1.0) fulfillmentFee = 3.77;
        else fulfillmentFee = 3.77 + (weight - 1) * 0.38;

        // Monthly storage: $0.87/cubic foot (average; Q4 is higher)
        const storageFee = 0.87 * 0.1; // assume 0.1 cu ft average

        const totalFees = referralFee + fulfillmentFee + storageFee;
        const netProfit = price - cost - totalFees;
        const margin = price > 0 ? (netProfit / price) * 100 : 0;
        const monthlyProfit = netProfit * sales;
        const roi = cost > 0 ? (netProfit / cost) * 100 : 0;

        return {
          primary: { label: "Net Profit per Unit", value: `$${formatNumber(netProfit, 2)}` },
          details: [
            { label: "Sale price", value: `$${formatNumber(price, 2)}` },
            { label: "Product cost", value: `-$${formatNumber(cost, 2)}` },
            { label: "Referral fee", value: `-$${formatNumber(referralFee, 2)}` },
            { label: "FBA fulfillment fee", value: `-$${formatNumber(fulfillmentFee, 2)}` },
            { label: "Storage fee (est.)", value: `-$${formatNumber(storageFee, 2)}` },
            { label: "Net profit per unit", value: `$${formatNumber(netProfit, 2)}` },
            { label: "Profit margin", value: `${formatNumber(margin, 1)}%` },
            { label: "ROI on product cost", value: `${formatNumber(roi, 1)}%` },
            { label: "Monthly profit (${sales} units)", value: `$${formatNumber(monthlyProfit, 2)}` },
          ],
          note: "Aim for 30%+ margin and 100%+ ROI for a viable FBA product. Don't forget PPC advertising costs ($0.50–$3 per sale typical).",
        };
      },
    },
  ],
  relatedSlugs: ["amazon-seller-margin-calculator", "shopify-store-profitability-calculator", "dropshipping-profit-calculator"],
  faq: [
    {
      question: "What is a good profit margin for Amazon FBA?",
      answer:
        "Target 25–40% net margin and 100–300% ROI on inventory cost for a healthy FBA business. Below 20% margin makes it very difficult to profitably run PPC ads (which cost $0.50–$3 per sale typically).",
    },
    {
      question: "How are Amazon FBA fulfillment fees calculated?",
      answer:
        "FBA fees depend on product size tier and weight. Small standard items (under 1 lb) cost $3.22–$3.77 for fulfillment. Large standard items (1–20 lbs) cost $4.75–$9.73. Oversized items have significantly higher fees.",
    },
    {
      question: "What is Amazon's referral fee?",
      answer:
        "Amazon charges 6–45% referral fee depending on category. Most categories are 15%. Electronics: 8%. Clothing: 17%. Jewelry: 20%. Books: 15%. The referral fee is charged on the total transaction including shipping.",
    },
  ],
  formula: "Net Profit = Sale Price − Product Cost − Referral Fee − Fulfillment Fee − Storage Fee",
};
