import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const patioCalculator: CalculatorDefinition = {
  slug: "patio-paver-calculator",
  title: "Patio Paver Calculator",
  description:
    "Free patio paver calculator. Estimate pavers needed with waste factor and base material for your patio.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["patio", "paver", "pavers", "landscaping", "hardscape", "outdoor"],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "length",
          label: "Patio Length (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "width",
          label: "Patio Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "paverSize",
          label: "Paver Size",
          type: "select",
          options: [
            { label: '6" × 6"', value: "6x6" },
            { label: '6" × 9"', value: "6x9" },
            { label: '12" × 12"', value: "12x12" },
            { label: '16" × 16"', value: "16x16" },
          ],
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const paverSize = inputs.paverSize as string;
        if (!length || !width || !paverSize) return null;

        const paverDimensions: Record<string, { w: number; h: number }> = {
          "6x6": { w: 6, h: 6 },
          "6x9": { w: 6, h: 9 },
          "12x12": { w: 12, h: 12 },
          "16x16": { w: 16, h: 16 },
        };

        const paver = paverDimensions[paverSize];
        const patioSqFt = length * width;
        const patioSqIn = patioSqFt * 144;
        const paverSqIn = paver.w * paver.h;
        const paversBase = Math.ceil(patioSqIn / paverSqIn);
        const paversWithWaste = Math.ceil(paversBase * 1.05);

        // Base material: 4" gravel + 1" sand
        const gravelCuFt = patioSqFt * (4 / 12);
        const sandCuFt = patioSqFt * (1 / 12);
        const gravelCuYd = gravelCuFt / 27;
        const sandCuYd = sandCuFt / 27;

        return {
          primary: {
            label: "Pavers Needed (with 5% waste)",
            value: formatNumber(paversWithWaste, 0),
          },
          details: [
            { label: "Patio Area", value: formatNumber(patioSqFt, 1) + " sq ft" },
            { label: "Pavers (no waste)", value: formatNumber(paversBase, 0) },
            { label: 'Gravel Base (4" deep)', value: formatNumber(gravelCuYd, 2) + " cu yd" },
            { label: 'Sand Bed (1" deep)', value: formatNumber(sandCuYd, 2) + " cu yd" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "gravel-calculator"],
  faq: [
    {
      question: "Why add 5% for waste?",
      answer:
        "A 5% waste factor covers cuts at edges, breakage, and having extra pavers for future repairs.",
    },
    {
      question: "What base material do I need under pavers?",
      answer:
        "Typically 4 inches of compacted gravel topped with 1 inch of leveling sand before laying pavers.",
    },
  ],
  formula:
    "Pavers = (Patio Sq In ÷ Paver Sq In) × 1.05. Gravel = Area × 4/12. Sand = Area × 1/12.",
};
