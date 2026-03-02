import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crochetHookSizeCalculator: CalculatorDefinition = {
  slug: "crochet-hook-size-calculator",
  title: "Crochet Hook Size Calculator",
  description: "Determine the recommended crochet hook size based on yarn weight, gauge swatch measurements, and desired fabric density.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crochet hook size","crochet gauge","hook recommendation","crochet calculator"],
  variants: [{
    id: "standard",
    name: "Crochet Hook Size",
    description: "Determine the recommended crochet hook size based on yarn weight, gauge swatch measurements, and desired fabric density.",
    fields: [
      { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [{ value: "1", label: "Lace (0)" }, { value: "2", label: "Fingering (1)" }, { value: "3", label: "Sport (2)" }, { value: "4", label: "DK (3)" }, { value: "5", label: "Worsted (4)" }, { value: "6", label: "Bulky (5)" }, { value: "7", label: "Super Bulky (6)" }], defaultValue: "5" },
      { name: "swatchStitches", label: "Stitches in 4-inch Swatch", type: "number", min: 4, max: 40, defaultValue: 16 },
      { name: "targetStitches", label: "Target Stitches per 4 inches", type: "number", min: 4, max: 40, defaultValue: 16 },
      { name: "density", label: "Desired Fabric Feel", type: "select", options: [{ value: "1", label: "Tight/Dense" }, { value: "2", label: "Standard" }, { value: "3", label: "Loose/Drapey" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const yarnWeight = parseInt(inputs.yarnWeight as string);
    const swatchSt = inputs.swatchStitches as number;
    const targetSt = inputs.targetStitches as number;
    const density = parseInt(inputs.density as string);
    const baseHookMm = { 1: 2.0, 2: 2.75, 3: 3.5, 4: 4.0, 5: 5.0, 6: 6.5, 7: 9.0 };
    const baseMm = baseHookMm[yarnWeight] || 5.0;
    const gaugeAdj = (swatchSt - targetSt) * 0.25;
    const densityAdj = density === 1 ? -0.5 : density === 3 ? 0.5 : 0;
    const hookMm = Math.round((baseMm + gaugeAdj + densityAdj) * 4) / 4;
    const usLetters = { 2.0: "B/1", 2.25: "B/1", 2.75: "C/2", 3.25: "D/3", 3.5: "E/4", 3.75: "F/5", 4.0: "G/6", 4.5: "7", 5.0: "H/8", 5.5: "I/9", 6.0: "J/10", 6.5: "K/10.5", 8.0: "L/11", 9.0: "M/13", 10.0: "N/15" };
    const closest = Object.keys(usLetters).map(Number).reduce((a, b) => Math.abs(b - hookMm) < Math.abs(a - hookMm) ? b : a);
    const usLetter = usLetters[closest] || "--";
    return {
      primary: { label: "Recommended Hook", value: formatNumber(hookMm) + " mm" },
      details: [
        { label: "US Letter Size", value: usLetter },
        { label: "Base Hook for Yarn", value: formatNumber(baseMm) + " mm" },
        { label: "Gauge Adjustment", value: (gaugeAdj >= 0 ? "+" : "") + formatNumber(gaugeAdj) + " mm" },
        { label: "Density Adjustment", value: (densityAdj >= 0 ? "+" : "") + formatNumber(densityAdj) + " mm" }
      ]
    };
  },
  }],
  relatedSlugs: ["yarn-yardage-calculator","cross-stitch-fabric-calculator"],
  faq: [
    { question: "How do I choose a crochet hook size?", answer: "Start with the hook size recommended on the yarn label. Make a gauge swatch and adjust up if your stitches are too tight or down if too loose." },
    { question: "Does hook material affect gauge?", answer: "Yes. Aluminum hooks tend to produce tighter stitches while bamboo and wood hooks give slightly looser gauge due to friction differences." },
    { question: "What is gauge in crochet?", answer: "Gauge is the number of stitches and rows per inch or per 4 inches. Matching gauge ensures your finished project is the correct size." },
  ],
  formula: "Hook (mm) = Base Hook Size + Gauge Adjustment + Density Adjustment
Gauge Adj = (Swatch Stitches - Target Stitches) x 0.25 mm",
};
