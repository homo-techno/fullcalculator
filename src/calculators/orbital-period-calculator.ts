import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orbitalPeriodCalculator: CalculatorDefinition = {
  slug: "orbital-period-calculator",
  title: "Orbital Period Calculator",
  description: "Calculate the orbital period of a satellite or planet using Kepler third law.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["orbital period", "satellite orbit time", "Kepler third law"],
  variants: [{
    id: "standard",
    name: "Orbital Period",
    description: "Calculate the orbital period of a satellite or planet using Kepler third law",
    fields: [
      { name: "semiMajorAxis", label: "Semi-Major Axis (Orbital Radius)", type: "number", suffix: "km", min: 100, max: 1e9, defaultValue: 6771 },
      { name: "centralMass", label: "Central Body Mass", type: "number", suffix: "kg", min: 1e10, max: 2e30, defaultValue: 5.972e24 },
    ],
    calculate: (inputs) => {
      const a = (inputs.semiMajorAxis as number) * 1000;
      const M = inputs.centralMass as number;
      if (!a || !M || a <= 0 || M <= 0) return null;
      const G = 6.674e-11;
      const T = 2 * Math.PI * Math.sqrt(Math.pow(a, 3) / (G * M));
      const hours = T / 3600;
      const days = T / 86400;
      const altitude = a / 1000 - 6371;
      return {
        primary: { label: "Orbital Period", value: formatNumber(Math.round(T)) + " seconds" },
        details: [
          { label: "In Hours", value: formatNumber(Math.round(hours * 100) / 100) + " hours" },
          { label: "In Days", value: formatNumber(Math.round(days * 1000) / 1000) + " days" },
          { label: "Orbital Velocity", value: formatNumber(Math.round(2 * Math.PI * a / T)) + " m/s" },
        ],
      };
    },
  }],
  relatedSlugs: ["escape-velocity-calculator", "terminal-velocity-calculator"],
  faq: [
    { question: "What is Kepler third law?", answer: "Kepler third law states that the square of the orbital period is proportional to the cube of the semi-major axis: T squared = (4 pi squared / GM) x a cubed." },
    { question: "What is the orbital period of the ISS?", answer: "The International Space Station orbits at about 408 km altitude with a period of approximately 92 minutes or about 1.5 hours." },
  ],
  formula: "T = 2 x pi x sqrt(a^3 / (G x M)) where a = semi-major axis, M = central body mass",
};
