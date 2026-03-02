import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lensFocalLengthCalculator: CalculatorDefinition = {
  slug: "lens-focal-length-calculator",
  title: "Lens Focal Length Calculator",
  description: "Calculate focal length from object and image distances.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["focal length","thin lens calculator"],
  variants: [{
    id: "standard",
    name: "Lens Focal Length",
    description: "Calculate focal length from object and image distances.",
    fields: [
      { name: "objectDist", label: "Object Distance (cm)", type: "number", min: 0.1, max: 100000, defaultValue: 30 },
      { name: "imageDist", label: "Image Distance (cm)", type: "number", min: 0.1, max: 100000, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const dO = inputs.objectDist as number;
      const dI = inputs.imageDist as number;
      if (!dO || !dI) return null;
      const f = Math.round(1 / (1 / dO + 1 / dI) * 1000) / 1000;
      const mag = Math.round(dI / dO * 1000) / 1000;
      const power = Math.round(100 / f * 100) / 100;
      return {
        primary: { label: "Focal Length", value: formatNumber(f) + " cm" },
        details: [
          { label: "Magnification", value: formatNumber(mag) + "x" },
          { label: "Optical Power", value: formatNumber(power) + " diopters" },
          { label: "Image Type", value: dI > 0 ? "Real" : "Virtual" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is the thin lens equation?", answer: "1/f = 1/do + 1/di where f is focal length and d is distance." },
    { question: "What does a shorter focal length mean?", answer: "A shorter focal length means a stronger, more converging lens." },
  ],
  formula: "1/f = 1/object_distance + 1/image_distance",
};
