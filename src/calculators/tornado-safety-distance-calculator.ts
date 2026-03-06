import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tornadoSafetyDistanceCalculator: CalculatorDefinition = {
  slug: "tornado-safety-distance-calculator",
  title: "Tornado Safety Distance Calculator",
  description: "Calculate a safe distance from a tornado based on estimated size, wind speed, and projectile risk for emergency decision-making.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["tornado distance","tornado safety","tornado wind speed","fujita scale","tornado shelter"],
  variants: [{
    id: "standard",
    name: "Tornado Safety Distance",
    description: "Calculate a safe distance from a tornado based on estimated size, wind speed, and projectile risk for emergency decision-making.",
    fields: [
      { name: "efRating", label: "Enhanced Fujita Rating", type: "select", options: [{ value: "0", label: "EF0 (65-85 mph)" }, { value: "1", label: "EF1 (86-110 mph)" }, { value: "2", label: "EF2 (111-135 mph)" }, { value: "3", label: "EF3 (136-165 mph)" }, { value: "4", label: "EF4 (166-200 mph)" }, { value: "5", label: "EF5 (200+ mph)" }], defaultValue: "2" },
      { name: "tornadoWidth", label: "Estimated Width (yards)", type: "number", min: 10, max: 3000, defaultValue: 300 },
      { name: "movingSpeed", label: "Tornado Speed (mph)", type: "number", min: 5, max: 70, defaultValue: 30 },
      { name: "timeToShelter", label: "Time to Reach Shelter (minutes)", type: "number", min: 1, max: 60, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const efRating = inputs.efRating as number;
    const tornadoWidth = inputs.tornadoWidth as number;
    const movingSpeed = inputs.movingSpeed as number;
    const timeToShelter = inputs.timeToShelter as number;
    const maxWinds = [85, 110, 135, 165, 200, 250][efRating];
    const debrisRadius = tornadoWidth * (1 + efRating * 0.5);
    const safeDistanceMiles = (movingSpeed * timeToShelter / 60) + (debrisRadius / 1760) + 0.5;
    const safeDistanceFt = safeDistanceMiles * 5280;
    const warningTimeMin = (safeDistanceMiles / movingSpeed) * 60;
    let shelterAdvice = "Interior room on lowest floor";
    if (efRating >= 4) shelterAdvice = "Underground shelter or safe room required";
    else if (efRating >= 2) shelterAdvice = "Basement or reinforced interior room";
    return {
      primary: { label: "Minimum Safe Distance", value: formatNumber(Math.round(safeDistanceMiles * 10) / 10) + " miles" },
      details: [
        { label: "Safe Distance (feet)", value: formatNumber(Math.round(safeDistanceFt)) + " ft" },
        { label: "Max Wind Speed", value: formatNumber(maxWinds) + " mph" },
        { label: "Debris Throw Radius", value: formatNumber(Math.round(debrisRadius)) + " yards" },
        { label: "Warning Time Needed", value: formatNumber(Math.round(warningTimeMin)) + " min" },
        { label: "Shelter Recommendation", value: shelterAdvice }
      ]
    };
  },
  }],
  relatedSlugs: ["wind-chill-calculator","hurricane-preparedness-cost-calculator","wildfire-risk-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Safe Distance = (Speed x Time / 60) + (Debris Radius / 1760) + 0.5 miles; Debris Radius = Width x (1 + EF Rating x 0.5)",
};
