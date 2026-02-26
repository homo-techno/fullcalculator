import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nuclearDecayChainCalculator: CalculatorDefinition = {
  slug: "nuclear-decay-chain-calculator",
  title: "Nuclear Decay Chain Calculator",
  description: "Free nuclear decay chain calculator. Compute remaining activity, half-life conversions, and daughter nuclide buildup using radioactive decay equations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["nuclear decay", "radioactive decay", "half-life", "decay chain", "activity", "decay constant"],
  variants: [
    {
      id: "single-decay",
      name: "Single Isotope Decay",
      description: "Calculate remaining quantity and activity after a given time",
      fields: [
        { name: "n0", label: "Initial Quantity (atoms or grams)", type: "number", placeholder: "e.g. 1000000", min: 0.001 },
        { name: "halfLife", label: "Half-Life", type: "number", placeholder: "e.g. 5730", min: 0.0001 },
        {
          name: "halfLifeUnit",
          label: "Half-Life Unit",
          type: "select",
          options: [
            { label: "Seconds", value: "s" },
            { label: "Minutes", value: "min" },
            { label: "Hours", value: "h" },
            { label: "Days", value: "d" },
            { label: "Years", value: "y" },
          ],
          defaultValue: "y",
        },
        { name: "time", label: "Elapsed Time", type: "number", placeholder: "e.g. 10000", min: 0 },
        {
          name: "timeUnit",
          label: "Time Unit",
          type: "select",
          options: [
            { label: "Seconds", value: "s" },
            { label: "Minutes", value: "min" },
            { label: "Hours", value: "h" },
            { label: "Days", value: "d" },
            { label: "Years", value: "y" },
          ],
          defaultValue: "y",
        },
      ],
      calculate: (inputs) => {
        const N0 = parseFloat(inputs.n0 as string);
        const halfLifeVal = parseFloat(inputs.halfLife as string);
        const halfLifeUnit = (inputs.halfLifeUnit as string) || "y";
        const timeVal = parseFloat(inputs.time as string);
        const timeUnit = (inputs.timeUnit as string) || "y";
        if (isNaN(N0) || isNaN(halfLifeVal) || isNaN(timeVal)) return null;
        if (N0 <= 0 || halfLifeVal <= 0 || timeVal < 0) return null;

        // Convert to seconds
        const toSeconds: Record<string, number> = { s: 1, min: 60, h: 3600, d: 86400, y: 365.25 * 86400 };
        const halfLifeS = halfLifeVal * (toSeconds[halfLifeUnit] || 1);
        const timeS = timeVal * (toSeconds[timeUnit] || 1);

        const lambda = Math.LN2 / halfLifeS; // decay constant (1/s)
        const Nt = N0 * Math.exp(-lambda * timeS);
        const decayed = N0 - Nt;
        const halfLives = timeS / halfLifeS;
        const percentRemaining = (Nt / N0) * 100;
        const meanLifetime = 1 / lambda;

        // Activity (disintegrations per second)
        const activity0 = lambda * N0;
        const activityT = lambda * Nt;

        return {
          primary: { label: "Remaining", value: formatNumber(Nt, 4) },
          details: [
            { label: "Initial Amount", value: formatNumber(N0, 4) },
            { label: "Remaining (N(t))", value: formatNumber(Nt, 4) },
            { label: "Decayed", value: formatNumber(decayed, 4) },
            { label: "% Remaining", value: `${formatNumber(percentRemaining, 4)}%` },
            { label: "Half-Lives Elapsed", value: formatNumber(halfLives, 4) },
            { label: "Decay Constant (λ)", value: `${formatNumber(lambda, 6)} /s` },
            { label: "Mean Lifetime (τ)", value: `${formatNumber(meanLifetime / (toSeconds[halfLifeUnit] || 1), 4)} ${halfLifeUnit}` },
            { label: "Initial Activity", value: `${formatNumber(activity0, 4)} /s` },
            { label: "Current Activity", value: `${formatNumber(activityT, 4)} /s` },
          ],
        };
      },
    },
    {
      id: "dating",
      name: "Radiometric Dating",
      description: "Calculate the age of a sample from remaining fraction",
      fields: [
        { name: "remainingFraction", label: "Fraction Remaining (0-1)", type: "number", placeholder: "e.g. 0.25", min: 0.0001, max: 1, step: 0.01 },
        { name: "halfLife", label: "Half-Life", type: "number", placeholder: "e.g. 5730", min: 0.0001 },
        {
          name: "halfLifeUnit",
          label: "Half-Life Unit",
          type: "select",
          options: [
            { label: "Seconds", value: "s" },
            { label: "Minutes", value: "min" },
            { label: "Hours", value: "h" },
            { label: "Days", value: "d" },
            { label: "Years", value: "y" },
          ],
          defaultValue: "y",
        },
      ],
      calculate: (inputs) => {
        const fraction = parseFloat(inputs.remainingFraction as string);
        const halfLifeVal = parseFloat(inputs.halfLife as string);
        const halfLifeUnit = (inputs.halfLifeUnit as string) || "y";
        if (isNaN(fraction) || isNaN(halfLifeVal)) return null;
        if (fraction <= 0 || fraction > 1 || halfLifeVal <= 0) return null;

        // t = -ln(N/N0) / λ = -ln(fraction) * t½ / ln(2)
        const age = -Math.log(fraction) * halfLifeVal / Math.LN2;
        const halfLivesElapsed = -Math.log(fraction) / Math.LN2;
        const percentDecayed = (1 - fraction) * 100;

        return {
          primary: { label: "Age", value: `${formatNumber(age, 4)} ${halfLifeUnit}` },
          details: [
            { label: "Fraction Remaining", value: formatNumber(fraction, 6) },
            { label: "% Decayed", value: `${formatNumber(percentDecayed, 4)}%` },
            { label: "Half-Lives Elapsed", value: formatNumber(halfLivesElapsed, 4) },
            { label: "Age", value: `${formatNumber(age, 4)} ${halfLifeUnit}` },
            { label: "Half-Life", value: `${formatNumber(halfLifeVal, 4)} ${halfLifeUnit}` },
          ],
        };
      },
    },
    {
      id: "two-step",
      name: "Parent-Daughter Chain",
      description: "Calculate daughter nuclide buildup in a two-step decay chain (A → B → C)",
      fields: [
        { name: "n0", label: "Initial Parent Atoms (N₀)", type: "number", placeholder: "e.g. 1000000", min: 1 },
        { name: "halfLife1", label: "Parent Half-Life (years)", type: "number", placeholder: "e.g. 100", min: 0.0001 },
        { name: "halfLife2", label: "Daughter Half-Life (years)", type: "number", placeholder: "e.g. 10", min: 0.0001 },
        { name: "time", label: "Elapsed Time (years)", type: "number", placeholder: "e.g. 50", min: 0 },
      ],
      calculate: (inputs) => {
        const N0 = parseFloat(inputs.n0 as string);
        const t1 = parseFloat(inputs.halfLife1 as string);
        const t2 = parseFloat(inputs.halfLife2 as string);
        const time = parseFloat(inputs.time as string);
        if (isNaN(N0) || isNaN(t1) || isNaN(t2) || isNaN(time)) return null;
        if (N0 <= 0 || t1 <= 0 || t2 <= 0 || time < 0) return null;

        const lambda1 = Math.LN2 / t1;
        const lambda2 = Math.LN2 / t2;

        // Bateman equations
        const NA = N0 * Math.exp(-lambda1 * time);
        let NB: number;
        if (Math.abs(lambda1 - lambda2) < 1e-15) {
          // Degenerate case
          NB = N0 * lambda1 * time * Math.exp(-lambda1 * time);
        } else {
          NB = (N0 * lambda1 / (lambda2 - lambda1)) * (Math.exp(-lambda1 * time) - Math.exp(-lambda2 * time));
        }
        const NC = N0 - NA - NB;

        // Check for secular equilibrium (λ1 << λ2)
        const equilibrium = lambda1 < lambda2 / 10 ? "Secular equilibrium expected" : lambda1 < lambda2 ? "Transient equilibrium" : "No equilibrium";

        return {
          primary: { label: "Parent Remaining (A)", value: formatNumber(NA, 2) },
          details: [
            { label: "Parent A Remaining", value: formatNumber(NA, 2) },
            { label: "Daughter B Present", value: formatNumber(Math.max(0, NB), 2) },
            { label: "Stable Product C", value: formatNumber(Math.max(0, NC), 2) },
            { label: "Parent Half-Life", value: `${formatNumber(t1, 4)} years` },
            { label: "Daughter Half-Life", value: `${formatNumber(t2, 4)} years` },
            { label: "λ₁", value: `${formatNumber(lambda1, 6)} /year` },
            { label: "λ₂", value: `${formatNumber(lambda2, 6)} /year` },
            { label: "Equilibrium Type", value: equilibrium },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["compton-scattering-calculator", "photoelectric-effect-calculator", "scientific-calculator"],
  faq: [
    { question: "What is radioactive decay?", answer: "Radioactive decay is the spontaneous transformation of an unstable atomic nucleus into a more stable one, emitting radiation (alpha, beta, or gamma). The number of remaining atoms follows N(t) = N₀·e^(-λt), where λ = ln(2)/t½ is the decay constant." },
    { question: "What is a decay chain?", answer: "A decay chain is a series of radioactive decays where the daughter product is also radioactive. For example, U-238 decays through 14 steps before reaching stable Pb-206. The Bateman equations describe the amounts of each nuclide in the chain over time." },
    { question: "How does carbon-14 dating work?", answer: "Living organisms maintain a constant ratio of C-14/C-12 by exchanging carbon with the atmosphere. After death, C-14 decays with a half-life of 5,730 years. By measuring the remaining C-14 fraction, the age can be calculated: t = -ln(N/N₀) × t½/ln(2). Effective up to ~50,000 years." },
  ],
  formula: "N(t) = N₀·e^(-λt) | λ = ln(2)/t½ | τ = 1/λ | A(t) = λN(t) | Age: t = -ln(N/N₀)/λ",
};
