import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cargoVolumeCalculator: CalculatorDefinition = {
  slug: "cargo-volume-calculator",
  title: "Cargo & Trunk Volume Calculator",
  description: "Free cargo volume calculator. Calculate trunk, truck bed, or cargo area volume in cubic feet and determine how many items or boxes fit.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cargo volume calculator", "trunk volume", "truck bed volume", "cargo space calculator", "moving boxes fit"],
  variants: [
    {
      id: "volume",
      name: "Calculate Cargo Volume",
      description: "Calculate cargo area volume from dimensions",
      fields: [
        { name: "length", label: "Length (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "width", label: "Width (inches)", type: "number", placeholder: "e.g. 50" },
        { name: "height", label: "Height (inches)", type: "number", placeholder: "e.g. 30" },
        { name: "shape", label: "Shape", type: "select", options: [
          { label: "Rectangular (truck bed, SUV)", value: "rect" },
          { label: "Tapered (sedan trunk)", value: "tapered" },
          { label: "Irregular (hatchback)", value: "irregular" },
        ], defaultValue: "rect" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const shape = (inputs.shape as string) || "rect";
        if (!length || !width || !height) return null;

        let volumeCuIn = length * width * height;
        // Apply shape factor for non-rectangular spaces
        const shapeFactors: Record<string, number> = { rect: 1.0, tapered: 0.75, irregular: 0.80 };
        volumeCuIn *= shapeFactors[shape] || 1.0;

        const volumeCuFt = volumeCuIn / 1728; // 12^3
        const volumeLiters = volumeCuIn * 0.016387;

        // Estimate common items that fit
        const mediumBoxes = Math.floor(volumeCuFt / 3.0); // ~18x18x16 medium box = 3 cu ft
        const largeBoxes = Math.floor(volumeCuFt / 4.5); // ~24x18x18 large box = 4.5 cu ft
        const suitcases = Math.floor(volumeCuFt / 4.0); // large suitcase ~4 cu ft

        return {
          primary: { label: "Cargo Volume", value: `${formatNumber(volumeCuFt, 1)} cu ft` },
          details: [
            { label: "Volume (liters)", value: `${formatNumber(volumeLiters, 0)} L` },
            { label: "Volume (cubic inches)", value: formatNumber(volumeCuIn, 0) },
            { label: "Medium moving boxes", value: `~${mediumBoxes} boxes` },
            { label: "Large moving boxes", value: `~${largeBoxes} boxes` },
            { label: "Large suitcases", value: `~${suitcases} suitcases` },
          ],
          note: "Actual usable space may vary due to wheel wells, seat backs, and irregular shapes. Shape factor reduces theoretical volume for non-rectangular spaces.",
        };
      },
    },
    {
      id: "truckbed",
      name: "Truck Bed Calculator",
      description: "Calculate truck bed volume and material capacity",
      fields: [
        { name: "bedLength", label: "Bed Length", type: "select", options: [
          { label: "5.5 ft (Short bed)", value: "66" },
          { label: "6.5 ft (Standard bed)", value: "78" },
          { label: "8 ft (Long bed)", value: "96" },
        ], defaultValue: "78" },
        { name: "bedWidth", label: "Bed Width (inches)", type: "number", placeholder: "e.g. 51", defaultValue: 51 },
        { name: "bedDepth", label: "Bed Depth (inches)", type: "number", placeholder: "e.g. 22", defaultValue: 22 },
        { name: "material", label: "Material to Haul", type: "select", options: [
          { label: "Mulch (600 lbs/cu yd)", value: "600" },
          { label: "Topsoil (2,200 lbs/cu yd)", value: "2200" },
          { label: "Gravel (2,700 lbs/cu yd)", value: "2700" },
          { label: "Sand (2,500 lbs/cu yd)", value: "2500" },
          { label: "Firewood (2,500 lbs/cord)", value: "0" },
        ], defaultValue: "2200" },
        { name: "payload", label: "Vehicle Payload Capacity (lbs)", type: "number", placeholder: "e.g. 1800" },
      ],
      calculate: (inputs) => {
        const bedLength = parseInt(inputs.bedLength as string) || 78;
        const bedWidth = (inputs.bedWidth as number) || 51;
        const bedDepth = (inputs.bedDepth as number) || 22;
        const materialWeight = parseInt(inputs.material as string) || 2200;
        const payload = (inputs.payload as number) || 1500;

        const volumeCuIn = bedLength * bedWidth * bedDepth;
        const volumeCuFt = volumeCuIn / 1728;
        const volumeCuYd = volumeCuFt / 27;

        let materialFit: string;
        let weightOfFill: number;
        if (materialWeight > 0) {
          weightOfFill = volumeCuYd * materialWeight;
          const payloadLimitYd = payload / materialWeight;
          const usableYd = Math.min(volumeCuYd, payloadLimitYd);
          materialFit = `${formatNumber(usableYd, 2)} cu yards (limited by ${usableYd < volumeCuYd ? "payload" : "volume"})`;
        } else {
          weightOfFill = 0;
          materialFit = `${formatNumber(volumeCuFt / 128, 2)} cords of firewood space`;
        }

        return {
          primary: { label: "Bed Volume", value: `${formatNumber(volumeCuFt, 1)} cu ft` },
          details: [
            { label: "Volume (cubic yards)", value: formatNumber(volumeCuYd, 2) },
            { label: "Material capacity", value: materialFit },
            { label: "Weight if filled level", value: materialWeight > 0 ? `${formatNumber(volumeCuYd * materialWeight, 0)} lbs` : "N/A" },
            { label: "Payload limit", value: `${formatNumber(payload, 0)} lbs` },
          ],
          note: "Never exceed your vehicle's payload capacity, even if volume allows more material. Heavy materials like gravel and soil can exceed payload before filling the bed.",
        };
      },
    },
  ],
  relatedSlugs: ["truck-payload-calculator", "trailer-weight-calculator", "volume-calculator"],
  faq: [
    { question: "How many cubic feet is a typical car trunk?", answer: "A compact car trunk is about 12-13 cubic feet. A midsize sedan is 15-16 cubic feet. A full-size sedan is 17-20 cubic feet. An SUV with rear seats folded offers 60-90 cubic feet. A minivan can provide 140+ cubic feet with all seats folded." },
    { question: "How many cubic yards fit in a truck bed?", answer: "A short bed (5.5 ft) holds about 1.5 cubic yards level. A standard bed (6.5 ft) holds about 1.8 cubic yards. A long bed (8 ft) holds about 2.2 cubic yards. With sideboards you can carry more, but watch your payload weight limit." },
    { question: "How do I convert cubic feet to cubic yards?", answer: "Divide cubic feet by 27 to get cubic yards (since 3x3x3=27). For example, 54 cubic feet = 2 cubic yards. This is useful when ordering landscaping materials like mulch, soil, or gravel, which are typically sold by the cubic yard." },
  ],
  formula: "Volume = Length x Width x Height x Shape Factor; Cubic Feet = Cubic Inches / 1728; Cubic Yards = Cubic Feet / 27",
};
