import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const homeOfficeBuildCalculator: CalculatorDefinition = {
  slug: "home-office-build-calculator",
  title: "Home Office Build Calculator",
  description: "Estimate the cost of building a dedicated home office space including furniture, technology, and finishing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["home office cost", "home office build cost", "home office setup cost"],
  variants: [{
    id: "standard",
    name: "Home Office Build",
    description: "Estimate the cost of building a dedicated home office space including furniture, technology, and finishing",
    fields: [
      { name: "sqft", label: "Office Size", type: "number", suffix: "sq ft", min: 40, max: 400, defaultValue: 120 },
      { name: "scope", label: "Project Scope", type: "select", options: [{value:"convert",label:"Convert Existing Room"},{value:"partition",label:"Add Partition/Wall"},{value:"addition",label:"New Addition"}], defaultValue: "convert" },
      { name: "furniture", label: "Furniture Level", type: "select", options: [{value:"basic",label:"Basic (desk + chair)"},{value:"mid",label:"Mid (+ shelves, filing)"},{value:"premium",label:"Premium (built-in cabinetry)"}], defaultValue: "mid" },
      { name: "tech", label: "Technology Setup", type: "select", options: [{value:"minimal",label:"Minimal (outlets only)"},{value:"standard",label:"Standard (ethernet + outlets)"},{value:"advanced",label:"Advanced (+ dedicated circuit)"}], defaultValue: "standard" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const scope = inputs.scope as string;
      const furniture = inputs.furniture as string;
      const tech = inputs.tech as string;
      if (!sqft || sqft <= 0) return null;
      const scopeRate: Record<string, number> = { convert: 10, partition: 40, addition: 150 };
      const furnitureCost: Record<string, number> = { basic: 800, mid: 2000, premium: 5000 };
      const techCost: Record<string, number> = { minimal: 200, standard: 600, advanced: 1500 };
      const construction = sqft * (scopeRate[scope] || 10);
      const furnishing = furnitureCost[furniture] || 2000;
      const technology = techCost[tech] || 600;
      const painting = sqft * 3;
      const lighting = 400;
      const total = construction + furnishing + technology + painting + lighting;
      return {
        primary: { label: "Estimated Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Construction/Renovation", value: "$" + formatNumber(construction) },
          { label: "Furniture", value: "$" + formatNumber(furnishing) },
          { label: "Technology/Wiring", value: "$" + formatNumber(technology) },
          { label: "Painting", value: "$" + formatNumber(painting) },
          { label: "Lighting", value: "$" + formatNumber(lighting) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "porch-cost-calculator"],
  faq: [
    { question: "How much does it cost to build a home office?", answer: "Converting an existing room costs $1,000 to $5,000. Adding a partition wall runs $3,000 to $8,000. A new addition for a home office costs $15,000 to $40,000." },
    { question: "Is a home office tax deductible?", answer: "If you use a dedicated space regularly and exclusively for business, you may qualify for the home office deduction. Consult a tax professional for specific eligibility." },
  ],
  formula: "Total = (Sq Ft x Scope Rate) + Furniture + Technology + Painting + Lighting",
};
