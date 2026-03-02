import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const earthquakeRetrofitCalculator: CalculatorDefinition = {
  slug: "earthquake-retrofit-calculator",
  title: "Earthquake Retrofit Calculator",
  description: "Estimate the cost of seismic retrofitting for a building.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["earthquake retrofit","seismic retrofit cost"],
  variants: [{
    id: "standard",
    name: "Earthquake Retrofit",
    description: "Estimate the cost of seismic retrofitting for a building.",
    fields: [
      { name: "sqft", label: "Building Area (sq ft)", type: "number", min: 500, max: 50000, defaultValue: 2000 },
      { name: "stories", label: "Number of Stories", type: "number", min: 1, max: 10, defaultValue: 2 },
      { name: "foundation", label: "Foundation Type", type: "select", options: [{ value: "1", label: "Bolted Slab" }, { value: "2", label: "Raised/Cripple Wall" }, { value: "3", label: "Unreinforced Masonry" }], defaultValue: "2" },
      { name: "yearBuilt", label: "Year Built", type: "number", min: 1900, max: 2025, defaultValue: 1970 },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const stories = inputs.stories as number;
      const fdn = Number(inputs.foundation as number);
      const year = inputs.yearBuilt as number;
      if (!sqft || !stories || !fdn) return null;
      const baseCost = fdn === 3 ? 15 : fdn === 2 ? 8 : 4;
      const ageFactor = year < 1950 ? 1.4 : year < 1980 ? 1.2 : 1;
      const storyFactor = 1 + (stories - 1) * 0.15;
      const totalCost = Math.round(sqft * baseCost * ageFactor * storyFactor);
      return {
        primary: { label: "Estimated Retrofit Cost", value: "$" + formatNumber(totalCost) },
        details: [
          { label: "Cost Per Sq Ft", value: "$" + formatNumber(Math.round(baseCost * ageFactor * storyFactor * 100) / 100) },
          { label: "Age Factor", value: ageFactor + "x" },
          { label: "Story Factor", value: Math.round(storyFactor * 100) / 100 + "x" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How much does earthquake retrofitting cost?", answer: "Typical residential retrofits cost $3,000 to $7,000 for bolting and bracing." },
    { question: "Is earthquake retrofitting worth it?", answer: "Yes, it significantly reduces structural damage and can lower insurance premiums." },
  ],
  formula: "Cost = Sq Ft x Base Rate x Age Factor x Story Factor",
};
