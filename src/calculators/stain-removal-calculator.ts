import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stainRemovalCalculator: CalculatorDefinition = {
  slug: "stain-removal-calculator",
  title: "Stain Removal Calculator",
  description: "Get treatment method and time by stain type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stain","removal","treatment","laundry"],
  variants: [{
    id: "standard",
    name: "Stain Removal",
    description: "Get treatment method and time by stain type.",
    fields: [
      { name: "stainType", label: "Stain Type", type: "select", options: [{ value: "1", label: "Grease/Oil" }, { value: "2", label: "Wine/Juice" }, { value: "3", label: "Ink" }, { value: "4", label: "Blood" }, { value: "5", label: "Grass" }] },
      { name: "items", label: "Number of Items", type: "number", min: 1, max: 20, defaultValue: 2 },
      { name: "age", label: "Stain Age", type: "select", options: [{ value: "1", label: "Fresh (under 1 hour)" }, { value: "1.5", label: "Set (1 to 24 hours)" }, { value: "2", label: "Old (over 24 hours)" }] },
    ],
    calculate: (inputs) => {
    const stainType = inputs.stainType as number;
    const items = inputs.items as number;
    const age = inputs.age as number;
    const treatments = ["", "Dish soap and hot water soak", "Cold water and salt, then vinegar", "Rubbing alcohol and blotting", "Cold water rinse then hydrogen peroxide", "White vinegar and baking soda paste"];
    const baseTimes = [0, 15, 20, 25, 10, 15];
    const treatmentTime = Math.ceil(baseTimes[stainType] * age * items);
    const successRate = Math.max(50, 95 - (age - 1) * 20);
    const treatment = treatments[stainType];
    return { primary: { label: "Treatment Time", value: treatmentTime + " minutes" }, details: [{ label: "Recommended Treatment", value: treatment }, { label: "Number of Items", value: formatNumber(items) }, { label: "Estimated Success Rate", value: successRate + "%" }] };
  },
  }],
  relatedSlugs: ["laundry-cost-calculator","ironing-time-calculator","dry-cleaning-cost-calculator"],
  faq: [
    { question: "How do I remove grease stains?", answer: "Apply dish soap directly and soak in hot water." },
    { question: "Can old stains be removed?", answer: "Old stains are harder but multiple treatments can help." },
    { question: "Does cold or hot water work better?", answer: "Cold water for blood and wine, hot for grease." },
  ],
  formula: "Time = BaseTime[Type] * AgeFactor * Items",
};
