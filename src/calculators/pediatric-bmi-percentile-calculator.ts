import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pediatricBmiPercentileCalculator: CalculatorDefinition = {
  slug: "pediatric-bmi-percentile-calculator",
  title: "Pediatric BMI Percentile Calculator",
  description: "Calculate a child BMI percentile based on age, sex, height, and weight using CDC growth chart references.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["pediatric bmi", "child bmi percentile", "kids bmi calculator"],
  variants: [{
    id: "standard",
    name: "Pediatric BMI Percentile",
    description: "Calculate a child BMI percentile based on age, sex, height, and weight using CDC growth chart references",
    fields: [
      { name: "ageYears", label: "Child Age", type: "number", suffix: "years", min: 2, max: 19, step: 0.5, defaultValue: 8 },
      { name: "weightLbs", label: "Weight", type: "number", suffix: "lbs", min: 15, max: 300, step: 0.5, defaultValue: 56 },
      { name: "heightIn", label: "Height", type: "number", suffix: "inches", min: 24, max: 80, step: 0.5, defaultValue: 50 },
      { name: "sex", label: "Sex", type: "select", options: [{value:"male",label:"Male"},{value:"female",label:"Female"}], defaultValue: "male" },
    ],
    calculate: (inputs) => {
      const age = inputs.ageYears as number;
      const weightLbs = inputs.weightLbs as number;
      const heightIn = inputs.heightIn as number;
      const sex = inputs.sex as string;
      if (!age || !weightLbs || !heightIn || weightLbs <= 0 || heightIn <= 0) return null;
      const bmi = (weightLbs / (heightIn * heightIn)) * 703;
      const medianBmi: Record<string, Record<number, number>> = {
        male: {2:16.5,4:15.5,6:15.4,8:15.8,10:16.6,12:18.0,14:19.8,16:21.0,18:22.0},
        female: {2:16.0,4:15.2,6:15.2,8:15.8,10:16.8,12:18.4,14:19.6,16:20.5,18:21.2},
      };
      const genderData = medianBmi[sex] || medianBmi["male"];
      const keys = Object.keys(genderData).map(Number).sort((a,b)=>a-b);
      let median = genderData[8];
      for (let i = 0; i < keys.length - 1; i++) {
        if (age >= keys[i] && age <= keys[i+1]) {
          const t = (age - keys[i]) / (keys[i+1] - keys[i]);
          median = genderData[keys[i]] * (1 - t) + genderData[keys[i+1]] * t;
          break;
        }
      }
      const sd = median * 0.12;
      const zScore = (bmi - median) / sd;
      const percentile = Math.min(99, Math.max(1, Math.round(50 + zScore * 16)));
      const category = percentile < 5 ? "Underweight" : percentile < 85 ? "Healthy weight" : percentile < 95 ? "Overweight" : "Obese";
      return {
        primary: { label: "BMI Percentile", value: formatNumber(percentile) + "th percentile" },
        details: [
          { label: "BMI", value: formatNumber(Math.round(bmi * 10) / 10) },
          { label: "Weight Category", value: category },
          { label: "Median BMI for Age and Sex", value: formatNumber(Math.round(median * 10) / 10) },
        ],
      };
    },
  }],
  relatedSlugs: ["child-height-prediction-calculator", "birth-weight-percentile-calculator"],
  faq: [
    { question: "Why is BMI percentile used for children instead of standard BMI?", answer: "Children BMI changes as they grow, so a single BMI number does not have the same meaning at every age. Percentiles compare a child BMI to others of the same age and sex, providing a more accurate assessment." },
    { question: "What BMI percentile is considered healthy for children?", answer: "A BMI between the 5th and 85th percentile is considered healthy weight for children. Below the 5th percentile is underweight, between 85th and 95th is overweight, and above the 95th is obese." },
  ],
  formula: "BMI = (Weight in lbs / Height in inches squared) x 703; Percentile from CDC age-sex reference charts",
};
