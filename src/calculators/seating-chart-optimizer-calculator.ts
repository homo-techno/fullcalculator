import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seatingChartOptimizerCalculator: CalculatorDefinition = {
  slug: "seating-chart-optimizer-calculator",
  title: "Seating Chart Optimizer Calculator",
  description: "Plan your event seating layout by calculating table counts, seats per table, head table size, and remaining capacity.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["seating chart","wedding seating plan","table layout","event seating optimizer"],
  variants: [{
    id: "standard",
    name: "Seating Chart Optimizer",
    description: "Plan your event seating layout by calculating table counts, seats per table, head table size, and remaining capacity.",
    fields: [
      { name: "totalGuests", label: "Total Guests", type: "number", min: 10, max: 500, defaultValue: 120 },
      { name: "tableType", label: "Table Type", type: "select", options: [{ value: "8", label: "Round (8 per table)" }, { value: "10", label: "Round (10 per table)" }, { value: "6", label: "Rectangular (6 per table)" }, { value: "12", label: "Long Banquet (12 per table)" }], defaultValue: "8" },
      { name: "headTableSize", label: "Head Table Seats", type: "number", min: 0, max: 30, defaultValue: 10 },
      { name: "kidsTable", label: "Separate Kids Table", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "0" },
      { name: "kidsCount", label: "Number of Kids (if separate)", type: "number", min: 0, max: 50, defaultValue: 8 },
    ],
    calculate: (inputs) => {
    const totalGuests = inputs.totalGuests as number;
    const seatsPerTable = parseInt(inputs.tableType as unknown as string);
    const headTable = inputs.headTableSize as number;
    const kidsTableFlag = parseInt(inputs.kidsTable as unknown as string);
    const kids = inputs.kidsCount as number;
    const kidsAtSeparate = kidsTableFlag === 1 ? kids : 0;
    const remainingGuests = totalGuests - headTable - kidsAtSeparate;
    const tablesNeeded = Math.ceil(remainingGuests / seatsPerTable);
    const totalSeats = headTable + kidsAtSeparate + (tablesNeeded * seatsPerTable);
    const emptySeats = totalSeats - totalGuests;
    const kidsTables = kidsTableFlag === 1 ? Math.ceil(kids / seatsPerTable) : 0;
    const totalTables = tablesNeeded + 1 + kidsTables;
    return {
      primary: { label: "Guest Tables Needed", value: formatNumber(tablesNeeded) },
      details: [
        { label: "Total Tables (incl. Head)", value: formatNumber(totalTables) },
        { label: "Seats Per Table", value: formatNumber(seatsPerTable) },
        { label: "Head Table Seats", value: formatNumber(headTable) },
        { label: "Kids Tables", value: formatNumber(kidsTables) },
        { label: "Empty Seats", value: formatNumber(emptySeats) }
      ]
    };
  },
  }],
  relatedSlugs: ["wedding-guest-calculator","reception-venue-cost-calculator","event-catering-calculator"],
  faq: [
    { question: "How many tables do you need for 100 guests?", answer: "For round tables seating 8, you need about 12-13 tables for 100 guests (accounting for a head table). For tables of 10, you need 10-11 tables." },
    { question: "What is the best table layout for a wedding?", answer: "Round tables of 8-10 promote conversation. Long banquet tables create an intimate feel. The best layout depends on your venue shape and guest dynamics." },
    { question: "Should kids have a separate table?", answer: "Separate kids tables work well for children aged 5-12. Younger children usually sit with parents, while teens can sit at regular guest tables." },
  ],
  formula: "Remaining = TotalGuests - HeadTable - KidsAtSeparateTable; Tables Needed = ceil(Remaining / SeatsPerTable); Empty Seats = TotalSeats - TotalGuests",
};
