import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogAgeCalculator: CalculatorDefinition = {
  slug: "dog-age-calculator",
  title: "Dog Age Calculator",
  description: "Convert your dog age to human years based on breed size for a more accurate age comparison.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: ["dog age in human years", "dog year calculator", "dog age converter"],
  variants: [{
    id: "standard",
    name: "Dog Age",
    description: "Convert your dog age to human years based on breed size for a more accurate age comparison",
    fields: [
      { name: "dogAge", label: "Dog Age", type: "number", suffix: "years", min: 0.5, max: 25, defaultValue: 5 },
      { name: "size", label: "Breed Size", type: "select", options: [{value:"small",label:"Small (under 20 lbs)"},{value:"medium",label:"Medium (20-50 lbs)"},{value:"large",label:"Large (50-90 lbs)"},{value:"giant",label:"Giant (over 90 lbs)"}], defaultValue: "medium" },
      { name: "weight", label: "Dog Weight", type: "number", suffix: "lbs", min: 2, max: 250, defaultValue: 40 },
    ],
    calculate: (inputs) => {
      const age = inputs.dogAge as number;
      const size = inputs.size as string;
      if (!age || age <= 0) return null;
      const agingRates: Record<string, number[]> = {
        small: [15, 9.5, 4, 4, 4, 4, 4, 4, 4, 4],
        medium: [15, 9, 5, 5, 5, 5, 5, 5, 5, 5],
        large: [15, 9, 6, 6, 6, 6, 6, 6, 6, 6],
        giant: [15, 9, 7, 7, 7, 7, 7, 7, 7, 7]
      };
      const rates = agingRates[size] || agingRates.medium;
      let humanYears = 0;
      for (let i = 0; i < Math.floor(age); i++) {
        humanYears += i < rates.length ? rates[i] : rates[rates.length - 1];
      }
      const frac = age - Math.floor(age);
      const lastRate = Math.floor(age) < rates.length ? rates[Math.floor(age)] : rates[rates.length - 1];
      humanYears += frac * lastRate;
      const lifeStage = humanYears < 15 ? "Puppy" : humanYears < 30 ? "Young Adult" : humanYears < 55 ? "Adult" : "Senior";
      return {
        primary: { label: "Human Equivalent Age", value: Math.round(humanYears) + " human years" },
        details: [
          { label: "Dog Age", value: age + " years" },
          { label: "Life Stage", value: lifeStage },
          { label: "Aging Rate", value: lastRate + " human years per dog year" },
        ],
      };
    },
  }],
  relatedSlugs: ["dog-exercise-calculator", "dog-food-cost-calculator"],
  faq: [
    { question: "Is 1 dog year really 7 human years?", answer: "No. Dogs age faster in their first two years. A 1-year-old dog is roughly 15 in human years, and a 2-year-old is about 24." },
    { question: "Do smaller dogs live longer?", answer: "Generally yes. Small breeds often live 12-16 years while giant breeds may live only 7-10 years." },
  ],
  formula: "Human Age = Sum of aging rates per year (varies by breed size and actual age)",
};
