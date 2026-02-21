import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const garageDoorSizeCalculator: CalculatorDefinition = {
  slug: "garage-door-size-calculator",
  title: "Garage Door Size Calculator",
  description: "Free garage door size calculator. Determine the right garage door dimensions, headroom, and sideroom requirements for your garage opening.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garage door size calculator", "garage door dimensions", "garage door opening size", "garage door measurement", "garage door replacement"],
  variants: [
    {
      id: "standard-size",
      name: "Garage Door Size Finder",
      description: "Find the right standard garage door size for your opening",
      fields: [
        { name: "openingWidth", label: "Opening Width (feet)", type: "number", placeholder: "e.g. 16" },
        { name: "openingHeight", label: "Opening Height (feet)", type: "number", placeholder: "e.g. 7" },
        { name: "garageType", label: "Garage Type", type: "select", options: [
          { label: "Single Car", value: "single" },
          { label: "Double Car", value: "double" },
          { label: "Triple Car / RV", value: "triple" },
        ], defaultValue: "double" },
        { name: "doorType", label: "Door Style", type: "select", options: [
          { label: "Sectional (Standard)", value: "sectional" },
          { label: "Roll-Up", value: "rollup" },
          { label: "Swing-Out Carriage", value: "carriage" },
        ], defaultValue: "sectional" },
      ],
      calculate: (inputs) => {
        const openingWidth = inputs.openingWidth as number;
        const openingHeight = inputs.openingHeight as number;
        const garageType = inputs.garageType as string;
        const doorType = inputs.doorType as string;
        if (!openingWidth || !openingHeight) return null;

        let recommendedWidth: number;
        let recommendedHeight: number;
        const standardWidths = garageType === "single" ? [8, 9, 10] : garageType === "double" ? [12, 14, 16, 18] : [16, 18, 20];
        const standardHeights = [7, 8, 9, 10];

        recommendedWidth = standardWidths.reduce((prev, curr) =>
          Math.abs(curr - openingWidth) < Math.abs(prev - openingWidth) ? curr : prev
        );
        recommendedHeight = standardHeights.reduce((prev, curr) =>
          Math.abs(curr - openingHeight) < Math.abs(prev - openingHeight) ? curr : prev
        );

        const headroom = doorType === "rollup" ? 12 : doorType === "carriage" ? 0 : 15;
        const sideroom = doorType === "carriage" ? 0 : 3.75;
        const backroom = doorType === "rollup" ? 0 : recommendedHeight + 18;

        const area = recommendedWidth * recommendedHeight;

        return {
          primary: { label: "Recommended Door Size", value: `${recommendedWidth}' × ${recommendedHeight}'` },
          details: [
            { label: "Door area", value: `${formatNumber(area)} sq ft` },
            { label: "Headroom needed", value: headroom > 0 ? `${headroom} inches minimum` : "N/A" },
            { label: "Sideroom needed (each side)", value: sideroom > 0 ? `${sideroom} inches minimum` : "N/A" },
            { label: "Backroom needed", value: backroom > 0 ? `${formatNumber(backroom / 12, 1)} feet minimum` : "N/A" },
            { label: "Standard sizes available", value: standardWidths.map(w => `${w}'`).join(", ") },
            { label: "Your opening", value: `${formatNumber(openingWidth, 1)}' × ${formatNumber(openingHeight, 1)}'` },
          ],
          note: "Standard sectional doors require 15\" headroom and 3.75\" sideroom. Measure from finished floor to header and between jambs for accurate sizing.",
        };
      },
    },
    {
      id: "door-cost",
      name: "Garage Door Cost Estimate",
      description: "Estimate the cost of a new garage door with installation",
      fields: [
        { name: "width", label: "Door Width (feet)", type: "number", placeholder: "e.g. 16" },
        { name: "height", label: "Door Height (feet)", type: "number", placeholder: "e.g. 7" },
        { name: "material", label: "Material", type: "select", options: [
          { label: "Steel (Single Layer)", value: "steel-single" },
          { label: "Steel (Insulated)", value: "steel-insulated" },
          { label: "Wood", value: "wood" },
          { label: "Aluminum / Glass", value: "aluminum" },
          { label: "Composite / Faux Wood", value: "composite" },
        ], defaultValue: "steel-insulated" },
        { name: "insulated", label: "Insulation", type: "select", options: [
          { label: "None (R-0)", value: "0" },
          { label: "Polystyrene (R-6)", value: "6" },
          { label: "Polyurethane (R-12)", value: "12" },
          { label: "High-Efficiency (R-18+)", value: "18" },
        ], defaultValue: "6" },
      ],
      calculate: (inputs) => {
        const width = inputs.width as number;
        const height = inputs.height as number;
        const material = inputs.material as string;
        const rValue = parseInt(inputs.insulated as string) || 0;
        if (!width || !height) return null;

        const area = width * height;
        let baseCostPerSqFt: number;
        switch (material) {
          case "steel-single": baseCostPerSqFt = 8; break;
          case "steel-insulated": baseCostPerSqFt = 14; break;
          case "wood": baseCostPerSqFt = 20; break;
          case "aluminum": baseCostPerSqFt = 25; break;
          case "composite": baseCostPerSqFt = 18; break;
          default: baseCostPerSqFt = 14;
        }

        const insulationAdder = rValue * 0.5;
        const doorCost = area * (baseCostPerSqFt + insulationAdder);
        const installationCost = width <= 10 ? 300 : 500;
        const openerCost = 350;
        const totalCost = doorCost + installationCost + openerCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Door cost", value: `$${formatNumber(doorCost, 0)}` },
            { label: "Installation cost", value: `$${formatNumber(installationCost, 0)}` },
            { label: "Opener cost (estimated)", value: `$${formatNumber(openerCost, 0)}` },
            { label: "Door area", value: `${formatNumber(area)} sq ft` },
            { label: "R-value", value: `R-${rValue}` },
          ],
          note: "Costs are approximate and vary by region. Includes standard opener. Premium openers, windows, and decorative hardware cost extra.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "driveway-calculator", "square-footage-calculator"],
  faq: [
    { question: "What is the standard garage door size?", answer: "Single car: 8' or 9' wide × 7' tall. Double car: 16' wide × 7' tall. These are the most common sizes, but doors are available from 8' to 20' wide and 7' to 10' tall." },
    { question: "How much headroom do I need for a garage door?", answer: "Standard sectional doors require 15 inches of headroom (space between the top of the opening and the ceiling). Low-headroom hardware is available for spaces with as little as 9.5 inches." },
  ],
  formula: "Headroom = 15\" (standard) | Sideroom = 3.75\" each side | Backroom = Door Height + 18\"",
};
