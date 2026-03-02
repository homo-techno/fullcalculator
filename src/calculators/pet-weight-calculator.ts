import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const petWeightCalculator: CalculatorDefinition = {
  slug: "pet-weight-calculator",
  title: "Pet Weight Calculator",
  description: "Estimate ideal pet weight based on breed size category and age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["ideal pet weight","dog weight chart","cat weight range"],
  variants: [{
    id: "standard",
    name: "Pet Weight",
    description: "Estimate ideal pet weight based on breed size category and age.",
    fields: [
      { name: "petType", label: "Pet Type", type: "select", options: [{ value: "1", label: "Dog" }, { value: "2", label: "Cat" }] },
      { name: "breedSize", label: "Breed Size", type: "select", options: [{ value: "1", label: "Small" }, { value: "2", label: "Medium" }, { value: "3", label: "Large" }, { value: "4", label: "Giant" }] },
      { name: "currentWeight", label: "Current Weight (lbs)", type: "number", min: 1, max: 250, defaultValue: 30 },
    ],
    calculate: (inputs) => {
    const petType = inputs.petType as string;
    const breedSize = inputs.breedSize as string;
    const currentWeight = inputs.currentWeight as number;
    let idealMin = 8;
    let idealMax = 15;
    if (petType === "1") {
      const ranges: Record<string, number[]> = { "1": [5, 20], "2": [20, 50], "3": [50, 90], "4": [90, 150] };
      const range = ranges[breedSize] || [20, 50];
      idealMin = range[0];
      idealMax = range[1];
    } else {
      idealMin = 7;
      idealMax = 12;
    }
    const idealMid = (idealMin + idealMax) / 2;
    const diff = currentWeight - idealMid;
    let status = "At Ideal Weight";
    if (currentWeight < idealMin) status = "Underweight";
    else if (currentWeight > idealMax) status = "Overweight";
    return {
      primary: { label: "Weight Status", value: status },
      details: [
        { label: "Ideal Range", value: idealMin + " - " + idealMax + " lbs" },
        { label: "Current Weight", value: currentWeight + " lbs" },
        { label: "Difference from Midpoint", value: (diff >= 0 ? "+" : "") + formatNumber(diff) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["pet-vaccination-schedule-calculator","vet-visit-cost-calculator","horse-weight-calculator"],
  faq: [
    { question: "How do I know if my dog is overweight?", answer: "You should be able to feel ribs easily and see a waist when viewed from above." },
    { question: "What is the ideal weight for a cat?", answer: "Most domestic cats should weigh between 7 and 12 pounds depending on breed." },
    { question: "How can I help my pet lose weight?", answer: "Reduce portion sizes, increase exercise, and consult your vet for a safe plan." },
  ],
  formula: "Status = Current Weight compared to Ideal Range (by pet type and breed size)",
};
