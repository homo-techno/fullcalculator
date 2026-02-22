import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const annealingTemperatureCalculator: CalculatorDefinition = {
  slug: "annealing-temperature-calculator",
  title: "PCR Annealing Temperature Calculator",
  description:
    "Free PCR annealing temperature calculator. Determine the optimal annealing temperature from primer Tm values for successful PCR amplification.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "annealing temperature",
    "PCR",
    "primer Tm",
    "touchdown PCR",
    "amplification",
    "thermal cycling",
  ],
  variants: [
    {
      id: "from-tm",
      name: "From Primer Tm Values",
      description: "Calculate annealing temperature from forward and reverse primer Tm",
      fields: [
        {
          name: "tmForward",
          label: "Forward Primer Tm (°C)",
          type: "number",
          placeholder: "e.g. 58",
          min: 0,
          max: 100,
        },
        {
          name: "tmReverse",
          label: "Reverse Primer Tm (°C)",
          type: "number",
          placeholder: "e.g. 62",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const tmF = inputs.tmForward as number;
        const tmR = inputs.tmReverse as number;
        if (tmF == null || tmR == null) return null;

        const lowerTm = Math.min(tmF, tmR);
        const higherTm = Math.max(tmF, tmR);
        const avgTm = (tmF + tmR) / 2;
        const tmDiff = Math.abs(tmF - tmR);

        // Standard rule: Ta = lowest Tm - 5°C
        const taStandard = lowerTm - 5;
        // Alternative: Ta = average Tm - 5°C
        const taAvg = avgTm - 5;
        // Touchdown range
        const touchdownHigh = higherTm;
        const touchdownLow = lowerTm - 5;

        return {
          primary: {
            label: "Recommended Annealing Temp",
            value: formatNumber(taStandard, 1) + " °C",
          },
          details: [
            { label: "Alternative (Avg Tm - 5)", value: formatNumber(taAvg, 1) + " °C" },
            { label: "Forward Primer Tm", value: formatNumber(tmF, 1) + " °C" },
            { label: "Reverse Primer Tm", value: formatNumber(tmR, 1) + " °C" },
            { label: "Average Tm", value: formatNumber(avgTm, 1) + " °C" },
            { label: "Tm difference", value: formatNumber(tmDiff, 1) + " °C" },
            {
              label: "Touchdown range",
              value: `${formatNumber(touchdownHigh, 1)} → ${formatNumber(touchdownLow, 1)} °C`,
            },
            {
              label: "Warning",
              value:
                tmDiff > 5
                  ? "Tm difference > 5°C — consider redesigning primers"
                  : "Tm difference acceptable",
            },
          ],
        };
      },
    },
    {
      id: "from-composition",
      name: "From Primer Composition",
      description: "Estimate annealing temperature from primer length and GC content",
      fields: [
        {
          name: "lengthF",
          label: "Forward Primer Length (nt)",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
        },
        {
          name: "gcF",
          label: "Forward Primer GC (%)",
          type: "number",
          placeholder: "e.g. 50",
          min: 0,
          max: 100,
        },
        {
          name: "lengthR",
          label: "Reverse Primer Length (nt)",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
        },
        {
          name: "gcR",
          label: "Reverse Primer GC (%)",
          type: "number",
          placeholder: "e.g. 55",
          min: 0,
          max: 100,
        },
      ],
      calculate: (inputs) => {
        const lenF = inputs.lengthF as number;
        const gcF = inputs.gcF as number;
        const lenR = inputs.lengthR as number;
        const gcR = inputs.gcR as number;
        if (!lenF || !lenR || gcF == null || gcR == null) return null;

        const calcTm = (len: number, gc: number) => {
          const gcBases = Math.round((gc / 100) * len);
          const atBases = len - gcBases;
          if (len < 14) return 2 * atBases + 4 * gcBases;
          return 64.9 + 41 * ((gcBases - 16.4) / len);
        };

        const tmF = calcTm(lenF, gcF);
        const tmR = calcTm(lenR, gcR);
        const lowerTm = Math.min(tmF, tmR);
        const ta = lowerTm - 5;

        return {
          primary: {
            label: "Recommended Annealing Temp",
            value: formatNumber(ta, 1) + " °C",
          },
          details: [
            { label: "Forward Primer Tm", value: formatNumber(tmF, 1) + " °C" },
            { label: "Reverse Primer Tm", value: formatNumber(tmR, 1) + " °C" },
            { label: "Tm difference", value: formatNumber(Math.abs(tmF - tmR), 1) + " °C" },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "pcr-primer-calculator",
    "dna-concentration-calculator",
    "dna-molecular-weight-calculator",
  ],
  faq: [
    {
      question: "How do you determine annealing temperature?",
      answer:
        "The standard guideline is to set the annealing temperature 5°C below the lowest Tm of your primer pair. This ensures both primers bind efficiently while minimizing non-specific binding.",
    },
    {
      question: "What is touchdown PCR?",
      answer:
        "Touchdown PCR starts with a high annealing temperature (near the higher Tm) and gradually decreases it over successive cycles. This increases specificity in early cycles and ensures efficient amplification in later cycles.",
    },
    {
      question: "What if my primers have very different Tm values?",
      answer:
        "If the Tm difference exceeds 5°C, consider redesigning one or both primers to bring them closer together. Large Tm differences can lead to inefficient PCR with non-specific products.",
    },
  ],
  formula:
    "Ta = Lowest Tm − 5 °C. Alternative: Ta = (Tm_forward + Tm_reverse) / 2 − 5 °C. Touchdown PCR: start at higher Tm, decrease by 1°C per cycle to (lowest Tm − 5°C).",
};
