import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concretePatioCalculator: CalculatorDefinition = {
  slug: "concrete-patio-calculator",
  title: "Concrete Patio Volume & Cost Calculator",
  description:
    "Calculate the concrete volume and estimated cost for a patio project. Includes material, labor, and finishing costs for standard and stamped concrete.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "concrete patio calculator",
    "patio cost calculator",
    "patio concrete",
    "stamped concrete cost",
    "patio slab calculator",
  ],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Patio",
      description: "Calculate concrete and cost for a rectangular patio",
      fields: [
        {
          name: "length",
          label: "Patio Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Patio Width (feet)",
          type: "number",
          placeholder: "e.g. 12",
        },
        {
          name: "thickness",
          label: "Slab Thickness (inches)",
          type: "select",
          options: [
            { label: '4" (standard)', value: "4" },
            { label: '5" (extra strength)', value: "5" },
            { label: '6" (heavy duty)', value: "6" },
          ],
          defaultValue: "4",
        },
        {
          name: "finish",
          label: "Finish Type",
          type: "select",
          options: [
            { label: "Broom finish (basic)", value: "basic" },
            { label: "Exposed aggregate", value: "exposed" },
            { label: "Stamped concrete", value: "stamped" },
            { label: "Stained/colored", value: "stained" },
          ],
          defaultValue: "basic",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const thickness = parseFloat(inputs.thickness as string);
        const finish = inputs.finish as string;
        if (!length || !width || !thickness) return null;

        const sqFt = length * width;
        const cubicFeet = sqFt * (thickness / 12);
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.1;

        // Concrete cost: ~$130 per cubic yard delivered
        const concreteCost = cubicYardsWithWaste * 130;

        // Labor + finishing per sq ft
        const finishCosts: Record<string, number> = {
          basic: 6,
          exposed: 10,
          stamped: 15,
          stained: 12,
        };
        const laborPerSqFt = finishCosts[finish] || 6;
        const laborCost = sqFt * laborPerSqFt;

        // Rebar/mesh
        const rebarCost = sqFt * 0.5;

        // Gravel base: 4 inches
        const gravelCuYd = (sqFt * (4 / 12)) / 27;
        const gravelCost = gravelCuYd * 35;

        const totalCost = concreteCost + laborCost + rebarCost + gravelCost;

        // Bags for DIY
        const bags80lb = Math.ceil(cubicFeet / 0.6);

        return {
          primary: {
            label: "Concrete Needed",
            value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards`,
          },
          details: [
            { label: "Patio area", value: `${formatNumber(sqFt)} sq ft` },
            { label: "Concrete volume", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd (with 10% waste)` },
            { label: "80-lb bags (DIY)", value: formatNumber(bags80lb) },
            { label: "Concrete cost", value: `$${formatNumber(concreteCost)}` },
            { label: "Labor & finishing", value: `$${formatNumber(laborCost)}` },
            { label: "Rebar/mesh", value: `$${formatNumber(rebarCost)}` },
            { label: "Gravel base (4\")", value: `$${formatNumber(gravelCost)}` },
            { label: "Total estimated cost", value: `$${formatNumber(totalCost)}` },
            { label: "Cost per sq ft", value: `$${formatNumber(totalCost / sqFt, 2)}` },
          ],
          note: "Costs are estimates for budgeting. Labor costs vary widely by region. Ready-mix concrete is recommended for patios over 1 cubic yard.",
        };
      },
    },
    {
      id: "circular",
      name: "Circular Patio",
      description: "Calculate concrete for a round patio",
      fields: [
        {
          name: "diameter",
          label: "Diameter (feet)",
          type: "number",
          placeholder: "e.g. 16",
        },
        {
          name: "thickness",
          label: "Slab Thickness (inches)",
          type: "select",
          options: [
            { label: '4" (standard)', value: "4" },
            { label: '5"', value: "5" },
            { label: '6"', value: "6" },
          ],
          defaultValue: "4",
        },
      ],
      calculate: (inputs) => {
        const diameter = parseFloat(inputs.diameter as string);
        const thickness = parseFloat(inputs.thickness as string);
        if (!diameter || !thickness) return null;

        const radius = diameter / 2;
        const sqFt = Math.PI * radius * radius;
        const cubicFeet = sqFt * (thickness / 12);
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.1;
        const bags80lb = Math.ceil(cubicFeet / 0.6);

        return {
          primary: {
            label: "Concrete Needed",
            value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards`,
          },
          details: [
            { label: "Patio area", value: `${formatNumber(sqFt, 1)} sq ft` },
            { label: "Exact volume", value: `${formatNumber(cubicYards, 2)} cu yd` },
            { label: "With 10% waste", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "80-lb bags (DIY)", value: formatNumber(bags80lb) },
          ],
          note: "Round patios may require flexible forms. Consider having the form pre-built to the exact radius.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "cement-calculator", "square-footage-calculator"],
  faq: [
    {
      question: "How much does a concrete patio cost?",
      answer:
        "A basic broom-finish concrete patio costs $6-10 per square foot installed. Stamped concrete runs $12-20/sqft. Stained or colored concrete is $10-15/sqft. A typical 12x20 patio (240 sqft) costs $1,500-3,500 depending on the finish.",
    },
    {
      question: "How thick should a concrete patio be?",
      answer:
        "Standard patios should be 4 inches thick. If you plan to park vehicles or place heavy objects on it, use 5-6 inches. Always pour over a compacted gravel base (4 inches minimum) and use reinforcement (rebar or wire mesh).",
    },
  ],
  formula:
    "Volume = L x W x Thickness/12 | Cu Yd = Volume / 27 | Add 10% waste | Cost = Concrete + Labor + Rebar + Base",
};
