import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const projectorThrowDistanceCalculator: CalculatorDefinition = {
  slug: "projector-throw-distance-calculator",
  title: "Projector Throw Distance Calculator",
  description: "Calculate the required throw distance for your projector to achieve the desired screen size, or determine screen size from available distance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["projector throw distance","projector screen size","projector placement","throw ratio calculator","projector distance calculator"],
  variants: [{
    id: "standard",
    name: "Projector Throw Distance",
    description: "Calculate the required throw distance for your projector to achieve the desired screen size, or determine screen size from available distance.",
    fields: [
      { name: "desiredWidth", label: "Desired Screen Width (inches)", type: "number", min: 40, max: 300, defaultValue: 100 },
      { name: "throwRatio", label: "Projector Throw Ratio", type: "number", min: 0.2, max: 3.0, defaultValue: 1.2 },
      { name: "projectorType", label: "Projector Type", type: "select", options: [{ value: "1", label: "Standard Throw" }, { value: "2", label: "Short Throw" }, { value: "3", label: "Ultra Short Throw" }], defaultValue: "1" },
      { name: "availableDistance", label: "Available Room Distance (feet)", type: "number", min: 2, max: 50, defaultValue: 12 },
      { name: "aspectRatio", label: "Aspect Ratio", type: "select", options: [{ value: "16", label: "16:9 (Widescreen)" }, { value: "4", label: "4:3 (Standard)" }, { value: "21", label: "21:9 (Ultrawide)" }], defaultValue: "16" },
    ],
    calculate: (inputs) => {
    const desiredWidth = inputs.desiredWidth as number;
    const throwRatio = inputs.throwRatio as number;
    const projType = parseInt(inputs.projectorType as string);
    const availDist = inputs.availableDistance as number;
    const aspect = parseInt(inputs.aspectRatio as string);
    const throwDistInches = desiredWidth * throwRatio;
    const throwDistFeet = Math.round(throwDistInches / 12 * 10) / 10;
    const maxScreenFromDist = Math.round(availDist * 12 / throwRatio);
    const heightRatio = aspect === 16 ? 9/16 : aspect === 4 ? 3/4 : 9/21;
    const screenHeight = Math.round(desiredWidth * heightRatio);
    const diagonalInches = Math.round(Math.sqrt(desiredWidth * desiredWidth + screenHeight * screenHeight));
    const fits = throwDistFeet <= availDist;
    return {
      primary: { label: "Required Throw Distance", value: formatNumber(throwDistFeet) + " feet" },
      details: [
        { label: "Screen Diagonal", value: formatNumber(diagonalInches) + " inches" },
        { label: "Screen Height", value: formatNumber(screenHeight) + " inches" },
        { label: "Max Screen Width (from room)", value: formatNumber(maxScreenFromDist) + " inches" },
        { label: "Fits Available Space", value: fits ? "Yes" : "No - need more distance" }
      ]
    };
  },
  }],
  relatedSlugs: ["tv-viewing-distance-calculator","monitor-size-distance-calculator"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Throw Distance = Screen Width x Throw Ratio; Screen Diagonal = sqrt(Width^2 + Height^2); Max Screen Width = Available Distance x 12 / Throw Ratio",
};
