import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteColumnCalculator: CalculatorDefinition = {
  slug: "concrete-column",
  title: "Concrete Column Calculator",
  description:
    "Free online concrete column and cylinder calculator. Estimate cubic yards and bags for round columns, piers, footings, and sonotubes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "concrete",
    "column",
    "cylinder",
    "pier",
    "sonotube",
    "footing",
    "round",
    "post",
  ],
  variants: [
    {
      id: "single-column",
      name: "Single Column",
      description: "Calculate concrete for a single cylindrical column",
      fields: [
        {
          name: "diameter",
          label: "Diameter",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "in",
        },
        {
          name: "height",
          label: "Height / Depth",
          type: "number",
          placeholder: "e.g. 48",
          suffix: "in",
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;

        if (diameter <= 0 || height <= 0) return null;

        const radiusFt = diameter / 2 / 12;
        const heightFt = height / 12;
        const cubicFeet = Math.PI * radiusFt * radiusFt * heightFt;
        const cubicYards = cubicFeet / 27;
        const bags80lb = Math.ceil(cubicFeet / 0.022);

        return {
          primary: {
            label: "Concrete Needed",
            value: formatNumber(cubicYards) + " cubic yards",
          },
          details: [
            { label: "Volume (cubic feet)", value: formatNumber(cubicFeet) },
            { label: "Volume (cubic yards)", value: formatNumber(cubicYards) },
            { label: "80-lb bags needed", value: formatNumber(bags80lb) },
          ],
        };
      },
    },
    {
      id: "multiple-columns",
      name: "Multiple Columns",
      description: "Calculate concrete for multiple identical columns",
      fields: [
        {
          name: "diameter",
          label: "Diameter",
          type: "number",
          placeholder: "e.g. 12",
          suffix: "in",
        },
        {
          name: "height",
          label: "Height / Depth",
          type: "number",
          placeholder: "e.g. 48",
          suffix: "in",
        },
        {
          name: "quantity",
          label: "Number of Columns",
          type: "number",
          placeholder: "e.g. 6",
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string) || 0;
        const height = parseFloat(inputs.height as string) || 0;
        const quantity = parseFloat(inputs.quantity as string) || 1;

        if (diameter <= 0 || height <= 0 || quantity <= 0) return null;

        const radiusFt = diameter / 2 / 12;
        const heightFt = height / 12;
        const cubicFeetEach = Math.PI * radiusFt * radiusFt * heightFt;
        const totalCubicFeet = cubicFeetEach * quantity;
        const totalCubicYards = totalCubicFeet / 27;
        const withWaste = totalCubicYards * 1.1;
        const bags80lb = Math.ceil(totalCubicFeet / 0.022);

        return {
          primary: {
            label: "Total Concrete Needed",
            value: formatNumber(withWaste) + " cubic yards",
          },
          details: [
            {
              label: "Per column",
              value: formatNumber(cubicFeetEach) + " cu ft",
            },
            {
              label: "Total volume",
              value: formatNumber(totalCubicFeet) + " cu ft",
            },
            {
              label: "Total (cubic yards)",
              value: formatNumber(totalCubicYards),
            },
            {
              label: "With 10% waste",
              value: formatNumber(withWaste) + " cu yd",
            },
            { label: "80-lb bags needed", value: formatNumber(bags80lb) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["concrete-slab", "concrete-stairs", "rebar-calculator"],
  faq: [
    {
      question: "How do I calculate concrete for a round column?",
      answer:
        "Use the formula: Volume = pi x radius^2 x height. Convert all measurements to feet first, then divide cubic feet by 27 to get cubic yards.",
    },
    {
      question: "What size sonotube do I need for a deck post?",
      answer:
        "Most residential deck posts use 8-inch or 10-inch sonotubes. Check local building codes for minimum footing size requirements based on your deck load.",
    },
  ],
  formula:
    "Volume (cu ft) = pi x (Diameter / 2)^2 x Height (all in feet); cu yd = cu ft / 27",
};
