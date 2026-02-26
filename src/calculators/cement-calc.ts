import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cementCalculator: CalculatorDefinition = {
  slug: "cement-calculator",
  title: "Cement / Sand / Aggregate Mix Calculator",
  description:
    "Calculate the quantities of cement, sand, and aggregate needed for a concrete mix. Supports standard ratios for different applications.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "cement calculator",
    "concrete mix ratio",
    "cement sand aggregate",
    "how much cement",
    "concrete mix design",
  ],
  variants: [
    {
      id: "by-volume",
      name: "Mix by Concrete Volume",
      description: "Calculate cement, sand, and aggregate from target concrete volume",
      fields: [
        {
          name: "cubicYards",
          label: "Concrete Volume (cubic yards)",
          type: "number",
          placeholder: "e.g. 2",
        },
        {
          name: "mixRatio",
          label: "Mix Ratio (Cement:Sand:Aggregate)",
          type: "select",
          options: [
            { label: "1:2:3 (Standard - 3000 psi)", value: "1:2:3" },
            { label: "1:2:4 (General purpose)", value: "1:2:4" },
            { label: "1:1.5:3 (Strong - 4000 psi)", value: "1:1.5:3" },
            { label: "1:3:6 (Lean mix - foundations)", value: "1:3:6" },
            { label: "1:3:0 (Mortar mix)", value: "1:3:0" },
          ],
          defaultValue: "1:2:3",
        },
      ],
      calculate: (inputs) => {
        const cubicYards = parseFloat(inputs.cubicYards as string);
        const mixRatio = inputs.mixRatio as string;
        if (!cubicYards || !mixRatio) return null;

        const parts = mixRatio.split(":").map(Number);
        const cementParts = parts[0];
        const sandParts = parts[1];
        const aggParts = parts[2];
        const totalParts = cementParts + sandParts + aggParts;

        const totalCuFt = cubicYards * 27;
        // Dry volume is ~1.54x wet volume (compaction/bulking factor)
        const dryVolume = totalCuFt * 1.54;

        const cementCuFt = (cementParts / totalParts) * dryVolume;
        const sandCuFt = (sandParts / totalParts) * dryVolume;
        const aggCuFt = (aggParts / totalParts) * dryVolume;

        // 1 bag of cement (94 lbs) = 1 cubic foot
        const cementBags = Math.ceil(cementCuFt);
        const cementWeight = cementBags * 94;

        // Sand: ~100 lbs per cu ft, Aggregate: ~100 lbs per cu ft
        const sandLbs = sandCuFt * 100;
        const aggLbs = aggCuFt * 100;

        // Water: approximately 0.45-0.5 water/cement ratio by weight
        const waterGallons = (cementWeight * 0.45) / 8.34;

        return {
          primary: {
            label: "Cement Bags (94-lb)",
            value: `${formatNumber(cementBags)} bags`,
          },
          details: [
            { label: "Concrete volume", value: `${formatNumber(cubicYards, 2)} cu yd (${formatNumber(totalCuFt, 1)} cu ft)` },
            { label: "Mix ratio", value: mixRatio },
            { label: "Cement", value: `${formatNumber(cementCuFt, 1)} cu ft (${formatNumber(cementBags)} bags, ${formatNumber(cementWeight)} lbs)` },
            { label: "Sand", value: `${formatNumber(sandCuFt, 1)} cu ft (${formatNumber(sandLbs)} lbs)` },
            { label: "Aggregate", value: `${formatNumber(aggCuFt, 1)} cu ft (${formatNumber(aggLbs)} lbs)` },
            { label: "Water (approx)", value: `${formatNumber(waterGallons, 1)} gallons` },
          ],
          note: "Dry volume is 1.54x wet volume due to air voids. One bag of Portland cement = 94 lbs = ~1 cu ft. Water-cement ratio of 0.45 used. Adjust water for workability.",
        };
      },
    },
    {
      id: "by-area",
      name: "Mix by Slab Dimensions",
      description: "Calculate mix materials from slab length, width, and thickness",
      fields: [
        {
          name: "length",
          label: "Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Width (feet)",
          type: "number",
          placeholder: "e.g. 10",
        },
        {
          name: "thickness",
          label: "Thickness (inches)",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 4,
        },
        {
          name: "mixRatio",
          label: "Mix Ratio",
          type: "select",
          options: [
            { label: "1:2:3 (Standard - 3000 psi)", value: "1:2:3" },
            { label: "1:2:4 (General purpose)", value: "1:2:4" },
            { label: "1:1.5:3 (Strong - 4000 psi)", value: "1:1.5:3" },
          ],
          defaultValue: "1:2:3",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const thickness = parseFloat(inputs.thickness as string);
        const mixRatio = inputs.mixRatio as string;
        if (!length || !width || !thickness || !mixRatio) return null;

        const cubicFeet = length * width * (thickness / 12);
        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.1;

        const parts = mixRatio.split(":").map(Number);
        const totalParts = parts[0] + parts[1] + parts[2];
        const dryVolume = cubicYardsWithWaste * 27 * 1.54;

        const cementCuFt = (parts[0] / totalParts) * dryVolume;
        const sandCuFt = (parts[1] / totalParts) * dryVolume;
        const aggCuFt = (parts[2] / totalParts) * dryVolume;
        const cementBags = Math.ceil(cementCuFt);

        return {
          primary: {
            label: "Cement Bags Needed",
            value: `${formatNumber(cementBags)} bags (94-lb)`,
          },
          details: [
            { label: "Slab area", value: `${formatNumber(length * width)} sq ft` },
            { label: "Concrete volume (with 10% waste)", value: `${formatNumber(cubicYardsWithWaste, 2)} cu yd` },
            { label: "Cement", value: `${formatNumber(cementBags)} bags (${formatNumber(cementBags * 94)} lbs)` },
            { label: "Sand", value: `${formatNumber(sandCuFt, 1)} cu ft (${formatNumber(sandCuFt * 100 / 2000, 1)} tons)` },
            { label: "Aggregate", value: `${formatNumber(aggCuFt, 1)} cu ft (${formatNumber(aggCuFt * 100 / 2000, 1)} tons)` },
          ],
          note: "Includes 10% waste factor. For large pours (over 1 cubic yard), consider ordering ready-mix concrete instead of mixing on site.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "concrete-block-fill-calculator", "concrete-patio-calculator"],
  faq: [
    {
      question: "What is the standard concrete mix ratio?",
      answer:
        "The most common mix ratio is 1:2:3 (1 part cement, 2 parts sand, 3 parts aggregate) which produces approximately 3,000 PSI concrete. For stronger concrete (4,000 PSI), use 1:1.5:3. For general foundations, 1:2:4 is adequate.",
    },
    {
      question: "How many bags of cement do I need per cubic yard?",
      answer:
        "For a standard 1:2:3 mix, you need approximately 7 bags (94-lb) of Portland cement per cubic yard of concrete. For a stronger 1:1.5:3 mix, you need about 8-9 bags. Pre-mixed bags (like Quikrete) contain all ingredients already blended.",
    },
    {
      question: "What is the water-to-cement ratio?",
      answer:
        "The water-to-cement ratio by weight should be 0.40-0.50 for most applications. A ratio of 0.45 is common for a good balance of workability and strength. Less water makes stronger concrete but is harder to work with. Never exceed 0.60.",
    },
  ],
  formula:
    "Dry Volume = Wet Volume x 1.54 | Cement = (C / Total Parts) x Dry Volume | Sand = (S / Total Parts) x Dry Volume | Aggregate = (A / Total Parts) x Dry Volume",
};
