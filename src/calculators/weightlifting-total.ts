import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const weightliftingTotalCalculator: CalculatorDefinition = {
  slug: "weightlifting-total-calculator",
  title: "Weightlifting Total Calculator",
  description:
    "Free Olympic weightlifting total calculator. Calculate your combined snatch and clean & jerk total, Sinclair coefficient, and competitive classification.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "weightlifting total",
    "olympic weightlifting calculator",
    "snatch clean jerk total",
    "sinclair coefficient",
    "weightlifting classification",
  ],
  variants: [
    {
      id: "total",
      name: "Calculate Total",
      description: "Calculate Olympic lifting total and Sinclair score",
      fields: [
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        { name: "bodyweight", label: "Body Weight (kg)", type: "number", placeholder: "e.g. 81", step: 0.1 },
        { name: "snatch", label: "Best Snatch (kg)", type: "number", placeholder: "e.g. 100", step: 0.5 },
        { name: "cleanJerk", label: "Best Clean & Jerk (kg)", type: "number", placeholder: "e.g. 125", step: 0.5 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const bw = inputs.bodyweight as number;
        const snatch = inputs.snatch as number;
        const cj = inputs.cleanJerk as number;
        if (!bw || !snatch || !cj) return null;

        const total = snatch + cj;

        // Sinclair coefficients (2024 quadrennium approximations)
        // Male: b = 0.722762521, A = 175.508 (max bw)
        // Female: b = 1.023495824, A = 153.655 (max bw)
        const sinclairA = gender === "male" ? 175.508 : 153.655;
        const sinclairB = gender === "male" ? 0.722762521 : 1.023495824;

        let sinclairCoeff = 1;
        if (bw < sinclairA) {
          const x = Math.log10(bw / sinclairA);
          sinclairCoeff = Math.pow(10, sinclairB * x * x);
        }

        const sinclairTotal = total * sinclairCoeff;

        // Snatch to CJ ratio
        const ratio = snatch / cj;

        // Classification based on Sinclair total (approximate)
        let classification = "Beginner";
        if (gender === "male") {
          if (sinclairTotal >= 350) classification = "International Elite";
          else if (sinclairTotal >= 300) classification = "National";
          else if (sinclairTotal >= 250) classification = "Advanced";
          else if (sinclairTotal >= 200) classification = "Intermediate";
        } else {
          if (sinclairTotal >= 270) classification = "International Elite";
          else if (sinclairTotal >= 220) classification = "National";
          else if (sinclairTotal >= 180) classification = "Advanced";
          else if (sinclairTotal >= 140) classification = "Intermediate";
        }

        // Weight classes
        const maleClasses = [55, 61, 67, 73, 81, 89, 96, 102, 109];
        const femaleClasses = [45, 49, 55, 59, 64, 71, 76, 81, 87];
        const classes = gender === "male" ? maleClasses : femaleClasses;
        const weightClass = classes.find(c => bw <= c) || classes[classes.length - 1];
        const classLabel = bw > classes[classes.length - 1] ? `${classes[classes.length - 1]}+` : `${weightClass}`;

        return {
          primary: { label: "Total", value: formatNumber(total, 1), suffix: "kg" },
          details: [
            { label: "Snatch", value: `${formatNumber(snatch, 1)} kg` },
            { label: "Clean & Jerk", value: `${formatNumber(cj, 1)} kg` },
            { label: "Sinclair Total", value: formatNumber(sinclairTotal, 1) },
            { label: "Sinclair Coefficient", value: formatNumber(sinclairCoeff, 4) },
            { label: "Snatch/CJ Ratio", value: `${formatNumber(ratio * 100, 1)}%` },
            { label: "Weight Class", value: `${classLabel} kg` },
            { label: "Classification", value: classification },
          ],
          note: "Ideal snatch-to-clean-and-jerk ratio is 78-83%. Sinclair coefficient normalizes performance across weight classes.",
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "wilks-score-calculator", "strength-standards-calculator"],
  faq: [
    {
      question: "What is an Olympic weightlifting total?",
      answer:
        "The total is the sum of your best successful snatch and best successful clean & jerk in competition. It is the primary measure of performance in Olympic weightlifting.",
    },
    {
      question: "What is the Sinclair coefficient?",
      answer:
        "The Sinclair coefficient normalizes weightlifting totals across different body weights, allowing fair comparison between lifters of different weight classes. A heavier lifter's total is adjusted downward. It is updated each Olympic quadrennium.",
    },
    {
      question: "What is a good snatch-to-clean-and-jerk ratio?",
      answer:
        "The ideal ratio is 78-83%. If your snatch is below 78% of your clean & jerk, your snatch technique or pulling strength may need work. Above 83% suggests your clean & jerk or jerk technique needs improvement.",
    },
  ],
  formula: "Total = Snatch + Clean & Jerk | Sinclair Total = Total × 10^(b × (log₁₀(BW/A))²)",
};
