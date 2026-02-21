import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const braceletSizeCalculator: CalculatorDefinition = {
  slug: "bracelet-size-calculator",
  title: "Bracelet Size Calculator",
  description: "Free bracelet size calculator. Find the perfect bracelet or bangle size from your wrist measurement.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bracelet size calculator", "bracelet size chart", "bangle size calculator", "wrist measurement for bracelet", "bracelet length"],
  variants: [
    {
      id: "chain-bracelet",
      name: "Chain / Link Bracelet",
      description: "Find the right size for chain, link, or clasp bracelets",
      fields: [
        { name: "wristCirc", label: "Wrist Circumference", type: "number", placeholder: "e.g. 6.5", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
        { name: "fit", label: "Desired Fit", type: "select", options: [
          { label: "Snug (close to wrist)", value: "snug" },
          { label: "Comfort (standard)", value: "comfort" },
          { label: "Loose (relaxed)", value: "loose" },
        ], defaultValue: "comfort" },
      ],
      calculate: (inputs) => {
        let wristCirc = inputs.wristCirc as number;
        const unit = inputs.unit as string;
        const fit = inputs.fit as string;
        if (!wristCirc) return null;

        if (unit === "cm") wristCirc = wristCirc / 2.54;

        let addInches: number;
        if (fit === "snug") addInches = 0.25;
        else if (fit === "comfort") addInches = 0.75;
        else addInches = 1.25;

        const braceletLength = wristCirc + addInches;
        const roundedLength = Math.round(braceletLength * 4) / 4; // round to 0.25
        const lengthCm = roundedLength * 2.54;

        // Standard sizes
        const standardSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9];
        let nearestStandard = standardSizes[0];
        let minDiff = Infinity;
        for (const s of standardSizes) {
          if (Math.abs(s - braceletLength) < minDiff) {
            minDiff = Math.abs(s - braceletLength);
            nearestStandard = s;
          }
        }

        // Size category
        let sizeCategory: string;
        if (roundedLength <= 6.5) sizeCategory = "Small";
        else if (roundedLength <= 7) sizeCategory = "Medium";
        else if (roundedLength <= 7.5) sizeCategory = "Large";
        else sizeCategory = "Extra Large";

        return {
          primary: { label: "Bracelet Length", value: `${formatNumber(roundedLength, 2)} in` },
          details: [
            { label: "In Centimeters", value: `${formatNumber(lengthCm, 1)} cm` },
            { label: "Nearest Standard Size", value: `${nearestStandard} inches` },
            { label: "Size Category", value: sizeCategory },
            { label: "Wrist Circumference", value: `${formatNumber(wristCirc, 1)} in` },
            { label: "Added for Fit", value: `+${formatNumber(addInches, 2)} in (${fit})` },
          ],
          note: "Measure snugly around your wrist bone. For charm bracelets, add an extra 0.5 inch for the charms to lay properly.",
        };
      },
    },
    {
      id: "bangle",
      name: "Bangle Bracelet",
      description: "Find the right bangle size (must slip over hand)",
      fields: [
        { name: "handCirc", label: "Hand Circumference (knuckles closed)", type: "number", placeholder: "e.g. 8", step: 0.25 },
        { name: "unit", label: "Unit", type: "select", options: [
          { label: "Inches", value: "in" },
          { label: "Centimeters", value: "cm" },
        ], defaultValue: "in" },
      ],
      calculate: (inputs) => {
        let handCirc = inputs.handCirc as number;
        const unit = inputs.unit as string;
        if (!handCirc) return null;

        if (unit === "cm") handCirc = handCirc / 2.54;

        // Bangle must fit over the knuckles
        // Internal circumference should be ≥ hand circumference at widest point
        const innerCirc = handCirc;
        const innerDiameter = innerCirc / Math.PI;
        const innerDiameterMm = innerDiameter * 25.4;

        // Standard bangle sizes (inner diameter in mm)
        let bangleSize: string;
        if (innerDiameterMm < 60) bangleSize = "Extra Small (2.25 in / 57mm)";
        else if (innerDiameterMm < 64) bangleSize = "Small (2.4 in / 61mm)";
        else if (innerDiameterMm < 67) bangleSize = "Medium (2.5 in / 64mm)";
        else if (innerDiameterMm < 70) bangleSize = "Large (2.65 in / 67mm)";
        else bangleSize = "Extra Large (2.75 in / 70mm)";

        return {
          primary: { label: "Bangle Inner Diameter", value: `${formatNumber(innerDiameterMm, 0)} mm` },
          details: [
            { label: "Inner Diameter (inches)", value: `${formatNumber(innerDiameter, 2)} in` },
            { label: "Bangle Size", value: bangleSize },
            { label: "Hand Circumference", value: `${formatNumber(handCirc, 1)} in (${formatNumber(handCirc * 2.54, 1)} cm)` },
            { label: "Inner Circumference Needed", value: `${formatNumber(innerCirc, 1)} in` },
          ],
          note: "To measure: make a fist, bring your thumb and pinky together as if sliding on a bangle, and measure around the widest point of your hand.",
        };
      },
    },
  ],
  relatedSlugs: ["ring-size-calculator", "watch-size-calculator", "necklace-length-calculator"],
  faq: [
    { question: "How do I measure my wrist for a bracelet?", answer: "Wrap a flexible tape measure snugly around your wrist just below the wrist bone. For chain bracelets, add 0.5-1 inch for comfort. For bangles, measure around your closed hand at the widest point instead." },
    { question: "What is the average bracelet size?", answer: "The average women's bracelet size is 7 inches, and the average men's bracelet size is 8 inches. Sizes typically range from 6 to 9 inches for chain-style bracelets." },
    { question: "How should a bracelet fit?", answer: "A well-fitting bracelet should be snug enough not to slide off but loose enough to move slightly. You should be able to fit one finger between the bracelet and your wrist. Cuff bracelets should hold their position without pinching." },
  ],
  formula: "Chain bracelet length = Wrist circumference + 0.25\" (snug) / +0.75\" (comfort) / +1.25\" (loose) | Bangle diameter = Hand circumference / π",
};
