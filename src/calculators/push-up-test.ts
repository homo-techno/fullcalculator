import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pushUpTestCalculator: CalculatorDefinition = {
  slug: "push-up-test-calculator",
  title: "Push-Up Test Calculator",
  description:
    "Free push-up fitness test calculator. Evaluate your upper body muscular endurance based on how many push-ups you can do in one minute.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "push-up test",
    "pushup calculator",
    "push-up fitness test",
    "muscular endurance test",
    "push-up norms",
  ],
  variants: [
    {
      id: "test",
      name: "Push-Up Test Assessment",
      description: "Rate your push-up performance against age/gender norms",
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
            { label: "17-19", value: "17" },
            { label: "20-29", value: "20" },
            { label: "30-39", value: "30" },
            { label: "40-49", value: "40" },
            { label: "50-59", value: "50" },
            { label: "60+", value: "60" },
          ],
        },
        { name: "count", label: "Push-Ups Completed", type: "number", placeholder: "e.g. 35", min: 0 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = parseInt(inputs.age as string);
        const count = inputs.count as number;
        if (count === undefined || count === null) return null;

        // Norms: [poor, below avg, average, above avg, excellent]
        const maleNorms: Record<number, number[]> = {
          17: [4, 11, 21, 30, 56],
          20: [4, 15, 22, 28, 54],
          30: [1, 12, 17, 24, 44],
          40: [1, 10, 13, 20, 39],
          50: [1, 7, 10, 15, 34],
          60: [1, 5, 8, 12, 29],
        };
        const femaleNorms: Record<number, number[]> = {
          17: [1, 6, 11, 20, 35],
          20: [1, 6, 10, 17, 36],
          30: [0, 4, 8, 14, 30],
          40: [0, 3, 6, 11, 24],
          50: [0, 1, 6, 10, 20],
          60: [0, 1, 4, 8, 17],
        };

        const norms = gender === "male" ? maleNorms[age] : femaleNorms[age];

        let rating = "Not Rated";
        let percentile = "";
        if (norms) {
          if (count >= norms[4]) { rating = "Excellent"; percentile = "Top 5%"; }
          else if (count >= norms[3]) { rating = "Above Average"; percentile = "Top 25%"; }
          else if (count >= norms[2]) { rating = "Average"; percentile = "50th percentile"; }
          else if (count >= norms[1]) { rating = "Below Average"; percentile = "Bottom 25%"; }
          else { rating = "Needs Improvement"; percentile = "Bottom 5%"; }
        }

        // Estimate calories burned (rough approximation)
        const calBurned = count * 0.36;

        return {
          primary: { label: "Rating", value: rating },
          details: [
            { label: "Push-Ups", value: formatNumber(count, 0) },
            { label: "Percentile", value: percentile },
            { label: "Est. Calories Burned", value: formatNumber(calBurned, 1) },
            { label: "Age Group Avg", value: norms ? formatNumber(norms[2], 0) : "N/A" },
          ],
          note: "Based on ACSM (American College of Sports Medicine) push-up test norms. Use strict form with full range of motion for accurate results.",
        };
      },
    },
  ],
  relatedSlugs: ["sit-up-test-calculator", "plank-time-calculator", "body-fat-calculator"],
  faq: [
    {
      question: "How many push-ups should I be able to do?",
      answer:
        "For males aged 20-29, 22-28 push-ups is average. For females aged 20-29, 10-17 is average. These numbers decrease with age. Being able to do 40+ push-ups is associated with significantly reduced cardiovascular disease risk.",
    },
    {
      question: "How is the push-up test performed?",
      answer:
        "Start in standard push-up position. Lower your chest to fist-height from the floor, then push back up. Count the maximum number you can do with proper form without stopping. Males use standard position; females may use modified (knee) position for normative comparison.",
    },
    {
      question: "Are push-ups a good indicator of fitness?",
      answer:
        "Yes. A 2019 Harvard study found that men who could do 40+ push-ups had a 96% lower risk of cardiovascular disease compared to those who could do fewer than 10. Push-ups measure upper body muscular endurance and relative strength.",
    },
  ],
  formula: "Rating based on ACSM normative percentile tables by age and gender",
};
