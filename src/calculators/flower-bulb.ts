import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const flowerBulbCalculator: CalculatorDefinition = {
  slug: "flower-bulb-calculator",
  title: "Flower Bulb Planting Calculator",
  description: "Free flower bulb calculator. Calculate how many bulbs to plant, spacing, planting depth, and timing for tulips, daffodils, crocuses, and other flowering bulbs.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["flower bulb calculator", "bulb planting calculator", "how many bulbs to plant", "tulip bulb spacing", "daffodil planting calculator"],
  variants: [
    {
      id: "by-area",
      name: "Bulbs for an Area",
      description: "Calculate how many bulbs to fill a planting area",
      fields: [
        { name: "areaLength", label: "Area Length (ft)", type: "number", placeholder: "e.g. 10" },
        { name: "areaWidth", label: "Area Width (ft)", type: "number", placeholder: "e.g. 4" },
        { name: "bulbType", label: "Bulb Type", type: "select", options: [
          { label: "Tulips (5\" spacing, 6\" deep)", value: "tulip" },
          { label: "Daffodils/Narcissus (6\" spacing, 6\" deep)", value: "daffodil" },
          { label: "Crocus (3\" spacing, 3\" deep)", value: "crocus" },
          { label: "Hyacinth (6\" spacing, 6\" deep)", value: "hyacinth" },
          { label: "Allium (8\" spacing, 6\" deep)", value: "allium" },
          { label: "Iris (4\" spacing, 4\" deep)", value: "iris" },
          { label: "Gladiolus (6\" spacing, 4\" deep)", value: "gladiolus" },
          { label: "Lily (12\" spacing, 6\" deep)", value: "lily" },
          { label: "Dahlia (18\" spacing, 4\" deep)", value: "dahlia" },
          { label: "Grape Hyacinth/Muscari (3\" spacing, 3\" deep)", value: "muscari" },
        ], defaultValue: "tulip" },
        { name: "density", label: "Planting Density", type: "select", options: [
          { label: "Standard (recommended spacing)", value: "standard" },
          { label: "Dense (showstopper display)", value: "dense" },
          { label: "Naturalized (scattered look)", value: "natural" },
        ], defaultValue: "standard" },
      ],
      calculate: (inputs) => {
        const length = inputs.areaLength as number;
        const width = inputs.areaWidth as number;
        const bulb = inputs.bulbType as string;
        const density = inputs.density as string;
        if (!length || !width) return null;

        const spacingInches: Record<string, number> = {
          tulip: 5, daffodil: 6, crocus: 3, hyacinth: 6,
          allium: 8, iris: 4, gladiolus: 6, lily: 12, dahlia: 18, muscari: 3,
        };
        const depthInches: Record<string, number> = {
          tulip: 6, daffodil: 6, crocus: 3, hyacinth: 6,
          allium: 6, iris: 4, gladiolus: 4, lily: 6, dahlia: 4, muscari: 3,
        };
        const costPerBulb: Record<string, number> = {
          tulip: 0.50, daffodil: 0.60, crocus: 0.25, hyacinth: 0.80,
          allium: 1.50, iris: 0.75, gladiolus: 0.50, lily: 2.00, dahlia: 4.00, muscari: 0.20,
        };
        const bloomTime: Record<string, string> = {
          tulip: "Mid-Spring (April-May)", daffodil: "Early-Mid Spring (March-April)",
          crocus: "Late Winter-Early Spring (Feb-March)", hyacinth: "Early Spring (March-April)",
          allium: "Late Spring-Early Summer (May-June)", iris: "Late Spring (May-June)",
          gladiolus: "Mid-Late Summer (July-Aug)", lily: "Summer (June-August)",
          dahlia: "Summer-Fall (July-October)", muscari: "Early Spring (March-April)",
        };

        const densityFactor: Record<string, number> = { standard: 1, dense: 1.5, natural: 0.6 };
        const spacing = spacingInches[bulb] || 6;
        const depth = depthInches[bulb] || 6;
        const factor = densityFactor[density] || 1;

        const areaSqIn = length * width * 144;
        const bulbsStandard = areaSqIn / (spacing * spacing);
        const totalBulbs = Math.ceil(bulbsStandard * factor);
        const cost = totalBulbs * (costPerBulb[bulb] || 0.50);

        return {
          primary: { label: "Bulbs Needed", value: `${totalBulbs}` },
          details: [
            { label: "Planting area", value: `${formatNumber(length * width, 0)} sq ft` },
            { label: "Spacing", value: `${spacing} inches apart` },
            { label: "Planting depth", value: `${depth} inches` },
            { label: "Bloom time", value: bloomTime[bulb] || "Spring" },
            { label: "Estimated cost", value: `$${formatNumber(cost, 2)}` },
            { label: "Planting density", value: density === "dense" ? "1.5x standard" : density === "natural" ? "60% standard (naturalized)" : "Standard spacing" },
          ],
          note: "Plant bulbs with the pointed end up. Water well after planting. For a natural look, toss bulbs gently and plant where they land. Add bone meal to the planting hole for strong root development.",
        };
      },
    },
    {
      id: "succession",
      name: "Succession Bloom Planner",
      description: "Plan for continuous blooms from early spring to fall",
      fields: [
        { name: "area", label: "Total Planting Area (sq ft)", type: "number", placeholder: "e.g. 50" },
        { name: "bloomGoal", label: "Bloom Season Goal", type: "select", options: [
          { label: "Early Spring Only (Feb-April)", value: "early" },
          { label: "Full Spring (Feb-June)", value: "spring" },
          { label: "Spring Through Summer (Feb-Aug)", value: "summer" },
          { label: "Year-Round Color (Feb-Oct)", value: "yearround" },
        ], defaultValue: "spring" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const goal = inputs.bloomGoal as string;
        if (!area) return null;

        const plans: Record<string, { types: string[]; pcts: number[]; bulbs: number[] }> = {
          early: { types: ["Crocus", "Daffodils"], pcts: [50, 50], bulbs: [16, 4] },
          spring: { types: ["Crocus", "Daffodils", "Tulips", "Allium"], pcts: [25, 25, 30, 20], bulbs: [16, 4, 5.76, 2.25] },
          summer: { types: ["Crocus", "Tulips", "Allium", "Lilies", "Gladiolus"], pcts: [15, 25, 20, 20, 20], bulbs: [16, 5.76, 2.25, 1, 4] },
          yearround: { types: ["Crocus", "Daffodils", "Tulips", "Allium", "Lilies", "Dahlia"], pcts: [15, 15, 20, 15, 20, 15], bulbs: [16, 4, 5.76, 2.25, 1, 0.44] },
        };

        const plan = plans[goal] || plans.spring;
        const details = plan.types.map((type, i) => {
          const subArea = area * (plan.pcts[i] / 100);
          const numBulbs = Math.ceil(subArea * plan.bulbs[i]);
          return { label: type, value: `${numBulbs} bulbs (${plan.pcts[i]}% of area)` };
        });

        const totalBulbs = plan.types.reduce((sum, _, i) => {
          return sum + Math.ceil(area * (plan.pcts[i] / 100) * plan.bulbs[i]);
        }, 0);

        details.push({ label: "Total bulbs", value: `${totalBulbs}` });

        return {
          primary: { label: "Total Bulbs for Succession", value: `${totalBulbs}` },
          details,
          note: "Layer bulbs at different depths (lasagna planting) to maximize space: deepest bulbs first (tulips, daffodils), then shallower bulbs (crocus, muscari) on top.",
        };
      },
    },
  ],
  relatedSlugs: ["plant-spacing-calculator", "garden-bed-cost-calculator", "soil-amendment-calculator"],
  faq: [
    { question: "How many flower bulbs do I need per square foot?", answer: "It depends on the bulb type: Crocus/Muscari: 12-16 per sq ft, Tulips: 5-8 per sq ft, Daffodils: 4-6 per sq ft, Hyacinth: 4 per sq ft, Allium: 2-3 per sq ft, Lilies: 1 per sq ft, Dahlias: 1 per 2-3 sq ft." },
    { question: "When should I plant flower bulbs?", answer: "Spring-blooming bulbs (tulips, daffodils, crocus): Plant in fall, 6-8 weeks before the ground freezes. Summer-blooming bulbs (gladiolus, dahlia, lily): Plant in spring after last frost. Bulbs need cold temperatures to trigger blooming." },
    { question: "How deep do I plant flower bulbs?", answer: "General rule: Plant bulbs 2-3 times their height deep. Small bulbs (crocus): 3-4 inches. Medium bulbs (tulips, daffodils): 6-8 inches. Large bulbs (allium, lily): 6-8 inches. In cold climates, plant slightly deeper for insulation." },
  ],
  formula: "Bulbs = Area (sq in) / (Spacing × Spacing) × Density Factor | Standard: Tulips 5\", Daffodils 6\", Crocus 3\" spacing",
};
