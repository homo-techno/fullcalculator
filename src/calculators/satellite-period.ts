import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const satellitePeriodCalculator: CalculatorDefinition = {
  slug: "satellite-period-calculator",
  title: "Satellite Orbital Period Calculator",
  description: "Free satellite orbital period calculator. Calculate how long it takes a satellite to complete one orbit.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["satellite period", "orbital period", "orbit time", "satellite orbit calculator"],
  variants: [
    {
      id: "period",
      name: "Calculate Orbital Period",
      description: "T = 2pi * sqrt(a^3 / (G*M))",
      fields: [
        { name: "altitude", label: "Orbital Altitude (km)", type: "number", placeholder: "e.g. 400" },
        { name: "body", label: "Central Body", type: "select", options: [
          { label: "Earth", value: "earth" },
          { label: "Moon", value: "moon" },
          { label: "Mars", value: "mars" },
          { label: "Jupiter", value: "jupiter" },
          { label: "Sun", value: "sun" },
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
          sun: { r: 696340, mu: 1.327e11 },
        };
        const b = bodies[body] || bodies.earth;
        const a = b.r + alt;
        const T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / b.mu);
        const hours = T / 3600;
        const mins = T / 60;
        return {
          primary: { label: "Orbital Period", value: hours >= 1 ? `${formatNumber(hours, 3)} hours` : `${formatNumber(mins, 2)} minutes` },
          details: [
            { label: "Period (seconds)", value: formatNumber(T, 2) },
            { label: "Period (minutes)", value: formatNumber(mins, 2) },
            { label: "Period (hours)", value: formatNumber(hours, 3) },
            { label: "Orbital Radius", value: `${formatNumber(a)} km` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["satellite-velocity-calculator", "kepler-third-law-calculator", "delta-v-calculator"],
  faq: [
    { question: "What determines orbital period?", answer: "Orbital period depends on the semi-major axis and the mass of the central body. Higher orbits have longer periods." },
    { question: "What is the ISS orbital period?", answer: "The ISS orbits at about 400 km altitude with a period of roughly 92 minutes." },
  ],
  formula: "T = 2pi * sqrt(a^3 / GM)",
};
