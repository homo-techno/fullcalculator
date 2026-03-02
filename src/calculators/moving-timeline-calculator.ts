import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const movingTimelineCalculator: CalculatorDefinition = {
  slug: "moving-timeline-calculator",
  title: "Moving Timeline Calculator",
  description: "Estimate the weeks needed to plan and execute a move.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["moving","timeline","planning","schedule"],
  variants: [{
    id: "standard",
    name: "Moving Timeline",
    description: "Estimate the weeks needed to plan and execute a move.",
    fields: [
      { name: "bedrooms", label: "Number of Bedrooms", type: "number", min: 1, max: 8, defaultValue: 3 },
      { name: "distance", label: "Move Distance (miles)", type: "number", min: 1, max: 5000, defaultValue: 100 },
      { name: "helpers", label: "Number of Helpers", type: "number", min: 1, max: 10, defaultValue: 2 },
    ],
    calculate: (inputs) => {
    const bedrooms = inputs.bedrooms as number;
    const distance = inputs.distance as number;
    const helpers = inputs.helpers as number;
    const packingWeeks = Math.ceil(bedrooms / helpers);
    const planningWeeks = distance > 500 ? 6 : 3;
    const totalWeeks = packingWeeks + planningWeeks + 1;
    const startDate = totalWeeks + " weeks before move day";
    return { primary: { label: "Recommended Timeline", value: totalWeeks + " weeks" }, details: [{ label: "Planning Phase", value: planningWeeks + " weeks" }, { label: "Packing Phase", value: packingWeeks + " weeks" }, { label: "Start Preparing", value: startDate }] };
  },
  }],
  relatedSlugs: ["moving-cost-calculator","moving-box-calculator","packing-tape-calculator"],
  faq: [
    { question: "How early should I start planning a move?", answer: "Start at least 4 to 8 weeks before your move date." },
    { question: "What is the first step when planning a move?", answer: "Declutter and inventory your belongings first." },
    { question: "Does distance affect planning time?", answer: "Yes, long distance moves need more lead time." },
  ],
  formula: "Timeline = PlanningWeeks + ceil(Bedrooms / Helpers) + 1",
};
