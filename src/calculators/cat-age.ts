import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catAgeCalculator: CalculatorDefinition = {
  slug: "cat-age-calculator",
  title: "Cat Age Calculator",
  description:
    "Free cat age calculator. Convert cat years to human years and understand your cat's life stage based on veterinary guidelines.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cat age calculator",
    "cat years to human years",
    "cat age chart",
    "how old is my cat in human years",
    "cat life stage",
  ],
  variants: [
    {
      id: "catToHuman",
      name: "Cat Years → Human Years",
      fields: [
        {
          name: "age",
          label: "Cat's Age (years)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0,
          max: 30,
          step: 0.5,
        },
        {
          name: "type",
          label: "Cat Type",
          type: "select",
          options: [
            { label: "Indoor Cat", value: "indoor" },
            { label: "Outdoor Cat", value: "outdoor" },
          ],
        },
      ],
      calculate: (inputs) => {
        const age = inputs.age as number;
        const type = (inputs.type as string) || "indoor";
        if (!age || age < 0) return null;

        // AAHA/AAFP guidelines: Year 1 = 15, Year 2 = 9 (total 24), then +4 per year
        let humanAge = 0;
        if (age <= 1) {
          humanAge = age * 15;
        } else if (age <= 2) {
          humanAge = 15 + (age - 1) * 9;
        } else {
          humanAge = 24 + (age - 2) * 4;
        }

        let lifeStage = "";
        if (age < 0.5) lifeStage = "Kitten";
        else if (age < 2) lifeStage = "Junior";
        else if (age < 6) lifeStage = "Prime";
        else if (age < 10) lifeStage = "Mature";
        else if (age < 14) lifeStage = "Senior";
        else lifeStage = "Geriatric";

        const avgLifespan = type === "indoor" ? "12-18 years" : "5-10 years";

        return {
          primary: {
            label: `${formatNumber(age, 1)} cat years`,
            value: `≈ ${formatNumber(humanAge, 1)} human years`,
          },
          details: [
            { label: "Life Stage", value: lifeStage },
            { label: "Cat Type", value: type === "indoor" ? "Indoor" : "Outdoor" },
            { label: "Average Lifespan", value: avgLifespan },
            {
              label: "Vet Visit Frequency",
              value: age < 10 ? "Once per year" : "Twice per year",
            },
          ],
        };
      },
    },
    {
      id: "humanToCat",
      name: "Human Years → Cat Years",
      fields: [
        {
          name: "humanAge",
          label: "Human Age (years)",
          type: "number",
          placeholder: "e.g. 40",
          min: 0,
          max: 120,
        },
      ],
      calculate: (inputs) => {
        const humanAge = inputs.humanAge as number;
        if (!humanAge || humanAge < 0) return null;

        let catAge = 0;
        if (humanAge <= 15) {
          catAge = humanAge / 15;
        } else if (humanAge <= 24) {
          catAge = 1 + (humanAge - 15) / 9;
        } else {
          catAge = 2 + (humanAge - 24) / 4;
        }

        return {
          primary: {
            label: `${formatNumber(humanAge, 0)} human years`,
            value: `≈ ${formatNumber(catAge, 1)} cat years`,
          },
          details: [
            {
              label: "Life Stage",
              value:
                catAge < 0.5
                  ? "Kitten"
                  : catAge < 2
                  ? "Junior"
                  : catAge < 6
                  ? "Prime"
                  : catAge < 10
                  ? "Mature"
                  : catAge < 14
                  ? "Senior"
                  : "Geriatric",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["dog-years-calculator", "pet-food-calculator", "pet-age-comparison-calculator"],
  faq: [
    {
      question: "How do you convert cat years to human years?",
      answer:
        "The first year of a cat's life equals approximately 15 human years. The second year adds about 9 more human years (totaling 24). After that, each additional cat year equals roughly 4 human years. This is based on AAHA/AAFP feline life stage guidelines.",
    },
    {
      question: "What are the cat life stages?",
      answer:
        "Cats go through six life stages: Kitten (0-6 months), Junior (7 months-2 years), Prime (3-6 years), Mature (7-10 years), Senior (11-14 years), and Geriatric (15+ years). Each stage has different nutritional and veterinary care needs.",
    },
    {
      question: "Do indoor cats age differently than outdoor cats?",
      answer:
        "Indoor and outdoor cats age at the same biological rate, but indoor cats typically live much longer (12-18 years vs. 5-10 years for outdoor cats) because they face fewer hazards such as traffic, predators, diseases, and extreme weather.",
    },
  ],
  formula:
    "Year 1 = 15 human years. Year 2 = +9 human years (total 24). Each year after = +4 human years. Based on AAHA/AAFP guidelines.",
};
