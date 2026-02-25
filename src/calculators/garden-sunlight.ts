import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenSunlightCalculator: CalculatorDefinition = {
  slug: "garden-sunlight-calculator",
  title: "Garden Sunlight Hours Calculator",
  description: "Free garden sunlight hours calculator. Assess your garden's sun exposure and determine which plants will thrive in your light conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden sunlight calculator", "sun hours calculator", "garden light exposure", "full sun partial shade", "sunlight hours for plants"],
  variants: [
    {
      id: "assessment",
      name: "Sunlight Assessment",
      description: "Assess your garden's sun exposure and find suitable plants",
      fields: [
        { name: "morningHours", label: "Morning Sun Hours (before noon)", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "afternoonHours", label: "Afternoon Sun Hours (after noon)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "shade", label: "Shade Conditions", type: "select", options: [
          { label: "No shade (open area)", value: "1.0" },
          { label: "Light dappled shade (thin trees)", value: "0.7" },
          { label: "Partial shade (buildings/fences)", value: "0.5" },
          { label: "Heavy shade (dense trees)", value: "0.3" },
        ], defaultValue: "1.0" },
        { name: "season", label: "Season", type: "select", options: [
          { label: "Summer (longest days)", value: "1.0" },
          { label: "Spring / Fall", value: "0.75" },
          { label: "Winter (shortest days)", value: "0.5" },
        ], defaultValue: "1.0" },
      ],
      calculate: (inputs) => {
        const morning = (inputs.morningHours as number) || 0;
        const afternoon = (inputs.afternoonHours as number) || 0;
        const shadeMod = parseFloat(inputs.shade as string) || 1.0;
        const seasonMod = parseFloat(inputs.season as string) || 1.0;

        const rawHours = morning + afternoon;
        const effectiveHours = rawHours * shadeMod * seasonMod;

        let classification = "";
        let suitablePlants = "";
        if (effectiveHours >= 8) {
          classification = "Full Sun";
          suitablePlants = "Tomatoes, peppers, squash, corn, melons, roses, lavender, most herbs";
        } else if (effectiveHours >= 6) {
          classification = "Full Sun (minimum)";
          suitablePlants = "Beans, cucumbers, peas, carrots, beets, most flowers, herbs";
        } else if (effectiveHours >= 4) {
          classification = "Partial Sun / Partial Shade";
          suitablePlants = "Lettuce, spinach, kale, broccoli, peas, radishes, mint, parsley";
        } else if (effectiveHours >= 2) {
          classification = "Partial Shade";
          suitablePlants = "Hostas, ferns, impatiens, begonias, lettuce, spinach, some herbs";
        } else {
          classification = "Full Shade";
          suitablePlants = "Hostas, ferns, moss, lily of the valley, sweet woodruff";
        }

        return {
          primary: { label: "Effective Sunlight", value: `${formatNumber(effectiveHours, 1)} hours/day` },
          details: [
            { label: "Classification", value: classification },
            { label: "Raw sun hours", value: `${rawHours} hours (${morning} AM + ${afternoon} PM)` },
            { label: "After shade/season adjustment", value: `${formatNumber(effectiveHours, 1)} hours` },
            { label: "Suitable plants", value: suitablePlants },
          ],
          note: "Morning sun is gentler than afternoon sun. Plants labeled 'partial shade' often prefer morning sun with afternoon shade, especially in hot climates.",
        };
      },
    },
    {
      id: "requirements",
      name: "Sun Requirements by Plant",
      description: "Check if your garden has enough sun for specific plants",
      fields: [
        { name: "plant", label: "Plant Type", type: "select", options: [
          { label: "Tomatoes (8+ hrs full sun)", value: "8" },
          { label: "Peppers (6-8 hrs full sun)", value: "6" },
          { label: "Squash / Melons (8+ hrs)", value: "8" },
          { label: "Beans / Peas (6+ hrs)", value: "6" },
          { label: "Root vegetables (4-6 hrs)", value: "4" },
          { label: "Leafy greens (3-4 hrs)", value: "3" },
          { label: "Herbs - basil, rosemary (6+ hrs)", value: "6" },
          { label: "Herbs - mint, parsley (4+ hrs)", value: "4" },
          { label: "Flowers - roses (6+ hrs)", value: "6" },
          { label: "Flowers - impatiens (2-4 hrs)", value: "2" },
        ], defaultValue: "6" },
        { name: "availableHours", label: "Available Sun Hours", type: "number", placeholder: "e.g. 6" },
      ],
      calculate: (inputs) => {
        const required = parseInt(inputs.plant as string) || 6;
        const available = inputs.availableHours as number;
        if (!available) return null;

        const surplus = available - required;
        const suitable = surplus >= 0;
        const percentage = (available / required) * 100;

        return {
          primary: { label: "Suitability", value: suitable ? "Yes - Suitable" : "No - Needs More Sun" },
          details: [
            { label: "Required sun hours", value: `${required}+ hours` },
            { label: "Available sun hours", value: `${available} hours` },
            { label: "Surplus / deficit", value: `${surplus >= 0 ? "+" : ""}${formatNumber(surplus, 1)} hours` },
            { label: "Light fulfillment", value: `${formatNumber(percentage)}%` },
          ],
          note: suitable
            ? "Your light conditions are suitable for this plant. Remember that summer provides more sun hours than spring or fall."
            : "Consider choosing shade-tolerant varieties, using reflective mulch to increase light, or relocating to a sunnier spot.",
        };
      },
    },
  ],
  relatedSlugs: ["vegetable-garden-size-calculator", "indoor-plant-light-calculator", "frost-date-calculator"],
  faq: [
    { question: "What does full sun mean for plants?", answer: "Full sun means 6 or more hours of direct sunlight per day. Most fruiting vegetables (tomatoes, peppers) and many flowers need full sun. Morning sun plus afternoon shade can count if totaling 6+ hours." },
    { question: "Can vegetables grow in partial shade?", answer: "Yes, leafy greens (lettuce, spinach, kale), root vegetables (radishes, beets), and some herbs (mint, parsley) can grow with only 3-4 hours of direct sun. Fruiting crops need more light." },
  ],
  formula: "Effective Hours = (Morning + Afternoon Hours) \u00D7 Shade Modifier \u00D7 Season Modifier",
};
