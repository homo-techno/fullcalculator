import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const filmBudgetEstimatorCalculator: CalculatorDefinition = {
  slug: "film-budget-estimator",
  title: "Film Budget Estimator",
  description: "Estimate total production budget for short films, music videos, and independent productions based on crew, equipment, and shooting days.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["film budget","video production cost","movie budget calculator","film production budget"],
  variants: [{
    id: "standard",
    name: "Film Budget Estimator",
    description: "Estimate total production budget for short films, music videos, and independent productions based on crew, equipment, and shooting days.",
    fields: [
      { name: "shootDays", label: "Number of Shooting Days", type: "number", min: 1, max: 120, defaultValue: 5 },
      { name: "crewSize", label: "Crew Size", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "avgDayRate", label: "Avg Crew Day Rate ($)", type: "number", min: 50, max: 5000, defaultValue: 350 },
      { name: "equipmentPerDay", label: "Equipment Rental per Day ($)", type: "number", min: 0, max: 50000, defaultValue: 1500 },
      { name: "locationPerDay", label: "Location Cost per Day ($)", type: "number", min: 0, max: 20000, defaultValue: 500 },
      { name: "postDays", label: "Post-Production Days", type: "number", min: 0, max: 180, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const shootDays = inputs.shootDays as number;
    const crewSize = inputs.crewSize as number;
    const dayRate = inputs.avgDayRate as number;
    const equipment = inputs.equipmentPerDay as number;
    const location = inputs.locationPerDay as number;
    const postDays = inputs.postDays as number;
    const crewCost = crewSize * dayRate * shootDays;
    const equipCost = equipment * shootDays;
    const locCost = location * shootDays;
    const postCost = postDays * 500;
    const contingency = Math.round((crewCost + equipCost + locCost + postCost) * 0.1);
    const total = crewCost + equipCost + locCost + postCost + contingency;
    return {
      primary: { label: "Estimated Total Budget", value: "$" + formatNumber(total) },
      details: [
        { label: "Crew Costs", value: "$" + formatNumber(crewCost) },
        { label: "Equipment Costs", value: "$" + formatNumber(equipCost) },
        { label: "Location Costs", value: "$" + formatNumber(locCost) },
        { label: "Post-Production", value: "$" + formatNumber(postCost) },
        { label: "Contingency (10%)", value: "$" + formatNumber(contingency) }
      ]
    };
  },
  }],
  relatedSlugs: ["film-crew-size-estimator","wedding-videography-cost-calculator"],
  faq: [
    { question: "What percentage of a film budget goes to crew?", answer: "Crew costs typically represent 40-60% of an independent film budget, including above-the-line talent (director, producer, lead actors) and below-the-line crew." },
    { question: "How much contingency should I budget?", answer: "Industry standard is 10-15% contingency for independent productions. Studio films may allocate 5-10% because of more detailed planning." },
    { question: "What does post-production cost?", answer: "Post-production typically costs 15-30% of the overall budget. This includes editing, color grading, sound design, music licensing, and visual effects." },
  ],
  formula: "Total Budget = Crew Costs + Equipment + Location + Post-Production + Contingency (10%); Crew Costs = Crew Size x Day Rate x Shooting Days",
};
