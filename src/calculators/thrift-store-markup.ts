import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thriftStoreMarkupCalculator: CalculatorDefinition = {
  slug: "thrift-store-markup-calculator",
  title: "Thrift Store Resale Markup Calculator",
  description:
    "Free thrift store markup calculator. Calculate profit margins for reselling thrift store finds online, including fees, shipping, and ROI.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "thrift store markup",
    "resale calculator",
    "thrift store profit",
    "resale markup calculator",
    "flipping calculator",
  ],
  variants: [
    {
      id: "profit-calc",
      name: "Profit Calculator",
      description: "Calculate profit from reselling a thrift store find",
      fields: [
        {
          name: "purchasePrice",
          label: "Thrift Store Purchase Price",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          min: 0.25,
          max: 500,
          step: 0.25,
        },
        {
          name: "sellingPrice",
          label: "Expected Selling Price",
          type: "number",
          placeholder: "e.g. 45",
          prefix: "$",
          min: 1,
          max: 5000,
          step: 1,
        },
        {
          name: "platform",
          label: "Selling Platform",
          type: "select",
          options: [
            { label: "eBay (12.9% + $0.30)", value: "ebay" },
            { label: "Poshmark (20%)", value: "poshmark" },
            { label: "Mercari (10%)", value: "mercari" },
            { label: "Facebook Marketplace (0%)", value: "facebook" },
            { label: "Depop (10%)", value: "depop" },
          ],
          defaultValue: "ebay",
        },
        {
          name: "shippingCost",
          label: "Shipping Cost",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          min: 0,
          max: 50,
          step: 0.5,
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const purchase = parseFloat(inputs.purchasePrice as string);
        const selling = parseFloat(inputs.sellingPrice as string);
        const platform = inputs.platform as string;
        const shipping = parseFloat(inputs.shippingCost as string);
        if (!purchase || !selling) return null;

        // Platform fees
        let platformFee: number;
        let platformName: string;
        switch (platform) {
          case "ebay":
            platformFee = selling * 0.129 + 0.3;
            platformName = "eBay";
            break;
          case "poshmark":
            platformFee = selling <= 15 ? 2.95 : selling * 0.2;
            platformName = "Poshmark";
            break;
          case "mercari":
            platformFee = selling * 0.1;
            platformName = "Mercari";
            break;
          case "depop":
            platformFee = selling * 0.1;
            platformName = "Depop";
            break;
          default:
            platformFee = 0;
            platformName = "Facebook Marketplace";
        }

        const totalCosts = purchase + platformFee + (shipping || 0);
        const profit = selling - totalCosts;
        const markup = ((selling - purchase) / purchase) * 100;
        const roi = (profit / purchase) * 100;
        const profitMargin = (profit / selling) * 100;

        return {
          primary: { label: "Profit", value: `$${formatNumber(profit)}` },
          details: [
            { label: "ROI", value: `${formatNumber(roi, 0)}%` },
            { label: "Profit Margin", value: `${formatNumber(profitMargin, 0)}%` },
            { label: "Markup", value: `${formatNumber(markup, 0)}%` },
            { label: `${platformName} Fee`, value: `$${formatNumber(platformFee)}` },
            { label: "Shipping Cost", value: `$${formatNumber(shipping || 0)}` },
            { label: "Total Costs", value: `$${formatNumber(totalCosts)}` },
          ],
          note: profit > 0
            ? `Good flip! You make $${formatNumber(profit)} profit with a ${formatNumber(roi, 0)}% return on investment.`
            : "This flip would result in a loss. Consider negotiating a lower purchase price or finding a higher-value market.",
        };
      },
    },
    {
      id: "break-even",
      name: "Break-Even Price",
      description: "Find the minimum selling price to break even",
      fields: [
        {
          name: "purchasePrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 12",
          prefix: "$",
          min: 0.25,
          max: 500,
          step: 0.25,
        },
        {
          name: "platform",
          label: "Selling Platform",
          type: "select",
          options: [
            { label: "eBay (12.9% + $0.30)", value: "ebay" },
            { label: "Poshmark (20%)", value: "poshmark" },
            { label: "Mercari (10%)", value: "mercari" },
            { label: "Facebook Marketplace (0%)", value: "facebook" },
            { label: "Depop (10%)", value: "depop" },
          ],
          defaultValue: "ebay",
        },
        {
          name: "shippingCost",
          label: "Estimated Shipping",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          min: 0,
          max: 50,
          step: 0.5,
          defaultValue: 8,
        },
      ],
      calculate: (inputs) => {
        const purchase = parseFloat(inputs.purchasePrice as string);
        const platform = inputs.platform as string;
        const shipping = parseFloat(inputs.shippingCost as string);
        if (!purchase) return null;

        const totalFixed = purchase + (shipping || 0);

        // Solve: selling - fee(selling) - totalFixed = 0
        let breakEven: number;
        switch (platform) {
          case "ebay":
            breakEven = (totalFixed + 0.3) / (1 - 0.129);
            break;
          case "poshmark":
            breakEven = totalFixed / 0.8;
            break;
          case "mercari":
          case "depop":
            breakEven = totalFixed / 0.9;
            break;
          default:
            breakEven = totalFixed;
        }

        const targetProfit2x = breakEven * 2 - totalFixed;
        const suggestedPrice = Math.ceil(breakEven * 1.5);

        return {
          primary: { label: "Break-Even Selling Price", value: `$${formatNumber(breakEven)}` },
          details: [
            { label: "Minimum to Not Lose Money", value: `$${formatNumber(breakEven)}` },
            { label: "Suggested Price (50% profit)", value: `$${formatNumber(suggestedPrice)}` },
            { label: "Purchase Price", value: `$${formatNumber(purchase)}` },
            { label: "Shipping", value: `$${formatNumber(shipping || 0)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["garage-sale-price-calculator", "margin-calculator"],
  faq: [
    {
      question: "What is a good profit margin for reselling?",
      answer:
        "Experienced resellers aim for at least a 50% profit margin (selling for at least 3x the purchase price). For lower-priced items ($5-$20 purchase), aim for a higher markup (4-5x) to make the time investment worthwhile.",
    },
    {
      question: "Which platform is best for reselling thrift finds?",
      answer:
        "It depends on the item. eBay is best for electronics, collectibles, and niche items. Poshmark is ideal for clothing and accessories. Facebook Marketplace is great for furniture and local pickup items (no fees). Mercari works well for general merchandise.",
    },
  ],
  formula:
    "Profit = Selling Price - Purchase Price - Platform Fee - Shipping | ROI = (Profit / Purchase Price) x 100",
};
