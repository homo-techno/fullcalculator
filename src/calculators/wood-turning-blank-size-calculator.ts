import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodTurningBlankSizeCalculator: CalculatorDefinition = {
  slug: "wood-turning-blank-size-calculator",
  title: "Wood Turning Blank Size Calculator",
  description: "Calculate the minimum wood blank dimensions needed for turned bowls, spindles, and vessels including waste allowance.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["wood turning blank","lathe blank size","bowl blank","wood turning calculator"],
  variants: [{
    id: "standard",
    name: "Wood Turning Blank Size",
    description: "Calculate the minimum wood blank dimensions needed for turned bowls, spindles, and vessels including waste allowance.",
    fields: [
      { name: "projectType", label: "Project Type", type: "select", options: [{ value: "1", label: "Bowl" }, { value: "2", label: "Spindle/Pen" }, { value: "3", label: "Vase/Vessel" }, { value: "4", label: "Platter" }], defaultValue: "1" },
      { name: "finishedDiameter", label: "Finished Diameter (inches)", type: "number", min: 1, max: 24, defaultValue: 8 },
      { name: "finishedHeight", label: "Finished Height/Depth (inches)", type: "number", min: 0.5, max: 18, defaultValue: 3 },
      { name: "wallThickness", label: "Wall Thickness (inches)", type: "number", min: 0.125, max: 1, defaultValue: 0.25 },
    ],
    calculate: (inputs) => {
    const projType = parseInt(inputs.projectType as string);
    const finDiam = inputs.finishedDiameter as number;
    const finHeight = inputs.finishedHeight as number;
    const wall = inputs.wallThickness as number;
    const wasteMargin = 1;
    const chuckAllowance = projType === 1 || projType === 3 ? 0.75 : 0.5;
    const blankDiam = finDiam + wasteMargin * 2;
    const blankThick = projType === 2 ? finDiam + wasteMargin : finHeight + chuckAllowance + wasteMargin;
    const volumeCuIn = Math.PI * Math.pow(blankDiam / 2, 2) * blankThick;
    const boardFeet = volumeCuIn / 144;
    return {
      primary: { label: "Blank Size", value: formatNumber(Math.round(blankDiam * 10) / 10) + " x " + formatNumber(Math.round(blankThick * 10) / 10) + " inches" },
      details: [
        { label: "Blank Diameter", value: formatNumber(Math.round(blankDiam * 10) / 10) + " in" },
        { label: "Blank Thickness", value: formatNumber(Math.round(blankThick * 10) / 10) + " in" },
        { label: "Blank Volume", value: formatNumber(Math.round(volumeCuIn * 10) / 10) + " cu in" },
        { label: "Board Feet", value: formatNumber(Math.round(boardFeet * 100) / 100) + " BF" }
      ]
    };
  },
  }],
  relatedSlugs: ["leather-working-cost-calculator","quilt-fabric-calculator"],
  faq: [
    { question: "How much extra wood do I need for turning?", answer: "Add at least 1 inch to the diameter and 0.75 to 1 inch to the height for waste from truing, tenon creation, and final finishing cuts." },
    { question: "What is a tenon in wood turning?", answer: "A tenon is a cylindrical nub left on the bottom of a bowl blank that fits into a chuck to hold the piece securely on the lathe during turning." },
    { question: "What wood is best for turning?", answer: "Cherry, maple, walnut, and ash are excellent turning woods. Green (wet) wood is easier to turn but must be dried slowly to prevent cracking." },
  ],
  formula: "Blank Diameter = Finished Diameter + (Waste Margin x 2)
Blank Thickness = Finished Height + Chuck Allowance + Waste Margin
Board Feet = (Pi x r^2 x Thickness) / 144",
};
