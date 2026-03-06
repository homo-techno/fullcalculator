import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fluorescenceQuenchingCalculator: CalculatorDefinition = {
  slug: "fluorescence-quenching-calculator",
  title: "Fluorescence Quenching Calculator (Stern-Volmer)",
  description: "Analyze fluorescence quenching data using the Stern-Volmer equation to determine quenching constants and binding parameters for molecular interaction studies.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["stern-volmer","fluorescence quenching","quenching constant","ksv calculator","fluorescence binding"],
  variants: [{
    id: "standard",
    name: "Fluorescence Quenching (Stern-Volmer)",
    description: "Analyze fluorescence quenching data using the Stern-Volmer equation to determine quenching constants and binding parameters for molecular interaction studies.",
    fields: [
      { name: "f0", label: "Fluorescence Without Quencher (F0)", type: "number", min: 1, max: 100000, defaultValue: 10000 },
      { name: "f", label: "Fluorescence With Quencher (F)", type: "number", min: 1, max: 100000, defaultValue: 6000 },
      { name: "quencherConc", label: "Quencher Concentration (M)", type: "number", min: 0.0000001, max: 1, defaultValue: 0.001 },
      { name: "temperature", label: "Temperature (K)", type: "number", min: 273, max: 373, defaultValue: 298 },
    ],
    calculate: (inputs) => {
    const f0 = inputs.f0 as number;
    const f = inputs.f as number;
    const quencherConc = inputs.quencherConc as number;
    const temperature = inputs.temperature as number;
    const ratio = f0 / f;
    const ksv = (ratio - 1) / quencherConc;
    const quenchPercent = ((f0 - f) / f0) * 100;
    const kq = ksv / 1e-8;
    var mechanism = "Static quenching likely";
    if (kq > 2e10) { mechanism = "Dynamic quenching likely"; }
    return {
      primary: { label: "Stern-Volmer Constant (Ksv)", value: formatNumber(Math.round(ksv)) + " M-1" },
      details: [
        { label: "F0/F Ratio", value: formatNumber(Math.round(ratio * 1000) / 1000) },
        { label: "Quenching Percentage", value: formatNumber(Math.round(quenchPercent * 10) / 10) + "%" },
        { label: "Bimolecular Rate (Kq)", value: formatNumber(Math.round(kq)) + " M-1s-1" },
        { label: "Likely Mechanism", value: mechanism }
      ]
    };
  },
  }],
  relatedSlugs: ["spectrophotometer-calculator","molarity-calculator","bradford-assay-protein-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "F0/F = 1 + Ksv[Q]; Ksv = (F0/F - 1) / [Q]; Kq = Ksv / tau0; where tau0 ~ 10^-8 s (typical fluorescence lifetime)",
};
