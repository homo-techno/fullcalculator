import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dogAgeChartCalculator: CalculatorDefinition = {
  slug: "dog-age-chart-calculator",
  title: "Dog Age to Human Years Chart Calculator",
  description:
    "Free dog age to human years chart calculator. Convert your dog's age to human years using the latest veterinary science based on breed size, not the outdated 7:1 rule.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dog age chart",
    "dog age to human years",
    "dog age calculator by breed",
    "how old is my dog in human years",
    "dog years chart",
  ],
  variants: [
    {
      id: "dogAgeChart",
      name: "Dog Age to Human Years",
      fields: [
        {
          name: "dogAge",
          label: "Dog's Age (years)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.25,
          max: 25,
          step: 0.25,
        },
        {
          name: "sizeCategory",
          label: "Dog Size Category",
          type: "select",
          options: [
            { label: "Small (under 20 lbs)", value: "small" },
            { label: "Medium (21-50 lbs)", value: "medium" },
            { label: "Large (51-100 lbs)", value: "large" },
            { label: "Giant (over 100 lbs)", value: "giant" },
          ],
        },
      ],
      calculate: (inputs) => {
        const dogAge = inputs.dogAge as number;
        const sizeCategory = (inputs.sizeCategory as string) || "medium";
        if (!dogAge || dogAge <= 0) return null;

        // Modern age conversion based on AVMA and size-based research
        // First year = 15 human years, second year = 9 more, then varies by size
        const yearlyRates: Record<string, number> = {
          small: 4,
          medium: 5,
          large: 6,
          giant: 7,
        };

        let humanAge: number;
        if (dogAge <= 1) {
          humanAge = dogAge * 15;
        } else if (dogAge <= 2) {
          humanAge = 15 + (dogAge - 1) * 9;
        } else {
          humanAge = 24 + (dogAge - 2) * yearlyRates[sizeCategory];
        }

        const lifeExpectancy: Record<string, string> = {
          small: "12-16 years",
          medium: "10-13 years",
          large: "8-12 years",
          giant: "6-10 years",
        };

        const sizeLabel: Record<string, string> = {
          small: "Small (under 20 lbs)",
          medium: "Medium (21-50 lbs)",
          large: "Large (51-100 lbs)",
          giant: "Giant (over 100 lbs)",
        };

        let lifeStage = "";
        if (dogAge < 1) lifeStage = "Puppy";
        else if (dogAge < 2) lifeStage = "Adolescent";
        else if (dogAge < 7) lifeStage = "Adult";
        else if (dogAge < 10) lifeStage = "Mature Adult";
        else lifeStage = "Senior";

        return {
          primary: {
            label: "Human Age Equivalent",
            value: formatNumber(humanAge, 0) + " human years",
          },
          details: [
            { label: "Dog's Actual Age", value: formatNumber(dogAge, 1) + " years" },
            { label: "Size Category", value: sizeLabel[sizeCategory] },
            { label: "Life Stage", value: lifeStage },
            { label: "Avg. Life Expectancy", value: lifeExpectancy[sizeCategory] },
            { label: "Aging Rate (after year 2)", value: yearlyRates[sizeCategory] + " human years per dog year" },
            {
              label: "Note",
              value: "The old '7 years per dog year' rule is inaccurate. Dogs age faster in early years, and large breeds age faster overall.",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-years-calculator", "dog-life-expectancy-calculator", "pet-age-comparison-calculator"],
  faq: [
    {
      question: "Is the 7:1 dog years rule accurate?",
      answer:
        "No. The 7:1 rule is a simplified myth. Dogs age much faster in their first two years (roughly 15 human years in year one, 9 in year two), then the rate depends on size. Small dogs age more slowly than large breeds after maturity.",
    },
    {
      question: "Why do large dogs age faster than small dogs?",
      answer:
        "Researchers believe large dogs age faster because their accelerated growth puts more physiological strain on their bodies. Giant breeds may also be more susceptible to age-related diseases earlier. A Great Dane at 6 years old is equivalent to a much older human than a Chihuahua at the same age.",
    },
    {
      question: "At what age is a dog considered senior?",
      answer:
        "It depends on breed size. Small dogs are generally considered senior around 10-12 years, medium dogs around 8-10, large dogs around 7-8, and giant breeds as early as 5-6 years. Senior dogs benefit from more frequent vet checkups and adjusted nutrition.",
    },
  ],
  formula:
    "Year 1 = 15 human years. Year 2 = +9 human years (total 24). Each year after 2: Small breeds +4, Medium +5, Large +6, Giant +7 human years per dog year. Based on AVMA and size-adjusted veterinary aging research.",
};
