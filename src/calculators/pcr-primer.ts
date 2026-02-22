import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pcrPrimerCalculator: CalculatorDefinition = {
  slug: "pcr-primer-calculator",
  title: "PCR Primer Tm Calculator",
  description:
    "Free PCR primer melting temperature calculator. Estimate Tm using the basic rule, salt-adjusted method, and nearest-neighbor approximation.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "PCR primer",
    "melting temperature",
    "Tm calculator",
    "oligonucleotide",
    "primer design",
    "annealing temperature",
  ],
  variants: [
    {
      id: "from-composition",
      name: "From Base Composition",
      description: "Calculate Tm from the number of each base in the primer",
      fields: [
        {
          name: "countA",
          label: "Number of A bases",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "countT",
          label: "Number of T bases",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "countG",
          label: "Number of G bases",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "countC",
          label: "Number of C bases",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
        },
        {
          name: "naConc",
          label: "Na+ Concentration (mM)",
          type: "number",
          placeholder: "e.g. 50",
          defaultValue: 50,
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const nA = inputs.countA as number;
        const nT = inputs.countT as number;
        const nG = inputs.countG as number;
        const nC = inputs.countC as number;
        const naMM = inputs.naConc as number;
        if (nA == null || nT == null || nG == null || nC == null) return null;

        const length = nA + nT + nG + nC;
        if (length === 0) return null;

        const gcCount = nG + nC;
        const atCount = nA + nT;
        const gcPercent = (gcCount / length) * 100;

        // Basic formula (Wallace rule, for primers < 14 nt it's less accurate)
        let tmBasic: number;
        if (length < 14) {
          tmBasic = 2 * atCount + 4 * gcCount;
        } else {
          tmBasic = 64.9 + 41 * ((gcCount - 16.4) / length);
        }

        // Salt-adjusted Tm
        const naM = (naMM || 50) / 1000;
        const tmSalt = tmBasic + 16.6 * Math.log10(naM);

        return {
          primary: {
            label: "Melting Temperature (Tm)",
            value: formatNumber(tmBasic, 1) + " °C",
          },
          details: [
            { label: "Salt-adjusted Tm", value: formatNumber(tmSalt, 1) + " °C" },
            { label: "Primer length", value: length + " nt" },
            { label: "GC content", value: formatNumber(gcPercent, 1) + "%" },
            { label: "GC bases", value: String(gcCount) },
            { label: "AT bases", value: String(atCount) },
            { label: "Na+ concentration", value: (naMM || 50) + " mM" },
            {
              label: "Suggested annealing temp",
              value: formatNumber(tmBasic - 5, 1) + " °C",
            },
          ],
        };
      },
    },
    {
      id: "wallace-rule",
      name: "Quick Tm (Wallace Rule)",
      description: "Fast estimate for short primers using the 2+4 rule",
      fields: [
        {
          name: "primerLength",
          label: "Primer Length (nt)",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          max: 50,
        },
        {
          name: "gcContent",
          label: "GC Content (%)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const length = inputs.primerLength as number;
        const gcPct = inputs.gcContent as number;
        if (!length || gcPct == null || length <= 0) return null;

        const gcCount = Math.round((gcPct / 100) * length);
        const atCount = length - gcCount;
        const tmWallace = 2 * atCount + 4 * gcCount;
        const tmLong = 64.9 + 41 * ((gcCount - 16.4) / length);

        return {
          primary: {
            label: "Tm (Wallace Rule)",
            value: formatNumber(tmWallace, 1) + " °C",
          },
          details: [
            { label: "Tm (long primer formula)", value: formatNumber(tmLong, 1) + " °C" },
            { label: "Primer length", value: length + " nt" },
            { label: "GC content", value: formatNumber(gcPct, 1) + "%" },
            { label: "Estimated GC bases", value: String(gcCount) },
            { label: "Estimated AT bases", value: String(atCount) },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "annealing-temperature-calculator",
    "dna-concentration-calculator",
    "dna-molecular-weight-calculator",
  ],
  faq: [
    {
      question: "What is primer Tm?",
      answer:
        "Primer Tm (melting temperature) is the temperature at which 50% of the primer molecules are bound to their complementary strand. It is critical for setting PCR annealing temperatures.",
    },
    {
      question: "What is the Wallace rule?",
      answer:
        "The Wallace rule estimates Tm for short primers (< 14 nt): Tm = 2(A+T) + 4(G+C). For longer primers, the formula Tm = 64.9 + 41×(G+C−16.4)/N is more accurate.",
    },
    {
      question: "How does salt concentration affect Tm?",
      answer:
        "Higher salt (Na+) concentration stabilizes DNA duplexes and increases Tm. The salt-adjusted formula adds 16.6 × log₁₀([Na+]) to the basic Tm.",
    },
  ],
  formula:
    "Short primers (< 14 nt): Tm = 2(A+T) + 4(G+C). Longer primers: Tm = 64.9 + 41×(nGC − 16.4)/N. Salt-adjusted: Tm = Tm_basic + 16.6 × log₁₀([Na+]).",
};
