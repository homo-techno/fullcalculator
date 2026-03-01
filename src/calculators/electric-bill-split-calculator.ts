import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const electricBillSplitCalculator: CalculatorDefinition = {
  slug: "electric-bill-split-calculator",
  title: "Electric Bill Split Calculator",
  description: "Split the electricity bill fairly among roommates based on room size, occupancy, or equal share.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["split electric bill","roommate bill split","electricity bill divider"],
  variants: [{
    id: "standard",
    name: "Electric Bill Split",
    description: "Split the electricity bill fairly among roommates based on room size, occupancy, or equal share.",
    fields: [
      { name: "totalBill", label: "Total Electric Bill", type: "number", prefix: "$", min: 1, max: 10000, defaultValue: 200 },
      { name: "numRoommates", label: "Number of Roommates", type: "number", min: 2, max: 20, defaultValue: 3 },
      { name: "yourRoomSqFt", label: "Your Room Size (sq ft)", type: "number", min: 50, max: 5000, defaultValue: 150 },
      { name: "totalSqFt", label: "Total Living Space (sq ft)", type: "number", min: 100, max: 20000, defaultValue: 900 },
    ],
    calculate: (inputs) => {
      const bill = inputs.totalBill as number;
      const roommates = inputs.numRoommates as number;
      const yourRoom = inputs.yourRoomSqFt as number;
      const totalSpace = inputs.totalSqFt as number;
      if (!bill || !roommates || roommates <= 0) return null;
      const equalShare = bill / roommates;
      const commonArea = totalSpace - (yourRoom * roommates > totalSpace ? totalSpace : yourRoom * roommates);
      const commonShare = (commonArea > 0 ? (commonArea / roommates) : 0);
      const yourPortion = (yourRoom + commonShare) / totalSpace;
      const sqFtShare = bill * yourPortion;
      return {
        primary: { label: "Equal Split Share", value: "$" + formatNumber(Math.round(equalShare * 100) / 100) },
        details: [
          { label: "Room-Size Based Share", value: "$" + formatNumber(Math.round(sqFtShare * 100) / 100) },
          { label: "Your Room Percentage", value: formatNumber(Math.round(yourPortion * 10000) / 100) + "%" },
          { label: "Total Bill", value: "$" + formatNumber(Math.round(bill * 100) / 100) },
          { label: "Number of Roommates", value: formatNumber(roommates) },
        ],
      };
    },
  }],
  relatedSlugs: ["electricity-cost-calculator","water-usage-calculator"],
  faq: [
    { question: "What is the fairest way to split an electric bill?", answer: "The fairest method depends on circumstances. Equal splits are simplest, while room-size splits account for space differences. Some roommates also consider personal appliance usage for a more precise division." },
    { question: "Should common areas be split equally?", answer: "Yes, shared spaces like kitchens, living rooms, and bathrooms are typically divided equally among all roommates regardless of individual room sizes. Only private room space is divided proportionally." },
  ],
  formula: "Equal Share = Total Bill / Number of Roommates; Room-Size Share = Bill x (Your Room + Common Share) / Total Space",
};
