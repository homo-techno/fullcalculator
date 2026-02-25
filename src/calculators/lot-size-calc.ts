import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const lotSizeCalculator: CalculatorDefinition = {
  slug: "lot-size-calculator",
  title: "Lot Size Calculator",
  description:
    "Free lot size calculator. Calculate lot area in square feet, acres, and other units. Convert between lot size measurements and estimate lot value.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "lot size calculator",
    "land area calculator",
    "lot size in acres",
    "property lot calculator",
    "land size conversion",
  ],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Lot",
      description: "Calculate area for a rectangular lot",
      fields: [
        {
          name: "length",
          label: "Lot Length",
          type: "number",
          placeholder: "e.g. 150",
          suffix: "ft",
          min: 0,
        },
        {
          name: "width",
          label: "Lot Width",
          type: "number",
          placeholder: "e.g. 100",
          suffix: "ft",
          min: 0,
        },
        {
          name: "pricePerSqFt",
          label: "Land Price Per Sq Ft (optional)",
          type: "number",
          placeholder: "e.g. 15",
          prefix: "$",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const pricePerSqFt = (inputs.pricePerSqFt as number) || 0;
        if (!length || !width) return null;

        const sqft = length * width;
        const acres = sqft / 43560;
        const sqMeters = sqft * 0.0929;
        const estimatedValue = pricePerSqFt > 0 ? sqft * pricePerSqFt : 0;

        return {
          primary: {
            label: "Lot Area",
            value: `${formatNumber(sqft)} sq ft`,
          },
          details: [
            { label: "Acres", value: formatNumber(acres, 4) },
            { label: "Square meters", value: formatNumber(sqMeters, 1) },
            { label: "Perimeter", value: `${formatNumber((length + width) * 2)} ft` },
            ...(estimatedValue > 0
              ? [{ label: "Estimated land value", value: `$${formatNumber(estimatedValue)}` }]
              : []),
          ],
        };
      },
    },
    {
      id: "acres-conversion",
      name: "Acres Conversion",
      description: "Convert between acres, square feet, and other units",
      fields: [
        {
          name: "value",
          label: "Value",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0,
          step: 0.001,
        },
        {
          name: "fromUnit",
          label: "From Unit",
          type: "select",
          options: [
            { label: "Acres", value: "acres" },
            { label: "Square Feet", value: "sqft" },
            { label: "Square Meters", value: "sqm" },
            { label: "Hectares", value: "hectares" },
          ],
          defaultValue: "acres",
        },
      ],
      calculate: (inputs) => {
        const value = inputs.value as number;
        const fromUnit = inputs.fromUnit as string;
        if (!value) return null;

        let sqft = 0;
        if (fromUnit === "acres") sqft = value * 43560;
        else if (fromUnit === "sqft") sqft = value;
        else if (fromUnit === "sqm") sqft = value * 10.7639;
        else if (fromUnit === "hectares") sqft = value * 107639;

        const acres = sqft / 43560;
        const sqMeters = sqft * 0.0929;
        const hectares = sqMeters / 10000;

        return {
          primary: {
            label: "Square Feet",
            value: formatNumber(sqft),
          },
          details: [
            { label: "Acres", value: formatNumber(acres, 4) },
            { label: "Square meters", value: formatNumber(sqMeters, 1) },
            { label: "Hectares", value: formatNumber(hectares, 4) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "cost-per-square-foot-calculator", "building-cost-per-sqft-calculator"],
  faq: [
    {
      question: "How many square feet are in an acre?",
      answer:
        "One acre equals 43,560 square feet. A quarter-acre lot is 10,890 sq ft, which is a common residential lot size. One acre is roughly the size of a football field (excluding end zones).",
    },
    {
      question: "What is a standard residential lot size?",
      answer:
        "Standard residential lot sizes vary widely by location. In suburban areas, common sizes range from 5,000-15,000 sq ft (0.11-0.34 acres). Urban lots may be 2,000-5,000 sq ft, while rural properties are often 1+ acres.",
    },
    {
      question: "How do I find my lot size?",
      answer:
        "Check your property deed or plat map, which can be found at your county recorder's office. You can also check your property tax assessment, use online GIS mapping tools from your county, or measure the property boundaries yourself.",
    },
  ],
  formula: "Area = Length x Width | 1 Acre = 43,560 sq ft",
};
