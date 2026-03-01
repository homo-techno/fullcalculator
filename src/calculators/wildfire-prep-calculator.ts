import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wildfirePrepCalculator: CalculatorDefinition = {
  slug: "wildfire-prep-calculator",
  title: "Wildfire Preparedness Calculator",
  description: "Estimate the cost of wildfire preparation including defensible space, ember-resistant materials, and evacuation supplies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wildfire preparation", "wildfire defense cost", "fire preparedness"],
  variants: [{
    id: "standard",
    name: "Wildfire Preparedness",
    description: "Estimate the cost of wildfire preparation including defensible space, ember-resistant materials, and evacuation supplies",
    fields: [
      { name: "lotSize", label: "Lot Size", type: "number", suffix: "acres", min: 0.1, max: 100, defaultValue: 0.5 },
      { name: "vegetation", label: "Vegetation Density", type: "select", options: [{value:"light",label:"Light/Grass"},{value:"moderate",label:"Moderate/Shrubs"},{value:"heavy",label:"Heavy/Forest"}], defaultValue: "moderate" },
      { name: "roofType", label: "Roof Material", type: "select", options: [{value:"metal",label:"Metal (Fire Resistant)"},{value:"tile",label:"Tile (Fire Resistant)"},{value:"asphalt",label:"Asphalt Shingle"},{value:"wood",label:"Wood Shake"}], defaultValue: "asphalt" },
      { name: "occupants", label: "Number of Occupants", type: "number", min: 1, max: 12, defaultValue: 4 },
    ],
    calculate: (inputs) => {
      const lot = inputs.lotSize as number;
      const veg = inputs.vegetation as string;
      const roof = inputs.roofType as string;
      const people = inputs.occupants as number;
      if (!lot || !people) return null;
      const clearingCost: Record<string, number> = { light: 500, moderate: 2000, heavy: 5000 };
      const roofUpgrade: Record<string, number> = { metal: 0, tile: 0, asphalt: 3000, wood: 8000 };
      const defensible = Math.round((clearingCost[veg] || 2000) * lot);
      const roofCost = roofUpgrade[roof] || 0;
      const evacKit = people * 100;
      const ventScreens = 800;
      const total = defensible + roofCost + evacKit + ventScreens;
      return {
        primary: { label: "Total Prep Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Defensible Space", value: "$" + formatNumber(defensible) },
          { label: "Roof Upgrade", value: roofCost > 0 ? "$" + formatNumber(roofCost) : "Already fire-resistant" },
          { label: "Evacuation Kits", value: "$" + formatNumber(evacKit) },
        ],
      };
    },
  }],
  relatedSlugs: ["hurricane-prep-cost-calculator", "flood-damage-calculator"],
  faq: [
    { question: "How do I create defensible space around my home?", answer: "Clear flammable vegetation within 30 feet of your home, thin trees within 100 feet, and maintain a gravel or hardscape zone within 5 feet of the foundation." },
    { question: "What is the most fire-resistant roofing?", answer: "Metal and tile roofs are Class A fire-rated and most resistant to embers. Wood shake roofs are the most vulnerable and should be replaced in fire-prone areas." },
  ],
  formula: "Total = Defensible Space Cost + Roof Upgrade + Evacuation Kits + Vent Screens",
};
