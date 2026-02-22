import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cosmicDistanceCalculator: CalculatorDefinition = {
  slug: "cosmic-distance-calculator",
  title: "Cosmic Distance Ladder Calculator",
  description: "Free cosmic distance calculator. Estimate distances using various methods of the cosmic distance ladder.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["cosmic distance", "distance ladder", "astronomical distance", "cepheid distance", "standard candle"],
  variants: [
    {
      id: "cepheid",
      name: "Cepheid Variable Method",
      description: "M = -2.43 * (log10(P) - 1) - 4.05",
      fields: [
        { name: "period", label: "Pulsation Period (days)", type: "number", placeholder: "e.g. 10" },
        { name: "appMag", label: "Apparent Magnitude", type: "number", placeholder: "e.g. 15", step: 0.1 },
      ],
      calculate: (inputs) => {
        const P = inputs.period as number;
        const m = inputs.appMag as number;
        if (!P || m === undefined) return null;
        const M = -2.43 * (Math.log10(P) - 1) - 4.05;
        const distMod = m - M;
        const distPc = Math.pow(10, (distMod + 5) / 5);
        const distLy = distPc * 3.26156;
        return {
          primary: { label: "Distance", value: `${formatNumber(distPc, 0)} pc (${formatNumber(distLy, 0)} ly)` },
          details: [
            { label: "Absolute Magnitude (M)", value: formatNumber(M, 2) },
            { label: "Distance Modulus", value: formatNumber(distMod, 2) },
            { label: "Distance (Mpc)", value: formatNumber(distPc / 1e6, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["magnitude-distance-calculator", "parsec-converter-calculator", "red-shift-calculator"],
  faq: [
    { question: "What is the cosmic distance ladder?", answer: "A series of methods for measuring increasingly large distances: parallax, Cepheids, Type Ia supernovae, and redshift." },
    { question: "What are Cepheid variables?", answer: "Pulsating stars whose period is directly related to luminosity, making them standard candles for distance measurement." },
  ],
  formula: "M = -2.43(log10(P) - 1) - 4.05 | d = 10^((m - M + 5)/5)",
};
