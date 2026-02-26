import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stepsToMilesCalculator: CalculatorDefinition = {
  slug: "steps-to-miles",
  title: "Steps to Miles/KM Converter",
  description: "Free online steps to miles and kilometers converter. Convert your daily step count to distance walked or run based on your stride length.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["steps to miles", "steps to km", "step converter", "walking distance", "pedometer distance", "steps distance"],
  variants: [
    {
      id: "steps-to-distance",
      name: "Convert Steps to Distance",
      fields: [
        { name: "steps", label: "Number of Steps", type: "number", placeholder: "e.g. 10000" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 68" },
        {
          name: "activity",
          label: "Activity Type",
          type: "select",
          options: [
            { label: "Walking", value: "walk" },
            { label: "Running", value: "run" },
          ],
        },
      ],
      calculate: (inputs) => {
        const steps = parseFloat(inputs.steps as string) || 0;
        const height = parseFloat(inputs.height as string) || 68;
        const activity = inputs.activity as string;

        let strideFactor: number;
        if (activity === "run") {
          strideFactor = 1.3;
        } else {
          strideFactor = 0.414;
        }

        const strideInches = height * strideFactor;
        const strideFeet = strideInches / 12;

        const distanceFeet = steps * strideFeet;
        const distanceMiles = distanceFeet / 5280;
        const distanceKm = distanceMiles * 1.60934;
        const distanceMeters = distanceKm * 1000;

        const stepsPerMile = 5280 / strideFeet;

        return {
          primary: { label: "Distance (miles)", value: formatNumber(distanceMiles) },
          details: [
            { label: "Distance (km)", value: formatNumber(distanceKm) },
            { label: "Distance (meters)", value: formatNumber(Math.round(distanceMeters)) },
            { label: "Distance (feet)", value: formatNumber(Math.round(distanceFeet)) },
            { label: "Stride Length (inches)", value: formatNumber(strideInches) },
            { label: "Steps per Mile", value: formatNumber(Math.round(stepsPerMile)) },
            { label: "Total Steps", value: formatNumber(steps) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steps-to-calories", "stride-length-calc", "5k-pace"],
  faq: [
    {
      question: "How many steps are in a mile?",
      answer: "On average, there are about 2,000-2,500 steps in a mile when walking. For a person of average height (5'7\"), it is approximately 2,200 steps per mile walking and 1,500-1,700 steps per mile running.",
    },
    {
      question: "How far is 10,000 steps?",
      answer: "For most people, 10,000 steps is approximately 4.5-5 miles (7.2-8.0 km) when walking. The exact distance depends on your stride length, which is influenced by height and walking speed.",
    },
    {
      question: "Does stride length change when running vs walking?",
      answer: "Yes. Running stride length is significantly longer than walking stride, typically 2.5-3x longer. This means you cover more distance per step when running, so the same number of steps equals a greater distance.",
    },
  ],
  formula: "Stride (inches) = Height x Factor (0.414 walk, 1.3 run); Distance (miles) = Steps x Stride (ft) / 5280; Distance (km) = Miles x 1.60934",
};
