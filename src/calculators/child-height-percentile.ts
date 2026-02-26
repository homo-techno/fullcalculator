import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

// Normal CDF approximation (Abramowitz and Stegun)
function normalCDF(z: number): number {
  if (z < -6) return 0;
  if (z > 6) return 1;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

export const childHeightPercentileCalculator: CalculatorDefinition = {
  slug: "child-height-percentile",
  title: "Child Height Percentile Calculator",
  description:
    "Free online child height percentile calculator by age and sex for children ages 2-18 using CDC growth charts.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "child height",
    "height percentile",
    "growth chart",
    "CDC",
    "pediatric",
    "stature",
    "children growth",
    "tall",
    "short stature",
  ],
  variants: [
    {
      id: "height-percentile",
      name: "Height Percentile by Age",
      description:
        "Calculate your child's height percentile relative to CDC reference data for ages 2-18.",
      fields: [
        {
          name: "sex",
          label: "Child's Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "ageYears",
          label: "Age",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "years",
          min: 2,
          max: 18,
        },
        {
          name: "heightUnit",
          label: "Height Unit",
          type: "select",
          options: [
            { label: "cm", value: "cm" },
            { label: "inches", value: "in" },
          ],
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 130",
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        let ageYears = parseFloat(inputs.ageYears as string) || 0;
        let height = parseFloat(inputs.height as string) || 0;
        const unit = inputs.heightUnit as string;

        if (ageYears < 2 || ageYears > 18 || height <= 0) return null;

        // Convert inches to cm if needed
        if (unit === "in") {
          height = height * 2.54;
        }

        // CDC stature-for-age median (cm) and SD - approximate at ages 2,4,6,8,10,12,14,16,18
        const agePoints = [2, 4, 6, 8, 10, 12, 14, 16, 18];

        const maleMedian = [86.5, 102.5, 115.5, 127.0, 138.0, 149.5, 163.5, 173.5, 176.5];
        const maleSd = [3.5, 4.2, 4.8, 5.3, 5.8, 6.5, 7.5, 7.0, 6.8];

        const femaleMedian = [85.0, 101.5, 114.5, 126.0, 138.0, 151.5, 160.5, 163.0, 163.5];
        const femaleSd = [3.3, 4.0, 4.5, 5.2, 5.8, 6.3, 6.5, 6.2, 6.0];

        const medians = sex === "male" ? maleMedian : femaleMedian;
        const sds = sex === "male" ? maleSd : femaleSd;

        // Clamp age to range
        ageYears = Math.max(2, Math.min(18, ageYears));

        // Interpolate
        let median: number;
        let sd: number;
        if (ageYears <= agePoints[0]) {
          median = medians[0];
          sd = sds[0];
        } else if (ageYears >= agePoints[agePoints.length - 1]) {
          median = medians[medians.length - 1];
          sd = sds[sds.length - 1];
        } else {
          let i = 0;
          for (let j = 0; j < agePoints.length - 1; j++) {
            if (ageYears >= agePoints[j] && ageYears <= agePoints[j + 1]) {
              i = j;
              break;
            }
          }
          const t = (ageYears - agePoints[i]) / (agePoints[i + 1] - agePoints[i]);
          median = medians[i] + t * (medians[i + 1] - medians[i]);
          sd = sds[i] + t * (sds[i + 1] - sds[i]);
        }

        const zScore = (height - median) / sd;
        const percentile = normalCDF(zScore) * 100;
        const clampedPercentile = Math.max(0.1, Math.min(99.9, percentile));

        let interpretation: string;
        if (clampedPercentile < 3) interpretation = "Below normal range (short stature evaluation recommended)";
        else if (clampedPercentile < 10) interpretation = "Below average, but within normal range";
        else if (clampedPercentile <= 90) interpretation = "Normal range";
        else if (clampedPercentile <= 97) interpretation = "Above average, within normal range";
        else interpretation = "Above normal range (tall stature)";

        const heightInches = height / 2.54;
        const feet = Math.floor(heightInches / 12);
        const remainInches = heightInches % 12;

        // Predicted adult height (mid-parent method placeholder)
        let predictedAdult = "";
        if (ageYears < 16 && sex === "male") {
          predictedAdult = formatNumber(height * (176.5 / median)) + " cm (rough estimate)";
        } else if (ageYears < 14 && sex === "female") {
          predictedAdult = formatNumber(height * (163.5 / median)) + " cm (rough estimate)";
        }

        const details = [
          { label: "Interpretation", value: interpretation },
          { label: "Z-Score", value: formatNumber(zScore) },
          { label: "Height (cm)", value: formatNumber(height) + " cm" },
          {
            label: "Height (ft/in)",
            value: `${feet}' ${formatNumber(remainInches)}"`,
          },
          { label: "Median for Age", value: formatNumber(median) + " cm" },
        ];

        if (predictedAdult) {
          details.push({ label: "Estimated Adult Height", value: predictedAdult });
        }

        return {
          primary: {
            label: "Height Percentile",
            value: formatNumber(clampedPercentile),
            suffix: "%ile",
          },
          details,
          note: "Based on approximate CDC growth reference data. Consult your pediatrician for precise growth chart interpretation.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-percentile", "body-surface-area", "pediatric-dosage"],
  faq: [
    {
      question: "What growth charts does this calculator use?",
      answer:
        "This calculator uses approximate CDC (Centers for Disease Control and Prevention) growth reference data for children ages 2-18 years. The CDC charts are recommended for children over 2 years old in the United States.",
    },
    {
      question: "When should short stature be evaluated?",
      answer:
        "A child below the 3rd percentile for height, or one who is crossing percentile lines downward, should be evaluated by a pediatrician or pediatric endocrinologist. Growth hormone deficiency, thyroid problems, and other conditions can cause short stature.",
    },
    {
      question: "Can this calculator predict adult height?",
      answer:
        "This provides a rough estimate of adult height based on current height relative to the median. More accurate methods include bone age X-rays and the mid-parental height method. Puberty timing significantly affects final adult height.",
    },
  ],
  formula:
    "Z-Score = (Height - Median_height_for_age_sex) / SD. Percentile = Φ(Z-Score) × 100, where Φ is the standard normal CDF. Based on CDC growth reference data.",
};
