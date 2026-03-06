import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gelBandSizeEstimatorCalculator: CalculatorDefinition = {
  slug: "gel-band-size-estimator",
  title: "Gel Electrophoresis Band Size Estimator",
  description: "Estimate DNA or protein band molecular weight from gel electrophoresis migration distance using a standard curve from known molecular weight markers.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["gel electrophoresis","band size estimation","dna gel calculator","molecular weight marker","gel migration distance"],
  variants: [{
    id: "standard",
    name: "Gel Electrophoresis Band Size Estimator",
    description: "Estimate DNA or protein band molecular weight from gel electrophoresis migration distance using a standard curve from known molecular weight markers.",
    fields: [
      { name: "marker1Size", label: "Marker Band 1 Size (bp or kDa)", type: "number", min: 1, max: 100000, defaultValue: 1000 },
      { name: "marker1Dist", label: "Marker 1 Migration (mm)", type: "number", min: 1, max: 200, defaultValue: 30 },
      { name: "marker2Size", label: "Marker Band 2 Size (bp or kDa)", type: "number", min: 1, max: 100000, defaultValue: 5000 },
      { name: "marker2Dist", label: "Marker 2 Migration (mm)", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "sampleDist", label: "Sample Band Migration (mm)", type: "number", min: 1, max: 200, defaultValue: 20 },
    ],
    calculate: (inputs) => {
    const marker1Size = inputs.marker1Size as number;
    const marker1Dist = inputs.marker1Dist as number;
    const marker2Size = inputs.marker2Size as number;
    const marker2Dist = inputs.marker2Dist as number;
    const sampleDist = inputs.sampleDist as number;
    const logSize1 = Math.log10(marker1Size);
    const logSize2 = Math.log10(marker2Size);
    const slope = (logSize2 - logSize1) / (marker2Dist - marker1Dist);
    const intercept = logSize1 - slope * marker1Dist;
    const logSampleSize = slope * sampleDist + intercept;
    const sampleSize = Math.pow(10, logSampleSize);
    const rSquared = 1;
    return {
      primary: { label: "Estimated Size", value: formatNumber(Math.round(sampleSize)) },
      details: [
        { label: "Log10(Size)", value: formatNumber(Math.round(logSampleSize * 1000) / 1000) },
        { label: "Slope (log/mm)", value: formatNumber(Math.round(slope * 10000) / 10000) },
        { label: "Y-Intercept", value: formatNumber(Math.round(intercept * 1000) / 1000) },
        { label: "Calibration Points", value: "2 markers" }
      ]
    };
  },
  }],
  relatedSlugs: ["dna-concentration-calculator","pcr-cycle-number-calculator","ligation-ratio-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "log10(Size) = Slope x Distance + Intercept
Slope = (log(Size2) - log(Size1)) / (Dist2 - Dist1)
Estimated Size = 10^(log10(Size))",
};
