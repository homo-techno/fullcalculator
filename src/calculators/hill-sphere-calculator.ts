import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hillSphereCalculator: CalculatorDefinition = {
  slug: "hill-sphere-calculator",
  title: "Hill Sphere Calculator",
  description: "Calculate the Hill sphere radius of a body orbiting a more massive primary, defining the region where the body can gravitationally retain satellites.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["hill sphere","gravitational influence","sphere of influence","satellite retention"],
  variants: [{
    id: "standard",
    name: "Hill Sphere",
    description: "Calculate the Hill sphere radius of a body orbiting a more massive primary, defining the region where the body can gravitationally retain satellites.",
    fields: [
      { name: "semiMajorAxis", label: "Semi-Major Axis (km)", type: "number", min: 1000, max: 1e12, defaultValue: 149597870 },
      { name: "massBody", label: "Orbiting Body Mass (kg)", type: "number", min: 1e10, max: 1e30, defaultValue: 5.972e24 },
      { name: "massPrimary", label: "Primary Body Mass (kg)", type: "number", min: 1e15, max: 1e35, defaultValue: 1.989e30 },
      { name: "eccentricity", label: "Orbital Eccentricity", type: "number", min: 0, max: 0.99, defaultValue: 0.0167 },
    ],
    calculate: (inputs) => {
    const a = inputs.semiMajorAxis as number;
    const m = inputs.massBody as number;
    const M = inputs.massPrimary as number;
    const e = inputs.eccentricity as number;
    const hillRadius = a * (1 - e) * Math.pow(m / (3 * M), 1 / 3);
    const hillRadiusAU = hillRadius / 149597870.7;
    const hillRadiusBodyRadii = hillRadius / 6371;
    return {
      primary: { label: "Hill Sphere Radius", value: formatNumber(Math.round(hillRadius)) + " km" },
      details: [
        { label: "Hill Sphere in AU", value: formatNumber(Math.round(hillRadiusAU * 10000) / 10000) + " AU" },
        { label: "In Earth Radii", value: formatNumber(Math.round(hillRadiusBodyRadii * 10) / 10) },
        { label: "Orbital Eccentricity", value: formatNumber(e) }
      ]
    };
  },
  }],
  relatedSlugs: ["lagrange-point-calculator","roche-limit-calculator"],
  faq: [
    { question: "What is the Hill sphere?", answer: "The Hill sphere is the region around a body where its gravity dominates over the gravitational influence of the larger body it orbits. Moons must orbit within the Hill sphere of their planet to remain captured." },
    { question: "How large is the Hill sphere of Earth?", answer: "The Hill sphere of Earth extends about 1.5 million km from Earth, roughly four times the Earth-Moon distance. The Moon orbits well within this boundary." },
    { question: "Can objects orbit at the edge of the Hill sphere?", answer: "In practice, stable orbits require being well inside the Hill sphere. Orbits beyond roughly one-third to one-half of the Hill sphere radius tend to be unstable due to perturbations from the primary body." },
  ],
  formula: "Hill Radius = a x (1 - e) x (m / 3M)^(1/3)
where a = semi-major axis, e = eccentricity, m = body mass, M = primary mass",
};
