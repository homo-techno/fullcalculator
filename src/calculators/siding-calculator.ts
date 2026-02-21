import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sidingCalculator: CalculatorDefinition = {
  slug: "siding-calculator",
  title: "House Siding Calculator",
  description: "Free house siding calculator. Calculate how much siding you need in squares, panels, or boards for vinyl, wood, fiber cement, and other siding materials.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["siding calculator", "house siding calculator", "vinyl siding calculator", "how much siding do I need", "siding cost calculator"],
  variants: [
    {
      id: "siding-area",
      name: "Siding Area & Materials",
      description: "Calculate siding needed based on wall dimensions",
      fields: [
        { name: "perimeter", label: "House Perimeter (feet)", type: "number", placeholder: "e.g. 160" },
        { name: "wallHeight", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 9", defaultValue: 9 },
        { name: "gableCount", label: "Number of Gables", type: "select", options: [
          { label: "0 (Hip roof)", value: "0" },
          { label: "2 (Standard gable)", value: "2" },
          { label: "4 (Cross gable)", value: "4" },
        ], defaultValue: "2" },
        { name: "gableWidth", label: "Gable Width (feet)", type: "number", placeholder: "e.g. 30", defaultValue: 30 },
        { name: "roofPitch", label: "Roof Pitch (for gable area)", type: "select", options: [
          { label: "4/12", value: "4" },
          { label: "5/12", value: "5" },
          { label: "6/12", value: "6" },
          { label: "7/12", value: "7" },
          { label: "8/12", value: "8" },
          { label: "10/12", value: "10" },
          { label: "12/12", value: "12" },
        ], defaultValue: "6" },
        { name: "windows", label: "Number of Windows (avg 15 sq ft each)", type: "number", placeholder: "e.g. 12", defaultValue: 10 },
        { name: "doors", label: "Number of Doors (avg 21 sq ft each)", type: "number", placeholder: "e.g. 3", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const wallHeight = (inputs.wallHeight as number) || 9;
        const gableCount = parseInt(inputs.gableCount as string) || 2;
        const gableWidth = (inputs.gableWidth as number) || 30;
        const pitch = parseInt(inputs.roofPitch as string) || 6;
        const windows = (inputs.windows as number) || 10;
        const doors = (inputs.doors as number) || 2;
        if (!perimeter) return null;

        const wallArea = perimeter * wallHeight;
        const gableHeight = (gableWidth / 2) * (pitch / 12);
        const gableArea = gableCount * 0.5 * gableWidth * gableHeight;
        const grossArea = wallArea + gableArea;
        const windowDeduction = windows * 15;
        const doorDeduction = doors * 21;
        const netArea = grossArea - windowDeduction - doorDeduction;
        const areaWithWaste = netArea * 1.10; // 10% waste

        const squares = areaWithWaste / 100; // 1 square = 100 sq ft

        return {
          primary: { label: "Siding Needed", value: `${formatNumber(areaWithWaste, 0)} sq ft (${formatNumber(squares, 1)} squares)` },
          details: [
            { label: "Wall area", value: `${formatNumber(wallArea, 0)} sq ft` },
            { label: "Gable area", value: `${formatNumber(gableArea, 0)} sq ft` },
            { label: "Gross area", value: `${formatNumber(grossArea, 0)} sq ft` },
            { label: "Window deductions", value: `−${formatNumber(windowDeduction, 0)} sq ft (${windows} windows)` },
            { label: "Door deductions", value: `−${formatNumber(doorDeduction, 0)} sq ft (${doors} doors)` },
            { label: "Net area", value: `${formatNumber(netArea, 0)} sq ft` },
            { label: "With 10% waste", value: `${formatNumber(areaWithWaste, 0)} sq ft` },
          ],
          note: "One 'square' of siding = 100 sq ft. Vinyl siding is sold in boxes covering approximately 100-200 sq ft. Lap siding boards vary by exposure width.",
        };
      },
    },
    {
      id: "siding-cost",
      name: "Siding Cost Estimate",
      description: "Estimate siding material and installation costs",
      fields: [
        { name: "area", label: "Siding Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "material", label: "Siding Material", type: "select", options: [
          { label: "Vinyl ($3-$8/sq ft installed)", value: "vinyl" },
          { label: "Fiber Cement / Hardie ($6-$13/sq ft installed)", value: "fibercement" },
          { label: "Wood Clapboard ($6-$12/sq ft installed)", value: "wood" },
          { label: "Engineered Wood ($4-$9/sq ft installed)", value: "engineered" },
          { label: "Metal / Steel ($5-$12/sq ft installed)", value: "metal" },
          { label: "Stone Veneer ($15-$30/sq ft installed)", value: "stone" },
          { label: "Stucco ($6-$10/sq ft installed)", value: "stucco" },
        ], defaultValue: "vinyl" },
        { name: "removeOld", label: "Remove Old Siding?", type: "select", options: [
          { label: "No (over existing)", value: "0" },
          { label: "Yes ($1-$3/sq ft)", value: "2" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const material = inputs.material as string;
        const removeOldCost = parseInt(inputs.removeOld as string) || 0;
        if (!area) return null;

        let costPerSqFt: number;
        switch (material) {
          case "vinyl": costPerSqFt = 5.5; break;
          case "fibercement": costPerSqFt = 9.5; break;
          case "wood": costPerSqFt = 9; break;
          case "engineered": costPerSqFt = 6.5; break;
          case "metal": costPerSqFt = 8.5; break;
          case "stone": costPerSqFt = 22; break;
          case "stucco": costPerSqFt = 8; break;
          default: costPerSqFt = 5.5;
        }

        const materialAndInstall = area * costPerSqFt;
        const removalCost = area * removeOldCost;
        const housewrap = area * 0.15; // Tyvek etc
        const trimCost = area * 0.75;
        const totalCost = materialAndInstall + removalCost + housewrap + trimCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Siding (material + labor)", value: `$${formatNumber(materialAndInstall, 0)}` },
            { label: "Old siding removal", value: `$${formatNumber(removalCost, 0)}` },
            { label: "House wrap / WRB", value: `$${formatNumber(housewrap, 0)}` },
            { label: "Trim & accessories", value: `$${formatNumber(trimCost, 0)}` },
            { label: "Total area", value: `${formatNumber(area, 0)} sq ft` },
            { label: "Cost per sq ft (all-in)", value: `$${formatNumber(totalCost / area, 2)}` },
          ],
          note: "Prices include typical installation labor. Costs vary significantly by region. Get at least 3 quotes. Fiber cement and wood siding require painting every 7-10 years.",
        };
      },
    },
  ],
  relatedSlugs: ["paint-calculator", "soffit-calculator", "insulation-calculator"],
  faq: [
    { question: "How much siding do I need?", answer: "Measure each wall (height × width), add gable areas (triangle = 0.5 × base × height), subtract windows (avg 15 sq ft) and doors (avg 21 sq ft), then add 10% for waste. Most homes need 1,500-3,000 sq ft of siding." },
    { question: "What is the cheapest siding option?", answer: "Vinyl siding is the most affordable at $3-$8 per sq ft installed. Engineered wood ($4-$9) is the next most affordable. Fiber cement ($6-$13) offers the best value for durability. Stone veneer ($15-$30) and brick ($10-$25) are the most expensive." },
  ],
  formula: "Wall Area = Perimeter × Height | Gable Area = 0.5 × Width × (Width/2 × Pitch/12) | Net = Gross - Windows - Doors | Squares = Area / 100",
};
