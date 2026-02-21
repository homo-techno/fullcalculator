import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const paverBaseCalculator: CalculatorDefinition = {
  slug: "paver-base-calculator",
  title: "Paver Base Material Calculator",
  description: "Free paver base calculator. Calculate gravel base, sand bedding, and edging materials needed for paver patios, walkways, and driveways.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["paver base calculator", "paver base material", "paver sand calculator", "gravel base for pavers", "paver installation materials"],
  variants: [
    {
      id: "paver-base-materials",
      name: "Paver Base & Sand",
      description: "Calculate base materials for paver installation",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 15" },
        { name: "projectType", label: "Project Type", type: "select", options: [
          { label: "Patio (4\" base)", value: "4" },
          { label: "Walkway (4\" base)", value: "4" },
          { label: "Driveway (8\" base)", value: "8" },
          { label: "Pool Deck (6\" base)", value: "6" },
          { label: "Heavy Traffic (12\" base)", value: "12" },
        ], defaultValue: "4" },
        { name: "sandBedding", label: "Sand Bedding Depth", type: "select", options: [
          { label: "1 inch (Standard)", value: "1" },
          { label: "1.5 inches (Recommended)", value: "1.5" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const baseDepthIn = parseInt(inputs.projectType as string) || 4;
        const sandDepthIn = parseFloat(inputs.sandBedding as string) || 1;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        // Extend base 6" beyond paver area on all sides
        const baseLength = length + 1;
        const baseWidth = width + 1;
        const baseAreaSqFt = baseLength * baseWidth;

        // Gravel base
        const gravelCuFt = baseAreaSqFt * (baseDepthIn / 12);
        const gravelCuYd = gravelCuFt / 27;
        const gravelTons = gravelCuYd * 1.35;

        // Sand bedding
        const sandCuFt = areaSqFt * (sandDepthIn / 12);
        const sandCuYd = sandCuFt / 27;
        const sandTons = sandCuYd * 1.35;

        // Polymeric sand for joints (approximately 1 bag per 25-50 sq ft depending on joint width)
        const polymerSandBags = Math.ceil(areaSqFt / 35);

        // Edge restraint
        const perimeter = 2 * (length + width);
        const edgeSections = Math.ceil(perimeter / 8); // 8-ft sections
        const edgeSpikes = Math.ceil(perimeter / 1); // 1 spike per foot

        // Geotextile fabric
        const fabricSqFt = baseAreaSqFt;
        const fabricRolls = Math.ceil(fabricSqFt / (3 * 50)); // 3' × 50' rolls

        return {
          primary: { label: "Gravel Base Needed", value: `${formatNumber(gravelCuYd, 2)} cubic yards` },
          details: [
            { label: "Gravel base (#57 or QP)", value: `${formatNumber(gravelCuYd, 2)} cu yd (${formatNumber(gravelTons, 2)} tons)` },
            { label: "Sand bedding (coarse/concrete sand)", value: `${formatNumber(sandCuYd, 2)} cu yd (${formatNumber(sandTons, 2)} tons)` },
            { label: "Polymeric sand (joints)", value: `${polymerSandBags} bags` },
            { label: "Edge restraint (8' sections)", value: `${edgeSections} sections` },
            { label: "Edge spikes (10\")", value: `${edgeSpikes}` },
            { label: "Geotextile fabric", value: `${fabricRolls} rolls (${formatNumber(fabricSqFt, 0)} sq ft)` },
            { label: "Base depth", value: `${baseDepthIn} inches` },
            { label: "Paver area", value: `${formatNumber(areaSqFt, 0)} sq ft` },
          ],
          note: "Use compactable gravel (crusher run / QP) for the base, NOT round pea gravel. Compact in 2\" lifts. Sand bedding should be screeded flat to 1\" before placing pavers. Apply polymeric sand after pavers are placed and compacted.",
        };
      },
    },
    {
      id: "paver-base-cost",
      name: "Paver Base Cost Estimate",
      description: "Estimate the cost of paver base materials",
      fields: [
        { name: "areaSqFt", label: "Paver Area (sq ft)", type: "number", placeholder: "e.g. 300" },
        { name: "baseDepth", label: "Base Depth (inches)", type: "select", options: [
          { label: "4\" (Patio/Walkway)", value: "4" },
          { label: "6\" (Pool Deck)", value: "6" },
          { label: "8\" (Driveway)", value: "8" },
          { label: "12\" (Heavy Traffic)", value: "12" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const areaSqFt = inputs.areaSqFt as number;
        const baseDepth = parseInt(inputs.baseDepth as string) || 4;
        if (!areaSqFt) return null;

        const gravelCuYd = (areaSqFt * (baseDepth / 12)) / 27;
        const sandCuYd = (areaSqFt * (1 / 12)) / 27;
        const perimeter = Math.sqrt(areaSqFt) * 4; // Approximate

        const gravelCost = gravelCuYd * 40;
        const sandCost = sandCuYd * 45;
        const polymerSandBags = Math.ceil(areaSqFt / 35);
        const polymerSandCost = polymerSandBags * 25;
        const edgeCost = Math.ceil(perimeter / 8) * 12;
        const spikeCost = Math.ceil(perimeter) * 0.5;
        const fabricCost = Math.ceil(areaSqFt / 150) * 30;

        const totalMaterialCost = gravelCost + sandCost + polymerSandCost + edgeCost + spikeCost + fabricCost;

        return {
          primary: { label: "Base Materials Cost", value: `$${formatNumber(totalMaterialCost, 0)}` },
          details: [
            { label: "Gravel / Crusher Run", value: `$${formatNumber(gravelCost, 0)} (${formatNumber(gravelCuYd, 2)} cu yd)` },
            { label: "Bedding sand", value: `$${formatNumber(sandCost, 0)} (${formatNumber(sandCuYd, 2)} cu yd)` },
            { label: "Polymeric sand", value: `$${formatNumber(polymerSandCost, 0)} (${polymerSandBags} bags)` },
            { label: "Edge restraint", value: `$${formatNumber(edgeCost, 0)}` },
            { label: "Spikes", value: `$${formatNumber(spikeCost, 0)}` },
            { label: "Geotextile fabric", value: `$${formatNumber(fabricCost, 0)}` },
            { label: "Cost per sq ft (base only)", value: `$${formatNumber(totalMaterialCost / areaSqFt, 2)}` },
          ],
          note: "Prices based on average bulk delivery rates. Pick-up pricing may differ. These costs are for base materials only - pavers are additional. Delivery fees vary by supplier distance.",
        };
      },
    },
  ],
  relatedSlugs: ["patio-paver-calculator", "gravel-calculator", "driveway-calculator"],
  faq: [
    { question: "How deep should a paver base be?", answer: "Patios and walkways: 4-6 inches of compacted gravel. Driveways: 8-12 inches. All applications need 1\" of sand bedding on top of the gravel. In areas with poor drainage or freeze-thaw cycles, increase base depth by 2-4 inches." },
    { question: "What type of gravel for paver base?", answer: "Use compactable angular gravel: crusher run (QP/quarry process), #57 stone (3/4\"), or road base material. Start with larger stone at the bottom and finer material on top. Do NOT use round pea gravel or river rock - they don't compact and pavers will shift." },
  ],
  formula: "Gravel (cu yd) = Area × Base Depth / 12 / 27 | Sand (cu yd) = Area × 1\" / 12 / 27 | Edge Sections = Perimeter / 8",
};
