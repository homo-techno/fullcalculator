import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tableclothSizeCalculator: CalculatorDefinition = {
  slug: "tablecloth-size-calculator",
  title: "Tablecloth Size Calculator",
  description: "Free tablecloth size calculator. Find the right tablecloth dimensions for round, rectangular, and square tables.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tablecloth size calculator", "tablecloth dimensions", "tablecloth for round table", "tablecloth drop length", "table linen calculator"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular / Square Table",
      description: "Calculate tablecloth size for rectangular or square tables",
      fields: [
        { name: "tableLength", label: "Table Length", type: "number", placeholder: "e.g. 72", suffix: "in", step: 1 },
        { name: "tableWidth", label: "Table Width", type: "number", placeholder: "e.g. 36", suffix: "in", step: 1 },
        { name: "dropLength", label: "Desired Drop Length", type: "select", options: [
          { label: "Short / casual (6-8 in)", value: "7" },
          { label: "Standard / lap (10-12 in)", value: "11" },
          { label: "Formal / mid-calf (15 in)", value: "15" },
          { label: "Floor-length (30 in)", value: "30" },
        ], defaultValue: "11" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let tableLength = inputs.tableLength as number;
        let tableWidth = inputs.tableWidth as number;
        const dropLength = parseInt(inputs.dropLength as string);
        const unit = inputs.unit as string;
        if (!tableLength || !tableWidth) return null;

        if (unit === "cm") {
          tableLength = tableLength / 2.54;
          tableWidth = tableWidth / 2.54;
        }

        const clothLength = tableLength + (dropLength * 2);
        const clothWidth = tableWidth + (dropLength * 2);

        // Standard tablecloth sizes
        const standardSizes = [
          { name: "52×70", w: 52, l: 70 },
          { name: "60×84", w: 60, l: 84 },
          { name: "60×102", w: 60, l: 102 },
          { name: "60×120", w: 60, l: 120 },
          { name: "60×140", w: 60, l: 140 },
          { name: "70×90", w: 70, l: 90 },
          { name: "70×108", w: 70, l: 108 },
          { name: "70×120", w: 70, l: 120 },
          { name: "70×144", w: 70, l: 144 },
        ];

        let bestMatch = standardSizes[0];
        let bestOverage = Infinity;
        for (const size of standardSizes) {
          if (size.w >= clothWidth && size.l >= clothLength) {
            const overage = (size.w - clothWidth) + (size.l - clothLength);
            if (overage < bestOverage) {
              bestOverage = overage;
              bestMatch = size;
            }
          }
        }

        const hasStandardMatch = bestMatch.w >= clothWidth && bestMatch.l >= clothLength;

        return {
          primary: { label: "Tablecloth Size Needed", value: `${Math.ceil(clothWidth)} × ${Math.ceil(clothLength)} inches` },
          details: [
            { label: "In Centimeters", value: `${formatNumber(clothWidth * 2.54, 0)} × ${formatNumber(clothLength * 2.54, 0)} cm` },
            { label: "Table Size", value: `${formatNumber(tableLength, 0)} × ${formatNumber(tableWidth, 0)} in` },
            { label: "Drop Length", value: `${dropLength} inches per side` },
            { label: "Nearest Standard Size", value: hasStandardMatch ? `${bestMatch.name} inches` : "Custom size needed" },
            { label: "Seating Capacity (est.)", value: tableLength <= 48 ? "4-6 guests" : tableLength <= 72 ? "6-8 guests" : tableLength <= 96 ? "8-10 guests" : "10-12 guests" },
          ],
          note: "For formal dining, a 10-12 inch drop is standard. The tablecloth should never touch the seat of the chair. Floor-length cloths are for buffets and display tables.",
        };
      },
    },
    {
      id: "round",
      name: "Round Table",
      description: "Calculate tablecloth size for a round table",
      fields: [
        { name: "tableDiameter", label: "Table Diameter", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "dropLength", label: "Desired Drop Length", type: "select", options: [
          { label: "Short / casual (6-8 in)", value: "7" },
          { label: "Standard / lap (10-12 in)", value: "11" },
          { label: "Formal (15 in)", value: "15" },
          { label: "Floor-length (30 in)", value: "30" },
        ], defaultValue: "11" },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let tableDiameter = inputs.tableDiameter as number;
        const dropLength = parseInt(inputs.dropLength as string);
        const unit = inputs.unit as string;
        if (!tableDiameter) return null;

        if (unit === "cm") tableDiameter = tableDiameter / 2.54;

        const clothDiameter = tableDiameter + (dropLength * 2);

        // Standard round tablecloth sizes
        const standardRound = [70, 90, 108, 120, 132];
        let nearest = standardRound[0];
        let minDiff = Infinity;
        for (const s of standardRound) {
          if (s >= clothDiameter && s - clothDiameter < minDiff) {
            minDiff = s - clothDiameter;
            nearest = s;
          }
        }

        const hasMatch = nearest >= clothDiameter;

        // Seating
        let seating: string;
        if (tableDiameter <= 36) seating = "2-4 guests";
        else if (tableDiameter <= 48) seating = "4-6 guests";
        else if (tableDiameter <= 60) seating = "6-8 guests";
        else seating = "8-10 guests";

        return {
          primary: { label: "Tablecloth Diameter", value: `${Math.ceil(clothDiameter)} inches` },
          details: [
            { label: "In Centimeters", value: `${formatNumber(clothDiameter * 2.54, 0)} cm` },
            { label: "Table Diameter", value: `${formatNumber(tableDiameter, 0)} in` },
            { label: "Drop Length", value: `${dropLength} inches all around` },
            { label: "Nearest Standard Round", value: hasMatch ? `${nearest} inches` : "Custom size needed" },
            { label: "Seating Capacity", value: seating },
          ],
          note: "For round tables, you can also use a square tablecloth — the corners will drape elegantly. The square should be at least as wide as the needed round diameter.",
        };
      },
    },
  ],
  relatedSlugs: ["curtain-fabric-calculator", "fabric-yardage-calculator", "pillow-size-calculator"],
  faq: [
    { question: "How do I calculate what size tablecloth I need?", answer: "Measure your table length and width (or diameter for round). Add twice the desired drop length to each dimension. For a 60x36 table with 10-inch drop: (60+20) x (36+20) = 80x56 inch tablecloth." },
    { question: "What is the ideal tablecloth drop?", answer: "Casual dining: 6-8 inches. Standard dining: 10-12 inches. Formal dining: 15 inches. Buffet/display: 30 inches (floor-length). The cloth should not hang so low that it touches seated guests' laps excessively." },
    { question: "What size tablecloth fits a 6-foot table?", answer: "A 6-foot (72-inch) folding table with standard 10-12 inch drop needs a 90x132 inch tablecloth for floor-length, or 60x102 inches for standard dining drop." },
  ],
  formula: "Rectangular: Cloth size = Table size + (2 × Drop) on each dimension | Round: Cloth diameter = Table diameter + (2 × Drop)",
};
