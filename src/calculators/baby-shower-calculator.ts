import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyShowerCalculator: CalculatorDefinition = {
  slug: "baby-shower-calculator",
  title: "Baby Shower Calculator",
  description: "Free baby shower calculator. Estimate costs and plan your budget.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baby shower calculator", "cost calculator", "budget planner"],
  variants: [
    {
      id: "estimate",
      name: "Cost Estimate",
      description: "Estimate baby shower costs",
      fields: [
        {
          name: "guests",
          label: "Number of Guests",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 1000,
        },
        {
          name: "costPerGuest",
          label: "Cost per Guest",
          type: "number",
          placeholder: "e.g. 75",
          prefix: "$",
          min: 0,
          step: 0.01,
        },
        {
          name: "extras",
          label: "Additional Costs",
          type: "number",
          placeholder: "e.g. 500",
          prefix: "$",
          min: 0,
        }
      ],
      calculate: (inputs) => {
        const guests = inputs.guests as number;
        const cpg = inputs.costPerGuest as number;
        const extras = inputs.extras as number || 0;
        if (!guests || !cpg) return null;
        const guestCost = guests * cpg;
        const total = guestCost + extras;
        return {
          primary: { label: "Total Cost", value: "$" + formatNumber(total) },
          details: [
            { label: "Guest costs", value: "$" + formatNumber(guestCost) },
            { label: "Additional costs", value: "$" + formatNumber(extras) },
            { label: "Per person total", value: "$" + formatNumber(total / guests) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["percentage-calculator", "tip-calculator"],
  faq: [
    { question: "How much does baby shower cost?", answer: "Costs vary by location, quality, and requirements. Use our calculator for a personalized estimate." },
    { question: "How can I save money?", answer: "Compare providers, look for seasonal discounts, and plan ahead to reduce costs." },
  ],
  formula: "Total = Sum of all cost components",
};
