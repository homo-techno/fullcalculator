import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const backfillCalculator: CalculatorDefinition = {
  slug: "backfill-calculator",
  title: "Backfill Calculator",
  description: "Free backfill calculator. Calculate the volume of backfill material needed for foundations, trenches, retaining walls, and utility installations.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["backfill calculator", "fill dirt calculator", "trench backfill", "foundation backfill", "backfill volume"],
  variants: [
    {
      id: "foundation",
      name: "Foundation Backfill",
      description: "Calculate backfill volume around a foundation (total excavation minus foundation footprint)",
      fields: [
        { name: "excLength", label: "Excavation Length (feet)", type: "number", placeholder: "e.g. 44" },
        { name: "excWidth", label: "Excavation Width (feet)", type: "number", placeholder: "e.g. 28" },
        { name: "excDepth", label: "Excavation Depth (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "foundLength", label: "Foundation Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "foundWidth", label: "Foundation Width (feet)", type: "number", placeholder: "e.g. 24" },
        { name: "foundDepth", label: "Foundation Depth (feet)", type: "number", placeholder: "e.g. 8" },
        { name: "material", label: "Backfill Material", type: "select", options: [
          { label: "Clean Fill / Structural Fill", value: "2400" },
          { label: "Gravel / Crushed Stone", value: "2700" },
          { label: "Sand", value: "2600" },
          { label: "Native Soil (reuse excavated)", value: "2200" },
        ], defaultValue: "2400" },
      ],
      calculate: (inputs) => {
        const excL = inputs.excLength as number;
        const excW = inputs.excWidth as number;
        const excD = inputs.excDepth as number;
        const foundL = inputs.foundLength as number;
        const foundW = inputs.foundWidth as number;
        const foundD = inputs.foundDepth as number;
        if (!excL || !excW || !excD || !foundL || !foundW || !foundD) return null;

        const density = parseInt(inputs.material as string) || 2400;
        const excVolume = excL * excW * excD;
        const foundVolume = foundL * foundW * foundD;
        const backfillCF = excVolume - foundVolume;
        const backfillCY = backfillCF / 27;
        const compactedCY = backfillCY * 1.25;
        const tons = (compactedCY * density) / 2000;

        return {
          primary: { label: "Backfill Needed", value: `${formatNumber(compactedCY, 1)} cubic yards` },
          details: [
            { label: "Excavation volume", value: `${formatNumber(excVolume / 27, 1)} cu yd` },
            { label: "Foundation volume", value: `${formatNumber(foundVolume / 27, 1)} cu yd` },
            { label: "Backfill volume (net)", value: `${formatNumber(backfillCY, 1)} cu yd` },
            { label: "With 25% compaction factor", value: `${formatNumber(compactedCY, 1)} cu yd` },
            { label: "Weight", value: `${formatNumber(tons, 1)} tons` },
            { label: "Truck loads (15 cu yd each)", value: `${Math.ceil(compactedCY / 15)}` },
          ],
          note: "Includes 25% extra for compaction. Backfill must be placed and compacted in lifts of 6-8 inches. Do not backfill until foundation has cured and waterproofing is complete.",
        };
      },
    },
    {
      id: "trench",
      name: "Trench Backfill",
      description: "Calculate backfill volume for a utility trench after pipe installation",
      fields: [
        { name: "length", label: "Trench Length (feet)", type: "number", placeholder: "e.g. 100" },
        { name: "width", label: "Trench Width (inches)", type: "number", placeholder: "e.g. 24" },
        { name: "depth", label: "Trench Depth (feet)", type: "number", placeholder: "e.g. 4" },
        { name: "pipeDiameter", label: "Pipe Diameter (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "beddingDepth", label: "Bedding Depth Below Pipe (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const widthIn = inputs.width as number;
        const depth = inputs.depth as number;
        const pipeDia = (inputs.pipeDiameter as number) || 4;
        const beddingIn = (inputs.beddingDepth as number) || 4;
        if (!length || !widthIn || !depth) return null;

        const widthFt = widthIn / 12;
        const trenchCF = length * widthFt * depth;
        const pipeRadiusFt = pipeDia / 24;
        const pipeCF = Math.PI * pipeRadiusFt * pipeRadiusFt * length;
        const backfillCF = trenchCF - pipeCF;
        const backfillCY = backfillCF / 27;
        const beddingCF = length * widthFt * (beddingIn / 12);
        const beddingCY = beddingCF / 27;

        return {
          primary: { label: "Total Backfill Needed", value: `${formatNumber(backfillCY * 1.15, 1)} cubic yards` },
          details: [
            { label: "Trench volume", value: `${formatNumber(trenchCF / 27, 1)} cu yd` },
            { label: "Pipe volume displaced", value: `${formatNumber(pipeCF / 27, 2)} cu yd` },
            { label: "Net backfill volume", value: `${formatNumber(backfillCY, 1)} cu yd` },
            { label: "With 15% compaction factor", value: `${formatNumber(backfillCY * 1.15, 1)} cu yd` },
            { label: "Bedding material (gravel)", value: `${formatNumber(beddingCY, 2)} cu yd` },
          ],
          note: "Bedding depth is the layer of gravel placed below and around the pipe. Backfill in 6-inch lifts with proper compaction. Use approved backfill material per local code.",
        };
      },
    },
  ],
  relatedSlugs: ["excavation-volume-calculator", "soil-compaction-calculator", "aggregate-calculator"],
  faq: [
    { question: "What material should I use for backfill?", answer: "For structural backfill around foundations, use clean gravel or engineered fill. For utility trenches, gravel bedding is placed around the pipe, then native soil can be used above. Never use organic soil, debris, or frozen material as backfill. Check local building codes for specific requirements." },
    { question: "Why do I need extra material for compaction?", answer: "Loose fill material compresses when compacted, reducing in volume by 15-30% depending on the soil type. You need to order extra material to account for this volume reduction. Gravel compresses about 15%, while clay may compress up to 30%." },
  ],
  formula: "Backfill = Excavation Volume - Structure Volume | Order Qty = Backfill \u00D7 Compaction Factor",
};
