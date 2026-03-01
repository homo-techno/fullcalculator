import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingDayTipCalculator: CalculatorDefinition = {
  slug: "moving-day-tip-calculator",
  title: "Moving Day Tip Calculator",
  description: "Calculate how much to tip your movers based on job size, hours, and service quality.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["moving day tip", "tip movers", "mover tip calculator"],
  variants: [{
    id: "standard",
    name: "Moving Day Tip",
    description: "Calculate how much to tip your movers based on job size, hours, and service quality",
    fields: [
      { name: "movers", label: "Number of Movers", type: "number", suffix: "movers", min: 1, max: 10, defaultValue: 3 },
      { name: "hours", label: "Move Duration", type: "number", suffix: "hours", min: 1, max: 16, defaultValue: 6 },
      { name: "moveSize", label: "Move Size", type: "select", options: [{value:"small",label:"Small (Studio/1BR)"},{value:"medium",label:"Medium (2-3BR)"},{value:"large",label:"Large (4+BR/Long Distance)"}], defaultValue: "medium" },
      { name: "serviceQuality", label: "Service Quality", type: "select", options: [{value:"average",label:"Average"},{value:"good",label:"Good"},{value:"excellent",label:"Excellent"}], defaultValue: "good" },
    ],
    calculate: (inputs) => {
      const movers = inputs.movers as number;
      const hours = inputs.hours as number;
      const size = inputs.moveSize as string;
      const quality = inputs.serviceQuality as string;
      if (!movers || !hours) return null;
      const basePerHour: Record<string, number> = { small: 5, medium: 6, large: 8 };
      const qualityMod: Record<string, number> = { average: 0.8, good: 1.0, excellent: 1.3 };
      const tipPerMover = (basePerHour[size] || 6) * hours * (qualityMod[quality] || 1.0);
      const totalTip = tipPerMover * movers;
      const tipPerMoverRounded = Math.round(tipPerMover / 5) * 5;
      return {
        primary: { label: "Total Tip Amount", value: "$" + formatNumber(Math.round(totalTip / 5) * 5) },
        details: [
          { label: "Tip per Mover", value: "$" + formatNumber(tipPerMoverRounded) },
          { label: "Number of Movers", value: formatNumber(movers) },
          { label: "Service Rating", value: quality.charAt(0).toUpperCase() + quality.slice(1) },
        ],
      };
    },
  }],
  relatedSlugs: ["tipping-etiquette-calculator", "potluck-planner-calculator"],
  faq: [
    { question: "How much should I tip movers?", answer: "A standard tip is $4 to $8 per mover per hour for local moves. For long-distance or exceptionally difficult moves, consider tipping $6 to $10 per mover per hour." },
    { question: "Should I tip movers in cash?", answer: "Cash is preferred for tipping movers as it can be distributed immediately. Hand each mover their tip individually at the end of the job." },
  ],
  formula: "Tip per Mover = Base Rate per Hour x Hours x Quality Modifier",
};
