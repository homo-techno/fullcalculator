import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const floodDamageCalculator: CalculatorDefinition = {
  slug: "flood-damage-calculator",
  title: "Flood Damage Estimate Calculator",
  description: "Estimate potential flood damage costs based on water depth, home value, and building characteristics.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["flood damage cost", "flood damage estimate", "flood loss calculation"],
  variants: [{
    id: "standard",
    name: "Flood Damage Estimate",
    description: "Estimate potential flood damage costs based on water depth, home value, and building characteristics",
    fields: [
      { name: "homeValue", label: "Home Value", type: "number", prefix: "$", min: 50000, max: 5000000, defaultValue: 300000 },
      { name: "waterDepth", label: "Water Depth", type: "number", suffix: "inches", min: 1, max: 120, defaultValue: 12 },
      { name: "basement", label: "Basement Type", type: "select", options: [{value:"none",label:"No Basement"},{value:"unfinished",label:"Unfinished Basement"},{value:"finished",label:"Finished Basement"}], defaultValue: "none" },
      { name: "floorType", label: "Floor Type", type: "select", options: [{value:"tile",label:"Tile/Concrete"},{value:"laminate",label:"Laminate"},{value:"hardwood",label:"Hardwood"},{value:"carpet",label:"Carpet"}], defaultValue: "hardwood" },
    ],
    calculate: (inputs) => {
      const value = inputs.homeValue as number;
      const depth = inputs.waterDepth as number;
      const basement = inputs.basement as string;
      const floor = inputs.floorType as string;
      if (!value || !depth) return null;
      const depthFactor = Math.min(depth / 96, 1.0);
      const structuralDamage = Math.round(value * depthFactor * 0.25);
      const floorCost: Record<string, number> = { tile: 5, laminate: 8, hardwood: 15, carpet: 12 };
      const floorDamage = depth > 1 ? Math.round(1500 * (floorCost[floor] || 8)) : 0;
      const basementCost: Record<string, number> = { none: 0, unfinished: 5000, finished: 25000 };
      const basementDamage = basementCost[basement] || 0;
      const contentsDamage = Math.round(value * 0.1 * depthFactor);
      const total = structuralDamage + floorDamage + basementDamage + contentsDamage;
      return {
        primary: { label: "Estimated Total Damage", value: "$" + formatNumber(total) },
        details: [
          { label: "Structural Damage", value: "$" + formatNumber(structuralDamage) },
          { label: "Floor Damage", value: "$" + formatNumber(floorDamage) },
          { label: "Contents Damage", value: "$" + formatNumber(contentsDamage) },
        ],
      };
    },
  }],
  relatedSlugs: ["hurricane-prep-cost-calculator", "wildfire-prep-calculator"],
  faq: [
    { question: "How much damage can a flood cause?", answer: "Even one inch of water can cause $25,000 or more in damage. Costs increase rapidly with water depth, especially in homes with finished basements." },
    { question: "Does homeowner insurance cover flood damage?", answer: "Standard homeowner insurance does not cover flood damage. You need a separate flood insurance policy through the NFIP or a private insurer." },
  ],
  formula: "Total Damage = Structural Damage + Floor Damage + Basement Damage + Contents Damage",
};
