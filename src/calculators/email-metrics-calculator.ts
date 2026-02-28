import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emailMetricsCalculator: CalculatorDefinition = {
  slug: "email-metrics-calculator",
  title: "Email Marketing Metrics Calculator",
  description: "Free email marketing metrics calculator. Calculate open rate, click rate, bounce rate, and deliverability from campaign data.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["email open rate calculator", "email bounce rate calculator", "email marketing metrics calculator"],
  variants: [{
    id: "standard",
    name: "Email Marketing Metrics",
    description: "Free email marketing metrics calculator",
    fields: [
      { name: "sent", label: "Emails Sent", type: "number", min: 1 },
      { name: "delivered", label: "Emails Delivered", type: "number", min: 0 },
      { name: "opened", label: "Unique Opens", type: "number", min: 0 },
      { name: "clicked", label: "Unique Clicks", type: "number", min: 0, defaultValue: 0 },
    ],
    calculate: (inputs) => {
      const sent = inputs.sent as number;
      const delivered = inputs.delivered as number;
      const opened = inputs.opened as number;
      const clicked = (inputs.clicked as number) || 0;
      if (!sent || !delivered || sent <= 0) return null;
      const bounced = sent - delivered;
      const bounceRate = (bounced / sent) * 100;
      const deliveryRate = (delivered / sent) * 100;
      const openRate = (opened / delivered) * 100;
      const clickRate = clicked > 0 ? (clicked / delivered) * 100 : 0;
      const ctor = opened > 0 && clicked > 0 ? (clicked / opened) * 100 : 0;
      return {
        primary: { label: "Open Rate", value: formatNumber(openRate) + "%" },
        details: [
          { label: "Delivery rate", value: formatNumber(deliveryRate) + "%" },
          { label: "Bounce rate", value: formatNumber(bounceRate) + "%" },
          { label: "Click rate (CTR)", value: formatNumber(clickRate) + "%" },
          { label: "Click-to-open (CTOR)", value: formatNumber(ctor) + "%" },
          { label: "Bounced emails", value: String(bounced) },
        ],
        note: bounceRate > 5 ? "WARNING: Bounce rate above 5% — clean your email list to avoid deliverability issues." : "Industry avg: Open 20-25%, CTR 2-3%, Bounce <2%.",
      };
    },
  }],
  relatedSlugs: ["conversion-rate-calculator", "cpc-calculator"],
  faq: [
    { question: "What is a good email open rate?", answer: "Industry average: 20-25%. B2B: 15-20%. Ecommerce: 15-18%. Nonprofits: 25-30%. Apple Mail Privacy Protection inflates open rates since 2021." },
    { question: "What causes high bounce rates?", answer: "Invalid addresses, full mailboxes, blocked domains. Hard bounces (invalid) should be removed immediately. Keep total bounce rate under 2%." },
  ],
  formula: "Open Rate = Opens/Delivered × 100. CTR = Clicks/Delivered × 100. CTOR = Clicks/Opens × 100",
};
