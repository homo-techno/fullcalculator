import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenBedCostCalculator: CalculatorDefinition = {
  slug: "garden-bed-cost-calculator",
  title: "Garden Bed Cost Calculator",
  description: "Free garden bed cost calculator. Estimate the total cost to build a raised garden bed including lumber, hardware, soil, and other materials.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden bed cost calculator", "raised bed cost", "how much does a raised bed cost", "garden bed materials calculator", "raised bed budget"],
  variants: [
    {
      id: "full-build",
      name: "Full Build Cost",
      description: "Calculate total cost for building a raised bed from scratch",
      fields: [
        { name: "length", label: "Bed Length (ft)", type: "number", placeholder: "e.g. 8" },
        { name: "width", label: "Bed Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "height", label: "Bed Height (inches)", type: "select", options: [
          { label: "6 inches (1 board)", value: "6" },
          { label: "12 inches (2 boards)", value: "12" },
          { label: "18 inches (3 boards)", value: "18" },
          { label: "24 inches (4 boards - table height)", value: "24" },
        ], defaultValue: "12" },
        { name: "material", label: "Frame Material", type: "select", options: [
          { label: "Cedar (Rot Resistant)", value: "cedar" },
          { label: "Pine/Spruce (Budget)", value: "pine" },
          { label: "Redwood (Premium)", value: "redwood" },
          { label: "Composite/Recycled Plastic", value: "composite" },
          { label: "Galvanized Steel", value: "steel" },
          { label: "Concrete Block", value: "block" },
        ], defaultValue: "cedar" },
        { name: "soilMix", label: "Soil Fill", type: "select", options: [
          { label: "Premium Raised Bed Mix", value: "premium" },
          { label: "Topsoil + Compost Blend", value: "blend" },
          { label: "Budget (Topsoil Only)", value: "budget" },
        ], defaultValue: "blend" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const heightIn = parseInt(inputs.height as string);
        const material = inputs.material as string;
        const soil = inputs.soilMix as string;
        if (!length || !width || !heightIn) return null;

        const perimeter = 2 * (length + width);
        const heightFt = heightIn / 12;
        const boardLayers = Math.ceil(heightIn / 6);
        const linearFeet = perimeter * boardLayers;

        const costPerLinearFt: Record<string, number> = {
          cedar: 3.50, pine: 1.50, redwood: 5.00, composite: 6.00, steel: 4.00, block: 2.00,
        };
        const frameCost = linearFeet * (costPerLinearFt[material] || 3.50);
        const corners = 4;
        const screwsBrackets = corners * boardLayers * 3;
        const hardwareCost = screwsBrackets * 0.50 + corners * boardLayers * 4;

        const cubicFeet = length * width * heightFt;
        const cubicYards = cubicFeet / 27;
        const soilCostPerCuYd: Record<string, number> = {
          premium: 55, blend: 40, budget: 28,
        };
        const soilCost = cubicYards * (soilCostPerCuYd[soil] || 40);

        const landscapeFabric = length * width * 0.25;
        const miscCost = 15;
        const totalCost = frameCost + hardwareCost + soilCost + landscapeFabric + miscCost;

        const lifespan: Record<string, string> = {
          cedar: "15-20 years", pine: "3-5 years", redwood: "20-25 years",
          composite: "25+ years", steel: "20+ years", block: "25+ years",
        };
        const costPerYear = totalCost / (material === "pine" ? 4 : 20);

        return {
          primary: { label: "Total Cost", value: `$${formatNumber(totalCost, 0)}` },
          details: [
            { label: "Frame material", value: `$${formatNumber(frameCost, 0)} (${formatNumber(linearFeet, 0)} linear ft of ${material})` },
            { label: "Hardware (screws, brackets)", value: `$${formatNumber(hardwareCost, 0)}` },
            { label: "Soil fill (${formatNumber(cubicYards, 2)} cu yd)", value: `$${formatNumber(soilCost, 0)}` },
            { label: "Landscape fabric", value: `$${formatNumber(landscapeFabric, 0)}` },
            { label: "Misc (stain, liner)", value: `$${miscCost}` },
            { label: "Expected lifespan", value: lifespan[material] || "10+ years" },
            { label: "Cost per year", value: `$${formatNumber(costPerYear, 2)}` },
          ],
          note: "Prices are approximate based on 2024 lumber costs. Cedar and redwood are naturally rot-resistant and do not need chemical treatment. Never use pressure-treated wood for vegetable gardens.",
        };
      },
    },
    {
      id: "compare",
      name: "Material Comparison",
      description: "Compare costs of different bed materials for the same size",
      fields: [
        { name: "length", label: "Bed Length (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "width", label: "Bed Width (ft)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "height", label: "Bed Height (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const heightIn = inputs.height as number;
        if (!length || !width || !heightIn) return null;

        const perimeter = 2 * (length + width);
        const boardLayers = Math.ceil(heightIn / 6);
        const linearFeet = perimeter * boardLayers;
        const cubicFeet = length * width * (heightIn / 12);
        const soilCost = (cubicFeet / 27) * 40;

        const materials = [
          { name: "Pine/Spruce", cost: linearFeet * 1.50, life: 4 },
          { name: "Cedar", cost: linearFeet * 3.50, life: 18 },
          { name: "Redwood", cost: linearFeet * 5.00, life: 22 },
          { name: "Composite", cost: linearFeet * 6.00, life: 25 },
          { name: "Galv. Steel", cost: linearFeet * 4.00, life: 20 },
          { name: "Concrete Block", cost: linearFeet * 2.00, life: 25 },
        ];

        const details = materials.map(m => {
          const total = m.cost + soilCost + 30;
          return { label: m.name, value: `$${formatNumber(total, 0)} total ($${formatNumber(total / m.life, 0)}/year, ${m.life}yr life)` };
        });

        details.push({ label: "Soil cost (all options)", value: `$${formatNumber(soilCost, 0)} (${formatNumber(cubicFeet / 27, 2)} cu yd)` });

        return {
          primary: { label: "Bed Size", value: `${length}' × ${width}' × ${heightIn}"` },
          details,
          note: "While pine is cheapest upfront, cedar offers the best long-term value for wooden beds. Composite and steel have the highest upfront cost but last the longest.",
        };
      },
    },
  ],
  relatedSlugs: ["raised-garden-bed-calculator", "raised-bed-soil-calculator", "garden-fence-calculator"],
  faq: [
    { question: "How much does it cost to build a raised garden bed?", answer: "A standard 4x8 foot cedar raised bed costs $100-200 to build including soil. Pine beds cost $50-100, while composite or steel beds run $200-400. The biggest variable is soil fill cost, which depends on bed depth and soil quality." },
    { question: "What is the cheapest material for raised beds?", answer: "Pine or spruce lumber is cheapest ($50-80 for a 4x8 bed) but only lasts 3-5 years. Concrete blocks ($40-60) last much longer. For best value over time, cedar ($120-180) lasts 15-20 years without treatment." },
    { question: "Is it cheaper to build or buy a raised bed?", answer: "Building is usually cheaper. A DIY 4x8 cedar bed costs $100-200, while prefab kits of the same size cost $150-400. The savings are even greater for larger beds. Building also lets you customize exact dimensions for your space." },
  ],
  formula: "Frame Cost = Perimeter × Board Layers × Cost per Linear Foot | Soil Cost = Volume (cu yd) × Price per cu yd | Total = Frame + Hardware + Soil + Fabric + Misc",
};
