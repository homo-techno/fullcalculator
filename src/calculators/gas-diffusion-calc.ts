import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gasDiffusionCalculator: CalculatorDefinition = {
  slug: "gas-diffusion-calculator",
  title: "Graham's Law Gas Diffusion Calculator",
  description: "Free Graham's law gas diffusion calculator. Compute relative effusion and diffusion rates of gases based on their molar masses.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["graham's law", "gas diffusion", "gas effusion", "molar mass", "rate of diffusion", "kinetic molecular theory"],
  variants: [
    {
      id: "rate-ratio",
      name: "Diffusion Rate Ratio",
      description: "Calculate the ratio of diffusion/effusion rates of two gases from their molar masses",
      fields: [
        { name: "m1", label: "Molar Mass of Gas 1 (g/mol)", type: "number", placeholder: "e.g. 2 (H₂)", min: 0.1 },
        { name: "m2", label: "Molar Mass of Gas 2 (g/mol)", type: "number", placeholder: "e.g. 32 (O₂)", min: 0.1 },
      ],
      calculate: (inputs) => {
        const M1 = parseFloat(inputs.m1 as string);
        const M2 = parseFloat(inputs.m2 as string);
        if (isNaN(M1) || isNaN(M2) || M1 <= 0 || M2 <= 0) return null;

        // Graham's law: rate1/rate2 = √(M2/M1)
        const rateRatio = Math.sqrt(M2 / M1);

        // RMS speeds at 298 K: v_rms = √(3RT/M)
        const R = 8.314; // J/(mol·K)
        const T = 298; // K
        const vrms1 = Math.sqrt((3 * R * T) / (M1 / 1000));
        const vrms2 = Math.sqrt((3 * R * T) / (M2 / 1000));

        const lighter = M1 < M2 ? "Gas 1" : "Gas 2";
        const fasterFactor = M1 < M2 ? rateRatio : 1 / rateRatio;

        return {
          primary: { label: "Rate Ratio (Gas1/Gas2)", value: formatNumber(rateRatio, 4) },
          details: [
            { label: "Molar Mass Gas 1", value: `${formatNumber(M1, 2)} g/mol` },
            { label: "Molar Mass Gas 2", value: `${formatNumber(M2, 2)} g/mol` },
            { label: "rate₁/rate₂", value: formatNumber(rateRatio, 4) },
            { label: "rate₂/rate₁", value: formatNumber(1 / rateRatio, 4) },
            { label: "Faster Gas", value: `${lighter} (${formatNumber(fasterFactor, 2)}× faster)` },
            { label: "v_rms Gas 1 (298 K)", value: `${formatNumber(vrms1, 1)} m/s` },
            { label: "v_rms Gas 2 (298 K)", value: `${formatNumber(vrms2, 1)} m/s` },
          ],
        };
      },
    },
    {
      id: "find-mass",
      name: "Find Unknown Molar Mass",
      description: "Determine the molar mass of an unknown gas from its diffusion rate relative to a known gas",
      fields: [
        { name: "mKnown", label: "Known Gas Molar Mass (g/mol)", type: "number", placeholder: "e.g. 28 (N₂)", min: 0.1 },
        { name: "rateRatio", label: "Rate Ratio (unknown/known)", type: "number", placeholder: "e.g. 0.5", min: 0.001 },
      ],
      calculate: (inputs) => {
        const mKnown = parseFloat(inputs.mKnown as string);
        const ratio = parseFloat(inputs.rateRatio as string);
        if (isNaN(mKnown) || isNaN(ratio) || mKnown <= 0 || ratio <= 0) return null;

        // rate_unknown / rate_known = √(M_known / M_unknown)
        // M_unknown = M_known / ratio²
        const mUnknown = mKnown / (ratio * ratio);

        return {
          primary: { label: "Unknown Molar Mass", value: `${formatNumber(mUnknown, 2)} g/mol` },
          details: [
            { label: "Known Gas Molar Mass", value: `${formatNumber(mKnown, 2)} g/mol` },
            { label: "Rate Ratio (unknown/known)", value: formatNumber(ratio, 4) },
            { label: "Unknown Molar Mass", value: `${formatNumber(mUnknown, 2)} g/mol` },
            { label: "Formula Used", value: "M_unknown = M_known / (rate ratio)²" },
          ],
        };
      },
    },
    {
      id: "common-gases",
      name: "Common Gas Comparison",
      description: "Compare diffusion rates of a gas against common reference gases",
      fields: [
        { name: "m1", label: "Your Gas Molar Mass (g/mol)", type: "number", placeholder: "e.g. 44 (CO₂)", min: 0.1 },
        {
          name: "reference",
          label: "Reference Gas",
          type: "select",
          options: [
            { label: "H₂ (2.016 g/mol)", value: "2.016" },
            { label: "He (4.003 g/mol)", value: "4.003" },
            { label: "N₂ (28.014 g/mol)", value: "28.014" },
            { label: "O₂ (31.998 g/mol)", value: "31.998" },
            { label: "Air (28.97 g/mol)", value: "28.97" },
            { label: "CO₂ (44.01 g/mol)", value: "44.01" },
          ],
          defaultValue: "28.97",
        },
      ],
      calculate: (inputs) => {
        const M1 = parseFloat(inputs.m1 as string);
        const M2 = parseFloat(inputs.reference as string);
        if (isNaN(M1) || isNaN(M2) || M1 <= 0 || M2 <= 0) return null;

        const rateRatio = Math.sqrt(M2 / M1);
        const R = 8.314;
        const T = 298;
        const vrms1 = Math.sqrt((3 * R * T) / (M1 / 1000));
        const vrms2 = Math.sqrt((3 * R * T) / (M2 / 1000));

        const timeRatio = 1 / rateRatio; // time proportional to 1/rate

        return {
          primary: { label: "Rate Ratio (yours/ref)", value: formatNumber(rateRatio, 4) },
          details: [
            { label: "Your Gas Molar Mass", value: `${formatNumber(M1, 3)} g/mol` },
            { label: "Reference Gas Molar Mass", value: `${formatNumber(M2, 3)} g/mol` },
            { label: "Rate Ratio", value: formatNumber(rateRatio, 4) },
            { label: "Time Ratio (yours/ref)", value: formatNumber(timeRatio, 4) },
            { label: "Your Gas v_rms (298 K)", value: `${formatNumber(vrms1, 1)} m/s` },
            { label: "Reference v_rms (298 K)", value: `${formatNumber(vrms2, 1)} m/s` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["adiabatic-process-calculator", "isothermal-process-calculator", "density-calculator"],
  faq: [
    { question: "What is Graham's law of effusion?", answer: "Graham's law states that the rate of effusion (or diffusion) of a gas is inversely proportional to the square root of its molar mass: rate₁/rate₂ = √(M₂/M₁). Lighter gases move faster and diffuse more quickly." },
    { question: "What is the difference between diffusion and effusion?", answer: "Effusion is the escape of gas molecules through a tiny hole into a vacuum. Diffusion is the gradual mixing of gases. Graham's law applies rigorously to effusion but provides a good approximation for diffusion as well." },
    { question: "How was Graham's law used historically?", answer: "Graham's law was used in the Manhattan Project to separate uranium isotopes (U-235 and U-238) as UF₆ gas. The slight mass difference (349 vs 352 g/mol) required thousands of effusion stages to achieve enrichment." },
  ],
  formula: "rate₁/rate₂ = √(M₂/M₁) | v_rms = √(3RT/M) | M_unknown = M_known / (rate ratio)²",
};
