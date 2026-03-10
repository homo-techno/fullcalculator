import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const redbubbleRoyaltyCalculator: CalculatorDefinition = {
  slug: "redbubble-royalty-calculator",
  title: "Redbubble Royalty Calculator",
  description:
    "Calculate your Redbubble artist royalties by product type and markup percentage. Estimate monthly earnings from print-on-demand sales.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Redbubble royalty calculator",
    "Redbubble artist earnings",
    "Redbubble markup calculator",
    "how much does Redbubble pay",
    "print-on-demand royalties",
  ],
  variants: [
    {
      id: "product",
      name: "Per-Product Royalty",
      description: "Calculate royalty for specific Redbubble products",
      fields: [
        {
          name: "product",
          label: "Product Type",
          type: "select",
          options: [
            { label: "Classic T-Shirt ($27 base)", value: "tshirt" },
            { label: "Sticker ($2.40 base)", value: "sticker" },
            { label: "Poster ($12 base)", value: "poster" },
            { label: "Phone Case ($19 base)", value: "phonecase" },
            { label: "Hoodie ($55 base)", value: "hoodie" },
            { label: "Tote Bag ($22 base)", value: "tote" },
            { label: "Canvas Print ($40 base)", value: "canvas" },
          ],
          defaultValue: "tshirt",
        },
        {
          name: "markupPercent",
          label: "Your Markup Percentage",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "%",
          defaultValue: 20,
        },
        {
          name: "monthlySales",
          label: "Monthly Sales (units)",
          type: "number",
          placeholder: "e.g. 30",
          suffix: "units",
        },
      ],
      calculate: (inputs) => {
        const product = inputs.product as string;
        const markup = parseFloat(inputs.markupPercent as string) || 20;
        const sales = parseFloat(inputs.monthlySales as string) || 0;

        const basePrices: Record<string, number> = {
          tshirt: 27, sticker: 2.40, poster: 12, phonecase: 19,
          hoodie: 55, tote: 22, canvas: 40,
        };
        const base = basePrices[product] || 27;
        const royaltyPerUnit = base * (markup / 100);
        const salePrice = base + royaltyPerUnit;
        const monthlyRoyalty = royaltyPerUnit * sales;

        return {
          primary: { label: "Monthly Royalties", value: `$${formatNumber(monthlyRoyalty, 2)}` },
          details: [
            { label: "Base product price", value: `$${formatNumber(base, 2)}` },
            { label: "Your markup", value: `${markup}%` },
            { label: "Royalty per unit", value: `$${formatNumber(royaltyPerUnit, 2)}` },
            { label: "Sale price to buyer", value: `$${formatNumber(salePrice, 2)}` },
            { label: "Monthly units sold", value: formatNumber(sales) },
            { label: "Monthly royalties", value: `$${formatNumber(monthlyRoyalty, 2)}` },
            { label: "Annual royalties", value: `$${formatNumber(monthlyRoyalty * 12, 2)}` },
          ],
          note: "Redbubble's default markup is 20%. Higher markups reduce conversion. 15–25% is the sweet spot. Stickers convert well at any markup.",
        };
      },
    },
  ],
  relatedSlugs: ["merch-by-amazon-royalty-calculator", "printful-profit-calculator", "print-on-demand-pricing-calculator"],
  faq: [
    {
      question: "How does Redbubble pay artists?",
      answer:
        "Redbubble pays you a royalty on each sale — the difference between the base product price and your listed price. Default markup is 20%. Redbubble handles printing, shipping, and customer service. You get paid monthly via PayPal or direct deposit.",
    },
    {
      question: "What markup should I use on Redbubble?",
      answer:
        "15–25% markup is the most popular range. Higher markups (40%+) reduce conversions. Many artists use 20% for most products and higher (30–50%) for popular designs they know sell well.",
    },
    {
      question: "How many designs do you need to make money on Redbubble?",
      answer:
        "Successful Redbubble shops typically have 100–500+ designs. Average earnings per design: $0.50–$5/month. With 200 designs at $2/design average: $400/month. Top earners have 1,000+ designs.",
    },
  ],
  formula: "Royalty = Base Price × Markup % per unit",
};
