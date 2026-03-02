import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mirrorFocalPointCalculator: CalculatorDefinition = {
  slug: "mirror-focal-point-calculator",
  title: "Mirror Focal Point Calculator",
  description: "Calculate the focal point of a concave mirror.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["concave mirror","mirror focal point"],
  variants: [{
    id: "standard",
    name: "Mirror Focal Point",
    description: "Calculate the focal point of a concave mirror.",
    fields: [
      { name: "radiusCurvature", label: "Radius of Curvature (cm)", type: "number", min: 1, max: 10000, defaultValue: 40 },
      { name: "objectDist", label: "Object Distance (cm)", type: "number", min: 1, max: 100000, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const r = inputs.radiusCurvature as number;
      const dO = inputs.objectDist as number;
      if (!r || !dO) return null;
      const f = r / 2;
      const dI = Math.round(1 / (1 / f - 1 / dO) * 100) / 100;
      const mag = Math.round(-dI / dO * 1000) / 1000;
      const imageType = dI > 0 ? "Real and Inverted" : "Virtual and Upright";
      return {
        primary: { label: "Focal Length", value: formatNumber(f) + " cm" },
        details: [
          { label: "Image Distance", value: formatNumber(dI) + " cm" },
          { label: "Magnification", value: formatNumber(Math.abs(mag)) + "x" },
          { label: "Image Type", value: imageType },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How is focal length related to radius of curvature?", answer: "The focal length is exactly half the radius of curvature." },
    { question: "When does a concave mirror form a virtual image?", answer: "When the object is between the focal point and the mirror surface." },
  ],
  formula: "f = R / 2; 1/f = 1/do + 1/di",
};
