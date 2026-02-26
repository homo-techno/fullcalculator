import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pregnancyWeightGainCalculator: CalculatorDefinition = {
  slug: "pregnancy-weight-gain",
  title: "Pregnancy Weight Gain Tracker",
  description:
    "Free online pregnancy weight gain calculator by trimester based on IOM guidelines and pre-pregnancy BMI.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "pregnancy",
    "weight gain",
    "trimester",
    "prenatal",
    "IOM guidelines",
    "gestational weight",
    "BMI pregnancy",
    "maternal health",
  ],
  variants: [
    {
      id: "pregnancy-weight",
      name: "Pregnancy Weight Gain Assessment",
      description:
        "Track your pregnancy weight gain against IOM (Institute of Medicine) recommendations by trimester.",
      fields: [
        {
          name: "prePregnancyWeight",
          label: "Pre-Pregnancy Weight",
          type: "number",
          placeholder: "e.g. 65",
          suffix: "kg",
        },
        {
          name: "currentWeight",
          label: "Current Weight",
          type: "number",
          placeholder: "e.g. 72",
          suffix: "kg",
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 165",
          suffix: "cm",
        },
        {
          name: "gestationalWeek",
          label: "Current Gestational Week",
          type: "number",
          placeholder: "e.g. 24",
          suffix: "weeks",
          min: 1,
          max: 42,
        },
        {
          name: "pregnancyType",
          label: "Pregnancy Type",
          type: "select",
          options: [
            { label: "Singleton", value: "singleton" },
            { label: "Twins", value: "twins" },
          ],
        },
      ],
      calculate: (inputs) => {
        const preWeight = parseFloat(inputs.prePregnancyWeight as string) || 0;
        const currentWeight = parseFloat(inputs.currentWeight as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const week = parseFloat(inputs.gestationalWeek as string) || 0;
        const pregnancyType = inputs.pregnancyType as string;

        if (preWeight <= 0 || currentWeight <= 0 || height <= 0 || week <= 0) return null;

        const heightM = height / 100;
        const preBMI = preWeight / (heightM * heightM);
        const actualGain = currentWeight - preWeight;

        // IOM 2009 guidelines for singleton pregnancies
        let bmiCategory: string;
        let totalGainLow: number;
        let totalGainHigh: number;
        let weeklyRate2nd3rd: number; // kg/week in 2nd and 3rd trimesters

        if (pregnancyType === "twins") {
          // Twin pregnancy guidelines
          if (preBMI < 18.5) {
            bmiCategory = "Underweight";
            totalGainLow = 22.7;
            totalGainHigh = 28.1;
            weeklyRate2nd3rd = 0.68;
          } else if (preBMI < 25) {
            bmiCategory = "Normal weight";
            totalGainLow = 16.8;
            totalGainHigh = 24.5;
            weeklyRate2nd3rd = 0.57;
          } else if (preBMI < 30) {
            bmiCategory = "Overweight";
            totalGainLow = 14.1;
            totalGainHigh = 22.7;
            weeklyRate2nd3rd = 0.45;
          } else {
            bmiCategory = "Obese";
            totalGainLow = 11.3;
            totalGainHigh = 19.1;
            weeklyRate2nd3rd = 0.39;
          }
        } else {
          // Singleton
          if (preBMI < 18.5) {
            bmiCategory = "Underweight";
            totalGainLow = 12.5;
            totalGainHigh = 18.0;
            weeklyRate2nd3rd = 0.51;
          } else if (preBMI < 25) {
            bmiCategory = "Normal weight";
            totalGainLow = 11.5;
            totalGainHigh = 16.0;
            weeklyRate2nd3rd = 0.42;
          } else if (preBMI < 30) {
            bmiCategory = "Overweight";
            totalGainLow = 7.0;
            totalGainHigh = 11.5;
            weeklyRate2nd3rd = 0.28;
          } else {
            bmiCategory = "Obese";
            totalGainLow = 5.0;
            totalGainHigh = 9.0;
            weeklyRate2nd3rd = 0.22;
          }
        }

        // Expected gain by current week
        // First trimester (weeks 1-13): ~0.5-2 kg total
        // Second/third trimester (weeks 14-40): weekly rate
        let expectedGainLow: number;
        let expectedGainHigh: number;
        const firstTriGain = 1.5; // approximate first trimester gain

        if (week <= 13) {
          const fraction = week / 13;
          expectedGainLow = firstTriGain * fraction * 0.5;
          expectedGainHigh = firstTriGain * fraction * 1.5;
        } else {
          const weeksInto2nd3rd = week - 13;
          expectedGainLow = 0.5 + weeksInto2nd3rd * weeklyRate2nd3rd * 0.8;
          expectedGainHigh = 2.0 + weeksInto2nd3rd * weeklyRate2nd3rd * 1.2;
        }

        let assessment: string;
        if (actualGain < expectedGainLow) {
          assessment = "Below recommended range - consider nutritional assessment";
        } else if (actualGain <= expectedGainHigh) {
          assessment = "Within recommended range";
        } else {
          assessment = "Above recommended range - discuss with provider";
        }

        // Trimester
        let trimester: string;
        if (week <= 13) trimester = "First trimester";
        else if (week <= 26) trimester = "Second trimester";
        else trimester = "Third trimester";

        // Remaining recommended gain
        const remainingWeeks = Math.max(0, 40 - week);
        const remainingGainLow = Math.max(0, totalGainLow - actualGain);
        const remainingGainHigh = Math.max(0, totalGainHigh - actualGain);
        const weeklyNeeded = remainingWeeks > 0 ? (totalGainLow + totalGainHigh) / 2 - actualGain : 0;
        const weeklyRate = remainingWeeks > 0 ? weeklyNeeded / remainingWeeks : 0;

        return {
          primary: {
            label: "Weight Gained So Far",
            value: formatNumber(actualGain),
            suffix: "kg",
          },
          details: [
            { label: "Assessment", value: assessment },
            { label: "Trimester", value: trimester + " (week " + formatNumber(week) + ")" },
            { label: "Pre-Pregnancy BMI", value: formatNumber(preBMI) + " kg/m\u00B2 (" + bmiCategory + ")" },
            { label: "IOM Total Gain Range", value: formatNumber(totalGainLow) + " - " + formatNumber(totalGainHigh) + " kg" },
            { label: "Expected Gain by Now", value: formatNumber(expectedGainLow) + " - " + formatNumber(expectedGainHigh) + " kg" },
            { label: "Remaining Gain Needed", value: formatNumber(remainingGainLow) + " - " + formatNumber(remainingGainHigh) + " kg" },
            { label: "Suggested Weekly Rate", value: formatNumber(weeklyRate) + " kg/week" },
            { label: "Weeks Remaining", value: formatNumber(remainingWeeks) + " weeks" },
          ],
          note: "Based on 2009 IOM (Institute of Medicine) guidelines. Individual recommendations may vary. Always discuss weight gain goals with your OB/GYN or midwife.",
        };
      },
    },
  ],
  relatedSlugs: ["body-surface-area", "life-expectancy-calc", "baby-percentile"],
  faq: [
    {
      question: "How much weight should I gain during pregnancy?",
      answer:
        "The IOM recommends total weight gain based on pre-pregnancy BMI: Underweight (BMI < 18.5): 12.5-18 kg (28-40 lbs), Normal weight (BMI 18.5-24.9): 11.5-16 kg (25-35 lbs), Overweight (BMI 25-29.9): 7-11.5 kg (15-25 lbs), Obese (BMI >= 30): 5-9 kg (11-20 lbs).",
    },
    {
      question: "When does most pregnancy weight gain occur?",
      answer:
        "Most weight gain occurs in the second and third trimesters. During the first trimester, typical gain is only 0.5-2 kg (1-4.5 lbs). During the second and third trimesters, gain is more steady, typically 0.2-0.5 kg (0.5-1 lb) per week depending on pre-pregnancy BMI.",
    },
    {
      question: "What happens if I gain too much or too little weight?",
      answer:
        "Excessive weight gain increases the risk of gestational diabetes, preeclampsia, cesarean delivery, and postpartum weight retention. Insufficient weight gain increases the risk of preterm birth, low birth weight, and failure to initiate breastfeeding. Both extremes can affect the baby's long-term health.",
    },
  ],
  formula:
    "IOM 2009 Guidelines - Total gain by pre-pregnancy BMI: Underweight: 12.5-18 kg, Normal: 11.5-16 kg, Overweight: 7-11.5 kg, Obese: 5-9 kg. Weekly rate (2nd/3rd trimester): 0.51 kg (underweight), 0.42 kg (normal), 0.28 kg (overweight), 0.22 kg (obese).",
};
