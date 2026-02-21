import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

const F = 96485; // Faraday constant C/mol

export const electrochemistryCalculator: CalculatorDefinition = {
  slug: "electrochemistry-calculator",
  title: "Electrochemistry Calculator",
  description: "Free electrochemistry calculator. Calculate cell potential using the Nernst equation, Faraday's law of electrolysis, and standard electrode potentials.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["Nernst equation", "cell potential", "electrochemistry", "Faraday's law", "electrode potential"],
  variants: [
    {
      id: "nernst",
      name: "Nernst Equation",
      description: "Calculate non-standard cell potential",
      fields: [
        { name: "eStandard", label: "Standard Cell Potential E° (V)", type: "number", placeholder: "e.g. 1.10", step: 0.01 },
        { name: "n", label: "Electrons Transferred (n)", type: "number", placeholder: "e.g. 2", min: 1, step: 1 },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
        { name: "logQ", label: "log₁₀(Q) — Reaction Quotient", type: "number", placeholder: "e.g. 2 (if Q=100)", step: 0.1 },
      ],
      calculate: (inputs) => {
        const eStd = inputs.eStandard as number, n = inputs.n as number;
        const T = inputs.temp as number || 298.15, logQ = inputs.logQ as number;
        if (eStd === undefined || !n || logQ === undefined || n <= 0 || T <= 0) return null;
        const R = 8.314;
        const eCell = eStd - (R * T * Math.log(Math.pow(10, logQ))) / (n * F);
        const deltaG = -n * F * eCell;
        const isSpont = eCell > 0;
        return {
          primary: { label: "Cell Potential (E)", value: `${formatNumber(eCell, 6)} V` },
          details: [
            { label: "E° (standard)", value: `${formatNumber(eStd, 4)} V` },
            { label: "Correction Term", value: `${formatNumber(eStd - eCell, 6)} V` },
            { label: "ΔG", value: `${formatNumber(deltaG / 1000, 4)} kJ/mol` },
            { label: "Spontaneous?", value: isSpont ? "Yes (E > 0, ΔG < 0)" : "No (E < 0, ΔG > 0)" },
          ],
          note: "Nernst equation at 25°C simplifies to: E = E° - (0.0592/n) × log(Q)",
        };
      },
    },
    {
      id: "standardPotential",
      name: "Standard Cell Potential",
      description: "Calculate E°cell from two half-reactions",
      fields: [
        { name: "eCathode", label: "E° Cathode (reduction, V)", type: "number", placeholder: "e.g. +0.34 for Cu²⁺/Cu", step: 0.01 },
        { name: "eAnode", label: "E° Anode (reduction, V)", type: "number", placeholder: "e.g. -0.76 for Zn²⁺/Zn", step: 0.01 },
        { name: "n", label: "Electrons Transferred (n)", type: "number", placeholder: "e.g. 2", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const eCath = inputs.eCathode as number, eAn = inputs.eAnode as number, n = inputs.n as number;
        if (eCath === undefined || eAn === undefined || !n || n <= 0) return null;
        const eCell = eCath - eAn;
        const deltaG = -n * F * eCell;
        const K = Math.exp((n * F * eCell) / (8.314 * 298.15));
        return {
          primary: { label: "E°cell", value: `${formatNumber(eCell, 4)} V` },
          details: [
            { label: "E° cathode (reduction)", value: `${formatNumber(eCath, 4)} V` },
            { label: "E° anode (reduction)", value: `${formatNumber(eAn, 4)} V` },
            { label: "ΔG°", value: `${formatNumber(deltaG / 1000, 4)} kJ/mol` },
            { label: "K (equilibrium constant)", value: K > 1e10 ? K.toExponential(4) : formatNumber(K, 4) },
            { label: "Spontaneous?", value: eCell > 0 ? "Yes" : "No" },
          ],
        };
      },
    },
    {
      id: "faraday",
      name: "Faraday's Law of Electrolysis",
      description: "Calculate mass deposited during electrolysis",
      fields: [
        { name: "current", label: "Current (A)", type: "number", placeholder: "e.g. 5.0" },
        { name: "time", label: "Time (seconds)", type: "number", placeholder: "e.g. 3600" },
        { name: "molarMass", label: "Molar Mass of Element (g/mol)", type: "number", placeholder: "e.g. 63.546 for Cu" },
        { name: "n", label: "Electrons per Ion (n)", type: "number", placeholder: "e.g. 2 for Cu²⁺", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const I = inputs.current as number, t = inputs.time as number;
        const mm = inputs.molarMass as number, n = inputs.n as number;
        if (!I || !t || !mm || !n || I <= 0 || t <= 0 || mm <= 0 || n <= 0) return null;
        const charge = I * t; // Coulombs
        const molesElectrons = charge / F;
        const molesDeposited = molesElectrons / n;
        const mass = molesDeposited * mm;
        return {
          primary: { label: "Mass Deposited", value: `${formatNumber(mass, 4)} g` },
          details: [
            { label: "Total Charge", value: `${formatNumber(charge, 2)} C` },
            { label: "Moles of Electrons", value: formatNumber(molesElectrons, 6) },
            { label: "Moles Deposited", value: formatNumber(molesDeposited, 6) },
            { label: "Current × Time", value: `${formatNumber(I, 2)} A × ${formatNumber(t, 0)} s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["oxidation-number-calculator", "gibbs-free-energy-calculator", "ph-calculator"],
  faq: [
    { question: "What is the Nernst equation?", answer: "E = E° - (RT/nF)ln(Q), or at 25°C: E = E° - (0.0592/n)log(Q). It calculates the cell potential under non-standard conditions. E° is standard potential, n is electrons transferred, Q is reaction quotient." },
    { question: "How do I calculate standard cell potential?", answer: "E°cell = E°cathode - E°anode, where both values are standard reduction potentials. The cathode is where reduction occurs (higher E°) and the anode is where oxidation occurs (lower E°). E°cell > 0 means the reaction is spontaneous." },
    { question: "What is Faraday's law?", answer: "Faraday's law relates charge passed to mass deposited: m = (Q × M)/(n × F), where Q = I × t (charge in coulombs), M is molar mass, n is electrons per ion, and F = 96,485 C/mol (Faraday constant)." },
  ],
  formula: "E = E° - (RT/nF)ln(Q) | E°cell = E°cathode - E°anode | m = (ItM)/(nF) | F = 96,485 C/mol",
};
