import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const orbitalDecayCalculator: CalculatorDefinition = {
  slug: "orbital-decay-calculator",
  title: "Orbital Decay Calculator",
  description: "Calculate the rate of orbital decay for a satellite in low Earth orbit due to atmospheric drag, estimating the remaining orbital lifetime.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["orbital decay","satellite lifetime","atmospheric drag","orbit degradation"],
  variants: [{
    id: "standard",
    name: "Orbital Decay",
    description: "Calculate the rate of orbital decay for a satellite in low Earth orbit due to atmospheric drag, estimating the remaining orbital lifetime.",
    fields: [
      { name: "altitude", label: "Orbital Altitude (km)", type: "number", min: 100, max: 2000, defaultValue: 400 },
      { name: "mass", label: "Satellite Mass (kg)", type: "number", min: 0.1, max: 100000, defaultValue: 1000 },
      { name: "area", label: "Cross-Section Area (m2)", type: "number", min: 0.01, max: 1000, defaultValue: 10 },
      { name: "dragCoeff", label: "Drag Coefficient", type: "number", min: 1, max: 4, defaultValue: 2.2 },
    ],
    calculate: (inputs) => {
    const h = inputs.altitude as number;
    const m = inputs.mass as number;
    const A = inputs.area as number;
    const Cd = inputs.dragCoeff as number;
    const rho0 = 1.225;
    const H = 8500;
    const rho = rho0 * Math.exp(-(h * 1000) / H);
    const earthRadius = 6371;
    const r = (earthRadius + h) * 1000;
    const mu = 3.986e14;
    const v = Math.sqrt(mu / r);
    const ballisticCoeff = m / (Cd * A);
    const decayRate = -0.5 * rho * v * v * Cd * A / m;
    const periodSec = 2 * Math.PI * r / v;
    const decayPerOrbit = Math.abs(decayRate) * periodSec;
    const roughLifeDays = (h * 1000) / (decayPerOrbit > 0 ? decayPerOrbit : 0.001) / 86400 * periodSec;
    var lifeDisplay = "";
    if (roughLifeDays > 365) { lifeDisplay = formatNumber(Math.round(roughLifeDays / 365 * 10) / 10) + " years"; }
    else { lifeDisplay = formatNumber(Math.round(roughLifeDays)) + " days"; }
    return {
      primary: { label: "Ballistic Coefficient", value: formatNumber(Math.round(ballisticCoeff * 10) / 10) + " kg/m2" },
      details: [
        { label: "Atmospheric Density", value: formatNumber(rho) + " kg/m3" },
        { label: "Orbital Velocity", value: formatNumber(Math.round(v / 1000 * 100) / 100) + " km/s" },
        { label: "Estimated Lifetime", value: lifeDisplay }
      ]
    };
  },
  }],
  relatedSlugs: ["orbital-velocity-calculator","hohmann-transfer-calculator"],
  faq: [
    { question: "What causes orbital decay?", answer: "Low Earth orbit satellites experience drag from the thin upper atmosphere. This drag removes kinetic energy, causing the orbit to gradually lower until the satellite reenters the atmosphere." },
    { question: "How does altitude affect orbital lifetime?", answer: "Atmospheric density drops exponentially with altitude. A satellite at 200 km may last only days, while at 600 km it can last decades. Above about 1000 km, decay takes centuries." },
    { question: "What is the ballistic coefficient?", answer: "The ballistic coefficient is the ratio of satellite mass to the product of drag coefficient and cross-sectional area. Higher values mean the satellite is less affected by drag and decays more slowly." },
  ],
  formula: "Ballistic Coefficient = m / (Cd x A)
Atmospheric Density = rho0 x exp(-h / H)
Drag Deceleration = 0.5 x rho x v^2 x Cd x A / m",
};
