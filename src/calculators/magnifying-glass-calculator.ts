import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const magnifyingGlassCalculator: CalculatorDefinition = {
  slug: "magnifying-glass-calculator",
  title: "Magnifying Glass Calculator",
  description: "Calculate magnification from the focal length of a lens.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["magnification","magnifying glass power"],
  variants: [{
    id: "standard",
    name: "Magnifying Glass",
    description: "Calculate magnification from the focal length of a lens.",
    fields: [
      { name: "focalLength", label: "Focal Length (cm)", type: "number", min: 0.5, max: 100, defaultValue: 10 },
      { name: "nearPoint", label: "Near Point Distance (cm)", type: "number", min: 15, max: 40, defaultValue: 25 },
    ],
    calculate: (inputs) => {
      const f = inputs.focalLength as number;
      const np = inputs.nearPoint as number;
      if (!f || !np) return null;
      const magRelaxed = Math.round(np / f * 100) / 100;
      const magStrained = Math.round((np / f + 1) * 100) / 100;
      const powerDiopters = Math.round(100 / f * 100) / 100;
      return {
        primary: { label: "Magnification (relaxed)", value: formatNumber(magRelaxed) + "x" },
        details: [
          { label: "Magnification (strained)", value: formatNumber(magStrained) + "x" },
          { label: "Lens Power", value: formatNumber(powerDiopters) + " diopters" },
          { label: "Focal Length", value: formatNumber(f) + " cm" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How is magnification calculated?", answer: "Magnification equals the near point distance divided by the focal length." },
    { question: "What is the standard near point?", answer: "The standard near point of the human eye is 25 cm." },
  ],
  formula: "Magnification = Near Point / Focal Length",
};
