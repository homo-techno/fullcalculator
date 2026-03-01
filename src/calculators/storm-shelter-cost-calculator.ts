import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stormShelterCostCalculator: CalculatorDefinition = {
  slug: "storm-shelter-cost-calculator",
  title: "Storm Shelter Cost Calculator",
  description: "Estimate the cost of installing a tornado or storm shelter for your home.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["storm shelter cost", "tornado shelter cost", "safe room cost"],
  variants: [{
    id: "standard",
    name: "Storm Shelter Cost",
    description: "Estimate the cost of installing a tornado or storm shelter for your home",
    fields: [
      { name: "type", label: "Shelter Type", type: "select", options: [{value:"underground",label:"Underground (in-ground)"},{value:"aboveground",label:"Above-Ground Safe Room"},{value:"garage",label:"Garage Floor Unit"}], defaultValue: "underground" },
      { name: "capacity", label: "Capacity", type: "select", options: [{value:"4",label:"2-4 People"},{value:"8",label:"6-8 People"},{value:"12",label:"10-12 People"}], defaultValue: "4" },
      { name: "material", label: "Material", type: "select", options: [{value:"steel",label:"Steel"},{value:"concrete",label:"Reinforced Concrete"},{value:"fiberglass",label:"Fiberglass"}], defaultValue: "steel" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const capacity = parseInt(inputs.capacity as string) || 4;
      const material = inputs.material as string;
      const baseCost: Record<string, number> = { underground: 4000, aboveground: 5000, garage: 3500 };
      const capacityMod: Record<number, number> = { 4: 1.0, 8: 1.5, 12: 2.0 };
      const matMod: Record<string, number> = { steel: 1.0, concrete: 1.3, fiberglass: 0.9 };
      const base = (baseCost[type] || 4000) * (capacityMod[capacity] || 1.0) * (matMod[material] || 1.0);
      const installation = type === "underground" ? 2500 : 1000;
      const permits = 500;
      const ventilation = 300;
      const total = base + installation + permits + ventilation;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Shelter Unit", value: "$" + formatNumber(base) },
          { label: "Installation/Excavation", value: "$" + formatNumber(installation) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Ventilation System", value: "$" + formatNumber(ventilation) },
        ],
      };
    },
  }],
  relatedSlugs: ["carport-cost-calculator", "french-drain-calculator"],
  faq: [
    { question: "How much does a storm shelter cost?", answer: "Underground storm shelters cost $3,000 to $10,000 installed. Above-ground safe rooms cost $5,000 to $15,000. FEMA grants may cover part of the cost in eligible areas." },
    { question: "What is the safest type of storm shelter?", answer: "Underground shelters and reinforced concrete above-ground safe rooms are both rated for EF5 tornadoes. Underground shelters are generally considered the safest option." },
  ],
  formula: "Total = (Base Cost x Capacity Mod x Material Mod) + Installation + Permits + Ventilation",
};
