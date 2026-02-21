import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const pricePerUnitCalculator: CalculatorDefinition = {
  slug: "price-per-unit-calculator",
  title: "Price Per Unit Calculator",
  description: "Free price per unit calculator. Calculate unit price, compare bulk pricing, and find the best deal per unit.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["price per unit calculator", "unit price calculator", "cost per unit", "unit cost comparison", "bulk pricing calculator"],
  variants: [
    {
      id: "basic",
      name: "Price per Unit",
      description: "Calculate the price per individual unit",
      fields: [
        { name: "totalPrice", label: "Total Price", type: "number", placeholder: "e.g. 24.99", prefix: "$", step: 0.01 },
        { name: "quantity", label: "Number of Units", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const totalPrice = inputs.totalPrice as number;
        const quantity = inputs.quantity as number;
        if (!totalPrice || !quantity) return null;
        const pricePerUnit = totalPrice / quantity;
        return {
          primary: { label: "Price per Unit", value: `$${formatNumber(pricePerUnit, 4)}` },
          details: [
            { label: "Total Price", value: `$${formatNumber(totalPrice)}` },
            { label: "Quantity", value: formatNumber(quantity, 0) },
            { label: "Price per 10 Units", value: `$${formatNumber(pricePerUnit * 10)}` },
            { label: "Price per 100 Units", value: `$${formatNumber(pricePerUnit * 100)}` },
          ],
        };
      },
    },
    {
      id: "compare",
      name: "Compare Unit Prices",
      description: "Compare two options to find the better deal per unit",
      fields: [
        { name: "priceA", label: "Option A: Total Price", type: "number", placeholder: "e.g. 5.99", prefix: "$", step: 0.01 },
        { name: "quantityA", label: "Option A: Quantity", type: "number", placeholder: "e.g. 6" },
        { name: "priceB", label: "Option B: Total Price", type: "number", placeholder: "e.g. 9.49", prefix: "$", step: 0.01 },
        { name: "quantityB", label: "Option B: Quantity", type: "number", placeholder: "e.g. 12" },
      ],
      calculate: (inputs) => {
        const priceA = inputs.priceA as number;
        const qtyA = inputs.quantityA as number;
        const priceB = inputs.priceB as number;
        const qtyB = inputs.quantityB as number;
        if (!priceA || !qtyA || !priceB || !qtyB) return null;
        const unitA = priceA / qtyA;
        const unitB = priceB / qtyB;
        const savings = Math.abs(unitA - unitB);
        const savingsPct = (savings / Math.max(unitA, unitB)) * 100;
        const betterOption = unitA <= unitB ? "A" : "B";
        return {
          primary: { label: "Best Deal", value: `Option ${betterOption}`, suffix: `saves $${formatNumber(savings, 4)}/unit` },
          details: [
            { label: "Option A: Price/Unit", value: `$${formatNumber(unitA, 4)}` },
            { label: "Option B: Price/Unit", value: `$${formatNumber(unitB, 4)}` },
            { label: "Savings per Unit", value: `$${formatNumber(savings, 4)}` },
            { label: "Savings Percentage", value: `${formatNumber(savingsPct)}%` },
          ],
        };
      },
    },
    {
      id: "byWeight",
      name: "Price per Weight",
      description: "Calculate price per ounce, pound, or kilogram",
      fields: [
        { name: "totalPrice", label: "Total Price", type: "number", placeholder: "e.g. 7.99", prefix: "$", step: 0.01 },
        { name: "weight", label: "Weight/Volume Amount", type: "number", placeholder: "e.g. 32", step: 0.01 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Ounces (oz)", value: "oz" },
          { label: "Pounds (lb)", value: "lb" },
          { label: "Grams (g)", value: "g" },
          { label: "Kilograms (kg)", value: "kg" },
          { label: "Liters (L)", value: "l" },
          { label: "Fluid Ounces (fl oz)", value: "floz" },
        ], defaultValue: "oz" },
      ],
      calculate: (inputs) => {
        const totalPrice = inputs.totalPrice as number;
        const weight = inputs.weight as number;
        const unit = inputs.unit as string;
        if (!totalPrice || !weight) return null;
        const pricePerUnit = totalPrice / weight;
        const unitLabels: Record<string, string> = { oz: "oz", lb: "lb", g: "g", kg: "kg", l: "L", floz: "fl oz" };
        const label = unitLabels[unit] || unit;
        return {
          primary: { label: `Price per ${label}`, value: `$${formatNumber(pricePerUnit, 4)}` },
          details: [
            { label: "Total Price", value: `$${formatNumber(totalPrice)}` },
            { label: "Total Weight/Volume", value: `${formatNumber(weight)} ${label}` },
            { label: `Price per 10 ${label}`, value: `$${formatNumber(pricePerUnit * 10)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["margin-calculator", "discount-calculator", "markup-calculator"],
  faq: [
    { question: "How do you calculate price per unit?", answer: "Price per Unit = Total Price / Number of Units. For example, if a 12-pack costs $9.99, the price per unit is $9.99 / 12 = $0.83 per unit." },
    { question: "Is buying in bulk always cheaper per unit?", answer: "Usually yes, but not always. Some retailers have unit prices on shelf labels. Always calculate price per unit to compare. Sometimes smaller packages are on sale and have a lower unit price than bulk." },
    { question: "What is unit pricing?", answer: "Unit pricing shows the cost per standard unit of measurement (per ounce, per pound, per item). It allows you to compare products of different sizes to find the best value regardless of package size." },
  ],
  formula: "Price per Unit = Total Price / Quantity | Savings = |Unit Price A - Unit Price B|",
};
