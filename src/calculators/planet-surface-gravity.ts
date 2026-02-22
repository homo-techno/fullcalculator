import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const planetSurfaceGravityCalculator: CalculatorDefinition = {
  slug: "planet-surface-gravity-calculator",
  title: "Planet Surface Gravity Calculator",
  description: "Free planet surface gravity calculator. Calculate gravitational acceleration on a planet surface from mass and radius.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["surface gravity", "planet gravity", "gravitational acceleration", "g force planet"],
  variants: [
    {
      id: "gravity",
      name: "Calculate Surface Gravity",
      description: "g = GM/R^2",
      fields: [
        { name: "mass", label: "Planet Mass (Earth masses)", type: "number", placeholder: "e.g. 1", step: 0.01 },
        { name: "radius", label: "Planet Radius (Earth radii)", type: "number", placeholder: "e.g. 1", step: 0.01 },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const radius = inputs.radius as number;
        if (!mass || !radius) return null;
        const gRatio = mass / (radius * radius);
        const gMs2 = gRatio * 9.81;
        const escVel = Math.sqrt(2 * gMs2 * radius * 6371000) / 1000;
        return {
          primary: { label: "Surface Gravity", value: `${formatNumber(gMs2, 3)} m/s²` },
          details: [
            { label: "Relative to Earth", value: `${formatNumber(gRatio, 4)} g` },
            { label: "Escape Velocity", value: `${formatNumber(escVel, 2)} km/s` },
            { label: "Weight of 70 kg person", value: `${formatNumber(70 * gMs2, 1)} N (${formatNumber(70 * gMs2 / 9.81, 1)} kgf)` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["satellite-velocity-calculator", "roche-limit-calculator", "tidal-force-calculator"],
  faq: [
    { question: "How is surface gravity calculated?", answer: "Surface gravity g = GM/R^2. In Earth units, g = M_planet/R_planet^2 times 9.81 m/s^2." },
    { question: "What is Earth surface gravity?", answer: "Earth surface gravity is 9.81 m/s^2, often approximated as 1g." },
  ],
  formula: "g = GM/R^2",
};
