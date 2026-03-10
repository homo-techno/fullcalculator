import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kdpEbookRoyaltyCalculator: CalculatorDefinition = {
  slug: "kdp-ebook-royalty-calculator",
  title: "Amazon KDP Royalty Calculator",
  description:
    "Calculate Amazon KDP royalties for ebooks, paperbacks, and hardcovers. Compare 35% vs 70% royalty tiers and estimate monthly publishing income.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "KDP royalty calculator",
    "Amazon Kindle royalty",
    "self-publishing income calculator",
    "KDP 70% royalty",
    "how much does Amazon KDP pay",
  ],
  variants: [
    {
      id: "ebook",
      name: "eBook Royalty",
      description: "Calculate Kindle eBook royalties",
      fields: [
        {
          name: "listingPrice",
          label: "eBook Price",
          type: "number",
          placeholder: "e.g. 4.99",
          prefix: "$",
          defaultValue: 4.99,
        },
        {
          name: "fileSize",
          label: "File Size (MB, for 70% tier)",
          type: "number",
          placeholder: "e.g. 1",
          suffix: "MB",
          defaultValue: 1,
        },
        {
          name: "market",
          label: "Primary Market",
          type: "select",
          options: [
            { label: "US (amazon.com)", value: "us" },
            { label: "UK (amazon.co.uk)", value: "uk" },
            { label: "Germany (amazon.de)", value: "de" },
            { label: "Canada (amazon.ca)", value: "ca" },
          ],
          defaultValue: "us",
        },
        {
          name: "monthlySales",
          label: "Monthly Sales",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "copies",
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.listingPrice as string) || 4.99;
        const fileSize = parseFloat(inputs.fileSize as string) || 1;
        const sales = parseFloat(inputs.monthlySales as string) || 0;

        // 70% tier: $2.99–$9.99. Delivery cost $0.15/MB
        // 35% tier: outside $2.99–$9.99 range
        const is70Tier = price >= 2.99 && price <= 9.99;
        const deliveryCost = fileSize * 0.15;
        const royaltyRate = is70Tier ? 0.70 : 0.35;
        const royaltyPerSale = is70Tier
          ? price * 0.70 - deliveryCost
          : price * 0.35;

        const monthlyRoyalty = Math.max(0, royaltyPerSale) * sales;

        return {
          primary: { label: "Monthly Royalties", value: `$${formatNumber(monthlyRoyalty, 2)}` },
          details: [
            { label: "Royalty tier", value: `${is70Tier ? "70%" : "35%"} tier` },
            { label: "Gross royalty per sale", value: `$${formatNumber(price * royaltyRate, 2)}` },
            { label: "Delivery fee (70% tier only)", value: is70Tier ? `-$${formatNumber(deliveryCost, 2)}` : "N/A" },
            { label: "Net royalty per sale", value: `$${formatNumber(Math.max(0, royaltyPerSale), 2)}` },
            { label: "Monthly sales", value: formatNumber(sales) },
            { label: "Monthly royalties", value: `$${formatNumber(monthlyRoyalty, 2)}` },
            { label: "Annual royalties", value: `$${formatNumber(monthlyRoyalty * 12, 2)}` },
          ],
          note: "Price your ebook between $2.99–$9.99 to qualify for the 70% royalty tier. $3.99–$5.99 is the sweet spot for non-fiction, $0.99–$2.99 for fiction.",
        };
      },
    },
  ],
  relatedSlugs: ["kdp-paperback-profit-calculator", "merch-by-amazon-royalty-calculator", "online-course-pricing-calculator"],
  faq: [
    {
      question: "What is Amazon KDP's 70% vs 35% royalty?",
      answer:
        "Amazon KDP pays 70% royalty on ebooks priced $2.99–$9.99 (minus delivery costs of $0.15/MB). Books outside this range earn only 35%. For paperbacks, royalties are 60% of list price minus printing cost.",
    },
    {
      question: "How much do self-published authors make on Amazon?",
      answer:
        "Most self-published authors earn less than $500/year. However, successful authors in popular genres (romance, thriller, self-help) with 5–10 books can earn $50,000–$500,000+/year. Series of books compound earnings significantly.",
    },
    {
      question: "Should I enroll in KDP Select (Kindle Unlimited)?",
      answer:
        "KDP Select (Kindle Unlimited) pays per page read (~$0.004/page) but requires exclusivity to Amazon. It works well for genre fiction (romance, fantasy) with fast readers. Non-fiction and niche books often earn more with wide distribution.",
    },
  ],
  formula: "eBook Royalty = Price × 70% − Delivery Cost ($0.15/MB) [for $2.99–$9.99 tier]",
};
