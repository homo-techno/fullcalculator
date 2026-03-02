import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snellsLawCalculator: CalculatorDefinition = {
  slug: "snells-law-calculator",
  title: "Snell Law Calculator",
  description: "Calculate the angle of refraction using Snell law.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Snell law","refraction angle calculator"],
  variants: [{
    id: "standard",
    name: "Snell Law",
    description: "Calculate the angle of refraction using Snell law.",
    fields: [
      { name: "n1", label: "Refractive Index n1", type: "number", min: 1, max: 4, defaultValue: 1 },
      { name: "n2", label: "Refractive Index n2", type: "number", min: 1, max: 4, defaultValue: 1.5 },
      { name: "angle1", label: "Incident Angle (degrees)", type: "number", min: 0, max: 90, defaultValue: 30 },
    ],
    calculate: (inputs) => {
      const n1 = inputs.n1 as number;
      const n2 = inputs.n2 as number;
      const theta1 = inputs.angle1 as number;
      if (!n1 || !n2 || theta1 === undefined) return null;
      const rad1 = theta1 * Math.PI / 180;
      const sinTheta2 = n1 * Math.sin(rad1) / n2;
      if (Math.abs(sinTheta2) > 1) {
        const critAngle = Math.round(Math.asin(n2 / n1) * 180 / Math.PI * 100) / 100;
        return { primary: { label: "Result", value: "Total Internal Reflection" }, details: [{ label: "Critical Angle", value: formatNumber(critAngle) + " deg" }] };
      }
      const theta2 = Math.round(Math.asin(sinTheta2) * 180 / Math.PI * 100) / 100;
      return {
        primary: { label: "Refracted Angle", value: formatNumber(theta2) + " deg" },
        details: [
          { label: "Incident Angle", value: formatNumber(theta1) + " deg" },
          { label: "n1", value: formatNumber(n1) },
          { label: "n2", value: formatNumber(n2) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "What is Snell law?", answer: "n1 sin(theta1) = n2 sin(theta2) describes light bending at an interface." },
    { question: "What causes total internal reflection?", answer: "It occurs when light goes from a denser to a less dense medium above critical angle." },
  ],
  formula: "n1 sin(theta1) = n2 sin(theta2)",
};
