import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const childGrowthChartCalculator: CalculatorDefinition = {
  slug: "child-growth-chart-calculator",
  title: "Child Growth Chart Calculator",
  description:
    "Calculate your child's growth percentile for height, weight, and BMI using WHO and CDC growth standards. Track growth from ages 2 to 18 years.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "child growth chart",
    "growth percentile calculator",
    "height percentile",
    "weight percentile",
    "BMI percentile children",
    "CDC growth chart",
    "WHO growth standards",
  ],
  variants: [
    {
      id: "height-percentile",
      name: "Height-for-Age Percentile",
      description: "Calculate height percentile for children ages 2-18",
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
          name: "ageYears",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "years",
          min: 2,
          max: 18,
          step: 0.5,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 130",
          suffix: "cm",
          min: 60,
          max: 210,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const ageYears = parseFloat(inputs.ageYears as string);
        const height = parseFloat(inputs.height as string);

        if (!sex || isNaN(ageYears) || isNaN(height)) return null;

        // CDC/WHO approximate medians and SDs for height (cm) by age and sex
        const boyMedians: Record<number, [number, number]> = {
          2: [87.8, 3.5], 3: [96.1, 3.8], 4: [103.3, 4.2], 5: [110.0, 4.6],
          6: [116.0, 5.0], 7: [121.9, 5.3], 8: [127.6, 5.6], 9: [133.3, 5.9],
          10: [138.6, 6.4], 11: [143.7, 7.0], 12: [149.3, 7.6], 13: [156.0, 8.2],
          14: [163.5, 8.0], 15: [169.0, 7.5], 16: [173.0, 7.0], 17: [175.2, 6.8],
          18: [176.1, 6.6],
        };
        const girlMedians: Record<number, [number, number]> = {
          2: [86.4, 3.5], 3: [95.1, 3.8], 4: [102.7, 4.2], 5: [109.4, 4.6],
          6: [115.5, 5.1], 7: [121.4, 5.5], 8: [127.3, 5.9], 9: [133.0, 6.3],
          10: [138.6, 6.7], 11: [144.6, 7.1], 12: [151.2, 6.8], 13: [156.4, 6.4],
          14: [159.0, 6.2], 15: [160.5, 6.0], 16: [161.3, 5.9], 17: [161.8, 5.9],
          18: [162.0, 5.9],
        };

        const data = sex === "male" ? boyMedians : girlMedians;
        const roundedAge = Math.round(ageYears);
        const clampedAge = Math.max(2, Math.min(18, roundedAge));
        const [median, sd] = data[clampedAge] || [140, 7];

        const zScore = (height - median) / sd;
        const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
        const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
        const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
        const percentile = zScore > 0 ? (1 - p) * 100 : p * 100;

        const heightFt = Math.floor(height / 2.54 / 12);
        const heightIn = (height / 2.54) % 12;

        let assessment: string;
        if (percentile < 3) assessment = "Below 3rd percentile — short stature evaluation may be warranted";
        else if (percentile < 10) assessment = "Below average range — monitor growth velocity";
        else if (percentile <= 90) assessment = "Normal range";
        else if (percentile <= 97) assessment = "Above average — tall for age";
        else assessment = "Above 97th percentile — tall stature";

        return {
          primary: { label: "Height Percentile", value: `${formatNumber(percentile, 1)}th` },
          details: [
            { label: "Height", value: `${formatNumber(height, 1)} cm (${formatNumber(heightFt, 0)}'${formatNumber(heightIn, 1)}")` },
            { label: "Age", value: `${formatNumber(ageYears, 1)} years` },
            { label: "Sex", value: sex === "male" ? "Male" : "Female" },
            { label: "Z-Score", value: formatNumber(zScore, 2) },
            { label: "Median for Age", value: `${formatNumber(median, 1)} cm` },
            { label: "Assessment", value: assessment },
          ],
          note: "Based on CDC growth charts (ages 2-20). A child's percentile indicates what percentage of children of the same age and sex are shorter. Consistent growth along a percentile curve is more important than the specific percentile.",
        };
      },
    },
    {
      id: "bmi-percentile",
      name: "BMI-for-Age Percentile",
      description: "Calculate BMI percentile for children ages 2-18",
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
          name: "ageYears",
          label: "Age (years)",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "years",
          min: 2,
          max: 18,
          step: 0.5,
        },
        {
          name: "weight",
          label: "Weight",
          type: "number",
          placeholder: "e.g. 35",
          suffix: "kg",
          min: 5,
          max: 200,
          step: 0.1,
        },
        {
          name: "height",
          label: "Height",
          type: "number",
          placeholder: "e.g. 140",
          suffix: "cm",
          min: 60,
          max: 210,
          step: 0.1,
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const ageYears = parseFloat(inputs.ageYears as string);
        const weight = parseFloat(inputs.weight as string);
        const height = parseFloat(inputs.height as string);

        if (!sex || isNaN(ageYears) || isNaN(weight) || isNaN(height)) return null;

        const bmi = weight / ((height / 100) * (height / 100));

        // CDC approximate BMI medians and SDs by age and sex
        const boyBMI: Record<number, [number, number]> = {
          2: [16.5, 1.2], 3: [16.0, 1.2], 4: [15.7, 1.2], 5: [15.5, 1.3],
          6: [15.5, 1.5], 7: [15.7, 1.7], 8: [16.0, 2.0], 9: [16.5, 2.3],
          10: [17.0, 2.5], 11: [17.7, 2.8], 12: [18.4, 3.0], 13: [19.1, 3.2],
          14: [19.8, 3.3], 15: [20.5, 3.4], 16: [21.1, 3.5], 17: [21.7, 3.5],
          18: [22.2, 3.5],
        };
        const girlBMI: Record<number, [number, number]> = {
          2: [16.3, 1.3], 3: [15.8, 1.3], 4: [15.5, 1.3], 5: [15.4, 1.4],
          6: [15.5, 1.6], 7: [15.7, 1.8], 8: [16.1, 2.1], 9: [16.6, 2.3],
          10: [17.2, 2.6], 11: [17.9, 2.8], 12: [18.6, 3.0], 13: [19.3, 3.1],
          14: [19.9, 3.2], 15: [20.4, 3.3], 16: [20.8, 3.3], 17: [21.1, 3.3],
          18: [21.4, 3.3],
        };

        const data = sex === "male" ? boyBMI : girlBMI;
        const roundedAge = Math.round(ageYears);
        const clampedAge = Math.max(2, Math.min(18, roundedAge));
        const [median, sd] = data[clampedAge] || [18, 3];

        const zScore = (bmi - median) / sd;
        const t2 = 1 / (1 + 0.2316419 * Math.abs(zScore));
        const d2 = 0.3989423 * Math.exp(-zScore * zScore / 2);
        const p2 = d2 * t2 * (0.3193815 + t2 * (-0.3565638 + t2 * (1.781478 + t2 * (-1.821256 + t2 * 1.330274))));
        const percentile = zScore > 0 ? (1 - p2) * 100 : p2 * 100;

        let weightStatus: string;
        if (percentile < 5) weightStatus = "Underweight (below 5th percentile)";
        else if (percentile < 85) weightStatus = "Healthy Weight (5th to 84th percentile)";
        else if (percentile < 95) weightStatus = "Overweight (85th to 94th percentile)";
        else weightStatus = "Obese (95th percentile or above)";

        return {
          primary: { label: "BMI Percentile", value: `${formatNumber(percentile, 1)}th` },
          details: [
            { label: "BMI", value: formatNumber(bmi, 1) },
            { label: "BMI Percentile", value: `${formatNumber(percentile, 1)}th` },
            { label: "Z-Score", value: formatNumber(zScore, 2) },
            { label: "Weight Status", value: weightStatus },
            { label: "Median BMI for Age", value: formatNumber(median, 1) },
            { label: "Weight", value: `${formatNumber(weight, 1)} kg (${formatNumber(weight * 2.205, 1)} lbs)` },
            { label: "Height", value: `${formatNumber(height, 1)} cm` },
          ],
          note: "For children and teens, BMI is age- and sex-specific because body composition varies with age and between boys and girls. BMI percentile is the standard measure — not the adult BMI categories.",
        };
      },
    },
  ],
  relatedSlugs: ["head-circumference-calculator", "bmi-calculator", "nutrition-gap-calculator"],
  faq: [
    {
      question: "What growth charts should be used for children?",
      answer:
        "The WHO growth standards are recommended for children 0-2 years, and the CDC growth charts for ages 2-20. The WHO charts describe how children should grow under optimal conditions, while the CDC charts describe how children in the US actually grew.",
    },
    {
      question: "What does the 50th percentile mean?",
      answer:
        "The 50th percentile means your child is at the median — 50% of children the same age and sex are taller/heavier and 50% are shorter/lighter. Being at the 50th percentile is not a goal; what matters is consistent growth along a child's own curve.",
    },
    {
      question: "When should I be concerned about my child's growth?",
      answer:
        "Consult your pediatrician if your child falls below the 3rd or above the 97th percentile, if their percentile changes significantly (crossing two or more percentile lines), or if their weight and height percentiles are very different from each other.",
    },
  ],
  formula:
    "BMI = Weight(kg) / Height(m)^2 | Z-Score = (Measured - Median) / SD | Percentile from Z-Score via normal distribution | CDC Growth Charts (2000) for ages 2-20",
};
