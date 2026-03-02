import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const golfClubFittingCalculator: CalculatorDefinition = {
  slug: "golf-club-fitting-calculator",
  title: "Golf Club Fitting Calculator",
  description: "Determine recommended club length and lie angle based on your height, wrist-to-floor measurement, and swing speed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["golf club fitting","club length","golf club size","lie angle"],
  variants: [{
    id: "standard",
    name: "Golf Club Fitting",
    description: "Determine recommended club length and lie angle based on your height, wrist-to-floor measurement, and swing speed.",
    fields: [
      { name: "height", label: "Height (inches)", type: "number", min: 54, max: 84, defaultValue: 70 },
      { name: "wristToFloor", label: "Wrist-to-Floor (inches)", type: "number", min: 25, max: 42, defaultValue: 34 },
      { name: "swingSpeed", label: "Driver Swing Speed (mph)", type: "number", min: 50, max: 130, defaultValue: 90 },
      { name: "handicap", label: "Handicap Range", type: "select", options: [{ value: "1", label: "High (20+)" }, { value: "2", label: "Mid (10-19)" }, { value: "3", label: "Low (0-9)" }], defaultValue: "2" },
    ],
    calculate: (inputs) => {
    const height = inputs.height as number;
    const wtf = inputs.wristToFloor as number;
    const swingSpeed = inputs.swingSpeed as number;
    const handicap = parseInt(inputs.handicap as string);
    const standardLength = 36.5;
    const lengthAdj = (wtf - 34) * 0.25;
    const clubLength = standardLength + lengthAdj;
    const standardLie = 62;
    const lieAdj = (height - 70) * 0.3 + (wtf - 34) * -0.4;
    const lieAngle = Math.round((standardLie + lieAdj) * 10) / 10;
    const shaftFlex = swingSpeed < 70 ? "Ladies" : swingSpeed < 85 ? "Regular" : swingSpeed < 100 ? "Stiff" : "Extra Stiff";
    return {
      primary: { label: "Recommended 7-Iron Length", value: formatNumber(Math.round(clubLength * 10) / 10) + " inches" },
      details: [
        { label: "Lie Angle Adjustment", value: formatNumber(lieAngle) + " degrees" },
        { label: "Shaft Flex", value: shaftFlex },
        { label: "Length Adjustment", value: (lengthAdj >= 0 ? "+" : "") + formatNumber(Math.round(lengthAdj * 100) / 100) + " inches" }
      ]
    };
  },
  }],
  relatedSlugs: ["tennis-racket-string-tension-calculator","baseball-bat-weight-calculator"],
  faq: [
    { question: "How do I know what golf club length I need?", answer: "Club length is primarily based on your wrist-to-floor measurement. Standard 7-iron length is about 36.5 inches for a player 70 inches tall." },
    { question: "What is lie angle in golf?", answer: "Lie angle is the angle between the club shaft and the ground. Taller players generally need more upright lie angles." },
    { question: "How important is club fitting?", answer: "Proper fitting can improve accuracy and distance by 5 to 15 percent, even for beginners." },
  ],
  formula: "Club Length = 36.5 + (Wrist-to-Floor - 34) x 0.25; Lie Angle = 62 + Height Adj + WTF Adj",
};
