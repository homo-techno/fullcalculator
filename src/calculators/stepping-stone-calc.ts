import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const steppingStoneCalcCalculator: CalculatorDefinition = {
  slug: "stepping-stone-calc-calculator",
  title: "Stepping Stone Calculator",
  description: "Free stepping stone calculator. Estimate how many stepping stones, sand, and gravel you need for a garden path or walkway.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stepping stone calculator", "garden path calculator", "how many stepping stones", "walkway stone calculator", "stepping stone path calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Stepping Stone Path",
      description: "Estimate stepping stones and base materials for a path",
      fields: [
        { name: "pathLength", label: "Path Length (feet)", type: "number", placeholder: "e.g. 25" },
        { name: "stoneSize", label: "Stone Size", type: "select", options: [{ label: "12\" round", value: "12" }, { label: "16\" round", value: "16" }, { label: "18\" round", value: "18" }, { label: "24\" square", value: "24" }], defaultValue: "16" },
        { name: "spacing", label: "Center-to-Center Spacing (inches)", type: "number", placeholder: "e.g. 24", defaultValue: 24 },
        { name: "rows", label: "Rows (1 for single file, 2 for side-by-side)", type: "select", options: [{ label: "1 row (single file)", value: "1" }, { label: "2 rows (side by side)", value: "2" }], defaultValue: "1" },
        { name: "costPerStone", label: "Cost per Stone (optional)", type: "number", placeholder: "e.g. 5", prefix: "$" },
      ],
      calculate: (inputs) => {
        const pathLength = inputs.pathLength as number;
        const stoneSize = parseInt((inputs.stoneSize as string) || "16");
        const spacing = (inputs.spacing as number) || 24;
        const rows = parseInt((inputs.rows as string) || "1");
        const costPerStone = inputs.costPerStone as number;
        if (!pathLength) return null;

        const pathLengthIn = pathLength * 12;
        const stonesPerRow = Math.ceil(pathLengthIn / spacing) + 1;
        const totalStones = stonesPerRow * rows;
        const stonesWithExtra = totalStones + Math.ceil(totalStones * 0.05);

        // Sand for setting bed: 2" under each stone
        const stoneAreaSqIn = stoneSize <= 18 ? Math.PI * (stoneSize / 2) * (stoneSize / 2) : stoneSize * stoneSize;
        const sandPerStoneCuIn = stoneAreaSqIn * 2;
        const totalSandCuFt = (sandPerStoneCuIn * totalStones) / 1728;

        // Gravel for drainage under sand
        const gravelCuFt = totalSandCuFt * 2;

        const details: { label: string; value: string }[] = [
          { label: "Path Length", value: `${formatNumber(pathLength)} feet` },
          { label: "Stone Size", value: stoneSize <= 18 ? `${stoneSize}\" round` : `${stoneSize}\" square` },
          { label: "Spacing (center-to-center)", value: `${spacing} inches` },
          { label: "Rows", value: rows === 1 ? "Single file" : "Side by side" },
          { label: "Stones per Row", value: formatNumber(stonesPerRow) },
          { label: "Total Stones Needed", value: formatNumber(totalStones) },
          { label: "Recommended (with extras)", value: formatNumber(stonesWithExtra) },
          { label: "Sand for Setting Bed", value: `${formatNumber(totalSandCuFt, 1)} cu ft` },
          { label: "Gravel for Drainage", value: `${formatNumber(gravelCuFt, 1)} cu ft` },
        ];

        if (costPerStone) {
          const stoneCost = stonesWithExtra * costPerStone;
          details.push({ label: "Stone Cost", value: `$${formatNumber(stoneCost, 2)}` });
          details.push({ label: "Cost per linear foot", value: `$${formatNumber(stoneCost / pathLength, 2)}` });
        }

        return {
          primary: { label: "Stepping Stones Needed", value: `${formatNumber(stonesWithExtra)} stones` },
          details,
          note: "Spacing is measured center-to-center. For comfortable walking, space stones 22-26 inches apart (one stride). Set each stone on 2\" of sand over 4\" of gravel for stability and drainage.",
        };
      },
    },
  ],
  relatedSlugs: ["flagstone-patio-calculator", "patio-paver-calc-calculator", "gravel-calculator"],
  faq: [
    { question: "How far apart should stepping stones be?", answer: "Space stepping stones 22-26 inches apart, measured center to center, for a comfortable walking stride. Adjust slightly based on the primary user's step length." },
    { question: "How do I install stepping stones?", answer: "Place each stone, trace around it with a shovel, remove sod, dig 4 inches deep, add 2 inches of gravel, top with 2 inches of sand, and set the stone. The top should be level with the surrounding ground." },
    { question: "What size stepping stones should I use?", answer: "For comfortable walking, use at least 16-inch diameter stones. For side-by-side paths, 12-inch stones work well. Larger 18-24 inch stones create a more dramatic look and are easier to step on." },
  ],
  formula: "Stones = (Path Length in inches / Spacing + 1) x Number of Rows + 5% extra",
};
