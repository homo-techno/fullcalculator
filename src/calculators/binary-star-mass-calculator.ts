import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const binaryStarMassCalculator: CalculatorDefinition = {
  slug: "binary-star-mass-calculator",
  title: "Binary Star Mass Calculator",
  description: "Calculate the total and individual masses of a binary star system from the orbital period and separation using Kepler third law.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["binary star","double star","stellar mass","binary orbit"],
  variants: [{
    id: "standard",
    name: "Binary Star Mass",
    description: "Calculate the total and individual masses of a binary star system from the orbital period and separation using Kepler third law.",
    fields: [
      { name: "orbitalPeriod", label: "Orbital Period (years)", type: "number", min: 0.001, max: 10000, defaultValue: 50 },
      { name: "separation", label: "Semi-Major Axis (AU)", type: "number", min: 0.01, max: 100000, defaultValue: 20 },
      { name: "massRatio", label: "Mass Ratio (M2/M1)", type: "number", min: 0.01, max: 1, defaultValue: 0.5 },
    ],
    calculate: (inputs) => {
    const P = inputs.orbitalPeriod as number;
    const a = inputs.separation as number;
    const q = inputs.massRatio as number;
    const totalMass = Math.pow(a, 3) / Math.pow(P, 2);
    const m1 = totalMass / (1 + q);
    const m2 = totalMass * q / (1 + q);
    const barycenter = a * q / (1 + q);
    return {
      primary: { label: "Total System Mass", value: formatNumber(Math.round(totalMass * 1000) / 1000) + " solar masses" },
      details: [
        { label: "Primary Star Mass", value: formatNumber(Math.round(m1 * 1000) / 1000) + " solar masses" },
        { label: "Secondary Star Mass", value: formatNumber(Math.round(m2 * 1000) / 1000) + " solar masses" },
        { label: "Barycenter from Primary", value: formatNumber(Math.round(barycenter * 1000) / 1000) + " AU" }
      ]
    };
  },
  }],
  relatedSlugs: ["star-magnitude-calculator","spectral-class-temperature-calculator"],
  faq: [
    { question: "How do we measure binary star masses?", answer: "For visual binaries with known orbital period and separation, Kepler third law gives the total mass. Radial velocity measurements and the mass ratio allow determination of individual masses." },
    { question: "What fraction of stars are in binary systems?", answer: "Roughly half of all Sun-like stars exist in binary or multiple star systems. The fraction is higher for more massive stars and lower for red dwarfs." },
    { question: "What is the mass ratio?", answer: "The mass ratio q is the mass of the secondary (less massive) star divided by the mass of the primary. It ranges from 0 to 1, with 1 meaning both stars have equal mass." },
  ],
  formula: "Total Mass (solar) = a^3 / P^2 (Kepler third law in solar units)
M1 = Total / (1 + q), M2 = Total x q / (1 + q)",
};
