import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tableTurnoverRateCalculator: CalculatorDefinition = {
  slug: "table-turnover-rate-calculator",
  title: "Table Turnover Rate Calculator",
  description: "Calculate your restaurant table turnover rate and revenue potential by tracking seated parties, average check size, and service hours to optimize throughput.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["table turnover rate","restaurant table turns","covers per hour","restaurant throughput"],
  variants: [{
    id: "standard",
    name: "Table Turnover Rate",
    description: "Calculate your restaurant table turnover rate and revenue potential by tracking seated parties, average check size, and service hours to optimize throughput.",
    fields: [
      { name: "totalTables", label: "Total Tables", type: "number", min: 1, max: 200, defaultValue: 25 },
      { name: "partiesServed", label: "Parties Served Per Service", type: "number", min: 1, max: 500, defaultValue: 50 },
      { name: "avgCheckSize", label: "Average Check Size ($)", type: "number", min: 5, max: 500, defaultValue: 55 },
      { name: "avgPartySize", label: "Average Party Size", type: "number", min: 1, max: 12, defaultValue: 3 },
      { name: "serviceHours", label: "Service Hours", type: "number", min: 1, max: 12, defaultValue: 4 },
    ],
    calculate: (inputs) => {
    const tables = inputs.totalTables as number;
    const parties = inputs.partiesServed as number;
    const check = inputs.avgCheckSize as number;
    const partySize = inputs.avgPartySize as number;
    const hours = inputs.serviceHours as number;
    const turnoverRate = tables > 0 ? parties / tables : 0;
    const totalCovers = parties * partySize;
    const revenuePerService = totalCovers * check;
    const revenuePerSeatHour = tables > 0 && hours > 0 ? revenuePerService / (tables * partySize * hours) : 0;
    const avgDineTime = hours > 0 && turnoverRate > 0 ? Math.round((hours / turnoverRate) * 60) : 0;
    return {
      primary: { label: "Table Turnover Rate", value: formatNumber(Math.round(turnoverRate * 100) / 100) + " turns" },
      details: [
        { label: "Total Covers Per Service", value: formatNumber(totalCovers) },
        { label: "Revenue Per Service", value: "$" + formatNumber(Math.round(revenuePerService)) },
        { label: "Revenue Per Seat-Hour", value: "$" + formatNumber(Math.round(revenuePerSeatHour * 100) / 100) },
        { label: "Avg Dining Time", value: formatNumber(avgDineTime) + " minutes" }
      ]
    };
  },
  }],
  relatedSlugs: ["restaurant-seating-capacity-calculator","restaurant-profit-margin-calculator"],
  faq: [
    { question: "What is a good table turnover rate?", answer: "For fast casual restaurants 3 to 4 turns per meal period is typical. Full-service restaurants average 1.5 to 2.5 turns, and fine dining aims for 1 to 1.5 turns per service." },
    { question: "How can I increase table turnover without rushing guests?", answer: "Streamline your kitchen workflow, train servers to pace courses efficiently, use reservation systems to stagger seating, offer digital payment, and design your menu to minimize kitchen bottlenecks." },
    { question: "What is revenue per seat-hour?", answer: "Revenue per seat-hour measures how much revenue each seat generates per hour of operation. It combines average check size and turnover rate into a single efficiency metric used to benchmark restaurant performance." },
  ],
  formula: "Turnover Rate = Parties Served / Total Tables
Total Covers = Parties x Average Party Size
Revenue Per Service = Total Covers x Average Check Size",
};
