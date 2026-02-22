import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const activationEnergyCalculator: CalculatorDefinition = {
  slug: "activation-energy-calculator",
  title: "Activation Energy Calculator",
  description: "Free activation energy calculator. Determine activation energy from two rate constants at different temperatures using the Arrhenius equation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["activation energy", "Arrhenius", "rate constant", "reaction kinetics", "energy barrier"],
  variants: [
    {
      id: "from-two-rates",
      name: "From Two Rate Constants",
      fields: [
        { name: "k1", label: "Rate Constant k₁", type: "number", placeholder: "e.g. 0.005", min: 0, step: 0.0001 },
        { name: "T1", label: "Temperature T₁ (K)", type: "number", placeholder: "e.g. 298", min: 0.01, step: 0.01 },
        { name: "k2", label: "Rate Constant k₂", type: "number", placeholder: "e.g. 0.05", min: 0, step: 0.0001 },
        { name: "T2", label: "Temperature T₂ (K)", type: "number", placeholder: "e.g. 350", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const k1 = inputs.k1 as number;
        const T1 = inputs.T1 as number;
        const k2 = inputs.k2 as number;
        const T2 = inputs.T2 as number;
        const R = 8.314;
        if (!k1 || !T1 || !k2 || !T2 || k1 <= 0 || k2 <= 0 || T1 <= 0 || T2 <= 0 || T1 === T2) return null;
        const lnRatio = Math.log(k2 / k1);
        const invTDiff = (1 / T1) - (1 / T2);
        const EaJ = (lnRatio * R) / invTDiff;
        const EakJ = EaJ / 1000;
        const Eakcal = EakJ / 4.184;
        const A = k1 / Math.exp(-EaJ / (R * T1));
        return {
          primary: { label: "Activation Energy", value: formatNumber(EakJ, 2), suffix: "kJ/mol" },
          details: [
            { label: "Ea (J/mol)", value: formatNumber(EaJ, 2) },
            { label: "Ea (kcal/mol)", value: formatNumber(Eakcal, 2) },
            { label: "Pre-exponential Factor (A)", value: A.toExponential(4) },
            { label: "ln(k₂/k₁)", value: formatNumber(lnRatio, 6) },
            { label: "1/T₁ - 1/T₂", value: invTDiff.toExponential(6) },
          ],
          note: "Ea = R × ln(k₂/k₁) / (1/T₁ - 1/T₂). Typical Ea values: 40-200 kJ/mol for most chemical reactions.",
        };
      },
    },
    {
      id: "from-rate-and-A",
      name: "From Rate Constant and A",
      fields: [
        { name: "k", label: "Rate Constant (k)", type: "number", placeholder: "e.g. 0.01", min: 0, step: 0.0001 },
        { name: "A", label: "Pre-exponential Factor (A)", type: "number", placeholder: "e.g. 1e12", min: 0, step: 1 },
        { name: "T", label: "Temperature (K)", type: "number", placeholder: "e.g. 298", min: 0.01, step: 0.01 },
      ],
      calculate: (inputs) => {
        const k = inputs.k as number;
        const A = inputs.A as number;
        const T = inputs.T as number;
        const R = 8.314;
        if (!k || !A || !T || k <= 0 || A <= 0 || T <= 0 || k >= A) return null;
        const EaJ = -R * T * Math.log(k / A);
        const EakJ = EaJ / 1000;
        const Eakcal = EakJ / 4.184;
        return {
          primary: { label: "Activation Energy", value: formatNumber(EakJ, 2), suffix: "kJ/mol" },
          details: [
            { label: "Ea (J/mol)", value: formatNumber(EaJ, 2) },
            { label: "Ea (kcal/mol)", value: formatNumber(Eakcal, 2) },
            { label: "k", value: k.toExponential(4) },
            { label: "A", value: A.toExponential(4) },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rate-constant-calculator", "reaction-rate-calculator", "gibbs-free-energy-calculator"],
  faq: [
    { question: "What is activation energy?", answer: "Activation energy (Ea) is the minimum energy required for reactant molecules to undergo a chemical reaction. It represents the energy barrier that must be overcome for bonds to break and new bonds to form." },
    { question: "How does a catalyst affect activation energy?", answer: "A catalyst lowers the activation energy by providing an alternative reaction pathway. This increases the rate constant and reaction rate without being consumed in the reaction." },
  ],
  formula: "Ea = R × ln(k₂/k₁) / (1/T₁ - 1/T₂) | Ea = -R × T × ln(k/A)",
};
