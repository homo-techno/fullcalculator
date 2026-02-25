import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const bulbPlantingDepthCalculator: CalculatorDefinition = {
  slug: "bulb-planting-depth-calculator",
  title: "Bulb Planting Depth Calculator",
  description: "Free bulb planting depth calculator. Find the correct planting depth and spacing for flower bulbs like tulips, daffodils, crocuses, and more.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bulb planting depth", "how deep to plant bulbs", "tulip planting depth", "daffodil planting depth", "bulb spacing calculator"],
  variants: [
    {
      id: "by-type",
      name: "Depth by Bulb Type",
      description: "Get planting depth and spacing for common flower bulbs",
      fields: [
        { name: "bulbType", label: "Bulb Type", type: "select", options: [
          { label: "Tulip", value: "tulip" },
          { label: "Daffodil / Narcissus", value: "daffodil" },
          { label: "Crocus", value: "crocus" },
          { label: "Hyacinth", value: "hyacinth" },
          { label: "Allium", value: "allium" },
          { label: "Iris", value: "iris" },
          { label: "Lily", value: "lily" },
          { label: "Gladiolus", value: "gladiolus" },
          { label: "Dahlia", value: "dahlia" },
          { label: "Snowdrop", value: "snowdrop" },
        ], defaultValue: "tulip" },
        { name: "quantity", label: "Number of Bulbs", type: "number", placeholder: "e.g. 25", defaultValue: 25 },
      ],
      calculate: (inputs) => {
        const bulbType = inputs.bulbType as string;
        const quantity = (inputs.quantity as number) || 25;

        const bulbData: Record<string, { depth: number; spacing: number; season: string; height: string }> = {
          tulip: { depth: 6, spacing: 5, season: "Fall (Sep-Nov)", height: "12-24 inches" },
          daffodil: { depth: 6, spacing: 6, season: "Fall (Sep-Nov)", height: "14-20 inches" },
          crocus: { depth: 3, spacing: 3, season: "Fall (Sep-Oct)", height: "3-6 inches" },
          hyacinth: { depth: 6, spacing: 6, season: "Fall (Sep-Nov)", height: "8-12 inches" },
          allium: { depth: 8, spacing: 8, season: "Fall (Sep-Nov)", height: "24-48 inches" },
          iris: { depth: 4, spacing: 6, season: "Fall (Sep-Oct)", height: "12-36 inches" },
          lily: { depth: 8, spacing: 12, season: "Fall or Spring", height: "24-72 inches" },
          gladiolus: { depth: 4, spacing: 6, season: "Spring (Apr-Jun)", height: "24-48 inches" },
          dahlia: { depth: 4, spacing: 18, season: "Spring (after frost)", height: "12-60 inches" },
          snowdrop: { depth: 3, spacing: 3, season: "Fall (Sep-Oct)", height: "3-6 inches" },
        };

        const data = bulbData[bulbType];
        if (!data) return null;

        const spacingSqIn = data.spacing * data.spacing;
        const totalAreaSqIn = quantity * spacingSqIn;
        const totalAreaSqFt = totalAreaSqIn / 144;

        return {
          primary: { label: "Planting Depth", value: `${data.depth} inches` },
          details: [
            { label: "Spacing between bulbs", value: `${data.spacing} inches` },
            { label: "Plant in", value: data.season },
            { label: "Mature height", value: data.height },
            { label: "Area needed for " + quantity + " bulbs", value: `${formatNumber(totalAreaSqFt, 1)} sq ft` },
          ],
          note: "Plant bulbs pointed end up. In colder climates, add 1-2 inches of extra depth for insulation.",
        };
      },
    },
    {
      id: "by-size",
      name: "Depth by Bulb Size",
      description: "Calculate planting depth using the 3x bulb height rule",
      fields: [
        { name: "bulbHeight", label: "Bulb Height (inches)", type: "number", placeholder: "e.g. 2", step: 0.25 },
        { name: "soilType", label: "Soil Type", type: "select", options: [
          { label: "Sandy / light soil (plant slightly deeper)", value: "1.15" },
          { label: "Loam / average soil", value: "1.0" },
          { label: "Clay / heavy soil (plant slightly shallower)", value: "0.85" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const bulbHeight = inputs.bulbHeight as number;
        const soilMod = parseFloat(inputs.soilType as string) || 1.0;
        if (!bulbHeight) return null;

        const baseDepth = bulbHeight * 3;
        const adjustedDepth = baseDepth * soilMod;
        const spacing = bulbHeight * 3;

        return {
          primary: { label: "Planting Depth", value: `${formatNumber(adjustedDepth, 1)} inches` },
          details: [
            { label: "Rule of thumb (3× height)", value: `${formatNumber(baseDepth, 1)} inches` },
            { label: "Soil adjustment", value: `×${soilMod}` },
            { label: "Recommended spacing", value: `${formatNumber(spacing, 1)} inches apart` },
            { label: "Bulb height measured", value: `${bulbHeight} inches` },
          ],
          note: "The general rule is to plant bulbs 3 times as deep as the bulb is tall, measured from the base of the bulb to the soil surface.",
        };
      },
    },
  ],
  relatedSlugs: ["flower-bed-calculator", "garden-row-spacing-calculator", "frost-date-calculator"],
  faq: [
    { question: "How deep should I plant tulip bulbs?", answer: "Tulip bulbs should be planted 6-8 inches deep (measured from the base of the bulb to the surface). In colder zones, plant 1-2 inches deeper for extra cold protection." },
    { question: "What happens if bulbs are planted too shallow?", answer: "Bulbs planted too shallow may freeze in winter, sprout too early in spring, or produce weak stems. They may also be more susceptible to being dug up by squirrels." },
  ],
  formula: "Depth = Bulb Height × 3 × Soil Modifier | Spacing ≈ 3 × Bulb Height",
};
