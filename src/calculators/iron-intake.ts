import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const ironIntakeCalculator: CalculatorDefinition = {
  slug: "iron-intake-calculator",
  title: "Iron Intake Calculator",
  description:
    "Free iron intake calculator. Find your recommended daily iron intake based on age, sex, and pregnancy status. Learn about iron-rich food sources and absorption tips.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "iron intake calculator",
    "daily iron requirement",
    "iron calculator",
    "how much iron do I need",
    "iron deficiency calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate Iron Needs",
      description: "Find your recommended daily iron intake",
      fields: [
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "female",
        },
        { name: "age", label: "Age", type: "number", placeholder: "e.g. 30" },
        {
          name: "pregnant",
          label: "Pregnancy / Lactation Status",
          type: "select",
          options: [
            { label: "Not applicable", value: "none" },
            { label: "Pregnant", value: "pregnant" },
            { label: "Breastfeeding", value: "lactating" },
          ],
          defaultValue: "none",
        },
      ],
      calculate: (inputs) => {
        const sex = inputs.sex as string;
        const age = inputs.age as number;
        const pregnant = inputs.pregnant as string;
        if (!age) return null;

        let rdaMg: number;
        let upperLimit = 45;

        if (pregnant === "pregnant") {
          rdaMg = 27;
        } else if (pregnant === "lactating") {
          rdaMg = age <= 18 ? 10 : 9;
        } else if (sex === "male") {
          if (age <= 3) rdaMg = 7;
          else if (age <= 8) rdaMg = 10;
          else if (age <= 13) rdaMg = 8;
          else if (age <= 18) rdaMg = 11;
          else rdaMg = 8;
        } else {
          if (age <= 3) rdaMg = 7;
          else if (age <= 8) rdaMg = 10;
          else if (age <= 13) rdaMg = 8;
          else if (age <= 18) rdaMg = 15;
          else if (age <= 50) rdaMg = 18;
          else rdaMg = 8;
        }

        const foodSources = [
          "Red meat (3 oz beef = 2.1 mg)",
          "Spinach (1 cup cooked = 6.4 mg)",
          "Lentils (1 cup = 6.6 mg)",
          "Fortified cereal (1 serving = 4-18 mg)",
          "Oysters (3 oz = 8 mg)",
          "Tofu (1/2 cup = 3.4 mg)",
        ];

        return {
          primary: { label: "Recommended Daily Iron", value: `${formatNumber(rdaMg, 0)} mg` },
          details: [
            { label: "RDA", value: `${formatNumber(rdaMg, 0)} mg/day` },
            { label: "Upper Limit", value: `${upperLimit} mg/day` },
            { label: "Top Food Sources", value: foodSources.slice(0, 3).join("; ") },
            { label: "More Sources", value: foodSources.slice(3).join("; ") },
          ],
          note: "Vitamin C enhances iron absorption. Pair iron-rich foods with citrus. Tea, coffee, and calcium can inhibit absorption. Heme iron (meat) is absorbed 2-3x better than non-heme iron (plants).",
        };
      },
    },
  ],
  relatedSlugs: ["vitamin-d-calculator", "fiber-intake-calculator", "calorie-calculator"],
  faq: [
    {
      question: "How much iron do women need?",
      answer:
        "Women ages 19-50 need 18 mg/day due to menstrual losses. Pregnant women need 27 mg/day. After menopause (age 51+), the requirement drops to 8 mg/day, the same as men.",
    },
    {
      question: "What are the symptoms of iron deficiency?",
      answer:
        "Common symptoms include fatigue, weakness, pale skin, shortness of breath, cold hands and feet, brittle nails, headaches, dizziness, and unusual cravings (pica). Iron deficiency is the most common nutritional deficiency worldwide.",
    },
    {
      question: "Should I take an iron supplement?",
      answer:
        "Only take iron supplements if advised by your doctor after a blood test confirms deficiency. Excess iron can be harmful. Most men and postmenopausal women get enough iron from a balanced diet. Pregnant women often need supplementation.",
    },
  ],
  formula:
    "RDA: Men = 8 mg, Women (19-50) = 18 mg, Pregnant = 27 mg, Postmenopausal = 8 mg | Upper limit = 45 mg/day",
};
