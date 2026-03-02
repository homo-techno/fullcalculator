import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hockeyStickFlexCalculator: CalculatorDefinition = {
  slug: "hockey-stick-flex-calculator",
  title: "Hockey Stick Flex Calculator",
  description: "Determine optimal hockey stick flex rating based on body weight, position, and playing style.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["hockey stick flex","hockey stick rating","stick flex guide","hockey equipment"],
  variants: [{
    id: "standard",
    name: "Hockey Stick Flex",
    description: "Determine optimal hockey stick flex rating based on body weight, position, and playing style.",
    fields: [
      { name: "weight", label: "Body Weight (lbs)", type: "number", min: 60, max: 300, defaultValue: 180 },
      { name: "position", label: "Position", type: "select", options: [{ value: "1", label: "Forward" }, { value: "2", label: "Defenseman" }, { value: "3", label: "Goalie" }], defaultValue: "1" },
      { name: "shotType", label: "Shot Type Preference", type: "select", options: [{ value: "1", label: "Wrist / Snap Shot" }, { value: "2", label: "Slap Shot" }], defaultValue: "1" },
      { name: "height", label: "Height (inches)", type: "number", min: 48, max: 84, defaultValue: 70 },
    ],
    calculate: (inputs) => {
    const weight = inputs.weight as number;
    const position = parseInt(inputs.position as string);
    const shotType = parseInt(inputs.shotType as string);
    const height = inputs.height as number;
    const baseFlex = Math.round(weight / 2);
    const posAdj = position === 2 ? 5 : position === 3 ? -10 : 0;
    const shotAdj = shotType === 2 ? 5 : -5;
    const flex = baseFlex + posAdj + shotAdj;
    const stickLength = height <= 60 ? "Junior (46-54 in)" : height <= 68 ? "Intermediate (54-57 in)" : "Senior (57-63 in)";
    const kickPoint = shotType === 1 ? "Low Kick" : "Mid Kick";
    return {
      primary: { label: "Recommended Flex", value: formatNumber(flex) },
      details: [
        { label: "Stick Category", value: stickLength },
        { label: "Kick Point", value: kickPoint },
        { label: "Position Adjustment", value: (posAdj >= 0 ? "+" : "") + formatNumber(posAdj) }
      ]
    };
  },
  }],
  relatedSlugs: ["lacrosse-stick-length-calculator","baseball-bat-weight-calculator"],
  faq: [
    { question: "What flex hockey stick should I use?", answer: "A common guideline is to use a flex rating equal to about half your body weight in pounds." },
    { question: "Does position affect stick flex?", answer: "Yes, defensemen often prefer slightly stiffer sticks for slap shots while forwards may prefer softer flex for quick releases." },
    { question: "What is kick point?", answer: "Kick point is where the stick flexes most. Low kick helps wrist shots; mid kick helps slap shots." },
  ],
  formula: "Base Flex = Body Weight / 2; Final Flex = Base + Position Adj + Shot Type Adj",
};
