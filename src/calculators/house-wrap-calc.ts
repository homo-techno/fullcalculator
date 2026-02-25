import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const houseWrapCalcCalculator: CalculatorDefinition = {
  slug: "house-wrap-calc-calculator",
  title: "House Wrap Calculator",
  description: "Free house wrap calculator. Estimate how many rolls of Tyvek or house wrap, cap nails, and tape you need for your building envelope project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["house wrap calculator", "Tyvek calculator", "how much house wrap do I need", "building wrap calculator", "weather barrier calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate House Wrap Materials",
      description: "Estimate house wrap rolls, tape, and fasteners",
      fields: [
        { name: "perimeter", label: "Building Perimeter (feet)", type: "number", placeholder: "e.g. 160" },
        { name: "wallHeight", label: "Wall Height (feet)", type: "number", placeholder: "e.g. 9", defaultValue: 9 },
        { name: "windowDoorArea", label: "Window & Door Area (sq ft)", type: "number", placeholder: "e.g. 200", defaultValue: 0 },
        { name: "rollSize", label: "Roll Size", type: "select", options: [{ label: "3' x 165' (495 sq ft)", value: "3x165" }, { label: "9' x 100' (900 sq ft)", value: "9x100" }, { label: "9' x 150' (1350 sq ft)", value: "9x150" }, { label: "10' x 150' (1500 sq ft)", value: "10x150" }], defaultValue: "9x150" },
        { name: "costPerRoll", label: "Cost per Roll (optional)", type: "number", placeholder: "e.g. 150", prefix: "$" },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const wallHeight = (inputs.wallHeight as number) || 9;
        const windowDoorArea = (inputs.windowDoorArea as number) || 0;
        const rollSize = (inputs.rollSize as string) || "9x150";
        const costPerRoll = inputs.costPerRoll as number;
        if (!perimeter) return null;

        const grossArea = perimeter * wallHeight;
        // Don't subtract window/door area for ordering because wrap goes over openings and is cut
        // But we note the net area for reference
        const netArea = grossArea - windowDoorArea;

        // Include 6-12 inch overlap at horizontal and vertical seams
        const overlapFactor = 1.12;
        const adjustedArea = grossArea * overlapFactor;

        let sqFtPerRoll = 0;
        let rollLabel = "";
        if (rollSize === "3x165") {
          sqFtPerRoll = 495;
          rollLabel = "3' x 165'";
        } else if (rollSize === "9x100") {
          sqFtPerRoll = 900;
          rollLabel = "9' x 100'";
        } else if (rollSize === "9x150") {
          sqFtPerRoll = 1350;
          rollLabel = "9' x 150'";
        } else {
          sqFtPerRoll = 1500;
          rollLabel = "10' x 150'";
        }

        const rollsNeeded = Math.ceil(adjustedArea / sqFtPerRoll);

        // Cap nails: 1 per sq ft
        const capNails = Math.ceil(grossArea);
        const capNailBoxes = Math.ceil(capNails / 2000);

        // Seam tape: seams at overlaps + around every window/door
        // Horizontal seam at each lap
        const horizontalSeams = Math.ceil(wallHeight / 9) * perimeter;
        const windowPerimeter = Math.ceil(Math.sqrt(windowDoorArea) * 4 * 3); // rough estimate for multiple openings
        const tapeFeet = horizontalSeams + windowPerimeter;
        const tapeRolls = Math.ceil(tapeFeet / 165);

        const details: { label: string; value: string }[] = [
          { label: "Gross Wall Area", value: `${formatNumber(grossArea)} sq ft` },
          { label: "Net Wall Area", value: `${formatNumber(netArea)} sq ft` },
          { label: "Area with Overlap (12%)", value: `${formatNumber(adjustedArea, 0)} sq ft` },
          { label: "Roll Size", value: `${rollLabel} (${formatNumber(sqFtPerRoll)} sq ft)` },
          { label: "Rolls Needed", value: formatNumber(rollsNeeded) },
          { label: "Cap Nails", value: `${formatNumber(capNails)} (~${formatNumber(capNailBoxes)} boxes)` },
          { label: "Seam Tape Rolls (165')", value: formatNumber(tapeRolls) },
        ];

        if (costPerRoll) {
          const wrapCost = rollsNeeded * costPerRoll;
          const tapeCost = tapeRolls * 15;
          const nailCost = capNailBoxes * 25;
          const totalCost = wrapCost + tapeCost + nailCost;
          details.push({ label: "House Wrap Cost", value: `$${formatNumber(wrapCost, 2)}` });
          details.push({ label: "Tape & Nails", value: `$${formatNumber(tapeCost + nailCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "House Wrap Rolls", value: `${formatNumber(rollsNeeded)} rolls` },
          details,
          note: "House wrap is applied over the entire wall area including window and door openings (cut out afterward). Includes 12% for overlaps. All seams and penetrations must be taped for air/water tightness.",
        };
      },
    },
  ],
  relatedSlugs: ["vapor-barrier-calc-calculator", "siding-calculator", "insulation-calculator"],
  faq: [
    { question: "How much house wrap do I need?", answer: "Measure the perimeter of the building and multiply by wall height. Add 12% for overlaps at horizontal and vertical seams. House wrap goes over window/door openings and is cut out later." },
    { question: "Does house wrap go over or under windows?", answer: "House wrap is applied over the entire wall surface. Windows and doors are cut out after installation using a reverse-Y or I-cut method, with flaps tucked into the rough opening and taped." },
    { question: "How do I overlap house wrap?", answer: "Overlap horizontal seams by at least 6 inches, with upper layers overlapping lower layers (like shingles). Vertical seams should overlap 6-12 inches. Tape all seams with manufacturer-approved tape." },
  ],
  formula: "Rolls = (Perimeter x Wall Height x 1.12 overlap factor) / Roll Coverage (sq ft)",
};
