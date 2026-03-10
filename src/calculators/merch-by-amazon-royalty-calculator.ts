import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const merchByAmazonRoyaltyCalculator: CalculatorDefinition = {
  slug: "merch-by-amazon-royalty-calculator",
  title: "Merch by Amazon Royalty Calculator",
  description:
    "Calculate your Merch by Amazon royalties by product and price tier. Estimate monthly earnings and compare to other print-on-demand platforms.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Merch by Amazon royalty calculator",
    "Amazon Merch earnings",
    "MBA royalty per shirt",
    "Merch on Demand calculator",
    "how much does Merch by Amazon pay",
  ],
  variants: [
    {
      id: "royalty",
      name: "Calculate Royalty",
      description: "Estimate your Merch by Amazon earnings",
      fields: [
        {
          name: "product",
          label: "Product Type",
          type: "select",
          options: [
            { label: "Standard T-Shirt", value: "tshirt" },
            { label: "Premium T-Shirt", value: "premium" },
            { label: "Long Sleeve T-Shirt", value: "longsleeve" },
            { label: "Sweatshirt", value: "sweatshirt" },
            { label: "Hoodie", value: "hoodie" },
            { label: "PopSocket", value: "popsocket" },
            { label: "Tote Bag", value: "tote" },
          ],
          defaultValue: "tshirt",
        },
        {
          name: "listingPrice",
          label: "Your Listing Price",
          type: "number",
          placeholder: "e.g. 19.99",
          prefix: "$",
          defaultValue: 19.99,
        },
        {
          name: "monthlySales",
          label: "Monthly Sales",
          type: "number",
          placeholder: "e.g. 50",
          suffix: "units",
        },
      ],
      calculate: (inputs) => {
        const product = inputs.product as string;
        const price = parseFloat(inputs.listingPrice as string) || 19.99;
        const sales = parseFloat(inputs.monthlySales as string) || 0;

        // Amazon's production costs (approximate, vary by color/size)
        const productionCosts: Record<string, number> = {
          tshirt: 7.57, premium: 11.57, longsleeve: 10.57,
          sweatshirt: 17.57, hoodie: 20.57, popsocket: 4.57, tote: 6.57,
        };
        const production = productionCosts[product] || 7.57;
        // Amazon takes ~15% referral fee
        const amazonFee = price * 0.15;
        const royalty = price - production - amazonFee;
        const monthlyRoyalty = Math.max(0, royalty) * sales;

        return {
          primary: { label: "Monthly Royalties", value: `$${formatNumber(monthlyRoyalty, 2)}` },
          details: [
            { label: "Listing price", value: `$${formatNumber(price, 2)}` },
            { label: "Production cost", value: `-$${formatNumber(production, 2)}` },
            { label: "Amazon fee (~15%)", value: `-$${formatNumber(amazonFee, 2)}` },
            { label: "Royalty per unit", value: `$${formatNumber(Math.max(0, royalty), 2)}` },
            { label: "Monthly sales", value: formatNumber(sales) },
            { label: "Monthly royalties", value: `$${formatNumber(monthlyRoyalty, 2)}` },
            { label: "Annual royalties", value: `$${formatNumber(monthlyRoyalty * 12, 2)}` },
          ],
          note: "At $19.99 for a standard tee, royalty is ~$3.36. Higher prices increase royalty but reduce conversion. $19.99–$24.99 is the sweet spot for t-shirts.",
        };
      },
    },
  ],
  relatedSlugs: ["redbubble-royalty-calculator", "printful-profit-calculator", "kdp-ebook-royalty-calculator"],
  faq: [
    {
      question: "How much does Merch by Amazon pay per shirt?",
      answer:
        "At $19.99 listing price for a standard t-shirt, royalty is approximately $3.36 (after ~$7.57 production + $2.99 Amazon fee). Royalties increase significantly at higher price points: $24.99 = ~$7.86/shirt.",
    },
    {
      question: "How do I get into Merch by Amazon?",
      answer:
        "Merch by Amazon (now Merch on Demand) requires an application at merch.amazon.com. Approval can take weeks to months. You start at Tier 10 (10 active designs) and tier up based on sales velocity.",
    },
    {
      question: "Is Merch by Amazon or Redbubble better?",
      answer:
        "Amazon Merch has much higher traffic (Amazon's customer base) but requires approval and has tier limits. Redbubble is open to anyone and has no design limit. Many sellers use both platforms simultaneously.",
    },
  ],
  formula: "Royalty = Listing Price − Production Cost − Amazon Fee (15%)",
};
