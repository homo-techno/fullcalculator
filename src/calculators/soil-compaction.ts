import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilCompactionCalculator: CalculatorDefinition = {
  slug: "soil-compaction-calculator",
  title: "Soil Compaction Calculator",
  description: "Free soil compaction calculator. Calculate compaction percentage, required fill volume, and loose-to-compacted soil conversions for construction earthwork.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soil compaction calculator", "compaction test calculator", "proctor test calculator", "fill compaction calculator", "earthwork compaction"],
  variants: [
    {
      id: "compaction-percent",
      name: "Compaction Percentage",
      description: "Calculate compaction percentage from field density and Proctor test results",
      fields: [
        { name: "fieldDensity", label: "Field Dry Density (pcf)", type: "number", placeholder: "e.g. 115" },
        { name: "maxDensity", label: "Max Dry Density from Proctor (pcf)", type: "number", placeholder: "e.g. 125" },
        { name: "requiredCompaction", label: "Required Compaction (%)", type: "select", options: [
          { label: "90% - Landscape / non-structural", value: "90" },
          { label: "95% - Standard structural fill", value: "95" },
          { label: "98% - Roads / pavements", value: "98" },
          { label: "100% - Special applications", value: "100" },
        ], defaultValue: "95" },
      ],
      calculate: (inputs) => {
        const fieldDensity = inputs.fieldDensity as number;
        const maxDensity = inputs.maxDensity as number;
        const requiredCompaction = parseInt(inputs.requiredCompaction as string) || 95;
        if (!fieldDensity || !maxDensity) return null;

        const compactionPercent = (fieldDensity / maxDensity) * 100;
        const requiredDensity = maxDensity * (requiredCompaction / 100);
        const passes = compactionPercent >= requiredCompaction;

        return {
          primary: { label: "Compaction Achieved", value: `${formatNumber(compactionPercent, 1)}%` },
          details: [
            { label: "Field dry density", value: `${formatNumber(fieldDensity, 1)} pcf` },
            { label: "Max dry density (Proctor)", value: `${formatNumber(maxDensity, 1)} pcf` },
            { label: "Required compaction", value: `${requiredCompaction}%` },
            { label: "Required density", value: `${formatNumber(requiredDensity, 1)} pcf` },
            { label: "Passes specification", value: passes ? "Yes" : "No" },
            { label: "Density deficit", value: passes ? "None" : `${formatNumber(requiredDensity - fieldDensity, 1)} pcf` },
          ],
          note: passes
            ? "The soil meets the required compaction specification."
            : "The soil does NOT meet the required compaction. Additional compaction passes are needed.",
        };
      },
    },
    {
      id: "fill-volume",
      name: "Loose to Compacted Volume",
      description: "Calculate how much loose fill is needed to achieve a compacted volume",
      fields: [
        { name: "compactedVolume", label: "Required Compacted Volume (cubic yards)", type: "number", placeholder: "e.g. 50" },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sand / Gravel (shrink 12%)", value: "0.12" },
          { label: "Common Earth (shrink 20%)", value: "0.20" },
          { label: "Clay (shrink 25%)", value: "0.25" },
          { label: "Rock / Blasted (shrink 30%)", value: "0.30" },
          { label: "Topsoil (shrink 15%)", value: "0.15" },
        ], defaultValue: "0.20" },
        { name: "pricePerYard", label: "Price per Cubic Yard (optional)", type: "number", placeholder: "e.g. 20", prefix: "$" },
      ],
      calculate: (inputs) => {
        const compactedVolume = inputs.compactedVolume as number;
        const shrinkFactor = parseFloat(inputs.soilType as string) || 0.20;
        const price = inputs.pricePerYard as number;
        if (!compactedVolume) return null;

        const looseVolume = compactedVolume / (1 - shrinkFactor);
        const extraVolume = looseVolume - compactedVolume;
        const truckLoads = Math.ceil(looseVolume / 15);

        const details = [
          { label: "Compacted volume needed", value: `${formatNumber(compactedVolume, 1)} cu yd` },
          { label: "Loose volume to order", value: `${formatNumber(looseVolume, 1)} cu yd` },
          { label: "Extra for shrinkage", value: `${formatNumber(extraVolume, 1)} cu yd` },
          { label: "Shrink factor", value: `${(shrinkFactor * 100).toFixed(0)}%` },
          { label: "Estimated truck loads (15 cu yd)", value: `${truckLoads}` },
        ];

        if (price) {
          details.push({ label: "Estimated cost", value: `$${formatNumber(looseVolume * price, 2)}` });
        }

        return {
          primary: { label: "Loose Fill Needed", value: `${formatNumber(looseVolume, 1)} cubic yards` },
          details,
          note: "Shrinkage factor accounts for volume reduction when loose soil is compacted. Always order loose volume, not compacted volume. Compact in lifts of 6-8 inches for best results.",
        };
      },
    },
  ],
  relatedSlugs: ["excavation-volume-calculator", "aggregate-calculator", "backfill-calculator"],
  faq: [
    { question: "What compaction percentage is required for construction?", answer: "Standard structural fill requires 95% compaction (Standard Proctor). Roads and pavements typically require 98%. Non-structural landscape areas may only need 90%. Always check local building codes and project specifications." },
    { question: "What is the Standard Proctor test?", answer: "The Standard Proctor test (ASTM D698) determines the maximum dry density and optimum moisture content of a soil. A sample is compacted in a mold using a standard hammer and effort. The result defines 100% compaction for that soil. Field compaction is then compared against this maximum." },
  ],
  formula: "Compaction % = (Field Density / Max Density) \u00D7 100 | Loose Volume = Compacted Volume / (1 - Shrink Factor)",
};
