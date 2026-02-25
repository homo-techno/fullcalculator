import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const costPerSquareFootCalculator: CalculatorDefinition = {
  slug: "cost-per-square-foot-calculator",
  title: "Cost Per Square Foot Calculator",
  description:
    "Free cost per square foot calculator. Calculate and compare property values by price per square foot for homes, commercial buildings, and renovations.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "cost per square foot",
    "price per sq ft",
    "square foot cost calculator",
    "home price per sqft",
    "property cost comparison",
  ],
  variants: [
    {
      id: "basic",
      name: "Price Per Square Foot",
      description: "Calculate cost per square foot for a property",
      fields: [
        {
          name: "totalPrice",
          label: "Total Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "squareFeet",
          label: "Total Square Footage",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "sq ft",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const price = inputs.totalPrice as number;
        const sqft = inputs.squareFeet as number;
        if (!price || !sqft) return null;

        const costPerSqFt = price / sqft;

        return {
          primary: {
            label: "Cost Per Square Foot",
            value: `$${formatNumber(costPerSqFt)}`,
          },
          details: [
            { label: "Total price", value: `$${formatNumber(price)}` },
            { label: "Total square footage", value: `${formatNumber(sqft)} sq ft` },
            { label: "Cost per 100 sq ft", value: `$${formatNumber(costPerSqFt * 100)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Properties",
      description: "Compare two properties by cost per square foot",
      fields: [
        {
          name: "price1",
          label: "Property A Price",
          type: "number",
          placeholder: "e.g. 350000",
          prefix: "$",
          min: 0,
        },
        {
          name: "sqft1",
          label: "Property A Square Footage",
          type: "number",
          placeholder: "e.g. 2000",
          suffix: "sq ft",
          min: 0,
        },
        {
          name: "price2",
          label: "Property B Price",
          type: "number",
          placeholder: "e.g. 420000",
          prefix: "$",
          min: 0,
        },
        {
          name: "sqft2",
          label: "Property B Square Footage",
          type: "number",
          placeholder: "e.g. 2800",
          suffix: "sq ft",
          min: 0,
        },
      ],
      calculate: (inputs) => {
        const price1 = inputs.price1 as number;
        const sqft1 = inputs.sqft1 as number;
        const price2 = inputs.price2 as number;
        const sqft2 = inputs.sqft2 as number;
        if (!price1 || !sqft1 || !price2 || !sqft2) return null;

        const costPerSqFt1 = price1 / sqft1;
        const costPerSqFt2 = price2 / sqft2;
        const difference = Math.abs(costPerSqFt1 - costPerSqFt2);
        const betterValue = costPerSqFt1 < costPerSqFt2 ? "Property A" : "Property B";

        return {
          primary: {
            label: "Better Value",
            value: betterValue,
          },
          details: [
            { label: "Property A per sq ft", value: `$${formatNumber(costPerSqFt1)}` },
            { label: "Property B per sq ft", value: `$${formatNumber(costPerSqFt2)}` },
            { label: "Difference per sq ft", value: `$${formatNumber(difference)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "mortgage-calculator", "building-cost-per-sqft-calculator"],
  faq: [
    {
      question: "How do you calculate cost per square foot?",
      answer:
        "Divide the total price by the total square footage. For example, a $350,000 home with 2,000 sq ft costs $175 per square foot ($350,000 / 2,000 = $175).",
    },
    {
      question: "What is a good price per square foot?",
      answer:
        "Price per square foot varies dramatically by location, property type, and condition. In 2024, the national average for existing homes is around $150-200/sq ft, but urban areas can exceed $500/sq ft while rural areas may be under $100/sq ft.",
    },
    {
      question: "Should I compare homes by price per square foot?",
      answer:
        "Price per square foot is a useful starting comparison, but it does not account for lot size, location quality, renovation status, number of bedrooms/bathrooms, or neighborhood amenities. Use it as one factor among many.",
    },
  ],
  formula: "Cost Per Sq Ft = Total Price / Total Square Footage",
};
