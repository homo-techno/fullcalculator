import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const babyPercentileCalculator: CalculatorDefinition = {
  slug: "baby-percentile",
  title: "Baby Weight & Length Percentile Calculator",
  description:
    "Free online baby weight and length percentile calculator based on WHO growth charts for ages 0-24 months.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "baby percentile",
    "infant growth",
    "baby weight",
    "baby length",
    "growth chart",
    "WHO",
    "pediatric",
    "newborn",
  ],
  variants: [
    {
      id: "baby-weight",
      name: "Baby Weight Percentile",
      description:
        "Estimate weight percentile for infants 0-24 months using WHO data.",
      fields: [
        {
          name: "sex",
          label: "Baby's Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "ageMonths",
          label: "Age",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "months",
          min: 0,
          max: 24,
        },
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 7.5",
          suffix: "kg",
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const ageMonths = parseFloat(inputs.ageMonths as string) || 0;
        const weight = parseFloat(inputs.weight as string) || 0;

        if (weight <= 0 || ageMonths < 0 || ageMonths > 24) return null;

        // WHO weight-for-age median (kg) and SD (approximate LMS parameters)
        // Male medians at 0,3,6,9,12,18,24 months
        const maleMedian = [3.3, 6.4, 7.9, 9.2, 10.0, 11.3, 12.3];
        const maleSd = [0.45, 0.7, 0.85, 0.95, 1.0, 1.1, 1.2];
        // Female medians
        const femaleMedian = [3.2, 5.8, 7.3, 8.5, 9.2, 10.5, 11.5];
        const femaleSd = [0.42, 0.65, 0.8, 0.9, 0.95, 1.05, 1.15];

        const ages = [0, 3, 6, 9, 12, 18, 24];
        const medians = sex === "male" ? maleMedian : femaleMedian;
        const sds = sex === "male" ? maleSd : femaleSd;

        // Interpolate median and SD for given age
        let median: number;
        let sd: number;
        if (ageMonths <= 0) {
          median = medians[0];
          sd = sds[0];
        } else if (ageMonths >= 24) {
          median = medians[medians.length - 1];
          sd = sds[sds.length - 1];
        } else {
          let i = 0;
          for (let j = 0; j < ages.length - 1; j++) {
            if (ageMonths >= ages[j] && ageMonths <= ages[j + 1]) {
              i = j;
              break;
            }
          }
          const t = (ageMonths - ages[i]) / (ages[i + 1] - ages[i]);
          median = medians[i] + t * (medians[i + 1] - medians[i]);
          sd = sds[i] + t * (sds[i + 1] - sds[i]);
        }

        const zScore = (weight - median) / sd;

        // Approximate percentile from z-score using normal CDF approximation
        const percentile = normalCDF(zScore) * 100;
        const clampedPercentile = Math.max(0.1, Math.min(99.9, percentile));

        let interpretation: string;
        if (clampedPercentile < 3) interpretation = "Below normal range (underweight)";
        else if (clampedPercentile < 15) interpretation = "Low-normal range";
        else if (clampedPercentile <= 85) interpretation = "Normal range";
        else if (clampedPercentile <= 97) interpretation = "High-normal range";
        else interpretation = "Above normal range (overweight)";

        return {
          primary: {
            label: "Weight Percentile",
            value: formatNumber(clampedPercentile),
            suffix: "%ile",
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Z-Score", value: formatNumber(zScore) },
            { label: "Baby Weight", value: formatNumber(weight) + " kg" },
            { label: "Median for Age", value: formatNumber(median) + " kg" },
            { label: "Age", value: formatNumber(ageMonths) + " months" },
          ],
          note: "Based on approximate WHO weight-for-age data. Consult your pediatrician for precise growth chart plotting.",
        };
      },
    },
    {
      id: "baby-length",
      name: "Baby Length Percentile",
      description:
        "Estimate length percentile for infants 0-24 months using WHO data.",
      fields: [
        {
          name: "sex",
          label: "Baby's Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
        },
        {
          name: "ageMonths",
          label: "Age",
          type: "number",
          placeholder: "e.g. 6",
          suffix: "months",
          min: 0,
          max: 24,
        },
        {
          name: "length",
          label: "Length",
          type: "number",
          placeholder: "e.g. 67",
          suffix: "cm",
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const ageMonths = parseFloat(inputs.ageMonths as string) || 0;
        const length = parseFloat(inputs.length as string) || 0;

        if (length <= 0 || ageMonths < 0 || ageMonths > 24) return null;

        // WHO length-for-age median (cm) approximate
        const maleLengthMedian = [49.9, 61.4, 67.6, 72.0, 75.7, 81.7, 87.1];
        const maleLengthSd = [1.9, 2.3, 2.5, 2.6, 2.7, 2.8, 3.0];
        const femaleLengthMedian = [49.1, 59.8, 65.7, 70.1, 73.9, 80.0, 85.7];
        const femaleLengthSd = [1.8, 2.2, 2.4, 2.5, 2.6, 2.8, 2.9];

        const ages = [0, 3, 6, 9, 12, 18, 24];
        const medians = sex === "male" ? maleLengthMedian : femaleLengthMedian;
        const sds = sex === "male" ? maleLengthSd : femaleLengthSd;

        let median: number;
        let sd: number;
        if (ageMonths <= 0) {
          median = medians[0];
          sd = sds[0];
        } else if (ageMonths >= 24) {
          median = medians[medians.length - 1];
          sd = sds[sds.length - 1];
        } else {
          let i = 0;
          for (let j = 0; j < ages.length - 1; j++) {
            if (ageMonths >= ages[j] && ageMonths <= ages[j + 1]) {
              i = j;
              break;
            }
          }
          const t = (ageMonths - ages[i]) / (ages[i + 1] - ages[i]);
          median = medians[i] + t * (medians[i + 1] - medians[i]);
          sd = sds[i] + t * (sds[i + 1] - sds[i]);
        }

        const zScore = (length - median) / sd;
        const percentile = normalCDF(zScore) * 100;
        const clampedPercentile = Math.max(0.1, Math.min(99.9, percentile));

        let interpretation: string;
        if (clampedPercentile < 3) interpretation = "Below normal (short stature)";
        else if (clampedPercentile < 15) interpretation = "Low-normal range";
        else if (clampedPercentile <= 85) interpretation = "Normal range";
        else if (clampedPercentile <= 97) interpretation = "High-normal range";
        else interpretation = "Above normal (tall)";

        return {
          primary: {
            label: "Length Percentile",
            value: formatNumber(clampedPercentile),
            suffix: "%ile",
          },
          details: [
            { label: "Interpretation", value: interpretation },
            { label: "Z-Score", value: formatNumber(zScore) },
            { label: "Baby Length", value: formatNumber(length) + " cm" },
            { label: "Median for Age", value: formatNumber(median) + " cm" },
            { label: "Age", value: formatNumber(ageMonths) + " months" },
          ],
          note: "Based on approximate WHO length-for-age data. Consult your pediatrician for precise growth chart plotting.",
        };
      },
    },
  ],
  relatedSlugs: ["child-height-percentile", "pediatric-dosage", "benadryl-dosage"],
  faq: [
    {
      question: "What are growth percentiles?",
      answer:
        "Growth percentiles compare your baby's measurements to other children of the same age and sex. For example, if your baby is at the 75th percentile for weight, 75% of babies the same age and sex weigh less than your baby.",
    },
    {
      question: "What percentile range is normal?",
      answer:
        "Any percentile from the 3rd to the 97th is considered within the normal range. What matters most is that your baby follows a consistent growth curve over time. Sudden jumps or drops across percentile lines may warrant evaluation.",
    },
    {
      question: "Which growth charts are used?",
      answer:
        "This calculator uses approximate WHO growth standards, which are recommended for children 0-24 months in the United States and internationally. The WHO standards describe how children should grow under optimal conditions.",
    },
  ],
  formula:
    "Z-Score = (Measurement - Median_for_age_sex) / SD_for_age_sex. Percentile derived from Z-Score using normal CDF. Based on WHO growth standards.",
};

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
