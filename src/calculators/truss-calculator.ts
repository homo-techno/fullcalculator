import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const trussCalculator: CalculatorDefinition = {
  slug: "truss-calculator",
  title: "Roof Truss Calculator",
  description: "Free roof truss calculator. Calculate truss dimensions, count, lumber needed, and costs for common, hip, and scissor roof trusses.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["roof truss calculator", "truss calculator", "truss count", "truss dimensions", "roof truss spacing"],
  variants: [
    {
      id: "truss-dimensions",
      name: "Truss Dimensions & Count",
      description: "Calculate truss dimensions and quantity needed",
      fields: [
        { name: "buildingSpan", label: "Building Span / Width (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "buildingLength", label: "Building Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "roofPitch", label: "Roof Pitch", type: "select", options: [
          { label: "3/12", value: "3" },
          { label: "4/12", value: "4" },
          { label: "5/12", value: "5" },
          { label: "6/12", value: "6" },
          { label: "7/12", value: "7" },
          { label: "8/12", value: "8" },
          { label: "9/12", value: "9" },
          { label: "10/12", value: "10" },
          { label: "12/12", value: "12" },
        ], defaultValue: "6" },
        { name: "spacing", label: "Truss Spacing", type: "select", options: [
          { label: "16\" on center", value: "16" },
          { label: "24\" on center", value: "24" },
        ], defaultValue: "24" },
        { name: "overhang", label: "Overhang (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const span = inputs.buildingSpan as number;
        const length = inputs.buildingLength as number;
        const pitch = parseInt(inputs.roofPitch as string) || 6;
        const spacing = parseInt(inputs.spacing as string) || 24;
        const overhang = (inputs.overhang as number) || 12;
        if (!span || !length) return null;

        const halfSpan = span / 2;
        const rise = halfSpan * (pitch / 12);
        const rakeLength = Math.sqrt(halfSpan * halfSpan + rise * rise);
        const totalRakeWithOverhang = rakeLength + (overhang / 12) / Math.cos(Math.atan(pitch / 12));

        const trussCount = Math.ceil((length * 12) / spacing) + 1;
        const bottomChordLength = span + (2 * overhang / 12);

        // Lumber estimate per truss (simplified - top chords, bottom chord, webs)
        const topChordLumber = totalRakeWithOverhang * 2; // 2 top chords
        const bottomChordLumber = bottomChordLength;
        const webLumber = span * 0.6; // Approximate web members
        const lumberPerTruss = topChordLumber + bottomChordLumber + webLumber;
        const totalLumber = lumberPerTruss * trussCount;

        const peakHeight = rise;

        return {
          primary: { label: "Trusses Needed", value: `${trussCount} trusses` },
          details: [
            { label: "Peak height (above wall plate)", value: `${formatNumber(peakHeight, 1)} ft` },
            { label: "Top chord length (each)", value: `${formatNumber(totalRakeWithOverhang, 1)} ft` },
            { label: "Bottom chord length", value: `${formatNumber(bottomChordLength, 1)} ft` },
            { label: "Roof pitch", value: `${pitch}/12` },
            { label: "Truss spacing", value: `${spacing}" OC` },
            { label: "Overhang", value: `${overhang} inches` },
            { label: "Estimated lumber (total)", value: `${formatNumber(totalLumber, 0)} linear ft` },
          ],
          note: "Trusses should be engineered for your specific loads (dead load, live load, wind, snow). This provides dimensional estimates only. Always use engineered truss drawings from a truss manufacturer.",
        };
      },
    },
    {
      id: "truss-cost",
      name: "Truss Cost Estimate",
      description: "Estimate the cost of roof trusses for your project",
      fields: [
        { name: "span", label: "Truss Span (feet)", type: "number", placeholder: "e.g. 30" },
        { name: "count", label: "Number of Trusses", type: "number", placeholder: "e.g. 21" },
        { name: "trussType", label: "Truss Type", type: "select", options: [
          { label: "Common (triangle)", value: "common" },
          { label: "Scissor (vaulted ceiling)", value: "scissor" },
          { label: "Attic (room in attic)", value: "attic" },
          { label: "Hip End", value: "hip" },
          { label: "Mono (single slope)", value: "mono" },
        ], defaultValue: "common" },
        { name: "delivery", label: "Include Delivery & Setting?", type: "select", options: [
          { label: "Trusses Only (pickup)", value: "0" },
          { label: "With Delivery", value: "150" },
          { label: "With Delivery + Crane Setting", value: "500" },
        ], defaultValue: "150" },
      ],
      calculate: (inputs) => {
        const span = inputs.span as number;
        const count = inputs.count as number;
        const trussType = inputs.trussType as string;
        const deliveryCost = parseInt(inputs.delivery as string) || 0;
        if (!span || !count) return null;

        // Cost per truss varies by span and type
        let baseCostPerFoot: number;
        switch (trussType) {
          case "common": baseCostPerFoot = 4; break;
          case "scissor": baseCostPerFoot = 6; break;
          case "attic": baseCostPerFoot = 8; break;
          case "hip": baseCostPerFoot = 5.5; break;
          case "mono": baseCostPerFoot = 3.5; break;
          default: baseCostPerFoot = 4;
        }

        const costPerTruss = span * baseCostPerFoot;
        const trussCost = costPerTruss * count;
        const connectors = count * 4 * 1.5; // 4 connectors per truss at $1.50 each
        const totalCost = trussCost + connectors + deliveryCost;

        return {
          primary: { label: "Estimated Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Cost per truss", value: `$${formatNumber(costPerTruss, 0)}` },
            { label: "Trusses subtotal", value: `$${formatNumber(trussCost, 0)}` },
            { label: "Truss connectors/hardware", value: `$${formatNumber(connectors, 0)}` },
            { label: "Delivery/crane", value: `$${formatNumber(deliveryCost, 0)}` },
            { label: "Number of trusses", value: `${count}` },
            { label: "Truss span", value: `${span} ft` },
          ],
          note: "Truss prices vary significantly by region and market conditions. Engineered trusses include sealed drawings. Order lead time is typically 1-3 weeks. Always get quotes from local truss manufacturers.",
        };
      },
    },
  ],
  relatedSlugs: ["roof-pitch-calculator", "roofing-calculator", "lumber-calculator"],
  faq: [
    { question: "How many roof trusses do I need?", answer: "Divide the building length (in inches) by the truss spacing (16\" or 24\" OC) and add 1. Example: 40-foot building at 24\" OC = (480/24) + 1 = 21 trusses. Add gable end trusses and any hip trusses as needed." },
    { question: "How much do roof trusses cost?", answer: "Common trusses: $3-$5 per foot of span ($90-$150 for a 30-ft span). Scissor trusses: $5-$8 per foot. Attic trusses: $7-$10 per foot. Prices vary by region, materials market, and complexity. Delivery and crane setting add $300-$800." },
  ],
  formula: "Truss Count = (Building Length × 12 / Spacing) + 1 | Rise = Half Span × Pitch/12 | Rake Length = √(Half Span² + Rise²)",
};
