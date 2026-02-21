import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const rentSplitCalculator: CalculatorDefinition = {
  slug: "rent-split-calculator",
  title: "Rent Split Calculator",
  description: "Free rent split calculator. Split rent fairly by room size, income, or equally among roommates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["rent split calculator", "rent calculator", "split rent by room size", "fair rent split", "roommate calculator"],
  variants: [
    {
      id: "equal",
      name: "Equal Split",
      description: "Split rent and utilities equally",
      fields: [
        { name: "rent", label: "Monthly Rent", type: "number", placeholder: "e.g. 2400", prefix: "$" },
        { name: "utilities", label: "Utilities", type: "number", placeholder: "e.g. 200", prefix: "$" },
        { name: "people", label: "Number of People", type: "number", placeholder: "e.g. 3", min: 1, max: 20 },
      ],
      calculate: (inputs) => {
        const rent = inputs.rent as number;
        const util = (inputs.utilities as number) || 0;
        const people = inputs.people as number;
        if (!rent || !people) return null;
        const total = rent + util;
        const each = total / people;
        return {
          primary: { label: "Each Person Pays", value: `$${formatNumber(each)}` },
          details: [
            { label: "Total monthly cost", value: `$${formatNumber(total)}` },
            { label: "Rent portion", value: `$${formatNumber(rent / people)}` },
            { label: "Utilities portion", value: `$${formatNumber(util / people)}` },
          ],
        };
      },
    },
    {
      id: "by-room",
      name: "Split by Room Size",
      description: "Split rent proportionally by room square footage",
      fields: [
        { name: "rent", label: "Monthly Rent", type: "number", placeholder: "e.g. 2400", prefix: "$" },
        { name: "room1", label: "Room 1 Size (sq ft)", type: "number", placeholder: "e.g. 150" },
        { name: "room2", label: "Room 2 Size (sq ft)", type: "number", placeholder: "e.g. 120" },
        { name: "room3", label: "Room 3 Size (sq ft)", type: "number", placeholder: "optional" },
        { name: "room4", label: "Room 4 Size (sq ft)", type: "number", placeholder: "optional" },
      ],
      calculate: (inputs) => {
        const rent = inputs.rent as number;
        if (!rent) return null;
        const rooms: number[] = [];
        for (let i = 1; i <= 4; i++) {
          const v = inputs[`room${i}`] as number;
          if (v && v > 0) rooms.push(v);
        }
        if (rooms.length < 2) return null;
        const totalSqFt = rooms.reduce((a, b) => a + b, 0);
        const shares = rooms.map((r) => (r / totalSqFt) * rent);
        const details = rooms.map((r, i) => ({
          label: `Room ${i + 1} (${r} sq ft, ${formatNumber((r / totalSqFt) * 100)}%)`,
          value: `$${formatNumber(shares[i])}`,
        }));
        return {
          primary: { label: "Fair Split", value: `${rooms.length} rooms` },
          details,
        };
      },
    },
  ],
  relatedSlugs: ["tip-calculator", "salary-calculator", "square-footage-calculator"],
  faq: [
    { question: "How do I split rent fairly?", answer: "Equal split works when rooms are similar. For different room sizes, split proportionally by square footage. Some roommates also split by income — higher earners pay more." },
  ],
  formula: "Share = (Room Size / Total Size) x Total Rent",
};
