import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogLifeExpectancyCalculator: CalculatorDefinition = {
  slug: "dog-life-expectancy-calculator",
  title: "Dog Life Expectancy Calculator",
  description:
    "Free dog life expectancy calculator. Estimate your dog's lifespan based on breed size, weight, and lifestyle factors. Understand how to maximize your dog's healthy years.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog life expectancy",
    "how long do dogs live",
    "dog lifespan calculator",
    "dog life span by breed size",
    "dog longevity calculator",
  ],
  variants: [
    {
      id: "lifeExpectancy",
      name: "Life Expectancy Estimate",
      fields: [
        {
          name: "weight",
          label: "Dog's Weight (lbs)",
          type: "number",
          placeholder: "e.g. 50",
          min: 1,
          max: 250,
          step: 1,
        },
        {
          name: "sizeCategory",
          label: "Breed Size Category",
          type: "select",
          options: [
            { label: "Toy (under 10 lbs)", value: "toy" },
            { label: "Small (10-20 lbs)", value: "small" },
            { label: "Medium (21-50 lbs)", value: "medium" },
            { label: "Large (51-90 lbs)", value: "large" },
            { label: "Giant (over 90 lbs)", value: "giant" },
          ],
        },
        {
          name: "neutered",
          label: "Spayed / Neutered?",
          type: "select",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        {
          name: "lifestyle",
          label: "Lifestyle & Care",
          type: "select",
          options: [
            { label: "Regular vet visits, quality food, exercise", value: "excellent" },
            { label: "Average care", value: "average" },
            { label: "Minimal vet care, basic food", value: "below" },
          ],
        },
      ],
      calculate: (inputs) => {
        const weight = inputs.weight as number;
        const sizeCategory = (inputs.sizeCategory as string) || "medium";
        const neutered = (inputs.neutered as string) || "yes";
        const lifestyle = (inputs.lifestyle as string) || "average";
        if (!weight || weight <= 0) return null;

        // Base life expectancy by size category (years)
        const baseLow: Record<string, number> = {
          toy: 14,
          small: 12,
          medium: 10,
          large: 8,
          giant: 6,
        };
        const baseHigh: Record<string, number> = {
          toy: 18,
          small: 16,
          medium: 14,
          large: 12,
          giant: 10,
        };

        // Neutered dogs tend to live 1-2 years longer
        const neuteredBonus = neutered === "yes" ? 1.0 : 0;

        // Lifestyle adjustment
        const lifestyleAdj: Record<string, number> = {
          excellent: 1.0,
          average: 0,
          below: -1.5,
        };

        const lowEstimate = baseLow[sizeCategory] + neuteredBonus + lifestyleAdj[lifestyle];
        const highEstimate = baseHigh[sizeCategory] + neuteredBonus + lifestyleAdj[lifestyle];
        const midEstimate = (lowEstimate + highEstimate) / 2;

        const sizeLabels: Record<string, string> = {
          toy: "Toy (under 10 lbs)",
          small: "Small (10-20 lbs)",
          medium: "Medium (21-50 lbs)",
          large: "Large (51-90 lbs)",
          giant: "Giant (over 90 lbs)",
        };

        return {
          primary: {
            label: "Estimated Life Expectancy",
            value: formatNumber(lowEstimate, 0) + " - " + formatNumber(highEstimate, 0) + " years",
          },
          details: [
            { label: "Midpoint Estimate", value: formatNumber(midEstimate, 1) + " years" },
            { label: "Size Category", value: sizeLabels[sizeCategory] },
            { label: "Weight", value: formatNumber(weight, 0) + " lbs" },
            { label: "Spay/Neuter Bonus", value: neutered === "yes" ? "+1 year (average)" : "None" },
            { label: "Lifestyle Adjustment", value: lifestyleAdj[lifestyle] >= 0 ? "+" + formatNumber(lifestyleAdj[lifestyle], 1) + " years" : formatNumber(lifestyleAdj[lifestyle], 1) + " years" },
            {
              label: "Tip",
              value: "Maintain a healthy weight, provide regular exercise, annual vet checkups, and quality nutrition to maximize your dog's lifespan.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-age-chart-calculator", "dog-years-calculator", "dog-bmi-calculator"],
  faq: [
    {
      question: "How long do dogs live on average?",
      answer:
        "The average dog lives 10-13 years, but this varies widely by size. Toy and small breeds often live 14-18 years, while giant breeds may only live 6-10 years. Mixed breeds tend to live slightly longer than purebreds on average due to greater genetic diversity.",
    },
    {
      question: "Why do small dogs live longer than large dogs?",
      answer:
        "Large dogs age at an accelerated rate compared to small dogs. Research suggests that for every 4.4 pounds (2 kg) of body mass, a dog's lifespan decreases by approximately one month. Large dogs may be more susceptible to age-related diseases and the physiological toll of rapid growth.",
    },
    {
      question: "Does spaying or neutering increase a dog's lifespan?",
      answer:
        "Studies show that spayed/neutered dogs live on average 1-2 years longer than intact dogs. This is partly because neutering reduces the risk of certain cancers and eliminates the risk of reproductive diseases. However, timing of spay/neuter should be discussed with your vet.",
    },
  ],
  formula:
    "Life Expectancy Range based on size: Toy 14-18, Small 12-16, Medium 10-14, Large 8-12, Giant 6-10 years. Adjustments: Spayed/Neutered +1 year, Excellent care +1 year, Below average care -1.5 years.",
};
