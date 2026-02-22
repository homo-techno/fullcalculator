import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bondOrderCalculator: CalculatorDefinition = {
  slug: "bond-order-calculator",
  title: "Bond Order Calculator",
  description: "Free bond order calculator. Calculate bond order from molecular orbital theory (bonding and antibonding electrons) or look up common diatomic molecules.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["bond order", "molecular orbital", "bonding electrons", "antibonding", "MO theory"],
  variants: [
    {
      id: "from-electrons",
      name: "From MO Electrons",
      fields: [
        { name: "bondingElectrons", label: "Bonding Electrons", type: "number", placeholder: "e.g. 8", min: 0, step: 1 },
        { name: "antibondingElectrons", label: "Antibonding Electrons", type: "number", placeholder: "e.g. 4", min: 0, step: 1 },
      ],
      calculate: (inputs) => {
        const bonding = inputs.bondingElectrons as number;
        const antibonding = inputs.antibondingElectrons as number;
        if (bonding === undefined || antibonding === undefined || bonding < 0 || antibonding < 0) return null;
        const bondOrder = (bonding - antibonding) / 2;
        let bondType = "No bond";
        if (bondOrder >= 2.5) bondType = "Between triple and quadruple bond";
        else if (bondOrder === 3) bondType = "Triple bond";
        else if (bondOrder >= 1.5 && bondOrder < 2.5) bondType = "Between double and triple bond";
        else if (bondOrder === 2) bondType = "Double bond";
        else if (bondOrder >= 0.5 && bondOrder < 1.5) bondType = "Between single and double bond";
        else if (bondOrder === 1) bondType = "Single bond";
        else if (bondOrder > 0) bondType = "Partial bond";
        const stable = bondOrder > 0 ? "Stable (bond order > 0)" : "Unstable (bond order ≤ 0)";
        const magnetic = (bonding + antibonding) % 2 !== 0 ? "Paramagnetic (unpaired electrons)" : "Check orbital diagram";
        return {
          primary: { label: "Bond Order", value: formatNumber(bondOrder, 1) },
          details: [
            { label: "Bonding Electrons", value: `${bonding}` },
            { label: "Antibonding Electrons", value: `${antibonding}` },
            { label: "Bond Type", value: bondType },
            { label: "Stability", value: stable },
            { label: "Magnetism", value: magnetic },
          ],
          note: "Bond Order = (bonding e⁻ - antibonding e⁻) / 2. Higher bond order = shorter, stronger bond.",
        };
      },
    },
    {
      id: "diatomic",
      name: "Common Diatomic Molecules",
      fields: [
        {
          name: "molecule",
          label: "Diatomic Molecule",
          type: "select",
          options: [
            { label: "H₂ (2 e⁻)", value: "2,0,H2" },
            { label: "He₂ (4 e⁻)", value: "2,2,He2" },
            { label: "Li₂ (6 e⁻)", value: "4,2,Li2" },
            { label: "B₂ (10 e⁻)", value: "6,4,B2" },
            { label: "C₂ (12 e⁻)", value: "8,4,C2" },
            { label: "N₂ (14 e⁻)", value: "10,4,N2" },
            { label: "O₂ (16 e⁻)", value: "10,6,O2" },
            { label: "F₂ (18 e⁻)", value: "10,8,F2" },
            { label: "Ne₂ (20 e⁻)", value: "10,10,Ne2" },
            { label: "NO (15 e⁻)", value: "10,5,NO" },
            { label: "CO (14 e⁻)", value: "10,4,CO" },
          ],
        },
      ],
      calculate: (inputs) => {
        const molStr = inputs.molecule as string;
        if (!molStr) return null;
        const parts = molStr.split(",");
        const bonding = parseInt(parts[0], 10);
        const antibonding = parseInt(parts[1], 10);
        const name = parts[2];
        const bondOrder = (bonding - antibonding) / 2;
        const totalE = bonding + antibonding;
        let bondType = "No bond";
        if (bondOrder === 3) bondType = "Triple bond";
        else if (bondOrder === 2) bondType = "Double bond";
        else if (bondOrder === 1) bondType = "Single bond";
        else if (bondOrder === 0) bondType = "No bond (unstable)";
        else bondType = `Bond order ${formatNumber(bondOrder, 1)}`;
        return {
          primary: { label: `Bond Order of ${name}`, value: formatNumber(bondOrder, 1) },
          details: [
            { label: "Bonding Electrons", value: `${bonding}` },
            { label: "Antibonding Electrons", value: `${antibonding}` },
            { label: "Total Electrons", value: `${totalE}` },
            { label: "Bond Type", value: bondType },
            { label: "Exists?", value: bondOrder > 0 ? "Yes" : "No (unstable)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["molecular-geometry-calculator", "hybridization-calculator", "electron-configuration-calculator"],
  faq: [
    { question: "What is bond order?", answer: "Bond order is half the difference between the number of bonding and antibonding electrons in molecular orbital theory: BO = (bonding - antibonding) / 2. A bond order of 1 = single bond, 2 = double bond, 3 = triple bond. Zero or negative means the molecule is unstable." },
    { question: "Why is O₂ paramagnetic?", answer: "O₂ has bond order 2 but its MO diagram shows two unpaired electrons in the π*2p antibonding orbitals. This makes O₂ paramagnetic, which MO theory correctly predicts but Lewis structures do not." },
  ],
  formula: "Bond Order = (bonding electrons - antibonding electrons) / 2",
};
