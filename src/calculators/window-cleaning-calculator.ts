import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const windowCleaningCalculator: CalculatorDefinition = {
  slug: "window-cleaning-calculator",
  title: "Window Cleaning Calculator",
  description: "Estimate window cleaning cost by window count.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["window","cleaning","cost","glass"],
  variants: [{
    id: "standard",
    name: "Window Cleaning",
    description: "Estimate window cleaning cost by window count.",
    fields: [
      { name: "windows", label: "Number of Windows", type: "number", min: 1, max: 50, defaultValue: 12 },
      { name: "stories", label: "Number of Stories", type: "number", min: 1, max: 4, defaultValue: 2 },
      { name: "condition", label: "Window Condition", type: "select", options: [{ value: "1", label: "Lightly Dirty" }, { value: "1.3", label: "Moderately Dirty" }, { value: "1.6", label: "Very Dirty" }] },
    ],
    calculate: (inputs) => {
    const windows = inputs.windows as number;
    const stories = inputs.stories as number;
    const condition = inputs.condition as number;
    const basePerWindow = 8;
    const storyMultiplier = 1 + (stories - 1) * 0.25;
    const costPerWindow = basePerWindow * storyMultiplier * condition;
    const totalCost = windows * costPerWindow;
    const timeMinutes = windows * 10 * condition;
    return { primary: { label: "Estimated Cleaning Cost", value: "$" + formatNumber(totalCost) }, details: [{ label: "Cost Per Window", value: "$" + formatNumber(costPerWindow) }, { label: "Number of Windows", value: formatNumber(windows) }, { label: "Estimated Time", value: formatNumber(timeMinutes) + " minutes" }] };
  },
  }],
  relatedSlugs: ["house-cleaning-time-calculator","gutter-cleaning-cost-calculator","pressure-washing-calculator"],
  faq: [
    { question: "How much does window cleaning cost?", answer: "About $5 to $15 per window depending on size and access." },
    { question: "How often should windows be cleaned?", answer: "Clean windows at least twice a year." },
    { question: "Does story height affect cost?", answer: "Yes, higher floors cost more due to safety equipment." },
  ],
  formula: "Cost = Windows * BaseRate * StoryMultiplier * Condition",
};
