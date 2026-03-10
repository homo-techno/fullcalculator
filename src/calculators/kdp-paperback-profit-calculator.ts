import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const kdpPaperbackProfitCalculator: CalculatorDefinition = {
  slug: "kdp-paperback-profit-calculator",
  title: "KDP Paperback vs Hardcover Profit Calculator",
  description:
    "Calculate Amazon KDP paperback and hardcover royalties after printing costs. Compare formats and find the most profitable pricing for your book.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "KDP paperback royalty calculator",
    "KDP hardcover profit",
    "Amazon self-publishing profit",
    "KDP printing cost calculator",
    "how much do KDP paperbacks pay",
  ],
  variants: [
    {
      id: "paperback",
      name: "Paperback Royalty",
      description: "Calculate net royalty for KDP paperback",
      fields: [
        {
          name: "listPrice",
          label: "List Price",
          type: "number",
          placeholder: "e.g. 14.99",
          prefix: "$",
          defaultValue: 14.99,
        },
        {
          name: "pageCount",
          label: "Page Count",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "pages",
          defaultValue: 200,
        },
        {
          name: "format",
          label: "Format",
          type: "select",
          options: [
            { label: "Paperback (B&W)", value: "paperback_bw" },
            { label: "Paperback (Color)", value: "paperback_color" },
            { label: "Hardcover (B&W)", value: "hardcover_bw" },
          ],
          defaultValue: "paperback_bw",
        },
        {
          name: "market",
          label: "Market",
          type: "select",
          options: [
            { label: "US", value: "us" },
            { label: "UK", value: "uk" },
            { label: "EU", value: "eu" },
          ],
          defaultValue: "us",
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.listPrice as string) || 14.99;
        const pages = parseFloat(inputs.pageCount as string) || 200;
        const format = inputs.format as string;

        // Printing cost formula: fixed + per-page
        let fixedCost = 0;
        let perPageCost = 0;
        if (format === "paperback_bw") { fixedCost = 0.85; perPageCost = 0.012; }
        else if (format === "paperback_color") { fixedCost = 0.85; perPageCost = 0.07; }
        else if (format === "hardcover_bw") { fixedCost = 6.32; perPageCost = 0.012; }

        const printingCost = fixedCost + pages * perPageCost;
        const royaltyRate = 0.60;
        const royalty = price * royaltyRate - printingCost;
        const isViable = royalty > 0;

        const minPrice = printingCost / 0.60;

        return {
          primary: { label: "Net Royalty per Sale", value: isViable ? `$${formatNumber(royalty, 2)}` : "Unprofitable" },
          details: [
            { label: "List price", value: `$${formatNumber(price, 2)}` },
            { label: "Printing cost", value: `-$${formatNumber(printingCost, 2)}` },
            { label: "KDP royalty rate", value: "60%" },
            { label: "Gross royalty (60%)", value: `$${formatNumber(price * 0.60, 2)}` },
            { label: "Net royalty", value: `$${formatNumber(royalty, 2)}` },
            { label: "Minimum profitable price", value: `$${formatNumber(minPrice, 2)}` },
            { label: "Recommended price (30% margin)", value: `$${formatNumber(printingCost / 0.60 * 1.3 / 0.60, 2)}` },
          ],
          note: "KDP printing costs vary slightly by trim size and marketplace. Check kdp.amazon.com/help/topic/G201834340 for exact cost tables.",
        };
      },
    },
  ],
  relatedSlugs: ["kdp-ebook-royalty-calculator", "merch-by-amazon-royalty-calculator", "online-course-pricing-calculator"],
  faq: [
    {
      question: "How much does Amazon KDP pay for paperbacks?",
      answer:
        "KDP paperback royalty = (List Price × 60%) − Printing Cost. A 200-page B&W paperback costs ~$3.25 to print. At $14.99 list price: $14.99 × 60% = $8.99 − $3.25 = $5.74 royalty per sale.",
    },
    {
      question: "Should I do paperback or hardcover on KDP?",
      answer:
        "Paperbacks sell 3–5x more than hardcovers on Amazon but with lower per-unit revenue. Hardcovers appeal for gift books, cookbooks, and prestige non-fiction. Most authors do both formats.",
    },
    {
      question: "How do I set the minimum KDP paperback price?",
      answer:
        "KDP sets a minimum price that covers printing costs. Your minimum price = Printing Cost ÷ 0.60. For a 200-page B&W paperback ($3.25 printing), minimum price = $5.42. Pricing too close to minimum leaves no profit.",
    },
  ],
  formula: "Royalty = (List Price × 60%) − Printing Cost (Fixed + Per-Page)",
};
