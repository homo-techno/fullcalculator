import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lagrangePointCalculator: CalculatorDefinition = {
  slug: "lagrange-point-calculator",
  title: "Lagrange Point Calculator",
  description: "Calculate the distances to L1, L2, and L3 Lagrange points for a two-body gravitational system such as the Sun-Earth or Earth-Moon system.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["lagrange point","L1 L2 L3","gravitational equilibrium","orbital mechanics"],
  variants: [{
    id: "standard",
    name: "Lagrange Point",
    description: "Calculate the distances to L1, L2, and L3 Lagrange points for a two-body gravitational system such as the Sun-Earth or Earth-Moon system.",
    fields: [
      { name: "massPrimary", label: "Primary Mass (kg, e.g. Sun)", type: "number", min: 1e10, max: 1e35, defaultValue: 1.989e30 },
      { name: "massSecondary", label: "Secondary Mass (kg, e.g. Earth)", type: "number", min: 1, max: 1e30, defaultValue: 5.972e24 },
      { name: "distance", label: "Orbital Distance (km)", type: "number", min: 1000, max: 1e12, defaultValue: 149597870 },
    ],
    calculate: (inputs) => {
    const M = inputs.massPrimary as number;
    const m = inputs.massSecondary as number;
    const d = inputs.distance as number;
    const ratio = m / (3 * M);
    const hillRadius = d * Math.pow(ratio, 1 / 3);
    const L1 = d - hillRadius;
    const L2 = d + hillRadius;
    const L3 = d * (1 + 5 * m / (12 * M));
    return {
      primary: { label: "L1 Distance from Primary", value: formatNumber(Math.round(L1)) + " km" },
      details: [
        { label: "L2 Distance from Primary", value: formatNumber(Math.round(L2)) + " km" },
        { label: "L3 Distance from Primary", value: formatNumber(Math.round(L3)) + " km" },
        { label: "Hill Sphere Radius", value: formatNumber(Math.round(hillRadius)) + " km" }
      ]
    };
  },
  }],
  relatedSlugs: ["orbital-velocity-calculator","roche-limit-calculator"],
  faq: [
    { question: "What are Lagrange points?", answer: "Lagrange points are five positions in space where the gravitational pull of two large bodies and the centrifugal force balance, allowing a small object to remain relatively stationary with respect to the two larger bodies." },
    { question: "Which Lagrange point is the James Webb Space Telescope at?", answer: "The James Webb Space Telescope orbits the Sun-Earth L2 point, about 1.5 million km from Earth on the side away from the Sun." },
    { question: "Are Lagrange points truly stable?", answer: "Only L4 and L5 are naturally stable. L1, L2, and L3 are unstable and require station-keeping maneuvers to maintain a spacecraft in their vicinity." },
  ],
  formula: "Hill Radius = d x (m / 3M)^(1/3)
L1 = d - Hill Radius
L2 = d + Hill Radius",
};
