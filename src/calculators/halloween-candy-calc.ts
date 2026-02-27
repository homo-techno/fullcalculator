import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const halloweenCandyCalcCalculator: CalculatorDefinition = {
  slug: "halloween-candy-calculator",
  title: "Halloween Candy Calculator",
  description:
    "Calculate how much Halloween candy you need for trick-or-treaters. Estimate bags to buy based on expected visitors, pieces per child, and candy type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "halloween candy",
    "trick or treat",
    "candy calculator",
    "halloween planning",
    "candy amount",
  ],
  variants: [
    {
      id: "byVisitors",
      name: "By Expected Visitors",
      description: "Estimate candy needs based on trick-or-treater count",
      fields: [
        { name: "expectedKids", label: "Expected Trick-or-Treaters", type: "number", placeholder: "e.g. 100", defaultValue: 100 },
        { name: "piecesPerKid", label: "Pieces per Child", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "piecesPerBag", label: "Pieces per Bag (store bag)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "costPerBag", label: "Cost per Bag ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "bufferPercent", label: "Extra Buffer (%)", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
      ],
      calculate: (inputs) => {
        const expectedKids = parseFloat(inputs.expectedKids as string);
        const piecesPerKid = parseFloat(inputs.piecesPerKid as string);
        const piecesPerBag = parseFloat(inputs.piecesPerBag as string);
        const costPerBag = parseFloat(inputs.costPerBag as string);
        const bufferPercent = parseFloat(inputs.bufferPercent as string);

        if (isNaN(expectedKids) || isNaN(piecesPerKid) || isNaN(piecesPerBag)) return null;

        const buffer = (bufferPercent || 0) / 100;
        const totalPieces = Math.ceil(expectedKids * piecesPerKid * (1 + buffer));
        const bagsNeeded = Math.ceil(totalPieces / piecesPerBag);
        const totalCost = bagsNeeded * (costPerBag || 0);
        const costPerKid = expectedKids > 0 ? totalCost / expectedKids : 0;

        return {
          primary: { label: "Total Pieces Needed", value: formatNumber(totalPieces, 0) },
          details: [
            { label: "Bags to Buy", value: formatNumber(bagsNeeded, 0) },
            { label: "Total Cost", value: `$${formatNumber(totalCost, 2)}` },
            { label: "Cost per Trick-or-Treater", value: `$${formatNumber(costPerKid, 2)}` },
            { label: "Buffer Pieces", value: formatNumber(totalPieces - expectedKids * piecesPerKid, 0) },
          ],
        };
      },
    },
    {
      id: "byBudget",
      name: "By Budget",
      description: "See how many kids you can serve with your candy budget",
      fields: [
        { name: "budget", label: "Candy Budget ($)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "costPerBag", label: "Cost per Bag ($)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "piecesPerBag", label: "Pieces per Bag", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "piecesPerKid", label: "Pieces per Child", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
      ],
      calculate: (inputs) => {
        const budget = parseFloat(inputs.budget as string);
        const costPerBag = parseFloat(inputs.costPerBag as string);
        const piecesPerBag = parseFloat(inputs.piecesPerBag as string);
        const piecesPerKid = parseFloat(inputs.piecesPerKid as string);

        if (isNaN(budget) || isNaN(costPerBag) || isNaN(piecesPerBag) || isNaN(piecesPerKid) || costPerBag <= 0 || piecesPerKid <= 0) return null;

        const bagsAffordable = Math.floor(budget / costPerBag);
        const totalPieces = bagsAffordable * piecesPerBag;
        const kidsServed = Math.floor(totalPieces / piecesPerKid);
        const leftover = budget - bagsAffordable * costPerBag;

        return {
          primary: { label: "Kids You Can Serve", value: formatNumber(kidsServed, 0) },
          details: [
            { label: "Bags You Can Buy", value: formatNumber(bagsAffordable, 0) },
            { label: "Total Pieces", value: formatNumber(totalPieces, 0) },
            { label: "Actual Spend", value: `$${formatNumber(bagsAffordable * costPerBag, 2)}` },
            { label: "Change Left Over", value: `$${formatNumber(leftover, 2)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["halloween-costume-cost-calculator", "easter-egg-hunt-calculator", "party-calculator"],
  faq: [
    {
      question: "How much candy do I need for Halloween?",
      answer:
        "A good rule of thumb is 2-3 pieces per trick-or-treater plus a 15-20% buffer. If you expect 100 kids, buy enough for about 350 pieces. Check your neighborhood's past years for a better estimate.",
    },
    {
      question: "What is the most popular Halloween candy?",
      answer:
        "Reese's Peanut Butter Cups, M&Ms, Snickers, and Kit Kats consistently rank as the most popular. Buying variety bags with these brands is usually a safe bet.",
    },
    {
      question: "When is the best time to buy Halloween candy?",
      answer:
        "The best deals are usually 1-2 weeks before Halloween when stores run promotions. Buying too early risks eating it yourself, and waiting until the day before may mean limited selection.",
    },
  ],
  formula:
    "Total Pieces = Expected Kids × Pieces per Child × (1 + Buffer%); Bags Needed = ⌈Total Pieces / Pieces per Bag⌉",
};
