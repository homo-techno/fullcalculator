import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dnaMolecularWeightCalculator: CalculatorDefinition = {
  slug: "dna-molecular-weight-calculator",
  title: "DNA Molecular Weight Calculator",
  description:
    "Free DNA molecular weight calculator. Estimate the molecular weight of single-stranded or double-stranded DNA from its length in base pairs.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "DNA molecular weight",
    "nucleotide weight",
    "base pair",
    "daltons",
    "kilodaltons",
    "molecular biology",
  ],
  variants: [
    {
      id: "from-length",
      name: "From Sequence Length",
      description: "Calculate molecular weight from the number of bases or base pairs",
      fields: [
        {
          name: "length",
          label: "Sequence Length",
          type: "number",
          placeholder: "e.g. 1000",
          min: 1,
        },
        {
          name: "strandType",
          label: "DNA Type",
          type: "select",
          options: [
            { label: "Double-Stranded (dsDNA)", value: "ds" },
            { label: "Single-Stranded (ssDNA)", value: "ss" },
          ],
          defaultValue: "ds",
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const strandType = inputs.strandType as string;
        if (!length || length <= 0) return null;

        const avgNtWeight = 330; // g/mol per nucleotide (average)
        let mw: number;

        if (strandType === "ds") {
          mw = length * 2 * avgNtWeight;
        } else {
          mw = length * avgNtWeight;
        }

        const kDa = mw / 1000;
        const mDa = mw / 1000000;

        return {
          primary: {
            label: "Molecular Weight",
            value: formatNumber(mw, 0) + " Da",
          },
          details: [
            { label: "Kilodaltons (kDa)", value: formatNumber(kDa, 2) },
            { label: "Megadaltons (MDa)", value: formatNumber(mDa, 4) },
            {
              label: "Type",
              value: strandType === "ds" ? "Double-stranded" : "Single-stranded",
            },
            {
              label: "Sequence length",
              value:
                strandType === "ds"
                  ? `${length} bp`
                  : `${length} nt`,
            },
            {
              label: "Average nucleotide MW",
              value: "330 Da",
            },
          ],
        };
      },
    },
    {
      id: "from-composition",
      name: "From Base Composition",
      description: "Calculate molecular weight using exact nucleotide counts",
      fields: [
        {
          name: "countA",
          label: "Number of Adenine (A)",
          type: "number",
          placeholder: "e.g. 250",
          min: 0,
        },
        {
          name: "countT",
          label: "Number of Thymine (T)",
          type: "number",
          placeholder: "e.g. 250",
          min: 0,
        },
        {
          name: "countG",
          label: "Number of Guanine (G)",
          type: "number",
          placeholder: "e.g. 250",
          min: 0,
        },
        {
          name: "countC",
          label: "Number of Cytosine (C)",
          type: "number",
          placeholder: "e.g. 250",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const nA = inputs.countA as number;
        const nT = inputs.countT as number;
        const nG = inputs.countG as number;
        const nC = inputs.countC as number;
        if (nA == null || nT == null || nG == null || nC == null) return null;
        const total = nA + nT + nG + nC;
        if (total === 0) return null;

        // Individual deoxyribonucleotide monophosphate weights (anhydrous)
        const wA = 331.2;
        const wT = 322.2;
        const wG = 347.2;
        const wC = 307.2;

        const mw = nA * wA + nT * wT + nG * wG + nC * wC;
        const kDa = mw / 1000;

        return {
          primary: {
            label: "Molecular Weight (ssDNA)",
            value: formatNumber(mw, 1) + " Da",
          },
          details: [
            { label: "Kilodaltons (kDa)", value: formatNumber(kDa, 2) },
            { label: "dsDNA MW (approx.)", value: formatNumber(mw * 2, 1) + " Da" },
            { label: "Total nucleotides", value: String(total) },
            { label: "GC content", value: formatNumber(((nG + nC) / total) * 100, 1) + "%" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "protein-molecular-weight-calculator",
    "dna-concentration-calculator",
    "pcr-primer-calculator",
  ],
  faq: [
    {
      question: "How do you calculate DNA molecular weight?",
      answer:
        "For a rough estimate, multiply the number of nucleotides by the average nucleotide molecular weight (~330 Da). For dsDNA, multiply by 2 since both strands contribute. A more precise calculation uses exact weights for each base: dAMP=331.2, dTMP=322.2, dGMP=347.2, dCMP=307.2 Da.",
    },
    {
      question: "What units are used for DNA molecular weight?",
      answer:
        "DNA molecular weight is expressed in Daltons (Da), kilodaltons (kDa), or megadaltons (MDa). 1 kDa = 1,000 Da. A 1,000 bp dsDNA fragment weighs roughly 660 kDa.",
    },
  ],
  formula:
    "MW(ssDNA) ≈ N × 330 Da. MW(dsDNA) ≈ N × 2 × 330 Da. Exact: MW = nA×331.2 + nT×322.2 + nG×347.2 + nC×307.2 (for single strand).",
};
