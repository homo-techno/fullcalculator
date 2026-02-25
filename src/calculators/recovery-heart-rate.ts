import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const recoveryHeartRateCalculator: CalculatorDefinition = {
  slug: "recovery-heart-rate-calculator",
  title: "Recovery Heart Rate Calculator",
  description: "Free recovery heart rate calculator. Measure your cardiovascular fitness by how quickly your heart rate drops after exercise.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["recovery heart rate", "heart rate recovery", "hrr calculator", "cardiovascular recovery", "fitness test heart rate"],
  variants: [
    {
      id: "hrr-1min",
      name: "1-Minute Recovery",
      description: "Measure heart rate drop in the first minute after exercise",
      fields: [
        { name: "peakHR", label: "Peak Heart Rate (end of exercise)", type: "number", placeholder: "e.g. 175", suffix: "bpm" },
        { name: "recovery1", label: "Heart Rate After 1 Minute", type: "number", placeholder: "e.g. 145", suffix: "bpm" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 35" },
      ],
      calculate: (inputs) => {
        const peakHR = inputs.peakHR as number;
        const recovery1 = inputs.recovery1 as number;
        const age = inputs.age as number;
        if (!peakHR || !recovery1) return null;
        const hrr1 = peakHR - recovery1;
        let fitness: string;
        if (hrr1 >= 40) fitness = "Excellent - above average cardiovascular fitness";
        else if (hrr1 >= 30) fitness = "Good - healthy cardiovascular recovery";
        else if (hrr1 >= 20) fitness = "Average - room for improvement";
        else if (hrr1 >= 12) fitness = "Below average - consider more cardio training";
        else fitness = "Poor - consult a healthcare provider";
        const details: { label: string; value: string }[] = [
          { label: "HRR (1-min drop)", value: `${hrr1} bpm` },
          { label: "Fitness Assessment", value: fitness },
          { label: "Peak HR", value: `${peakHR} bpm` },
          { label: "1-Min Recovery HR", value: `${recovery1} bpm` },
        ];
        if (age) {
          const maxHR = 220 - age;
          const pctMax = (peakHR / maxHR) * 100;
          details.push(
            { label: "Est. Max HR", value: `${maxHR} bpm` },
            { label: "Peak % of Max HR", value: `${formatNumber(pctMax, 1)}%` },
          );
        }
        return {
          primary: { label: "Heart Rate Recovery", value: `${hrr1} bpm drop` },
          details,
          note: "A drop of 12+ bpm in the first minute is considered normal. Less than 12 bpm may indicate reduced cardiovascular fitness.",
        };
      },
    },
    {
      id: "hrr-2min",
      name: "2-Minute Recovery",
      description: "Measure heart rate recovery over 2 minutes for more detailed assessment",
      fields: [
        { name: "peakHR", label: "Peak Heart Rate", type: "number", placeholder: "e.g. 175", suffix: "bpm" },
        { name: "recovery1", label: "Heart Rate at 1 Minute", type: "number", placeholder: "e.g. 145", suffix: "bpm" },
        { name: "recovery2", label: "Heart Rate at 2 Minutes", type: "number", placeholder: "e.g. 125", suffix: "bpm" },
        { name: "restingHR", label: "Resting Heart Rate", type: "number", placeholder: "e.g. 65", suffix: "bpm" },
      ],
      calculate: (inputs) => {
        const peakHR = inputs.peakHR as number;
        const recovery1 = inputs.recovery1 as number;
        const recovery2 = inputs.recovery2 as number;
        const restingHR = inputs.restingHR as number;
        if (!peakHR || !recovery1 || !recovery2) return null;
        const hrr1 = peakHR - recovery1;
        const hrr2 = peakHR - recovery2;
        let rating2min: string;
        if (hrr2 >= 66) rating2min = "Excellent";
        else if (hrr2 >= 53) rating2min = "Good";
        else if (hrr2 >= 44) rating2min = "Average";
        else if (hrr2 >= 35) rating2min = "Below Average";
        else rating2min = "Poor";
        const details: { label: string; value: string }[] = [
          { label: "1-Min Recovery", value: `${hrr1} bpm drop` },
          { label: "2-Min Recovery", value: `${hrr2} bpm drop` },
          { label: "2-Min Rating", value: rating2min },
          { label: "Peak HR", value: `${peakHR} bpm` },
          { label: "HR at 1 min", value: `${recovery1} bpm` },
          { label: "HR at 2 min", value: `${recovery2} bpm` },
        ];
        if (restingHR) {
          const recoveryPct = (hrr2 / (peakHR - restingHR)) * 100;
          details.push(
            { label: "Resting HR", value: `${restingHR} bpm` },
            { label: "Recovery %", value: `${formatNumber(recoveryPct, 1)}% back to resting` },
          );
        }
        return {
          primary: { label: "2-Min HRR", value: `${hrr2} bpm drop` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["heart-rate-calculator", "vo2-max-calculator", "calorie-calculator"],
  faq: [
    { question: "What is heart rate recovery?", answer: "Heart Rate Recovery (HRR) measures how quickly your heart rate drops after stopping exercise. It reflects the health of your autonomic nervous system and cardiovascular fitness. A faster drop indicates better fitness." },
    { question: "What is a good heart rate recovery?", answer: "At 1 minute: a drop of 20+ bpm is good, 30+ is excellent. A drop of less than 12 bpm is considered abnormal and may warrant medical attention. At 2 minutes: 50+ bpm drop is good, 66+ is excellent." },
  ],
  formula: "HRR = Peak HR - Recovery HR (at 1 or 2 minutes post-exercise)",
};
