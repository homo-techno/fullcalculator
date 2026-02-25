import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bodyFatSkinfoldCalculator: CalculatorDefinition = {
  slug: "body-fat-skinfold-calculator",
  title: "Body Fat Skinfold Calculator",
  description: "Free body fat skinfold calculator using the Jackson-Pollock 3-site and 7-site methods. Estimate body fat percentage from caliper measurements.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["skinfold calculator", "jackson pollock", "body fat caliper", "skinfold body fat", "3 site skinfold", "7 site skinfold"],
  variants: [
    {
      id: "jp3-male",
      name: "Jackson-Pollock 3-Site (Male)",
      description: "Chest, abdomen, and thigh skinfold measurements for men",
      fields: [
        { name: "chest", label: "Chest Skinfold", type: "number", placeholder: "e.g. 12", suffix: "mm" },
        { name: "abdomen", label: "Abdomen Skinfold", type: "number", placeholder: "e.g. 25", suffix: "mm" },
        { name: "thigh", label: "Thigh Skinfold", type: "number", placeholder: "e.g. 15", suffix: "mm" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const chest = inputs.chest as number;
        const abdomen = inputs.abdomen as number;
        const thigh = inputs.thigh as number;
        const age = inputs.age as number;
        if (!chest || !abdomen || !thigh || !age) return null;
        const sum = chest + abdomen + thigh;
        const density = 1.10938 - 0.0008267 * sum + 0.0000016 * sum * sum - 0.0002574 * age;
        const bf = (495 / density) - 450;
        const bfClamped = Math.max(0, bf);
        let category: string;
        if (bfClamped < 6) category = "Essential Fat";
        else if (bfClamped < 14) category = "Athletes";
        else if (bfClamped < 18) category = "Fitness";
        else if (bfClamped < 25) category = "Average";
        else category = "Obese";
        return {
          primary: { label: "Body Fat %", value: formatNumber(bfClamped, 1), suffix: "%" },
          details: [
            { label: "Category", value: category },
            { label: "Sum of Skinfolds", value: `${formatNumber(sum, 1)} mm` },
            { label: "Body Density", value: formatNumber(density, 5) },
          ],
        };
      },
    },
    {
      id: "jp3-female",
      name: "Jackson-Pollock 3-Site (Female)",
      description: "Tricep, suprailiac, and thigh skinfold measurements for women",
      fields: [
        { name: "tricep", label: "Tricep Skinfold", type: "number", placeholder: "e.g. 18", suffix: "mm" },
        { name: "suprailiac", label: "Suprailiac Skinfold", type: "number", placeholder: "e.g. 15", suffix: "mm" },
        { name: "thigh", label: "Thigh Skinfold", type: "number", placeholder: "e.g. 22", suffix: "mm" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 28" },
      ],
      calculate: (inputs) => {
        const tricep = inputs.tricep as number;
        const suprailiac = inputs.suprailiac as number;
        const thigh = inputs.thigh as number;
        const age = inputs.age as number;
        if (!tricep || !suprailiac || !thigh || !age) return null;
        const sum = tricep + suprailiac + thigh;
        const density = 1.0994921 - 0.0009929 * sum + 0.0000023 * sum * sum - 0.0001392 * age;
        const bf = (495 / density) - 450;
        const bfClamped = Math.max(0, bf);
        let category: string;
        if (bfClamped < 14) category = "Essential Fat";
        else if (bfClamped < 21) category = "Athletes";
        else if (bfClamped < 25) category = "Fitness";
        else if (bfClamped < 32) category = "Average";
        else category = "Obese";
        return {
          primary: { label: "Body Fat %", value: formatNumber(bfClamped, 1), suffix: "%" },
          details: [
            { label: "Category", value: category },
            { label: "Sum of Skinfolds", value: `${formatNumber(sum, 1)} mm` },
            { label: "Body Density", value: formatNumber(density, 5) },
          ],
        };
      },
    },
    {
      id: "jp7",
      name: "Jackson-Pollock 7-Site",
      description: "More precise 7-site measurement: chest, midaxillary, tricep, subscapular, abdomen, suprailiac, thigh",
      fields: [
        { name: "gender", label: "Gender", type: "select", options: [
          { label: "Male", value: "male" }, { label: "Female", value: "female" },
        ], defaultValue: "male" },
        { name: "chest", label: "Chest", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "midaxillary", label: "Midaxillary", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "tricep", label: "Tricep", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "subscapular", label: "Subscapular", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "abdomen", label: "Abdomen", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "suprailiac", label: "Suprailiac", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "thigh", label: "Thigh", type: "number", placeholder: "mm", suffix: "mm" },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const gender = inputs.gender as string;
        const chest = inputs.chest as number;
        const midax = inputs.midaxillary as number;
        const tricep = inputs.tricep as number;
        const sub = inputs.subscapular as number;
        const abd = inputs.abdomen as number;
        const supra = inputs.suprailiac as number;
        const thigh = inputs.thigh as number;
        const age = inputs.age as number;
        if (!chest || !midax || !tricep || !sub || !abd || !supra || !thigh || !age) return null;
        const sum = chest + midax + tricep + sub + abd + supra + thigh;
        let density: number;
        if (gender === "male") {
          density = 1.112 - 0.00043499 * sum + 0.00000055 * sum * sum - 0.00028826 * age;
        } else {
          density = 1.097 - 0.00046971 * sum + 0.00000056 * sum * sum - 0.00012828 * age;
        }
        const bf = (495 / density) - 450;
        const bfClamped = Math.max(0, bf);
        return {
          primary: { label: "Body Fat %", value: formatNumber(bfClamped, 1), suffix: "%" },
          details: [
            { label: "Sum of 7 Skinfolds", value: `${formatNumber(sum, 1)} mm` },
            { label: "Body Density", value: formatNumber(density, 5) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["body-fat-calculator", "bmi-calculator", "body-fat-navy-calculator"],
  faq: [
    { question: "What is the Jackson-Pollock skinfold method?", answer: "The Jackson-Pollock method estimates body fat percentage by measuring skinfold thickness at specific body sites using calipers. The 3-site method is quicker, while the 7-site method is more accurate." },
    { question: "How do I take accurate skinfold measurements?", answer: "Pinch the skin and subcutaneous fat between thumb and forefinger, pull it away from the muscle, and apply the caliper about 1 cm below your fingers. Take each measurement twice and average. Measure on the right side of the body." },
  ],
  formula: "Male 3-site: D = 1.10938 - 0.0008267(sum) + 0.0000016(sum^2) - 0.0002574(age) | BF% = (495/D) - 450",
};
