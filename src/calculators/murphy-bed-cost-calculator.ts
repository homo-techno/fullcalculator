import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const murphyBedCostCalculator: CalculatorDefinition = {
  slug: "murphy-bed-cost-calculator",
  title: "Murphy Bed Cost Calculator",
  description: "Estimate the cost to install a wall bed (Murphy bed) including the unit, cabinetry, and installation.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["murphy bed cost", "wall bed cost", "fold up bed cost"],
  variants: [{
    id: "standard",
    name: "Murphy Bed Cost",
    description: "Estimate the cost to install a wall bed (Murphy bed) including the unit, cabinetry, and installation",
    fields: [
      { name: "size", label: "Bed Size", type: "select", options: [{value:"twin",label:"Twin"},{value:"full",label:"Full"},{value:"queen",label:"Queen"},{value:"king",label:"King"}], defaultValue: "queen" },
      { name: "type", label: "Unit Type", type: "select", options: [{value:"kit",label:"DIY Kit"},{value:"prefab",label:"Pre-Built Unit"},{value:"custom",label:"Custom Built-In"}], defaultValue: "prefab" },
      { name: "cabinets", label: "Side Cabinets", type: "select", options: [{value:"none",label:"No Side Cabinets"},{value:"shelves",label:"Open Shelves"},{value:"closed",label:"Closed Cabinets"}], defaultValue: "shelves" },
    ],
    calculate: (inputs) => {
      const size = inputs.size as string;
      const type = inputs.type as string;
      const cabinets = inputs.cabinets as string;
      const sizeCost: Record<string, number> = { twin: 0.7, full: 0.85, queen: 1.0, king: 1.3 };
      const typeCost: Record<string, number> = { kit: 800, prefab: 2000, custom: 5000 };
      const cabinetCost: Record<string, number> = { none: 0, shelves: 600, closed: 1200 };
      const unit = (typeCost[type] || 2000) * (sizeCost[size] || 1.0);
      const cabs = cabinetCost[cabinets] || 0;
      const mattress = 500;
      const installation = type === "kit" ? 300 : type === "prefab" ? 500 : 1500;
      const wallPrep = 200;
      const total = unit + cabs + mattress + installation + wallPrep;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Murphy Bed Unit", value: "$" + formatNumber(unit) },
          { label: "Side Cabinets", value: "$" + formatNumber(cabs) },
          { label: "Mattress", value: "$" + formatNumber(mattress) },
          { label: "Installation", value: "$" + formatNumber(installation) },
          { label: "Wall Preparation", value: "$" + formatNumber(wallPrep) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does a Murphy bed cost?", answer: "A DIY Murphy bed kit costs $500 to $1,200. Pre-built units run $1,500 to $3,500. Custom built-in Murphy beds with cabinetry cost $4,000 to $10,000 or more." },
    { question: "Are Murphy beds comfortable?", answer: "Modern Murphy beds use standard mattresses up to 12 inches thick, so they are just as comfortable as a regular bed. The key is choosing a quality mattress." },
  ],
  formula: "Total = (Unit Cost x Size Modifier) + Cabinets + Mattress + Installation + Wall Prep",
};
