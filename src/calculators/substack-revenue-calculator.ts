import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const substackRevenueCalculator: CalculatorDefinition = {
  slug: "substack-revenue-calculator",
  title: "Substack Revenue Calculator",
  description:
    "Calculate Substack newsletter income from paid subscriptions. Estimate monthly and annual earnings after Substack's 10% fee.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "Substack revenue calculator",
    "Substack earnings calculator",
    "paid newsletter income",
    "Substack subscription income",
    "how much can you make on Substack",
  ],
  variants: [
    {
      id: "paid",
      name: "Paid Subscriber Income",
      description: "Calculate revenue from Substack paid subscriptions",
      fields: [
        {
          name: "freeSubscribers",
          label: "Free Subscribers",
          type: "number",
          placeholder: "e.g. 5000",
        },
        {
          name: "conversionRate",
          label: "Free-to-Paid Conversion Rate",
          type: "number",
          placeholder: "e.g. 5",
          suffix: "%",
          defaultValue: 5,
        },
        {
          name: "monthlyPrice",
          label: "Monthly Subscription Price",
          type: "number",
          placeholder: "e.g. 7",
          prefix: "$",
          defaultValue: 7,
        },
        {
          name: "annualDiscount",
          label: "Annual Plan Offered",
          type: "select",
          options: [
            { label: "No annual plan", value: "0" },
            { label: "Annual at ~2 months free ($70/yr)", value: "70" },
            { label: "Annual at ~3 months free ($60/yr)", value: "60" },
          ],
          defaultValue: "0",
        },
      ],
      calculate: (inputs) => {
        const freeS = parseFloat(inputs.freeSubscribers as string) || 0;
        const conversion = parseFloat(inputs.conversionRate as string) || 5;
        const monthlyPrice = parseFloat(inputs.monthlyPrice as string) || 7;

        const paidSubs = Math.floor(freeS * (conversion / 100));
        const grossMonthly = paidSubs * monthlyPrice;
        // Substack takes 10% + Stripe ~2.9% + $0.30 per transaction
        const substackFee = grossMonthly * 0.10;
        const stripeFee = grossMonthly * 0.029;
        const netMonthly = grossMonthly - substackFee - stripeFee;
        const netAnnual = netMonthly * 12;

        return {
          primary: { label: "Monthly Net Revenue", value: `$${formatNumber(netMonthly, 2)}` },
          details: [
            { label: "Free subscribers", value: formatNumber(freeS) },
            { label: "Paid subscribers", value: formatNumber(paidSubs) },
            { label: "Gross monthly revenue", value: `$${formatNumber(grossMonthly, 2)}` },
            { label: "Substack fee (10%)", value: `-$${formatNumber(substackFee, 2)}` },
            { label: "Stripe processing fee", value: `-$${formatNumber(stripeFee, 2)}` },
            { label: "Net monthly revenue", value: `$${formatNumber(netMonthly, 2)}` },
            { label: "Net annual revenue", value: `$${formatNumber(netAnnual, 2)}` },
          ],
          note: "Average Substack conversion rate is 3–8%. Top newsletters achieve 10–20%. At 5,000 free subs + 5% conversion + $7/mo = ~$1,580/mo net.",
        };
      },
    },
  ],
  relatedSlugs: ["newsletter-sponsorship-calculator", "online-course-pricing-calculator", "membership-site-revenue-calculator"],
  faq: [
    {
      question: "How much does Substack take?",
      answer:
        "Substack charges 10% of paid subscription revenue plus Stripe payment processing fees (~2.9% + $0.30 per transaction). On $1,000 gross monthly revenue, you net approximately $870 after all fees.",
    },
    {
      question: "What's a realistic Substack income?",
      answer:
        "With 1,000 free subscribers at 5% conversion ($7/mo): ~$315/month net. With 10,000 free subscribers at 5% conversion: ~$3,150/month. Top Substacks with 50,000+ subscribers earn $50,000–$500,000/year.",
    },
    {
      question: "Should I use Substack or Ghost or Beehiiv?",
      answer:
        "Substack (10% fee) is best for discovery and starting out. Ghost ($9–$99/mo flat) and Beehiiv ($42–$99/mo) become cheaper at scale. At $5,000/mo revenue, Ghost/Beehiiv save ~$450/mo vs Substack's 10% cut.",
    },
  ],
  formula: "Net Revenue = (Free Subs × Conversion%) × Monthly Price × 0.87 (after fees)",
};
