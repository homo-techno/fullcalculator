import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const catAgeHumanCalculator: CalculatorDefinition = {
  slug: "cat-age-human",
  title: "Cat Age in Human Years Calculator",
  description: "Convert your cat's age to human years using veterinary-approved aging charts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cat age", "cat years", "human years", "pet age", "cat age calculator", "kitten age"],
  variants: [
    {
      id: "calc",
      name: "Calculate Cat Age in Human Years",
      fields: [
        { name: "catAge", label: "Cat Age (years)", type: "number", placeholder: "e.g. 5", min: 0.1, max: 30, step: 0.1 },
        {
          name: "lifestyle",
          label: "Cat Lifestyle",
          type: "select",
          options: [
            { label: "Indoor Only", value: "indoor" },
            { label: "Outdoor/Indoor", value: "mixed" },
            { label: "Outdoor Only", value: "outdoor" },
          ],
        },
      ],
      calculate: (inputs) => {
        const catAge = Number(inputs.catAge);
        const lifestyle = String(inputs.lifestyle || "indoor");
        if (!catAge || catAge <= 0) return null;

        let humanAge = 0;
        if (catAge <= 1) {
          humanAge = catAge * 15;
        } else if (catAge <= 2) {
          humanAge = 15 + (catAge - 1) * 9;
        } else {
          humanAge = 24 + (catAge - 2) * 4;
        }

        let lifeExpectancy: number;
        if (lifestyle === "indoor") lifeExpectancy = 15;
        else if (lifestyle === "mixed") lifeExpectancy = 12;
        else lifeExpectancy = 8;

        let lifeStage: string;
        if (catAge < 0.5) lifeStage = "Kitten";
        else if (catAge < 2) lifeStage = "Junior";
        else if (catAge < 6) lifeStage = "Prime";
        else if (catAge < 10) lifeStage = "Mature";
        else if (catAge < 14) lifeStage = "Senior";
        else lifeStage = "Geriatric";

        const remainingYears = Math.max(0, lifeExpectancy - catAge);

        return {
          primary: { label: "Human Age Equivalent", value: formatNumber(Math.round(humanAge)) + " human years" },
          details: [
            { label: "Cat Age", value: formatNumber(catAge) + " years" },
            { label: "Life Stage", value: lifeStage },
            { label: "Lifestyle", value: lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1) },
            { label: "Avg Life Expectancy", value: formatNumber(lifeExpectancy) + " cat years" },
            { label: "Estimated Years Remaining", value: formatNumber(Math.round(remainingYears * 10) / 10) + " cat years" },
          ],
          note: "Based on the American Animal Hospital Association (AAHA) feline life stage guidelines.",
        };
      },
    },
  ],
  relatedSlugs: ["dog-age-human-calculator", "age-calculator", "pet-food-calculator"],
  faq: [
    { question: "How do cat years work?", answer: "The first year of a cat's life equals about 15 human years. The second year adds about 9 more. After that, each cat year equals roughly 4 human years." },
    { question: "Do indoor cats live longer?", answer: "Yes. Indoor cats typically live 12-18 years, while outdoor cats average 5-10 years due to hazards like traffic, predators, and disease." },
  ],
  formula: "Year 1 = 15 human years, Year 2 = +9 human years, Each year after = +4 human years",
};
