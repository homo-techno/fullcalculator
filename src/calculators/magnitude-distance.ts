import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const magnitudeDistanceCalculator: CalculatorDefinition = {
  slug: "magnitude-distance-calculator",
  title: "Absolute to Apparent Magnitude Calculator",
  description: "Free magnitude distance calculator. Convert between absolute and apparent magnitude using the distance modulus.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["absolute magnitude", "apparent magnitude", "distance modulus", "magnitude calculator"],
  variants: [
    {
      id: "abs-to-app",
      name: "Absolute to Apparent Magnitude",
      description: "m = M + 5 * log10(d/10)",
      fields: [
        { name: "absMag", label: "Absolute Magnitude (M)", type: "number", placeholder: "e.g. 4.83", step: 0.01 },
        { name: "distance", label: "Distance (parsecs)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const M = inputs.absMag as number;
        const d = inputs.distance as number;
        if (M === undefined || !d || d <= 0) return null;
        const distMod = 5 * Math.log10(d / 10);
        const m = M + distMod;
        return {
          primary: { label: "Apparent Magnitude", value: formatNumber(m, 2) },
          details: [
            { label: "Absolute Magnitude", value: formatNumber(M, 2) },
            { label: "Distance Modulus", value: formatNumber(distMod, 2) },
            { label: "Distance", value: `${formatNumber(d)} pc` },
            { label: "Distance (ly)", value: `${formatNumber(d * 3.26156, 2)} ly` },
          ],
        };
      },
    },
    {
      id: "app-to-abs",
      name: "Apparent to Absolute Magnitude",
      description: "M = m - 5 * log10(d/10)",
      fields: [
        { name: "appMag", label: "Apparent Magnitude (m)", type: "number", placeholder: "e.g. -26.74", step: 0.01 },
        { name: "distance", label: "Distance (parsecs)", type: "number", placeholder: "e.g. 10" },
      ],
      calculate: (inputs) => {
        const m = inputs.appMag as number;
        const d = inputs.distance as number;
        if (m === undefined || !d || d <= 0) return null;
        const distMod = 5 * Math.log10(d / 10);
        const M = m - distMod;
        return {
          primary: { label: "Absolute Magnitude", value: formatNumber(M, 2) },
          details: [
            { label: "Apparent Magnitude", value: formatNumber(m, 2) },
            { label: "Distance Modulus", value: formatNumber(distMod, 2) },
            { label: "Distance", value: `${formatNumber(d)} pc` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["star-luminosity-calculator", "stellar-parallax-calculator", "cosmic-distance-calculator"],
  faq: [
    { question: "What is the distance modulus?", answer: "The distance modulus is m - M = 5 log10(d/10), relating apparent magnitude, absolute magnitude, and distance in parsecs." },
    { question: "What is absolute magnitude?", answer: "Absolute magnitude is the brightness a star would have at 10 parsecs. The Sun has M = 4.83." },
  ],
  formula: "m - M = 5 * log10(d / 10)",
};
