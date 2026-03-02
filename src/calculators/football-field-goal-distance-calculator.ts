import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const footballFieldGoalDistanceCalculator: CalculatorDefinition = {
  slug: "football-field-goal-distance-calculator",
  title: "Football Field Goal Distance Calculator",
  description: "Calculate actual field goal kick distance including end zone and holder position offset.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["field goal distance","football kick distance","field goal calculator","kicking distance"],
  variants: [{
    id: "standard",
    name: "Football Field Goal Distance",
    description: "Calculate actual field goal kick distance including end zone and holder position offset.",
    fields: [
      { name: "lineOfScrimmage", label: "Line of Scrimmage (yard line)", type: "number", min: 1, max: 50, defaultValue: 25 },
      { name: "holderOffset", label: "Holder Position (yards behind line)", type: "number", min: 6, max: 9, defaultValue: 7 },
      { name: "endZoneDepth", label: "End Zone Depth (yards)", type: "number", min: 10, max: 10, defaultValue: 10 },
      { name: "windSpeed", label: "Wind Speed (mph)", type: "number", min: 0, max: 40, defaultValue: 0 },
    ],
    calculate: (inputs) => {
    const los = inputs.lineOfScrimmage as number;
    const holder = inputs.holderOffset as number;
    const endZone = inputs.endZoneDepth as number;
    const wind = inputs.windSpeed as number;
    const kickDistance = los + holder + endZone;
    const kickDistanceFt = kickDistance * 3;
    const windEffect = wind > 10 ? (wind > 20 ? "Strong headwind reduces accuracy significantly" : "Moderate wind impact") : "Minimal wind impact";
    const difficulty = kickDistance <= 30 ? "Easy (chip shot)" : kickDistance <= 40 ? "Short" : kickDistance <= 50 ? "Moderate" : kickDistance <= 55 ? "Long" : "Very Long";
    const nflAvgPct = kickDistance <= 30 ? 95 : kickDistance <= 40 ? 88 : kickDistance <= 50 ? 75 : kickDistance <= 55 ? 60 : 40;
    return {
      primary: { label: "Field Goal Distance", value: formatNumber(kickDistance) + " yards" },
      details: [
        { label: "Distance in Feet", value: formatNumber(kickDistanceFt) + " ft" },
        { label: "Difficulty Rating", value: difficulty },
        { label: "NFL Average Make %", value: formatNumber(nflAvgPct) + "%" },
        { label: "Wind Assessment", value: windEffect }
      ]
    };
  },
  }],
  relatedSlugs: ["basketball-court-dimensions-calculator","soccer-field-area-calculator"],
  faq: [
    { question: "How is field goal distance calculated?", answer: "Field goal distance equals the line of scrimmage plus 7 yards for the holder plus 10 yards for the end zone. A kick from the 25-yard line is a 42-yard attempt." },
    { question: "What is the longest NFL field goal?", answer: "The longest NFL field goal is 66 yards, kicked by Justin Tucker in 2021." },
    { question: "What percentage of 50-yard field goals are made?", answer: "NFL kickers convert roughly 60 to 70 percent of field goals from 50 to 54 yards." },
  ],
  formula: "Field Goal Distance = Line of Scrimmage + Holder Offset (7 yds) + End Zone (10 yds)",
};
