import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const etsyProfitCalculator: CalculatorDefinition = {
  slug: "etsy-profit",
  title: "Etsy Shop Profit Calculator",
  description:
    "Calculate your Etsy shop profit after listing fees, transaction fees, payment processing fees, shipping costs, and advertising spend.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "etsy profit",
    "etsy fees",
    "etsy seller calculator",
    "etsy income",
    "etsy shop revenue",
    "etsy transaction fee",
    "handmade profit",
  ],
  variants: [
    {
      slug: "etsy-profit",
      title: "Etsy Per-Item Profit Calculator",
      description:
        "Calculate profit on each Etsy sale after all fees.",
      fields: [
        {
          id: "itemPrice",
          label: "Item Selling Price ($)",
          type: "number",
          defaultValue: 35,
        },
        {
          id: "shippingCharged",
          label: "Shipping Charged to Buyer ($)",
          type: "number",
          defaultValue: 5.99,
        },
        {
          id: "materialCost",
          label: "Material / Product Cost ($)",
          type: "number",
          defaultValue: 8,
        },
        {
          id: "actualShippingCost",
          label: "Actual Shipping Cost ($)",
          type: "number",
          defaultValue: 4.5,
        },
        {
          id: "laborMinutes",
          label: "Labor Time (minutes)",
          type: "number",
          defaultValue: 30,
        },
        {
          id: "hourlyRate",
          label: "Your Hourly Rate ($)",
          type: "number",
          defaultValue: 25,
        },
        {
          id: "monthlyListings",
          label: "Monthly Sales Volume",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "etsyAdsPercent",
          label: "Etsy Ads Spend (% of revenue)",
          type: "number",
          defaultValue: 5,
        },
      ],
      calculate(inputs) {
        const itemPrice = parseFloat(inputs.itemPrice as string);
        const shippingCharged = parseFloat(inputs.shippingCharged as string);
        const materialCost = parseFloat(inputs.materialCost as string);
        const actualShippingCost = parseFloat(inputs.actualShippingCost as string);
        const laborMinutes = parseFloat(inputs.laborMinutes as string);
        const hourlyRate = parseFloat(inputs.hourlyRate as string);
        const monthlyListings = parseFloat(inputs.monthlyListings as string);
        const etsyAdsPercent = parseFloat(inputs.etsyAdsPercent as string) / 100;

        const totalSaleAmount = itemPrice + shippingCharged;

        // Etsy fees
        const listingFee = 0.2; // $0.20 per listing
        const transactionFee = totalSaleAmount * 0.065; // 6.5% transaction fee
        const paymentProcessingFee = totalSaleAmount * 0.03 + 0.25; // 3% + $0.25
        const regulatoryFee = totalSaleAmount * 0.005; // ~0.5% regulatory
        const totalEtsyFees = listingFee + transactionFee + paymentProcessingFee + regulatoryFee;

        const laborCost = (laborMinutes / 60) * hourlyRate;
        const adsCost = totalSaleAmount * etsyAdsPercent;
        const totalCosts = materialCost + actualShippingCost + laborCost + totalEtsyFees + adsCost;
        const profitPerItem = totalSaleAmount - totalCosts;
        const profitMargin = (profitPerItem / totalSaleAmount) * 100;

        const monthlyRevenue = totalSaleAmount * monthlyListings;
        const monthlyProfit = profitPerItem * monthlyListings;

        return {
          "Total Sale Amount": "$" + formatNumber(totalSaleAmount),
          "Etsy Fees (per item)": "$" + formatNumber(totalEtsyFees),
          "Material Cost": "$" + formatNumber(materialCost),
          "Labor Cost": "$" + formatNumber(laborCost),
          "Shipping Cost": "$" + formatNumber(actualShippingCost),
          "Ads Cost": "$" + formatNumber(adsCost),
          "Profit per Item": "$" + formatNumber(profitPerItem),
          "Profit Margin": formatNumber(profitMargin) + "%",
          "Monthly Revenue": "$" + formatNumber(monthlyRevenue),
          "Monthly Profit": "$" + formatNumber(monthlyProfit),
        };
      },
    },
  ],
  relatedSlugs: [
    "shopify-profit",
    "amazon-fba-profit",
    "print-on-demand-profit",
    "dropshipping-margin",
  ],
  faq: [
    {
      question: "What are all the Etsy fees?",
      answer:
        "Etsy charges a $0.20 listing fee per item, 6.5% transaction fee on the total sale (including shipping), 3% + $0.25 payment processing fee, and an approximately 0.5% regulatory operating fee. Offsite ads add 12-15% if a sale comes through Etsy advertising.",
    },
    {
      question: "How much does Etsy take from each sale?",
      answer:
        "In total, Etsy takes approximately 10-13% of each sale in combined fees (listing, transaction, and payment processing). If offsite ads drive the sale, an additional 12-15% is charged, bringing total fees to 22-28%.",
    },
    {
      question: "Is selling on Etsy profitable?",
      answer:
        "Etsy can be profitable with the right pricing strategy. Aim for a minimum 40% gross margin before Etsy fees to ensure profitability after all costs. Digital products and items with low material costs tend to have the highest margins on Etsy.",
    },
  ],
  formula:
    "Profit = Sale Amount - Material Cost - Shipping - Labor - Etsy Fees - Ads. Etsy Fees = $0.20 listing + 6.5% transaction + 3% + $0.25 processing + 0.5% regulatory.",
};
