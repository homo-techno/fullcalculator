import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const strideLengthCalcCalculator: CalculatorDefinition = {
  slug: "stride-length-calc",
  title: "Stride Length Calculator",
  description: "Free online stride length calculator. Estimate your walking or running stride length based on height, or calculate it from distance and step count.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["stride length", "step length", "stride calculator", "walking stride", "running stride", "gait length"],
  variants: [
    {
      id: "from-height",
      name: "Estimate from Height",
      fields: [
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 68" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
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
        const height = parseFloat(inputs.height as string) || 0;
        const gender = inputs.gender as string;
        const activity = inputs.activity as string;

        const heightCm = height * 2.54;

        let strideFactor: number;
        if (activity === "run") {
          strideFactor = gender === "male" ? 1.35 : 1.25;
        } else {
          strideFactor = gender === "male" ? 0.415 : 0.413;
        }

        let strideInches: number;
        if (activity === "run") {
          strideInches = height * strideFactor;
        } else {
          strideInches = height * strideFactor;
        }

        const strideFeet = strideInches / 12;
        const strideCm = strideInches * 2.54;
        const strideMeters = strideCm / 100;
        const stepsPerMile = 5280 / strideFeet;
        const stepsPerKm = 1000 / strideMeters;

        return {
          primary: { label: "Stride Length", value: `${formatNumber(strideInches)} inches` },
          details: [
            { label: "Stride (feet)", value: formatNumber(strideFeet) },
            { label: "Stride (cm)", value: formatNumber(strideCm) },
            { label: "Stride (meters)", value: formatNumber(strideMeters) },
            { label: "Steps per Mile", value: formatNumber(Math.round(stepsPerMile)) },
            { label: "Steps per Kilometer", value: formatNumber(Math.round(stepsPerKm)) },
            { label: "Height (inches)", value: formatNumber(height) },
          ],
        };
      },
    },
    {
      id: "from-distance",
      name: "Calculate from Distance and Steps",
      fields: [
        { name: "distance", label: "Distance Covered (feet)", type: "number", placeholder: "e.g. 100" },
        { name: "steps", label: "Number of Steps", type: "number", placeholder: "e.g. 40" },
      ],
      calculate: (inputs) => {
        const distance = parseFloat(inputs.distance as string) || 0;
        const steps = parseFloat(inputs.steps as string) || 1;

        const strideFeet = distance / steps;
        const strideInches = strideFeet * 12;
        const strideCm = strideInches * 2.54;
        const strideMeters = strideCm / 100;
        const stepsPerMile = 5280 / strideFeet;
        const stepsPerKm = 1000 / strideMeters;

        return {
          primary: { label: "Stride Length", value: `${formatNumber(strideInches)} inches` },
          details: [
            { label: "Stride (feet)", value: formatNumber(strideFeet) },
            { label: "Stride (cm)", value: formatNumber(strideCm) },
            { label: "Stride (meters)", value: formatNumber(strideMeters) },
            { label: "Steps per Mile", value: formatNumber(Math.round(stepsPerMile)) },
            { label: "Steps per Kilometer", value: formatNumber(Math.round(stepsPerKm)) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["steps-to-miles", "steps-to-calories", "5k-pace"],
  faq: [
    {
      question: "What is the average stride length?",
      answer: "The average walking stride length is about 2.2-2.5 feet (26-30 inches) for adults. Running stride length is typically 3.5-5.5 feet depending on speed and height. Men tend to have slightly longer strides than women.",
    },
    {
      question: "How does height affect stride length?",
      answer: "Taller people generally have longer strides. Walking stride is approximately 41-42% of height. Running stride is approximately 125-135% of height. However, flexibility, fitness level, and running form also play significant roles.",
    },
    {
      question: "How can I measure my stride length accurately?",
      answer: "Walk or run a known distance (like 100 feet) and count your steps. Divide the distance by the number of steps to get your stride length. For best accuracy, repeat 3 times and average the results.",
    },
  ],
  formula: "Walking Stride = Height x 0.413 (women) or 0.415 (men); Running Stride = Height x 1.25 (women) or 1.35 (men); Steps per Mile = 5280 / Stride (ft)",
};
