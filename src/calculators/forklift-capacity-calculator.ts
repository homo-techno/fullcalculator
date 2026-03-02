import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const forkliftCapacityCalculator: CalculatorDefinition = {
  slug: "forklift-capacity-calculator",
  title: "Forklift Capacity Calculator",
  description: "Calculate forklift load capacity at a given load center.",
  category: "Science",
  categorySlug: "A",
  icon: "Truck",
  keywords: ["forklift","capacity","load","center","lifting"],
  variants: [{
    id: "standard",
    name: "Forklift Capacity",
    description: "Calculate forklift load capacity at a given load center.",
    fields: [
      { name: "ratedCapacity", label: "Rated Capacity (lbs)", type: "number", min: 1000, max: 100000, defaultValue: 5000 },
      { name: "ratedLoadCenter", label: "Rated Load Center (in)", type: "number", min: 12, max: 60, defaultValue: 24 },
      { name: "actualLoadCenter", label: "Actual Load Center (in)", type: "number", min: 12, max: 120, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const ratedCapacity = inputs.ratedCapacity as number;
    const ratedLoadCenter = inputs.ratedLoadCenter as number;
    const actualLoadCenter = inputs.actualLoadCenter as number;
    const actualCapacity = (ratedCapacity * ratedLoadCenter) / actualLoadCenter;
    const capacityLoss = ratedCapacity - actualCapacity;
    const percentOfRated = (actualCapacity / ratedCapacity) * 100;
    return {
      primary: { label: "Actual Capacity (lbs)", value: formatNumber(actualCapacity) },
      details: [
        { label: "Rated Capacity (lbs)", value: formatNumber(ratedCapacity) },
        { label: "Capacity Reduction (lbs)", value: formatNumber(capacityLoss) },
        { label: "Percent of Rated", value: formatNumber(percentOfRated) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["pallet-load-calculator","trailer-tongue-weight-calculator","towing-capacity-calculator"],
  faq: [
    { question: "What is load center on a forklift?", answer: "The horizontal distance from the fork face to the center of gravity of the load." },
    { question: "How does load center affect capacity?", answer: "As load center increases, the effective lifting capacity decreases." },
  ],
  formula: "Actual Capacity = Rated Capacity x Rated Center / Actual Center",
};
