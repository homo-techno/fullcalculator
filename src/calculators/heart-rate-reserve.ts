import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const heartRateReserveCalculator: CalculatorDefinition = {
  slug: "heart-rate-reserve-calculator",
  title: "Heart Rate Reserve Calculator",
  description:
    "Free heart rate reserve calculator using the Karvonen formula. Calculate your target heart rate for any training intensity.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["heart rate reserve", "Karvonen formula", "target heart rate", "HRR"],
  variants: [
    {
      id: "karvonen",
      name: "Karvonen Method",
      fields: [
        {
          name: "age",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 30",
        },
        {
          name: "restingHR",
          label: "Resting Heart Rate (bpm)",
          type: "number",
          placeholder: "e.g. 65",
        },
        {
          name: "intensity",
          label: "Target Intensity (%)",
          type: "number",
          placeholder: "e.g. 70",
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const restingHR = inputs.restingHR as number;
        const intensity = inputs.intensity as number;
        if (!age || !restingHR || !intensity) return null;

        const hrMax = 220 - age;
        const hrr = hrMax - restingHR;
        const targetHR = (hrr * (intensity / 100)) + restingHR;

        return {
          primary: {
            label: "Target Heart Rate",
            value: `${formatNumber(targetHR, 0)} bpm`,
          },
          details: [
            { label: "Max Heart Rate (220 \u2212 age)", value: `${formatNumber(hrMax, 0)} bpm` },
            { label: "Heart Rate Reserve", value: `${formatNumber(hrr, 0)} bpm` },
            { label: "Resting Heart Rate", value: `${formatNumber(restingHR, 0)} bpm` },
            { label: "Target Intensity", value: `${formatNumber(intensity, 0)}%` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["training-zone-calculator", "exercise-calorie-calculator"],
  faq: [
    {
      question: "What is the Karvonen formula?",
      answer:
        "The Karvonen formula calculates target heart rate as THR = ((HRmax \u2212 HRrest) \u00D7 intensity%) + HRrest. It uses heart rate reserve (the difference between max and resting HR) for a more individualized training target.",
    },
    {
      question: "What is heart rate reserve?",
      answer:
        "Heart rate reserve (HRR) is the difference between your maximum heart rate and your resting heart rate. It represents the range within which your heart can increase its rate during exercise.",
    },
  ],
  formula: "THR = ((HRmax \u2212 HRrest) \u00D7 %intensity) + HRrest, where HRmax = 220 \u2212 age.",
};
