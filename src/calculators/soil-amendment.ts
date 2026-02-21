import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soilAmendmentCalculator: CalculatorDefinition = {
  slug: "soil-amendment-calculator",
  title: "Soil Amendment Calculator",
  description: "Free soil amendment calculator. Calculate how much compost, peat moss, perlite, gypsum, or other amendments to add based on your garden area and soil needs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soil amendment calculator", "how much compost to add", "soil improvement calculator", "garden soil calculator", "soil conditioner calculator"],
  variants: [
    {
      id: "by-amendment",
      name: "By Amendment Type",
      description: "Calculate amendment amount for your garden",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "amendment", label: "Amendment Type", type: "select", options: [
          { label: "Compost (general improvement)", value: "compost" },
          { label: "Peat Moss (lower pH, retain moisture)", value: "peat" },
          { label: "Perlite (improve drainage)", value: "perlite" },
          { label: "Vermiculite (retain moisture)", value: "vermiculite" },
          { label: "Gypsum (break up clay)", value: "gypsum" },
          { label: "Sand (improve drainage in clay)", value: "sand" },
          { label: "Aged Manure (nutrition + organic matter)", value: "manure" },
          { label: "Worm Castings (premium fertilizer)", value: "wormcastings" },
          { label: "Biochar (long-term soil health)", value: "biochar" },
          { label: "Coconut Coir (peat alternative)", value: "coir" },
        ], defaultValue: "compost" },
        { name: "depth", label: "Amendment Depth (inches)", type: "select", options: [
          { label: "1 inch (light topdress)", value: "1" },
          { label: "2 inches (standard amendment)", value: "2" },
          { label: "3 inches (heavy amendment)", value: "3" },
          { label: "4 inches (new bed prep)", value: "4" },
          { label: "6 inches (major soil renovation)", value: "6" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const amendment = inputs.amendment as string;
        const depth = parseInt(inputs.depth as string);
        if (!area || !depth) return null;

        const cubicFeet = area * (depth / 12);
        const cubicYards = cubicFeet / 27;

        const pricePerCuYd: Record<string, number> = {
          compost: 35, peat: 45, perlite: 80, vermiculite: 90,
          gypsum: 30, sand: 25, manure: 30, wormcastings: 200,
          biochar: 150, coir: 60,
        };
        const weightPerCuFt: Record<string, number> = {
          compost: 40, peat: 15, perlite: 6, vermiculite: 8,
          gypsum: 75, sand: 100, manure: 35, wormcastings: 45,
          biochar: 15, coir: 12,
        };
        const benefits: Record<string, string> = {
          compost: "Adds nutrients, improves structure, feeds soil microbes",
          peat: "Lowers pH, retains moisture, lightens heavy soil",
          perlite: "Improves drainage and aeration, does not decompose",
          vermiculite: "Retains moisture and nutrients, lightens soil",
          gypsum: "Breaks up clay without changing pH, adds calcium",
          sand: "Improves drainage in heavy clay (use coarse, not fine)",
          manure: "Rich in nitrogen and organic matter, improves fertility",
          wormcastings: "Premium slow-release fertilizer, improves soil biology",
          biochar: "Long-lasting carbon, improves water retention and microbial habitat",
          coir: "Sustainable peat alternative, excellent water retention",
        };

        const totalCost = cubicYards * (pricePerCuYd[amendment] || 35);
        const totalWeight = cubicFeet * (weightPerCuFt[amendment] || 40);
        const bags = Math.ceil(cubicFeet / 1.5);

        return {
          primary: { label: "Amendment Needed", value: `${formatNumber(cubicYards, 2)} cubic yards (${formatNumber(cubicFeet, 1)} cu ft)` },
          details: [
            { label: "Coverage area", value: `${formatNumber(area, 0)} sq ft at ${depth}" deep` },
            { label: "Weight (approx)", value: `${formatNumber(totalWeight, 0)} lbs` },
            { label: "1.5 cu ft bags", value: `${bags}` },
            { label: "Estimated cost", value: `$${formatNumber(totalCost, 0)}` },
            { label: "Benefits", value: benefits[amendment] || "Improves soil quality" },
          ],
          note: "Till amendments into the top 6-8 inches of soil for best results. For established beds, topdress and let worms incorporate it. Best applied in fall or early spring before planting.",
        };
      },
    },
    {
      id: "soil-fix",
      name: "Soil Problem Solver",
      description: "Get amendment recommendations based on soil problems",
      fields: [
        { name: "area", label: "Garden Area (sq ft)", type: "number", placeholder: "e.g. 200" },
        { name: "problem", label: "Soil Problem", type: "select", options: [
          { label: "Heavy Clay (Poor drainage)", value: "clay" },
          { label: "Sandy Soil (Water runs through)", value: "sandy" },
          { label: "Compacted Soil (Hard, dense)", value: "compacted" },
          { label: "Low Organic Matter", value: "low_organic" },
          { label: "Poor Nutrition (Weak plants)", value: "poor_nutrition" },
          { label: "New Construction Fill (Dead soil)", value: "fill" },
        ], defaultValue: "clay" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const problem = inputs.problem as string;
        if (!area) return null;

        const solutions: Record<string, { amendments: string[]; depths: number[]; descriptions: string[] }> = {
          clay: {
            amendments: ["Compost", "Gypsum", "Perlite"],
            depths: [3, 0.5, 1],
            descriptions: ["Break up clay, add organic matter", "Improve clay particle separation", "Add permanent drainage"],
          },
          sandy: {
            amendments: ["Compost", "Peat Moss/Coir", "Vermiculite"],
            depths: [3, 2, 1],
            descriptions: ["Add water-holding organic matter", "Increase moisture retention", "Hold water and nutrients"],
          },
          compacted: {
            amendments: ["Compost", "Gypsum", "Biochar"],
            depths: [4, 0.5, 0.5],
            descriptions: ["Loosen soil and add biology", "Break up compaction chemically", "Create permanent pore space"],
          },
          low_organic: {
            amendments: ["Compost", "Aged Manure", "Cover Crop Seed"],
            depths: [3, 2, 0],
            descriptions: ["Primary organic matter source", "Additional nutrients and biology", "Grow green manure in off-season"],
          },
          poor_nutrition: {
            amendments: ["Compost", "Worm Castings", "Aged Manure"],
            depths: [2, 0.5, 2],
            descriptions: ["Balanced slow-release nutrition", "Premium concentrated fertilizer", "High-nitrogen organic fertilizer"],
          },
          fill: {
            amendments: ["Compost", "Aged Manure", "Peat Moss/Coir"],
            depths: [6, 2, 2],
            descriptions: ["Create living soil foundation", "Add essential microbiology", "Improve water retention"],
          },
        };

        const solution = solutions[problem] || solutions.clay;
        const details = solution.amendments.map((amend, i) => {
          const depth = solution.depths[i];
          const cubicFeet = depth > 0 ? area * (depth / 12) : 0;
          const cubicYards = cubicFeet / 27;
          return {
            label: amend,
            value: depth > 0 ? `${formatNumber(cubicYards, 2)} cu yd (${depth}" deep) - ${solution.descriptions[i]}` : solution.descriptions[i],
          };
        });

        const totalCuFt = solution.depths.reduce((sum, d) => sum + area * (d / 12), 0);
        details.push({ label: "Total amendment volume", value: `${formatNumber(totalCuFt / 27, 2)} cubic yards` });
        details.push({ label: "Estimated total cost", value: `$${formatNumber(totalCuFt / 27 * 40, 0)}` });

        return {
          primary: { label: "Recommended Fix", value: `${solution.amendments.join(" + ")}` },
          details,
          note: "Soil improvement is a gradual process. Apply amendments yearly for 2-3 years for best results. Get a soil test before amending to know exact needs.",
        };
      },
    },
  ],
  relatedSlugs: ["compost-ratio-calculator", "ph-adjustment-calculator", "raised-bed-soil-calculator"],
  faq: [
    { question: "How much compost should I add to my garden?", answer: "Add 2-3 inches of compost annually and work it into the top 6-8 inches of soil. For new beds, add 4-6 inches. This equals about 0.6-0.9 cubic yards per 100 sq ft at 2-3 inch depth." },
    { question: "How do I fix clay soil?", answer: "Add 3-4 inches of compost plus 50 lbs of gypsum per 1000 sq ft, worked into the top 8-12 inches. Repeat annually for 2-3 years. Do not add sand to clay without compost - it can create a concrete-like soil. Gypsum helps break up clay particles." },
    { question: "When should I amend garden soil?", answer: "Fall is the best time to amend soil - amendments have winter to break down and integrate. Early spring (2-4 weeks before planting) is the second best time. Topdressing with compost can be done anytime during the growing season." },
  ],
  formula: "Volume (cu yd) = Area (sq ft) × Depth (inches) / 12 / 27 | Weight = Volume (cu ft) × Weight per cu ft",
};
