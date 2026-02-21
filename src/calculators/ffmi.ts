import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ffmiCalculator: CalculatorDefinition = {
  slug: "ffmi-calculator",
  title: "FFMI Calculator",
  description:
    "Free Fat-Free Mass Index (FFMI) calculator. Calculate your FFMI to assess muscular development relative to height. Compare against natural limits for men and women.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "ffmi calculator",
    "fat free mass index",
    "ffmi",
    "muscle mass calculator",
    "natural limit calculator",
    "lean mass index",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate FFMI",
      description: "Calculate your Fat-Free Mass Index",
      fields: [
        { name: "weight", label: "Weight", type: "number", placeholder: "e.g. 80", suffix: "kg" },
        { name: "bodyFat", label: "Body Fat", type: "number", placeholder: "e.g. 15", suffix: "%" },
        { name: "height", label: "Height", type: "number", placeholder: "e.g. 178", suffix: "cm" },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const bodyFat = inputs.bodyFat as number;
        const height = inputs.height as number;
        if (!weight || bodyFat === undefined || bodyFat === null || !height) return null;

        const leanMass = weight * (1 - bodyFat / 100);
        const heightM = height / 100;
        const ffmi = leanMass / (heightM * heightM);
        const adjustedFfmi = ffmi + 6.1 * (1.8 - heightM);

        let category: string;
        if (adjustedFfmi < 18) category = "Below average";
        else if (adjustedFfmi < 20) category = "Average";
        else if (adjustedFfmi < 22) category = "Above average";
        else if (adjustedFfmi < 25) category = "Excellent / Near natural limit";
        else category = "Suspicious / Above natural limit (~25 for men)";

        return {
          primary: { label: "Adjusted FFMI", value: formatNumber(adjustedFfmi, 1) },
          details: [
            { label: "FFMI (unadjusted)", value: formatNumber(ffmi, 1) },
            { label: "Lean Body Mass", value: `${formatNumber(leanMass, 1)} kg` },
            { label: "Fat Mass", value: `${formatNumber(weight - leanMass, 1)} kg` },
            { label: "Category", value: category },
            { label: "Natural Limit (Men)", value: "~25" },
            { label: "Natural Limit (Women)", value: "~22" },
          ],
          note: "FFMI above 25 for men or 22 for women is extremely rare without performance-enhancing substances.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator", "lean-body-mass-calculator"],
  faq: [
    {
      question: "What is FFMI?",
      answer:
        "Fat-Free Mass Index (FFMI) measures the amount of muscle mass relative to height. It is similar to BMI but focuses on lean tissue, making it more useful for evaluating muscular development.",
    },
    {
      question: "What is a good FFMI score?",
      answer:
        "For men: 18-20 is average, 20-22 is above average, 22-25 is excellent. For women: 15-17 is average, 17-19 is above average, 19-22 is excellent. Values above 25 (men) or 22 (women) are considered near the natural limit.",
    },
    {
      question: "What is the natural FFMI limit?",
      answer:
        "Research suggests that an FFMI of about 25 for men and 22 for women represents the approximate upper limit achievable without performance-enhancing drugs. A landmark 1995 study by Kouri et al. found that non-steroid users rarely exceeded 25.",
    },
  ],
  formula:
    "Lean Mass = Weight × (1 - Body Fat% / 100) | FFMI = Lean Mass / Height(m)² | Adjusted FFMI = FFMI + 6.1 × (1.8 - Height(m))",
};
