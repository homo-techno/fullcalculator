import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const collegeMoveInCostCalculator: CalculatorDefinition = {
  slug: "college-move-in-cost-calculator",
  title: "College Move-In & Dorm Cost Calculator",
  description:
    "Estimate the total cost of moving into college. Calculate dorm supplies, bedding, electronics, mini-fridge, and other essentials for freshman year.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: [
    "college move in",
    "dorm cost",
    "college essentials",
    "freshman year",
    "dorm supplies",
  ],
  variants: [
    {
      id: "essentials",
      name: "Dorm Essentials",
      description: "Calculate costs for dorm room necessities",
      fields: [
        { name: "bedding", label: "Bedding (sheets, pillow, comforter) ($)", type: "number", placeholder: "e.g. 120", defaultValue: 120 },
        { name: "towelsBath", label: "Towels & Bath Supplies ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "storage", label: "Storage (bins, shelves, hangers) ($)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
        { name: "electronics", label: "Electronics (power strip, lamp, etc.) ($)", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
        { name: "miniFridge", label: "Mini-Fridge / Microwave ($)", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "schoolSupplies", label: "School Supplies ($)", type: "number", placeholder: "e.g. 75", defaultValue: 75 },
        { name: "cleaning", label: "Cleaning Supplies ($)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "decorations", label: "Room Decorations ($)", type: "number", placeholder: "e.g. 40", defaultValue: 40 },
        { name: "laundry", label: "Laundry Supplies ($)", type: "number", placeholder: "e.g. 35", defaultValue: 35 },
      ],
      calculate: (inputs) => {
        const bedding = parseFloat(inputs.bedding as string) || 0;
        const towelsBath = parseFloat(inputs.towelsBath as string) || 0;
        const storage = parseFloat(inputs.storage as string) || 0;
        const electronics = parseFloat(inputs.electronics as string) || 0;
        const miniFridge = parseFloat(inputs.miniFridge as string) || 0;
        const schoolSupplies = parseFloat(inputs.schoolSupplies as string) || 0;
        const cleaning = parseFloat(inputs.cleaning as string) || 0;
        const decorations = parseFloat(inputs.decorations as string) || 0;
        const laundry = parseFloat(inputs.laundry as string) || 0;

        const total = bedding + towelsBath + storage + electronics + miniFridge + schoolSupplies + cleaning + decorations + laundry;

        if (total <= 0) return null;

        return {
          primary: { label: "Total Move-In Cost", value: `$${formatNumber(total, 2)}` },
          details: [
            { label: "Bedding", value: `$${formatNumber(bedding, 2)}` },
            { label: "Bath Supplies", value: `$${formatNumber(towelsBath, 2)}` },
            { label: "Storage & Organization", value: `$${formatNumber(storage, 2)}` },
            { label: "Electronics & Accessories", value: `$${formatNumber(electronics, 2)}` },
            { label: "Mini-Fridge/Microwave", value: `$${formatNumber(miniFridge, 2)}` },
            { label: "School Supplies", value: `$${formatNumber(schoolSupplies, 2)}` },
            { label: "Cleaning & Laundry", value: `$${formatNumber(cleaning + laundry, 2)}` },
            { label: "Decorations", value: `$${formatNumber(decorations, 2)}` },
          ],
        };
      },
    },
    {
      id: "firstSemester",
      name: "First Semester Total",
      description: "Full first-semester costs including room, board, and supplies",
      fields: [
        { name: "roomBoard", label: "Room & Board (semester) ($)", type: "number", placeholder: "e.g. 6000", defaultValue: 6000 },
        { name: "moveInSupplies", label: "Move-In Supplies ($)", type: "number", placeholder: "e.g. 640", defaultValue: 640 },
        { name: "textbooks", label: "Textbooks ($)", type: "number", placeholder: "e.g. 400", defaultValue: 400 },
        { name: "laptop", label: "Laptop (if needed) ($)", type: "number", placeholder: "e.g. 800", defaultValue: 0 },
        { name: "mealPlanExtra", label: "Extra Food/Snacks Monthly ($)", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "monthlyPersonal", label: "Monthly Personal Expenses ($)", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "semesterMonths", label: "Months in Semester", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const roomBoard = parseFloat(inputs.roomBoard as string) || 0;
        const moveInSupplies = parseFloat(inputs.moveInSupplies as string) || 0;
        const textbooks = parseFloat(inputs.textbooks as string) || 0;
        const laptop = parseFloat(inputs.laptop as string) || 0;
        const mealPlanExtra = parseFloat(inputs.mealPlanExtra as string) || 0;
        const monthlyPersonal = parseFloat(inputs.monthlyPersonal as string) || 0;
        const semesterMonths = parseFloat(inputs.semesterMonths as string) || 4;

        const monthlyTotal = mealPlanExtra + monthlyPersonal;
        const ongoingCosts = monthlyTotal * semesterMonths;
        const oneTimeCosts = moveInSupplies + textbooks + laptop;
        const grandTotal = roomBoard + oneTimeCosts + ongoingCosts;

        if (grandTotal <= 0) return null;

        return {
          primary: { label: "First Semester Total", value: `$${formatNumber(grandTotal, 2)}` },
          details: [
            { label: "Room & Board", value: `$${formatNumber(roomBoard, 2)}` },
            { label: "Move-In Supplies", value: `$${formatNumber(moveInSupplies, 2)}` },
            { label: "Textbooks", value: `$${formatNumber(textbooks, 2)}` },
            { label: "Laptop", value: `$${formatNumber(laptop, 2)}` },
            { label: "Monthly Living Expenses", value: `$${formatNumber(monthlyTotal, 2)}` },
            { label: "Ongoing Costs (full semester)", value: `$${formatNumber(ongoingCosts, 2)}` },
            { label: "One-Time Costs", value: `$${formatNumber(oneTimeCosts, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["back-to-school-cost-calculator", "budget-calculator", "student-loan-calculator"],
  faq: [
    {
      question: "How much does it cost to set up a college dorm room?",
      answer:
        "The average student spends $500-$1,200 on dorm room setup, including bedding ($80-$150), storage ($50-$100), a mini-fridge ($100-$200), and miscellaneous supplies. Costs can be reduced by coordinating with roommates and buying secondhand.",
    },
    {
      question: "What should I NOT bring to college?",
      answer:
        "Skip items your dorm prohibits (candles, hot plates, space heaters), duplicate items your roommate is bringing, expensive jewelry, too many clothes, full-size furniture, and excessive decorations. Check your dorm's prohibited items list first.",
    },
    {
      question: "Can I split costs with my roommate?",
      answer:
        "Absolutely. Common shared items include a mini-fridge, microwave, TV, cleaning supplies, and a Brita filter. Coordinate before move-in day to avoid buying duplicates. This can save each person $100-$300.",
    },
  ],
  formula:
    "Total = Bedding + Bath + Storage + Electronics + Mini-Fridge + Supplies + Cleaning + Decor + Laundry",
};
