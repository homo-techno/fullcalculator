import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const keplersEquationSolverCalculator: CalculatorDefinition = {
  slug: "keplers-equation-solver",
  title: "Kepler Equation Solver",
  description: "Solve Kepler equation to find the position of an orbiting body at any time, converting mean anomaly to true anomaly via eccentric anomaly.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["kepler equation","mean anomaly","eccentric anomaly","true anomaly","orbital position"],
  variants: [{
    id: "standard",
    name: "Kepler Equation Solver",
    description: "Solve Kepler equation to find the position of an orbiting body at any time, converting mean anomaly to true anomaly via eccentric anomaly.",
    fields: [
      { name: "meanAnomaly", label: "Mean Anomaly (degrees)", type: "number", min: 0, max: 360, defaultValue: 90 },
      { name: "eccentricity", label: "Orbital Eccentricity", type: "number", min: 0, max: 0.99, defaultValue: 0.2 },
      { name: "semiMajorAxis", label: "Semi-Major Axis (AU)", type: "number", min: 0.01, max: 100000, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const Mdeg = inputs.meanAnomaly as number;
    const e = inputs.eccentricity as number;
    const a = inputs.semiMajorAxis as number;
    const Mrad = Mdeg * Math.PI / 180;
    var E = Mrad;
    for (var i = 0; i < 100; i++) {
      var dE = (E - e * Math.sin(E) - Mrad) / (1 - e * Math.cos(E));
      E = E - dE;
      if (Math.abs(dE) < 1e-12) break;
    }
    var Edeg = E * 180 / Math.PI;
    var nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    var nuDeg = nu * 180 / Math.PI;
    if (nuDeg < 0) nuDeg += 360;
    var r = a * (1 - e * Math.cos(E));
    return {
      primary: { label: "True Anomaly", value: formatNumber(Math.round(nuDeg * 1000) / 1000) + " degrees" },
      details: [
        { label: "Eccentric Anomaly", value: formatNumber(Math.round(Edeg * 1000) / 1000) + " degrees" },
        { label: "Orbital Radius", value: formatNumber(Math.round(r * 10000) / 10000) + " AU" },
        { label: "Mean Anomaly", value: formatNumber(Mdeg) + " degrees" }
      ]
    };
  },
  }],
  relatedSlugs: ["synodic-period-calculator","hohmann-transfer-calculator"],
  faq: [
    { question: "What is Kepler equation?", answer: "Kepler equation relates the mean anomaly M to the eccentric anomaly E through M = E - e sin(E). It must be solved iteratively because E cannot be expressed as a simple function of M." },
    { question: "What is the true anomaly?", answer: "The true anomaly is the actual angular position of the orbiting body measured from the closest approach point (periapsis). It describes where the body is in its orbit at a given time." },
    { question: "Why does eccentricity matter?", answer: "For circular orbits (e = 0) the true anomaly equals the mean anomaly. For highly elliptical orbits, the body spends more time near apoapsis and moves quickly through periapsis, making the anomalies very different." },
  ],
  formula: "M = E - e sin(E) (Kepler equation, solve iteratively for E); True Anomaly: nu = 2 x atan2(sqrt(1+e) x sin(E/2), sqrt(1-e) x cos(E/2)); Radius = a x (1 - e x cos(E))",
};
