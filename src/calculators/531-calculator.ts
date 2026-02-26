import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wendler531Calculator: CalculatorDefinition = {
  slug: "531-calculator",
  title: "Wendler 5/3/1 Calculator",
  description: "Free online Wendler 5/3/1 program calculator. Generate your training weights for all four weeks of the 5/3/1 strength program based on your training maxes.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["531 calculator", "wendler 531", "5/3/1 program", "strength program", "training max", "wendler program"],
  variants: [
    {
      id: "531-program",
      name: "Generate 5/3/1 Program",
      fields: [
        { name: "oneRepMax", label: "One Rep Max (lbs)", type: "number", placeholder: "e.g. 300" },
        {
          name: "trainingMaxPct",
          label: "Training Max Percentage",
          type: "select",
          options: [
            { label: "85% (recommended for beginners)", value: "0.85" },
            { label: "90% (standard)", value: "0.90" },
          ],
        },
        {
          name: "lift",
          label: "Lift",
          type: "select",
          options: [
            { label: "Squat", value: "squat" },
            { label: "Bench Press", value: "bench" },
            { label: "Deadlift", value: "deadlift" },
            { label: "Overhead Press", value: "ohp" },
          ],
        },
      ],
      calculate: (inputs) => {
        const oneRepMax = parseFloat(inputs.oneRepMax as string) || 0;
        const tmPct = parseFloat(inputs.trainingMaxPct as string) || 0.9;
        const lift = inputs.lift as string;

        const trainingMax = oneRepMax * tmPct;

        const week1s1 = trainingMax * 0.65;
        const week1s2 = trainingMax * 0.75;
        const week1s3 = trainingMax * 0.85;

        const week2s1 = trainingMax * 0.7;
        const week2s2 = trainingMax * 0.8;
        const week2s3 = trainingMax * 0.9;

        const week3s1 = trainingMax * 0.75;
        const week3s2 = trainingMax * 0.85;
        const week3s3 = trainingMax * 0.95;

        const week4s1 = trainingMax * 0.4;
        const week4s2 = trainingMax * 0.5;
        const week4s3 = trainingMax * 0.6;

        const round5 = (n: number) => Math.round(n / 5) * 5;

        return {
          primary: { label: `Training Max (${lift})`, value: `${formatNumber(round5(trainingMax))} lbs` },
          details: [
            { label: "1RM", value: `${formatNumber(Math.round(oneRepMax))} lbs` },
            { label: "Week 1 - 5s (65/75/85%)", value: `${formatNumber(round5(week1s1))} / ${formatNumber(round5(week1s2))} / ${formatNumber(round5(week1s3))} lbs` },
            { label: "Week 2 - 3s (70/80/90%)", value: `${formatNumber(round5(week2s1))} / ${formatNumber(round5(week2s2))} / ${formatNumber(round5(week2s3))} lbs` },
            { label: "Week 3 - 5/3/1 (75/85/95%)", value: `${formatNumber(round5(week3s1))} / ${formatNumber(round5(week3s2))} / ${formatNumber(round5(week3s3))} lbs` },
            { label: "Week 4 - Deload (40/50/60%)", value: `${formatNumber(round5(week4s1))} / ${formatNumber(round5(week4s2))} / ${formatNumber(round5(week4s3))} lbs` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bench-press-calc", "squat-calc", "deadlift-calc"],
  faq: [
    {
      question: "What is the Wendler 5/3/1 program?",
      answer: "The 5/3/1 program is a strength training program by Jim Wendler. It is based on performing four main lifts (squat, bench, deadlift, overhead press) over a four-week cycle. Each week increases in intensity: Week 1 is 3x5, Week 2 is 3x3, Week 3 is 5/3/1, and Week 4 is a deload.",
    },
    {
      question: "What is a training max?",
      answer: "The training max (TM) is typically 85-90% of your true one-rep max. All working sets in 5/3/1 are calculated from this training max rather than your actual 1RM. This ensures you train with submaximal weights for steady progress.",
    },
    {
      question: "How do I progress in 5/3/1?",
      answer: "After each four-week cycle, add 5 lbs to your training max for upper body lifts (bench, overhead press) and 10 lbs for lower body lifts (squat, deadlift). This slow progression allows for long-term consistent gains.",
    },
  ],
  formula: "Training Max = 1RM x TM%; Week 1: 65/75/85% of TM; Week 2: 70/80/90% of TM; Week 3: 75/85/95% of TM; Week 4: 40/50/60% of TM",
};
