import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const musclePotentialCalculator: CalculatorDefinition = {
  slug: "muscle-potential-calculator",
  title: "Natural Muscle Potential Calculator",
  description: "Free natural muscle potential calculator. Estimate your maximum muscular bodyweight using multiple research-based models (Berkhan, McDonald, Casey Butt).",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["muscle potential", "natural limit", "genetic potential", "maximum muscular weight", "natural bodybuilding", "muscle limit calculator"],
  variants: [
    {
      id: "multi-model",
      name: "Multi-Model Estimate",
      description: "Compare estimates from Berkhan, McDonald, and Casey Butt models",
      fields: [
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178", suffix: "cm" },
        { name: "wrist", label: "Wrist Circumference", type: "number", placeholder: "e.g. 17.5", suffix: "cm" },
        { name: "ankle", label: "Ankle Circumference", type: "number", placeholder: "e.g. 22", suffix: "cm" },
        { name: "targetBF", label: "Target Body Fat %", type: "select", options: [
          { label: "8% (stage lean)", value: "8" },
          { label: "10% (very lean)", value: "10" },
          { label: "12% (lean)", value: "12" },
          { label: "15% (athletic)", value: "15" },
        ], defaultValue: "10" },
      ],
      calculate: (inputs) => {
        const height = inputs.height as number;
        const wrist = inputs.wrist as number;
        const ankle = inputs.ankle as number;
        const targetBF = parseInt(inputs.targetBF as string);
        if (!height || !wrist || !ankle) return null;
        const heightIn = height / 2.54;
        const heightCm = height;
        const berkhanLean = (heightCm - 100);
        const berkhanAtBF = berkhanLean / (1 - targetBF / 100);
        const mcdonaldLeanMax = (heightIn - 60) * 2.3 + 160;
        const mcdonaldLeanKg = mcdonaldLeanMax * 0.4536;
        const mcdonaldTotalKg = mcdonaldLeanKg / (1 - targetBF / 100);
        const wristIn = wrist / 2.54;
        const ankleIn = ankle / 2.54;
        const buttLean = heightIn * (0.3 * wristIn + 0.1 * ankleIn + 0.55) * 0.4536;
        const buttTotal = buttLean / (1 - targetBF / 100);
        const avgLean = (berkhanLean + mcdonaldLeanKg + buttLean) / 3;
        const avgTotal = (berkhanAtBF + mcdonaldTotalKg + buttTotal) / 3;
        return {
          primary: { label: "Avg Max Weight", value: `${formatNumber(avgTotal, 1)} kg` },
          details: [
            { label: "Avg Lean Mass", value: `${formatNumber(avgLean, 1)} kg` },
            { label: "Target Body Fat", value: `${targetBF}%` },
            { label: "--- Berkhan Model ---", value: "" },
            { label: "Berkhan (lean mass)", value: `${formatNumber(berkhanLean, 1)} kg` },
            { label: "Berkhan (at target BF)", value: `${formatNumber(berkhanAtBF, 1)} kg` },
            { label: "--- McDonald Model ---", value: "" },
            { label: "McDonald (lean mass)", value: `${formatNumber(mcdonaldLeanKg, 1)} kg` },
            { label: "McDonald (at target BF)", value: `${formatNumber(mcdonaldTotalKg, 1)} kg` },
            { label: "--- Casey Butt Model ---", value: "" },
            { label: "Butt (lean mass)", value: `${formatNumber(buttLean, 1)} kg` },
            { label: "Butt (at target BF)", value: `${formatNumber(buttTotal, 1)} kg` },
          ],
          note: "These are estimates of the upper limit for natural (drug-free) muscle development. Achieving these limits typically requires 10+ years of optimal training and nutrition.",
        };
      },
    },
    {
      id: "years-of-training",
      name: "Muscle Gain by Training Year",
      description: "Estimate how much muscle you can gain per year (McDonald model)",
      fields: [
        { name: "trainingYears", label: "Years of Proper Training", type: "select", options: [
          { label: "Year 1 (beginner)", value: "1" },
          { label: "Year 2 (intermediate)", value: "2" },
          { label: "Year 3 (intermediate+)", value: "3" },
          { label: "Year 4 (advanced)", value: "4" },
          { label: "Year 5+ (advanced+)", value: "5" },
        ], defaultValue: "1" },
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
      ],
      calculate: (inputs) => {
        const year = parseInt(inputs.trainingYears as string);
        const gender = inputs.gender as string;
        if (!year) return null;
        const maleGains: Record<number, [number, number]> = {
          1: [9, 11],
          2: [4.5, 5.5],
          3: [2.3, 2.7],
          4: [1, 1.4],
          5: [0.5, 0.7],
        };
        const femaleGains: Record<number, [number, number]> = {
          1: [4.5, 5.5],
          2: [2.3, 2.7],
          3: [1.1, 1.4],
          4: [0.5, 0.7],
          5: [0.2, 0.3],
        };
        const gains = gender === "male" ? maleGains[year] : femaleGains[year];
        if (!gains) return null;
        const gainPerMonth = [(gains[0] / 12), (gains[1] / 12)];
        let cumulativeLow = 0;
        let cumulativeHigh = 0;
        const g = gender === "male" ? maleGains : femaleGains;
        for (let i = 1; i <= year; i++) {
          cumulativeLow += g[i][0];
          cumulativeHigh += g[i][1];
        }
        return {
          primary: { label: `Year ${year} Muscle Gain`, value: `${formatNumber(gains[0], 1)}-${formatNumber(gains[1], 1)} kg` },
          details: [
            { label: "Monthly Gain (year " + year + ")", value: `${formatNumber(gainPerMonth[0], 2)}-${formatNumber(gainPerMonth[1], 2)} kg/month` },
            { label: "Cumulative Gain (yrs 1-" + year + ")", value: `${formatNumber(cumulativeLow, 1)}-${formatNumber(cumulativeHigh, 1)} kg total` },
            { label: "Rate Category", value: year <= 1 ? "Rapid (newbie gains)" : year <= 2 ? "Moderate" : year <= 3 ? "Slow" : "Very slow" },
          ],
          note: "Based on Lyle McDonald's model for natural muscle gain. Assumes consistent, proper training and adequate nutrition. Women gain approximately half the rate of men.",
        };
      },
    },
  ],
  relatedSlugs: ["fat-free-mass-index-calculator", "body-symmetry-calculator", "protein-intake-calculator"],
  faq: [
    { question: "What is my natural muscle potential?", answer: "Natural muscle potential is the maximum amount of muscle you can build without performance-enhancing drugs. It depends on height, bone structure (wrist/ankle size), and genetics. Most men can gain 18-23 kg of muscle over a lifetime of training." },
    { question: "How long does it take to reach your genetic potential?", answer: "Most people reach 85-90% of their genetic potential within 5-7 years of consistent, proper training. The last 10-15% can take another 3-5+ years. Diminishing returns make progress increasingly slow." },
  ],
  formula: "Berkhan: Max lean mass = height(cm) - 100 | McDonald: Max lean = (height_in - 60) x 2.3 + 160 lbs | Yearly gains decrease each year",
};
