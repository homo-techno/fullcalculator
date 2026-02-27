import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nftProfitCalculator: CalculatorDefinition = {
  slug: "nft-profit-calculator",
  title: "NFT Profit Calculator",
  description: "Free NFT profit calculator. Calculate your NFT trading profit including gas fees, marketplace fees, and royalties.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["NFT profit", "NFT calculator", "NFT trading", "NFT fees"],
  variants: [
    {
      id: "standard",
      name: "NFT Profit",
      description: "Free NFT profit calculator. Calculate your NFT trading profit including gas fees",
      fields: [
        {
          name: "buyPrice",
          label: "Purchase Price",
          type: "number",
          placeholder: "e.g. 0.5",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "sellPrice",
          label: "Sale Price",
          type: "number",
          placeholder: "e.g. 1.2",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "gasBuy",
          label: "Gas Fee (Buy)",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "gasSell",
          label: "Gas Fee (Sell)",
          type: "number",
          placeholder: "e.g. 25",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "royalty",
          label: "Creator Royalty",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 5,
        },
        {
          name: "marketplace",
          label: "Marketplace Fee",
          type: "number",
          placeholder: "e.g. 2.5",
          suffix: "%",
          min: 0,
          max: 50,
          defaultValue: 2.5,
        }
      ],
      calculate: (inputs) => {
        const buy = inputs.buyPrice as number;
        const sell = inputs.sellPrice as number;
        const gasBuy = inputs.gasBuy as number || 0;
        const gasSell = inputs.gasSell as number || 0;
        const royalty = (inputs.royalty as number) / 100;
        const marketplace = (inputs.marketplace as number) / 100;
        if (!buy || !sell) return null;
        const royaltyFee = sell * royalty;
        const marketplaceFee = sell * marketplace;
        const totalFees = gasBuy + gasSell + royaltyFee + marketplaceFee;
        const profit = sell - buy - totalFees;
        const roi = (profit / (buy + gasBuy)) * 100;
        return {
          primary: { label: "Net Profit", value: "$" + formatNumber(profit) },
          details: [
            { label: "ROI", value: formatNumber(roi) + "%" },
            { label: "Total fees", value: "$" + formatNumber(totalFees) },
            { label: "Royalty fee", value: "$" + formatNumber(royaltyFee) },
            { label: "Marketplace fee", value: "$" + formatNumber(marketplaceFee) },
            { label: "Gas fees", value: "$" + formatNumber(gasBuy + gasSell) },
          ],
        };
      },
    }
  ],
  relatedSlugs: ["roi-calculator", "percentage-calculator"],
  faq: [
    {
      question: "How are NFT profits calculated?",
      answer: "NFT profit = Sale Price - Purchase Price - Gas Fees - Marketplace Fee - Creator Royalty. All fees reduce your net profit.",
    },
    {
      question: "What fees are involved in NFT trading?",
      answer: "NFT trading involves gas fees for blockchain transactions, marketplace fees (typically 2-2.5%), and creator royalties (usually 5-10% of the sale price).",
    }
  ],
  formula: "Profit = Sale - Purchase - Gas - (Sale x Royalty%) - (Sale x Marketplace%)",
};
