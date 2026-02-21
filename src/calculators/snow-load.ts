import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const snowLoadCalculator: CalculatorDefinition = {
  slug: "snow-load-calculator",
  title: "Snow Load Calculator",
  description: "Free snow load calculator. Calculate the weight of snow on your roof based on snow depth, density, and roof area for structural safety.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["snow load calculator", "roof snow load", "snow weight calculator", "snow load on roof", "snow density calculator"],
  variants: [
    {
      id: "basic",
      name: "Basic Snow Load",
      description: "Calculate snow load from depth and snow type",
      fields: [
        { name: "depth", label: "Snow Depth (inches)", type: "number", placeholder: "e.g. 12" },
        { name: "roofArea", label: "Roof Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "snowType", label: "Snow Type", type: "select", options: [
          { label: "Fresh/Light Snow (5-10 lb/ft³)", value: "fresh" },
          { label: "Settled Snow (15-20 lb/ft³)", value: "settled" },
          { label: "Packed/Wind-blown (20-30 lb/ft³)", value: "packed" },
          { label: "Wet/Heavy Snow (30-40 lb/ft³)", value: "wet" },
          { label: "Ice (57 lb/ft³)", value: "ice" },
        ], defaultValue: "settled" },
      ],
      calculate: (inputs) => {
        const depth = inputs.depth as number;
        const area = inputs.roofArea as number;
        const snowType = inputs.snowType as string;
        if (!depth || !area) return null;
        const densityMap: Record<string, number> = { fresh: 7.5, settled: 17.5, packed: 25, wet: 35, ice: 57 };
        const density = densityMap[snowType] || 17.5;
        const depthFt = depth / 12;
        const psfLoad = density * depthFt;
        const totalWeight = psfLoad * area;
        const totalTons = totalWeight / 2000;
        let risk = "Low";
        if (psfLoad > 40) risk = "Critical – exceeds most residential roof designs";
        else if (psfLoad > 30) risk = "High – consider removing snow";
        else if (psfLoad > 20) risk = "Moderate – monitor closely";
        return {
          primary: { label: "Snow Load", value: `${formatNumber(psfLoad, 1)} psf` },
          details: [
            { label: "Total weight on roof", value: `${formatNumber(totalWeight, 0)} lbs (${formatNumber(totalTons, 1)} tons)` },
            { label: "Snow density", value: `${density} lb/ft³` },
            { label: "Snow depth", value: `${depth} inches` },
            { label: "Roof area", value: `${formatNumber(area, 0)} sq ft` },
            { label: "Risk level", value: risk },
          ],
          note: "Most residential roofs are designed for 20-40 psf ground snow loads. Consult local building codes for your area's design snow load.",
        };
      },
    },
    {
      id: "ground-to-roof",
      name: "Ground-to-Roof Conversion",
      description: "Convert ground snow load to roof snow load using exposure factor",
      fields: [
        { name: "groundLoad", label: "Ground Snow Load (psf)", type: "number", placeholder: "e.g. 30" },
        { name: "roofArea", label: "Roof Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "exposure", label: "Exposure Category", type: "select", options: [
          { label: "Fully Exposed (Ce=0.8)", value: "0.8" },
          { label: "Partially Exposed (Ce=1.0)", value: "1.0" },
          { label: "Sheltered (Ce=1.2)", value: "1.2" },
        ], defaultValue: "1.0" },
        { name: "thermal", label: "Thermal Factor", type: "select", options: [
          { label: "Heated Structure (Ct=1.0)", value: "1.0" },
          { label: "Unheated (Ct=1.1)", value: "1.1" },
          { label: "Freezer Building (Ct=1.3)", value: "1.3" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const pg = inputs.groundLoad as number;
        const area = inputs.roofArea as number;
        const Ce = parseFloat(inputs.exposure as string) || 1.0;
        const Ct = parseFloat(inputs.thermal as string) || 1.0;
        if (!pg || !area) return null;
        const Is = 1.0;
        const pf = 0.7 * Ce * Ct * Is * pg;
        const totalWeight = pf * area;
        return {
          primary: { label: "Flat Roof Snow Load", value: `${formatNumber(pf, 1)} psf` },
          details: [
            { label: "Ground snow load (pg)", value: `${pg} psf` },
            { label: "Exposure factor (Ce)", value: `${Ce}` },
            { label: "Thermal factor (Ct)", value: `${Ct}` },
            { label: "Importance factor (Is)", value: "1.0" },
            { label: "Total roof load", value: `${formatNumber(totalWeight, 0)} lbs` },
          ],
          note: "Based on ASCE 7 methodology: pf = 0.7 × Ce × Ct × Is × pg. Minimum flat roof load is 20 psf × Is per code.",
        };
      },
    },
  ],
  relatedSlugs: ["wind-load-calculator", "frost-depth-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much does snow weigh per square foot?", answer: "It varies by type: fresh fluffy snow weighs 3-5 lbs per sq ft per foot of depth, settled snow 15-20 lbs, packed snow 20-30 lbs, and wet heavy snow 30-40 lbs. Ice weighs about 57 lbs per cubic foot." },
    { question: "When should I remove snow from my roof?", answer: "Consider snow removal when loads approach 20 psf (about 4 feet of light snow or 2 feet of heavy wet snow). Warning signs include creaking sounds, sagging, cracks in walls or ceilings, and doors that stick." },
    { question: "What is the ground snow load for my area?", answer: "Ground snow loads are specified in ASCE 7 and local building codes. They range from 0 psf in southern states to over 100 psf in mountainous areas. Common values: Boston 40 psf, Chicago 25 psf, Denver 25 psf, Minneapolis 50 psf." },
  ],
  formula: "Snow Load (psf) = Snow Density (lb/ft³) × Depth (ft) | Roof Load: pf = 0.7 × Ce × Ct × Is × pg",
};
