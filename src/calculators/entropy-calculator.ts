import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const entropyCalculator: CalculatorDefinition = {
  slug: "entropy-calculator",
  title: "Entropy Change Calculator",
  description: "Free entropy change calculator. Calculate ΔS for chemical reactions, phase changes, and mixing. Determine entropy change of surroundings and universe.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["entropy", "entropy change", "ΔS", "second law", "thermodynamics", "disorder"],
  variants: [
    {
      id: "reactionEntropy",
      name: "Reaction Entropy (ΔS°rxn)",
      description: "ΔS°rxn = ΣS°products - ΣS°reactants",
      fields: [
        { name: "sProducts", label: "ΣS° of Products (J/mol·K)", type: "number", placeholder: "e.g. 188.7" },
        { name: "sReactants", label: "ΣS° of Reactants (J/mol·K)", type: "number", placeholder: "e.g. 130.6" },
      ],
      calculate: (inputs) => {
        const sP = inputs.sProducts as number, sR = inputs.sReactants as number;
        if (sP === undefined || sR === undefined) return null;
        const deltaS = sP - sR;
        const sign = deltaS > 0 ? "Positive (increase in disorder)" : deltaS < 0 ? "Negative (decrease in disorder)" : "Zero (no change)";
        return {
          primary: { label: "ΔS°rxn", value: `${formatNumber(deltaS, 4)} J/(mol·K)` },
          details: [
            { label: "ΣS° products", value: `${formatNumber(sP, 4)} J/(mol·K)` },
            { label: "ΣS° reactants", value: `${formatNumber(sR, 4)} J/(mol·K)` },
            { label: "Sign", value: sign },
            { label: "ΔS° in kJ/(mol·K)", value: formatNumber(deltaS / 1000, 6) },
          ],
        };
      },
    },
    {
      id: "phaseChange",
      name: "Entropy of Phase Change",
      description: "ΔS = ΔH / T at the phase transition temperature",
      fields: [
        { name: "deltaH", label: "Enthalpy of Phase Change (kJ/mol)", type: "number", placeholder: "e.g. 6.01 for ice melting" },
        { name: "temp", label: "Phase Transition Temperature (K)", type: "number", placeholder: "e.g. 273.15 for water" },
        { name: "phaseType", label: "Phase Transition", type: "select", options: [
          { label: "Melting (solid → liquid)", value: "melting" },
          { label: "Vaporization (liquid → gas)", value: "vaporization" },
          { label: "Sublimation (solid → gas)", value: "sublimation" },
          { label: "Freezing (liquid → solid)", value: "freezing" },
          { label: "Condensation (gas → liquid)", value: "condensation" },
        ] },
      ],
      calculate: (inputs) => {
        const dH = inputs.deltaH as number, T = inputs.temp as number, phase = inputs.phaseType as string;
        if (!dH || !T || T <= 0) return null;
        const isEndothermic = ["melting", "vaporization", "sublimation"].includes(phase);
        const deltaH = isEndothermic ? Math.abs(dH) : -Math.abs(dH);
        const deltaS = (deltaH * 1000) / T; // Convert kJ to J
        return {
          primary: { label: "ΔS", value: `${formatNumber(deltaS, 4)} J/(mol·K)` },
          details: [
            { label: "ΔH", value: `${formatNumber(deltaH, 4)} kJ/mol` },
            { label: "Temperature", value: `${formatNumber(T, 2)} K (${formatNumber(T - 273.15, 2)}°C)` },
            { label: "Process", value: `${phase || "phase change"} (${isEndothermic ? "endothermic" : "exothermic"})` },
            { label: "Entropy Change", value: deltaS > 0 ? "Increases (more disorder)" : "Decreases (more order)" },
          ],
        };
      },
    },
    {
      id: "surroundings",
      name: "Entropy of Surroundings",
      description: "ΔS_surr = -ΔH_sys / T",
      fields: [
        { name: "deltaH", label: "ΔH of System (kJ/mol)", type: "number", placeholder: "e.g. -285.8 (exothermic)" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15", defaultValue: 298.15 },
      ],
      calculate: (inputs) => {
        const dH = inputs.deltaH as number, T = inputs.temp as number || 298.15;
        if (dH === undefined || T <= 0) return null;
        const dSsurr = -(dH * 1000) / T; // Convert kJ to J
        return {
          primary: { label: "ΔS_surroundings", value: `${formatNumber(dSsurr, 4)} J/(mol·K)` },
          details: [
            { label: "ΔH_system", value: `${formatNumber(dH, 4)} kJ/mol` },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
            { label: "Exothermic?", value: dH < 0 ? "Yes (ΔH < 0, surroundings gain entropy)" : "No (ΔH > 0, surroundings lose entropy)" },
          ],
          note: "For spontaneity: ΔS_universe = ΔS_system + ΔS_surroundings > 0 (Second Law). Use Gibbs free energy: ΔG = ΔH - TΔS for a more direct test.",
        };
      },
    },
  ],
  relatedSlugs: ["gibbs-free-energy-calculator", "enthalpy-calculator", "equilibrium-constant-calculator"],
  faq: [
    { question: "What is entropy?", answer: "Entropy (S) is a measure of the disorder or randomness of a system. The Second Law of Thermodynamics states that the total entropy of the universe always increases for spontaneous processes. Units: J/(mol·K)." },
    { question: "How do I predict the sign of ΔS?", answer: "ΔS is positive (increase) when: gases are produced, number of moles increases, solids dissolve, temperature increases. ΔS is negative when: gases condense, precipitation occurs, fewer moles of gas form." },
    { question: "What is the relationship between entropy and spontaneity?", answer: "A process is spontaneous when ΔS_universe > 0, i.e., ΔS_system + ΔS_surroundings > 0. This is equivalent to ΔG < 0 (Gibbs free energy). A reaction can be spontaneous even if ΔS_system < 0 if ΔS_surroundings is large enough." },
  ],
  formula: "ΔS°rxn = ΣS°products - ΣS°reactants | ΔS = ΔH/T (phase change) | ΔS_surr = -ΔH_sys/T",
};
