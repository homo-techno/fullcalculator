import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bufferCalculator: CalculatorDefinition = {
  slug: "buffer-calculator",
  title: "Buffer Solution Calculator",
  description: "Calculate the amounts of acid and conjugate base needed to prepare a buffer at a target pH.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["buffer calculator", "buffer preparation", "Henderson-Hasselbalch calculator"],
  variants: [{
    id: "standard",
    name: "Buffer Solution",
    description: "Calculate the amounts of acid and conjugate base needed to prepare a buffer at a target pH",
    fields: [
      { name: "targetpH", label: "Target pH", type: "number", suffix: "pH", min: 1, max: 14, step: 0.1, defaultValue: 7.4 },
      { name: "pKa", label: "pKa of Weak Acid", type: "number", suffix: "pKa", min: 1, max: 14, step: 0.01, defaultValue: 6.86 },
      { name: "totalConcentration", label: "Total Buffer Concentration", type: "number", suffix: "M", min: 0.01, max: 2, step: 0.01, defaultValue: 0.1 },
      { name: "volume", label: "Desired Volume", type: "number", suffix: "mL", min: 10, max: 10000, step: 10, defaultValue: 500 },
    ],
    calculate: (inputs) => {
      const pH = inputs.targetpH as number;
      const pKa = inputs.pKa as number;
      const totalConc = inputs.totalConcentration as number;
      const volume = inputs.volume as number;
      if (!pH || !pKa || !totalConc || !volume) return null;
      const ratio = Math.pow(10, pH - pKa);
      const baseConc = totalConc * ratio / (1 + ratio);
      const acidConc = totalConc - baseConc;
      const baseMoles = baseConc * volume / 1000;
      const acidMoles = acidConc * volume / 1000;
      return {
        primary: { label: "Base to Acid Ratio", value: formatNumber(Math.round(ratio * 100) / 100) + " : 1" },
        details: [
          { label: "Conjugate Base Needed", value: formatNumber(Math.round(baseMoles * 10000) / 10000) + " mol (" + formatNumber(Math.round(baseConc * 1000) / 1000) + " M)" },
          { label: "Weak Acid Needed", value: formatNumber(Math.round(acidMoles * 10000) / 10000) + " mol (" + formatNumber(Math.round(acidConc * 1000) / 1000) + " M)" },
          { label: "Buffer Capacity Range", value: "pH " + formatNumber(Math.round((pKa - 1) * 10) / 10) + " to " + formatNumber(Math.round((pKa + 1) * 10) / 10) },
        ],
      };
    },
  }],
  relatedSlugs: ["dilution-factor-calculator", "titration-calculator"],
  faq: [
    { question: "What is the Henderson-Hasselbalch equation?", answer: "The Henderson-Hasselbalch equation is pH = pKa + log([A-]/[HA]), which relates the pH of a buffer solution to the pKa of the weak acid and the ratio of conjugate base to acid concentrations." },
    { question: "What is buffer capacity?", answer: "Buffer capacity is the ability of a buffer to resist pH changes. A buffer works most effectively within one pH unit above and below the pKa of its weak acid component." },
  ],
  formula: "pH = pKa + log(Base Concentration / Acid Concentration)",
};
