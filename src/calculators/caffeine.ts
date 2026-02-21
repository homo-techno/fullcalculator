import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const caffeineCalculator: CalculatorDefinition = {
  slug: "caffeine-calculator",
  title: "Caffeine Calculator",
  description:
    "Free caffeine calculator. Track remaining caffeine in your system based on consumption amount, time elapsed, and caffeine half-life.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["caffeine calculator", "caffeine half-life", "remaining caffeine", "coffee metabolism"],
  variants: [
    {
      id: "caffeineDecay",
      name: "Caffeine Remaining",
      fields: [
        {
          name: "mgConsumed",
          label: "Caffeine Consumed (mg)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "hoursAgo",
          label: "Hours Since Consumption",
          type: "number",
          placeholder: "e.g. 3",
        },
      ],
      calculate: (inputs) => {
        const mgConsumed = inputs.mgConsumed as number;
        const hoursAgo = inputs.hoursAgo as number;
        if (!mgConsumed) return null;

        const halfLife = 5; // hours
        const hoursElapsed = hoursAgo || 0;
        const remaining = mgConsumed * Math.pow(0.5, hoursElapsed / halfLife);

        // Calculate hours until caffeine drops below 50mg
        let hoursUntil50: number | null = null;
        if (remaining > 50) {
          // remaining * 0.5^(t/5) = 50 => t = 5 * log2(remaining/50)
          hoursUntil50 = halfLife * Math.log2(remaining / 50);
        }

        const details = [
          { label: "Initial Amount", value: `${formatNumber(mgConsumed, 0)} mg` },
          { label: "Hours Elapsed", value: `${formatNumber(hoursElapsed, 1)} hours` },
          { label: "Half-Life", value: "~5 hours" },
          { label: "Metabolized", value: `${formatNumber(mgConsumed - remaining, 0)} mg` },
        ];

        if (hoursUntil50 !== null) {
          const totalHoursFromNow = hoursUntil50;
          details.push({
            label: "Drops Below 50 mg In",
            value: `${formatNumber(totalHoursFromNow, 1)} hours from now`,
          });
        } else {
          details.push({
            label: "Status",
            value: "Already below 50 mg",
          });
        }

        return {
          primary: {
            label: "Remaining Caffeine",
            value: `${formatNumber(remaining, 0)} mg`,
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["hydration-calculator", "medication-dosage-calculator"],
  faq: [
    {
      question: "What is the half-life of caffeine?",
      answer:
        "The average half-life of caffeine is approximately 5 hours, meaning half the caffeine is eliminated from your body every 5 hours. Individual half-lives can range from 3 to 7 hours.",
    },
    {
      question: "How much caffeine is in common beverages?",
      answer:
        "An 8 oz cup of coffee has about 80\u2013100 mg, espresso about 63 mg per shot, black tea about 47 mg, and a 12 oz cola about 34 mg of caffeine.",
    },
  ],
  formula:
    "Remaining Caffeine = Initial mg \u00D7 0.5^(hours / 5). Half-life \u2248 5 hours. Time to target = 5 \u00D7 log\u2082(current / target).",
};
