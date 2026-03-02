import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trueWindCalculator: CalculatorDefinition = {
  slug: "true-wind-calculator",
  title: "True Wind Calculator",
  description: "Calculate true wind speed and direction from apparent wind.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["true","wind","apparent","sailing"],
  variants: [{
    id: "standard",
    name: "True Wind",
    description: "Calculate true wind speed and direction from apparent wind.",
    fields: [
      { name: "apparentSpeed", label: "Apparent Wind Speed (kts)", type: "number", min: 0, max: 100, defaultValue: 18 },
      { name: "apparentAngle", label: "Apparent Wind Angle (deg)", type: "number", min: 0, max: 180, defaultValue: 45 },
      { name: "boatSpeed", label: "Boat Speed (kts)", type: "number", min: 0, max: 40, defaultValue: 6 },
    ],
    calculate: (inputs) => {
    const apparentSpeed = inputs.apparentSpeed as number;
    const apparentAngle = inputs.apparentAngle as number;
    const boatSpeed = inputs.boatSpeed as number;
    const rad = apparentAngle * Math.PI / 180;
    const twx = apparentSpeed * Math.sin(rad);
    const twy = apparentSpeed * Math.cos(rad) - boatSpeed;
    const trueSpeed = Math.sqrt(twx * twx + twy * twy);
    const trueAngle = Math.atan2(twx, twy) * 180 / Math.PI;
    return {
      primary: { label: "True Wind Speed", value: formatNumber(trueSpeed) + " kts" },
      details: [
        { label: "True Wind Angle", value: formatNumber(trueAngle) + " degrees" },
        { label: "Apparent Wind Speed", value: formatNumber(apparentSpeed) + " kts" },
        { label: "Boat Speed", value: formatNumber(boatSpeed) + " kts" }
      ]
    };
  },
  }],
  relatedSlugs: ["crosswind-component-calculator","tidal-range-calculator"],
  faq: [
    { question: "What is apparent wind?", answer: "Apparent wind is the wind felt on a moving vessel." },
    { question: "Why is true wind important for sailing?", answer: "True wind determines sail trim and optimal course heading." },
  ],
  formula: "True Wind = vector difference of Apparent Wind and Boat Speed",
};
