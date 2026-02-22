import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const schwarzschildRadiusCalculator: CalculatorDefinition = {
  slug: "schwarzschild-radius-calculator",
  title: "Schwarzschild Radius Calculator",
  description: "Free Schwarzschild radius calculator. Calculate the event horizon radius of a black hole from its mass.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["schwarzschild radius", "black hole radius", "event horizon", "black hole calculator"],
  variants: [
    {
      id: "from-mass",
      name: "Calculate Schwarzschild Radius",
      description: "Rs = 2GM/c^2",
      fields: [
        { name: "mass", label: "Mass", type: "number", placeholder: "e.g. 10" },
        { name: "unit", label: "Mass Unit", type: "select", options: [
          { label: "Solar Masses", value: "solar" },
          { label: "Kilograms", value: "kg" },
          { label: "Earth Masses", value: "earth" },
        ] },
      ],
      calculate: (inputs) => {
        const mass = inputs.mass as number;
        const unit = inputs.unit as string;
        if (!mass) return null;
        const toKg: Record<string, number> = { solar: 1.989e30, kg: 1, earth: 5.972e24 };
        const massKg = mass * (toKg[unit] || 1);
        const G = 6.674e-11;
        const c = 299792458;
        const rs = (2 * G * massKg) / (c * c);
        const rsSolar = rs / 2953.25;
        return {
          primary: { label: "Schwarzschild Radius", value: rs > 1000 ? `${formatNumber(rs / 1000, 4)} km` : `${formatNumber(rs, 4)} m` },
          details: [
            { label: "Radius (meters)", value: `${rs.toExponential(4)} m` },
            { label: "Radius (km)", value: formatNumber(rs / 1000, 4) },
            { label: "Radius (Solar Schwarzschild)", value: formatNumber(rsSolar, 4) },
            { label: "Mass (kg)", value: `${massKg.toExponential(4)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["roche-limit-calculator", "planet-surface-gravity-calculator", "tidal-force-calculator"],
  faq: [
    { question: "What is the Schwarzschild radius?", answer: "The Schwarzschild radius is the radius of the event horizon of a non-rotating black hole. Nothing can escape from within this radius." },
    { question: "What is the Schwarzschild radius of the Sun?", answer: "About 2.95 km. The Sun would need to be compressed to this size to become a black hole." },
  ],
  formula: "Rs = 2GM / c^2",
};
