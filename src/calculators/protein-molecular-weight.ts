import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const proteinMolecularWeightCalculator: CalculatorDefinition = {
  slug: "protein-molecular-weight-calculator",
  title: "Protein Molecular Weight Calculator",
  description:
    "Free protein molecular weight calculator. Estimate the molecular weight of a protein from its amino acid count or average residue weight.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "protein molecular weight",
    "amino acid",
    "daltons",
    "kilodaltons",
    "polypeptide",
    "protein size",
  ],
  variants: [
    {
      id: "from-amino-acids",
      name: "From Amino Acid Count",
      description: "Estimate MW from number of amino acid residues",
      fields: [
        {
          name: "residues",
          label: "Number of Amino Acid Residues",
          type: "number",
          placeholder: "e.g. 350",
          min: 1,
        },
        {
          name: "avgWeight",
          label: "Average Residue Weight (Da)",
          type: "number",
          placeholder: "e.g. 110",
          defaultValue: 110,
          min: 50,
          max: 200,
        },
      ],
      calculate: (inputs) => {
        const residues = inputs.residues as number;
        const avgWeight = inputs.avgWeight as number;
        if (!residues || residues <= 0 || !avgWeight) return null;

        const mw = residues * avgWeight + 18.02; // +18 for water
        const kDa = mw / 1000;

        return {
          primary: {
            label: "Molecular Weight",
            value: formatNumber(mw, 1) + " Da",
          },
          details: [
            { label: "Kilodaltons (kDa)", value: formatNumber(kDa, 2) },
            { label: "Amino acid residues", value: String(residues) },
            { label: "Average residue weight", value: formatNumber(avgWeight, 1) + " Da" },
            {
              label: "Estimated gene length (bp)",
              value: formatNumber(residues * 3, 0),
            },
            {
              label: "Estimated mRNA length (nt)",
              value: formatNumber(residues * 3, 0),
            },
          ],
        };
      },
    },
    {
      id: "from-gene-length",
      name: "From Gene/CDS Length",
      description: "Estimate protein MW from coding sequence length in base pairs",
      fields: [
        {
          name: "bpLength",
          label: "Coding Sequence Length (bp)",
          type: "number",
          placeholder: "e.g. 1050",
          min: 3,
        },
      ],
      calculate: (inputs) => {
        const bp = inputs.bpLength as number;
        if (!bp || bp < 3) return null;

        const residues = Math.floor(bp / 3);
        const avgWeight = 110;
        const mw = residues * avgWeight + 18.02;
        const kDa = mw / 1000;

        return {
          primary: {
            label: "Estimated Protein MW",
            value: formatNumber(mw, 1) + " Da",
          },
          details: [
            { label: "Kilodaltons (kDa)", value: formatNumber(kDa, 2) },
            { label: "Estimated amino acids", value: String(residues) },
            { label: "Coding sequence", value: bp + " bp" },
            { label: "Average residue weight used", value: "110 Da" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "dna-molecular-weight-calculator",
    "enzyme-activity-calculator",
    "michaelis-menten-calculator",
  ],
  faq: [
    {
      question: "How do you estimate protein molecular weight?",
      answer:
        "Multiply the number of amino acid residues by the average residue molecular weight (~110 Da, which accounts for the loss of water during peptide bond formation) and add 18 Da for the terminal water molecule. A more precise calculation uses the specific weight of each amino acid.",
    },
    {
      question: "What is the average molecular weight of an amino acid?",
      answer:
        "The average molecular weight of an amino acid residue in a protein is approximately 110 Da (or 128 Da for the free amino acid before peptide bond formation). The exact value depends on the amino acid composition.",
    },
  ],
  formula:
    "MW ≈ (Number of residues × Average residue MW) + 18.02 Da. Average residue MW ≈ 110 Da. Gene length (bp) ÷ 3 = number of amino acids.",
};
