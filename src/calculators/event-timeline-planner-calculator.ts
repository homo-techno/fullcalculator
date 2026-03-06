import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const eventTimelinePlannerCalculator: CalculatorDefinition = {
  slug: "event-timeline-planner-calculator",
  title: "Event Timeline Planner Calculator",
  description: "Build a wedding or event timeline by allocating hours for ceremony, cocktails, dinner, dancing, and other activities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["event timeline","wedding schedule","reception timeline","event planning hours"],
  variants: [{
    id: "standard",
    name: "Event Timeline Planner",
    description: "Build a wedding or event timeline by allocating hours for ceremony, cocktails, dinner, dancing, and other activities.",
    fields: [
      { name: "ceremonyMinutes", label: "Ceremony Duration (min)", type: "number", min: 10, max: 120, defaultValue: 30 },
      { name: "cocktailMinutes", label: "Cocktail Hour (min)", type: "number", min: 0, max: 120, defaultValue: 60 },
      { name: "dinnerMinutes", label: "Dinner Duration (min)", type: "number", min: 30, max: 180, defaultValue: 90 },
      { name: "dancingMinutes", label: "Dancing/Party (min)", type: "number", min: 30, max: 300, defaultValue: 180 },
      { name: "photosMinutes", label: "Photo Session (min)", type: "number", min: 0, max: 120, defaultValue: 45 },
      { name: "bufferMinutes", label: "Buffer/Transition Time (min)", type: "number", min: 0, max: 60, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const ceremony = inputs.ceremonyMinutes as number;
    const cocktail = inputs.cocktailMinutes as number;
    const dinner = inputs.dinnerMinutes as number;
    const dancing = inputs.dancingMinutes as number;
    const photos = inputs.photosMinutes as number;
    const buffer = inputs.bufferMinutes as number;
    const totalMinutes = ceremony + cocktail + dinner + dancing + photos + buffer;
    const totalHours = totalMinutes / 60;
    return {
      primary: { label: "Total Event Duration", value: formatNumber(Math.round(totalHours * 10) / 10) + " hours" },
      details: [
        { label: "Total Minutes", value: formatNumber(totalMinutes) + " min" },
        { label: "Ceremony", value: formatNumber(ceremony) + " min" },
        { label: "Cocktail Hour", value: formatNumber(cocktail) + " min" },
        { label: "Dinner", value: formatNumber(dinner) + " min" },
        { label: "Dancing/Party", value: formatNumber(dancing) + " min" },
        { label: "Photos + Buffer", value: formatNumber(photos + buffer) + " min" }
      ]
    };
  },
  }],
  relatedSlugs: ["reception-venue-cost-calculator","wedding-budget-calculator","seating-chart-optimizer-calculator"],
  faq: [
    { question: "How long should a wedding reception be?", answer: "Most wedding receptions last 4 to 5 hours. This includes a cocktail hour, dinner service, toasts, and 2-3 hours of dancing." },
    { question: "What is a typical wedding day timeline?", answer: "A typical timeline is: getting ready (3-4 hours), ceremony (30 minutes), photos (45 minutes), cocktail hour (1 hour), dinner (1.5 hours), and dancing (3 hours)." },
    { question: "How much buffer time should you plan?", answer: "Allow 15-30 minutes of buffer between major events. Transitions always take longer than expected, especially with large guest counts." },
  ],
  formula: "Total Duration (hours) = (Ceremony + Cocktail + Dinner + Dancing + Photos + Buffer) / 60",
};
