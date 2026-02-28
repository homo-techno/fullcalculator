import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const geriatricBmiCalculator: CalculatorDefinition = {
  slug: "geriatric-bmi-calculator",
  title: "Geriatric BMI Calculator",
  description: "Free BMI calculator for seniors (65+). Uses age-adjusted categories that account for the protective effect of slightly higher weight in elderly.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["geriatric bmi calculator", "bmi calculator elderly", "senior bmi calculator"],
  variants: [{
    id: "standard",
    name: "Geriatric BMI",
    description: "Free BMI calculator for seniors (65+)",
    fields: [
      { name: "weight", label: "Weight", type: "number", suffix: "kg", min: 20, max: 300 },
      { name: "height", label: "Height", type: "number", suffix: "cm", min: 100, max: 250 },
      { name: "age", label: "Age", type: "number", min: 65, max: 120, defaultValue: 70 },
    ],
    calculate: (inputs) => {
      const weight = inputs.weight as number;
      const height = (inputs.height as number) / 100;
      const age = inputs.age as number;
      if (!weight || !height || !age) return null;
      const bmi = weight / (height * height);
      let category, risk;
      if (bmi < 22) { category = "Underweight"; risk = "Higher risk — increased frailty, falls, and mortality"; }
      else if (bmi < 27) { category = "Normal (Optimal for 65+)"; risk = "Lowest mortality risk in this age group"; }
      else if (bmi < 30) { category = "Slightly overweight"; risk = "Generally protective in older adults"; }
      else if (bmi < 35) { category = "Obese Class I"; risk = "Moderate risk — monitor mobility and comorbidities"; }
      else { category = "Obese Class II+"; risk = "Higher risk of disability and complications"; }
      return {
        primary: { label: "BMI", value: formatNumber(bmi) },
        details: [
          { label: "Geriatric category", value: category },
          { label: "Risk assessment", value: risk },
          { label: "Standard BMI category", value: bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese" },
          { label: "Optimal range (65+)", value: "22-27" },
        ],
        note: "Standard BMI categories (18.5-25) underestimate risk for seniors. Research shows BMI 22-27 is optimal for adults 65+, as slightly higher weight protects against frailty.",
      };
    },
  }],
  relatedSlugs: ["bmi-calculator", "body-fat-calculator"],
  faq: [
    { question: "Why is BMI different for seniors?", answer: "Older adults with BMI 22-27 have the lowest mortality. Being too thin (BMI <22) increases fall risk, frailty, and death more than being slightly overweight." },
    { question: "Is BMI accurate for elderly people?", answer: "BMI has limitations at any age, but especially for seniors due to muscle loss, bone density changes, and height shrinkage. Waist circumference and functional assessments supplement BMI." },
  ],
  formula: "BMI = Weight(kg) / Height(m)². Geriatric optimal range: 22-27",
};
