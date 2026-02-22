import type { CalculatorDefinition } from "./types";

export const pregnancyBmiCalculator: CalculatorDefinition = {
  slug: "pregnancy-bmi-calculator",
  title: "Pregnancy BMI Calculator",
  description:
    "Free pregnancy BMI calculator. Calculate your pre-pregnancy BMI and get recommended weight gain ranges for a healthy pregnancy based on IOM guidelines.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pregnancy bmi",
    "pregnancy weight gain",
    "bmi during pregnancy",
    "healthy pregnancy weight",
    "pregnancy weight gain calculator",
  ],
  variants: [
    {
      id: "pregnancy-bmi",
      name: "Pregnancy BMI & Weight Gain",
      description: "Calculate pre-pregnancy BMI and recommended weight gain",
      fields: [
        {
          name: "weight",
          label: "Pre-Pregnancy Weight",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "lbs",
          min: 80,
          max: 400,
        },
        {
          name: "heightFeet",
          label: "Height (feet)",
          type: "number",
          placeholder: "e.g. 5",
          min: 4,
          max: 7,
        },
        {
          name: "heightInches",
          label: "Height (inches)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 11,
          defaultValue: 0,
        },
        {
          name: "currentWeek",
          label: "Current Pregnancy Week",
          type: "number",
          placeholder: "e.g. 20",
          min: 1,
          max: 42,
          defaultValue: 1,
        },
        {
          name: "twins",
          label: "Pregnancy Type",
          type: "select",
          options: [
            { label: "Single Baby", value: "single" },
            { label: "Twins", value: "twins" },
          ],
          defaultValue: "single",
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const feet = inputs.heightFeet as number;
        const inches = (inputs.heightInches as number) || 0;
        const week = (inputs.currentWeek as number) || 1;
        const twins = inputs.twins as string;
        if (!weight || !feet) return null;

        const totalInches = feet * 12 + inches;
        const bmi = (weight / (totalInches * totalInches)) * 703;

        let category: string;
        let gainLow: number;
        let gainHigh: number;
        let weeklyGain2nd3rd: string;

        if (twins === "twins") {
          if (bmi < 18.5) {
            category = "Underweight"; gainLow = 50; gainHigh = 62;
          } else if (bmi < 25) {
            category = "Normal Weight"; gainLow = 37; gainHigh = 54;
          } else if (bmi < 30) {
            category = "Overweight"; gainLow = 31; gainHigh = 50;
          } else {
            category = "Obese"; gainLow = 25; gainHigh = 42;
          }
          weeklyGain2nd3rd = "~1.5 lbs/week";
        } else {
          if (bmi < 18.5) {
            category = "Underweight"; gainLow = 28; gainHigh = 40; weeklyGain2nd3rd = "1.0-1.3 lbs/week";
          } else if (bmi < 25) {
            category = "Normal Weight"; gainLow = 25; gainHigh = 35; weeklyGain2nd3rd = "0.8-1.0 lbs/week";
          } else if (bmi < 30) {
            category = "Overweight"; gainLow = 15; gainHigh = 25; weeklyGain2nd3rd = "0.5-0.7 lbs/week";
          } else {
            category = "Obese"; gainLow = 11; gainHigh = 20; weeklyGain2nd3rd = "0.4-0.6 lbs/week";
          }
        }

        // Estimate where they should be now
        const fractionComplete = week / 40;
        const expectedGainLow = Math.round(gainLow * fractionComplete);
        const expectedGainHigh = Math.round(gainHigh * fractionComplete);

        return {
          primary: {
            label: "Pre-Pregnancy BMI",
            value: bmi.toFixed(1),
          },
          details: [
            { label: "BMI Category", value: category },
            { label: "Total Recommended Gain", value: `${gainLow}-${gainHigh} lbs` },
            { label: "Rate (2nd & 3rd Trimester)", value: weeklyGain2nd3rd },
            { label: `Expected Gain by Week ${week}`, value: `${expectedGainLow}-${expectedGainHigh} lbs` },
            { label: `Target Weight at Week ${week}`, value: `${weight + expectedGainLow}-${weight + expectedGainHigh} lbs` },
            { label: "Target Weight at Delivery", value: `${weight + gainLow}-${weight + gainHigh} lbs` },
            { label: "First Trimester Gain (typical)", value: "1-4.5 lbs total" },
          ],
          note: "Recommended weight gain is based on IOM (Institute of Medicine) guidelines. Individual needs vary. Consult your healthcare provider for personalized advice, especially if you have pre-existing conditions.",
        };
      },
    },
  ],
  relatedSlugs: ["bmi-calculator", "pregnancy-calculator", "pregnancy-calorie-calculator"],
  faq: [
    {
      question: "How much weight should I gain during pregnancy?",
      answer:
        "The IOM recommends: Underweight (BMI <18.5): 28-40 lbs, Normal weight (BMI 18.5-24.9): 25-35 lbs, Overweight (BMI 25-29.9): 15-25 lbs, Obese (BMI 30+): 11-20 lbs. For twins, add approximately 10-15 lbs to each range.",
    },
    {
      question: "When do you gain the most weight during pregnancy?",
      answer:
        "Most weight gain occurs during the 2nd and 3rd trimesters. In the first trimester, total gain is typically 1-4.5 lbs. After that, steady weekly gain is expected based on your pre-pregnancy BMI category.",
    },
    {
      question: "Is BMI accurate during pregnancy?",
      answer:
        "BMI is most meaningful when calculated using your pre-pregnancy weight. During pregnancy, weight gain includes the baby, placenta, amniotic fluid, increased blood volume, and breast tissue, so current BMI isn't a useful health measure.",
    },
  ],
  formula:
    "BMI = (Weight in lbs / Height in inches^2) x 703 | Recommended Gain = Based on IOM guidelines by BMI category | Expected Gain at Week X = Total Recommended x (Week / 40)",
};
