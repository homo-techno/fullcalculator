import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tennisRacketStringTensionCalculator: CalculatorDefinition = {
  slug: "tennis-racket-string-tension-calculator",
  title: "Tennis Racket String Tension Calculator",
  description: "Calculate optimal string tension based on playing style, racket head size, and string type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tennis string tension","racket stringing","tennis racket tension","string gauge"],
  variants: [{
    id: "standard",
    name: "Tennis Racket String Tension",
    description: "Calculate optimal string tension based on playing style, racket head size, and string type.",
    fields: [
      { name: "headSize", label: "Racket Head Size (sq in)", type: "number", min: 85, max: 115, defaultValue: 100 },
      { name: "playStyle", label: "Playing Style", type: "select", options: [{ value: "1", label: "Power Hitter" }, { value: "2", label: "All-Around" }, { value: "3", label: "Control Player" }], defaultValue: "2" },
      { name: "stringType", label: "String Type", type: "select", options: [{ value: "1", label: "Natural Gut" }, { value: "2", label: "Polyester" }, { value: "3", label: "Synthetic Gut" }, { value: "4", label: "Multifilament" }], defaultValue: "2" },
      { name: "skillLevel", label: "Skill Level", type: "select", options: [{ value: "1", label: "Beginner" }, { value: "2", label: "Intermediate" }, { value: "3", label: "Advanced" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const headSize = inputs.headSize as number;
    const playStyle = parseInt(inputs.playStyle as string);
    const stringType = parseInt(inputs.stringType as string);
    const skillLevel = parseInt(inputs.skillLevel as string);
    const baseTension = 55;
    const headAdj = (headSize - 100) * -0.2;
    const styleAdj = playStyle === 1 ? -3 : playStyle === 3 ? 3 : 0;
    const stringAdj = stringType === 1 ? 2 : stringType === 2 ? -2 : stringType === 4 ? 1 : 0;
    const skillAdj = skillLevel === 1 ? -2 : skillLevel === 3 ? 2 : 0;
    const tension = Math.round(baseTension + headAdj + styleAdj + stringAdj + skillAdj);
    const rangeLow = tension - 2;
    const rangeHigh = tension + 2;
    return {
      primary: { label: "Recommended Tension", value: formatNumber(tension) + " lbs" },
      details: [
        { label: "Tension Range", value: formatNumber(rangeLow) + " - " + formatNumber(rangeHigh) + " lbs" },
        { label: "Head Size Adjustment", value: formatNumber(headAdj) + " lbs" },
        { label: "Style Adjustment", value: formatNumber(styleAdj) + " lbs" }
      ]
    };
  },
  }],
  relatedSlugs: ["golf-club-fitting-calculator","swim-pace-calculator"],
  faq: [
    { question: "What is a good tennis string tension?", answer: "Most players string between 50 and 60 pounds. Lower tension gives more power while higher tension provides more control." },
    { question: "Does racket head size affect string tension?", answer: "Yes, larger heads generally need slightly lower tension because the longer strings already provide more power." },
    { question: "How often should I restring my racket?", answer: "A common rule is to restring as many times per year as you play per week. Competitive players may restring more often." },
  ],
  formula: "Tension = Base (55 lbs) + Head Size Adj + Play Style Adj + String Type Adj + Skill Adj",
};
