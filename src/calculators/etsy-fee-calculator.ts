import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const etsyFeeCalculator: CalculatorDefinition = {
  slug: "etsy-fee-calculator",
  title: "Etsy Fee Calculator",
  description:
    "Calculate exact Etsy seller fees: listing fee, transaction fee, payment processing, and offsite ads. See true profit after all Etsy charges.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Etsy fee calculator",
    "Etsy seller fees breakdown",
    "Etsy transaction fee calculator",
    "how much does Etsy charge",
    "Etsy profit after fees",
  ],
  variants: [
    {
      id: "per-sale",
      name: "Per Sale Fee Breakdown",
      description: "Calculate all fees for a single Etsy sale",
      fields: [
        {
          name: "salePrice",
          label: "Item Sale Price",
          type: "number",
          placeholder: "e.g. 35",
          prefix: "$",
        },
        {
          name: "shippingCharge",
          label: "Shipping Charged to Buyer",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "actualShippingCost",
          label: "Actual Shipping Cost",
          type: "number",
          placeholder: "e.g. 5",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "cogs",
          label: "Cost of Goods (Materials)",
          type: "number",
          placeholder: "e.g. 8",
          prefix: "$",
          defaultValue: 0,
        },
        {
          name: "offsiteAds",
          label: "Offsite Ads Enrolled",
          type: "select",
          options: [
            { label: "Yes (15% fee on referred sales)", value: "15" },
            { label: "Yes – over $10k sales/yr (12% fee)", value: "12" },
            { label: "No", value: "0" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.salePrice as string) || 0;
        const shippingCharged = parseFloat(inputs.shippingCharge as string) || 0;
        const shippingCost = parseFloat(inputs.actualShippingCost as string) || 0;
        const cogs = parseFloat(inputs.cogs as string) || 0;
        const offsiteAdsFee = parseFloat(inputs.offsiteAds as string) || 0;

        const totalSale = price + shippingCharged;

        const listingFee = 0.20; // per listing, per 4 months
        const transactionFee = totalSale * 0.065; // 6.5%
        const paymentProcessing = totalSale * 0.03 + 0.25; // 3% + $0.25
        const offsiteAdsCost = offsiteAdsFee > 0 ? totalSale * (offsiteAdsFee / 100) : 0;

        const totalFees = listingFee + transactionFee + paymentProcessing + offsiteAdsCost;
        const netRevenue = totalSale - totalFees - shippingCost - cogs;
        const marginPct = price > 0 ? (netRevenue / price) * 100 : 0;

        return {
          primary: { label: "Net Profit per Sale", value: `$${formatNumber(netRevenue, 2)}` },
          details: [
            { label: "Sale price + shipping", value: `$${formatNumber(totalSale, 2)}` },
            { label: "Listing fee", value: `-$${formatNumber(listingFee, 2)}` },
            { label: "Transaction fee (6.5%)", value: `-$${formatNumber(transactionFee, 2)}` },
            { label: "Payment processing (3%+$0.25)", value: `-$${formatNumber(paymentProcessing, 2)}` },
            { label: "Offsite ads fee", value: offsiteAdsFee > 0 ? `-$${formatNumber(offsiteAdsCost, 2)}` : "$0.00" },
            { label: "Actual shipping cost", value: `-$${formatNumber(shippingCost, 2)}` },
            { label: "Material cost (COGS)", value: `-$${formatNumber(cogs, 2)}` },
            { label: "Net profit", value: `$${formatNumber(netRevenue, 2)}` },
            { label: "Profit margin", value: `${formatNumber(marginPct, 1)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["etsy-profit-margin-calculator", "print-on-demand-pricing-calculator", "redbubble-royalty-calculator"],
  faq: [
    {
      question: "What are all the fees Etsy charges sellers?",
      answer:
        "Etsy charges: $0.20 listing fee per item (renewed every 4 months or when sold), 6.5% transaction fee on sale+shipping, 3% + $0.25 payment processing, and 12–15% offsite ads fee if enrolled. Star Seller badge has no extra fee.",
    },
    {
      question: "What is Etsy's offsite ads program?",
      answer:
        "Etsy advertises your products on Google, Facebook, and other sites. If a sale results from an offsite ad, Etsy charges 15% (or 12% if you made over $10k in the past year). You can opt out if you've made under $10k.",
    },
    {
      question: "How do I calculate profit on Etsy?",
      answer:
        "Net profit = Sale price − ($0.20 listing) − (6.5% transaction fee) − (3% + $0.25 payment) − shipping cost − material cost. At a $25 sale, Etsy keeps roughly $2.80 in fees (~11%).",
    },
  ],
  formula: "Net Profit = Sale Price − Listing Fee − Transaction Fee (6.5%) − Processing Fee (3%+$0.25) − COGS",
};
