import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hohmannTransferCalculator: CalculatorDefinition = {
  slug: "hohmann-transfer-calculator",
  title: "Hohmann Transfer Orbit Calculator",
  description: "Calculate the delta-v requirements and transfer time for a Hohmann transfer orbit between two circular orbits around the same central body.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["hohmann transfer","orbital maneuver","delta-v budget","orbit transfer"],
  variants: [{
    id: "standard",
    name: "Hohmann Transfer Orbit",
    description: "Calculate the delta-v requirements and transfer time for a Hohmann transfer orbit between two circular orbits around the same central body.",
    fields: [
      { name: "innerRadius", label: "Inner Orbit Radius (km)", type: "number", min: 100, max: 1e9, defaultValue: 6771 },
      { name: "outerRadius", label: "Outer Orbit Radius (km)", type: "number", min: 200, max: 1e9, defaultValue: 42164 },
      { name: "centralMass", label: "Central Body Mass (kg)", type: "number", min: 1e15, max: 1e35, defaultValue: 5.972e24 },
    ],
    calculate: (inputs) => {
    const r1 = inputs.innerRadius as number * 1000;
    const r2 = inputs.outerRadius as number * 1000;
    const M = inputs.centralMass as number;
    const G = 6.674e-11;
    const mu = G * M;
    const v1 = Math.sqrt(mu / r1);
    const v2 = Math.sqrt(mu / r2);
    const aTransfer = (r1 + r2) / 2;
    const vPeri = Math.sqrt(mu * (2 / r1 - 1 / aTransfer));
    const vApo = Math.sqrt(mu * (2 / r2 - 1 / aTransfer));
    const dv1 = Math.abs(vPeri - v1);
    const dv2 = Math.abs(v2 - vApo);
    const totalDv = dv1 + dv2;
    const transferTime = Math.PI * Math.sqrt(Math.pow(aTransfer, 3) / mu);
    const transferHours = transferTime / 3600;
    return {
      primary: { label: "Total Delta-V", value: formatNumber(Math.round(totalDv * 10) / 10) + " m/s" },
      details: [
        { label: "First Burn Delta-V", value: formatNumber(Math.round(dv1 * 10) / 10) + " m/s" },
        { label: "Second Burn Delta-V", value: formatNumber(Math.round(dv2 * 10) / 10) + " m/s" },
        { label: "Transfer Time", value: formatNumber(Math.round(transferHours * 100) / 100) + " hours" }
      ]
    };
  },
  }],
  relatedSlugs: ["orbital-velocity-calculator","lagrange-point-calculator"],
  faq: [
    { question: "What is a Hohmann transfer orbit?", answer: "A Hohmann transfer is the most fuel-efficient two-burn orbital maneuver to move between two circular orbits. It uses an elliptical transfer orbit that is tangent to both the initial and final circular orbits." },
    { question: "When is a Hohmann transfer not optimal?", answer: "For very large orbit changes where the ratio of outer to inner radius exceeds about 11.94, a bi-elliptic transfer can be more efficient. For time-critical missions, higher-energy transfers are used despite greater fuel cost." },
    { question: "How long does a Hohmann transfer to geostationary orbit take?", answer: "A Hohmann transfer from low Earth orbit at 400 km altitude to geostationary orbit at 35,786 km takes about 5.25 hours for the half-orbit coast phase." },
  ],
  formula: "Delta-V1 = sqrt(mu(2/r1 - 1/a)) - sqrt(mu/r1)
Delta-V2 = sqrt(mu/r2) - sqrt(mu(2/r2 - 1/a))
Transfer Time = pi x sqrt(a^3 / mu), where a = (r1 + r2) / 2",
};
