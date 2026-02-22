import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const keplerThirdLawCalculator: CalculatorDefinition = {
  slug: "kepler-third-law-calculator",
  title: "Kepler Third Law Calculator",
  description: "Free Kepler third law calculator. Relate orbital period and semi-major axis for any orbiting body.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["kepler third law", "orbital period", "semi-major axis", "kepler law calculator"],
  variants: [
    {
      id: "period-from-axis",
      name: "Period from Semi-Major Axis",
      description: "P^2 = a^3 (in AU and years for solar orbits)",
      fields: [
        { name: "axis", label: "Semi-Major Axis (AU)", type: "number", placeholder: "e.g. 1", step: 0.01 },
        { name: "starMass", label: "Central Star Mass (Solar Masses)", type: "number", placeholder: "e.g. 1", step: 0.01, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const a = inputs.axis as number;
        const M = inputs.starMass as number || 1;
        if (!a || a <= 0) return null;
        const P = Math.sqrt(Math.pow(a, 3) / M);
        const Pdays = P * 365.25;
        return {
          primary: { label: "Orbital Period", value: `${formatNumber(P, 4)} years` },
          details: [
            { label: "Period (days)", value: formatNumber(Pdays, 2) },
            { label: "Semi-Major Axis", value: `${formatNumber(a, 4)} AU` },
            { label: "Star Mass", value: `${formatNumber(M, 2)} solar masses` },
          ],
        };
      },
    },
    {
      id: "axis-from-period",
      name: "Semi-Major Axis from Period",
      fields: [
        { name: "period", label: "Orbital Period (years)", type: "number", placeholder: "e.g. 1", step: 0.01 },
        { name: "starMass", label: "Central Star Mass (Solar Masses)", type: "number", placeholder: "e.g. 1", step: 0.01, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const P = inputs.period as number;
        const M = inputs.starMass as number || 1;
        if (!P || P <= 0) return null;
        const a = Math.pow(P * P * M, 1 / 3);
        return {
          primary: { label: "Semi-Major Axis", value: `${formatNumber(a, 4)} AU` },
          details: [
            { label: "Orbital Period", value: `${formatNumber(P, 4)} years` },
            { label: "Distance (km)", value: `${formatNumber(a * 1.496e8, 0)} km` },
            { label: "Star Mass", value: `${formatNumber(M, 2)} solar masses` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["satellite-period-calculator", "synodic-period-calculator", "habitable-zone-calculator"],
  faq: [
    { question: "What is Kepler third law?", answer: "P^2 = a^3/M. The square of the period is proportional to the cube of the semi-major axis, divided by the central mass." },
    { question: "Does this work for all orbits?", answer: "Yes, it applies to any two-body gravitational system: planets, moons, binary stars, etc." },
  ],
  formula: "P^2 = a^3 / M (years, AU, solar masses)",
};
