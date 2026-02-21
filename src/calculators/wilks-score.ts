import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wilksScoreCalculator: CalculatorDefinition = {
  slug: "wilks-score-calculator",
  title: "Wilks Score Calculator",
  description:
    "Free Wilks score calculator for powerlifting. Compare your strength across different weight classes. Enter your bodyweight, total, and sex to get your Wilks coefficient.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "wilks score calculator",
    "wilks calculator",
    "powerlifting calculator",
    "wilks coefficient",
    "strength comparison calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Wilks Score",
      description: "Calculate your Wilks coefficient for powerlifting",
      fields: [
        { name: "bodyweight", label: "Bodyweight", type: "number", placeholder: "e.g. 82.5", suffix: "kg" },
        { name: "total", label: "Powerlifting Total", type: "number", placeholder: "e.g. 500", suffix: "kg" },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "male",
        },
      ],
      calculate: (inputs) => {
        const bw = inputs.bodyweight as number;
        const total = inputs.total as number;
        const sex = inputs.sex as string;
        if (!bw || !total) return null;

        let a: number, b: number, c: number, d: number, e: number, f: number;

        if (sex === "male") {
          a = -216.0475144;
          b = 16.2606339;
          c = -0.002388645;
          d = -0.00113732;
          e = 7.01863e-6;
          f = -1.291e-8;
        } else {
          a = 594.31747775582;
          b = -27.23842536447;
          c = 0.82112226871;
          d = -0.00930733913;
          e = 4.731582e-5;
          f = -9.054e-8;
        }

        const x = bw;
        const denominator = a + b * x + c * x * x + d * x * x * x + e * x * x * x * x + f * x * x * x * x * x;
        const coefficient = 500 / denominator;
        const wilks = total * coefficient;

        let classification: string;
        if (sex === "male") {
          if (wilks < 200) classification = "Beginner";
          else if (wilks < 300) classification = "Intermediate";
          else if (wilks < 400) classification = "Advanced";
          else if (wilks < 450) classification = "Elite";
          else classification = "World Class";
        } else {
          if (wilks < 150) classification = "Beginner";
          else if (wilks < 250) classification = "Intermediate";
          else if (wilks < 350) classification = "Advanced";
          else if (wilks < 400) classification = "Elite";
          else classification = "World Class";
        }

        return {
          primary: { label: "Wilks Score", value: formatNumber(wilks, 2) },
          details: [
            { label: "Classification", value: classification },
            { label: "Wilks Coefficient", value: formatNumber(coefficient, 6) },
            { label: "Bodyweight", value: `${formatNumber(bw, 1)} kg` },
            { label: "Total", value: `${formatNumber(total, 1)} kg` },
            { label: "BW Ratio", value: `${formatNumber(total / bw, 2)}x` },
          ],
          note: "The Wilks score allows comparison of lifters across weight classes. Higher is better. A 400+ Wilks is elite for men, 350+ for women.",
        };
      },
    },
  ],
  relatedSlugs: ["one-rep-max-calculator", "bench-press-calculator", "squat-max-calculator", "deadlift-max-calculator"],
  faq: [
    {
      question: "What is a Wilks score?",
      answer:
        "The Wilks score (or Wilks coefficient) is a number used in powerlifting to compare the relative strength of lifters across different weight classes. It normalizes a lifter's total by their bodyweight using a polynomial formula.",
    },
    {
      question: "What is a good Wilks score?",
      answer:
        "For men: under 200 is beginner, 200-300 is intermediate, 300-400 is advanced, 400-450 is elite, and 450+ is world class. For women: under 150 is beginner, 150-250 is intermediate, 250-350 is advanced, 350-400 is elite, and 400+ is world class.",
    },
    {
      question: "What is the powerlifting total?",
      answer:
        "The powerlifting total is the sum of your best squat, bench press, and deadlift in a competition. For this calculator, enter the combined total in kilograms.",
    },
  ],
  formula:
    "Wilks = Total × (500 / (a + b×BW + c×BW² + d×BW³ + e×BW⁴ + f×BW⁵)) where coefficients differ for male and female",
};
