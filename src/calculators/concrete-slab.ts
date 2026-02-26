import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteSlabCalculator: CalculatorDefinition = {
  slug: "concrete-slab",
  title: "Concrete Slab Calculator",
  description:
    "Free online concrete slab calculator. Estimate cubic yards, number of bags, and cost for any rectangular slab, patio, or foundation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "concrete",
    "slab",
    "cubic yards",
    "bags",
    "patio",
    "foundation",
    "cement",
    "pour",
  ],
  variants: [
    {
      id: "slab",
      name: "Rectangular Slab",
      description: "Calculate concrete volume for a rectangular slab",
      fields: [
        {
          name: "length",
          label: "Length",
          type: "number",
          placeholder: "e.g. 20",
          suffix: "ft",
        },
        {
          name: "width",
          label: "Width",
          type: "number",
          placeholder: "e.g. 10",
          suffix: "ft",
        },
        {
          name: "thickness",
          label: "Thickness",
          type: "number",
          placeholder: "e.g. 4",
          suffix: "in",
        },
        {
          name: "pricePerYard",
          label: "Price per Cubic Yard (optional)",
          type: "number",
          placeholder: "e.g. 150",
          prefix: "$",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string) || 0;
        const width = parseFloat(inputs.width as string) || 0;
        const thickness = parseFloat(inputs.thickness as string) || 0;
        const pricePerYard = parseFloat(inputs.pricePerYard as string) || 0;

        if (length <= 0 || width <= 0 || thickness <= 0) return null;

        const thicknessFt = thickness / 12;
        const cubicFeet = length * width * thicknessFt;
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.1; // 10% waste
        const bags40lb = Math.ceil(cubicFeet / 0.011); // ~0.011 cu ft per 40-lb bag
        const bags60lb = Math.ceil(cubicFeet / 0.017); // ~0.017 cu ft per 60-lb bag
        const bags80lb = Math.ceil(cubicFeet / 0.022); // ~0.022 cu ft per 80-lb bag
        const totalCost =
          pricePerYard > 0 ? cubicYardsWithWaste * pricePerYard : 0;

        const details: { label: string; value: string }[] = [
          { label: "Area", value: formatNumber(length * width) + " sq ft" },
          { label: "Volume (cubic feet)", value: formatNumber(cubicFeet) },
          { label: "Volume (cubic yards)", value: formatNumber(cubicYards) },
          {
            label: "With 10% waste",
            value: formatNumber(cubicYardsWithWaste) + " cu yd",
          },
          { label: "40-lb bags needed", value: formatNumber(bags40lb) },
          { label: "60-lb bags needed", value: formatNumber(bags60lb) },
          { label: "80-lb bags needed", value: formatNumber(bags80lb) },
        ];

        if (totalCost > 0) {
          details.push({
            label: "Estimated Cost",
            value: "$" + formatNumber(totalCost),
          });
        }

        return {
          primary: {
            label: "Concrete Needed",
            value: formatNumber(cubicYardsWithWaste) + " cubic yards",
          },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["concrete-column", "concrete-stairs", "rebar-calculator"],
  faq: [
    {
      question: "How do I calculate concrete for a slab?",
      answer:
        "Multiply length x width x thickness (all in feet) to get cubic feet, then divide by 27 to convert to cubic yards. Add 10% extra for waste and spillage.",
    },
    {
      question: "How many bags of concrete do I need?",
      answer:
        "An 80-lb bag of premixed concrete yields about 0.6 cubic feet. Divide your total cubic feet by 0.6 to get the number of 80-lb bags. For a 60-lb bag, divide by 0.45; for a 40-lb bag, divide by 0.3.",
    },
    {
      question: "What is a standard slab thickness?",
      answer:
        "Most residential concrete slabs are 4 inches thick. Garage slabs and driveways are typically 5-6 inches. Heavy-duty industrial slabs may be 6-8 inches or more.",
    },
  ],
  formula:
    "Volume (cu yd) = (Length × Width × (Thickness ÷ 12)) ÷ 27 × 1.10 waste factor",
};
