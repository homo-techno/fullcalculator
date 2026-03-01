import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mudroomCostCalculator: CalculatorDefinition = {
  slug: "mudroom-cost-calculator",
  title: "Mudroom Cost Calculator",
  description: "Estimate the cost to build or remodel a mudroom with storage, flooring, and built-in features.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mudroom cost", "mudroom remodel cost", "mudroom addition cost"],
  variants: [{
    id: "standard",
    name: "Mudroom Cost",
    description: "Estimate the cost to build or remodel a mudroom with storage, flooring, and built-in features",
    fields: [
      { name: "sqft", label: "Mudroom Size", type: "number", suffix: "sq ft", min: 20, max: 200, defaultValue: 60 },
      { name: "scope", label: "Project Scope", type: "select", options: [{value:"remodel",label:"Remodel Existing Space"},{value:"addition",label:"New Addition"}], defaultValue: "remodel" },
      { name: "builtins", label: "Built-In Features", type: "select", options: [{value:"basic",label:"Basic (hooks and shelf)"},{value:"standard",label:"Standard (cubbies and bench)"},{value:"custom",label:"Custom Cabinetry"}], defaultValue: "standard" },
      { name: "floor", label: "Flooring", type: "select", options: [{value:"vinyl",label:"Luxury Vinyl"},{value:"tile",label:"Ceramic Tile"},{value:"slate",label:"Slate/Stone"}], defaultValue: "tile" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const scope = inputs.scope as string;
      const builtins = inputs.builtins as string;
      const floor = inputs.floor as string;
      if (!sqft || sqft <= 0) return null;
      const scopeRate: Record<string, number> = { remodel: 50, addition: 150 };
      const builtinCost: Record<string, number> = { basic: 500, standard: 1500, custom: 4000 };
      const floorRate: Record<string, number> = { vinyl: 6, tile: 12, slate: 20 };
      const construction = sqft * (scopeRate[scope] || 50);
      const cabinetry = builtinCost[builtins] || 1500;
      const flooring = sqft * (floorRate[floor] || 12);
      const electrical = 400;
      const painting = sqft * 3;
      const total = construction + cabinetry + flooring + electrical + painting;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction", value: "$" + formatNumber(construction) },
          { label: "Built-In Features", value: "$" + formatNumber(cabinetry) },
          { label: "Flooring", value: "$" + formatNumber(flooring) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Painting", value: "$" + formatNumber(painting) },
        ],
      };
    },
  }],
  relatedSlugs: ["porch-cost-calculator", "sunroom-cost-calculator"],
  faq: [
    { question: "How much does a mudroom cost?", answer: "Remodeling an existing space into a mudroom costs $2,000 to $8,000. Adding a new mudroom addition costs $10,000 to $25,000 depending on size and finishes." },
    { question: "Does a mudroom add home value?", answer: "Yes, a well-designed mudroom can add $5,000 to $10,000 in home value and is a highly desirable feature for buyers in colder climates." },
  ],
  formula: "Total = (Sq Ft x Scope Rate) + Built-Ins + Flooring + Electrical + Painting",
};
