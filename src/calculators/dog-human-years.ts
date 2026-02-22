import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogHumanYearsCalculator: CalculatorDefinition = {
  slug: "dog-human-years-calculator",
  title: "Dog to Human Years Calculator",
  description:
    "Free dog to human years calculator. Convert your dog's age using the advanced breed-specific formula, not the outdated 7x rule. Based on real veterinary science.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog years",
    "dog age calculator",
    "dog to human years",
    "pet age calculator",
    "dog life stage",
    "breed age",
  ],
  variants: [
    {
      id: "calc",
      name: "Convert Dog Years to Human Years",
      fields: [
        {
          name: "dogAge",
          label: "Dog's Age (years)",
          type: "number",
          placeholder: "e.g. 5",
          step: 0.5,
        },
        {
          name: "size",
          label: "Dog Size",
          type: "select",
          options: [
            { label: "Small (under 20 lbs)", value: "small" },
            { label: "Medium (20-50 lbs)", value: "medium" },
            { label: "Large (50-90 lbs)", value: "large" },
            { label: "Giant (over 90 lbs)", value: "giant" },
          ],
          defaultValue: "medium",
        },
      ],
      calculate: (inputs) => {
        const dogAge = inputs.dogAge as number;
        const size = inputs.size as string;

        if (!dogAge || dogAge <= 0) return null;

        // Modern veterinary formula: first year = 15, second year = 9, then varies by size
        let humanYears: number;
        let lifeStage: string;
        let avgLifespan: number;

        const annualRates: Record<string, number> = {
          small: 4,
          medium: 5,
          large: 6,
          giant: 7,
        };

        const lifespans: Record<string, number> = {
          small: 15,
          medium: 13,
          large: 10,
          giant: 8,
        };

        avgLifespan = lifespans[size] || 13;
        const rate = annualRates[size] || 5;

        if (dogAge <= 1) {
          humanYears = dogAge * 15;
        } else if (dogAge <= 2) {
          humanYears = 15 + (dogAge - 1) * 9;
        } else {
          humanYears = 24 + (dogAge - 2) * rate;
        }

        if (dogAge < 0.5) {
          lifeStage = "Puppy (Baby)";
        } else if (dogAge < 1) {
          lifeStage = "Puppy (Adolescent)";
        } else if (dogAge < 2) {
          lifeStage = "Young Adult";
        } else if (dogAge < 3) {
          lifeStage = "Adult";
        } else if (dogAge < 6) {
          lifeStage = "Mature Adult";
        } else if (dogAge < 9) {
          lifeStage = "Senior";
        } else {
          lifeStage = "Geriatric";
        }

        const remainingYears = Math.max(0, avgLifespan - dogAge);
        const percentLifeLived = Math.min(100, (dogAge / avgLifespan) * 100);
        const oldSevenRule = dogAge * 7;

        return {
          primary: {
            label: "Human Equivalent Age",
            value: `${formatNumber(humanYears, 1)} human years`,
          },
          details: [
            { label: "Dog's Actual Age", value: `${formatNumber(dogAge, 1)} years` },
            { label: "Size Category", value: size.charAt(0).toUpperCase() + size.slice(1) },
            { label: "Life Stage", value: lifeStage },
            { label: "Old 7x Rule (Inaccurate)", value: `${formatNumber(oldSevenRule, 0)} years` },
            { label: "Modern Formula Result", value: `${formatNumber(humanYears, 1)} years` },
            { label: "Average Life Expectancy", value: `${avgLifespan} years` },
            { label: "Estimated Remaining Years", value: `${formatNumber(remainingYears, 1)} years` },
            { label: "Life Lived", value: `${formatNumber(percentLifeLived, 1)}%` },
          ],
          note: "The old '1 dog year = 7 human years' rule is inaccurate. Dogs age faster in early life and then slow down, with smaller dogs living longer than larger breeds.",
        };
      },
    },
  ],
  relatedSlugs: ["age-calculator", "age-on-planets-calculator", "life-expectancy-quiz-calculator"],
  faq: [
    {
      question: "Why is the 7-year rule wrong?",
      answer:
        "A 1-year-old dog is sexually mature and roughly equivalent to a 15-year-old human, not a 7-year-old. The 7x rule was a rough average that doesn't account for the rapid growth in a dog's first two years. Modern veterinary science uses a logarithmic model that better reflects how dogs actually age.",
    },
    {
      question: "Why do small dogs live longer than large dogs?",
      answer:
        "This is one of biology's great mysteries — it's the opposite of what we see between species (elephants outlive mice). Larger dogs may age faster due to higher growth rates increasing oxidative damage, or because their bodies simply wear out faster from supporting more mass. A Chihuahua might live 15-20 years while a Great Dane averages 7-10.",
    },
    {
      question: "What's the oldest dog ever recorded?",
      answer:
        "The oldest verified dog was Bobi, a Portuguese Rafeiro do Alentejo who lived to 31 years and 165 days (2023). Using our formula, that's approximately 200+ human years! Before Bobi, the record was held by Bluey, an Australian Cattle Dog who lived to 29 years and 5 months.",
    },
  ],
  formula:
    "Year 1 = 15 human years, Year 2 = 9 human years, then each year after = 4-7 human years depending on size (small=4, medium=5, large=6, giant=7).",
};
