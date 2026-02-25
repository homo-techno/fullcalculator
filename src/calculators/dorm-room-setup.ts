import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const dormRoomSetupCalculator: CalculatorDefinition = {
  slug: "dorm-room-setup-calculator",
  title: "Dorm Room Setup Cost",
  description:
    "Free dorm room setup cost calculator. Estimate the total cost of furnishing and equipping your college dorm room.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "dorm room cost calculator",
    "dorm setup budget",
    "college dorm essentials cost",
    "dorm room shopping list",
    "dorm furnishing calculator",
  ],
  variants: [
    {
      id: "essentials",
      name: "Essentials Budget",
      description: "Calculate the cost of dorm room essentials",
      fields: [
        { name: "bedding", label: "Bedding Set (sheets, comforter, pillows) ($)", type: "number", placeholder: "e.g. 80", min: 0 },
        { name: "storage", label: "Storage & Organization ($)", type: "number", placeholder: "e.g. 60", min: 0 },
        { name: "electronics", label: "Electronics (power strips, cables) ($)", type: "number", placeholder: "e.g. 50", min: 0 },
        { name: "toiletries", label: "Toiletries & Cleaning Supplies ($)", type: "number", placeholder: "e.g. 40", min: 0 },
        { name: "decor", label: "Decor & Lighting ($)", type: "number", placeholder: "e.g. 30", min: 0 },
        { name: "laundry", label: "Laundry Supplies ($)", type: "number", placeholder: "e.g. 25", min: 0 },
        { name: "kitchenItems", label: "Mini Kitchen Items ($)", type: "number", placeholder: "e.g. 40", min: 0 },
        { name: "miscellaneous", label: "Miscellaneous ($)", type: "number", placeholder: "e.g. 30", min: 0 },
      ],
      calculate: (inputs) => {
        const bedding = (inputs.bedding as number) || 0;
        const storage = (inputs.storage as number) || 0;
        const electronics = (inputs.electronics as number) || 0;
        const toiletries = (inputs.toiletries as number) || 0;
        const decor = (inputs.decor as number) || 0;
        const laundry = (inputs.laundry as number) || 0;
        const kitchen = (inputs.kitchenItems as number) || 0;
        const misc = (inputs.miscellaneous as number) || 0;

        const total = bedding + storage + electronics + toiletries + decor + laundry + kitchen + misc;

        const categories = [
          { name: "Bedding", cost: bedding },
          { name: "Storage", cost: storage },
          { name: "Electronics", cost: electronics },
          { name: "Toiletries", cost: toiletries },
          { name: "Decor", cost: decor },
          { name: "Laundry", cost: laundry },
          { name: "Kitchen", cost: kitchen },
          { name: "Misc", cost: misc },
        ].sort((a, b) => b.cost - a.cost);

        const biggest = categories[0];

        return {
          primary: { label: "Total Setup Cost", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Biggest expense", value: `${biggest.name}: $${formatNumber(biggest.cost, 2)}` },
            { label: "Items under $50", value: formatNumber(categories.filter(c => c.cost > 0 && c.cost < 50).length, 0) },
            { label: "Number of categories", value: formatNumber(categories.filter(c => c.cost > 0).length, 0) },
          ],
        };
      },
    },
    {
      id: "split",
      name: "Roommate Split",
      description: "Split shared dorm room purchases with your roommate",
      fields: [
        { name: "sharedItems", label: "Total Shared Items Cost ($)", type: "number", placeholder: "e.g. 200", min: 0 },
        { name: "personalItems", label: "Your Personal Items Cost ($)", type: "number", placeholder: "e.g. 250", min: 0 },
        { name: "numRoommates", label: "Number of Roommates (including you)", type: "number", placeholder: "e.g. 2", min: 1, max: 4, defaultValue: 2 },
        { name: "budget", label: "Your Total Budget ($)", type: "number", placeholder: "e.g. 400", min: 0 },
      ],
      calculate: (inputs) => {
        const shared = (inputs.sharedItems as number) || 0;
        const personal = (inputs.personalItems as number) || 0;
        const roommates = (inputs.numRoommates as number) || 2;
        const budget = (inputs.budget as number) || 0;

        const sharedPerPerson = shared / roommates;
        const yourTotal = sharedPerPerson + personal;
        const remaining = budget - yourTotal;

        return {
          primary: { label: "Your Total Cost", value: `$${formatNumber(yourTotal, 2)}` },
          details: [
            { label: "Your share of shared items", value: `$${formatNumber(sharedPerPerson, 2)}` },
            { label: "Personal items", value: `$${formatNumber(personal, 2)}` },
            { label: "Budget remaining", value: `$${formatNumber(remaining, 2)}` },
            { label: "Savings from splitting", value: `$${formatNumber(shared - sharedPerPerson, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["student-budget-calculator", "student-monthly-budget-calculator"],
  faq: [
    {
      question: "How much does it cost to set up a dorm room?",
      answer:
        "The average dorm room setup costs $500-$1,500 depending on what you already own and your preferences. Essentials alone typically run $300-$600.",
    },
    {
      question: "What are the most important dorm essentials?",
      answer:
        "Bedding (twin XL sheets), power strip with surge protector, storage solutions, toiletries, and laundry supplies are the top priorities. Wait to buy decor until you see your space.",
    },
  ],
  formula: "Total Setup Cost = Bedding + Storage + Electronics + Toiletries + Decor + Laundry + Kitchen + Misc",
};
