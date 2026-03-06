import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const harmonicDistortionCalculator: CalculatorDefinition = {
  slug: "harmonic-distortion-calculator",
  title: "Harmonic Distortion Calculator",
  description: "Calculate total harmonic distortion (THD) in electrical systems from nonlinear loads such as VFDs, UPS systems, and LED lighting to assess power quality issues.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["harmonic distortion","THD calculator","power quality harmonics","electrical harmonics analysis"],
  variants: [{
    id: "standard",
    name: "Harmonic Distortion",
    description: "Calculate total harmonic distortion (THD) in electrical systems from nonlinear loads such as VFDs, UPS systems, and LED lighting to assess power quality issues.",
    fields: [
      { name: "fundamentalCurrent", label: "Fundamental Current (A)", type: "number", min: 1, max: 2000, defaultValue: 100 },
      { name: "thirdHarmonic", label: "3rd Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 30 },
      { name: "fifthHarmonic", label: "5th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 20 },
      { name: "seventhHarmonic", label: "7th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 14 },
      { name: "eleventhHarmonic", label: "11th Harmonic (%)", type: "number", min: 0, max: 100, defaultValue: 9 },
    ],
    calculate: (inputs) => {
    const i1 = inputs.fundamentalCurrent as number;
    const h3 = inputs.thirdHarmonic as number / 100;
    const h5 = inputs.fifthHarmonic as number / 100;
    const h7 = inputs.seventhHarmonic as number / 100;
    const h11 = inputs.eleventhHarmonic as number / 100;
    const thd = Math.sqrt(h3 * h3 + h5 * h5 + h7 * h7 + h11 * h11) * 100;
    const totalRMS = i1 * Math.sqrt(1 + h3 * h3 + h5 * h5 + h7 * h7 + h11 * h11);
    const neutralCurrent = i1 * h3 * 3;
    const kFactor = 1 + (h3 * h3 * 9 + h5 * h5 * 25 + h7 * h7 * 49 + h11 * h11 * 121);
    const status = thd <= 5 ? "Excellent (IEEE 519 compliant)" : thd <= 8 ? "Acceptable" : thd <= 20 ? "High - consider filtering" : "Excessive - requires filtering";
    return {
      primary: { label: "Total Harmonic Distortion", value: formatNumber(Math.round(thd * 10) / 10) + "%" },
      details: [
        { label: "Total RMS Current", value: formatNumber(Math.round(totalRMS * 10) / 10) + " A" },
        { label: "Neutral Current (3-phase)", value: formatNumber(Math.round(neutralCurrent * 10) / 10) + " A" },
        { label: "K-Factor", value: formatNumber(Math.round(kFactor * 10) / 10) },
        { label: "Status", value: status }
      ]
    };
  },
  }],
  relatedSlugs: ["power-factor-correction-calculator","transformer-sizing-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "THD = sqrt(H3^2 + H5^2 + H7^2 + H11^2) x 100
Total RMS = I1 x sqrt(1 + H3^2 + H5^2 + H7^2 + H11^2)
Neutral Current = I1 x H3 x 3 (triplen harmonics)
K-Factor = 1 + sum(Hn^2 x n^2)",
};
