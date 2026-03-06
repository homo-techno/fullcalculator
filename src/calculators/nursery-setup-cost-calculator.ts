import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const nurserySetupCostCalculator: CalculatorDefinition = {
  slug: "nursery-setup-cost-calculator",
  title: "Nursery Setup Cost Calculator",
  description: "Estimate the total cost of setting up a baby nursery including furniture, bedding, decor, and essential gear.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["nursery cost","baby room setup","nursery budget","baby furniture cost","nursery essentials"],
  variants: [{
    id: "standard",
    name: "Nursery Setup Cost",
    description: "Estimate the total cost of setting up a baby nursery including furniture, bedding, decor, and essential gear.",
    fields: [
      { name: "crib", label: "Crib Cost ($)", type: "number", min: 100, max: 2000, defaultValue: 350 },
      { name: "dresser", label: "Dresser/Changing Table ($)", type: "number", min: 100, max: 1500, defaultValue: 300 },
      { name: "chair", label: "Glider/Rocker Chair ($)", type: "number", min: 100, max: 2000, defaultValue: 400 },
      { name: "bedding", label: "Bedding and Linens ($)", type: "number", min: 50, max: 500, defaultValue: 150 },
      { name: "decor", label: "Decor and Paint ($)", type: "number", min: 50, max: 1000, defaultValue: 200 },
      { name: "extras", label: "Monitor, Lamp, Storage ($)", type: "number", min: 50, max: 1000, defaultValue: 250 },
    ],
    calculate: (inputs) => {
    const crib = inputs.crib as number;
    const dresser = inputs.dresser as number;
    const chair = inputs.chair as number;
    const bedding = inputs.bedding as number;
    const decor = inputs.decor as number;
    const extras = inputs.extras as number;
    const furniture = crib + dresser + chair;
    const softGoods = bedding + decor;
    const totalCost = furniture + softGoods + extras;
    const perItem = totalCost / 6;
    return {
      primary: { label: "Total Nursery Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Furniture Subtotal", value: "$" + formatNumber(Math.round(furniture)) },
        { label: "Bedding and Decor", value: "$" + formatNumber(Math.round(softGoods)) },
        { label: "Electronics and Storage", value: "$" + formatNumber(Math.round(extras)) },
        { label: "Average Per Item", value: "$" + formatNumber(Math.round(perItem)) }
      ]
    };
  },
  }],
  relatedSlugs: ["baby-formula-cost-calculator","childproofing-cost-calculator","baby-clothes-size-predictor"],
  faq: [
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
    { question: "undefined", answer: "undefined" },
  ],
  formula: "Total Cost = Crib + Dresser + Chair + Bedding + Decor + Extras; Furniture = Crib + Dresser + Chair",
};
