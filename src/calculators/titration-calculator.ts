import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const titrationCalculator: CalculatorDefinition = {
  slug: "titration-calculator",
  title: "Titration Calculator",
  description: "Free titration calculator. Calculate unknown concentration, equivalence point volume, or moles at endpoint for acid-base and redox titrations.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["titration", "equivalence point", "acid-base titration", "endpoint", "neutralization"],
  variants: [
    {
      id: "unknownConcentration",
      name: "Find Unknown Concentration",
      description: "MaVa = MbVb for acid-base titration",
      fields: [
        { name: "cKnown", label: "Known Concentration (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "vKnown", label: "Known Volume (mL)", type: "number", placeholder: "e.g. 25.0" },
        { name: "vUnknown", label: "Unknown Volume (mL)", type: "number", placeholder: "e.g. 30.5" },
        { name: "nKnown", label: "Stoichiometric Coeff. (known)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "nUnknown", label: "Stoichiometric Coeff. (unknown)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const cK = inputs.cKnown as number, vK = inputs.vKnown as number;
        const vU = inputs.vUnknown as number;
        const nK = (inputs.nKnown as number) || 1, nU = (inputs.nUnknown as number) || 1;
        if (!cK || !vK || !vU || vU <= 0) return null;
        const molesKnown = cK * vK / 1000;
        const molesUnknown = molesKnown * (nU / nK);
        const cUnknown = molesUnknown / (vU / 1000);
        return {
          primary: { label: "Unknown Concentration", value: `${formatNumber(cUnknown, 6)} M` },
          details: [
            { label: "Moles of Titrant", value: `${formatNumber(molesKnown, 6)} mol` },
            { label: "Moles of Analyte", value: `${formatNumber(molesUnknown, 6)} mol` },
            { label: "Stoichiometric Ratio", value: `${nK}:${nU}` },
          ],
        };
      },
    },
    {
      id: "equivalenceVolume",
      name: "Find Equivalence Point Volume",
      description: "Calculate volume of titrant needed to reach equivalence",
      fields: [
        { name: "cAnalyte", label: "Analyte Concentration (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "vAnalyte", label: "Analyte Volume (mL)", type: "number", placeholder: "e.g. 25.0" },
        { name: "cTitrant", label: "Titrant Concentration (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "nAnalyte", label: "Stoichiometric Coeff. (analyte)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
        { name: "nTitrant", label: "Stoichiometric Coeff. (titrant)", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const cA = inputs.cAnalyte as number, vA = inputs.vAnalyte as number;
        const cT = inputs.cTitrant as number;
        const nA = (inputs.nAnalyte as number) || 1, nT = (inputs.nTitrant as number) || 1;
        if (!cA || !vA || !cT || cT <= 0) return null;
        const molesAnalyte = cA * vA / 1000;
        const molesTitrant = molesAnalyte * (nT / nA);
        const vTitrant = (molesTitrant / cT) * 1000;
        return {
          primary: { label: "Titrant Volume at Equivalence", value: `${formatNumber(vTitrant, 4)} mL` },
          details: [
            { label: "Moles of Analyte", value: `${formatNumber(molesAnalyte, 6)} mol` },
            { label: "Moles of Titrant Needed", value: `${formatNumber(molesTitrant, 6)} mol` },
            { label: "Total Solution Volume", value: `${formatNumber(vA + vTitrant, 4)} mL` },
          ],
        };
      },
    },
    {
      id: "backTitration",
      name: "Back Titration",
      description: "Calculate analyte amount from excess reagent titration",
      fields: [
        { name: "cExcess", label: "Excess Reagent Concentration (M)", type: "number", placeholder: "e.g. 0.5" },
        { name: "vExcess", label: "Excess Reagent Volume (mL)", type: "number", placeholder: "e.g. 50.0" },
        { name: "cTitrant", label: "Back-Titrant Concentration (M)", type: "number", placeholder: "e.g. 0.1" },
        { name: "vTitrant", label: "Back-Titrant Volume Used (mL)", type: "number", placeholder: "e.g. 12.5" },
      ],
      calculate: (inputs) => {
        const cE = inputs.cExcess as number, vE = inputs.vExcess as number;
        const cT = inputs.cTitrant as number, vT = inputs.vTitrant as number;
        if (!cE || !vE || !cT || !vT) return null;
        const molesExcess = cE * vE / 1000;
        const molesBackTitrant = cT * vT / 1000;
        const molesReacted = molesExcess - molesBackTitrant;
        if (molesReacted < 0) return null;
        return {
          primary: { label: "Moles Reacted with Analyte", value: `${formatNumber(molesReacted, 6)} mol` },
          details: [
            { label: "Total Moles of Excess Reagent", value: `${formatNumber(molesExcess, 6)} mol` },
            { label: "Moles of Back-Titrant", value: `${formatNumber(molesBackTitrant, 6)} mol` },
            { label: "Moles Unreacted (excess)", value: `${formatNumber(molesBackTitrant, 6)} mol` },
          ],
          note: "Back titration: add known excess reagent, then titrate the unreacted excess. Moles reacted = total moles added - moles back-titrated.",
        };
      },
    },
  ],
  relatedSlugs: ["molarity-calculator", "ph-calculator", "buffer-solution-calculator"],
  faq: [
    { question: "What is titration?", answer: "Titration is a lab technique where a solution of known concentration (titrant) is added to a solution of unknown concentration (analyte) until the reaction is complete (equivalence point). At equivalence: MaVa × na = MbVb × nb." },
    { question: "What is the equivalence point?", answer: "The equivalence point is where stoichiometrically equivalent amounts of acid and base have reacted. For a strong acid + strong base, pH = 7 at equivalence. For weak acid + strong base, pH > 7 due to hydrolysis of the conjugate base." },
    { question: "What is back titration?", answer: "Back titration adds a known excess of reagent to the analyte, then titrates the unreacted excess. Used when the analyte is insoluble, reacts slowly, or when no suitable indicator exists for direct titration." },
  ],
  formula: "M_a × V_a × n_a = M_b × V_b × n_b | Equivalence: moles acid = moles base (adjusted for stoichiometry)",
};
