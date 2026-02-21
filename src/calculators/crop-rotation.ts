import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cropRotationCalculator: CalculatorDefinition = {
  slug: "crop-rotation-calculator",
  title: "Crop Rotation Planner Calculator",
  description: "Free crop rotation calculator. Plan your garden crop rotation schedule to improve soil health, prevent disease, and maximize yields across growing seasons.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crop rotation calculator", "crop rotation planner", "garden rotation schedule", "vegetable rotation chart", "4 year crop rotation plan"],
  variants: [
    {
      id: "four-bed",
      name: "4-Bed Rotation Plan",
      description: "Classic 4-year rotation for four garden beds",
      fields: [
        { name: "numBeds", label: "Number of Beds", type: "select", options: [
          { label: "4 Beds", value: "4" },
          { label: "6 Beds", value: "6" },
          { label: "8 Beds", value: "8" },
        ], defaultValue: "4" },
        { name: "currentYear", label: "Current Year of Rotation", type: "select", options: [
          { label: "Year 1 (Starting Fresh)", value: "1" },
          { label: "Year 2", value: "2" },
          { label: "Year 3", value: "3" },
          { label: "Year 4", value: "4" },
        ], defaultValue: "1" },
        { name: "primaryCrop", label: "Primary Crop Family This Year", type: "select", options: [
          { label: "Nightshades (Tomatoes, Peppers, Eggplant)", value: "nightshade" },
          { label: "Legumes (Beans, Peas)", value: "legume" },
          { label: "Brassicas (Broccoli, Cabbage, Kale)", value: "brassica" },
          { label: "Root Crops (Carrots, Beets, Onions)", value: "root" },
          { label: "Cucurbits (Squash, Cucumbers, Melons)", value: "cucurbit" },
          { label: "Leafy Greens (Lettuce, Spinach)", value: "leafy" },
        ], defaultValue: "nightshade" },
      ],
      calculate: (inputs) => {
        const beds = parseInt(inputs.numBeds as string);
        const year = parseInt(inputs.currentYear as string);
        const primary = inputs.primaryCrop as string;
        if (!beds || !year) return null;

        const rotationOrder: Record<string, string[]> = {
          nightshade: ["Nightshades", "Legumes", "Brassicas", "Root Crops"],
          legume: ["Legumes", "Brassicas", "Root Crops", "Nightshades"],
          brassica: ["Brassicas", "Root Crops", "Nightshades", "Legumes"],
          root: ["Root Crops", "Nightshades", "Legumes", "Brassicas"],
          cucurbit: ["Cucurbits", "Legumes", "Brassicas", "Root Crops"],
          leafy: ["Leafy Greens", "Legumes", "Root Crops", "Nightshades"],
        };

        const soilBenefits: Record<string, string> = {
          nightshade: "Heavy feeders - add compost before planting",
          legume: "Nitrogen fixers - improve soil for next crop",
          brassica: "Moderate feeders - benefit from legume nitrogen",
          root: "Light feeders - break up compacted soil",
          cucurbit: "Heavy feeders - add compost and mulch well",
          leafy: "Light-moderate feeders - quick growing",
        };

        const rotation = rotationOrder[primary] || rotationOrder.nightshade;
        const yearIndex = (year - 1) % 4;

        return {
          primary: { label: "This Year", value: `Bed 1: ${rotation[yearIndex % 4]}` },
          details: [
            { label: "Bed 1", value: rotation[yearIndex % 4] },
            { label: "Bed 2", value: rotation[(yearIndex + 1) % 4] },
            { label: "Bed 3", value: rotation[(yearIndex + 2) % 4] },
            { label: "Bed 4", value: rotation[(yearIndex + 3) % 4] },
            { label: "Rotation cycle", value: `${beds} beds, 4-year cycle` },
            { label: "Soil note", value: soilBenefits[primary] || "Rotate annually" },
          ],
          note: "Never plant the same crop family in the same bed two years in a row. Legumes fix nitrogen and should precede heavy feeders like tomatoes and squash.",
        };
      },
    },
    {
      id: "disease-prevention",
      name: "Disease Prevention Check",
      description: "Check minimum years between crop families in the same bed",
      fields: [
        { name: "lastCrop", label: "Last Year's Crop Family", type: "select", options: [
          { label: "Nightshades (Tomatoes, Peppers)", value: "nightshade" },
          { label: "Legumes (Beans, Peas)", value: "legume" },
          { label: "Brassicas (Broccoli, Cabbage)", value: "brassica" },
          { label: "Cucurbits (Squash, Cucumbers)", value: "cucurbit" },
          { label: "Alliums (Onions, Garlic)", value: "allium" },
          { label: "Root Vegetables (Carrots, Beets)", value: "root" },
        ], defaultValue: "nightshade" },
        { name: "proposedCrop", label: "Proposed Crop Family", type: "select", options: [
          { label: "Nightshades (Tomatoes, Peppers)", value: "nightshade" },
          { label: "Legumes (Beans, Peas)", value: "legume" },
          { label: "Brassicas (Broccoli, Cabbage)", value: "brassica" },
          { label: "Cucurbits (Squash, Cucumbers)", value: "cucurbit" },
          { label: "Alliums (Onions, Garlic)", value: "allium" },
          { label: "Root Vegetables (Carrots, Beets)", value: "root" },
        ], defaultValue: "legume" },
        { name: "yearsSinceLast", label: "Years Since Last Planted", type: "number", placeholder: "e.g. 2", min: 0, max: 10, defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const last = inputs.lastCrop as string;
        const proposed = inputs.proposedCrop as string;
        const years = inputs.yearsSinceLast as number;
        if (!last || !proposed || years === undefined) return null;

        const minYears: Record<string, number> = {
          nightshade: 3, brassica: 3, cucurbit: 2, legume: 2, allium: 2, root: 2,
        };

        const diseases: Record<string, string> = {
          nightshade: "Blight, fusarium wilt, verticillium wilt",
          brassica: "Clubroot, black rot, downy mildew",
          cucurbit: "Powdery mildew, bacterial wilt",
          legume: "Root rot, anthracnose",
          allium: "White rot, downy mildew",
          root: "Carrot fly, cavity spot",
        };

        const sameFamilyYearsNeeded = minYears[proposed] || 2;
        const isSameFamily = last === proposed;
        const isSafe = !isSameFamily || years >= sameFamilyYearsNeeded;

        return {
          primary: { label: "Rotation Status", value: isSafe ? "Safe to Plant" : "Not Recommended" },
          details: [
            { label: "Same family?", value: isSameFamily ? "Yes - rotation required" : "No - different families" },
            { label: "Minimum rotation gap", value: `${sameFamilyYearsNeeded} years for ${proposed}` },
            { label: "Years since last planted", value: `${years} year(s)` },
            { label: "Common diseases", value: diseases[proposed] || "Various" },
            { label: "Recommendation", value: isSafe ? "Good rotation choice" : `Wait ${sameFamilyYearsNeeded - years} more year(s)` },
          ],
          note: isSameFamily && !isSafe ? "Planting the same family too soon increases disease risk and depletes specific soil nutrients." : "Different crop families can generally follow each other without issue.",
        };
      },
    },
  ],
  relatedSlugs: ["companion-planting-calculator", "garden-yield-calculator", "soil-amendment-calculator"],
  faq: [
    { question: "Why is crop rotation important?", answer: "Crop rotation prevents soil-borne diseases, reduces pest buildup, balances soil nutrients, and improves soil structure. The same crops in the same spot deplete specific nutrients and allow disease organisms to build up in the soil." },
    { question: "What is the basic 4-year rotation?", answer: "A classic 4-year rotation: Year 1 - Nightshades (tomatoes, peppers), Year 2 - Legumes (beans, peas) to fix nitrogen, Year 3 - Brassicas (broccoli, cabbage), Year 4 - Root crops (carrots, beets). Then repeat." },
    { question: "How many years between the same crop?", answer: "Most experts recommend 3-4 years between planting the same crop family in the same location. Nightshades and brassicas need at least 3 years due to persistent soil diseases like blight and clubroot." },
  ],
  formula: "Rotation Cycle = Number of Crop Families × 1 Year Each | Minimum Gap = 3 years for nightshades/brassicas, 2 years for others",
};
