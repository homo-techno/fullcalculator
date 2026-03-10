import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const amazonSellerMarginCalculator: CalculatorDefinition = {
  slug: "amazon-seller-margin-calculator",
  title: "Amazon Seller Profit Calculator",
  description:
    "Calculate Amazon seller net profit including FBA fees, PPC advertising, and returns. Compare FBA vs FBM profitability for your products.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Amazon seller profit calculator",
    "Amazon FBA vs FBM calculator",
    "Amazon seller net margin",
    "Amazon PPC cost calculator",
    "how much profit do Amazon sellers make",
  ],
  variants: [
    {
      id: "fba-vs-fbm",
      name: "FBA vs FBM Comparison",
      description: "Compare fulfillment methods",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 29.99",
          prefix: "$",
        },
        {
          name: "productCost",
          label: "Product Cost (landed)",
          type: "number",
          placeholder: "e.g. 7",
          prefix: "$",
        },
        {
          name: "referralFeeRate",
          label: "Referral Fee Rate",
          type: "number",
          placeholder: "e.g. 15",
          suffix: "%",
          defaultValue: 15,
        },
        {
          name: "fbaFulfillmentFee",
          label: "FBA Fulfillment Fee",
          type: "number",
          placeholder: "e.g. 3.50",
          prefix: "$",
          defaultValue: 3.50,
        },
        {
          name: "shippingCostFbm",
          label: "Your Shipping Cost (FBM)",
          type: "number",
          placeholder: "e.g. 4",
          prefix: "$",
          defaultValue: 4,
        },
        {
          name: "ppcCostPerSale",
          label: "PPC Ad Cost per Sale",
          type: "number",
          placeholder: "e.g. 2",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.salePrice as string) || 0;
        const cost = parseFloat(inputs.productCost as string) || 0;
        const refRate = parseFloat(inputs.referralFeeRate as string) || 15;
        const fbaFee = parseFloat(inputs.fbaFulfillmentFee as string) || 3.5;
        const fbmShipping = parseFloat(inputs.shippingCostFbm as string) || 4;
        const ppc = parseFloat(inputs.ppcCostPerSale as string) || 0;

        const referralFee = price * (refRate / 100);

        const fbaProfit = price - cost - referralFee - fbaFee - ppc;
        const fbmProfit = price - cost - referralFee - fbmShipping - ppc;

        const fbaMargin = price > 0 ? (fbaProfit / price) * 100 : 0;
        const fbmMargin = price > 0 ? (fbmProfit / price) * 100 : 0;
        const better = fbaProfit >= fbmProfit ? "FBA" : "FBM";

        return {
          primary: { label: `${better} is More Profitable`, value: `$${formatNumber(Math.max(fbaProfit, fbmProfit), 2)}/unit` },
          details: [
            { label: "FBA net profit per unit", value: `$${formatNumber(fbaProfit, 2)} (${formatNumber(fbaMargin, 1)}% margin)` },
            { label: "FBM net profit per unit", value: `$${formatNumber(fbmProfit, 2)} (${formatNumber(fbmMargin, 1)}% margin)` },
            { label: "Referral fee", value: `-$${formatNumber(referralFee, 2)}` },
            { label: "FBA fulfillment fee", value: `-$${formatNumber(fbaFee, 2)}` },
            { label: "FBM shipping cost", value: `-$${formatNumber(fbmShipping, 2)}` },
            { label: "PPC cost per sale", value: ppc > 0 ? `-$${formatNumber(ppc, 2)}` : "$0 (organic)" },
          ],
          note: "FBA typically wins for items under 3 lbs. FBM wins for heavy/bulky items where FBA fees exceed your shipping cost.",
        };
      },
    },
  ],
  relatedSlugs: ["amazon-fba-fee-calculator", "shopify-store-profitability-calculator", "dropshipping-profit-calculator"],
  faq: [
    {
      question: "How much do Amazon sellers actually make?",
      answer:
        "Median Amazon seller earns $1,000–$25,000/month in revenue with 15–25% net margins. Top 10% earn $250,000+/month. Most successful sellers do private label (own brand) rather than reselling existing products.",
    },
    {
      question: "What is ACOS in Amazon advertising?",
      answer:
        "ACOS (Advertising Cost of Sale) = Ad Spend ÷ Revenue × 100. A 25% ACOS on a product with 40% margins is breakeven. Target ACOS below your gross margin % to be profitable on ads.",
    },
    {
      question: "How much does Amazon PPC cost?",
      answer:
        "Amazon PPC average CPC (cost per click) is $0.75–$3. Depending on your conversion rate (10–20% is typical), PPC costs $3–$15 per sale. Budget PPC at 10–25% of your target revenue.",
    },
  ],
  formula: "Net Profit = Price − Product Cost − Referral Fee − Fulfillment/Shipping − PPC",
};
