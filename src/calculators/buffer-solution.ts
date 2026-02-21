import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bufferSolutionCalculator: CalculatorDefinition = {
  slug: "buffer-solution-calculator",
  title: "Buffer Solution Calculator",
  description: "Free buffer solution calculator. Use the Henderson-Hasselbalch equation to calculate pH of buffer solutions, buffer capacity, and required ratios.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["buffer solution", "Henderson-Hasselbalch", "buffer pH", "pKa", "buffer capacity"],
  variants: [
    {
      id: "acidBuffer",
      name: "Acidic Buffer pH",
      description: "Henderson-Hasselbalch for weak acid + conjugate base",
      fields: [
        { name: "pka", label: "pKa of Weak Acid", type: "number", placeholder: "e.g. 4.76 (acetic acid)" },
        { name: "concAcid", label: "Concentration of Acid (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "concBase", label: "Concentration of Conjugate Base (M)", type: "number", placeholder: "e.g. 0.1" },
      ],
      calculate: (inputs) => {
        const pka = inputs.pka as number, cA = inputs.concAcid as number, cB = inputs.concBase as number;
        if (pka === undefined || !cA || !cB || cA <= 0 || cB <= 0) return null;
        const pH = pka + Math.log10(cB / cA);
        const pOH = 14 - pH;
        const ratio = cB / cA;
        const bufferCapacity = 2.303 * cA * cB / (cA + cB);
        return {
          primary: { label: "Buffer pH", value: formatNumber(pH, 4) },
          details: [
            { label: "pKa", value: formatNumber(pka, 4) },
            { label: "pOH", value: formatNumber(pOH, 4) },
            { label: "[A⁻]/[HA] Ratio", value: formatNumber(ratio, 4) },
            { label: "Buffer Capacity (approx)", value: `${formatNumber(bufferCapacity, 4)} M` },
          ],
          note: "Effective buffer range: pKa ± 1 pH unit. Maximum buffer capacity at pH = pKa (when [A⁻] = [HA]).",
        };
      },
    },
    {
      id: "basicBuffer",
      name: "Basic Buffer pH",
      description: "Henderson-Hasselbalch for weak base + conjugate acid",
      fields: [
        { name: "pkb", label: "pKb of Weak Base", type: "number", placeholder: "e.g. 4.74 (ammonia)" },
        { name: "concBase", label: "Concentration of Base (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "concAcid", label: "Concentration of Conjugate Acid (M)", type: "number", placeholder: "e.g. 0.1" },
      ],
      calculate: (inputs) => {
        const pkb = inputs.pkb as number, cB = inputs.concBase as number, cA = inputs.concAcid as number;
        if (pkb === undefined || !cB || !cA || cB <= 0 || cA <= 0) return null;
        const pOH = pkb + Math.log10(cA / cB);
        const pH = 14 - pOH;
        const pka = 14 - pkb;
        return {
          primary: { label: "Buffer pH", value: formatNumber(pH, 4) },
          details: [
            { label: "pOH", value: formatNumber(pOH, 4) },
            { label: "pKb", value: formatNumber(pkb, 4) },
            { label: "pKa (conjugate acid)", value: formatNumber(pka, 4) },
            { label: "[BH⁺]/[B] Ratio", value: formatNumber(cA / cB, 4) },
          ],
        };
      },
    },
    {
      id: "targetPH",
      name: "Ratio for Target pH",
      description: "Find the [A⁻]/[HA] ratio needed for a desired pH",
      fields: [
        { name: "pka", label: "pKa of Weak Acid", type: "number", placeholder: "e.g. 4.76" },
        { name: "targetPH", label: "Target pH", type: "number", placeholder: "e.g. 5.0", min: 0, max: 14, step: 0.1 },
        { name: "totalConc", label: "Total Buffer Concentration (M)", type: "number", placeholder: "e.g. 0.1" },
      ],
      calculate: (inputs) => {
        const pka = inputs.pka as number, target = inputs.targetPH as number, total = inputs.totalConc as number;
        if (pka === undefined || target === undefined || !total || total <= 0) return null;
        const ratio = Math.pow(10, target - pka);
        const concBase = (total * ratio) / (1 + ratio);
        const concAcid = total - concBase;
        if (concAcid <= 0 || concBase <= 0) return null;
        return {
          primary: { label: "[A⁻]/[HA] Ratio", value: formatNumber(ratio, 4) },
          details: [
            { label: "Target pH", value: formatNumber(target, 2) },
            { label: "pKa", value: formatNumber(pka, 4) },
            { label: "[A⁻] Needed", value: `${formatNumber(concBase, 6)} M` },
            { label: "[HA] Needed", value: `${formatNumber(concAcid, 6)} M` },
          ],
          note: ratio > 10 || ratio < 0.1 ? "Warning: ratio is outside the effective buffer range (0.1 to 10). The buffer will have poor capacity." : "This ratio is within the effective buffer range.",
        };
      },
    },
  ],
  relatedSlugs: ["ph-calculator", "titration-calculator", "molarity-calculator"],
  faq: [
    { question: "What is the Henderson-Hasselbalch equation?", answer: "pH = pKa + log([A⁻]/[HA]). It calculates the pH of a buffer solution from the pKa of the weak acid and the ratio of conjugate base to acid concentrations. For basic buffers: pOH = pKb + log([BH⁺]/[B])." },
    { question: "What makes a good buffer?", answer: "A good buffer has: (1) pKa close to the desired pH (within ±1), (2) high concentrations of both acid and conjugate base, (3) equal or near-equal concentrations of acid and base for maximum capacity. Buffer capacity is highest when [A⁻] = [HA]." },
    { question: "What is buffer capacity?", answer: "Buffer capacity is the amount of strong acid or base a buffer can absorb before significant pH change. It is maximized when pH = pKa and increases with total buffer concentration." },
  ],
  formula: "pH = pKa + log([A⁻]/[HA]) | pOH = pKb + log([BH⁺]/[B]) | Buffer range: pKa ± 1",
};
