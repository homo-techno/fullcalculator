import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flexibilityTestCalculator: CalculatorDefinition = {
  slug: "flexibility-test-calculator",
  title: "Flexibility Test Calculator",
  description:
    "Free sit-and-reach flexibility test calculator. Assess your lower back and hamstring flexibility using the standard sit-and-reach test norms.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "flexibility test",
    "sit and reach test",
    "hamstring flexibility",
    "flexibility calculator",
    "sit and reach norms",
  ],
  variants: [
    {
      id: "sit-reach",
      name: "Sit-and-Reach Test",
      description: "Standard sit-and-reach flexibility assessment",
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
            { label: "60+", value: "60" },
          ],
        },
        {
          name: "unit",
          label: "Measurement Unit",
          type: "select",
          options: [
            { label: "Centimeters", value: "cm" },
            { label: "Inches", value: "in" },
          ],
          defaultValue: "cm",
        },
        { name: "reach", label: "Reach Distance", type: "number", placeholder: "e.g. 30", step: 0.5 },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const age = parseInt(inputs.age as string);
        const unit = inputs.unit as string;
        let reach = inputs.reach as number;
        if (reach === undefined || reach === null) return null;

        // Convert inches to cm if needed
        const reachCm = unit === "in" ? reach * 2.54 : reach;
        const reachIn = unit === "cm" ? reach / 2.54 : reach;

        // Norms in cm [poor, below avg, average, good, excellent]
        const maleNorms: Record<number, number[]> = {
          20: [20, 25, 30, 34, 40],
          30: [18, 23, 28, 33, 38],
          40: [15, 20, 25, 29, 35],
          50: [13, 18, 24, 28, 33],
          60: [10, 15, 20, 25, 30],
        };
        const femaleNorms: Record<number, number[]> = {
          20: [23, 28, 33, 37, 43],
          30: [22, 27, 32, 36, 41],
          40: [19, 24, 29, 34, 38],
          50: [17, 22, 27, 32, 36],
          60: [15, 20, 25, 30, 34],
        };

        const norms = gender === "male" ? maleNorms[age] : femaleNorms[age];
        let rating = "Not Rated";
        if (norms) {
          if (reachCm >= norms[4]) rating = "Excellent";
          else if (reachCm >= norms[3]) rating = "Good";
          else if (reachCm >= norms[2]) rating = "Average";
          else if (reachCm >= norms[1]) rating = "Below Average";
          else rating = "Needs Improvement";
        }

        // 15 inches (38 cm) is the baseline (feet position) on standard box
        const pastToes = reachCm - 26; // standard box has 26cm at toe level

        return {
          primary: { label: "Rating", value: rating },
          details: [
            { label: "Reach (cm)", value: formatNumber(reachCm, 1) },
            { label: "Reach (inches)", value: formatNumber(reachIn, 1) },
            { label: "Past Toes", value: `${formatNumber(pastToes, 1)} cm` },
            { label: "Age Group Avg", value: norms ? `${formatNumber(norms[2], 0)} cm` : "N/A" },
            { label: "Target for Good", value: norms ? `${formatNumber(norms[3], 0)} cm` : "N/A" },
          ],
          note: "Sit on the floor with legs straight and feet against the box. Reach forward slowly as far as possible. Record the best of 3 attempts. Warm up before testing.",
        };
      },
    },
  ],
  relatedSlugs: ["push-up-test-calculator", "sit-up-test-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What does the sit-and-reach test measure?",
      answer:
        "The sit-and-reach test primarily measures hamstring and lower back flexibility. It's one of the most common flexibility assessments used in fitness testing batteries worldwide, including the ACSM, YMCA, and CSEP protocols.",
    },
    {
      question: "What is a good sit-and-reach score?",
      answer:
        "For males aged 20-29: 25-30 cm is average, 34+ cm is good. For females aged 20-29: 28-33 cm is average, 37+ cm is good. Scores above 40 cm for males and 43 cm for females are excellent.",
    },
    {
      question: "How can I improve my flexibility?",
      answer:
        "Stretch regularly (daily if possible), hold stretches for 15-30 seconds, and include both static and dynamic stretching. Yoga and Pilates are excellent for improving overall flexibility. Improvements are typically seen within 4-6 weeks of consistent stretching.",
    },
  ],
  formula: "Rating based on ACSM sit-and-reach normative tables by age and gender | Standard box baseline at 26 cm (foot level)",
};
