import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childHeightPredictorCalculator: CalculatorDefinition = {
  slug: "child-height-predictor-calculator",
  title: "Child Adult Height Predictor Calculator",
  description:
    "Free child height predictor calculator. Estimate your child's adult height using the mid-parental height method and bone age formulas.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "child height predictor",
    "how tall will my child be",
    "adult height calculator",
    "predicted height",
    "mid-parental height",
  ],
  variants: [
    {
      id: "mid-parental",
      name: "Mid-Parental Height Method",
      description: "Predict adult height from parent heights",
      fields: [
        {
          name: "childGender",
          label: "Child's Gender",
          type: "select",
          options: [
            { label: "Boy", value: "boy" },
            { label: "Girl", value: "girl" },
          ],
          defaultValue: "boy",
        },
        {
          name: "fatherHeight",
          label: "Father's Height (inches)",
          type: "number",
          placeholder: "e.g. 70",
          min: 55,
          max: 84,
        },
        {
          name: "motherHeight",
          label: "Mother's Height (inches)",
          type: "number",
          placeholder: "e.g. 64",
          min: 48,
          max: 78,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.childGender as string;
        const fatherIn = inputs.fatherHeight as number;
        const motherIn = inputs.motherHeight as number;
        if (!fatherIn || !motherIn) return null;

        let predictedIn: number;
        if (gender === "boy") {
          // Boy: (Father + Mother + 5) / 2
          predictedIn = (fatherIn + motherIn + 5) / 2;
        } else {
          // Girl: (Father + Mother - 5) / 2
          predictedIn = (fatherIn + motherIn - 5) / 2;
        }

        const rangeIn = 2; // +/- 2 inches (typical margin)
        const predictedFt = Math.floor(predictedIn / 12);
        const predictedRemIn = predictedIn % 12;
        const lowFt = Math.floor((predictedIn - rangeIn) / 12);
        const lowRemIn = (predictedIn - rangeIn) % 12;
        const highFt = Math.floor((predictedIn + rangeIn) / 12);
        const highRemIn = (predictedIn + rangeIn) % 12;

        const predictedCm = predictedIn * 2.54;

        return {
          primary: {
            label: "Predicted Adult Height",
            value: `${predictedFt}'${formatNumber(predictedRemIn, 1)}"`,
          },
          details: [
            { label: "Predicted Height", value: `${formatNumber(predictedIn, 1)} inches (${formatNumber(predictedCm, 1)} cm)` },
            { label: "Likely Range", value: `${lowFt}'${formatNumber(lowRemIn, 1)}" to ${highFt}'${formatNumber(highRemIn, 1)}" (± 2 inches)` },
            { label: "Father's Height", value: `${Math.floor(fatherIn / 12)}'${formatNumber(fatherIn % 12, 0)}"` },
            { label: "Mother's Height", value: `${Math.floor(motherIn / 12)}'${formatNumber(motherIn % 12, 0)}"` },
            { label: "Method", value: "Mid-Parental Height (Tanner)" },
          ],
          note: "The mid-parental height method is accurate to within ±2 inches for most children. Actual height is influenced by nutrition, health, exercise, and other genetic factors beyond parental height. This method works best for children growing along normal percentiles.",
        };
      },
    },
    {
      id: "double-at-two",
      name: "Double at Two Method",
      description: "Estimate adult height from height at age 2",
      fields: [
        {
          name: "childGender",
          label: "Child's Gender",
          type: "select",
          options: [
            { label: "Boy", value: "boy" },
            { label: "Girl", value: "girl" },
          ],
          defaultValue: "boy",
        },
        {
          name: "heightAtTwo",
          label: "Height at Age 2 (inches)",
          type: "number",
          placeholder: "e.g. 34",
          min: 28,
          max: 42,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.childGender as string;
        const heightAtTwo = inputs.heightAtTwo as number;
        if (!heightAtTwo) return null;

        // Boys: double height at 2
        // Girls: height at 18 months doubled, or height at 2 × 2 is slightly less accurate
        let predictedIn: number;
        if (gender === "boy") {
          predictedIn = heightAtTwo * 2;
        } else {
          predictedIn = heightAtTwo * 2 * 0.985; // Girls reach slightly less than 2x
        }

        const predictedFt = Math.floor(predictedIn / 12);
        const predictedRemIn = predictedIn % 12;
        const predictedCm = predictedIn * 2.54;

        return {
          primary: {
            label: "Predicted Adult Height",
            value: `${predictedFt}'${formatNumber(predictedRemIn, 1)}"`,
          },
          details: [
            { label: "Predicted Height", value: `${formatNumber(predictedIn, 1)} inches (${formatNumber(predictedCm, 1)} cm)` },
            { label: "Height at Age 2", value: `${formatNumber(heightAtTwo, 1)} inches` },
            { label: "Method", value: "Double at Two" },
            { label: "Accuracy", value: "±2-3 inches (less precise than mid-parental method)" },
          ],
          note: "The 'double at two' rule is a rough estimate. Boys reach about half their adult height by age 2, girls by about 18 months. This method is less accurate than the mid-parental height method.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-height-percentile-calculator", "baby-growth-calculator", "bmi-calculator"],
  faq: [
    {
      question: "How accurate is the mid-parental height prediction?",
      answer:
        "The mid-parental height method predicts adult height within ±2 inches (5 cm) for about 68% of children. It is the most commonly used prediction method in pediatrics. Accuracy decreases for children with unusual growth patterns or medical conditions affecting growth.",
    },
    {
      question: "Can nutrition affect my child's predicted height?",
      answer:
        "Yes. Adequate nutrition, especially protein, calcium, vitamin D, and zinc, is essential for reaching genetic height potential. Chronic malnutrition or certain medical conditions can prevent a child from reaching their predicted height. Conversely, excess nutrition does not increase height beyond genetic potential.",
    },
    {
      question: "At what age do children stop growing?",
      answer:
        "Girls typically stop growing in height around age 14-16, about 2 years after their first period. Boys typically stop growing around age 16-18. Growth plates close at these ages, ending height increase. Some boys continue gaining small amounts until age 21.",
    },
  ],
  formula:
    "Mid-Parental Method: Boys = (Father's Height + Mother's Height + 5) / 2 | Girls = (Father's Height + Mother's Height - 5) / 2 | Double at Two: Boys ≈ Height at 2 × 2 | Girls ≈ Height at 2 × 2 × 0.985",
};
