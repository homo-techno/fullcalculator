import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weddingBudgetCalculator: CalculatorDefinition = {
  slug: "wedding-budget-calculator",
  title: "Wedding Budget Calculator",
  description:
    "Free wedding budget calculator. Break down your total wedding budget into recommended category allocations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "wedding budget",
    "wedding planner",
    "wedding costs",
    "wedding breakdown",
    "marriage budget",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "budget",
          label: "Total Budget ($)",
          type: "number",
          placeholder: "e.g. 30000",
        },
      ],
      calculate: (inputs) => {
        const budget = inputs.budget as number;
        if (!budget || budget <= 0) return null;

        const venue = budget * 0.45;
        const catering = budget * 0.25;
        const photography = budget * 0.12;
        const flowers = budget * 0.09;
        const attire = budget * 0.06;
        const music = budget * 0.06;
        const remaining = budget - venue - catering - photography - flowers - attire - music;

        return {
          primary: {
            label: "Venue & Reception (45%)",
            value: "$" + formatNumber(venue, 0),
          },
          details: [
            {
              label: "Catering (25%)",
              value: "$" + formatNumber(catering, 0),
            },
            {
              label: "Photography & Video (12%)",
              value: "$" + formatNumber(photography, 0),
            },
            {
              label: "Flowers & Decor (9%)",
              value: "$" + formatNumber(flowers, 0),
            },
            {
              label: "Attire & Beauty (6%)",
              value: "$" + formatNumber(attire, 0),
            },
            {
              label: "DJ / Music (6%)",
              value: "$" + formatNumber(music, 0),
            },
            {
              label: "Miscellaneous / Buffer",
              value: "$" + formatNumber(remaining, 0),
            },
            {
              label: "Total Budget",
              value: "$" + formatNumber(budget, 0),
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["party-food-calculator"],
  faq: [
    {
      question: "How should I allocate my wedding budget?",
      answer:
        "A common breakdown is: Venue 40-50%, Catering 20-30%, Photography 10-15%, Flowers/Decor 8-10%, Attire 5-8%, and Music 5-8%. Always keep a 3-5% buffer for unexpected expenses.",
    },
    {
      question: "What is the average wedding cost?",
      answer:
        "The average U.S. wedding costs around $30,000-$35,000, though this varies significantly by region. Urban weddings tend to cost more than rural ones.",
    },
  ],
  formula:
    "Budget allocation: Venue 45%, Catering 25%, Photography 12%, Flowers 9%, Attire 6%, Music 6%. Remaining goes to miscellaneous/buffer. Percentages based on industry averages.",
};
