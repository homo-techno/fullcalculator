import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stepsToDistanceCalculator: CalculatorDefinition = {
  slug: "steps-to-distance-calculator",
  title: "Steps to Distance Calculator",
  description: "Convert your step count to distance in miles or kilometers based on your stride length.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["steps to distance", "step counter distance", "walking distance calculator"],
  variants: [{
    id: "standard",
    name: "Steps to Distance",
    description: "Convert your step count to distance in miles or kilometers based on your stride length",
    fields: [
      { name: "steps", label: "Number of Steps", type: "number", suffix: "steps", min: 100, max: 200000, defaultValue: 10000 },
      { name: "height", label: "Your Height", type: "number", suffix: "inches", min: 48, max: 84, defaultValue: 68 },
      { name: "pace", label: "Walking Pace", type: "select", options: [{value:"slow",label:"Slow (Casual Walk)"},{value:"moderate",label:"Moderate (Brisk Walk)"},{value:"fast",label:"Fast (Power Walk/Jog)"}], defaultValue: "moderate" },
    ],
    calculate: (inputs) => {
      const steps = inputs.steps as number;
      const height = inputs.height as number;
      const pace = inputs.pace as string;
      if (!steps || !height) return null;
      const strideMod: Record<string, number> = { slow: 0.37, moderate: 0.41, fast: 0.45 };
      const strideLength = height * (strideMod[pace] || 0.41);
      const distanceInches = steps * strideLength;
      const miles = distanceInches / 63360;
      const km = miles * 1.60934;
      const caloriesPer1000 = pace === "slow" ? 30 : pace === "moderate" ? 40 : 55;
      const calories = (steps / 1000) * caloriesPer1000;
      return {
        primary: { label: "Distance Covered", value: formatNumber(Math.round(miles * 100) / 100) + " miles" },
        details: [
          { label: "Distance in Kilometers", value: formatNumber(Math.round(km * 100) / 100) + " km" },
          { label: "Stride Length", value: formatNumber(Math.round(strideLength * 10) / 10) + " inches" },
          { label: "Estimated Calories Burned", value: formatNumber(Math.round(calories)) + " kcal" },
        ],
      };
    },
  }],
  relatedSlugs: ["caffeine-half-life-calculator", "supplement-cost-calculator"],
  faq: [
    { question: "How many steps are in a mile?", answer: "The average person takes about 2,000 to 2,500 steps per mile, depending on height and stride length. Taller people take fewer steps per mile." },
    { question: "Is 10,000 steps a day a good goal?", answer: "Ten thousand steps per day is a popular target that equals roughly 4 to 5 miles. Studies show significant health benefits starting at 7,000 to 8,000 steps daily." },
  ],
  formula: "Distance = Steps x Stride Length (Height x Pace Modifier) / 63360",
};
