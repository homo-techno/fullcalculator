import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rateConstantCalculator: CalculatorDefinition = {
  slug: "rate-constant-calculator",
  title: "Rate Constant Calculator (Arrhenius)",
  description: "Free rate constant calculator using the Arrhenius equation. Calculate the rate constant k at a given temperature, or find activation energy from two temperature-rate pairs.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["rate constant", "Arrhenius equation", "activation energy", "reaction kinetics", "temperature dependence"],
  variants: [
    {
      id: "arrhenius",
      name: "Rate Constant (Arrhenius)",
      fields: [
        { name: "preExpFactor", label: "Pre-exponential Factor (A)", type: "number", placeholder: "e.g. 1e12", min: 0, step: 1 },
        { name: "activationEnergy", label: "Activation Energy (kJ/mol)", type: "number", placeholder: "e.g. 75", min: 0, step: 0.1 },
        { name: "temperature", label: "Temperature (K)", type: "number", placeholder: "e.g. 298", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const A = inputs.preExpFactor as number;
        const Ea = inputs.activationEnergy as number;
        const T = inputs.temperature as number;
        const R = 8.314;
        if (!A || Ea === undefined || !T || A <= 0 || Ea < 0 || T <= 0) return null;
        const EaJ = Ea * 1000;
        const k = A * Math.exp(-EaJ / (R * T));
        return {
          primary: { label: "Rate Constant (k)", value: k.toExponential(4) },
          details: [
            { label: "Pre-exponential Factor (A)", value: A.toExponential(4) },
            { label: "Activation Energy", value: `${formatNumber(Ea, 2)} kJ/mol` },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
            { label: "Ea/(RT)", value: formatNumber(EaJ / (R * T), 4) },
            { label: "e^(-Ea/RT)", value: Math.exp(-EaJ / (R * T)).toExponential(4) },
          ],
          note: "k = A × e^(-Ea/RT). Higher temperature or lower activation energy increases the rate constant.",
        };
      },
    },
    {
      id: "two-temperatures",
      name: "Compare k at Two Temperatures",
      fields: [
        { name: "k1", label: "Rate Constant k₁ at T₁", type: "number", placeholder: "e.g. 0.005", min: 0, step: 0.0001 },
        { name: "T1", label: "Temperature T₁ (K)", type: "number", placeholder: "e.g. 298", min: 0.01, step: 0.01 },
        { name: "T2", label: "Temperature T₂ (K)", type: "number", placeholder: "e.g. 350", min: 0.01, step: 0.01 },
        { name: "Ea", label: "Activation Energy (kJ/mol)", type: "number", placeholder: "e.g. 75", min: 0, step: 0.1 },
      ],
      calculate: (inputs) => {
        const k1 = inputs.k1 as number;
        const T1 = inputs.T1 as number;
        const T2 = inputs.T2 as number;
        const Ea = inputs.Ea as number;
        const R = 8.314;
        if (!k1 || !T1 || !T2 || Ea === undefined || k1 <= 0 || T1 <= 0 || T2 <= 0 || Ea < 0) return null;
        const EaJ = Ea * 1000;
        const lnRatio = (EaJ / R) * (1 / T1 - 1 / T2);
        const k2 = k1 * Math.exp(lnRatio);
        const ratio = k2 / k1;
        return {
          primary: { label: "Rate Constant k₂", value: k2.toExponential(4) },
          details: [
            { label: "k₁ at T₁", value: k1.toExponential(4) },
            { label: "T₁", value: `${formatNumber(T1, 2)} K` },
            { label: "T₂", value: `${formatNumber(T2, 2)} K` },
            { label: "k₂/k₁ Ratio", value: formatNumber(ratio, 4) },
            { label: "Activation Energy", value: `${formatNumber(Ea, 2)} kJ/mol` },
          ],
          note: "ln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂). A 10°C increase roughly doubles the rate for many reactions.",
        };
      },
    },
  ],
  relatedSlugs: ["activation-energy-calculator", "reaction-rate-calculator", "equilibrium-constant-calculator"],
  faq: [
    { question: "What is the Arrhenius equation?", answer: "The Arrhenius equation k = A × e^(-Ea/RT) describes how the rate constant k depends on temperature. A is the pre-exponential factor, Ea is activation energy, R is the gas constant, and T is temperature in Kelvin." },
    { question: "What are typical units for rate constants?", answer: "Units depend on reaction order: zero order = M/s, first order = 1/s (s⁻¹), second order = 1/(M·s) or L/(mol·s). The pre-exponential factor A has the same units as k." },
  ],
  formula: "k = A × e^(-Ea/RT) | ln(k₂/k₁) = (Ea/R)(1/T₁ - 1/T₂)",
};
