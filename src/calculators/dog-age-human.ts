import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogAgeHumanCalculator: CalculatorDefinition = {
  slug: "dog-age-human",
  title: "Dog Age in Human Years Calculator",
  description: "Convert your dog's age to human years using the updated scientific formula based on DNA methylation research.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["dog age", "dog years", "human years", "pet age", "dog age calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Dog Age in Human Years",
      fields: [
        { name: "dogAge", label: "Dog Age (years)", type: "number", placeholder: "e.g. 5", min: 0.1, max: 30, step: 0.1 },
        {
          name: "size",
          label: "Dog Size",
          type: "select",
          options: [
            { label: "Small (under 20 lbs)", value: "small" },
            { label: "Medium (20-50 lbs)", value: "medium" },
            { label: "Large (50-100 lbs)", value: "large" },
            { label: "Giant (over 100 lbs)", value: "giant" },
          ],
        },
      ],
      calculate: (inputs) => {
        const dogAge = Number(inputs.dogAge);
        const size = String(inputs.size || "medium");
        if (!dogAge || dogAge <= 0) return null;

        const multipliers: Record<string, number[]> = {
          small: [15, 9.5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
          medium: [15, 9, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5],
          large: [15, 9, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 7, 8, 8],
          giant: [12, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11],
        };

        const rates = multipliers[size] || multipliers.medium;
        let humanAge = 0;
        const fullYears = Math.floor(dogAge);
        const fraction = dogAge - fullYears;

        for (let i = 0; i < fullYears && i < rates.length; i++) {
          humanAge += rates[i];
        }
        if (fullYears < rates.length) {
          humanAge += fraction * rates[fullYears];
        } else {
          humanAge += fraction * rates[rates.length - 1];
          humanAge += (fullYears - rates.length) * rates[rates.length - 1];
        }

        const simpleAge = dogAge <= 2 ? dogAge * 12 : 24 + (dogAge - 2) * (size === "small" ? 4 : size === "medium" ? 5 : size === "large" ? 6 : 7);

        let lifeStage: string;
        if (dogAge < 0.5) lifeStage = "Puppy";
        else if (dogAge < 1) lifeStage = "Junior";
        else if (dogAge < 3) lifeStage = "Young Adult";
        else if (dogAge < 6) lifeStage = "Mature Adult";
        else if (dogAge < 10) lifeStage = "Senior";
        else lifeStage = "Geriatric";

        return {
          primary: { label: "Human Age Equivalent", value: formatNumber(Math.round(humanAge)) + " human years" },
          details: [
            { label: "Dog Age", value: formatNumber(dogAge) + " years" },
            { label: "Size Category", value: size.charAt(0).toUpperCase() + size.slice(1) },
            { label: "Life Stage", value: lifeStage },
            { label: "Simple Formula Result", value: formatNumber(Math.round(simpleAge)) + " human years" },
          ],
          note: "Based on updated size-adjusted aging rates. Small dogs tend to live longer than large breeds.",
        };
      },
    },
  ],
  relatedSlugs: ["cat-age-human-calculator", "age-calculator", "pet-food-calculator"],
  faq: [
    { question: "Is 1 dog year really 7 human years?", answer: "No. The old 1:7 ratio is inaccurate. Dogs age faster in their first two years and the rate varies by size. Small dogs age slower than large breeds after the initial years." },
    { question: "Why does dog size matter?", answer: "Larger dogs tend to age faster and have shorter lifespans. A Great Dane is considered senior at 6-7 years, while a Chihuahua may not be senior until 10-11 years." },
  ],
  formula: "Human Age = sum of size-adjusted yearly increments (first year ~15, second ~9, then 4-8 per year depending on size)",
};