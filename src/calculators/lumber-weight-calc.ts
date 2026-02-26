import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lumberWeightCalculator: CalculatorDefinition = {
  slug: "lumber-weight-calc",
  title: "Lumber Weight Calculator",
  description:
    "Free online lumber weight calculator. Estimate the weight of lumber by species, dimensions, and moisture content.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "lumber",
    "wood",
    "weight",
    "board",
    "timber",
    "species",
    "density",
    "board feet",
  ],
  variants: [
    {
      id: "dimensional-lumber",
      name: "Dimensional Lumber",
      description: "Calculate weight of standard dimensional lumber",
      fields: [
        {
          name: "species",
          label: "Wood Species",
          type: "select",
          options: [
            { label: "Douglas Fir (34 lb/ft\u00B3)", value: "34" },
            { label: "Southern Yellow Pine (36 lb/ft\u00B3)", value: "36" },
            { label: "Spruce-Pine-Fir (SPF) (29 lb/ft\u00B3)", value: "29" },
            { label: "Western Red Cedar (23 lb/ft\u00B3)", value: "23" },
            { label: "White Oak (47 lb/ft\u00B3)", value: "47" },
            { label: "Red Oak (44 lb/ft\u00B3)", value: "44" },
            { label: "Hard Maple (44 lb/ft\u00B3)", value: "44" },
            { label: "Poplar (29 lb/ft\u00B3)", value: "29" },
            { label: "Walnut (38 lb/ft\u00B3)", value: "38" },
            { label: "Cherry (35 lb/ft\u00B3)", value: "35" },
          ],
          defaultValue: "34",
        },
        {
          name: "nominalSize",
          label: "Nominal Size",
          type: "select",
          options: [
            { label: '2x4 (1.5" x 3.5")', value: "1.5x3.5" },
            { label: '2x6 (1.5" x 5.5")', value: "1.5x5.5" },
            { label: '2x8 (1.5" x 7.25")', value: "1.5x7.25" },
            { label: '2x10 (1.5" x 9.25")', value: "1.5x9.25" },
            { label: '2x12 (1.5" x 11.25")', value: "1.5x11.25" },
            { label: '4x4 (3.5" x 3.5")', value: "3.5x3.5" },
            { label: '6x6 (5.5" x 5.5")', value: "5.5x5.5" },
            { label: '1x4 (0.75" x 3.5")', value: "0.75x3.5" },
            { label: '1x6 (0.75" x 5.5")', value: "0.75x5.5" },
            { label: '1x8 (0.75" x 7.25")', value: "0.75x7.25" },
          ],
          defaultValue: "1.5x3.5",
        },
        {
          name: "length",
          label: "Board Length",
          type: "number",
          placeholder: "e.g. 8",
          suffix: "ft",
        },
        {
          name: "quantity",
          label: "Quantity",
          type: "number",
          placeholder: "e.g. 10",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const densityPerCuFt = parseFloat(inputs.species as string) || 34;
        const sizeStr = (inputs.nominalSize as string) || "1.5x3.5";
        const length = parseFloat(inputs.length as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (length <= 0) return null;

        const [thicknessStr, widthStr] = sizeStr.split("x");
        const thickness = parseFloat(thicknessStr) || 1.5;
        const width = parseFloat(widthStr) || 3.5;

        // Volume in cubic feet
        const volumeCuFt = (thickness / 12) * (width / 12) * length;
        const weightEach = volumeCuFt * densityPerCuFt;
        const totalWeight = weightEach * quantity;
        const boardFeetEach = (thickness * width * length * 12) / 144;
        const totalBoardFeet = boardFeetEach * quantity;

        return {
          primary: {
            label: "Total Weight",
            value: formatNumber(totalWeight) + " lbs",
          },
          details: [
            { label: "Weight per board", value: formatNumber(weightEach) + " lbs" },
            {
              label: "Weight per linear foot",
              value: formatNumber(weightEach / length) + " lb/ft",
            },
            { label: "Board feet each", value: formatNumber(boardFeetEach) },
            { label: "Total board feet", value: formatNumber(totalBoardFeet) },
            { label: "Quantity", value: formatNumber(quantity) },
            {
              label: "Total (kg)",
              value: formatNumber(totalWeight * 0.4536) + " kg",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["plywood-calc", "steel-weight-calc", "metal-weight-calc"],
  faq: [
    {
      question: "How much does a 2x4 weigh?",
      answer:
        "An 8-foot Douglas Fir 2x4 (actual dimensions 1.5\" x 3.5\") weighs approximately 10 lbs. Weight varies by species: SPF weighs about 8.5 lbs, while Southern Yellow Pine weighs about 10.5 lbs for the same size.",
    },
    {
      question: "Does moisture content affect lumber weight?",
      answer:
        "Yes, significantly. Green (freshly cut) lumber can weigh 50-100% more than kiln-dried lumber. The densities used in this calculator are for air-dried lumber at approximately 12% moisture content.",
    },
  ],
  formula:
    "Weight = (Thickness/12 × Width/12 × Length) × Density (lb/ft\u00B3); Board Feet = (T × W × L×12) / 144",
};
