import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const meltingTemperaturePrimerCalculator: CalculatorDefinition = {
  slug: "melting-temperature-primer-calculator",
  title: "Primer Melting Temperature (Tm) Calculator",
  description: "Calculate DNA primer melting temperature using basic, salt-adjusted, and nearest-neighbor methods for PCR primer design and optimization.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["primer tm calculator","melting temperature dna","pcr primer tm","oligonucleotide tm","primer design temperature"],
  variants: [{
    id: "standard",
    name: "Primer Melting Temperature (Tm)",
    description: "Calculate DNA primer melting temperature using basic, salt-adjusted, and nearest-neighbor methods for PCR primer design and optimization.",
    fields: [
      { name: "lengthBp", label: "Primer Length (bp)", type: "number", min: 10, max: 60, defaultValue: 20 },
      { name: "gcCount", label: "Number of G+C Bases", type: "number", min: 0, max: 60, defaultValue: 10 },
      { name: "naConc", label: "Na+ Concentration (mM)", type: "number", min: 10, max: 1000, defaultValue: 50 },
      { name: "primerConc", label: "Primer Concentration (nM)", type: "number", min: 50, max: 5000, defaultValue: 250 },
    ],
    calculate: (inputs) => {
    const lengthBp = inputs.lengthBp as number;
    const gcCount = inputs.gcCount as number;
    const naConc = inputs.naConc as number;
    const primerConc = inputs.primerConc as number;
    const atCount = lengthBp - gcCount;
    const gcPercent = (gcCount / lengthBp) * 100;
    const basicTm = (atCount * 2) + (gcCount * 4);
    const saltTm = 100.5 + (41 * gcCount / lengthBp) - (820 / lengthBp) + 16.6 * Math.log10(naConc / 1000);
    var suggestedAnnealing = saltTm - 5;
    return {
      primary: { label: "Basic Tm", value: formatNumber(Math.round(basicTm * 10) / 10) + " C" },
      details: [
        { label: "Salt-Adjusted Tm", value: formatNumber(Math.round(saltTm * 10) / 10) + " C" },
        { label: "GC Content", value: formatNumber(Math.round(gcPercent * 10) / 10) + "%" },
        { label: "Suggested Annealing Temp", value: formatNumber(Math.round(suggestedAnnealing * 10) / 10) + " C" },
        { label: "A+T / G+C Bases", value: formatNumber(atCount) + " / " + formatNumber(gcCount) }
      ]
    };
  },
  }],
  relatedSlugs: ["pcr-cycle-number-calculator","pcr-primer-calculator","dna-concentration-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Basic Tm = 2(A+T) + 4(G+C); Salt-Adjusted Tm = 100.5 + 41(GC/N) - 820/N + 16.6 x log10([Na+]); Annealing Temp ~ Tm - 5 C",
};
