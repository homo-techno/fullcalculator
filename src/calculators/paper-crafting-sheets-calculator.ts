import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paperCraftingSheetsCalculator: CalculatorDefinition = {
  slug: "paper-crafting-sheets-calculator",
  title: "Paper Crafting Sheets Calculator",
  description: "Calculate how many sheets of cardstock or paper are needed for crafting projects based on cuts per sheet and quantities.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paper crafting","cardstock calculator","paper cutting","craft paper sheets"],
  variants: [{
    id: "standard",
    name: "Paper Crafting Sheets",
    description: "Calculate how many sheets of cardstock or paper are needed for crafting projects based on cuts per sheet and quantities.",
    fields: [
      { name: "sheetWidth", label: "Sheet Width (inches)", type: "number", min: 4, max: 24, defaultValue: 12 },
      { name: "sheetHeight", label: "Sheet Height (inches)", type: "number", min: 4, max: 24, defaultValue: 12 },
      { name: "cutWidth", label: "Cut Piece Width (inches)", type: "number", min: 0.5, max: 12, defaultValue: 4.25 },
      { name: "cutHeight", label: "Cut Piece Height (inches)", type: "number", min: 0.5, max: 12, defaultValue: 5.5 },
      { name: "quantity", label: "Pieces Needed", type: "number", min: 1, max: 500, defaultValue: 24 },
      { name: "wasteMargin", label: "Blade Waste (inches)", type: "number", min: 0, max: 0.25, defaultValue: 0.0625 },
    ],
    calculate: (inputs) => {
    const sw = inputs.sheetWidth as number;
    const sh = inputs.sheetHeight as number;
    const cw = inputs.cutWidth as number;
    const ch = inputs.cutHeight as number;
    const qty = inputs.quantity as number;
    const waste = inputs.wasteMargin as number;
    const effectCW = cw + waste;
    const effectCH = ch + waste;
    const orient1 = Math.floor(sw / effectCW) * Math.floor(sh / effectCH);
    const orient2 = Math.floor(sw / effectCH) * Math.floor(sh / effectCW);
    const cutsPerSheet = Math.max(orient1, orient2);
    const sheetsNeeded = Math.ceil(qty / Math.max(cutsPerSheet, 1));
    const totalCuts = sheetsNeeded * cutsPerSheet;
    const wastePercent = Math.round((1 - (cutsPerSheet * cw * ch) / (sw * sh)) * 100);
    return {
      primary: { label: "Sheets Needed", value: formatNumber(sheetsNeeded) },
      details: [
        { label: "Cuts Per Sheet", value: formatNumber(cutsPerSheet) },
        { label: "Total Pieces Cut", value: formatNumber(totalCuts) },
        { label: "Leftover Pieces", value: formatNumber(totalCuts - qty) },
        { label: "Sheet Waste", value: formatNumber(wastePercent) + "%" }
      ]
    };
  },
  }],
  relatedSlugs: ["card-making-supplies-calculator","scrapbook-page-layout-calculator"],
  faq: [
    { question: "What is the standard cardstock sheet size?", answer: "The most common cardstock sizes for crafting are 8.5 x 11 inches (letter) and 12 x 12 inches (scrapbook size). A7 card bases are typically cut from 8.5 x 11 sheets." },
    { question: "How thick should cardstock be for card making?", answer: "Card bases typically use 65 to 110 lb cardstock. 80 lb is a good all-purpose weight. Lighter weights work for layering and decorative panels." },
    { question: "Should I account for blade waste when cutting?", answer: "Yes, trimmer blades remove a tiny amount of material. For precise work, add 1/16 inch per cut to your calculations." },
  ],
  formula: "Cuts Per Sheet = max(floor(W/cw) x floor(H/ch), floor(W/ch) x floor(H/cw)); Sheets Needed = ceil(Quantity / Cuts Per Sheet); Waste % = (1 - (Cuts x Cut Area) / Sheet Area) x 100",
};
