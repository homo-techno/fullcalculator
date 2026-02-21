import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sitUpTestCalculator: CalculatorDefinition = {
  slug: "sit-up-test-calculator",
  title: "Sit-Up Test Calculator",
  description:
    "Free sit-up and crunch test fitness calculator. Assess your core muscular endurance based on age and gender norms from ACSM standards.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "sit-up test",
    "crunch test calculator",
    "core fitness test",
    "abdominal endurance",
    "sit-up norms",
  ],
  variants: [
    {
      id: "one-minute",
      name: "One-Minute Sit-Up Test",
      description: "Assess core endurance from maximum sit-ups in 60 seconds",
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
        {
          name: "age",
          label: "Age Group",
          type: "select",
          options: [
            { label: "18-25", value: "18" },
            { label: "26-35", value: "26" },
            { label: "36-45", value: "36" },
            { label: "46-55", value: "46" },
            { label: "56-65", value: "56" },
            { label: "65+", value: "65" },
          ],
        },
        { name: "count", label: "Sit-Ups in 1 Minute", type: "number", placeholder: "e.g. 30", min: 0 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = parseInt(inputs.age as string);
        const count = inputs.count as number;
        if (count === undefined || count === null) return null;

        // [poor, below avg, average, good, excellent]
        const maleNorms: Record<number, number[]> = {
          18: [25, 30, 36, 42, 49],
          26: [22, 27, 33, 39, 45],
          36: [18, 23, 29, 35, 41],
          46: [14, 19, 25, 31, 36],
          56: [10, 15, 21, 27, 31],
          65: [6, 11, 17, 23, 28],
        };
        const femaleNorms: Record<number, number[]> = {
          18: [18, 24, 29, 34, 43],
          26: [14, 20, 25, 31, 39],
          36: [10, 16, 21, 27, 33],
          46: [6, 12, 17, 23, 27],
          56: [4, 8, 13, 19, 24],
          65: [2, 5, 11, 16, 23],
        };

        const norms = gender === "male" ? maleNorms[age] : femaleNorms[age];

        let rating = "Not Rated";
        if (norms) {
          if (count >= norms[4]) rating = "Excellent";
          else if (count >= norms[3]) rating = "Good";
          else if (count >= norms[2]) rating = "Average";
          else if (count >= norms[1]) rating = "Below Average";
          else rating = "Needs Improvement";
        }

        const calBurned = count * 0.25;

        return {
          primary: { label: "Rating", value: rating },
          details: [
            { label: "Sit-Ups Completed", value: formatNumber(count, 0) },
            { label: "Age Group Average", value: norms ? formatNumber(norms[2], 0) : "N/A" },
            { label: "Target for Good", value: norms ? formatNumber(norms[3], 0) : "N/A" },
            { label: "Est. Calories Burned", value: formatNumber(calBurned, 1) },
          ],
          note: "Based on ACSM normative data. Perform sit-ups with knees bent, feet flat on the floor, and arms crossed on the chest.",
        };
      },
    },
    {
      id: "partial-curl",
      name: "Partial Curl-Up Test",
      description: "CSEP-approved cadence curl-up test (max or to 25 in 1 min)",
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
        {
          name: "age",
          label: "Age Group",
          type: "select",
          options: [
            { label: "20-29", value: "20" },
            { label: "30-39", value: "30" },
            { label: "40-49", value: "40" },
            { label: "50-59", value: "50" },
            { label: "60-69", value: "60" },
          ],
        },
        { name: "count", label: "Curl-Ups Completed", type: "number", placeholder: "e.g. 21", min: 0, max: 25 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = parseInt(inputs.age as string);
        const count = inputs.count as number;
        if (count === undefined || count === null) return null;

        // [needs improvement, fair, good, very good, excellent]
        const maleNorms: Record<number, number[]> = {
          20: [10, 15, 19, 22, 25],
          30: [8, 13, 17, 21, 25],
          40: [6, 11, 15, 19, 25],
          50: [5, 9, 13, 17, 25],
          60: [3, 7, 11, 15, 25],
        };
        const femaleNorms: Record<number, number[]> = {
          20: [5, 11, 15, 19, 25],
          30: [3, 9, 13, 17, 25],
          40: [2, 7, 11, 15, 25],
          50: [1, 5, 9, 13, 25],
          60: [0, 3, 7, 11, 25],
        };

        const norms = gender === "male" ? maleNorms[age] : femaleNorms[age];
        let rating = "Not Rated";
        if (norms) {
          if (count >= norms[4]) rating = "Excellent";
          else if (count >= norms[3]) rating = "Very Good";
          else if (count >= norms[2]) rating = "Good";
          else if (count >= norms[1]) rating = "Fair";
          else rating = "Needs Improvement";
        }

        return {
          primary: { label: "Rating", value: rating },
          details: [
            { label: "Curl-Ups", value: formatNumber(count, 0) },
            { label: "Maximum Score", value: "25" },
            { label: "Target for Good", value: norms ? formatNumber(norms[2], 0) : "N/A" },
          ],
          note: "CSEP partial curl-up test performed to a metronome cadence of 50 beats/min. Maximum score is 25.",
        };
      },
    },
  ],
  relatedSlugs: ["push-up-test-calculator", "plank-time-calculator", "army-pt-score-calculator"],
  faq: [
    {
      question: "How many sit-ups should I be able to do in 1 minute?",
      answer:
        "For males aged 26-35: below 22 is poor, 27-33 is average, 39+ is good, 45+ is excellent. For females aged 26-35: below 14 is poor, 20-25 is average, 31+ is good, 39+ is excellent.",
    },
    {
      question: "What is the difference between sit-ups and crunches?",
      answer:
        "Sit-ups involve lifting your entire torso off the floor, engaging hip flexors and abs. Crunches only lift the shoulders and upper back, isolating the abdominals more. The partial curl-up test is a controlled crunch movement preferred by many fitness organizations.",
    },
    {
      question: "Are sit-ups bad for your back?",
      answer:
        "Full sit-ups can strain the lower back if done improperly. The CSEP partial curl-up is considered safer. If you have back issues, consult a professional. Alternatives include planks, dead bugs, and bird dogs for core training.",
    },
  ],
  formula: "Rating based on ACSM/CSEP normative percentile tables by age and gender",
};
