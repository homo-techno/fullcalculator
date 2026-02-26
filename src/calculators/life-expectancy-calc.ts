import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lifeExpectancyCalculator: CalculatorDefinition = {
  slug: "life-expectancy-calc",
  title: "Life Expectancy Calculator",
  description:
    "Free online life expectancy estimator based on age, sex, lifestyle, and health factors.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "life expectancy",
    "longevity",
    "lifespan",
    "mortality",
    "age prediction",
    "health assessment",
    "death risk",
  ],
  variants: [
    {
      id: "life-expectancy",
      name: "Estimate Life Expectancy",
      description:
        "Estimate remaining life expectancy based on demographic and lifestyle factors.",
      fields: [
        {
          name: "age",
          label: "Current Age",
          type: "number",
          placeholder: "e.g. 40",
          suffix: "years",
        },
        {
          name: "sex",
          label: "Biological Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "smoking",
          label: "Smoking Status",
          type: "select",
          options: [
            { label: "Never smoked", value: "never" },
            { label: "Former smoker (quit 5+ years)", value: "former" },
            { label: "Current smoker", value: "current" },
          ],
        },
        {
          name: "exercise",
          label: "Exercise Level",
          type: "select",
          options: [
            { label: "Sedentary (little or no exercise)", value: "sedentary" },
            { label: "Light (1-2 days/week)", value: "light" },
            { label: "Moderate (3-5 days/week)", value: "moderate" },
            { label: "Active (6-7 days/week)", value: "active" },
          ],
        },
        {
          name: "bmi",
          label: "BMI",
          type: "number",
          placeholder: "e.g. 25",
          suffix: "kg/m²",
        },
        {
          name: "alcohol",
          label: "Alcohol Consumption",
          type: "select",
          options: [
            { label: "None", value: "none" },
            { label: "Light (1-7 drinks/week)", value: "light" },
            { label: "Moderate (8-14 drinks/week)", value: "moderate" },
            { label: "Heavy (15+ drinks/week)", value: "heavy" },
          ],
        },
        {
          name: "diet",
          label: "Diet Quality",
          type: "select",
          options: [
            { label: "Poor (processed foods, high sugar)", value: "poor" },
            { label: "Average (some fresh foods)", value: "average" },
            { label: "Good (mostly whole foods)", value: "good" },
            { label: "Excellent (Mediterranean/plant-based)", value: "excellent" },
          ],
        },
        {
          name: "familyHistory",
          label: "Family Longevity",
          type: "select",
          options: [
            { label: "Parents/grandparents died before 70", value: "poor" },
            { label: "Average family lifespan (70-80)", value: "average" },
            { label: "Long-lived family (80+)", value: "good" },
          ],
        },
        {
          name: "chronicConditions",
          label: "Chronic Conditions",
          type: "select",
          options: [
            { label: "None", value: "0" },
            { label: "1 condition (e.g., hypertension)", value: "1" },
            { label: "2 conditions", value: "2" },
            { label: "3 or more conditions", value: "3" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = parseFloat(inputs.age as string) || 0;
        const bmi = parseFloat(inputs.bmi as string) || 25;
        const sex = inputs.sex as string;

        if (age <= 0 || age > 120) return null;

        // Baseline life expectancy (US averages, approximate)
        let baseLE = sex === "female" ? 81 : 76;

        // Remaining years from current age
        let adjustment = 0;

        // Smoking
        if (inputs.smoking === "current") adjustment -= 10;
        else if (inputs.smoking === "former") adjustment -= 3;

        // Exercise
        if (inputs.exercise === "active") adjustment += 4;
        else if (inputs.exercise === "moderate") adjustment += 3;
        else if (inputs.exercise === "light") adjustment += 1;
        else adjustment -= 3; // sedentary

        // BMI
        if (bmi > 40) adjustment -= 8;
        else if (bmi > 35) adjustment -= 5;
        else if (bmi > 30) adjustment -= 3;
        else if (bmi > 25) adjustment -= 1;
        else if (bmi < 18.5) adjustment -= 2;

        // Alcohol
        if (inputs.alcohol === "heavy") adjustment -= 5;
        else if (inputs.alcohol === "moderate") adjustment -= 1;
        else if (inputs.alcohol === "light") adjustment += 1; // J-curve

        // Diet
        if (inputs.diet === "excellent") adjustment += 4;
        else if (inputs.diet === "good") adjustment += 2;
        else if (inputs.diet === "poor") adjustment -= 3;

        // Family history
        if (inputs.familyHistory === "good") adjustment += 3;
        else if (inputs.familyHistory === "poor") adjustment -= 4;

        // Chronic conditions
        const conditions = parseFloat(inputs.chronicConditions as string) || 0;
        adjustment -= conditions * 2.5;

        const estimatedLE = Math.max(age + 1, baseLE + adjustment);
        const remainingYears = Math.max(1, estimatedLE - age);

        // Healthy life expectancy (roughly 85% of remaining)
        const healthyYears = remainingYears * 0.85;

        return {
          primary: {
            label: "Estimated Life Expectancy",
            value: formatNumber(estimatedLE),
            suffix: "years",
          },
          details: [
            {
              label: "Remaining Years",
              value: formatNumber(remainingYears),
            },
            {
              label: "Healthy Life Years (est.)",
              value: formatNumber(healthyYears),
            },
            {
              label: "Lifestyle Adjustment",
              value: (adjustment >= 0 ? "+" : "") + formatNumber(adjustment) + " years",
            },
            {
              label: "Baseline Life Expectancy",
              value: formatNumber(baseLE) + " years",
            },
            {
              label: "Current Age",
              value: formatNumber(age) + " years",
            },
          ],
          note: "This is a rough estimate for educational purposes only. Individual life expectancy is influenced by genetics, environment, medical care, and many factors not captured here.",
        };
      },
    },
  ],
  relatedSlugs: ["ascvd-risk", "smoking-recovery", "pack-year-calc"],
  faq: [
    {
      question: "How accurate is a life expectancy calculator?",
      answer:
        "Life expectancy calculators provide rough estimates based on population averages and known risk factors. They cannot predict individual outcomes. Actual lifespan depends on genetics, access to healthcare, environmental factors, and unforeseen events.",
    },
    {
      question: "What factors most influence life expectancy?",
      answer:
        "The strongest modifiable factors are smoking (can reduce life expectancy by 10+ years), obesity, physical activity, alcohol consumption, and diet quality. Non-modifiable factors include genetics, sex, and pre-existing medical conditions.",
    },
    {
      question: "What is healthy life expectancy?",
      answer:
        "Healthy life expectancy (HALE) is the number of years a person can expect to live in good health, free of disability or chronic disease. It is typically 10-15% shorter than total life expectancy.",
    },
  ],
  formula:
    "Estimated LE = Baseline_LE(sex) + Σ(lifestyle_adjustments). Adjustments include: smoking (-10 to 0), exercise (-3 to +4), BMI (-8 to 0), alcohol (-5 to +1), diet (-3 to +4), family history (-4 to +3), chronic conditions (-2.5 per condition).",
};
