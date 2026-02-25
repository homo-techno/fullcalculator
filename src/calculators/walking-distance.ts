import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const paceOptions = [
  { label: "Slow (2.0 mph)", value: "2.0" },
  { label: "Leisurely (2.5 mph)", value: "2.5" },
  { label: "Moderate (3.0 mph)", value: "3.0" },
  { label: "Brisk (3.5 mph)", value: "3.5" },
  { label: "Fast (4.0 mph)", value: "4.0" },
  { label: "Power Walk (4.5 mph)", value: "4.5" },
];

export const walkingDistanceCalculator: CalculatorDefinition = {
  slug: "walking-distance-calculator",
  title: "Walking Distance / Steps Calculator",
  description:
    "Free walking distance and steps calculator. Convert between steps, distance, and time based on your walking pace and stride length.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "walking distance",
    "steps calculator",
    "step counter",
    "miles walked",
    "walking time",
    "10000 steps",
  ],
  variants: [
    {
      id: "steps-to-distance",
      name: "Steps to Distance",
      description: "Convert steps to distance and time",
      fields: [
        {
          name: "steps",
          label: "Number of Steps",
          type: "number",
          placeholder: "e.g. 10000",
          min: 1,
        },
        {
          name: "strideLength",
          label: "Stride Length (inches)",
          type: "number",
          placeholder: "e.g. 30",
          min: 12,
          max: 48,
          defaultValue: 30,
        },
        {
          name: "pace",
          label: "Walking Pace",
          type: "select",
          options: paceOptions,
        },
      ],
      calculate: (inputs) => {
        const steps = inputs.steps as number;
        const strideInches = (inputs.strideLength as number) || 30;
        const paceStr = (inputs.pace as string) || "3.0";

        if (!steps) return null;

        const paceMph = parseFloat(paceStr);
        const strideFeet = strideInches / 12;
        const totalFeet = steps * strideFeet;
        const miles = totalFeet / 5280;
        const km = miles * 1.60934;
        const timeHours = miles / paceMph;
        const timeMinutes = timeHours * 60;

        // Calorie estimate: ~0.04 cal per step (average)
        const calories = steps * 0.04;

        return {
          primary: {
            label: "Distance",
            value: `${formatNumber(miles, 2)} miles`,
          },
          details: [
            { label: "Steps", value: formatNumber(steps) },
            { label: "Distance (km)", value: formatNumber(km, 2) },
            { label: "Distance (feet)", value: formatNumber(totalFeet, 0) },
            { label: "Walking pace", value: `${paceMph} mph` },
            { label: "Estimated time", value: `${formatNumber(timeMinutes, 1)} minutes` },
            { label: "Stride length", value: `${strideInches} inches` },
            { label: "Estimated calories burned", value: formatNumber(calories, 0) },
          ],
        };
      },
    },
    {
      id: "distance-to-steps",
      name: "Distance to Steps",
      description: "Convert a distance into step count",
      fields: [
        {
          name: "distance",
          label: "Distance",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.01,
          step: 0.1,
        },
        {
          name: "distanceUnit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Miles", value: "miles" },
            { label: "Kilometers", value: "km" },
          ],
        },
        {
          name: "strideLength",
          label: "Stride Length (inches)",
          type: "number",
          placeholder: "e.g. 30",
          min: 12,
          max: 48,
          defaultValue: 30,
        },
      ],
      calculate: (inputs) => {
        const distance = inputs.distance as number;
        const distanceUnit = (inputs.distanceUnit as string) || "miles";
        const strideInches = (inputs.strideLength as number) || 30;

        if (!distance) return null;

        const miles = distanceUnit === "km" ? distance / 1.60934 : distance;
        const totalFeet = miles * 5280;
        const strideFeet = strideInches / 12;
        const steps = totalFeet / strideFeet;
        const calories = steps * 0.04;

        return {
          primary: {
            label: "Steps Required",
            value: formatNumber(steps, 0),
            suffix: "steps",
          },
          details: [
            { label: "Distance", value: `${formatNumber(miles, 2)} miles` },
            { label: "Stride length", value: `${strideInches} inches` },
            { label: "Estimated calories", value: formatNumber(calories, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "steps-to-calories-calculator",
    "steps-miles-calculator",
    "walking-calorie-calculator",
  ],
  faq: [
    {
      question: "How many steps are in a mile?",
      answer:
        "With an average stride length of 2.5 feet (30 inches), there are about 2,112 steps in a mile. Taller people with longer strides will have fewer steps per mile.",
    },
    {
      question: "Is 10,000 steps really a good daily goal?",
      answer:
        "10,000 steps (about 4.7 miles) is a widely cited goal. Studies show significant health benefits at 7,000-8,000 steps per day, with additional but diminishing returns beyond that.",
    },
  ],
  formula:
    "Distance = Steps x Stride Length / 5280 (miles). Time = Distance / Pace. Calories ~ Steps x 0.04.",
};
