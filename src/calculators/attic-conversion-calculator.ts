import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const atticConversionCalculator: CalculatorDefinition = {
  slug: "attic-conversion-calculator",
  title: "Attic Conversion Cost Calculator",
  description: "Estimate the cost of converting an attic into livable space including framing, insulation, and finishing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["attic conversion cost", "attic remodel cost", "attic finishing cost"],
  variants: [{
    id: "standard",
    name: "Attic Conversion Cost",
    description: "Estimate the cost of converting an attic into livable space including framing, insulation, and finishing",
    fields: [
      { name: "sqft", label: "Attic Floor Area", type: "number", suffix: "sq ft", min: 100, max: 1000, defaultValue: 400 },
      { name: "use", label: "Intended Use", type: "select", options: [{value:"bedroom",label:"Bedroom"},{value:"office",label:"Office/Studio"},{value:"suite",label:"Bedroom + Bathroom"}], defaultValue: "bedroom" },
      { name: "dormer", label: "Dormers Needed", type: "select", options: [{value:"0",label:"None"},{value:"1",label:"1 Dormer"},{value:"2",label:"2 Dormers"}], defaultValue: "1" },
      { name: "access", label: "Staircase", type: "select", options: [{value:"existing",label:"Existing Staircase"},{value:"new",label:"New Staircase Needed"}], defaultValue: "new" },
    ],
    calculate: (inputs) => {
      const sqft = inputs.sqft as number;
      const use = inputs.use as string;
      const dormers = parseInt(inputs.dormer as string) || 0;
      const access = inputs.access as string;
      if (!sqft || sqft <= 0) return null;
      const finishRate = 75;
      const finishing = sqft * finishRate;
      const insulation = sqft * 5;
      const electrical = sqft * 8;
      const dormerCost = dormers * 5000;
      const stairCost = access === "new" ? 3000 : 0;
      const bathroomAdd = use === "suite" ? 8000 : 0;
      const hvac = sqft * 6;
      const permits = 1500;
      const total = finishing + insulation + electrical + dormerCost + stairCost + bathroomAdd + hvac + permits;
      return {
        primary: { label: "Estimated Total Cost", value: "$" + formatNumber(total) },
        details: [
          { label: "Framing and Finishing", value: "$" + formatNumber(finishing) },
          { label: "Insulation", value: "$" + formatNumber(insulation) },
          { label: "Electrical", value: "$" + formatNumber(electrical) },
          { label: "Dormers (" + dormers + ")", value: "$" + formatNumber(dormerCost) },
          { label: "Staircase", value: "$" + formatNumber(stairCost) },
          { label: "Bathroom Addition", value: "$" + formatNumber(bathroomAdd) },
          { label: "HVAC Extension", value: "$" + formatNumber(hvac) },
          { label: "Permits", value: "$" + formatNumber(permits) },
          { label: "Cost per Sq Ft", value: "$" + formatNumber(total / sqft) },
        ],
      };
    },
  }],
  relatedSlugs: ["sunroom-cost-calculator", "carport-cost-calculator"],
  faq: [
    { question: "How much does an attic conversion cost?", answer: "A basic attic conversion costs $50 to $100 per square foot. Adding a bathroom increases the cost by $8,000 to $15,000. Dormers add $5,000 to $15,000 each." },
    { question: "What are the requirements for an attic conversion?", answer: "Most building codes require a minimum ceiling height of 7 feet over at least 50 percent of the floor area, adequate egress windows, and a permanent staircase." },
  ],
  formula: "Total = Finishing + Insulation + Electrical + Dormers + Staircase + Bathroom + HVAC + Permits",
};
