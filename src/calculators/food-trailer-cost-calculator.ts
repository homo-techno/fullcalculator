import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const foodTrailerCostCalculator: CalculatorDefinition = {
  slug: "food-trailer-cost-calculator",
  title: "Food Trailer Cost Calculator",
  description: "Calculate the startup costs for a food trailer business including the trailer, equipment, permits, and supplies.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["food trailer cost", "food truck startup", "mobile food business cost"],
  variants: [{
    id: "standard",
    name: "Food Trailer Cost",
    description: "Calculate the startup costs for a food trailer business including the trailer, equipment, permits, and supplies",
    fields: [
      { name: "trailerType", label: "Trailer Type", type: "select", options: [{value:"small",label:"Small (8-12 ft)"},{value:"medium",label:"Medium (14-18 ft)"},{value:"large",label:"Large (20-24 ft)"}], defaultValue: "medium" },
      { name: "condition", label: "Condition", type: "select", options: [{value:"new",label:"New"},{value:"used",label:"Used"},{value:"custom",label:"Custom Build"}], defaultValue: "new" },
      { name: "equipment", label: "Kitchen Equipment Level", type: "select", options: [{value:"basic",label:"Basic (grill, fryer)"},{value:"full",label:"Full Kitchen"},{value:"specialty",label:"Specialty (pizza oven, smoker)"}], defaultValue: "basic" },
    ],
    calculate: (inputs) => {
      const trailer = inputs.trailerType as string;
      const condition = inputs.condition as string;
      const equip = inputs.equipment as string;
      const trailerCosts: Record<string, number> = { small: 15000, medium: 25000, large: 40000 };
      const condMult: Record<string, number> = { new: 1.0, used: 0.6, custom: 1.5 };
      const equipCosts: Record<string, number> = { basic: 5000, full: 15000, specialty: 25000 };
      const baseCost = (trailerCosts[trailer] || 25000) * (condMult[condition] || 1.0);
      const equipCost = equipCosts[equip] || 5000;
      const permits = 3000;
      const wrap = 3500;
      const initialSupplies = 2000;
      const insurance = 2500;
      const total = baseCost + equipCost + permits + wrap + initialSupplies + insurance;
      return {
        primary: { label: "Estimated Startup Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Trailer", value: "$" + formatNumber(baseCost) },
          { label: "Kitchen Equipment", value: "$" + formatNumber(equipCost) },
          { label: "Permits and Licenses", value: "$" + formatNumber(permits) },
          { label: "Vehicle Wrap", value: "$" + formatNumber(wrap) },
          { label: "Initial Supplies", value: "$" + formatNumber(initialSupplies) },
          { label: "Insurance", value: "$" + formatNumber(insurance) },
        ],
      };
    },
  }],
  relatedSlugs: ["cleaning-business-calculator", "lawn-care-business-calculator"],
  faq: [
    { question: "How much does a food trailer cost?", answer: "A new food trailer costs $15,000 to $50,000 depending on size. A fully equipped custom build can run $50,000 to $100,000 or more." },
    { question: "What permits do you need for a food trailer?", answer: "You typically need a food handler permit, mobile food vendor license, health department inspection, and a business license. Requirements vary by city and state." },
  ],
  formula: "Total = Trailer Cost x Condition Multiplier + Equipment + Permits + Wrap + Supplies + Insurance",
};
