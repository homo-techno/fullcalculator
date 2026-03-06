import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sewingPatternSizingCalculator: CalculatorDefinition = {
  slug: "sewing-pattern-sizing-calculator",
  title: "Sewing Pattern Sizing Calculator",
  description: "Determine your sewing pattern size and adjustments needed based on body measurements and ease preferences.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["sewing pattern size","pattern sizing","sewing measurements","garment ease"],
  variants: [{
    id: "standard",
    name: "Sewing Pattern Sizing",
    description: "Determine your sewing pattern size and adjustments needed based on body measurements and ease preferences.",
    fields: [
      { name: "bust", label: "Bust Measurement (inches)", type: "number", min: 28, max: 60, defaultValue: 36 },
      { name: "waist", label: "Waist Measurement (inches)", type: "number", min: 22, max: 55, defaultValue: 28 },
      { name: "hip", label: "Hip Measurement (inches)", type: "number", min: 30, max: 60, defaultValue: 38 },
      { name: "ease", label: "Desired Ease", type: "select", options: [{ value: "1", label: "Close-fitting (+1-2 in)" }, { value: "2", label: "Standard (+3-4 in)" }, { value: "3", label: "Loose (+5-6 in)" }, { value: "4", label: "Oversized (+8+ in)" }], defaultValue: "2" },
      { name: "patternType", label: "Pattern Type", type: "select", options: [{ value: "1", label: "Top/Blouse" }, { value: "2", label: "Dress" }, { value: "3", label: "Pants/Skirt" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const bust = inputs.bust as number;
    const waist = inputs.waist as number;
    const hip = inputs.hip as number;
    const ease = parseInt(inputs.ease as string);
    const patternType = parseInt(inputs.patternType as string);
    const easeValues = { 1: 1.5, 2: 3.5, 3: 5.5, 4: 8 };
    const easeAmt = easeValues[ease] || 3.5;
    const bustWithEase = bust + easeAmt;
    const waistWithEase = waist + easeAmt;
    const hipWithEase = hip + easeAmt;
    const sizeChart = [
      { size: 4, bust: 31.5, waist: 23.5, hip: 33.5 },
      { size: 6, bust: 32.5, waist: 24.5, hip: 34.5 },
      { size: 8, bust: 33.5, waist: 25.5, hip: 35.5 },
      { size: 10, bust: 35, waist: 27, hip: 37 },
      { size: 12, bust: 36.5, waist: 28.5, hip: 38.5 },
      { size: 14, bust: 38, waist: 30, hip: 40 },
      { size: 16, bust: 40, waist: 32, hip: 42 },
      { size: 18, bust: 42, waist: 34, hip: 44 },
      { size: 20, bust: 44, waist: 36, hip: 46 }
    ];
    const primary = patternType === 3 ? hip : bust;
    const matchField = patternType === 3 ? "hip" : "bust";
    let bestSize = sizeChart[0];
    for (let i = 0; i < sizeChart.length; i++) {
      if (primary <= sizeChart[i][matchField]) {
        bestSize = sizeChart[i];
        break;
      }
      if (i === sizeChart.length - 1) bestSize = sizeChart[i];
    }
    const bustDiff = Math.round((bust - bestSize.bust) * 10) / 10;
    const waistDiff = Math.round((waist - bestSize.waist) * 10) / 10;
    const hipDiff = Math.round((hip - bestSize.hip) * 10) / 10;
    return {
      primary: { label: "Pattern Size", value: formatNumber(bestSize.size) },
      details: [
        { label: "Bust Adjustment", value: (bustDiff >= 0 ? "+" : "") + formatNumber(bustDiff) + " in" },
        { label: "Waist Adjustment", value: (waistDiff >= 0 ? "+" : "") + formatNumber(waistDiff) + " in" },
        { label: "Hip Adjustment", value: (hipDiff >= 0 ? "+" : "") + formatNumber(hipDiff) + " in" },
        { label: "Ease Added", value: formatNumber(easeAmt) + " inches" }
      ]
    };
  },
  }],
  relatedSlugs: ["quilt-fabric-calculator","fabric-yardage-calculator"],
  faq: [
    { question: "How do I find my sewing pattern size?", answer: "Measure your bust, waist, and hips at the fullest points. Compare to the pattern size chart. For tops, match your bust. For skirts and pants, match your hip measurement." },
    { question: "What is ease in sewing?", answer: "Ease is extra room built into a pattern beyond your body measurements. Wearing ease allows movement. Design ease creates the style silhouette." },
    { question: "What if I am between pattern sizes?", answer: "Cut the larger size and adjust fit during construction. You can also grade between sizes, cutting one size at the bust and another at the hip." },
  ],
  formula: "Pattern Size = Closest size match to primary measurement (bust for tops, hip for bottoms); Adjustments = Body Measurement - Pattern Size Chart Measurement",
};
