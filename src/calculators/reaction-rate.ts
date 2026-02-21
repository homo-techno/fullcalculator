import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const reactionRateCalculator: CalculatorDefinition = {
  slug: "reaction-rate-calculator",
  title: "Chemical Reaction Rate Calculator",
  description: "Free reaction rate calculator. Calculate reaction rates, rate constants, and half-life for zero, first, and second order chemical reactions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["reaction rate", "rate constant", "kinetics", "rate law", "reaction order"],
  variants: [
    {
      id: "firstOrder",
      name: "First Order Kinetics",
      description: "ln[A] = ln[A]₀ - kt",
      fields: [
        { name: "a0", label: "Initial Concentration [A]₀ (M)", type: "number", placeholder: "e.g. 1.0" },
        { name: "k", label: "Rate Constant k (s⁻¹)", type: "number", placeholder: "e.g. 0.01" },
        { name: "time", label: "Time (s)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const a0 = inputs.a0 as number, k = inputs.k as number, t = inputs.time as number;
        if (!a0 || !k || !t || a0 <= 0 || k <= 0 || t < 0) return null;
        const at = a0 * Math.exp(-k * t);
        const halfLife = Math.log(2) / k;
        const rate = k * at;
        const pctRemaining = (at / a0) * 100;
        return {
          primary: { label: "[A] at time t", value: `${formatNumber(at, 6)} M` },
          details: [
            { label: "Rate at time t", value: `${rate.toExponential(4)} M/s` },
            { label: "Half-life", value: `${formatNumber(halfLife, 4)} s` },
            { label: "% Remaining", value: `${formatNumber(pctRemaining, 2)}%` },
            { label: "% Reacted", value: `${formatNumber(100 - pctRemaining, 2)}%` },
          ],
        };
      },
    },
    {
      id: "secondOrder",
      name: "Second Order Kinetics",
      description: "1/[A] = 1/[A]₀ + kt",
      fields: [
        { name: "a0", label: "Initial Concentration [A]₀ (M)", type: "number", placeholder: "e.g. 1.0" },
        { name: "k", label: "Rate Constant k (M⁻¹s⁻¹)", type: "number", placeholder: "e.g. 0.05" },
        { name: "time", label: "Time (s)", type: "number", placeholder: "e.g. 60" },
      ],
      calculate: (inputs) => {
        const a0 = inputs.a0 as number, k = inputs.k as number, t = inputs.time as number;
        if (!a0 || !k || !t || a0 <= 0 || k <= 0 || t < 0) return null;
        const at = 1 / (1 / a0 + k * t);
        const halfLife = 1 / (k * a0);
        const rate = k * at * at;
        return {
          primary: { label: "[A] at time t", value: `${formatNumber(at, 6)} M` },
          details: [
            { label: "Rate at time t", value: `${rate.toExponential(4)} M/s` },
            { label: "Half-life", value: `${formatNumber(halfLife, 4)} s` },
            { label: "% Remaining", value: `${formatNumber((at / a0) * 100, 2)}%` },
          ],
          note: "Second order half-life depends on initial concentration: t½ = 1/(k[A]₀). Successive half-lives get longer.",
        };
      },
    },
    {
      id: "zeroOrder",
      name: "Zero Order Kinetics",
      description: "[A] = [A]₀ - kt",
      fields: [
        { name: "a0", label: "Initial Concentration [A]₀ (M)", type: "number", placeholder: "e.g. 1.0" },
        { name: "k", label: "Rate Constant k (M/s)", type: "number", placeholder: "e.g. 0.01" },
        { name: "time", label: "Time (s)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const a0 = inputs.a0 as number, k = inputs.k as number, t = inputs.time as number;
        if (!a0 || !k || !t || a0 <= 0 || k <= 0 || t < 0) return null;
        const at = Math.max(0, a0 - k * t);
        const halfLife = a0 / (2 * k);
        const timeToComplete = a0 / k;
        return {
          primary: { label: "[A] at time t", value: `${formatNumber(at, 6)} M` },
          details: [
            { label: "Rate (constant)", value: `${formatNumber(k, 6)} M/s` },
            { label: "Half-life", value: `${formatNumber(halfLife, 4)} s` },
            { label: "Time to complete", value: `${formatNumber(timeToComplete, 4)} s` },
            { label: "% Remaining", value: `${formatNumber((at / a0) * 100, 2)}%` },
          ],
          note: at === 0 ? "Reaction has gone to completion (all reactant consumed)." : undefined,
        };
      },
    },
    {
      id: "arrhenius",
      name: "Arrhenius Equation",
      description: "k = A·exp(-Ea/RT) — Temperature dependence of rate",
      fields: [
        { name: "k1", label: "Rate Constant k₁ at T₁", type: "number", placeholder: "e.g. 0.01" },
        { name: "t1", label: "Temperature T₁ (K)", type: "number", placeholder: "e.g. 298" },
        { name: "t2", label: "Temperature T₂ (K)", type: "number", placeholder: "e.g. 310" },
        { name: "ea", label: "Activation Energy Ea (kJ/mol)", type: "number", placeholder: "e.g. 50" },
      ],
      calculate: (inputs) => {
        const k1 = inputs.k1 as number, t1 = inputs.t1 as number;
        const t2 = inputs.t2 as number, ea = inputs.ea as number;
        if (!k1 || !t1 || !t2 || !ea || k1 <= 0 || t1 <= 0 || t2 <= 0 || ea <= 0) return null;
        const R = 8.314;
        const eaJ = ea * 1000;
        const k2 = k1 * Math.exp((eaJ / R) * (1 / t1 - 1 / t2));
        const ratio = k2 / k1;
        return {
          primary: { label: "k₂ at T₂", value: k2 < 0.001 || k2 > 1e6 ? k2.toExponential(4) : formatNumber(k2, 6) },
          details: [
            { label: "k₁ at T₁", value: formatNumber(k1, 6) },
            { label: "k₂/k₁ ratio", value: formatNumber(ratio, 4) },
            { label: "Ea", value: `${formatNumber(ea, 2)} kJ/mol` },
            { label: "ΔT", value: `${formatNumber(t2 - t1, 2)} K` },
          ],
          note: `A ${formatNumber(t2 - t1, 0)} K increase changes the rate by a factor of ${formatNumber(ratio, 2)}.`,
        };
      },
    },
  ],
  relatedSlugs: ["half-life-calculator", "equilibrium-constant-calculator", "molarity-calculator"],
  faq: [
    { question: "What is a reaction rate?", answer: "Reaction rate is the change in concentration per unit time. Rate = -Δ[reactant]/Δt = +Δ[product]/Δt. The rate law: Rate = k[A]^n, where k is the rate constant and n is the reaction order." },
    { question: "How do reaction orders differ?", answer: "Zero order: rate is constant, [A] decreases linearly, t½ = [A]₀/2k. First order: rate depends on [A], exponential decay, t½ = ln(2)/k. Second order: rate depends on [A]², t½ = 1/(k[A]₀)." },
    { question: "What is the Arrhenius equation?", answer: "k = A·e^(-Ea/RT) relates the rate constant to temperature. Ea is activation energy, A is the pre-exponential factor. Higher Ea = more temperature-sensitive. A 10°C increase typically doubles to triples the rate." },
  ],
  formula: "Zero: [A] = [A]₀ - kt | First: [A] = [A]₀·e^(-kt) | Second: 1/[A] = 1/[A]₀ + kt | Arrhenius: k = A·e^(-Ea/RT)",
};
