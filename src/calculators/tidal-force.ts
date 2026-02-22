import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tidalForceCalculator: CalculatorDefinition = {
  slug: "tidal-force-calculator",
  title: "Tidal Force Calculator",
  description: "Free tidal force calculator. Calculate the differential gravitational (tidal) force exerted by one body on another.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tidal force", "tidal acceleration", "differential gravity", "tidal effect", "gravitational tide"],
  variants: [
    {
      id: "tidal",
      name: "Calculate Tidal Acceleration",
      description: "a_tidal = 2GMd / r^3",
      fields: [
        { name: "sourceMass", label: "Source Body Mass (kg)", type: "number", placeholder: "e.g. 7.342e22" },
        { name: "distance", label: "Distance to Source (km)", type: "number", placeholder: "e.g. 384400" },
        { name: "objectSize", label: "Object Diameter (km)", type: "number", placeholder: "e.g. 12742" },
      ],
      calculate: (inputs) => {
        const M = inputs.sourceMass as number;
        const r = inputs.distance as number;
        const d = inputs.objectSize as number;
        if (!M || !r || !d) return null;
        const G = 6.674e-11;
        const rM = r * 1000;
        const dM = d * 1000;
        const aTidal = 2 * G * M * dM / Math.pow(rM, 3);
        const relToG = aTidal / 9.81;
        return {
          primary: { label: "Tidal Acceleration", value: `${aTidal.toExponential(4)} m/s²` },
          details: [
            { label: "Relative to Earth g", value: `${relToG.toExponential(4)} g` },
            { label: "Source Mass", value: `${M.toExponential(4)} kg` },
            { label: "Distance", value: `${formatNumber(r)} km` },
            { label: "Object Size", value: `${formatNumber(d)} km` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roche-limit-calculator", "planet-surface-gravity-calculator", "schwarzschild-radius-calculator"],
  faq: [
    { question: "What is tidal force?", answer: "Tidal force is the difference in gravitational pull across an extended object. It causes tides on Earth and can tear apart bodies near massive objects." },
    { question: "Why does tidal force depend on r^3?", answer: "Tidal force is the gradient of gravity, which falls off as 1/r^2. The derivative gives 1/r^3 dependence." },
  ],
  formula: "a_tidal = 2GMd / r^3",
};
