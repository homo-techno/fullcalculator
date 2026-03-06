import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plasmidCopyNumberCalculator: CalculatorDefinition = {
  slug: "plasmid-copy-number-calculator",
  title: "Plasmid Copy Number Calculator",
  description: "Estimate plasmid copy number per cell from qPCR or gel densitometry data by comparing plasmid DNA signal to chromosomal DNA reference signal.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["plasmid copy number","copy number calculation","plasmid quantification","gene dosage","vector copy number"],
  variants: [{
    id: "standard",
    name: "Plasmid Copy Number",
    description: "Estimate plasmid copy number per cell from qPCR or gel densitometry data by comparing plasmid DNA signal to chromosomal DNA reference signal.",
    fields: [
      { name: "plasmidCt", label: "Plasmid Gene Ct Value", type: "number", min: 5, max: 45, defaultValue: 15 },
      { name: "chromCt", label: "Chromosomal Gene Ct Value", type: "number", min: 5, max: 45, defaultValue: 22 },
      { name: "efficiency", label: "PCR Efficiency (%)", type: "number", min: 80, max: 110, defaultValue: 95 },
      { name: "chromCopyNum", label: "Chromosomal Gene Copies Per Genome", type: "number", min: 1, max: 10, defaultValue: 1 },
    ],
    calculate: (inputs) => {
    const plasmidCt = inputs.plasmidCt as number;
    const chromCt = inputs.chromCt as number;
    const efficiency = inputs.efficiency as number;
    const chromCopyNum = inputs.chromCopyNum as number;
    const eff = 1 + (efficiency / 100);
    const deltaCt = chromCt - plasmidCt;
    const copyNumber = Math.pow(eff, deltaCt) * chromCopyNum;
    const log2Copy = Math.log2(copyNumber);
    var copyRange = "Low copy (1-20)";
    if (copyNumber > 20 && copyNumber <= 100) { copyRange = "Medium copy (20-100)"; }
    if (copyNumber > 100 && copyNumber <= 500) { copyRange = "High copy (100-500)"; }
    if (copyNumber > 500) { copyRange = "Very high copy (>500)"; }
    return {
      primary: { label: "Plasmid Copy Number", value: formatNumber(Math.round(copyNumber)) + " copies/cell" },
      details: [
        { label: "Delta Ct", value: formatNumber(Math.round(deltaCt * 100) / 100) },
        { label: "Log2 Copy Number", value: formatNumber(Math.round(log2Copy * 100) / 100) },
        { label: "Copy Range Category", value: copyRange },
        { label: "PCR Efficiency Factor", value: formatNumber(Math.round(eff * 1000) / 1000) }
      ]
    };
  },
  }],
  relatedSlugs: ["qpcr-fold-change-calculator","pcr-cycle-number-calculator","dna-concentration-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Copy Number = E^(Ct_chrom - Ct_plasmid) x Chromosomal Copies
where E = 1 + (Efficiency/100)
Delta Ct = Ct(chromosomal) - Ct(plasmid)",
};
