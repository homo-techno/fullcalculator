import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flexibilityAgeCalculator: CalculatorDefinition = {
  slug: "flexibility-age-calculator",
  title: "Flexibility Age Calculator",
  description: "Estimate your fitness age based on flexibility and mobility metrics",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["flexibility age","fitness age","mobility assessment"],
  variants: [{
    id: "standard",
    name: "Flexibility Age",
    description: "Estimate your fitness age based on flexibility and mobility metrics",
    fields: [
      { name: "actualAge", label: "Actual Age", type: "number", defaultValue: 35, min: 15, max: 80, step: 1 },
      { name: "sitAndReach", label: "Sit and Reach (inches past toes)", type: "number", defaultValue: 2, min: -10, max: 15, step: 0.5 },
      { name: "shoulderFlexion", label: "Shoulder Flexion (degrees)", type: "number", defaultValue: 160, min: 90, max: 190, step: 5 },
      { name: "squatDepth", label: "Squat Depth (1=Partial, 5=Full ATG)", type: "number", defaultValue: 3, min: 1, max: 5, step: 1 },
      { name: "exerciseFreq", label: "Stretch/Yoga Days Per Week", type: "number", defaultValue: 2, min: 0, max: 7, step: 1 },
    ],
    calculate: (inputs: Record<string, string | number>) => {
      const age = inputs.actualAge as number || 35;
      const sitReach = inputs.sitAndReach as number || 2;
      const shoulder = inputs.shoulderFlexion as number || 160;
      const squat = inputs.squatDepth as number || 3;
      const freq = inputs.exerciseFreq as number || 2;
      const sitReachScore = Math.min(25, (sitReach + 5) * 2);
      const shoulderScore = Math.min(25, (shoulder - 90) * 0.25);
      const squatScore = squat * 5;
      const freqScore = Math.min(25, freq * 5);
      const totalScore = sitReachScore + shoulderScore + squatScore + freqScore;
      const flexAge = Math.round(age - (totalScore - 40) * 0.5);
      const difference = age - flexAge;
      let rating = "Average";
      if (difference > 10) rating = "Excellent";
      else if (difference > 5) rating = "Good";
      else if (difference < -5) rating = "Below Average";
      else if (difference < -10) rating = "Poor";
      return {
        primary: { label: "Flexibility Age", value: flexAge + " years" },
        details: [
          { label: "Age Difference", value: (difference > 0 ? difference + " years younger" : Math.abs(difference) + " years older") },
          { label: "Flexibility Rating", value: rating },
          { label: "Total Score", value: formatNumber(Math.round(totalScore)) + "/100" },
          { label: "Sit and Reach Score", value: formatNumber(Math.round(sitReachScore)) + "/25" }
        ]
      };
    },
  }],
  relatedSlugs: ["vo2-max-calculator"],
  faq: [
    { question: "What is flexibility age?", answer: "Flexibility age estimates how old your body acts based on mobility. Lower than actual age is better." },
    { question: "How can I improve my flexibility age?", answer: "Regular stretching, yoga, and mobility work 3-5 times per week can significantly improve flexibility." },
  ],
  formula: "Flex Age = Actual Age - (Total Flexibility Score - 40) x 0.5",
};
