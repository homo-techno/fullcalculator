import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emailOpenRateCalculator: CalculatorDefinition = {
  slug: "email-open-rate",
  title: "Email Open Rate Calculator",
  description: "Free email open rate calculator. Measure your email campaign performance by calculating the percentage of recipients who open your emails.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["email open rate", "email marketing", "campaign metrics", "email performance", "newsletter"],
  variants: [
    {
      id: "basic",
      name: "Basic Open Rate",
      fields: [
        { name: "emailsOpened", label: "Emails Opened", type: "number", placeholder: "e.g. 450" },
        { name: "emailsDelivered", label: "Emails Delivered", type: "number", placeholder: "e.g. 2000" },
      ],
      calculate: (inputs) => {
        const emailsOpened = inputs.emailsOpened as number;
        const emailsDelivered = inputs.emailsDelivered as number;
        if (!emailsOpened || !emailsDelivered) return null;
        const openRate = (emailsOpened / emailsDelivered) * 100;
        const unopened = emailsDelivered - emailsOpened;
        return {
          primary: { label: "Email Open Rate", value: `${formatNumber(openRate, 2)}%` },
          details: [
            { label: "Emails Opened", value: formatNumber(emailsOpened, 0) },
            { label: "Emails Delivered", value: formatNumber(emailsDelivered, 0) },
            { label: "Emails Unopened", value: formatNumber(unopened, 0) },
            { label: "Opens per 100 Emails", value: formatNumber(openRate, 1) },
          ],
        };
      },
    },
    {
      id: "full",
      name: "Full Email Campaign Metrics",
      fields: [
        { name: "emailsSent", label: "Emails Sent", type: "number", placeholder: "e.g. 5000" },
        { name: "bounced", label: "Bounced Emails", type: "number", placeholder: "e.g. 100" },
        { name: "opened", label: "Emails Opened", type: "number", placeholder: "e.g. 1200" },
        { name: "clicked", label: "Emails Clicked", type: "number", placeholder: "e.g. 180" },
        { name: "unsubscribed", label: "Unsubscribes", type: "number", placeholder: "e.g. 15" },
      ],
      calculate: (inputs) => {
        const emailsSent = inputs.emailsSent as number;
        const bounced = inputs.bounced as number;
        const opened = inputs.opened as number;
        const clicked = inputs.clicked as number;
        const unsubscribed = inputs.unsubscribed as number;
        if (!emailsSent || !opened) return null;
        const delivered = emailsSent - (bounced || 0);
        const openRate = (opened / delivered) * 100;
        const clickRate = clicked ? (clicked / delivered) * 100 : 0;
        const clickToOpenRate = clicked ? (clicked / opened) * 100 : 0;
        const bounceRate = bounced ? (bounced / emailsSent) * 100 : 0;
        const unsubRate = unsubscribed ? (unsubscribed / delivered) * 100 : 0;
        return {
          primary: { label: "Open Rate", value: `${formatNumber(openRate, 2)}%` },
          details: [
            { label: "Delivered", value: formatNumber(delivered, 0) },
            { label: "Click Rate (CTR)", value: `${formatNumber(clickRate, 2)}%` },
            { label: "Click-to-Open Rate (CTOR)", value: `${formatNumber(clickToOpenRate, 2)}%` },
            { label: "Bounce Rate", value: `${formatNumber(bounceRate, 2)}%` },
            { label: "Unsubscribe Rate", value: `${formatNumber(unsubRate, 2)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["ctr-calculator", "subscriber-value", "bounce-rate"],
  faq: [
    { question: "What is a good email open rate?", answer: "The average email open rate across industries is about 20-25%. Rates above 25% are considered good, and above 30% is excellent." },
    { question: "How can I improve my email open rate?", answer: "Improve open rates by writing compelling subject lines, personalizing the sender name, segmenting your list, sending at optimal times, and A/B testing subject lines." },
  ],
  formula: "Open Rate = (Emails Opened / Emails Delivered) x 100",
};
