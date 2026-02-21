import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sugarIntakeCalculator: CalculatorDefinition = {
  slug: "sugar-intake-calculator",
  title: "Sugar Intake Calculator",
  description:
    "Free sugar intake calculator. Check if your daily added sugar consumption is within healthy limits. WHO recommends less than 25g for women and 36g for men per day.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "sugar intake calculator",
    "daily sugar limit",
    "how much sugar per day",
    "added sugar calculator",
    "sugar consumption calculator",
  ],
  variants: [
    {
      id: "calc",
      name: "Check Sugar Intake",
      description: "Is your daily sugar intake within limits?",
      fields: [
        { name: "dailySugar", label: "Daily Added Sugar Intake", type: "number", placeholder: "e.g. 40", suffix: "grams" },
        {
          name: "sex",
          label: "Sex",
          type: "select",
          options: [
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
          ],
          defaultValue: "male",
        },
      ],
      calculate: (inputs) => {
        const dailySugar = inputs.dailySugar as number;
        const sex = inputs.sex as string;
        if (!dailySugar && dailySugar !== 0) return null;

        const limit = sex === "female" ? 25 : 36;
        const limitTsp = sex === "female" ? 6 : 9;
        const tspConsumed = dailySugar / 4;
        const pctOfLimit = (dailySugar / limit) * 100;
        const excessG = Math.max(0, dailySugar - limit);
        const excessCal = excessG * 4;

        let status: string;
        if (dailySugar <= limit * 0.5) {
          status = "Excellent! Well under the recommended limit.";
        } else if (dailySugar <= limit) {
          status = "Good. Within the recommended limit.";
        } else if (dailySugar <= limit * 1.5) {
          status = "Over the limit. Consider reducing added sugar.";
        } else {
          status = "Significantly over the limit. High sugar intake increases disease risk.";
        }

        const caloriesFromSugar = dailySugar * 4;

        return {
          primary: { label: "Sugar Assessment", value: dailySugar <= limit ? "Within Limit" : "Over Limit" },
          details: [
            { label: "Your Intake", value: `${formatNumber(dailySugar, 0)}g (${formatNumber(tspConsumed, 1)} tsp)` },
            { label: "Recommended Limit", value: `${limit}g (${limitTsp} tsp)` },
            { label: "% of Limit", value: `${formatNumber(pctOfLimit, 0)}%` },
            { label: "Excess Sugar", value: excessG > 0 ? `${formatNumber(excessG, 0)}g (${formatNumber(excessCal, 0)} extra cal)` : "None" },
            { label: "Calories from Sugar", value: `${formatNumber(caloriesFromSugar, 0)} cal` },
            { label: "Status", value: status },
          ],
          note: "The AHA recommends no more than 25g (6 tsp) of added sugar per day for women and 36g (9 tsp) for men. The average American consumes about 77g (19 tsp) per day.",
        };
      },
    },
  ],
  relatedSlugs: ["calorie-calculator", "macro-calculator", "fiber-intake-calculator", "sodium-intake-calculator"],
  faq: [
    {
      question: "How much sugar is too much?",
      answer:
        "The American Heart Association recommends no more than 25g (6 teaspoons) of added sugar per day for women and 36g (9 teaspoons) for men. The WHO recommends keeping added sugar under 10% of total calories, ideally under 5%.",
    },
    {
      question: "What counts as added sugar?",
      answer:
        "Added sugar is any sugar added during processing or preparation, including table sugar, honey, syrups, and fruit juice concentrates. Natural sugars in whole fruits, vegetables, and dairy are not counted as added sugars.",
    },
    {
      question: "What are the health risks of too much sugar?",
      answer:
        "Excess added sugar is linked to obesity, type 2 diabetes, heart disease, tooth decay, non-alcoholic fatty liver disease, and increased inflammation. Reducing added sugar is one of the most impactful dietary changes you can make.",
    },
  ],
  formula:
    "AHA Limits: Women ≤ 25g (6 tsp), Men ≤ 36g (9 tsp) per day | 1 tsp = 4g sugar | Sugar calories = grams × 4",
};
