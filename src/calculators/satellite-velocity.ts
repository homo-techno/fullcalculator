import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const satelliteVelocityCalculator: CalculatorDefinition = {
  slug: "satellite-velocity-calculator",
  title: "Satellite Orbital Velocity Calculator",
  description: "Free satellite orbital velocity calculator. Calculate the velocity needed for a circular orbit at a given altitude.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["orbital velocity", "satellite speed", "circular orbit velocity", "orbit calculator"],
  variants: [
    {
      id: "velocity",
      name: "Calculate Orbital Velocity",
      description: "v = sqrt(GM / r)",
      fields: [
        { name: "altitude", label: "Orbital Altitude (km)", type: "number", placeholder: "e.g. 400" },
        { name: "body", label: "Central Body", type: "select", options: [
          { label: "Earth", value: "earth" },
          { label: "Moon", value: "moon" },
          { label: "Mars", value: "mars" },
          { label: "Jupiter", value: "jupiter" },
        ] },
      ],
      calculate: (inputs) => {
        const alt = inputs.altitude as number;
        const body = inputs.body as string;
        if (!alt && alt !== 0) return null;
        const bodies: Record<string, { r: number; mu: number }> = {
          earth: { r: 6371, mu: 3.986e5 },
          moon: { r: 1737, mu: 4.905e3 },
          mars: { r: 3390, mu: 4.283e4 },
          jupiter: { r: 69911, mu: 1.267e8 },
        };
        const b = bodies[body] || bodies.earth;
        const r = b.r + alt;
        const v = Math.sqrt(b.mu / r);
        const vEsc = Math.sqrt(2 * b.mu / r);
        const period = 2 * Math.PI * r / v / 60;
        return {
          primary: { label: "Orbital Velocity", value: `${formatNumber(v, 3)} km/s` },
          details: [
            { label: "Escape Velocity", value: `${formatNumber(vEsc, 3)} km/s` },
            { label: "Orbital Radius", value: `${formatNumber(r)} km` },
            { label: "Orbital Period", value: `${formatNumber(period, 2)} minutes` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["satellite-period-calculator", "delta-v-calculator", "rocket-thrust-calculator"],
  faq: [
    { question: "What is orbital velocity?", answer: "The speed needed to maintain a circular orbit. For low Earth orbit it is about 7.8 km/s." },
    { question: "What is escape velocity?", answer: "The minimum speed to escape a body gravitational pull. It is sqrt(2) times the orbital velocity." },
  ],
  formula: "v = sqrt(GM / r)",
};
