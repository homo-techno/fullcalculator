import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tableLegTaperCalculator: CalculatorDefinition = {
  slug: "table-leg-taper-calculator",
  title: "Table Leg Taper Calculator",
  description: "Free table leg taper calculator. Calculate taper dimensions, jig settings, and material removal for tapered furniture legs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["table leg taper calculator", "taper jig calculator", "furniture leg taper", "tapered leg dimensions", "taper per foot"],
  variants: [
    {
      id: "two-sided-taper",
      name: "Two-Sided Taper",
      description: "Calculate taper for legs tapered on two or four sides",
      fields: [
        { name: "legLength", label: "Leg Length (inches)", type: "number", placeholder: "e.g. 28" },
        { name: "topWidth", label: "Width at Top (inches)", type: "number", placeholder: "e.g. 1.75" },
        { name: "bottomWidth", label: "Width at Bottom (inches)", type: "number", placeholder: "e.g. 0.75" },
        { name: "taperStart", label: "Taper Start from Top (inches)", type: "number", placeholder: "e.g. 4" },
        {
          name: "sides",
          label: "Sides to Taper",
          type: "select",
          options: [
            { label: "Two Sides (inside faces)", value: "2" },
            { label: "Four Sides (all faces)", value: "4" },
          ],
        },
      ],
      calculate: (inputs) => {
        const legLength = inputs.legLength as number;
        const topWidth = inputs.topWidth as number;
        const bottomWidth = inputs.bottomWidth as number;
        const taperStart = inputs.taperStart as number;
        const sides = parseInt(inputs.sides as string);
        if (!legLength || !topWidth || !bottomWidth) return null;
        const startPos = taperStart || 0;
        const taperLength = legLength - startPos;
        const totalTaper = topWidth - bottomWidth;
        const taperPerSide = totalTaper / (sides === 4 ? 2 : 1);
        const taperPerInch = taperPerSide / taperLength;
        const taperPerFoot = taperPerInch * 12;
        const taperAngle = Math.atan(taperPerSide / taperLength) * (180 / Math.PI);
        const materialRemoved = 0.5 * taperPerSide * taperLength * topWidth * sides / (sides === 4 ? 2 : 1);
        const jigOffset = taperPerSide;
        return {
          primary: { label: "Taper Per Foot", value: `${formatNumber(taperPerFoot, 3)} inches/ft` },
          details: [
            { label: "Total Taper", value: `${formatNumber(totalTaper, 3)} inches` },
            { label: "Taper Per Side", value: `${formatNumber(taperPerSide, 3)} inches` },
            { label: "Taper Angle", value: `${formatNumber(taperAngle, 2)} degrees` },
            { label: "Taper Length", value: `${formatNumber(taperLength, 1)} inches` },
            { label: "Taper Per Inch", value: `${formatNumber(taperPerInch, 4)} inches` },
            { label: "Jig Offset", value: `${formatNumber(jigOffset, 3)} inches` },
            { label: "Material Removed (approx)", value: `${formatNumber(materialRemoved, 1)} cubic inches` },
            { label: "Sides Tapered", value: formatNumber(sides, 0) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["miter-angle-calculator", "board-footage-calculator", "wood-density-calculator"],
  faq: [
    { question: "Should I taper on two or four sides?", answer: "Two-sided tapers (inside faces only) are traditional for table legs. Four-sided tapers create a more refined, lighter appearance but require more setup and cuts." },
    { question: "Where should the taper start?", answer: "Typically, the taper begins 3-6 inches below the top of the leg, below the apron or rail. This leaves a square section for joinery and visual weight at the top." },
  ],
  formula: "Taper Per Foot = (Top Width - Bottom Width) / Taper Length x 12 | Angle = arctan(Taper / Length)",
};
