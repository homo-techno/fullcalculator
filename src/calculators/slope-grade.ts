import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const slopeGradeCalculator: CalculatorDefinition = {
  slug: "slope-grade-calculator",
  title: "Slope & Grade Calculator",
  description: "Free slope and grade calculator for construction. Calculate percent grade, slope ratio, rise, run, and angle for driveways, drainage, ramps, and landscaping.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["slope calculator", "grade calculator", "percent grade", "slope ratio", "construction grade calculator", "drainage slope"],
  variants: [
    {
      id: "rise-run",
      name: "From Rise and Run",
      description: "Calculate slope from known rise and run distances",
      fields: [
        { name: "rise", label: "Rise / Elevation Change (feet)", type: "number", placeholder: "e.g. 2" },
        { name: "run", label: "Run / Horizontal Distance (feet)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const rise = inputs.rise as number;
        const run = inputs.run as number;
        if (!rise || !run) return null;

        const percentGrade = (rise / run) * 100;
        const angleRad = Math.atan(rise / run);
        const angleDeg = angleRad * (180 / Math.PI);
        const slopeDistance = Math.sqrt(rise * rise + run * run);
        const ratio = run / rise;
        const inPerFt = (rise / run) * 12;

        return {
          primary: { label: "Percent Grade", value: `${formatNumber(percentGrade, 2)}%` },
          details: [
            { label: "Slope ratio", value: `1:${formatNumber(ratio, 1)}` },
            { label: "Angle", value: `${formatNumber(angleDeg, 2)}\u00B0` },
            { label: "Rise per foot of run", value: `${formatNumber(inPerFt, 2)} in/ft` },
            { label: "Slope distance", value: `${formatNumber(slopeDistance, 2)} ft` },
            { label: "Rise", value: `${formatNumber(rise, 2)} ft` },
            { label: "Run", value: `${formatNumber(run, 2)} ft` },
          ],
          note: "Positive grade indicates uphill, negative indicates downhill. Standard driveway grade: 2-15%. Drainage grade minimum: 1-2%. ADA ramp max: 8.33% (1:12).",
        };
      },
    },
    {
      id: "from-grade",
      name: "From Percent Grade",
      description: "Given a percent grade and one distance, calculate the other",
      fields: [
        { name: "grade", label: "Percent Grade (%)", type: "number", placeholder: "e.g. 2" },
        { name: "knownValue", label: "Known Measurement", type: "select", options: [
          { label: "Horizontal Run (feet)", value: "run" },
          { label: "Vertical Rise (feet)", value: "rise" },
        ], defaultValue: "run" },
        { name: "distance", label: "Distance (feet)", type: "number", placeholder: "e.g. 100" },
      ],
      calculate: (inputs) => {
        const grade = inputs.grade as number;
        const knownValue = inputs.knownValue as string;
        const distance = inputs.distance as number;
        if (!grade || !distance) return null;

        let rise: number;
        let run: number;

        if (knownValue === "run") {
          run = distance;
          rise = (grade / 100) * run;
        } else {
          rise = distance;
          run = rise / (grade / 100);
        }

        const angleDeg = Math.atan(rise / run) * (180 / Math.PI);
        const slopeDistance = Math.sqrt(rise * rise + run * run);
        const ratio = run / rise;
        const inPerFt = (rise / run) * 12;

        return {
          primary: { label: "Results", value: `Rise: ${formatNumber(rise, 2)} ft | Run: ${formatNumber(run, 2)} ft` },
          details: [
            { label: "Rise", value: `${formatNumber(rise, 2)} ft (${formatNumber(rise * 12, 1)} in)` },
            { label: "Run", value: `${formatNumber(run, 2)} ft` },
            { label: "Percent grade", value: `${formatNumber(grade, 2)}%` },
            { label: "Slope ratio", value: `1:${formatNumber(ratio, 1)}` },
            { label: "Angle", value: `${formatNumber(angleDeg, 2)}\u00B0` },
            { label: "Slope distance", value: `${formatNumber(slopeDistance, 2)} ft` },
            { label: "Drop per foot", value: `${formatNumber(inPerFt, 2)} in/ft` },
          ],
          note: "Common construction grades: Drainage pipe: 1-2%. Driveway: 2-15%. Wheelchair ramp: 8.33% max (1:12). Yard drainage: 2-5%.",
        };
      },
    },
  ],
  relatedSlugs: ["excavation-volume-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [
    { question: "What is the minimum slope for drainage?", answer: "The minimum slope for proper surface drainage is 1-2% (1/8 to 1/4 inch per foot). Drainage pipes typically require 1-2% grade. Gutters need at least 1/16 inch per foot slope toward downspouts. Concrete patios should slope 1/8 inch per foot away from the house." },
    { question: "What is the maximum slope for a driveway?", answer: "Most building codes limit residential driveways to 15-25% grade depending on climate. In snow-prone areas, 10-12% is the practical maximum. ADA-accessible routes are limited to 5% running slope, and ramps to 8.33% (1:12 ratio)." },
  ],
  formula: "Grade % = (Rise / Run) \u00D7 100 | Angle = arctan(Rise / Run) | Slope Distance = \u221A(Rise\u00B2 + Run\u00B2)",
};
