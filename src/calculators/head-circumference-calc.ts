import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const headCircumferenceCalculator: CalculatorDefinition = {
  slug: "head-circumference-calculator",
  title: "Head Circumference Percentile Calculator",
  description:
    "Calculate head circumference percentile for infants and children using WHO growth standards. Track your child's head growth against age and sex norms.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "head circumference calculator",
    "head circumference percentile",
    "WHO growth chart",
    "infant head size",
    "microcephaly",
    "macrocephaly",
    "baby head growth",
  ],
  variants: [
    {
      id: "hc-percentile",
      name: "Head Circumference Percentile",
      description: "Calculate head circumference percentile based on age and sex (WHO standards, 0-5 years)",
      fields: [
        {
          name: "sex",
          label: "Sex",
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
          placeholder: "e.g. 12",
          suffix: "months",
          min: 0,
          max: 60,
          step: 1,
        },
        {
          name: "hc",
          label: "Head Circumference",
          type: "number",
          placeholder: "e.g. 46",
          suffix: "cm",
          min: 25,
          max: 60,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const ageMonths = parseFloat(inputs.ageMonths as string);
        const hc = parseFloat(inputs.hc as string);

        if (!sex || isNaN(ageMonths) || isNaN(hc)) return null;

        // WHO LMS approximation for head circumference (simplified key milestones)
        // Boys: M values at birth=34.5, 3m=40.5, 6m=43.3, 12m=46.1, 24m=48.3, 36m=49.5, 48m=50.3, 60m=50.8
        // Girls: M values at birth=33.9, 3m=39.5, 6m=42.2, 12m=44.9, 24m=47.2, 36m=48.5, 48m=49.3, 60m=49.8
        const boyMedians: Record<number, number> = { 0: 34.5, 1: 37.3, 2: 39.1, 3: 40.5, 4: 41.6, 5: 42.6, 6: 43.3, 9: 44.8, 12: 46.1, 18: 47.4, 24: 48.3, 36: 49.5, 48: 50.3, 60: 50.8 };
        const girlMedians: Record<number, number> = { 0: 33.9, 1: 36.5, 2: 38.3, 3: 39.5, 4: 40.6, 5: 41.5, 6: 42.2, 9: 43.7, 12: 44.9, 18: 46.2, 24: 47.2, 36: 48.5, 48: 49.3, 60: 49.8 };
        const boySDs: Record<number, number> = { 0: 1.2, 1: 1.2, 2: 1.3, 3: 1.3, 4: 1.3, 5: 1.3, 6: 1.3, 9: 1.3, 12: 1.3, 18: 1.3, 24: 1.3, 36: 1.3, 48: 1.3, 60: 1.3 };
        const girlSDs: Record<number, number> = { 0: 1.2, 1: 1.2, 2: 1.2, 3: 1.2, 4: 1.2, 5: 1.2, 6: 1.3, 9: 1.3, 12: 1.3, 18: 1.3, 24: 1.3, 36: 1.3, 48: 1.3, 60: 1.3 };

        const medians = sex === "male" ? boyMedians : girlMedians;
        const sds = sex === "male" ? boySDs : girlSDs;

        // Interpolate median and SD for the given age
        const ages = Object.keys(medians).map(Number).sort((a, b) => a - b);
        let median: number;
        let sd: number;

        if (ageMonths <= ages[0]) {
          median = medians[ages[0]];
          sd = sds[ages[0]];
        } else if (ageMonths >= ages[ages.length - 1]) {
          median = medians[ages[ages.length - 1]];
          sd = sds[ages[ages.length - 1]];
        } else {
          let lowerAge = ages[0];
          let upperAge = ages[ages.length - 1];
          for (let i = 0; i < ages.length - 1; i++) {
            if (ageMonths >= ages[i] && ageMonths <= ages[i + 1]) {
              lowerAge = ages[i];
              upperAge = ages[i + 1];
              break;
            }
          }
          const fraction = (ageMonths - lowerAge) / (upperAge - lowerAge);
          median = medians[lowerAge] + fraction * (medians[upperAge] - medians[lowerAge]);
          sd = sds[lowerAge] + fraction * (sds[upperAge] - sds[lowerAge]);
        }

        const zScore = (hc - median) / sd;

        // Convert z-score to percentile using approximation
        const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
        const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        const percentile = zScore > 0 ? (1 - p) * 100 : p * 100;

        let assessment: string;
        if (percentile < 2) assessment = "Below 2nd percentile — microcephaly evaluation may be warranted";
        else if (percentile < 5) assessment = "Below 5th percentile — monitor closely";
        else if (percentile <= 95) assessment = "Within normal range";
        else if (percentile <= 98) assessment = "Above 95th percentile — monitor closely";
        else assessment = "Above 98th percentile — macrocephaly evaluation may be warranted";

        const ageYears = Math.floor(ageMonths / 12);
        const ageRemMonths = ageMonths % 12;
        const ageDisplay = ageYears > 0 ? `${formatNumber(ageYears, 0)} yr ${formatNumber(ageRemMonths, 0)} mo` : `${formatNumber(ageMonths, 0)} months`;

        return {
          primary: { label: "Percentile", value: `${formatNumber(percentile, 1)}th` },
          details: [
            { label: "Head Circumference", value: `${formatNumber(hc, 1)} cm` },
            { label: "Age", value: ageDisplay },
            { label: "Sex", value: sex === "male" ? "Male" : "Female" },
            { label: "Z-Score", value: formatNumber(zScore, 2) },
            { label: "Median for Age/Sex", value: `${formatNumber(median, 1)} cm` },
            { label: "Assessment", value: assessment },
          ],
          note: "Based on WHO Child Growth Standards (0-5 years). Percentile indicates the percentage of children with a smaller head circumference at this age. Always interpret in clinical context — serial measurements are more important than single values.",
        };
      },
    },
  ],
  relatedSlugs: ["child-growth-chart-calculator", "crown-rump-length-calculator", "bmi-calculator"],
  faq: [
    {
      question: "What is a normal head circumference for a baby?",
      answer:
        "Normal head circumference varies by age and sex. At birth, average is about 34-35 cm for boys and 33-34 cm for girls. Head circumference between the 5th and 95th percentiles is generally considered normal. What matters most is consistent growth along a percentile curve.",
    },
    {
      question: "What is microcephaly and macrocephaly?",
      answer:
        "Microcephaly is a head circumference below the 3rd percentile (or more than 2 standard deviations below the mean) for age and sex. Macrocephaly is above the 97th percentile. Both may warrant further evaluation, though some cases are familial and benign.",
    },
    {
      question: "How often should head circumference be measured?",
      answer:
        "Head circumference is typically measured at every well-child visit during the first 2 years of life (at birth, 1, 2, 4, 6, 9, 12, 15, 18, and 24 months). After age 2, it is measured less frequently unless there are concerns.",
    },
  ],
  formula:
    "Z-Score = (Measured HC - Median for age/sex) / Standard Deviation | Percentile derived from Z-Score using normal distribution | WHO Child Growth Standards (2006)",
};
