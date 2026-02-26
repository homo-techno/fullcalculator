import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const thinsetCalculator: CalculatorDefinition = {
  slug: "thinset-calc",
  title: "Thinset Mortar Calculator",
  description:
    "Free online thinset mortar calculator. Estimate how much thinset you need for tile installation based on area, tile size, and trowel notch size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "thinset",
    "mortar",
    "tile",
    "adhesive",
    "trowel",
    "notch",
    "floor",
    "wall",
  ],
  variants: [
    {
      id: "thinset",
      name: "Thinset Estimate",
      description: "Calculate thinset mortar for tile installation",
      fields: [
        {
          name: "area",
          label: "Total Tile Area",
          type: "number",
          placeholder: "e.g. 200",
          suffix: "sq ft",
        },
        {
          name: "trowelSize",
          label: "Trowel Notch Size",
          type: "select",
          options: [
            { label: '1/4" x 1/4" (small tile)', value: "0.25" },
            { label: '3/8" x 3/8" (medium tile)', value: "0.375" },
            { label: '1/2" x 1/2" (large tile)', value: "0.5" },
            { label: '3/4" x 3/4" (very large tile)', value: "0.75" },
          ],
          defaultValue: "0.375",
        },
        {
          name: "wastePercent",
          label: "Waste Factor",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "%",
          defaultValue: 10,
        },
      ],
      calculate: (inputs) => {
        const area = parseFloat(inputs.area as string) || 0;
        const trowelSize = parseFloat(inputs.trowelSize as string) || 0.375;
        const wastePercent = parseFloat(inputs.wastePercent as string) || 10;

        if (area <= 0) return null;

        // Coverage rates (sq ft per 50-lb bag) based on trowel size:
        // 1/4" = ~95 sq ft, 3/8" = ~60 sq ft, 1/2" = ~40 sq ft, 3/4" = ~25 sq ft
        let coveragePerBag: number;
        if (trowelSize <= 0.25) coveragePerBag = 95;
        else if (trowelSize <= 0.375) coveragePerBag = 60;
        else if (trowelSize <= 0.5) coveragePerBag = 40;
        else coveragePerBag = 25;

        const wasteFactor = 1 + wastePercent / 100;
        const adjustedArea = area * wasteFactor;
        const bags50lb = Math.ceil(adjustedArea / coveragePerBag);
        const totalWeight = bags50lb * 50;

        return {
          primary: {
            label: "Thinset Needed",
            value: formatNumber(bags50lb) + " bags (50 lb)",
          },
          details: [
            { label: "Coverage area", value: formatNumber(area) + " sq ft" },
            {
              label: "With waste",
              value: formatNumber(adjustedArea) + " sq ft",
            },
            {
              label: "Coverage per bag",
              value: formatNumber(coveragePerBag) + " sq ft",
            },
            { label: "Total weight", value: formatNumber(totalWeight) + " lbs" },
            {
              label: "Trowel notch size",
              value: trowelSize + '"',
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["grout-calculator", "mortar-calculator"],
  faq: [
    {
      question: "How much thinset do I need per square foot?",
      answer:
        "It depends on the trowel notch size. With a 1/4-inch notch trowel, one 50-lb bag covers about 95 sq ft. With a 1/2-inch notch trowel for larger tiles, one bag covers about 40 sq ft.",
    },
    {
      question: "What trowel size should I use?",
      answer:
        "Use a 1/4-inch notch for tiles up to 8 inches, 3/8-inch for tiles 8-16 inches, 1/2-inch for tiles 16-24 inches, and 3/4-inch for tiles larger than 24 inches.",
    },
  ],
  formula:
    "Bags = ceil((Area × WasteFactor) / CoveragePerBag); coverage varies by trowel notch size",
};
