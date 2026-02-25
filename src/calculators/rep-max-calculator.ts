import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const repMaxCalculator: CalculatorDefinition = {
  slug: "rep-max-calculator",
  title: "Rep Max Calculator",
  description: "Free rep max calculator for any rep range. Estimate your max weight for 1-20 reps based on a known set using multiple proven formulas.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["rep max calculator", "multi rep max", "training max", "weight prediction", "rep range calculator", "strength calculator"],
  variants: [
    {
      id: "predict-rm",
      name: "Predict Any Rep Max",
      description: "Enter a known weight and reps to predict max at any other rep range",
      fields: [
        { name: "weight", label: "Weight Lifted", type: "number", placeholder: "e.g. 100" },
        { name: "reps", label: "Reps Completed", type: "number", placeholder: "e.g. 5", min: 1, max: 20 },
        { name: "targetReps", label: "Target Rep Range", type: "select", options: [
          { label: "1 rep (1RM)", value: "1" },
          { label: "2 reps", value: "2" },
          { label: "3 reps", value: "3" },
          { label: "4 reps", value: "4" },
          { label: "5 reps", value: "5" },
          { label: "6 reps", value: "6" },
          { label: "8 reps", value: "8" },
          { label: "10 reps", value: "10" },
          { label: "12 reps", value: "12" },
          { label: "15 reps", value: "15" },
          { label: "20 reps", value: "20" },
        ], defaultValue: "1" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
      ],
      calculate: (inputs) => {
        const w = inputs.weight as number;
        const r = inputs.reps as number;
        const targetReps = parseInt(inputs.targetReps as string);
        const unit = inputs.unit as string;
        if (!w || !r || !targetReps) return null;
        const brzycki1RM = r === 1 ? w : w * (36 / (37 - r));
        const epley1RM = r === 1 ? w : w * (1 + r / 30);
        const lombardi1RM = w * Math.pow(r, 0.1);
        const avg1RM = (brzycki1RM + epley1RM + lombardi1RM) / 3;
        let targetWeight: number;
        if (targetReps === 1) {
          targetWeight = avg1RM;
        } else {
          const brzyckiTarget = avg1RM * (37 - targetReps) / 36;
          const epleyTarget = avg1RM / (1 + targetReps / 30);
          targetWeight = (brzyckiTarget + epleyTarget) / 2;
        }
        const percentages = [
          { reps: 1, pct: 100 }, { reps: 2, pct: 95 }, { reps: 3, pct: 93 },
          { reps: 4, pct: 90 }, { reps: 5, pct: 87 }, { reps: 6, pct: 85 },
          { reps: 8, pct: 80 }, { reps: 10, pct: 75 }, { reps: 12, pct: 70 },
          { reps: 15, pct: 65 }, { reps: 20, pct: 60 },
        ];
        return {
          primary: { label: `${targetReps}-Rep Max`, value: `${formatNumber(targetWeight, 1)} ${unit}` },
          details: [
            { label: "Estimated 1RM", value: `${formatNumber(avg1RM, 1)} ${unit}` },
            ...percentages.map(p => ({
              label: `${p.reps} rep (~${p.pct}%)`,
              value: `${formatNumber(avg1RM * p.pct / 100, 1)} ${unit}`,
            })),
          ],
        };
      },
    },
    {
      id: "training-percentages",
      name: "Training Percentages",
      description: "Calculate training weights from a known or estimated 1RM",
      fields: [
        { name: "oneRepMax", label: "1RM (or estimated)", type: "number", placeholder: "e.g. 120" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "kg", value: "kg" }, { label: "lbs", value: "lbs" },
        ], defaultValue: "kg" },
      ],
      calculate: (inputs) => {
        const orm = inputs.oneRepMax as number;
        const unit = inputs.unit as string;
        if (!orm) return null;
        const pcts = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
        const repRanges = ["1", "2", "3", "5", "8", "10", "12", "15", "20", "25", "30+"];
        return {
          primary: { label: "1RM", value: `${formatNumber(orm, 1)} ${unit}` },
          details: pcts.map((p, i) => ({
            label: `${p}% (${repRanges[i]} reps)`,
            value: `${formatNumber(orm * p / 100, 1)} ${unit}`,
          })),
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "relative-strength-calculator", "volume-load-calculator"],
  faq: [
    { question: "How accurate are rep max estimates?", answer: "Rep max formulas are most accurate between 1-10 reps. Beyond 10 reps, accuracy decreases. The calculator averages Brzycki, Epley, and Lombardi formulas for better estimates. Always leave a small margin of safety." },
    { question: "Should I test my 1RM or estimate it?", answer: "Estimating from a 3-5 rep set is safer and nearly as accurate. Testing a true 1RM carries higher injury risk and requires proper warm-up, a spotter, and experience with heavy singles." },
  ],
  formula: "Brzycki: 1RM = W*36/(37-R) | Epley: 1RM = W*(1+R/30) | Lombardi: 1RM = W*R^0.1",
};
