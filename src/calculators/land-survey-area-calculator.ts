import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landSurveyAreaCalculator: CalculatorDefinition = {
  slug: "land-survey-area-calculator",
  title: "Land Survey Area Calculator",
  description: "Calculate land area from survey measurements using traverse coordinates or simple length and width for rectangular, triangular, and irregular plots.",
  category: "Math",
  categorySlug: "math",
  icon: "+",
  keywords: ["land survey area","plot area","survey calculator","acreage calculator","land measurement"],
  variants: [{
    id: "standard",
    name: "Land Survey Area",
    description: "Calculate land area from survey measurements using traverse coordinates or simple length and width for rectangular, triangular, and irregular plots.",
    fields: [
      { name: "plotShape", label: "Plot Shape", type: "select", options: [{ value: "1", label: "Rectangle" }, { value: "2", label: "Triangle" }, { value: "3", label: "Trapezoid" }, { value: "4", label: "Irregular (4 sides)" }], defaultValue: "1" },
      { name: "side1", label: "Side 1 / Length (meters)", type: "number", min: 1, max: 100000, defaultValue: 100 },
      { name: "side2", label: "Side 2 / Width (meters)", type: "number", min: 1, max: 100000, defaultValue: 50 },
      { name: "side3", label: "Side 3 (for trapezoid/irregular, meters)", type: "number", min: 0, max: 100000, defaultValue: 80 },
      { name: "height", label: "Height/Perpendicular Distance (meters)", type: "number", min: 0, max: 100000, defaultValue: 50 },
    ],
    calculate: (inputs) => {
    const shape = parseFloat(inputs.plotShape as unknown as string);
    const s1 = inputs.side1 as number;
    const s2 = inputs.side2 as number;
    const s3 = inputs.side3 as number;
    const h = inputs.height as number;
    let areaSqm = 0;
    if (shape === 1) areaSqm = s1 * s2;
    else if (shape === 2) areaSqm = 0.5 * s1 * h;
    else if (shape === 3) areaSqm = 0.5 * (s1 + s3) * h;
    else areaSqm = 0.5 * (s1 + s3) * h;
    const acres = areaSqm / 4046.86;
    const hectares = areaSqm / 10000;
    const sqFeet = areaSqm * 10.7639;
    const perimeter = shape === 1 ? 2 * (s1 + s2) : shape === 2 ? s1 + s2 + Math.sqrt(s1 * s1 + h * h) : s1 + s2 + s3 + h;
    return {
      primary: { label: "Area", value: formatNumber(parseFloat(areaSqm.toFixed(2))) + " m2" },
      details: [
        { label: "Acres", value: formatNumber(parseFloat(acres.toFixed(4))) },
        { label: "Hectares", value: formatNumber(parseFloat(hectares.toFixed(4))) },
        { label: "Square Feet", value: formatNumber(Math.round(sqFeet)) },
        { label: "Perimeter", value: formatNumber(parseFloat(perimeter.toFixed(2))) + " m" },
        { label: "Shape", value: shape === 1 ? "Rectangle" : shape === 2 ? "Triangle" : shape === 3 ? "Trapezoid" : "Irregular" }
      ]
    };
  },
  }],
  relatedSlugs: ["topographic-prominence-calculator","excavation-volume-calculator","gravel-calculator"],
  faq: [
    { question: "How many square meters in an acre?", answer: "One acre equals 4,046.86 square meters or 43,560 square feet. It is roughly the size of a football field without the end zones." },
    { question: "What tools do land surveyors use?", answer: "Modern land surveyors use total stations, GPS/GNSS receivers, and laser scanners. Traditional tools include theodolites, measuring chains, and level instruments. Software processes raw measurements into coordinates and areas." },
    { question: "How accurate are land surveys?", answer: "Professional land surveys are typically accurate to within a few centimeters. Boundary surveys must meet legal accuracy standards that vary by jurisdiction, usually 1:5000 to 1:20000 precision ratios." },
  ],
  formula: "Rectangle: Area = Length x Width
Triangle: Area = 0.5 x Base x Height
Trapezoid: Area = 0.5 x (Base1 + Base2) x Height
Acres = Area(m2) / 4046.86
Hectares = Area(m2) / 10000",
};
