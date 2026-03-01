import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageConversionCalculator: CalculatorDefinition = {
  slug: "garage-conversion-calculator",
  title: "Garage Conversion Cost Calculator",
  description: "Estimate the cost of converting a garage into livable space such as a bedroom, office, or apartment.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garage conversion cost", "garage to bedroom cost", "garage remodel cost"],
  variants: [{
    id: "standard",
    name: "Garage Conversion Cost",
    description: "Estimate the cost of converting a garage into livable space such as a bedroom, office, or apartment",
    fields: [
      { name: "sqft", label: "Garage Size", type: "number", suffix: "sq ft", min: 150, max: 800, defaultValue: 400 },
      { name: "use", label: "Conversion Type", type: "select", options: [{value:"room",label:"Single Room"},{value:"suite",label:"Room + Bathroom"},{value:"adu",label:"Full ADU (kitchen + bath)"}], defaultValue: "room" },
      { name: "door", label: "Garage Door", type: "select", options: [{value:"wall",label:"Replace with Wall + Window"},{value:"french",label:"Replace with French Doors"},{value:"keep",label:"Keep (insulate)"}], defaultValue: "wall" },
      { name: "floor", label: "Flooring", type: "select", options: [{value:"laminate",label:"Laminate"},{value:"lvp",label:"Luxury Vinyl Plank"},{value:"hardwood",label:"Engineered Hardwood"}], defaultValue: "lvp" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const use = inputs.use as string;
      const door = inputs.door as string;
      const floor = inputs.floor as string;
      if (!sqft || sqft <= 0) return null;
      const doorCost: Record<string, number> = { wall: 3000, french: 4000, keep: 500 };
      const floorRate: Record<string, number> = { laminate: 5, lvp: 7, hardwood: 12 };
      const wallsAndCeiling = sqft * 15;
      const insulation = sqft * 4;
      const flooring = sqft * (floorRate[floor] || 7);
      const doorWork = doorCost[door] || 3000;
      const electrical = sqft * 6;
      const hvac = sqft * 8;
      const bathroomCost = use === "suite" ? 8000 : use === "adu" ? 10000 : 0;
      const kitchenCost = use === "adu" ? 12000 : 0;
      const permits = 2000;
      const total = wallsAndCeiling + insulation + flooring + doorWork + electrical + hvac + bathroomCost + kitchenCost + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Walls and Ceiling", value: "$" + formatNumber(wallsAndCeiling) },
          { label: "Insulation", value: "$" + formatNumber(insulation) },
          { label: "Flooring", value: "$" + formatNumber(flooring) },
          { label: "Garage Door Conversion", value: "$" + formatNumber(doorWork) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "HVAC", value: "$" + formatNumber(hvac) },
          { label: "Bathroom", value: "$" + formatNumber(bathroomCost) },
          { label: "Kitchen", value: "$" + formatNumber(kitchenCost) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Cost per Sq Ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    },
  }],
  relatedSlugs: ["carport-cost-calculator", "sunroom-cost-calculator"],
  faq: [
    { question: "How much does a garage conversion cost?", answer: "A basic garage conversion costs $10,000 to $25,000. Adding a bathroom increases costs by $8,000 to $15,000. A full ADU with kitchen and bath can cost $30,000 to $70,000." },
    { question: "Do you need a permit to convert a garage?", answer: "Yes, most jurisdictions require building permits for garage conversions. You will typically need to meet building codes for egress, ceiling height, insulation, and electrical." },
  ],
  formula: "Total = Walls + Insulation + Flooring + Door + Electrical + HVAC + Bathroom + Kitchen + Permits",
};
