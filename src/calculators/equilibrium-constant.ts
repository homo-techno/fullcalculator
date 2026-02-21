import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const equilibriumConstantCalculator: CalculatorDefinition = {
  slug: "equilibrium-constant-calculator",
  title: "Equilibrium Constant Calculator",
  description: "Free equilibrium constant calculator. Calculate Kc, Kp, and reaction quotient Q. Convert between Kc and Kp for gaseous reactions.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["equilibrium constant", "Kc", "Kp", "reaction quotient", "Le Chatelier"],
  variants: [
    {
      id: "kcSimple",
      name: "Kc for A ⇌ B",
      description: "Simple equilibrium: A ⇌ B with known concentrations",
      fields: [
        { name: "concProducts", label: "Product Concentration [B] (M)", type: "number", placeholder: "e.g. 0.5" },
        { name: "coeffProducts", label: "Product Coefficient", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "concReactants", label: "Reactant Concentration [A] (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "coeffReactants", label: "Reactant Coefficient", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const cP = inputs.concProducts as number, nP = inputs.coeffProducts as number || 1;
        const cR = inputs.concReactants as number, nR = inputs.coeffReactants as number || 1;
        if (!cP || !cR || cP <= 0 || cR <= 0) return null;
        const Kc = Math.pow(cP, nP) / Math.pow(cR, nR);
        const deltaG = -8.314 * 298.15 * Math.log(Kc) / 1000;
        return {
          primary: { label: "Kc", value: Kc > 1e6 || Kc < 1e-6 ? Kc.toExponential(4) : formatNumber(Kc, 6) },
          details: [
            { label: "[Products]^n", value: formatNumber(Math.pow(cP, nP), 6) },
            { label: "[Reactants]^n", value: formatNumber(Math.pow(cR, nR), 6) },
            { label: "ΔG° at 25°C", value: `${formatNumber(deltaG, 4)} kJ/mol` },
            { label: "Favors", value: Kc > 1 ? "Products" : Kc < 1 ? "Reactants" : "Neither (K = 1)" },
          ],
        };
      },
    },
    {
      id: "kcToKp",
      name: "Convert Kc to Kp",
      description: "Kp = Kc(RT)^Δn for gas-phase reactions",
      fields: [
        { name: "kc", label: "Kc", type: "number", placeholder: "e.g. 0.5" },
        { name: "temp", label: "Temperature (K)", type: "number", placeholder: "e.g. 298.15" },
        { name: "deltaN", label: "Δn (moles gas products - moles gas reactants)", type: "number", placeholder: "e.g. 1", step: 1 },
      ],
      calculate: (inputs) => {
        const kc = inputs.kc as number, T = inputs.temp as number, dn = inputs.deltaN as number;
        if (!kc || !T || dn === undefined || kc <= 0 || T <= 0) return null;
        const R = 0.08206; // L·atm/(mol·K)
        const kp = kc * Math.pow(R * T, dn);
        return {
          primary: { label: "Kp", value: kp > 1e6 || kp < 1e-6 ? kp.toExponential(4) : formatNumber(kp, 6) },
          details: [
            { label: "Kc", value: formatNumber(kc, 6) },
            { label: "(RT)^Δn", value: formatNumber(Math.pow(R * T, dn), 6) },
            { label: "Δn", value: `${dn}` },
            { label: "Temperature", value: `${formatNumber(T, 2)} K` },
          ],
          note: "When Δn = 0, Kp = Kc. R = 0.08206 L·atm/(mol·K) when pressures are in atm.",
        };
      },
    },
    {
      id: "reactionQuotient",
      name: "Reaction Quotient Q vs K",
      description: "Determine reaction direction by comparing Q and K",
      fields: [
        { name: "q", label: "Reaction Quotient Q", type: "number", placeholder: "e.g. 0.1" },
        { name: "k", label: "Equilibrium Constant K", type: "number", placeholder: "e.g. 1.0" },
      ],
      calculate: (inputs) => {
        const q = inputs.q as number, k = inputs.k as number;
        if (q === undefined || k === undefined || q < 0 || k <= 0) return null;
        const ratio = q / k;
        let direction = "At equilibrium";
        let explanation = "Q = K, no net change";
        if (ratio < 0.99) {
          direction = "Forward (→ products)";
          explanation = "Q < K: reaction shifts right to form more products";
        } else if (ratio > 1.01) {
          direction = "Reverse (← reactants)";
          explanation = "Q > K: reaction shifts left to form more reactants";
        }
        return {
          primary: { label: "Reaction Direction", value: direction },
          details: [
            { label: "Q", value: formatNumber(q, 6) },
            { label: "K", value: formatNumber(k, 6) },
            { label: "Q/K", value: formatNumber(ratio, 6) },
            { label: "Explanation", value: explanation },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["gibbs-free-energy-calculator", "reaction-rate-calculator", "solubility-product-calculator"],
  faq: [
    { question: "What is the equilibrium constant?", answer: "The equilibrium constant K is the ratio of product concentrations to reactant concentrations (each raised to their stoichiometric coefficients) at equilibrium. K > 1 favors products; K < 1 favors reactants." },
    { question: "What is the difference between Kc and Kp?", answer: "Kc uses molar concentrations, Kp uses partial pressures. They are related by Kp = Kc(RT)^Δn, where Δn is the change in moles of gas. For reactions with equal moles of gas on each side (Δn=0), Kp = Kc." },
    { question: "What is the reaction quotient Q?", answer: "Q has the same expression as K but uses current (non-equilibrium) concentrations. If Q < K, the reaction proceeds forward. If Q > K, the reaction proceeds in reverse. At equilibrium, Q = K." },
  ],
  formula: "Kc = [products]^n / [reactants]^n | Kp = Kc(RT)^Δn | ΔG° = -RT·ln(K)",
};
