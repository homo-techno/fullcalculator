import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyWeightPercentileCalculator: CalculatorDefinition = {
  slug: "baby-weight-percentile-calculator",
  title: "Baby Weight Percentile Calculator",
  description:
    "Free baby weight percentile calculator. Track your baby's weight against WHO growth charts by age and gender to see where they fall.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby weight percentile",
    "infant weight chart",
    "baby growth percentile",
    "WHO weight chart",
    "baby weight tracker",
  ],
  variants: [
    {
      id: "weight-percentile",
      name: "Weight Percentile by Age",
      description: "Compare your baby's weight to WHO growth standards",
      fields: [
        {
          name: "gender",
          label: "Baby's Gender",
          type: "select",
          options: [
            { label: "Boy", value: "boy" },
            { label: "Girl", value: "girl" },
          ],
          defaultValue: "boy",
        },
        {
          name: "ageMonths",
          label: "Baby's Age (months)",
          type: "number",
          placeholder: "e.g. 6",
          min: 0,
          max: 36,
        },
        {
          name: "weight",
          label: "Baby's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 16",
          min: 1,
          max: 60,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        if (!ageMonths && ageMonths !== 0) return null;
        if (!weightLbs) return null;

        const weightKg = weightLbs * 0.453592;

        // WHO median weight (kg) by month - Boys
        const boyMedian: Record<number, number> = {
          0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5,
          6: 7.9, 7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4,
          12: 9.6, 15: 10.3, 18: 10.9, 21: 11.5, 24: 12.2,
          30: 13.3, 36: 14.3,
        };
        // WHO median weight (kg) by month - Girls
        const girlMedian: Record<number, number> = {
          0: 3.2, 1: 4.2, 2: 5.1, 3: 5.8, 4: 6.4, 5: 6.9,
          6: 7.3, 7: 7.6, 8: 7.9, 9: 8.2, 10: 8.5, 11: 8.7,
          12: 8.9, 15: 9.6, 18: 10.2, 21: 10.9, 24: 11.5,
          30: 12.7, 36: 13.9,
        };

        const medianMap = gender === "girl" ? girlMedian : boyMedian;
        const keys = Object.keys(medianMap).map(Number).sort((a, b) => a - b);
        let closest = keys[0];
        for (const k of keys) {
          if (Math.abs(k - ageMonths) < Math.abs(closest - ageMonths)) closest = k;
        }

        const median = medianMap[closest];
        const ratio = weightKg / median;

        // Approximate z-score from ratio (simplified)
        const sd = median * 0.12; // ~12% CV typical for infant weight
        const zScore = (weightKg - median) / sd;

        let percentile: string;
        let interpretation: string;
        if (zScore < -2) { percentile = "Below 3rd"; interpretation = "Very low - consult pediatrician"; }
        else if (zScore < -1.28) { percentile = "3rd - 10th"; interpretation = "Below average weight"; }
        else if (zScore < -0.67) { percentile = "10th - 25th"; interpretation = "Low-normal weight"; }
        else if (zScore < 0.67) { percentile = "25th - 75th"; interpretation = "Average weight"; }
        else if (zScore < 1.28) { percentile = "75th - 90th"; interpretation = "Above average weight"; }
        else if (zScore < 2) { percentile = "90th - 97th"; interpretation = "High weight"; }
        else { percentile = "Above 97th"; interpretation = "Very high - consult pediatrician"; }

        return {
          primary: {
            label: "Estimated Percentile",
            value: percentile,
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Baby's Weight", value: `${formatNumber(weightLbs, 1)} lbs (${formatNumber(weightKg, 2)} kg)` },
            { label: `WHO Median (${gender}, ${closest}mo)`, value: `${formatNumber(median, 2)} kg (${formatNumber(median / 0.453592, 1)} lbs)` },
            { label: "Z-Score (approx)", value: formatNumber(zScore, 2) },
            { label: "Weight vs Median", value: `${formatNumber(ratio * 100, 1)}%` },
          ],
          note: "This is a simplified estimate. Accurate percentiles require exact WHO growth chart data tables. Always consult your pediatrician for official growth assessments.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-growth-calculator", "baby-height-percentile-calculator", "toddler-bmi-calculator"],
  faq: [
    {
      question: "What is a baby weight percentile?",
      answer:
        "A weight percentile shows how your baby's weight compares to other babies of the same age and gender. For example, the 50th percentile means your baby weighs more than 50% of babies and less than 50%. The 25th-75th percentile range is considered normal.",
    },
    {
      question: "How often should I check my baby's weight percentile?",
      answer:
        "Pediatricians typically track weight at each well-baby visit: at 1, 2, 4, 6, 9, and 12 months in the first year. The trend over time matters more than any single measurement. Consistent growth along a percentile curve is usually healthy.",
    },
    {
      question: "Should I be worried if my baby is in a low percentile?",
      answer:
        "Not necessarily. Babies come in all sizes. What matters most is that your baby follows a consistent growth curve. A sudden drop across two or more percentile lines may warrant further evaluation by your pediatrician.",
    },
  ],
  formula:
    "Z-Score = (Weight - WHO Median) / SD | Percentile estimated from z-score using WHO growth standards. SD ≈ 12% of median weight. Weight: lbs × 0.4536 = kg.",
};
