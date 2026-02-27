import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dropshippingProfitCalculator: CalculatorDefinition = {
  slug: "dropshipping-profit-calculator",
  title: "Dropshipping Profit Calculator",
  description: "Free dropshipping profit calculator. Calculate your Dropshipping selling profit after fees, shipping, and cost of goods.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dropshipping profit", "dropshipping fees", "dropshipping calculator", "profit calculator"],
  variants: [
    {
      id: "standard",
      name: "Dropshipping Profit",
      description: "Free dropshipping profit calculator. Calculate your Dropshipping selling profit ",
      fields: [
        {
          name: "salePrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "cost",
          label: "Cost of Goods",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "shipping",
          label: "Shipping Cost",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "shippingCharged",
          label: "Shipping Charged to Buyer",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "quantity",
          label: "Quantity Sold",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          defaultValue: 1,
        }
      ],
      calculate: (inputs) => {
        const price = inputs.salePrice as number;
        const cost = inputs.cost as number;
        const shipping = inputs.shipping as number || 0;
        const shippingCharged = inputs.shippingCharged as number || 0;
        const qty = inputs.quantity as number || 1;
        if (!price || !cost) return null;
        const revenue = price + shippingCharged;
        const platformFee = revenue * 0;
        const ccFee = revenue * 0.029 + 0.3;
        const totalFees = platformFee + ccFee;
        const profitPer = revenue - cost - shipping - totalFees;
        const totalProfit = profitPer * qty;
        const margin = (profitPer / revenue) * 100;
        return {
          primary: { label: "Profit per Item", value: "$" + formatNumber(profitPer) },
          details: [
            { label: "Total profit (x" + qty + ")", value: "$" + formatNumber(totalProfit) },
            { label: "Platform fees", value: "$" + formatNumber(platformFee) },
            { label: "Payment processing", value: "$" + formatNumber(ccFee) },
            { label: "Profit margin", value: formatNumber(margin) + "%" },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["roi-calculator", "percentage-calculator"],
  faq: [
    {
      question: "How are Dropshipping fees calculated?",
      answer: "Dropshipping charges approximately 0.0% in seller fees plus payment processing fees. The exact structure may vary.",
    },
    {
      question: "What is a good profit margin on Dropshipping?",
      answer: "A healthy profit margin on Dropshipping is typically 30-50% after all fees. Margins below 20% may not be sustainable long-term.",
    }
  ],
  formula: "Profit = Sale Price - Cost - Shipping - Platform Fee - Processing Fee",
};
