import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fiverrSellerCalculator: CalculatorDefinition = {
  slug: "fiverr-seller-calculator",
  title: "Fiverr Seller Net Income Calculator",
  description:
    "Calculate your Fiverr net earnings after 20% commission. Compare Fiverr vs Upwork vs direct clients and plan your freelance pricing.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Fiverr fee calculator",
    "Fiverr seller earnings",
    "how much does Fiverr take",
    "Fiverr net income",
    "Fiverr vs Upwork calculator",
  ],
  variants: [
    {
      id: "gig",
      name: "Gig Earnings Calculator",
      description: "Calculate net income from Fiverr gigs",
      fields: [
        {
          name: "gigPrice",
          label: "Gig Price",
          type: "number",
          placeholder: "e.g. 100",
          prefix: "$",
        },
        {
          name: "ordersPerMonth",
          label: "Orders per Month",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "orders",
        },
        {
          name: "avgUpsell",
          label: "Average Upsell / Add-on per Order",
          type: "number",
          placeholder: "e.g. 20",
          prefix: "$",
          defaultValue: 0,
        },
      ],
      calculate: (inputs) => {
        const price = parseFloat(inputs.gigPrice as string) || 0;
        const orders = parseFloat(inputs.ordersPerMonth as string) || 0;
        const upsell = parseFloat(inputs.avgUpsell as string) || 0;

        const avgOrderValue = price + upsell;
        const fiverrFee = 0.20; // Fiverr takes 20% flat
        const grossMonthly = avgOrderValue * orders;
        const netMonthly = grossMonthly * (1 - fiverrFee);
        const netPerOrder = avgOrderValue * (1 - fiverrFee);

        return {
          primary: { label: "Monthly Net Income", value: `$${formatNumber(netMonthly, 2)}` },
          details: [
            { label: "Average order value", value: `$${formatNumber(avgOrderValue, 2)}` },
            { label: "Fiverr fee (20%)", value: `-$${formatNumber(avgOrderValue * fiverrFee, 2)}` },
            { label: "Net per order", value: `$${formatNumber(netPerOrder, 2)}` },
            { label: "Monthly orders", value: formatNumber(orders) },
            { label: "Gross monthly", value: `$${formatNumber(grossMonthly, 2)}` },
            { label: "Net monthly", value: `$${formatNumber(netMonthly, 2)}` },
            { label: "Annual net income", value: `$${formatNumber(netMonthly * 12, 2)}` },
          ],
          note: "Fiverr charges buyers 5.5% on top. Price your gigs at the 'psychological' rate and let Fiverr add their buyer fee. Bundle gig packages to increase AOV.",
        };
      },
    },
    {
      id: "compare",
      name: "Platform Comparison",
      description: "Compare Fiverr vs Upwork vs direct client",
      fields: [
        {
          name: "grossRevenue",
          label: "Monthly Gross Revenue",
          type: "number",
          placeholder: "e.g. 5000",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const gross = parseFloat(inputs.grossRevenue as string) || 0;
        const fiverrNet = gross * 0.80;
        const upworkNew = gross * 0.80; // 20% for new relationships
        const upworkMid = gross * 0.90; // 10% after $500
        const upworkEst = gross * 0.95; // 5% after $10k
        const direct = gross * 0.97; // ~3% payment processing

        return {
          primary: { label: "Best: Direct Clients", value: `$${formatNumber(direct, 2)}/mo` },
          details: [
            { label: "Fiverr (20% fee)", value: `$${formatNumber(fiverrNet, 2)}/mo` },
            { label: "Upwork new client (20%)", value: `$${formatNumber(upworkNew, 2)}/mo` },
            { label: "Upwork mid-tier client (10%)", value: `$${formatNumber(upworkMid, 2)}/mo` },
            { label: "Upwork established client (5%)", value: `$${formatNumber(upworkEst, 2)}/mo` },
            { label: "Direct client (3% processing)", value: `$${formatNumber(direct, 2)}/mo` },
            { label: "Direct vs Fiverr annual savings", value: `$${formatNumber((direct - fiverrNet) * 12, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["upwork-fee-calculator", "freelancer-vs-employee-calculator", "content-creator-hourly-rate-calculator"],
  faq: [
    {
      question: "How much does Fiverr take from sellers?",
      answer:
        "Fiverr takes 20% from all seller earnings, flat rate regardless of order size. On a $100 gig, you receive $80. Buyers also pay an additional 5.5% service fee (or $2 flat for orders under $40).",
    },
    {
      question: "Can you make a full-time income on Fiverr?",
      answer:
        "Yes. Fiverr Pro sellers and top-rated sellers earn $3,000–$15,000+/month. The key is a high-value niche (video production, copywriting, web development), excellent reviews, and premium pricing ($500–$5,000 gig packages).",
    },
    {
      question: "Should I use Fiverr or Upwork for freelancing?",
      answer:
        "Fiverr is better for defined, package-based services ($100–$500). Upwork is better for ongoing hourly work and complex projects ($50–$200/hr). Established freelancers save money with direct clients (only 3% payment processing fees).",
    },
  ],
  formula: "Net Income = Gig Price × Orders per Month × (1 − 0.20 Fiverr Fee)",
};
