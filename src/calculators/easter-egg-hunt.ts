import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const easterEggHuntCalculator: CalculatorDefinition = {
  slug: "easter-egg-hunt-calculator",
  title: "Easter Egg Hunt Calculator",
  description:
    "Plan the perfect Easter egg hunt. Calculate how many eggs, candy, and supplies you need based on the number of children and hunt size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "easter egg hunt",
    "easter eggs",
    "easter planning",
    "egg hunt supplies",
    "easter party",
  ],
  variants: [
    {
      id: "eggSupplies",
      name: "Egg Hunt Supplies",
      description: "Calculate eggs, candy, and filler needs",
      fields: [
        { name: "numChildren", label: "Number of Children", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "eggsPerChild", label: "Eggs per Child", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "candyPerEgg", label: "Candy Pieces per Egg", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "costPerDozenEggs", label: "Cost per Dozen Plastic Eggs ($)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "candyCostPerBag", label: "Candy Bag Cost ($)", type: "number", placeholder: "e.g. 5", defaultValue: 5 },
        { name: "piecesPerBag", label: "Candy Pieces per Bag", type: "number", placeholder: "e.g. 60", defaultValue: 60 },
      ],
      calculate: (inputs) => {
        const numChildren = parseFloat(inputs.numChildren as string);
        const eggsPerChild = parseFloat(inputs.eggsPerChild as string);
        const candyPerEgg = parseFloat(inputs.candyPerEgg as string);
        const costPerDozenEggs = parseFloat(inputs.costPerDozenEggs as string);
        const candyCostPerBag = parseFloat(inputs.candyCostPerBag as string);
        const piecesPerBag = parseFloat(inputs.piecesPerBag as string);

        if (isNaN(numChildren) || isNaN(eggsPerChild)) return null;

        const totalEggs = numChildren * eggsPerChild;
        const dozenEggsNeeded = Math.ceil(totalEggs / 12);
        const eggCost = dozenEggsNeeded * (costPerDozenEggs || 0);
        const totalCandy = totalEggs * (candyPerEgg || 0);
        const candyBagsNeeded = piecesPerBag > 0 ? Math.ceil(totalCandy / piecesPerBag) : 0;
        const candyCost = candyBagsNeeded * (candyCostPerBag || 0);
        const totalCost = eggCost + candyCost;

        return {
          primary: { label: "Total Eggs Needed", value: formatNumber(totalEggs, 0) },
          details: [
            { label: "Dozen Packs to Buy", value: formatNumber(dozenEggsNeeded, 0) },
            { label: "Egg Cost", value: `$${formatNumber(eggCost, 2)}` },
            { label: "Total Candy Pieces", value: formatNumber(totalCandy, 0) },
            { label: "Candy Bags to Buy", value: formatNumber(candyBagsNeeded, 0) },
            { label: "Candy Cost", value: `$${formatNumber(candyCost, 2)}` },
            { label: "Total Supplies Cost", value: `$${formatNumber(totalCost, 2)}` },
          ],
        };
      },
    },
    {
      id: "huntArea",
      name: "Hunt Area Planner",
      description: "Determine area needed and egg spacing for the hunt",
      fields: [
        { name: "totalEggs", label: "Total Eggs to Hide", type: "number", placeholder: "e.g. 150", defaultValue: 150 },
        { name: "difficulty", label: "Difficulty Level", type: "select", options: [
          { label: "Easy (toddlers)", value: "easy" },
          { label: "Medium (ages 4-7)", value: "medium" },
          { label: "Hard (ages 8+)", value: "hard" },
        ], defaultValue: "medium" },
        { name: "numChildren", label: "Number of Children", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "durationMinutes", label: "Hunt Duration (minutes)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
      ],
      calculate: (inputs) => {
        const totalEggs = parseFloat(inputs.totalEggs as string);
        const difficulty = inputs.difficulty as string;
        const numChildren = parseFloat(inputs.numChildren as string);
        const durationMinutes = parseFloat(inputs.durationMinutes as string);

        if (isNaN(totalEggs) || isNaN(numChildren)) return null;

        const spacingMap: Record<string, number> = { easy: 4, medium: 10, hard: 25 };
        const sqFtPerEgg = spacingMap[difficulty] || 10;
        const totalArea = totalEggs * sqFtPerEgg;
        const eggsPerKid = numChildren > 0 ? Math.floor(totalEggs / numChildren) : 0;
        const eggsPerMinute = durationMinutes > 0 ? totalEggs / durationMinutes : 0;

        return {
          primary: { label: "Recommended Area", value: `${formatNumber(totalArea, 0)} sq ft` },
          details: [
            { label: "Sq Ft per Egg", value: formatNumber(sqFtPerEgg, 0) },
            { label: "Eggs per Child", value: formatNumber(eggsPerKid, 0) },
            { label: "Avg Eggs Found/Minute", value: formatNumber(eggsPerMinute, 1) },
            { label: "Area in Sq Yards", value: formatNumber(totalArea / 9, 0) },
          ],
          note: difficulty === "easy" ? "For toddlers, place eggs in plain sight on the ground." : difficulty === "hard" ? "Hide eggs behind objects, up high, and in tricky spots." : "Mix visible eggs with a few slightly hidden ones.",
        };
      },
    },
  ],
  relatedSlugs: ["halloween-candy-calculator", "christmas-budget-calculator", "party-calculator"],
  faq: [
    {
      question: "How many Easter eggs do I need per child?",
      answer:
        "A good guideline is 8-12 eggs per child for a satisfying hunt. Younger children (toddlers) need fewer eggs in an easy area, while older kids enjoy more eggs hidden in challenging spots.",
    },
    {
      question: "What should I put inside Easter eggs besides candy?",
      answer:
        "Popular alternatives include stickers, small toys, coins, temporary tattoos, erasers, bouncy balls, or slips of paper with fun activities. For older kids, consider small gift cards or money.",
    },
    {
      question: "How big should my Easter egg hunt area be?",
      answer:
        "For toddlers, a small room or 200-400 sq ft of yard works. For ages 4-7, use 500-1,500 sq ft. For older kids, a larger yard of 1,500-3,000+ sq ft makes it more exciting.",
    },
  ],
  formula:
    "Total Eggs = Children × Eggs per Child; Candy = Total Eggs × Pieces per Egg; Area = Total Eggs × Sq Ft per Egg (based on difficulty)",
};
