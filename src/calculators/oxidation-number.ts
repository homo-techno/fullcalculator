import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const oxidationNumberCalculator: CalculatorDefinition = {
  slug: "oxidation-number-calculator",
  title: "Oxidation Number Calculator",
  description: "Free oxidation number calculator. Determine oxidation states of atoms in compounds and ions using standard rules.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["oxidation number", "oxidation state", "redox", "electron transfer", "valence"],
  variants: [
    {
      id: "binaryCompound",
      name: "Find Oxidation Number in Binary Compound",
      description: "Find unknown oxidation state given the other element and overall charge",
      fields: [
        { name: "knownOx", label: "Known Element Oxidation State", type: "number", placeholder: "e.g. -2 for oxygen", step: 1 },
        { name: "knownCount", label: "Number of Known Element Atoms", type: "number", placeholder: "e.g. 3", min: 1, step: 1 },
        { name: "unknownCount", label: "Number of Unknown Element Atoms", type: "number", placeholder: "e.g. 2", min: 1, step: 1 },
        { name: "totalCharge", label: "Total Charge of Compound/Ion", type: "number", placeholder: "0 for neutral, e.g. -2", step: 1, defaultValue: 0 },
      ],
      calculate: (inputs) => {
        const knownOx = inputs.knownOx as number, knownN = inputs.knownCount as number;
        const unknownN = inputs.unknownCount as number, charge = inputs.totalCharge as number;
        if (knownOx === undefined || !knownN || !unknownN || unknownN <= 0) return null;
        const totalCharge = charge || 0;
        const unknownOx = (totalCharge - knownOx * knownN) / unknownN;
        return {
          primary: { label: "Unknown Oxidation Number", value: unknownOx >= 0 ? `+${formatNumber(unknownOx, 0)}` : formatNumber(unknownOx, 0) },
          details: [
            { label: "Known element total", value: `${knownN} × (${knownOx >= 0 ? "+" : ""}${knownOx}) = ${knownOx * knownN >= 0 ? "+" : ""}${knownOx * knownN}` },
            { label: "Unknown element total", value: `${unknownN} × (${unknownOx >= 0 ? "+" : ""}${formatNumber(unknownOx, 0)}) = ${unknownOx * unknownN >= 0 ? "+" : ""}${formatNumber(unknownOx * unknownN, 0)}` },
            { label: "Total Charge", value: `${totalCharge >= 0 ? "+" : ""}${totalCharge}` },
            { label: "Verification", value: `${knownOx * knownN} + ${formatNumber(unknownOx * unknownN, 0)} = ${totalCharge}` },
          ],
        };
      },
    },
    {
      id: "commonElements",
      name: "Common Oxidation States",
      description: "Look up common oxidation states for an element",
      fields: [
        { name: "element", label: "Element", type: "select", options: [
          { label: "Hydrogen (H)", value: "H:+1 (most compounds), -1 (metal hydrides)" },
          { label: "Oxygen (O)", value: "O:-2 (most compounds), -1 (peroxides)" },
          { label: "Fluorine (F)", value: "F:-1 (always)" },
          { label: "Chlorine (Cl)", value: "Cl:-1, +1, +3, +5, +7" },
          { label: "Sodium (Na)", value: "Na:+1 (always in compounds)" },
          { label: "Potassium (K)", value: "K:+1 (always in compounds)" },
          { label: "Calcium (Ca)", value: "Ca:+2 (always in compounds)" },
          { label: "Iron (Fe)", value: "Fe:+2 (ferrous), +3 (ferric)" },
          { label: "Copper (Cu)", value: "Cu:+1 (cuprous), +2 (cupric)" },
          { label: "Nitrogen (N)", value: "N:-3, +3, +5 (and others -2 to +5)" },
          { label: "Sulfur (S)", value: "S:-2, +4, +6" },
          { label: "Carbon (C)", value: "C:-4 to +4" },
          { label: "Manganese (Mn)", value: "Mn:+2, +4, +7" },
          { label: "Chromium (Cr)", value: "Cr:+2, +3, +6" },
        ] },
      ],
      calculate: (inputs) => {
        const el = inputs.element as string;
        if (!el) return null;
        const [symbol, states] = el.split(":");
        return {
          primary: { label: `${symbol} Oxidation States`, value: states.trim() },
          details: [
            { label: "Rule", value: "Sum of oxidation numbers = charge of species" },
            { label: "Free elements", value: "Oxidation state = 0" },
            { label: "Monatomic ions", value: "Oxidation state = ion charge" },
          ],
          note: "Rules priority: F is always -1, O is usually -2 (except peroxides -1), H is +1 with nonmetals and -1 with metals. Group 1 = +1, Group 2 = +2.",
        };
      },
    },
    {
      id: "redoxChange",
      name: "Oxidation State Change (Redox)",
      description: "Determine electrons transferred in a redox reaction",
      fields: [
        { name: "initialOx", label: "Initial Oxidation State", type: "number", placeholder: "e.g. 0", step: 1 },
        { name: "finalOx", label: "Final Oxidation State", type: "number", placeholder: "e.g. +2", step: 1 },
        { name: "numAtoms", label: "Number of Atoms", type: "number", placeholder: "e.g. 1", defaultValue: 1, min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const init = inputs.initialOx as number, final_ = inputs.finalOx as number, n = inputs.numAtoms as number || 1;
        if (init === undefined || final_ === undefined) return null;
        const change = final_ - init;
        const totalElectrons = Math.abs(change) * n;
        const process = change > 0 ? "Oxidation (loss of electrons)" : change < 0 ? "Reduction (gain of electrons)" : "No change";
        return {
          primary: { label: "Process", value: process },
          details: [
            { label: "Change per Atom", value: `${change > 0 ? "+" : ""}${change}` },
            { label: "Electrons Transferred", value: `${totalElectrons} e⁻` },
            { label: "Per Atom", value: `${Math.abs(change)} e⁻ ${change > 0 ? "lost" : change < 0 ? "gained" : ""}` },
            { label: "Direction", value: change > 0 ? "Oxidized (acts as reducing agent)" : change < 0 ? "Reduced (acts as oxidizing agent)" : "Neither" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["electrochemistry-calculator", "molarity-calculator", "ph-calculator"],
  faq: [
    { question: "What are oxidation numbers?", answer: "Oxidation numbers (oxidation states) represent the hypothetical charge an atom would have if all bonds were ionic. They help track electron transfer in redox reactions. Sum of all oxidation numbers = overall charge of the species." },
    { question: "What are the rules for assigning oxidation numbers?", answer: "1) Free elements = 0. 2) Monatomic ions = their charge. 3) F = -1 always. 4) O = -2 (except peroxides -1). 5) H = +1 with nonmetals, -1 with metals. 6) Group 1 metals = +1, Group 2 = +2. 7) Sum = overall charge." },
    { question: "What is the difference between oxidation and reduction?", answer: "Oxidation is loss of electrons (increase in oxidation number). Reduction is gain of electrons (decrease in oxidation number). Remember: OIL RIG (Oxidation Is Loss, Reduction Is Gain) or LEO GER (Lose Electrons Oxidation, Gain Electrons Reduction)." },
  ],
  formula: "Sum of oxidation numbers = charge of species | Oxidation: loss of e⁻ | Reduction: gain of e⁻",
};
