import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lacrosseStickLengthCalculator: CalculatorDefinition = {
  slug: "lacrosse-stick-length-calculator",
  title: "Lacrosse Stick Length Calculator",
  description: "Determine optimal lacrosse stick length based on position, age, and league rules.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["lacrosse stick length","lacrosse shaft size","lacrosse equipment","crosse length"],
  variants: [{
    id: "standard",
    name: "Lacrosse Stick Length",
    description: "Determine optimal lacrosse stick length based on position, age, and league rules.",
    fields: [
      { name: "position", label: "Position", type: "select", options: [{ value: "1", label: "Attack" }, { value: "2", label: "Midfield" }, { value: "3", label: "Defense" }, { value: "4", label: "Goalie" }], defaultValue: "2" },
      { name: "age", label: "Player Age", type: "number", min: 6, max: 40, defaultValue: 16 },
      { name: "height", label: "Player Height (inches)", type: "number", min: 36, max: 84, defaultValue: 68 },
      { name: "gender", label: "League", type: "select", options: [{ value: "1", label: "Men/Boys" }, { value: "2", label: "Women/Girls" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const position = parseInt(inputs.position as string);
    const age = inputs.age as number;
    const height = inputs.height as number;
    const gender = parseInt(inputs.gender as string);
    var minLength = 0;
    var maxLength = 0;
    if (gender === 1) {
      if (position <= 2) { minLength = 40; maxLength = 42; }
      else if (position === 3) { minLength = 52; maxLength = 72; }
      else { minLength = 40; maxLength = 72; }
    } else {
      if (position <= 2) { minLength = 35.5; maxLength = 43.25; }
      else if (position === 3) { minLength = 35.5; maxLength = 43.25; }
      else { minLength = 35.5; maxLength = 52; }
    }
    if (age < 10) { minLength = Math.min(minLength, 36); maxLength = Math.min(maxLength, 42); }
    var recommended = Math.round((minLength + maxLength) / 2);
    if (height < 60) recommended = Math.round(minLength + (maxLength - minLength) * 0.25);
    const headWidth = gender === 1 ? (position === 4 ? "10-12 in" : "6-10 in") : "7-9 in";
    return {
      primary: { label: "Recommended Total Length", value: formatNumber(recommended) + " inches" },
      details: [
        { label: "Legal Range", value: formatNumber(minLength) + " - " + formatNumber(maxLength) + " inches" },
        { label: "Head Width", value: headWidth },
        { label: "Position", value: position === 1 ? "Attack" : position === 2 ? "Midfield" : position === 3 ? "Defense" : "Goalie" }
      ]
    };
  },
  }],
  relatedSlugs: ["hockey-stick-flex-calculator","boxing-reach-advantage-calculator"],
  faq: [
    { question: "How long should my lacrosse stick be?", answer: "Attack and midfield sticks are 40 to 42 inches. Defensive sticks range from 52 to 72 inches in men's lacrosse." },
    { question: "Are women's lacrosse sticks different?", answer: "Yes, women's sticks range from 35.5 to 43.25 inches for field players and have different pocket rules." },
    { question: "What stick length for a youth player?", answer: "Youth players under 10 typically use sticks between 36 and 42 inches total." },
  ],
  formula: "Stick Length = Position-based range per league rules, adjusted for age and height",
};
