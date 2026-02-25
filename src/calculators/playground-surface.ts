import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const playgroundSurfaceCalculator: CalculatorDefinition = {
  slug: "playground-surface-calculator",
  title: "Playground Mulch Calculator",
  description: "Free playground mulch calculator. Estimate how much safety mulch, rubber mulch, or engineered wood fiber you need for playground fall zones and safety surfacing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["playground mulch calculator", "playground surface calculator", "safety mulch calculator", "rubber mulch calculator", "playground fall zone calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Playground Mulch",
      description: "Estimate safety surfacing for playground areas",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "fallHeight", label: "Maximum Equipment Height (feet)", type: "number", placeholder: "e.g. 7", defaultValue: 7 },
        { name: "mulchType", label: "Mulch Type", type: "select", options: [{ label: "Engineered Wood Fiber (EWF)", value: "ewf" }, { label: "Rubber Mulch (recycled tire)", value: "rubber" }, { label: "Pea Gravel", value: "gravel" }, { label: "Wood Chips", value: "chips" }], defaultValue: "ewf" },
        { name: "costPerUnit", label: "Cost per Cubic Yard (optional)", type: "number", placeholder: "e.g. 40", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const fallHeight = (inputs.fallHeight as number) || 7;
        const mulchType = (inputs.mulchType as string) || "ewf";
        const costPerUnit = inputs.costPerUnit as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        // Required depth based on fall height (CPSC/ASTM standards)
        // EWF: 9" for up to 7 ft, 12" for up to 10 ft
        // Rubber: 6" for up to 7 ft, 9" for up to 10 ft
        // Pea Gravel: 9" for up to 5 ft, 12" for up to 7 ft
        // Wood Chips: 9" for up to 7 ft, 12" for up to 10 ft
        let depthInches = 9;
        let depthLabel = "";

        if (mulchType === "ewf") {
          depthInches = fallHeight <= 7 ? 9 : 12;
          depthLabel = "Engineered Wood Fiber";
        } else if (mulchType === "rubber") {
          depthInches = fallHeight <= 7 ? 6 : 9;
          depthLabel = "Rubber Mulch";
        } else if (mulchType === "gravel") {
          depthInches = fallHeight <= 5 ? 9 : 12;
          depthLabel = "Pea Gravel";
        } else {
          depthInches = fallHeight <= 7 ? 9 : 12;
          depthLabel = "Wood Chips";
        }

        const cubicFeet = areaSqFt * (depthInches / 12);
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithSettling = cubicYards * 1.20; // 20% extra for settling

        // Weight estimates
        let weightPerCuYd = 0;
        if (mulchType === "ewf") weightPerCuYd = 600;
        else if (mulchType === "rubber") weightPerCuYd = 1200;
        else if (mulchType === "gravel") weightPerCuYd = 2800;
        else weightPerCuYd = 500;

        const totalWeightLbs = cubicYardsWithSettling * weightPerCuYd;
        const tons = totalWeightLbs / 2000;

        // Use zone extension: 6 feet beyond equipment in all directions
        const useZoneNote = `Fall zone should extend at least 6 feet beyond equipment in all directions`;

        const details: { label: string; value: string }[] = [
          { label: "Playground Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Equipment Height", value: `${fallHeight} feet` },
          { label: "Mulch Type", value: depthLabel },
          { label: "Required Depth", value: `${depthInches} inches` },
          { label: "Volume (exact)", value: `${formatNumber(cubicYards, 2)} cubic yards` },
          { label: "Volume with 20% for Settling", value: `${formatNumber(cubicYardsWithSettling, 2)} cubic yards` },
          { label: "Total Weight", value: `${formatNumber(totalWeightLbs, 0)} lbs (${formatNumber(tons, 2)} tons)` },
          { label: "Fall Zone", value: useZoneNote },
        ];

        if (costPerUnit) {
          const totalCost = cubicYardsWithSettling * costPerUnit;
          details.push({ label: "Material Cost", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Playground Mulch Needed", value: `${formatNumber(cubicYardsWithSettling, 2)} cubic yards` },
          details,
          note: "Depths based on CPSC (Consumer Product Safety Commission) and ASTM F1292 standards. Includes 20% extra for settling and compaction. Regularly top off material as it compacts over time.",
        };
      },
    },
  ],
  relatedSlugs: ["mulch-calculator", "pea-gravel-calc-calculator", "synthetic-turf-calculator"],
  faq: [
    { question: "How deep should playground mulch be?", answer: "For equipment up to 7 feet: EWF and wood chips need 9 inches, rubber mulch needs 6 inches, pea gravel needs 12 inches. For 7-10 foot equipment: increase all depths by 3 inches. These meet CPSC safety standards." },
    { question: "What is the best playground surface material?", answer: "Engineered Wood Fiber (EWF) is the most popular due to cost-effectiveness and ADA accessibility. Rubber mulch is longer-lasting but more expensive. Pea gravel is affordable but not ADA-compliant." },
    { question: "How big should a playground fall zone be?", answer: "The use zone (fall zone) must extend at least 6 feet in all directions beyond the equipment. For swings, extend it even further: the fall zone extends to twice the pivot height in front and behind the swing." },
  ],
  formula: "Cubic Yards = Area (sq ft) x Required Depth (in) / 12 / 27 x 1.20 settling factor",
};
