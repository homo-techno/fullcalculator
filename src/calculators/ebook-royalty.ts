import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ebookRoyaltyCalculator: CalculatorDefinition = {
  slug: "ebook-royalty",
  title: "Ebook Royalty Earnings Calculator",
  description:
    "Calculate ebook royalty earnings across platforms like Amazon KDP, Apple Books, and Google Play based on pricing, royalty rates, and sales volume.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "ebook royalty",
    "kindle royalty",
    "kdp earnings",
    "ebook income",
    "self publishing income",
    "kindle publishing",
    "apple books royalty",
    "book royalty calculator",
  ],
  variants: [
    {
      slug: "ebook-royalty",
      title: "Ebook Royalty Calculator",
      description:
        "Calculate your ebook royalties across different platforms and pricing.",
      fields: [
        {
          id: "listPrice",
          label: "List Price ($)",
          type: "number",
          defaultValue: 9.99,
        },
        {
          id: "platform",
          label: "Publishing Platform",
          type: "select",
          options: [
            { label: "Amazon KDP (70% royalty, $2.99-$9.99)", value: "kdp_70" },
            { label: "Amazon KDP (35% royalty, any price)", value: "kdp_35" },
            { label: "Apple Books (70% royalty)", value: "apple" },
            { label: "Google Play Books (70% royalty)", value: "google" },
            { label: "Smashwords / Draft2Digital (60%)", value: "d2d" },
            { label: "Kobo (70% royalty)", value: "kobo" },
          ],
          defaultValue: "kdp_70",
        },
        {
          id: "monthlySales",
          label: "Monthly Sales (units)",
          type: "number",
          defaultValue: 100,
        },
        {
          id: "pageCount",
          label: "Page Count (for KDP delivery cost)",
          type: "number",
          defaultValue: 250,
        },
        {
          id: "hasKu",
          label: "Enrolled in Kindle Unlimited?",
          type: "select",
          options: [
            { label: "Yes (earn per page read)", value: "yes" },
            { label: "No", value: "no" },
          ],
          defaultValue: "yes",
        },
        {
          id: "kuPagesRead",
          label: "Monthly KU Pages Read (KENP)",
          type: "number",
          defaultValue: 25000,
        },
      ],
      calculate(inputs) {
        const listPrice = parseFloat(inputs.listPrice as string);
        const platform = inputs.platform as string;
        const monthlySales = parseFloat(inputs.monthlySales as string);
        const pageCount = parseFloat(inputs.pageCount as string);
        const hasKu = inputs.hasKu as string;
        const kuPagesRead = parseFloat(inputs.kuPagesRead as string);

        const royaltyRates: Record<string, number> = {
          kdp_70: 0.7,
          kdp_35: 0.35,
          apple: 0.7,
          google: 0.7,
          d2d: 0.6,
          kobo: 0.7,
        };

        const royaltyRate = royaltyRates[platform] || 0.7;

        // KDP 70% has delivery cost (~$0.01 per MB, avg book ~2MB)
        let deliveryCost = 0;
        if (platform === "kdp_70") {
          const fileSizeMb = pageCount * 0.008; // ~8KB per page
          deliveryCost = fileSizeMb * 0.01; // $0.01 per MB
        }

        const royaltyPerSale = listPrice * royaltyRate - deliveryCost;
        const monthlyRoyalties = royaltyPerSale * monthlySales;

        // Kindle Unlimited: ~$0.004-$0.005 per KENP page read
        const kuRatePerPage = 0.0045;
        const kuEarnings =
          hasKu === "yes" ? kuPagesRead * kuRatePerPage : 0;

        const totalMonthly = monthlyRoyalties + kuEarnings;

        return {
          "Royalty Rate": formatNumber(royaltyRate * 100) + "%",
          "Royalty per Sale": "$" + formatNumber(royaltyPerSale),
          "Delivery Cost (KDP)": "$" + formatNumber(deliveryCost),
          "Monthly Sales Royalties": "$" + formatNumber(monthlyRoyalties),
          "KU Earnings": "$" + formatNumber(kuEarnings),
          "Total Monthly Earnings": "$" + formatNumber(totalMonthly),
          "Total Annual Earnings": "$" + formatNumber(totalMonthly * 12),
          "Effective Royalty %":
            formatNumber((totalMonthly / (listPrice * monthlySales)) * 100) + "%",
        };
      },
    },
    {
      slug: "ebook-royalty-comparison",
      title: "Ebook Platform Royalty Comparison",
      description:
        "Compare royalties across ebook platforms for the same book.",
      fields: [
        {
          id: "listPrice",
          label: "List Price ($)",
          type: "number",
          defaultValue: 9.99,
        },
        {
          id: "monthlySales",
          label: "Monthly Sales per Platform",
          type: "number",
          defaultValue: 50,
        },
      ],
      calculate(inputs) {
        const listPrice = parseFloat(inputs.listPrice as string);
        const monthlySales = parseFloat(inputs.monthlySales as string);

        const platforms: Record<string, number> = {
          "Amazon KDP (70%)": 0.7,
          "Amazon KDP (35%)": 0.35,
          "Apple Books (70%)": 0.7,
          "Google Play (70%)": 0.7,
          "Draft2Digital (60%)": 0.6,
          "Kobo (70%)": 0.7,
        };

        const results: Record<string, string> = {};
        for (const [name, rate] of Object.entries(platforms)) {
          const royalty = listPrice * rate * monthlySales;
          results[name] = "$" + formatNumber(royalty) + "/mo";
        }
        results["Sales per Platform"] = formatNumber(monthlySales) + " units";

        return results;
      },
    },
  ],
  relatedSlugs: [
    "course-pricing",
    "amazon-fba-profit",
    "newsletter-revenue",
    "patreon-income",
  ],
  faq: [
    {
      question: "How much do self-published authors earn on Amazon KDP?",
      answer:
        "Amazon KDP authors earn 35% or 70% royalties depending on pricing. At the 70% rate (for books priced $2.99-$9.99), a $9.99 book earns ~$6.99 per sale minus a small delivery fee. Kindle Unlimited adds ~$0.004-$0.005 per page read. Earnings vary wildly, from $0 to six figures monthly.",
    },
    {
      question: "Should I use KDP Select (Kindle Unlimited)?",
      answer:
        "KDP Select requires Amazon exclusivity but adds Kindle Unlimited earnings (per page read) and promotional tools. It works well for fiction and genre books with high read-through. Non-fiction authors often benefit more from wide distribution across multiple platforms.",
    },
  ],
  formula:
    "Royalty per Sale = List Price x Royalty Rate - Delivery Cost. Monthly Earnings = (Royalty per Sale x Sales) + KU Earnings. KU Earnings = KENP Pages Read x $0.0045.",
};
