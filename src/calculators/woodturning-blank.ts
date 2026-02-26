import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodturningBlankCalculator: CalculatorDefinition = {
  slug: "woodturning-blank-calculator",
  title: "Woodturning Blank Size Calculator",
  description: "Free online woodturning blank size calculator. Calculate the blank dimensions needed for bowls, spindles, and other turned projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["woodturning blank calculator", "bowl blank calculator", "turning blank size", "lathe blank calculator", "wood blank estimator"],
  variants: [
    {
      id: "bowl",
      name: "Bowl Blank",
      description: "Calculate blank size needed for a turned bowl",
      fields: [
        { name: "finishedDiameter", label: "Finished Bowl Diameter (inches)", type: "number", placeholder: "e.g. 8" },
        { name: "finishedHeight", label: "Finished Bowl Height (inches)", type: "number", placeholder: "e.g. 4" },
        { name: "wallThickness", label: "Wall Thickness (inches)", type: "number", placeholder: "e.g. 0.25", defaultValue: 0.25 },
        { name: "bottomThickness", label: "Bottom Thickness (inches)", type: "number", placeholder: "e.g. 0.375", defaultValue: 0.375 },
        { name: "tenon", label: "Tenon/Waste on Bottom (inches)", type: "number", placeholder: "e.g. 0.75", defaultValue: 0.75 },
        { name: "extraDiameter", label: "Extra Diameter for Rounding (inches)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const finDiam = parseFloat(inputs.finishedDiameter as string) || 0;
        const finHeight = parseFloat(inputs.finishedHeight as string) || 0;
        const wallThick = parseFloat(inputs.wallThickness as string) || 0.25;
        const bottomThick = parseFloat(inputs.bottomThickness as string) || 0.375;
        const tenon = parseFloat(inputs.tenon as string) || 0.75;
        const extraDiam = parseFloat(inputs.extraDiameter as string) || 1;
        if (!finDiam || !finHeight) return null;

        const blankDiameter = finDiam + extraDiam;
        const blankHeight = finHeight + bottomThick + tenon;
        const blankRadius = blankDiameter / 2;
        const blankVolumeCuIn = Math.PI * blankRadius * blankRadius * blankHeight;
        const boardFeet = blankVolumeCuIn / 144;

        const finRadius = finDiam / 2;
        const finVolume = Math.PI * finRadius * finRadius * finHeight;
        const woodRemoved = blankVolumeCuIn - finVolume;
        const removalPct = (woodRemoved / blankVolumeCuIn) * 100;

        return {
          primary: { label: "Blank Size Needed", value: `${formatNumber(blankDiameter, 1)}" × ${formatNumber(blankHeight, 1)}" thick` },
          details: [
            { label: "Blank diameter", value: `${formatNumber(blankDiameter, 1)} inches` },
            { label: "Blank thickness", value: `${formatNumber(blankHeight, 2)} inches` },
            { label: "Blank volume", value: `${formatNumber(blankVolumeCuIn, 1)} cu in` },
            { label: "Board feet", value: formatNumber(boardFeet, 2) },
            { label: "Wood removed", value: `${formatNumber(removalPct, 0)}%` },
            { label: "Finished size", value: `${formatNumber(finDiam)}" × ${formatNumber(finHeight)}" tall` },
          ],
          note: "Allow extra for wood movement during drying. Green (wet) blanks should be 10% oversized to account for shrinkage.",
        };
      },
    },
    {
      id: "spindle",
      name: "Spindle Blank",
      description: "Calculate blank size for spindle turning (pens, handles, legs)",
      fields: [
        { name: "finishedLength", label: "Finished Length (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "maxDiameter", label: "Max Finished Diameter (inches)", type: "number", placeholder: "e.g. 2" },
        { name: "extraLength", label: "Extra Length for Waste (inches)", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "extraDiameter", label: "Extra Diameter for Rounding (inches)", type: "number", placeholder: "e.g. 0.5", defaultValue: 0.5 },
        { name: "quantity", label: "Number of Blanks", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const finLength = parseFloat(inputs.finishedLength as string) || 0;
        const maxDiam = parseFloat(inputs.maxDiameter as string) || 0;
        const extraLen = parseFloat(inputs.extraLength as string) || 1;
        const extraDiam = parseFloat(inputs.extraDiameter as string) || 0.5;
        const qty = parseFloat(inputs.quantity as string) || 1;
        if (!finLength || !maxDiam) return null;

        const blankLength = finLength + extraLen;
        const blankSquare = maxDiam + extraDiam;
        const blankVolume = blankSquare * blankSquare * blankLength;
        const totalVolume = blankVolume * qty;
        const boardFeet = totalVolume / 144;

        return {
          primary: { label: "Blank Size", value: `${formatNumber(blankSquare, 2)}" × ${formatNumber(blankSquare, 2)}" × ${formatNumber(blankLength, 1)}" long` },
          details: [
            { label: "Cross section", value: `${formatNumber(blankSquare, 2)}" square` },
            { label: "Blank length", value: `${formatNumber(blankLength, 1)}"` },
            { label: "Volume per blank", value: `${formatNumber(blankVolume, 1)} cu in` },
            { label: "Quantity", value: formatNumber(qty, 0) },
            { label: "Total board feet", value: formatNumber(boardFeet, 2) },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["volume-calculator", "unit-converter"],
  faq: [
    { question: "How much bigger should a blank be than the finished piece?", answer: "For bowls, add 1\" to diameter for rounding/truing and 0.75-1\" to height for a tenon and waste. For spindles, add 0.5\" to the cross section and 1\" to length for mounting between centers." },
    { question: "What is a tenon in woodturning?", answer: "A tenon is a cylindrical projection turned on the base of a bowl blank that fits into a scroll chuck for mounting. It's typically 0.5-0.75\" long and is removed or cleaned up in the finishing process." },
    { question: "Should I use green or dry wood?", answer: "Green (wet) wood is easier to turn and less dusty, but it will warp as it dries. Turn green blanks 10% oversized, then let them dry before final turning. Dry wood gives immediate final results." },
  ],
  formula: "Blank Diameter = Finished Diameter + Rounding Allowance; Blank Height = Finished Height + Bottom + Tenon",
};
