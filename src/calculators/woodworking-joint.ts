import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodworkingJointCalculator: CalculatorDefinition = {
  slug: "woodworking-joint-calculator",
  title: "Woodworking Joint Dimension Calculator",
  description:
    "Free woodworking joint dimension calculator. Calculate proper dimensions for mortise and tenon, dovetail, box joint, and dado joints based on stock thickness.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "woodworking joint calculator",
    "mortise and tenon dimensions",
    "dovetail calculator",
    "box joint calculator",
    "dado joint dimensions",
  ],
  variants: [
    {
      id: "mortise-tenon",
      name: "Mortise & Tenon",
      description: "Calculate mortise and tenon dimensions",
      fields: [
        {
          name: "stockThickness",
          label: "Stock Thickness (inches)",
          type: "number",
          placeholder: "e.g. 0.75",
          min: 0.25,
          max: 4,
          step: 0.0625,
        },
        {
          name: "stockWidth",
          label: "Stock Width (inches)",
          type: "number",
          placeholder: "e.g. 3",
          min: 0.5,
          max: 12,
          step: 0.125,
        },
        {
          name: "jointType",
          label: "Joint Type",
          type: "select",
          options: [
            { label: "Standard (1/3 thickness)", value: "standard" },
            { label: "Heavy Duty (1/2 thickness)", value: "heavy" },
            { label: "Twin Tenon", value: "twin" },
            { label: "Haunched Tenon", value: "haunched" },
          ],
          defaultValue: "standard",
        },
      ],
      calculate: (inputs) => {
        const thickness = parseFloat(inputs.stockThickness as string);
        const width = parseFloat(inputs.stockWidth as string);
        const jointType = inputs.jointType as string;
        if (!thickness || !width) return null;

        let tenonThickness: number;
        let tenonWidth: number;
        let tenonLength: number;
        let mortiseDepth: number;
        let numTenons = 1;
        let haunchHeight = 0;

        if (jointType === "standard") {
          tenonThickness = thickness / 3;
          tenonWidth = width - thickness * 0.25; // 1/8" shoulder top and bottom
          tenonLength = thickness * 2;
          mortiseDepth = tenonLength + 0.0625; // 1/16" deeper for glue
        } else if (jointType === "heavy") {
          tenonThickness = thickness / 2;
          tenonWidth = width - thickness * 0.25;
          tenonLength = thickness * 2.5;
          mortiseDepth = tenonLength + 0.0625;
        } else if (jointType === "twin") {
          numTenons = 2;
          tenonThickness = thickness / 5;
          tenonWidth = (width - thickness * 0.5) / 2;
          tenonLength = thickness * 2;
          mortiseDepth = tenonLength + 0.0625;
        } else {
          // Haunched
          tenonThickness = thickness / 3;
          tenonWidth = width * 0.75;
          haunchHeight = width * 0.25;
          tenonLength = thickness * 2;
          mortiseDepth = tenonLength + 0.0625;
        }

        // Round to nearest 1/32
        const round32 = (n: number) => Math.round(n * 32) / 32;

        tenonThickness = round32(tenonThickness);
        tenonWidth = round32(tenonWidth);
        tenonLength = round32(tenonLength);
        mortiseDepth = round32(mortiseDepth);

        const shoulderWidth = (thickness - tenonThickness * numTenons) / (numTenons + 1);

        const details = [
          { label: "Tenon Thickness", value: formatNumber(tenonThickness, 4) + '"' },
          { label: "Tenon Width", value: formatNumber(tenonWidth, 4) + '"' },
          { label: "Tenon Length", value: formatNumber(tenonLength, 4) + '"' },
          { label: "Mortise Width (= tenon thickness)", value: formatNumber(tenonThickness, 4) + '"' },
          { label: "Mortise Depth", value: formatNumber(mortiseDepth, 4) + '"' },
          { label: "Shoulder Width", value: formatNumber(shoulderWidth, 4) + '"' },
        ];

        if (numTenons > 1) {
          details.push({ label: "Number of Tenons", value: formatNumber(numTenons, 0) });
        }
        if (haunchHeight > 0) {
          details.push({ label: "Haunch Height", value: formatNumber(round32(haunchHeight), 4) + '"' });
        }

        return {
          primary: {
            label: "Tenon Dimensions",
            value: formatNumber(tenonThickness, 4) + '" × ' + formatNumber(tenonWidth, 3) + '" × ' + formatNumber(tenonLength, 3) + '"',
          },
          details,
          note: "Use the nearest chisel size that matches the mortise width. Tenon should fit snugly in the mortise with light mallet taps.",
        };
      },
    },
    {
      id: "dovetail",
      name: "Dovetail Joint",
      description: "Calculate dovetail pin and tail dimensions",
      fields: [
        {
          name: "boardThickness",
          label: "Board Thickness (inches)",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0.25,
          max: 2,
          step: 0.0625,
        },
        {
          name: "boardWidth",
          label: "Board Width (inches)",
          type: "number",
          placeholder: "e.g. 6",
          min: 1,
          max: 24,
          step: 0.125,
        },
        {
          name: "dovetailRatio",
          label: "Dovetail Ratio (slope)",
          type: "select",
          options: [
            { label: "1:6 (softwood)", value: "6" },
            { label: "1:7 (general purpose)", value: "7" },
            { label: "1:8 (hardwood)", value: "8" },
          ],
          defaultValue: "8",
        },
        {
          name: "numTails",
          label: "Number of Tails",
          type: "number",
          placeholder: "e.g. 3",
          min: 1,
          max: 12,
        },
      ],
      calculate: (inputs) => {
        const thickness = parseFloat(inputs.boardThickness as string);
        const width = parseFloat(inputs.boardWidth as string);
        const ratio = parseFloat(inputs.dovetailRatio as string);
        const numTails = parseFloat(inputs.numTails as string);
        if (!thickness || !width || !ratio || !numTails) return null;

        const numPins = numTails + 1;

        // Half-pin width at narrow point (typically 1/2 of board thickness)
        const halfPinWidth = thickness / 2;

        // Available width for tails and full pins
        const availableWidth = width - 2 * halfPinWidth;

        // Tail width at widest point
        const tailSpacing = availableWidth / (numTails + (numTails - 1) * 0.4);
        const pinWidth = tailSpacing * 0.4;
        const tailWidth = tailSpacing;

        // Dovetail angle
        const angleDeg = Math.atan(1 / ratio) * (180 / Math.PI);

        // Depth (same as board thickness minus ~1/32 for cleanup)
        const depth = thickness - 0.03125;

        return {
          primary: {
            label: "Tail Width",
            value: formatNumber(tailWidth, 3) + '"',
          },
          details: [
            { label: "Number of Tails", value: formatNumber(numTails, 0) },
            { label: "Number of Pins", value: formatNumber(numPins, 0) + " (including half-pins)" },
            { label: "Pin Width (narrow)", value: formatNumber(pinWidth, 3) + '"' },
            { label: "Half-Pin Width", value: formatNumber(halfPinWidth, 3) + '"' },
            { label: "Joint Depth", value: formatNumber(depth, 4) + '"' },
            { label: "Dovetail Angle", value: formatNumber(angleDeg, 1) + " degrees" },
            { label: "Slope Ratio", value: "1:" + formatNumber(ratio, 0) },
          ],
          note: "Mark your baseline 1/32\" beyond the board thickness for a slight proud fit to plane flush. Layout with a marking gauge and dovetail marker.",
        };
      },
    },
    {
      id: "box-joint",
      name: "Box / Finger Joint",
      description: "Calculate box joint dimensions and spacing",
      fields: [
        {
          name: "boardThickness",
          label: "Board Thickness (inches)",
          type: "number",
          placeholder: "e.g. 0.5",
          min: 0.125,
          max: 2,
          step: 0.0625,
        },
        {
          name: "boardWidth",
          label: "Board Width (inches)",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 24,
          step: 0.125,
        },
        {
          name: "fingerWidth",
          label: "Finger Width (inches)",
          type: "number",
          placeholder: "e.g. 0.25",
          min: 0.125,
          max: 1,
          step: 0.0625,
        },
      ],
      calculate: (inputs) => {
        const thickness = parseFloat(inputs.boardThickness as string);
        const width = parseFloat(inputs.boardWidth as string);
        const fingerW = parseFloat(inputs.fingerWidth as string);
        if (!thickness || !width || !fingerW) return null;

        const numFingers = Math.floor(width / fingerW);
        const adjustedFingers = numFingers % 2 === 0 ? numFingers - 1 : numFingers;
        const adjustedWidth = fingerW; // keep consistent
        const remainder = width - adjustedFingers * fingerW;

        const fingerDepth = thickness;
        const glueSurface = adjustedFingers * fingerW * fingerDepth * 2;

        return {
          primary: {
            label: "Number of Fingers",
            value: formatNumber(adjustedFingers, 0),
          },
          details: [
            { label: "Finger Width", value: formatNumber(adjustedWidth, 4) + '"' },
            { label: "Finger Depth", value: formatNumber(fingerDepth, 4) + '"' },
            { label: "Pins (board A)", value: formatNumber(Math.ceil(adjustedFingers / 2), 0) },
            { label: "Slots (board B)", value: formatNumber(Math.floor(adjustedFingers / 2), 0) },
            { label: "Glue Surface Area", value: formatNumber(glueSurface, 2) + " sq in" },
            { label: "Remainder", value: formatNumber(remainder, 4) + '"' },
          ],
          note: "Use an odd number of fingers so the joint looks symmetrical. Set up a dado blade or router bit to match the finger width exactly.",
        };
      },
    },
  ],
  relatedSlugs: ["square-footage-calculator", "unit-converter", "pythagorean-calculator"],
  faq: [
    {
      question: "What size should a mortise and tenon be?",
      answer:
        "The standard rule is that the tenon thickness should be 1/3 of the stock thickness. The tenon length should be 2-3 times the stock thickness. The mortise width matches the tenon thickness and should be cut to the nearest chisel size. Leave 1/8\" shoulders on each face for a clean look.",
    },
    {
      question: "What is the correct dovetail angle?",
      answer:
        "For hardwoods, use a 1:8 ratio (about 7 degrees). For softwoods, use a 1:6 ratio (about 9.5 degrees). A 1:7 ratio works well as a general-purpose angle for mixed wood projects. The steeper angle (1:6) provides more mechanical strength in softer woods.",
    },
  ],
  formula:
    "Tenon Thickness = Stock Thickness / 3 | Tenon Length = Stock Thickness × 2 | Dovetail Angle = arctan(1/ratio)",
};
