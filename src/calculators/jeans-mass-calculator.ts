import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const jeansMassCalculator: CalculatorDefinition = {
  slug: "jeans-mass-calculator",
  title: "Jeans Mass Calculator",
  description: "Calculate the minimum mass a gas cloud must have to undergo gravitational collapse and form a star, based on temperature and density.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["jeans mass","gravitational collapse","star formation","molecular cloud"],
  variants: [{
    id: "standard",
    name: "Jeans Mass",
    description: "Calculate the minimum mass a gas cloud must have to undergo gravitational collapse and form a star, based on temperature and density.",
    fields: [
      { name: "temperature", label: "Gas Temperature (K)", type: "number", min: 1, max: 100000, defaultValue: 10 },
      { name: "density", label: "Gas Density (kg/m3)", type: "number", min: 1e-25, max: 1e-10, defaultValue: 1e-18 },
      { name: "meanMolWeight", label: "Mean Molecular Weight (amu)", type: "number", min: 1, max: 10, defaultValue: 2.33 },
    ],
    calculate: (inputs) => {
    const T = inputs.temperature as number;
    const rho = inputs.density as number;
    const mu = inputs.meanMolWeight as number;
    const kB = 1.381e-23;
    const G = 6.674e-11;
    const mH = 1.673e-27;
    const cs = Math.sqrt(kB * T / (mu * mH));
    const jeansLength = cs * Math.sqrt(Math.PI / (G * rho));
    const jeansMass = (Math.PI / 6) * rho * Math.pow(jeansLength, 3);
    const solarMasses = jeansMass / 1.989e30;
    return {
      primary: { label: "Jeans Mass", value: formatNumber(Math.round(solarMasses * 100) / 100) + " solar masses" },
      details: [
        { label: "Jeans Mass (kg)", value: formatNumber(jeansMass) + " kg" },
        { label: "Jeans Length", value: formatNumber(jeansLength / 3.086e16) + " pc" },
        { label: "Sound Speed", value: formatNumber(Math.round(cs)) + " m/s" }
      ]
    };
  },
  }],
  relatedSlugs: ["stellar-parallax-calculator","star-magnitude-calculator"],
  faq: [
    { question: "What is the Jeans mass?", answer: "The Jeans mass is the minimum mass a cloud of gas must have so that its gravitational self-attraction overcomes the internal pressure trying to expand it. Clouds exceeding this mass can collapse to form stars." },
    { question: "What determines the Jeans mass?", answer: "The Jeans mass depends on temperature, density, and composition of the gas. Colder, denser clouds have a lower Jeans mass and can collapse more easily." },
    { question: "How does this relate to star formation?", answer: "Molecular clouds in galaxies are much more massive than the Jeans mass and fragment into smaller clumps during collapse. Each fragment can form an individual star or a small stellar system." },
  ],
  formula: "Jeans Length = cs x sqrt(pi / (G x rho)); Jeans Mass = (pi / 6) x rho x Jeans_Length^3; cs = sqrt(kB x T / (mu x mH))",
};
