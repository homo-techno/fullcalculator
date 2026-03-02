import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseballBatWeightCalculator: CalculatorDefinition = {
  slug: "baseball-bat-weight-calculator",
  title: "Baseball Bat Weight Calculator",
  description: "Find ideal bat weight and length-to-weight drop based on age, height, and league requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseball bat weight","bat size","bat drop","bat length"],
  variants: [{
    id: "standard",
    name: "Baseball Bat Weight",
    description: "Find ideal bat weight and length-to-weight drop based on age, height, and league requirements.",
    fields: [
      { name: "age", label: "Player Age", type: "number", min: 5, max: 60, defaultValue: 16 },
      { name: "height", label: "Height (inches)", type: "number", min: 36, max: 84, defaultValue: 68 },
      { name: "weight", label: "Body Weight (lbs)", type: "number", min: 40, max: 300, defaultValue: 160 },
      { name: "league", label: "League Type", type: "select", options: [{ value: "1", label: "Youth (T-Ball/Coach Pitch)" }, { value: "2", label: "Little League" }, { value: "3", label: "High School" }, { value: "4", label: "College/Adult" }], defaultValue: "3" },
    ],
    calculate: (inputs) => {
    const age = inputs.age as number;
    const height = inputs.height as number;
    const weight = inputs.weight as number;
    const league = parseInt(inputs.league as string);
    var batLength = 0;
    if (height <= 48) batLength = 26;
    else if (height <= 54) batLength = 28;
    else if (height <= 60) batLength = 29;
    else if (height <= 66) batLength = 31;
    else if (height <= 72) batLength = 32;
    else batLength = 33;
    var drop = league === 1 ? -12 : league === 2 ? -10 : league === 3 ? -3 : -3;
    if (age < 10) drop = Math.min(drop, -10);
    const batWeight = batLength + drop;
    return {
      primary: { label: "Recommended Bat Weight", value: formatNumber(batWeight) + " oz" },
      details: [
        { label: "Bat Length", value: formatNumber(batLength) + " inches" },
        { label: "Drop Weight", value: formatNumber(drop) },
        { label: "League Standard", value: league === 1 ? "Youth" : league === 2 ? "Little League" : league === 3 ? "High School" : "College/Adult" }
      ]
    };
  },
  }],
  relatedSlugs: ["golf-club-fitting-calculator","hockey-stick-flex-calculator"],
  faq: [
    { question: "What does bat drop mean?", answer: "Bat drop is the difference between length in inches and weight in ounces. A 32 inch bat weighing 29 oz has a drop of -3." },
    { question: "How do I know what bat size to get?", answer: "Bat size depends on height, weight, and league rules. Youth bats are lighter with higher drops while adult bats are heavier." },
    { question: "What bat drop is allowed in high school?", answer: "NFHS high school rules require BBCOR-certified bats with a -3 drop maximum." },
  ],
  formula: "Bat Length = based on height chart; Bat Weight = Bat Length + Drop",
};
