import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const staircaseCostCalculator: CalculatorDefinition = {
  slug: "staircase-cost-calculator",
  title: "Staircase Cost Calculator",
  description: "Estimate the cost of building a new staircase or replacing an existing one.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["staircase cost", "stair replacement cost", "new staircase cost"],
  variants: [{
    id: "standard",
    name: "Staircase Cost",
    description: "Estimate the cost of building a new staircase or replacing an existing one",
    fields: [
      { name: "type", label: "Staircase Type", type: "select", options: [{value:"straight",label:"Straight"},{value:"lshaped",label:"L-Shaped"},{value:"ushaped",label:"U-Shaped"},{value:"spiral",label:"Spiral"}], defaultValue: "straight" },
      { name: "material", label: "Material", type: "select", options: [{value:"wood",label:"Hardwood"},{value:"metal",label:"Metal"},{value:"combo",label:"Wood + Metal Combo"}], defaultValue: "wood" },
      { name: "stories", label: "Height", type: "select", options: [{value:"1",label:"One Story (12-14 steps)"},{value:"2",label:"Two Stories (24-28 steps)"}], defaultValue: "1" },
      { name: "railing", label: "Railing Style", type: "select", options: [{value:"standard",label:"Standard Wood"},{value:"iron",label:"Wrought Iron"},{value:"glass",label:"Glass Panel"},{value:"cable",label:"Cable Rail"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const type = inputs.type as string;
      const material = inputs.material as string;
      const stories = parseInt(inputs.stories as string) || 1;
      const railing = inputs.railing as string;
      const typeCost: Record<string, number> = { straight: 2000, lshaped: 3500, ushaped: 4500, spiral: 5000 };
      const matMod: Record<string, number> = { wood: 1.0, metal: 1.3, combo: 1.5 };
      const railCost: Record<string, number> = { standard: 800, iron: 2000, glass: 4000, cable: 2500 };
      const base = (typeCost[type] || 2000) * (matMod[material] || 1.0) * stories;
      const rails = (railCost[railing] || 800) * stories;
      const labor = 1500 * stories;
      const removal = 500;
      const finishing = 600 * stories;
      const total = base + rails + labor + removal + finishing;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Staircase Structure", value: "$" + formatNumber(base) },
          { label: "Railing", value: "$" + formatNumber(rails) },
          { label: "Labor", value: "$" + formatNumber(labor) },
          { label: "Old Staircase Removal", value: "$" + formatNumber(removal) },
          { label: "Finishing/Staining", value: "$" + formatNumber(finishing) },
        ],
      };
    },
  }],
  relatedSlugs: ["porch-cost-calculator", "sunroom-cost-calculator"],
  faq: [
    { question: "How much does a new staircase cost?", answer: "A standard straight staircase costs $2,000 to $5,000. L-shaped and U-shaped designs run $4,000 to $10,000. Spiral staircases cost $5,000 to $15,000 depending on materials." },
    { question: "How long does it take to replace a staircase?", answer: "A standard staircase replacement takes 2 to 5 days. Custom designs with special materials may take 1 to 3 weeks including fabrication time." },
  ],
  formula: "Total = (Type Cost x Material Mod x Stories) + Railing + Labor + Removal + Finishing",
};
