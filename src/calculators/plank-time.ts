import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const plankTimeCalculator: CalculatorDefinition = {
  slug: "plank-time-calculator",
  title: "Plank Time Calculator",
  description:
    "Free plank hold fitness assessment calculator. Evaluate your core strength and endurance based on your plank hold time compared to age and gender norms.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "plank test calculator",
    "plank hold time",
    "core strength test",
    "plank fitness assessment",
    "isometric core test",
  ],
  variants: [
    {
      id: "assess",
      name: "Plank Hold Assessment",
      description: "Rate your plank hold time against fitness norms",
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
        { name: "minutes", label: "Minutes", type: "number", placeholder: "e.g. 1", min: 0 },
        { name: "seconds", label: "Seconds", type: "number", placeholder: "e.g. 30", min: 0, max: 59 },
        { name: "weight", label: "Body Weight (lbs)", type: "number", placeholder: "e.g. 170" },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = parseInt(inputs.age as string);
        const mins = (inputs.minutes as number) || 0;
        const secs = (inputs.seconds as number) || 0;
        const weight = inputs.weight as number;

        const totalSec = mins * 60 + secs;
        if (totalSec <= 0) return null;

        // Norms in seconds [poor, below avg, average, good, excellent]
        const maleNorms: Record<number, number[]> = {
          18: [15, 30, 60, 120, 180],
          26: [15, 30, 55, 110, 170],
          36: [10, 25, 50, 100, 150],
          46: [10, 20, 40, 90, 135],
          56: [5, 15, 35, 75, 120],
          65: [5, 10, 25, 60, 100],
        };
        const femaleNorms: Record<number, number[]> = {
          18: [10, 25, 50, 100, 160],
          26: [10, 25, 45, 90, 150],
          36: [10, 20, 40, 85, 130],
          46: [5, 15, 35, 75, 120],
          56: [5, 10, 30, 60, 100],
          65: [5, 10, 20, 50, 80],
        };

        const norms = gender === "male" ? maleNorms[age] : femaleNorms[age];
        let rating = "Not Rated";
        if (norms) {
          if (totalSec >= norms[4]) rating = "Excellent";
          else if (totalSec >= norms[3]) rating = "Good";
          else if (totalSec >= norms[2]) rating = "Average";
          else if (totalSec >= norms[1]) rating = "Below Average";
          else rating = "Needs Improvement";
        }

        const timeFormatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

        // Estimate calories (MET of ~4 for planking)
        const weightKg = weight ? weight * 0.453592 : 70;
        const calBurned = 4 * weightKg * (totalSec / 3600);

        return {
          primary: { label: "Rating", value: rating },
          details: [
            { label: "Hold Time", value: timeFormatted },
            { label: "Total Seconds", value: formatNumber(totalSec, 0) },
            { label: "Age Group Avg", value: norms ? `${Math.floor(norms[2] / 60)}m ${norms[2] % 60}s` : "N/A" },
            { label: "Target for Good", value: norms ? `${Math.floor(norms[3] / 60)}m ${norms[3] % 60}s` : "N/A" },
            { label: "Est. Calories Burned", value: formatNumber(calBurned, 1) },
          ],
          note: "Maintain proper form: straight line from head to heels, core engaged, no sagging or piking. Stop the test when form breaks down.",
        };
      },
    },
  ],
  relatedSlugs: ["push-up-test-calculator", "sit-up-test-calculator", "body-fat-calculator"],
  faq: [
    {
      question: "How long should I be able to hold a plank?",
      answer:
        "For the general population: under 30 seconds is below average, 30-60 seconds is average, 1-2 minutes is good, and 2+ minutes is excellent. Most fitness professionals recommend aiming for at least 60 seconds as a baseline fitness goal.",
    },
    {
      question: "Is a longer plank always better?",
      answer:
        "Not necessarily. Once you can hold a plank for 2 minutes with perfect form, it is more beneficial to progress to harder variations (side planks, weighted planks, dynamic planks) rather than simply holding longer. Excessive hold times offer diminishing returns.",
    },
    {
      question: "How many calories does planking burn?",
      answer:
        "Planking burns approximately 2-5 calories per minute depending on body weight. A 170-lb person burns about 4 calories per minute. While not a high-calorie-burning exercise, planking builds core stability essential for overall fitness.",
    },
  ],
  formula: "Calories = MET (4.0) × Weight (kg) × Time (hours) | Rating from age/gender normative tables",
};
