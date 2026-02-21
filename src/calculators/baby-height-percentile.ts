import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyHeightPercentileCalculator: CalculatorDefinition = {
  slug: "baby-height-percentile-calculator",
  title: "Baby Height Percentile Calculator",
  description:
    "Free baby height/length percentile calculator. Compare your baby's length to WHO growth charts by age and gender.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby height percentile",
    "baby length percentile",
    "infant length chart",
    "baby height tracker",
    "WHO length chart",
  ],
  variants: [
    {
      id: "height-percentile",
      name: "Height/Length Percentile by Age",
      description: "Compare your baby's length to WHO growth standards",
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
          name: "length",
          label: "Baby's Length (inches)",
          type: "number",
          placeholder: "e.g. 26",
          min: 10,
          max: 45,
        },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const ageMonths = inputs.ageMonths as number;
        const lengthIn = inputs.length as number;
        if (!ageMonths && ageMonths !== 0) return null;
        if (!lengthIn) return null;

        const lengthCm = lengthIn * 2.54;

        // WHO median length (cm) by month - Boys
        const boyMedian: Record<number, number> = {
          0: 49.9, 1: 54.7, 2: 58.4, 3: 61.4, 4: 63.9, 5: 65.9,
          6: 67.6, 7: 69.2, 8: 70.6, 9: 72.0, 10: 73.3, 11: 74.5,
          12: 75.7, 15: 79.1, 18: 82.3, 21: 85.1, 24: 87.8,
          30: 92.4, 36: 96.1,
        };
        // WHO median length (cm) by month - Girls
        const girlMedian: Record<number, number> = {
          0: 49.1, 1: 53.7, 2: 57.1, 3: 59.8, 4: 62.1, 5: 64.0,
          6: 65.7, 7: 67.3, 8: 68.7, 9: 70.1, 10: 71.5, 11: 72.8,
          12: 74.0, 15: 77.5, 18: 80.7, 21: 83.7, 24: 86.4,
          30: 91.2, 36: 95.1,
        };

        const medianMap = gender === "girl" ? girlMedian : boyMedian;
        const keys = Object.keys(medianMap).map(Number).sort((a, b) => a - b);
        let closest = keys[0];
        for (const k of keys) {
          if (Math.abs(k - ageMonths) < Math.abs(closest - ageMonths)) closest = k;
        }

        const median = medianMap[closest];
        const sd = median * 0.04; // ~4% CV for length
        const zScore = (lengthCm - median) / sd;

        let percentile: string;
        let interpretation: string;
        if (zScore < -2) { percentile = "Below 3rd"; interpretation = "Very short - consult pediatrician"; }
        else if (zScore < -1.28) { percentile = "3rd - 10th"; interpretation = "Below average length"; }
        else if (zScore < -0.67) { percentile = "10th - 25th"; interpretation = "Low-normal length"; }
        else if (zScore < 0.67) { percentile = "25th - 75th"; interpretation = "Average length"; }
        else if (zScore < 1.28) { percentile = "75th - 90th"; interpretation = "Above average length"; }
        else if (zScore < 2) { percentile = "90th - 97th"; interpretation = "Tall for age"; }
        else { percentile = "Above 97th"; interpretation = "Very tall - consult pediatrician"; }

        return {
          primary: {
            label: "Estimated Length Percentile",
            value: percentile,
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Baby's Length", value: `${formatNumber(lengthIn, 1)} in (${formatNumber(lengthCm, 1)} cm)` },
            { label: `WHO Median (${gender}, ${closest}mo)`, value: `${formatNumber(median, 1)} cm (${formatNumber(median / 2.54, 1)} in)` },
            { label: "Z-Score (approx)", value: formatNumber(zScore, 2) },
            { label: "Length vs Median", value: `${formatNumber((lengthCm / median) * 100, 1)}%` },
          ],
          note: "This is a simplified estimate using WHO growth standards. Children under 2 are measured lying down (length); children 2+ are measured standing (height). Consult your pediatrician for official assessments.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-weight-percentile-calculator", "baby-growth-calculator", "child-height-predictor-calculator"],
  faq: [
    {
      question: "How is baby length measured?",
      answer:
        "For babies under 2 years, length is measured while lying down (recumbent length). For children 2 and older, height is measured while standing. Recumbent length is typically about 1 cm longer than standing height.",
    },
    {
      question: "When should I be concerned about my baby's length?",
      answer:
        "Most babies grow at their own pace. Concern arises when length falls below the 3rd percentile, above the 97th, or when there is a significant change in growth trajectory (crossing two or more percentile lines). Your pediatrician monitors these trends.",
    },
    {
      question: "Does birth length predict adult height?",
      answer:
        "Birth length is a poor predictor of adult height. Genetics, nutrition, and overall health play much larger roles. By age 2, a child's height percentile becomes a somewhat better predictor, but many factors can change the outcome.",
    },
  ],
  formula:
    "Z-Score = (Length - WHO Median) / SD | SD ≈ 4% of median length | Length: inches × 2.54 = cm. Percentile ranges estimated from z-score.",
};
