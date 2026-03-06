import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cardMakingSuppliesCalculator: CalculatorDefinition = {
  slug: "card-making-supplies-calculator",
  title: "Card Making Supplies Calculator",
  description: "Calculate cardstock, envelopes, and embellishment quantities for handmade card projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["card making supplies","handmade card calculator","greeting card materials","cardstock calculator"],
  variants: [{
    id: "standard",
    name: "Card Making Supplies",
    description: "Calculate cardstock, envelopes, and embellishment quantities for handmade card projects.",
    fields: [
      { name: "numCards", label: "Number of Cards", type: "number", min: 1, max: 200, defaultValue: 20 },
      { name: "cardSize", label: "Card Size", type: "select", options: [{ value: "1", label: "A2 (4.25x5.5)" }, { value: "2", label: "A6 (4.5x6.25)" }, { value: "3", label: "A7 (5x7)" }, { value: "4", label: "Square (5.5x5.5)" }], defaultValue: "1" },
      { name: "layers", label: "Number of Card Layers", type: "number", min: 1, max: 5, defaultValue: 2 },
      { name: "embellishments", label: "Embellishment Level", type: "select", options: [{ value: "1", label: "None/Minimal" }, { value: "2", label: "Moderate (ribbon, gems)" }, { value: "3", label: "Elaborate (die cuts, stamps)" }], defaultValue: "2" },
      { name: "includeEnvelopes", label: "Include Envelopes", type: "select", options: [{ value: "1", label: "Yes" }, { value: "0", label: "No" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const numCards = inputs.numCards as number;
    const cardSize = parseInt(inputs.cardSize as string);
    const layers = inputs.layers as number;
    const embLevel = parseInt(inputs.embellishments as string);
    const inclEnv = parseInt(inputs.includeEnvelopes as string);
    const cardDims = { 1: [8.5, 5.5], 2: [9, 6.25], 3: [10, 7], 4: [11, 5.5] };
    const dims = cardDims[cardSize] || [8.5, 5.5];
    const sheetArea = 12 * 12;
    const cardArea = dims[0] * dims[1];
    const cardsPerSheet = Math.floor(sheetArea / cardArea);
    const baseSheetsNeeded = Math.ceil(numCards / Math.max(cardsPerSheet, 1));
    const totalSheets = baseSheetsNeeded * layers;
    const embCostPer = { 1: 0.1, 2: 0.5, 3: 1.5 };
    const sheetCost = totalSheets * 0.5;
    const embCost = numCards * (embCostPer[embLevel] || 0.5);
    const envCost = inclEnv === 1 ? numCards * 0.25 : 0;
    const totalCost = sheetCost + embCost + envCost;
    const costPerCard = totalCost / numCards;
    return {
      primary: { label: "Cardstock Sheets Needed", value: formatNumber(totalSheets) },
      details: [
        { label: "Cards Per Sheet", value: formatNumber(cardsPerSheet) },
        { label: "Cardstock Cost", value: "$" + formatNumber(Math.round(sheetCost * 100) / 100) },
        { label: "Embellishment Cost", value: "$" + formatNumber(Math.round(embCost * 100) / 100) },
        { label: "Cost Per Card", value: "$" + formatNumber(Math.round(costPerCard * 100) / 100) }
      ]
    };
  },
  }],
  relatedSlugs: ["paper-crafting-sheets-calculator","scrapbook-page-layout-calculator"],
  faq: [
    { question: "How much does it cost to make handmade cards?", answer: "A simple handmade card costs about 50 cents to 1 dollar in materials. Elaborate cards with die cuts, stamps, and special papers can cost 2 to 5 dollars each." },
    { question: "What cardstock weight is best for card making?", answer: "Use 80 to 110 lb cardstock for card bases. Lighter weights (65 lb) work for decorative layers. Heavier weights can be difficult to fold cleanly." },
    { question: "What size envelopes do I need?", answer: "A2 cards use A2 envelopes (4.375 x 5.75). A7 cards use A7 envelopes (5.25 x 7.25). Always buy envelopes slightly larger than the card." },
  ],
  formula: "Sheets = ceil(Cards / Cards Per Sheet) x Layers; Cost = (Sheets x $0.50) + (Cards x Embellishment Cost) + Envelope Cost; Cost Per Card = Total Cost / Number of Cards",
};
