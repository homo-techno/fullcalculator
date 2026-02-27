import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const coursePricingCalculator: CalculatorDefinition = {
  slug: "course-pricing",
  title: "Online Course Pricing Optimizer",
  description:
    "Optimize your online course pricing based on content value, market positioning, audience size, and conversion rates to maximize revenue.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "course pricing",
    "online course revenue",
    "course income",
    "udemy earnings",
    "course launch",
    "digital product pricing",
    "course profit",
  ],
  variants: [
    {
      slug: "course-pricing",
      title: "Course Revenue Estimator",
      description:
        "Estimate your online course revenue based on audience and pricing.",
      fields: [
        {
          id: "audienceSize",
          label: "Email List / Audience Size",
          type: "number",
          defaultValue: 5000,
        },
        {
          id: "coursePrice",
          label: "Course Price ($)",
          type: "number",
          defaultValue: 197,
        },
        {
          id: "conversionRate",
          label: "Conversion Rate (%)",
          type: "number",
          defaultValue: 3,
        },
        {
          id: "platform",
          label: "Selling Platform",
          type: "select",
          options: [
            { label: "Self-hosted (Stripe 2.9% + $0.30)", value: "self" },
            { label: "Teachable (5% + processing)", value: "teachable" },
            { label: "Udemy (37-63% rev share)", value: "udemy" },
            { label: "Gumroad (10% fee)", value: "gumroad" },
            { label: "Kajabi (0% + monthly fee)", value: "kajabi" },
          ],
          defaultValue: "self",
        },
        {
          id: "monthlyHostingCost",
          label: "Monthly Platform Cost ($)",
          type: "number",
          defaultValue: 0,
        },
        {
          id: "refundRate",
          label: "Refund Rate (%)",
          type: "number",
          defaultValue: 5,
        },
      ],
      calculate(inputs) {
        const audienceSize = parseFloat(inputs.audienceSize as string);
        const coursePrice = parseFloat(inputs.coursePrice as string);
        const conversionRate = parseFloat(inputs.conversionRate as string) / 100;
        const platform = inputs.platform as string;
        const monthlyHostingCost = parseFloat(inputs.monthlyHostingCost as string);
        const refundRate = parseFloat(inputs.refundRate as string) / 100;

        const students = Math.floor(audienceSize * conversionRate);
        const grossRevenue = students * coursePrice;
        const refunds = grossRevenue * refundRate;
        const revenueAfterRefunds = grossRevenue - refunds;

        // Platform fees
        const platformFees: Record<string, (revenue: number, sales: number) => number> = {
          self: (rev, sales) => rev * 0.029 + sales * 0.3,
          teachable: (rev, sales) => rev * 0.05 + rev * 0.029 + sales * 0.3,
          udemy: (rev) => rev * 0.5, // average 50% to Udemy
          gumroad: (rev) => rev * 0.1,
          kajabi: (rev, sales) => rev * 0.029 + sales * 0.3,
        };

        const feeCalc = platformFees[platform] || platformFees["self"];
        const fees = feeCalc(revenueAfterRefunds, students);
        const netRevenue = revenueAfterRefunds - fees - monthlyHostingCost;
        const revenuePerStudent = netRevenue / students;

        return {
          "Estimated Students": formatNumber(students),
          "Gross Revenue": "$" + formatNumber(grossRevenue),
          Refunds: "$" + formatNumber(refunds),
          "Platform Fees": "$" + formatNumber(fees),
          "Hosting Cost": "$" + formatNumber(monthlyHostingCost),
          "Net Revenue": "$" + formatNumber(netRevenue),
          "Revenue per Student": "$" + formatNumber(revenuePerStudent),
          "Effective Fee Rate":
            formatNumber((fees / revenueAfterRefunds) * 100) + "%",
        };
      },
    },
    {
      slug: "course-pricing-comparison",
      title: "Course Price Point Comparison",
      description:
        "Compare different price points to find the optimal course price.",
      fields: [
        {
          id: "audienceSize",
          label: "Audience Size",
          type: "number",
          defaultValue: 10000,
        },
        {
          id: "baseConversionRate",
          label: "Base Conversion Rate at $97 (%)",
          type: "number",
          defaultValue: 5,
        },
        {
          id: "productionCost",
          label: "Course Production Cost ($)",
          type: "number",
          defaultValue: 2000,
        },
      ],
      calculate(inputs) {
        const audienceSize = parseFloat(inputs.audienceSize as string);
        const baseConversion = parseFloat(inputs.baseConversionRate as string) / 100;
        const productionCost = parseFloat(inputs.productionCost as string);

        // Higher prices reduce conversion rate
        const pricePoints = [
          { price: 47, convMult: 1.6 },
          { price: 97, convMult: 1.0 },
          { price: 197, convMult: 0.55 },
          { price: 497, convMult: 0.25 },
          { price: 997, convMult: 0.12 },
        ];

        const results: Record<string, string> = {};
        let bestRevenue = 0;
        let bestPrice = 0;

        for (const pp of pricePoints) {
          const conv = baseConversion * pp.convMult;
          const students = Math.floor(audienceSize * conv);
          const revenue = students * pp.price;
          const net = revenue * 0.93 - productionCost; // ~7% avg fees
          results[`$${pp.price} (${formatNumber(conv * 100)}% conv)`] =
            formatNumber(students) + " sales = $" + formatNumber(net) + " net";
          if (net > bestRevenue) {
            bestRevenue = net;
            bestPrice = pp.price;
          }
        }

        results["Optimal Price Point"] = "$" + formatNumber(bestPrice);
        results["Max Net Revenue"] = "$" + formatNumber(bestRevenue);

        return results;
      },
    },
  ],
  relatedSlugs: [
    "newsletter-revenue",
    "patreon-income",
    "ebook-royalty",
    "sponsorship-rate",
  ],
  faq: [
    {
      question: "What is the best price for an online course?",
      answer:
        "Online course prices typically range from $47 to $997+. The optimal price depends on your niche, content depth, and audience. Premium courses ($197-$497) often generate the most total revenue because they balance conversion rate with per-sale profit. Test different price points with your audience.",
    },
    {
      question: "Which platform takes the least fees?",
      answer:
        "Self-hosted solutions (using Stripe directly) have the lowest fees at ~3%. Kajabi and Teachable charge monthly fees but lower transaction rates. Udemy takes the largest cut (50%+ of revenue) but provides built-in marketplace traffic. Choose based on whether you have existing audience or need discovery.",
    },
  ],
  formula:
    "Net Revenue = (Students x Price) - Refunds - Platform Fees - Hosting Cost. Students = Audience Size x Conversion Rate. Platform fees vary by provider.",
};
