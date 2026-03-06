import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dockBuildingCostCalculator: CalculatorDefinition = {
  slug: "dock-building-cost-calculator",
  title: "Dock Building Cost Calculator",
  description: "Estimate the cost to build a residential boat dock based on size, materials, water depth, and whether you choose fixed or floating construction.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["dock building cost","boat dock cost","pier construction cost","dock installation price"],
  variants: [{
    id: "standard",
    name: "Dock Building Cost",
    description: "Estimate the cost to build a residential boat dock based on size, materials, water depth, and whether you choose fixed or floating construction.",
    fields: [
      { name: "dockLength", label: "Dock Length (feet)", type: "number", min: 10, max: 200, defaultValue: 40 },
      { name: "dockWidth", label: "Dock Width (feet)", type: "number", min: 4, max: 20, defaultValue: 6 },
      { name: "dockType", label: "Dock Type", type: "select", options: [{ value: "1", label: "Fixed / Piling" }, { value: "2", label: "Floating" }, { value: "3", label: "Combination" }], defaultValue: "1" },
      { name: "material", label: "Decking Material", type: "select", options: [{ value: "20", label: "Pressure-Treated Wood ($20/sqft)" }, { value: "35", label: "Composite ($35/sqft)" }, { value: "50", label: "Aluminum ($50/sqft)" }], defaultValue: "35" },
      { name: "addOns", label: "Add-Ons", type: "select", options: [{ value: "0", label: "None" }, { value: "2000", label: "Lighting ($2,000)" }, { value: "5000", label: "Boat Lift ($5,000)" }, { value: "7000", label: "Both ($7,000)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const length = inputs.dockLength as number;
    const width = inputs.dockWidth as number;
    const dockType = parseInt(inputs.dockType as string);
    const materialCost = parseFloat(inputs.material as string);
    const addOns = parseFloat(inputs.addOns as string);
    const sqft = length * width;
    const deckingCost = sqft * materialCost;
    const typeMult = dockType === 1 ? 1.0 : dockType === 2 ? 1.3 : 1.5;
    const structureCost = deckingCost * typeMult;
    const permits = 500 + length * 10;
    const totalCost = structureCost + permits + addOns;
    const costPerFoot = totalCost / length;
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(Math.round(totalCost)) },
      details: [
        { label: "Deck Area", value: formatNumber(sqft) + " sq ft" },
        { label: "Structure and Decking", value: "$" + formatNumber(Math.round(structureCost)) },
        { label: "Permits (est.)", value: "$" + formatNumber(Math.round(permits)) },
        { label: "Add-Ons", value: addOns > 0 ? "$" + formatNumber(addOns) : "None" },
        { label: "Cost Per Linear Foot", value: "$" + formatNumber(Math.round(costPerFoot)) }
      ]
    };
  },
  }],
  relatedSlugs: ["boat-lift-capacity-calculator","marina-slip-cost-calculator"],
  faq: [
    { question: "How much does it cost to build a dock?", answer: "Residential dock costs range from $3,000 to $50,000 or more. A basic 20-foot pressure-treated wood dock costs $3,000 to $6,000. A 40-foot composite floating dock with accessories can run $20,000 to $40,000." },
    { question: "Do I need a permit to build a dock?", answer: "Yes, almost all waterfront construction requires permits from local, state, and sometimes federal agencies (Army Corps of Engineers). Permit costs and timelines vary significantly by location." },
    { question: "Which dock type is best?", answer: "Fixed piling docks are durable and stable but do not adjust to water level changes. Floating docks move with the water and are better for areas with tidal or seasonal water level changes. Combination docks offer the benefits of both." },
  ],
  formula: "Deck Area = Length x Width; Decking Cost = Area x Material Cost Per Sq Ft; Structure Cost = Decking Cost x Dock Type Multiplier; Total = Structure + Permits + Add-Ons",
};
