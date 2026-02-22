import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const telescopeApertureCalculator: CalculatorDefinition = {
  slug: "telescope-aperture-calculator",
  title: "Telescope Aperture/Resolution Calculator",
  description: "Free telescope aperture calculator. Calculate resolving power and limiting magnitude from aperture.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["telescope aperture", "telescope resolution", "dawes limit", "limiting magnitude", "telescope power"],
  variants: [
    {
      id: "from-aperture",
      name: "Calculate from Aperture",
      description: "Resolution and limiting magnitude from aperture",
      fields: [
        { name: "aperture", label: "Aperture (mm)", type: "number", placeholder: "e.g. 200" },
      ],
      calculate: (inputs) => {
        const ap = inputs.aperture as number;
        if (!ap || ap <= 0) return null;
        const dawes = 116 / ap;
        const rayleigh = 138 / ap;
        const limitMag = 2.7 + 5 * Math.log10(ap);
        const maxMag = ap * 2;
        const lightGather = Math.pow(ap / 7, 2);
        return {
          primary: { label: "Dawes Limit", value: `${formatNumber(dawes, 2)} arcsec` },
          details: [
            { label: "Rayleigh Limit", value: `${formatNumber(rayleigh, 2)} arcsec` },
            { label: "Limiting Magnitude", value: formatNumber(limitMag, 1) },
            { label: "Max Useful Magnification", value: `${formatNumber(maxMag, 0)}x` },
            { label: "Light Gathering (vs eye)", value: `${formatNumber(lightGather, 0)}x` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["telescope-magnification-calculator", "telescope-fov-calculator", "angular-diameter-calculator"],
  faq: [
    { question: "What is the Dawes limit?", answer: "The Dawes limit is the minimum angular separation two stars can have and still be resolved. It equals 116/D arcseconds." },
    { question: "What is limiting magnitude?", answer: "The faintest star visible through a telescope. Larger apertures see fainter objects." },
  ],
  formula: "Dawes limit = 116/D arcsec | Limiting mag = 2.7 + 5 log10(D)",
};
