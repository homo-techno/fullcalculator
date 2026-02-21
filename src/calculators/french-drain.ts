import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frenchDrainCalculator: CalculatorDefinition = {
  slug: "french-drain-calculator",
  title: "French Drain Calculator",
  description: "Free French drain calculator. Calculate trench dimensions, gravel, pipe, and fabric needed for interior and exterior French drain systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["french drain calculator", "french drain cost", "drain gravel calculator", "drainage pipe calculator", "french drain materials"],
  variants: [
    {
      id: "french-drain-materials",
      name: "French Drain Materials",
      description: "Calculate materials needed for a French drain installation",
      fields: [
        { name: "length", label: "Drain Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "trenchWidth", label: "Trench Width (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "trenchDepth", label: "Trench Depth (inches)", type: "number", placeholder: "e.g. 18", defaultValue: 18 },
        { name: "drainType", label: "Drain Type", type: "select", options: [
          { label: "Exterior / Yard (perforated pipe + gravel)", value: "exterior" },
          { label: "Interior / Basement (under slab)", value: "interior" },
          { label: "Foundation Perimeter (footing drain)", value: "foundation" },
        ], defaultValue: "exterior" },
        { name: "pipeSize", label: "Drain Pipe Size", type: "select", options: [
          { label: "4\" Perforated PVC", value: "4" },
          { label: "6\" Perforated PVC", value: "6" },
          { label: "4\" Corrugated Flex", value: "4f" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const trenchWidth = (inputs.trenchWidth as number) || 12;
        const trenchDepth = (inputs.trenchDepth as number) || 18;
        const drainType = inputs.drainType as string;
        if (!length) return null;

        const trenchWidthFt = trenchWidth / 12;
        const trenchDepthFt = trenchDepth / 12;

        // Gravel fills trench minus pipe volume
        const trenchVolumeCuFt = length * trenchWidthFt * trenchDepthFt;
        const pipeVolumeCuFt = length * Math.PI * Math.pow(2 / 12, 2); // 4" pipe radius = 2"
        const gravelCuFt = trenchVolumeCuFt - pipeVolumeCuFt;
        const gravelCuYd = gravelCuFt / 27;
        const gravelTons = gravelCuYd * 1.35; // Crushed stone ~2700 lbs/cu yd

        // Landscape fabric: wraps trench (2 sides + bottom + overlap)
        const fabricWidthNeeded = trenchWidthFt + 2 * trenchDepthFt + 1; // +1 ft overlap
        const fabricSqFt = fabricWidthNeeded * length;
        const fabricRolls = Math.ceil(fabricSqFt / (3 * 100)); // 3' × 100' rolls

        // Pipe length
        const pipeLength = length + 5; // +5 for outlet and connections
        const pipeSections = Math.ceil(pipeLength / 10); // 10-ft sections

        // Fittings
        const elbows = drainType === "foundation" ? 4 : 1;
        const couplings = Math.max(pipeSections - 1, 0);

        return {
          primary: { label: "Gravel Needed", value: `${formatNumber(gravelCuYd, 2)} cubic yards` },
          details: [
            { label: "Trench volume", value: `${formatNumber(trenchVolumeCuFt, 1)} cu ft` },
            { label: "Gravel (crushed stone)", value: `${formatNumber(gravelCuYd, 2)} cu yd (${formatNumber(gravelTons, 2)} tons)` },
            { label: "Drain pipe", value: `${formatNumber(pipeLength, 0)} ft (${pipeSections} sections)` },
            { label: "Landscape fabric", value: `${formatNumber(fabricSqFt, 0)} sq ft (${fabricRolls} rolls)` },
            { label: "Pipe couplings", value: `${couplings}` },
            { label: "Elbows", value: `${elbows}` },
            { label: "Trench dimensions", value: `${trenchWidth}" wide × ${trenchDepth}" deep × ${length} ft long` },
          ],
          note: "Use washed crushed stone (#57 or #2 stone) - NOT pea gravel. Wrap gravel in landscape fabric to prevent soil infiltration. Slope pipe 1% minimum (1/8\" per foot) toward outlet.",
        };
      },
    },
    {
      id: "french-drain-cost",
      name: "French Drain Cost Estimate",
      description: "Estimate the total cost of a French drain project",
      fields: [
        { name: "length", label: "Drain Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "location", label: "Installation Location", type: "select", options: [
          { label: "Yard / Exterior ($10-$30/ft)", value: "exterior" },
          { label: "Interior Basement ($40-$85/ft)", value: "interior" },
          { label: "Foundation Perimeter ($30-$60/ft)", value: "foundation" },
        ], defaultValue: "exterior" },
        { name: "installation", label: "Installation Method", type: "select", options: [
          { label: "DIY (materials only)", value: "diy" },
          { label: "Professional Installation", value: "pro" },
        ], defaultValue: "diy" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const location = inputs.location as string;
        const installation = inputs.installation as string;
        if (!length) return null;

        let materialCostPerFt: number;
        let laborCostPerFt: number;

        switch (location) {
          case "exterior":
            materialCostPerFt = 8;
            laborCostPerFt = 15;
            break;
          case "interior":
            materialCostPerFt = 12;
            laborCostPerFt = 55;
            break;
          case "foundation":
            materialCostPerFt = 10;
            laborCostPerFt = 35;
            break;
          default:
            materialCostPerFt = 8;
            laborCostPerFt = 15;
        }

        const materialCost = length * materialCostPerFt;
        const laborCost = installation === "pro" ? length * laborCostPerFt : 0;

        // Sump pump (interior often needs one)
        const sumpPumpCost = location === "interior" ? 500 : 0;

        // Permit
        const permitCost = installation === "pro" ? 200 : 0;

        const totalCost = materialCost + laborCost + sumpPumpCost + permitCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Materials", value: `$${formatNumber(materialCost, 0)}` },
            { label: "Labor", value: installation === "pro" ? `$${formatNumber(laborCost, 0)}` : "DIY" },
            { label: "Sump pump (if needed)", value: sumpPumpCost > 0 ? `$${formatNumber(sumpPumpCost, 0)}` : "Not needed" },
            { label: "Permit (estimated)", value: permitCost > 0 ? `$${formatNumber(permitCost, 0)}` : "N/A" },
            { label: "Cost per linear foot", value: `$${formatNumber(totalCost / length, 2)}` },
          ],
          note: "Interior French drains are the most expensive due to concrete removal and sump pump requirements. Exterior drains are typically DIY-friendly. Call 811 before digging to locate underground utilities.",
        };
      },
    },
  ],
  relatedSlugs: ["gravel-calculator", "concrete-calculator", "foundation-calculator"],
  faq: [
    { question: "How deep should a French drain be?", answer: "Exterior/yard drains: 12-24 inches deep. Foundation perimeter drains: as deep as the footing (typically 24-36 inches). Interior basement drains: cut into the slab edge, typically 12-18 inches below the slab. Always slope at least 1% (1/8\" per foot) toward the outlet." },
    { question: "What gravel is best for a French drain?", answer: "Use washed crushed stone #57 (3/4\"-1\") or #2 (2.5\"-4\") stone. Never use round pea gravel (it shifts and compacts). Never use limestone (it can cement together). River rock works but is more expensive. The gravel must be clean and washed to prevent fine sediment from clogging the pipe." },
  ],
  formula: "Gravel = (Length × Width × Depth) / 27 cu yd | Fabric = (Width + 2×Depth + 1') × Length | Slope = 1/8\" per foot minimum",
};
