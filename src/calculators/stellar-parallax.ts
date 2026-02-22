import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stellarParallaxCalculator: CalculatorDefinition = {
  slug: "stellar-parallax-calculator",
  title: "Stellar Parallax Distance Calculator",
  description: "Free stellar parallax calculator. Calculate the distance to a star from its parallax angle.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stellar parallax", "parallax distance", "star distance", "parsec parallax"],
  variants: [
    {
      id: "from-parallax",
      name: "Distance from Parallax Angle",
      description: "d(pc) = 1 / p(arcsec)",
      fields: [
        { name: "parallax", label: "Parallax Angle (arcseconds)", type: "number", placeholder: "e.g. 0.772", step: 0.001 },
      ],
      calculate: (inputs) => {
        const par = inputs.parallax as number;
        if (!par || par <= 0) return null;
        const distPc = 1 / par;
        const distLy = distPc * 3.26156;
        const distAu = distPc * 206265;
        return {
          primary: { label: "Distance", value: `${formatNumber(distPc, 4)} parsecs` },
          details: [
            { label: "Light Years", value: formatNumber(distLy, 4) },
            { label: "AU", value: formatNumber(distAu, 2) },
            { label: "Parallax Angle", value: `${formatNumber(par, 4)} arcsec` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["parsec-converter-calculator", "cosmic-distance-calculator", "magnitude-distance-calculator"],
  faq: [
    { question: "What is stellar parallax?", answer: "Stellar parallax is the apparent shift in a star position as Earth orbits the Sun. Closer stars show more parallax." },
    { question: "How accurate is parallax measurement?", answer: "Ground telescopes measure down to ~0.01 arcsec. The Gaia satellite reaches micro-arcsecond precision." },
  ],
  formula: "distance (parsecs) = 1 / parallax (arcseconds)",
};
