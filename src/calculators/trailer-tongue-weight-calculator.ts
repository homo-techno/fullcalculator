import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trailerTongueWeightCalculator: CalculatorDefinition = {
  slug: "trailer-tongue-weight-calculator",
  title: "Trailer Tongue Weight Calculator",
  description: "Calculate tongue weight for safe towing.",
  category: "Science",
  categorySlug: "A",
  icon: "Scale",
  keywords: ["tongue","weight","trailer","towing","hitch"],
  variants: [{
    id: "standard",
    name: "Trailer Tongue Weight",
    description: "Calculate tongue weight for safe towing.",
    fields: [
      { name: "trailerWeight", label: "Loaded Trailer Weight (lbs)", type: "number", min: 100, max: 50000, defaultValue: 5000 },
      { name: "tonguePercent", label: "Target Tongue Weight (%)", type: "number", min: 5, max: 25, defaultValue: 12 },
      { name: "hitchRating", label: "Hitch Rating (lbs)", type: "number", min: 100, max: 20000, defaultValue: 800 },
    ],
    calculate: (inputs) => {
    const trailerWeight = inputs.trailerWeight as number;
    const tonguePercent = inputs.tonguePercent as number;
    const hitchRating = inputs.hitchRating as number;
    const tongueWeight = trailerWeight * (tonguePercent / 100);
    const isSafe = tongueWeight <= hitchRating;
    const margin = hitchRating - tongueWeight;
    const actualPercent = (tongueWeight / trailerWeight) * 100;
    return {
      primary: { label: "Tongue Weight (lbs)", value: formatNumber(tongueWeight) },
      details: [
        { label: "Tongue Weight Percent", value: formatNumber(actualPercent) + "%" },
        { label: "Hitch Rating (lbs)", value: formatNumber(hitchRating) },
        { label: "Safety Margin (lbs)", value: formatNumber(margin) },
        { label: "Status", value: isSafe ? "Within Rating" : "Exceeds Hitch Rating" }
      ]
    };
  },
  }],
  relatedSlugs: ["towing-capacity-calculator","forklift-capacity-calculator","container-weight-calculator"],
  faq: [
    { question: "What is the ideal tongue weight?", answer: "Tongue weight should be 10 to 15 percent of total loaded trailer weight." },
    { question: "What happens with too little tongue weight?", answer: "Too little tongue weight can cause trailer sway and loss of control." },
  ],
  formula: "Tongue Weight = Trailer Weight x Tongue Weight Percentage",
};
