import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electrolysisTimeCalculator: CalculatorDefinition = {
  slug: "electrolysis-time-calculator",
  title: "Electrolysis Time Calculator",
  description: "Calculate the time required for electrolysis based on current, mass of substance deposited, molar mass, and valence using Faraday laws of electrolysis.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["electrolysis time","faraday law","electroplating time","electrolytic deposition","coulombs calculation"],
  variants: [{
    id: "standard",
    name: "Electrolysis Time",
    description: "Calculate the time required for electrolysis based on current, mass of substance deposited, molar mass, and valence using Faraday laws of electrolysis.",
    fields: [
      { name: "mass", label: "Mass to Deposit (g)", type: "number", min: 0.001, max: 10000, defaultValue: 10 },
      { name: "molarMass", label: "Molar Mass (g/mol)", type: "number", min: 1, max: 300, defaultValue: 63.55 },
      { name: "valence", label: "Valence (electrons transferred)", type: "number", min: 1, max: 8, defaultValue: 2 },
      { name: "current", label: "Current (Amperes)", type: "number", min: 0.01, max: 1000, defaultValue: 5 },
    ],
    calculate: (inputs) => {
    const mass = inputs.mass as number;
    const molarMass = inputs.molarMass as number;
    const valence = inputs.valence as number;
    const current = inputs.current as number;
    const faraday = 96485;
    const moles = mass / molarMass;
    const charge = moles * valence * faraday;
    const timeSeconds = charge / current;
    const timeMinutes = timeSeconds / 60;
    const timeHours = timeMinutes / 60;
    return {
      primary: { label: "Time Required", value: formatNumber(Math.round(timeMinutes * 10) / 10) + " min" },
      details: [
        { label: "Time (seconds)", value: formatNumber(Math.round(timeSeconds)) },
        { label: "Time (hours)", value: formatNumber(Math.round(timeHours * 100) / 100) },
        { label: "Total Charge", value: formatNumber(Math.round(charge)) + " C" },
        { label: "Moles Deposited", value: formatNumber(Math.round(moles * 10000) / 10000) }
      ]
    };
  },
  }],
  relatedSlugs: ["nernst-equation-calculator","molarity-calculator","oxidation-number-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "t = (m x z x F) / (M x I); where m = mass (g), z = valence, F = 96485 C/mol; M = molar mass (g/mol), I = current (A)",
};
