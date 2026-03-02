import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bowlingBallWeightCalculator: CalculatorDefinition = {
  slug: "bowling-ball-weight-calculator",
  title: "Bowling Ball Weight Calculator",
  description: "Find ideal bowling ball weight based on body weight, age, strength level, and bowling style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bowling ball weight","bowling ball size","bowling equipment","ball weight guide"],
  variants: [{
    id: "standard",
    name: "Bowling Ball Weight",
    description: "Find ideal bowling ball weight based on body weight, age, strength level, and bowling style.",
    fields: [
      { name: "bodyWeight", label: "Body Weight (lbs)", type: "number", min: 40, max: 350, defaultValue: 170 },
      { name: "age", label: "Age", type: "number", min: 5, max: 90, defaultValue: 30 },
      { name: "strength", label: "Upper Body Strength", type: "select", options: [{ value: "0.8", label: "Below Average" }, { value: "1", label: "Average" }, { value: "1.2", label: "Above Average" }], defaultValue: "1" },
      { name: "style", label: "Bowling Style", type: "select", options: [{ value: "1", label: "Straight Ball" }, { value: "2", label: "Hook Ball" }, { value: "3", label: "Power Player" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const bodyWeight = inputs.bodyWeight as number;
    const age = inputs.age as number;
    const strength = parseFloat(inputs.strength as string);
    const style = parseInt(inputs.style as string);
    var baseBall = Math.round(bodyWeight * 0.1);
    baseBall = Math.round(baseBall * strength);
    if (age < 12) baseBall = Math.min(baseBall, 10);
    else if (age > 60) baseBall = Math.max(baseBall - 2, 8);
    if (style === 3) baseBall = Math.max(baseBall - 1, 8);
    baseBall = Math.max(Math.min(baseBall, 16), 6);
    const spanSize = bodyWeight < 120 ? "Small" : bodyWeight < 180 ? "Medium" : "Large";
    return {
      primary: { label: "Recommended Ball Weight", value: formatNumber(baseBall) + " lbs" },
      details: [
        { label: "Weight Range", value: formatNumber(Math.max(baseBall - 1, 6)) + " - " + formatNumber(Math.min(baseBall + 1, 16)) + " lbs" },
        { label: "Hand Span", value: spanSize },
        { label: "Max Recommended", value: formatNumber(Math.min(Math.round(bodyWeight * 0.1 * 1.2), 16)) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["archery-arrow-spine-calculator","baseball-bat-weight-calculator"],
  faq: [
    { question: "How heavy should my bowling ball be?", answer: "A common guideline is about 10 percent of your body weight, up to 16 pounds maximum." },
    { question: "Is a heavier bowling ball better?", answer: "Heavier balls carry more energy into the pins but only if you can control them comfortably. An overly heavy ball hurts accuracy." },
    { question: "What weight bowling ball do pros use?", answer: "Most professional bowlers use 15 or 16 pound balls for maximum pin carry." },
  ],
  formula: "Ball Weight = Body Weight x 10% x Strength Factor, adjusted for age and style (6-16 lb range)",
};
