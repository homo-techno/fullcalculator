import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const closetOrganizerCalculator: CalculatorDefinition = {
  slug: "closet-organizer-calculator",
  title: "Closet Organizer Calculator",
  description: "Free closet organizer calculator. Plan your closet layout with shelving, hanging rods, and storage calculations for reach-in and walk-in closets.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["closet organizer calculator", "closet design calculator", "closet shelving calculator", "walk-in closet planner", "closet storage calculator"],
  variants: [
    {
      id: "closet-layout",
      name: "Closet Storage Layout",
      description: "Calculate shelving and hanging rod lengths for your closet",
      fields: [
        { name: "closetWidth", label: "Closet Width (inches)", type: "number", placeholder: "e.g. 72" },
        { name: "closetDepth", label: "Closet Depth (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "closetHeight", label: "Closet Height (inches)", type: "number", placeholder: "e.g. 96", defaultValue: 96 },
        { name: "closetType", label: "Closet Type", type: "select", options: [
          { label: "Reach-In (single wall)", value: "reach-in" },
          { label: "Walk-In (3 walls)", value: "walk-in" },
          { label: "Walk-In (2 walls, L-shape)", value: "walk-in-l" },
        ], defaultValue: "reach-in" },
      ],
      calculate: (inputs) => {
        const width = inputs.closetWidth as number;
        const depth = inputs.closetDepth as number;
        const height = (inputs.closetHeight as number) || 96;
        const closetType = inputs.closetType as string;
        if (!width || !depth) return null;

        let totalLinearIn: number;
        switch (closetType) {
          case "walk-in":
            totalLinearIn = width + (depth - 24) * 2; // Minus 24" for walkway on each side
            break;
          case "walk-in-l":
            totalLinearIn = width + (depth - 24);
            break;
          default:
            totalLinearIn = width;
        }

        const totalLinearFt = totalLinearIn / 12;

        // Double-hang section (short items): takes ~40% of space
        const doubleHangFt = totalLinearFt * 0.4;
        const longHangFt = totalLinearFt * 0.3;
        const shelvingFt = totalLinearFt * 0.3;

        const upperRodHeight = 82; // inches from floor
        const lowerRodHeight = 40; // inches from floor for double-hang
        const longRodHeight = 68; // inches from floor

        const shelfCount = Math.floor((height - 12) / 14); // 14" shelf spacing
        const totalShelfLinearFt = shelvingFt * shelfCount;

        const totalSqFt = (width * depth) / 144;
        const storageLinearFt = totalLinearFt;

        return {
          primary: { label: "Total Storage Length", value: `${formatNumber(storageLinearFt, 1)} linear feet` },
          details: [
            { label: "Double-hang section", value: `${formatNumber(doubleHangFt, 1)} ft (upper rod ${upperRodHeight}\", lower rod ${lowerRodHeight}\")` },
            { label: "Long-hang section", value: `${formatNumber(longHangFt, 1)} ft (rod at ${longRodHeight}\")` },
            { label: "Shelving section width", value: `${formatNumber(shelvingFt, 1)} ft` },
            { label: "Total shelf linear feet", value: `${formatNumber(totalShelfLinearFt, 1)} ft (${shelfCount} shelves)` },
            { label: "Closet floor area", value: `${formatNumber(totalSqFt, 1)} sq ft` },
          ],
          note: "Layout uses a recommended 40/30/30 split: double-hang for shirts/pants, long-hang for dresses/coats, and shelving for folded items/shoes. Adjust based on your wardrobe.",
        };
      },
    },
    {
      id: "closet-materials",
      name: "Closet Organizer Materials",
      description: "Estimate materials and cost for a closet organizer system",
      fields: [
        { name: "linearFeet", label: "Total Linear Feet", type: "number", placeholder: "e.g. 10" },
        { name: "systemType", label: "Organizer System Type", type: "select", options: [
          { label: "Wire Shelving", value: "wire" },
          { label: "Laminate / Melamine", value: "laminate" },
          { label: "Solid Wood", value: "wood" },
          { label: "Custom Built-In", value: "custom" },
        ], defaultValue: "laminate" },
        { name: "features", label: "Extra Features", type: "select", options: [
          { label: "Basic (shelves + rods only)", value: "basic" },
          { label: "Standard (+ drawers)", value: "standard" },
          { label: "Premium (+ drawers, shoe rack, accessories)", value: "premium" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const linearFeet = inputs.linearFeet as number;
        const systemType = inputs.systemType as string;
        const features = inputs.features as string;
        if (!linearFeet) return null;

        let baseCostPerFt: number;
        switch (systemType) {
          case "wire": baseCostPerFt = 15; break;
          case "laminate": baseCostPerFt = 40; break;
          case "wood": baseCostPerFt = 80; break;
          case "custom": baseCostPerFt = 150; break;
          default: baseCostPerFt = 40;
        }

        let featureMultiplier: number;
        switch (features) {
          case "basic": featureMultiplier = 1.0; break;
          case "standard": featureMultiplier = 1.4; break;
          case "premium": featureMultiplier = 1.9; break;
          default: featureMultiplier = 1.4;
        }

        const materialCost = linearFeet * baseCostPerFt * featureMultiplier;
        const hangingRods = Math.ceil(linearFeet * 0.7); // 70% has rods
        const shelves = Math.ceil(linearFeet * 0.3) * 5; // 30% is shelving, 5 shelves per section
        const brackets = shelves * 2;

        const installCost = systemType === "custom" ? linearFeet * 50 : systemType === "wire" ? 0 : linearFeet * 25;

        return {
          primary: { label: "Estimated Cost", value: `$${formatNumber(materialCost + installCost, 0)}` },
          details: [
            { label: "Materials cost", value: `$${formatNumber(materialCost, 0)}` },
            { label: "Installation cost", value: `$${formatNumber(installCost, 0)}` },
            { label: "Hanging rod length", value: `${hangingRods} linear ft` },
            { label: "Shelves needed", value: `${shelves}` },
            { label: "Shelf brackets", value: `${brackets}` },
          ],
          note: "Wire shelving is the most affordable and DIY-friendly. Laminate/melamine offers the best value. Custom built-ins maximize space but cost significantly more.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "shelving-calculator", "cabinet-calculator"],
  faq: [
    { question: "What is the standard closet rod height?", answer: "Standard single rod: 66-68 inches from the floor. Double-hang upper rod: 80-82 inches. Double-hang lower rod: 38-40 inches. These heights work for most average-height adults." },
    { question: "How deep should closet shelves be?", answer: "Standard closet shelf depth: 12-16 inches for folded clothes and shoes. Hanging rod depth: 22-24 inches from the wall to accommodate hangers. Walk-in closets need at least 24 inches of clear walkway space." },
  ],
  formula: "Linear Feet = Closet Width / 12 | Double-Hang = 40% | Long-Hang = 30% | Shelves = 30% | Shelf Count = (Height - 12) / 14",
};
