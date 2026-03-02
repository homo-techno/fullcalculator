import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skiResortValueComparisonCalculator: CalculatorDefinition = {
  slug: "ski-resort-value-comparison-calculator",
  title: "Ski Resort Value Comparison Calculator",
  description: "Compare the per-run and per-hour value of different ski resorts based on lift ticket price, vertical, and runs.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["ski resort value","lift ticket comparison","ski cost calculator","ski resort comparison"],
  variants: [{
    id: "standard",
    name: "Ski Resort Value Comparison",
    description: "Compare the per-run and per-hour value of different ski resorts based on lift ticket price, vertical, and runs.",
    fields: [
      { name: "liftTicketPrice", label: "Lift Ticket Price ($)", type: "number", min: 20, max: 300, defaultValue: 120 },
      { name: "verticalFeet", label: "Vertical Drop (feet)", type: "number", min: 200, max: 6000, defaultValue: 2500 },
      { name: "totalRuns", label: "Total Runs Available", type: "number", min: 5, max: 300, defaultValue: 80 },
      { name: "skiHours", label: "Hours You Will Ski", type: "number", min: 1, max: 10, defaultValue: 6 },
      { name: "runsPerHour", label: "Est. Runs Per Hour", type: "number", min: 1, max: 15, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const price = inputs.liftTicketPrice as number;
    const vertical = inputs.verticalFeet as number;
    const totalRuns = inputs.totalRuns as number;
    const skiHours = inputs.skiHours as number;
    const runsPerHour = inputs.runsPerHour as number;
    const totalRunsTaken = Math.round(skiHours * runsPerHour);
    const costPerRun = price / totalRunsTaken;
    const costPerHour = price / skiHours;
    const totalVertical = totalRunsTaken * vertical;
    const costPer1000Vert = (price / totalVertical) * 1000;
    return {
      primary: { label: "Cost Per Run", value: "$" + formatNumber(Math.round(costPerRun * 100) / 100) },
      details: [
        { label: "Cost Per Hour", value: "$" + formatNumber(Math.round(costPerHour * 100) / 100) },
        { label: "Total Runs You Will Take", value: formatNumber(totalRunsTaken) },
        { label: "Total Vertical Skied", value: formatNumber(totalVertical) + " ft" },
        { label: "Cost Per 1,000 ft Vertical", value: "$" + formatNumber(Math.round(costPer1000Vert * 100) / 100) },
        { label: "Runs Available", value: formatNumber(totalRuns) }
      ]
    };
  },
  }],
  relatedSlugs: ["travel-budget-calculator","travel-daily-budget-calculator","hotel-vs-airbnb-calculator"],
  faq: [
    { question: "How much do lift tickets cost?", answer: "Major resorts range from $100 to $250 per day. Smaller regional resorts charge $40 to $100. Season passes often pay for themselves in 4 to 7 days of skiing." },
    { question: "What makes a ski resort good value?", answer: "High vertical drop, many runs, short lift lines, and lower ticket prices all contribute to better value. More runs per hour means lower cost per run." },
    { question: "Are multi-day passes worth it?", answer: "Multi-day passes typically save 10 to 25 percent per day compared to single-day tickets, and season passes are the best value for frequent skiers." },
  ],
  formula: "Cost Per Run = Ticket Price / Total Runs Taken
Cost Per Hour = Ticket Price / Ski Hours
Total Vertical = Runs x Vertical Drop",
};
