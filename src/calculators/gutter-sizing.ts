import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gutterSizingCalculator: CalculatorDefinition = {
  slug: "gutter-sizing-calculator",
  title: "Gutter & Downspout Calculator",
  description: "Free gutter and downspout calculator. Estimate linear feet of gutters, number of downspouts, hangers, corners, and end caps for your roof drainage system.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["gutter calculator", "downspout calculator", "gutter sizing calculator", "how many downspouts do I need", "gutter material calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Gutter & Downspout Materials",
      description: "Estimate gutters, downspouts, and accessories",
      fields: [
        { name: "roofLength", label: "Total Gutter Run (feet)", type: "number", placeholder: "e.g. 120" },
        { name: "roofWidth", label: "Roof Width / Rafter Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "gutterSize", label: "Gutter Size", type: "select", options: [{ label: "5\" K-Style (standard residential)", value: "5" }, { label: "6\" K-Style (large roof)", value: "6" }, { label: "6\" Half-Round", value: "6hr" }], defaultValue: "5" },
        { name: "stories", label: "Building Height", type: "select", options: [{ label: "1 Story (10 ft)", value: "1" }, { label: "2 Stories (20 ft)", value: "2" }, { label: "3 Stories (30 ft)", value: "3" }], defaultValue: "1" },
        { name: "corners", label: "Number of Corners", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "costPerFt", label: "Cost per Linear Foot (optional)", type: "number", placeholder: "e.g. 8", prefix: "$" },
      ],
      calculate: (inputs) => {
        const roofLength = inputs.roofLength as number;
        const roofWidth = (inputs.roofWidth as number) || 20;
        const gutterSize = (inputs.gutterSize as string) || "5";
        const stories = parseInt((inputs.stories as string) || "1");
        const corners = (inputs.corners as number) || 4;
        const costPerFt = inputs.costPerFt as number;
        if (!roofLength) return null;

        const gutterLinearFt = roofLength;

        // Drainage area per downspout: 5" gutters handle ~600 sq ft, 6" handle ~800 sq ft
        const drainagePerDownspout = gutterSize === "5" ? 600 : 800;
        const roofDrainageArea = roofLength * roofWidth;
        const downspoutsNeeded = Math.max(2, Math.ceil(roofDrainageArea / drainagePerDownspout));

        // Downspout length per downspout
        const downspoutHeight = stories * 10;
        const downspoutExtension = 4; // ground extension
        const downspoutLengthEach = downspoutHeight + downspoutExtension;
        const totalDownspoutFt = downspoutsNeeded * downspoutLengthEach;

        // Gutter hangers: every 3 feet
        const hangers = Math.ceil(gutterLinearFt / 3);

        // Downspout brackets: every 6 feet
        const downspoutBrackets = Math.ceil(totalDownspoutFt / 6);

        // End caps: 2 per run end (each gutter run has 2 ends minus outlets)
        const endCaps = Math.max(2, (corners > 0 ? 0 : 2));

        // Outlets (drop outlets): one per downspout
        const outlets = downspoutsNeeded;

        // Elbows: 3 per downspout (top A, top B, bottom)
        const elbows = downspoutsNeeded * 3;

        // Gutter sealant tubes
        const sealantTubes = Math.ceil(gutterLinearFt / 40);

        const details: { label: string; value: string }[] = [
          { label: "Gutter Linear Feet", value: `${formatNumber(gutterLinearFt)} ft` },
          { label: "Gutter Size", value: gutterSize === "6hr" ? "6\" Half-Round" : `${gutterSize}\" K-Style` },
          { label: "Roof Drainage Area", value: `${formatNumber(roofDrainageArea)} sq ft` },
          { label: "Downspouts Needed", value: formatNumber(downspoutsNeeded) },
          { label: "Total Downspout Length", value: `${formatNumber(totalDownspoutFt)} ft` },
          { label: "Gutter Hangers", value: formatNumber(hangers) },
          { label: "Downspout Brackets", value: formatNumber(downspoutBrackets) },
          { label: "Inside/Outside Corners", value: formatNumber(corners) },
          { label: "Drop Outlets", value: formatNumber(outlets) },
          { label: "Elbows", value: formatNumber(elbows) },
          { label: "End Caps", value: formatNumber(endCaps) },
          { label: "Sealant Tubes", value: formatNumber(sealantTubes) },
        ];

        if (costPerFt) {
          const gutterCost = gutterLinearFt * costPerFt;
          const downspoutCost = totalDownspoutFt * (costPerFt * 0.6);
          const accessoryCost = corners * 12 + outlets * 8 + elbows * 6 + hangers * 1.5 + endCaps * 4;
          const totalCost = gutterCost + downspoutCost + accessoryCost;
          details.push({ label: "Gutter Cost", value: `$${formatNumber(gutterCost, 2)}` });
          details.push({ label: "Downspout Cost", value: `$${formatNumber(downspoutCost, 2)}` });
          details.push({ label: "Accessories", value: `$${formatNumber(accessoryCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Gutter System", value: `${formatNumber(gutterLinearFt)} ft gutter + ${formatNumber(downspoutsNeeded)} downspouts` },
          details,
          note: "5\" K-style gutters handle up to 600 sq ft of roof drainage area per downspout. 6\" gutters handle up to 800 sq ft. Place downspouts at building corners when possible. Slope gutters 1/4\" per 10 feet toward downspouts.",
        };
      },
    },
  ],
  relatedSlugs: ["roofing-calculator", "french-drain-calc-calculator", "metal-panel-calculator"],
  faq: [
    { question: "How many downspouts do I need?", answer: "One downspout per 600 square feet of roof drainage area for 5\" gutters, or per 800 sq ft for 6\" gutters. Place them at building corners and never more than 40 feet apart along a gutter run." },
    { question: "What size gutters do I need?", answer: "5-inch K-style gutters are standard for most residential homes. Use 6-inch gutters for roofs with a steep pitch, large surface area, or in areas with heavy rainfall. Half-round gutters are used for historic or upscale homes." },
    { question: "How much slope should gutters have?", answer: "Gutters should slope 1/4 inch per 10 feet toward the downspout. For a 40-foot gutter run, one end should be 1 inch lower than the other." },
  ],
  formula: "Downspouts = Roof Drainage Area (sq ft) / Drainage Capacity per Downspout (sq ft)",
};
