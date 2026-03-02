import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trampolineWeightLimitCalculator: CalculatorDefinition = {
  slug: "trampoline-weight-limit-calculator",
  title: "Trampoline Weight Limit Calculator",
  description: "Estimate the maximum user weight for a trampoline size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["trampoline","weight","limit","safety"],
  variants: [{
    id: "standard",
    name: "Trampoline Weight Limit",
    description: "Estimate the maximum user weight for a trampoline size.",
    fields: [
      { name: "diameter", label: "Trampoline Diameter (ft)", type: "number", min: 6, max: 20, defaultValue: 14 },
      { name: "springCount", label: "Number of Springs", type: "number", min: 36, max: 150, defaultValue: 96 },
      { name: "users", label: "Number of Users", type: "number", min: 1, max: 4, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const diameter = inputs.diameter as number;
    const springCount = inputs.springCount as number;
    const users = inputs.users as number;
    const baseWeight = diameter * 20 + springCount * 1.5;
    const perUser = baseWeight / users;
    return {
      primary: { label: "Max Weight Limit", value: formatNumber(baseWeight) + " lbs" },
      details: [
        { label: "Max per User", value: formatNumber(perUser) + " lbs" },
        { label: "Number of Users", value: formatNumber(users) }
      ]
    };
  },
  }],
  relatedSlugs: ["swing-set-spacing-calculator","basketball-court-size-calculator"],
  faq: [
    { question: "What is a typical trampoline weight limit?", answer: "Most 14 foot trampolines support 250 to 400 pounds." },
    { question: "Can multiple people jump at once?", answer: "Manufacturers recommend only one jumper at a time for safety." },
  ],
  formula: "Max Weight = Diameter x 20 + Spring Count x 1.5",
};
