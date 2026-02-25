import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const landscapeFabricCalcCalculator: CalculatorDefinition = {
  slug: "landscape-fabric-calc-calculator",
  title: "Landscape Fabric Calculator",
  description: "Free landscape fabric calculator. Estimate how many rolls of weed barrier fabric, staples, and overlap material you need for your landscaping project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["landscape fabric calculator", "weed barrier calculator", "weed fabric calculator", "how much landscape fabric do I need", "ground cover fabric calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Landscape Fabric Needed",
      description: "Estimate fabric rolls, staples, and seam tape",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "width", label: "Area Width (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "rollWidth", label: "Roll Width (feet)", type: "select", options: [{ label: "3 feet", value: "3" }, { label: "4 feet", value: "4" }, { label: "6 feet", value: "6" }], defaultValue: "4" },
        { name: "rollLength", label: "Roll Length (feet)", type: "select", options: [{ label: "50 feet", value: "50" }, { label: "100 feet", value: "100" }, { label: "250 feet", value: "250" }], defaultValue: "100" },
        { name: "costPerRoll", label: "Cost per Roll (optional)", type: "number", placeholder: "e.g. 25", prefix: "$" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const rollWidth = parseFloat((inputs.rollWidth as string) || "4");
        const rollLength = parseFloat((inputs.rollLength as string) || "100");
        const costPerRoll = inputs.costPerRoll as number;
        if (!length || !width) return null;

        const areaSqFt = length * width;

        // Account for 6-inch overlap between strips
        const overlapFt = 0.5;
        const effectiveRollWidth = rollWidth - overlapFt;
        const stripsNeeded = Math.ceil(width / effectiveRollWidth);
        const fabricLengthPerStrip = length;
        const totalFabricLength = stripsNeeded * fabricLengthPerStrip;
        const rollsNeeded = Math.ceil(totalFabricLength / rollLength);

        // Staples: 1 per every 3 feet along edges and seams, plus 1 per 10 sq ft interior
        const perimeterFt = 2 * (length + width);
        const seamLength = (stripsNeeded - 1) * length;
        const edgeStaples = Math.ceil((perimeterFt + seamLength) / 3);
        const interiorStaples = Math.ceil(areaSqFt / 10);
        const totalStaples = edgeStaples + interiorStaples;

        // Seam tape: enough for all overlaps
        const seamTapeFt = seamLength;

        const details: { label: string; value: string }[] = [
          { label: "Total Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Strips Needed", value: formatNumber(stripsNeeded) },
          { label: "Total Fabric Length", value: `${formatNumber(totalFabricLength)} linear feet` },
          { label: "Rolls Needed", value: `${formatNumber(rollsNeeded)} (${rollWidth}' x ${rollLength}')` },
          { label: "Fabric Staples", value: formatNumber(totalStaples) },
          { label: "Seam Tape Needed", value: `${formatNumber(seamTapeFt)} feet` },
          { label: "Overlap per Seam", value: "6 inches" },
        ];

        if (costPerRoll) {
          const fabricCost = rollsNeeded * costPerRoll;
          const stapleCost = Math.ceil(totalStaples / 75) * 8;
          const tapeCost = Math.ceil(seamTapeFt / 100) * 12;
          const totalCost = fabricCost + stapleCost + tapeCost;
          details.push({ label: "Fabric Cost", value: `$${formatNumber(fabricCost, 2)}` });
          details.push({ label: "Staples & Tape Cost", value: `$${formatNumber(stapleCost + tapeCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
        }

        return {
          primary: { label: "Landscape Fabric Rolls", value: `${formatNumber(rollsNeeded)} rolls` },
          details,
          note: "Calculations include 6-inch overlap between adjacent strips. Staple count based on every 3 feet along edges/seams plus every 10 sq ft in the interior. Use UV-resistant fabric for best longevity.",
        };
      },
    },
  ],
  relatedSlugs: ["mulch-calculator", "gravel-calculator", "landscape-stone-calculator"],
  faq: [
    { question: "How much landscape fabric overlap do I need?", answer: "Overlap landscape fabric strips by at least 6 inches (12 inches for slopes). Secure overlaps with fabric staples every 3 feet and use seam tape for a stronger bond." },
    { question: "How many staples do I need for landscape fabric?", answer: "Use staples every 3 feet along edges and seams, plus 1 staple per 10 square feet in the interior. A 500 sq ft area typically needs 80-120 staples." },
    { question: "How long does landscape fabric last?", answer: "High-quality woven landscape fabric lasts 10-15 years. Non-woven fabric typically lasts 3-5 years. UV exposure, foot traffic, and fabric weight all affect lifespan." },
  ],
  formula: "Rolls = (Strips x Area Length) / Roll Length, where Strips = Area Width / (Roll Width - 0.5 ft overlap)",
};
