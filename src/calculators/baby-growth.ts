import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyGrowthCalculator: CalculatorDefinition = {
  slug: "baby-growth-calculator",
  title: "Baby Growth Calculator",
  description:
    "Free baby growth calculator. Compare your baby's weight and length to WHO growth chart percentiles by age.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby growth",
    "growth chart",
    "baby percentile",
    "infant weight",
    "WHO growth",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "ageMonths",
          label: "Baby Age (months)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "weight",
          label: "Weight (lbs)",
          type: "number",
          placeholder: "e.g. 16",
        },
        {
          name: "length",
          label: "Length (inches)",
          type: "number",
          placeholder: "e.g. 26",
        },
      ],
      calculate: (inputs) => {
        const ageMonths = inputs.ageMonths as number;
        const weightLbs = inputs.weight as number;
        const lengthIn = inputs.length as number;
        if (!ageMonths || !weightLbs || !lengthIn) return null;
        if (ageMonths < 0 || ageMonths > 36) return null;

        const weightKg = weightLbs * 0.453592;
        const lengthCm = lengthIn * 2.54;

        // Simplified WHO median values for boys (approximate)
        const medianWeightKg: Record<number, number> = {
          0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5,
          6: 7.9, 7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4,
          12: 9.6, 15: 10.3, 18: 10.9, 21: 11.5, 24: 12.2,
          30: 13.3, 36: 14.3,
        };
        const medianLengthCm: Record<number, number> = {
          0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9,
          6: 67.6, 7: 69.2, 8: 70.6, 9: 72.0, 10: 73.3, 11: 74.5,
          12: 75.7, 15: 79.1, 18: 82.3, 21: 85.1, 24: 87.8,
          30: 92.4, 36: 96.1,
        };

        // Find closest age key
        const keys = Object.keys(medianWeightKg).map(Number).sort((a, b) => a - b);
        let closest = keys[0];
        for (const k of keys) {
          if (Math.abs(k - ageMonths) < Math.abs(closest - ageMonths)) closest = k;
        }

        const medW = medianWeightKg[closest];
        const medL = medianLengthCm[closest];

        const weightRatio = weightKg / medW;
        const lengthRatio = lengthCm / medL;

        let weightPercentile = "50th (average)";
        if (weightRatio < 0.85) weightPercentile = "Below 10th (low)";
        else if (weightRatio < 0.92) weightPercentile = "10th-25th (below average)";
        else if (weightRatio < 1.08) weightPercentile = "25th-75th (average)";
        else if (weightRatio < 1.15) weightPercentile = "75th-90th (above average)";
        else weightPercentile = "Above 90th (high)";

        let lengthPercentile = "50th (average)";
        if (lengthRatio < 0.95) lengthPercentile = "Below 10th (short)";
        else if (lengthRatio < 0.98) lengthPercentile = "10th-25th (below average)";
        else if (lengthRatio < 1.02) lengthPercentile = "25th-75th (average)";
        else if (lengthRatio < 1.05) lengthPercentile = "75th-90th (above average)";
        else lengthPercentile = "Above 90th (tall)";

        return {
          primary: {
            label: "Weight Percentile (est.)",
            value: weightPercentile,
          },
          details: [
            { label: "Length Percentile (est.)", value: lengthPercentile },
            {
              label: "Weight",
              value:
                formatNumber(weightLbs, 1) +
                " lbs (" +
                formatNumber(weightKg, 2) +
                " kg)",
            },
            {
              label: "Length",
              value:
                formatNumber(lengthIn, 1) +
                " in (" +
                formatNumber(lengthCm, 1) +
                " cm)",
            },
            {
              label: "WHO Median Weight (age " + closest + "mo)",
              value: formatNumber(medW, 1) + " kg",
            },
            {
              label: "WHO Median Length (age " + closest + "mo)",
              value: formatNumber(medL, 1) + " cm",
            },
            {
              label: "Note",
              value: "Simplified estimates. Consult your pediatrician for accurate percentiles.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["pet-food-calculator", "sleep-debt-calculator"],
  faq: [
    {
      question: "What are baby growth percentiles?",
      answer:
        "Growth percentiles show how your baby compares to other babies of the same age. For example, the 50th percentile means your baby is average - half of babies weigh more and half weigh less.",
    },
    {
      question: "How accurate is this calculator?",
      answer:
        "This provides simplified estimates based on WHO growth chart medians. For accurate percentile calculations, your pediatrician uses specific growth chart software that accounts for gender and exact age.",
    },
  ],
  formula:
    "Compares baby's weight and length to WHO growth chart median values for the closest age. Percentile ranges estimated by ratio to median. Weight: lbs x 0.4536 = kg. Length: inches x 2.54 = cm.",
};
