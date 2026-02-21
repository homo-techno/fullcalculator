import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const seedStartingCalculator: CalculatorDefinition = {
  slug: "seed-starting-calculator",
  title: "Seed Starting Date Calculator",
  description: "Free seed starting calculator. Calculate when to start seeds indoors based on your last frost date, crop type, and growing zone for optimal germination.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["seed starting calculator", "when to start seeds indoors", "seed starting date", "last frost date planting", "indoor seed starting schedule"],
  variants: [
    {
      id: "by-crop",
      name: "By Crop Type",
      description: "Calculate seed starting date based on crop and last frost date",
      fields: [
        { name: "lastFrostMonth", label: "Last Frost Month", type: "select", options: [
          { label: "January", value: "0" },
          { label: "February", value: "1" },
          { label: "March", value: "2" },
          { label: "April", value: "3" },
          { label: "May", value: "4" },
          { label: "June", value: "5" },
          { label: "July", value: "6" },
          { label: "August", value: "7" },
        ], defaultValue: "3" },
        { name: "lastFrostDay", label: "Last Frost Day of Month", type: "number", placeholder: "e.g. 15", min: 1, max: 31, defaultValue: 15 },
        { name: "cropType", label: "Crop Type", type: "select", options: [
          { label: "Tomatoes", value: "tomato" },
          { label: "Peppers", value: "pepper" },
          { label: "Eggplant", value: "eggplant" },
          { label: "Broccoli", value: "broccoli" },
          { label: "Cabbage", value: "cabbage" },
          { label: "Cauliflower", value: "cauliflower" },
          { label: "Lettuce", value: "lettuce" },
          { label: "Kale", value: "kale" },
          { label: "Cucumbers", value: "cucumber" },
          { label: "Squash/Zucchini", value: "squash" },
          { label: "Melons", value: "melon" },
          { label: "Herbs (Basil)", value: "basil" },
          { label: "Marigolds", value: "marigold" },
          { label: "Zinnia", value: "zinnia" },
        ], defaultValue: "tomato" },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.lastFrostMonth as string);
        const day = inputs.lastFrostDay as number;
        if (isNaN(month) || !day) return null;

        const weeksBeforeFrost: Record<string, number> = {
          tomato: 6, pepper: 8, eggplant: 8, broccoli: 6, cabbage: 6,
          cauliflower: 6, lettuce: 4, kale: 6, cucumber: 3, squash: 3,
          melon: 4, basil: 6, marigold: 6, zinnia: 4,
        };
        const germDays: Record<string, number> = {
          tomato: 7, pepper: 14, eggplant: 10, broccoli: 5, cabbage: 5,
          cauliflower: 5, lettuce: 3, kale: 5, cucumber: 4, squash: 4,
          melon: 5, basil: 7, marigold: 5, zinnia: 5,
        };
        const crop = inputs.cropType as string;
        const weeks = weeksBeforeFrost[crop] || 6;
        const germ = germDays[crop] || 7;

        const frostDate = new Date(2025, month, day);
        const startDate = new Date(frostDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
        const transplantDate = new Date(frostDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return {
          primary: { label: "Start Seeds Indoors", value: `${monthNames[startDate.getMonth()]} ${startDate.getDate()}` },
          details: [
            { label: "Weeks before last frost", value: `${weeks} weeks` },
            { label: "Germination time", value: `${germ} days` },
            { label: "Last frost date", value: `${monthNames[month]} ${day}` },
            { label: "Earliest transplant date", value: `${monthNames[transplantDate.getMonth()]} ${transplantDate.getDate()} (1 week after frost)` },
            { label: "Soil temperature for germination", value: crop === "pepper" || crop === "tomato" || crop === "eggplant" ? "70-85°F" : "60-75°F" },
          ],
          note: "Start seeds indoors under grow lights or in a sunny window. Harden off seedlings for 7-10 days before transplanting outdoors.",
        };
      },
    },
    {
      id: "custom",
      name: "Custom Weeks Before Frost",
      description: "Enter custom weeks before last frost for any crop",
      fields: [
        { name: "lastFrostMonth", label: "Last Frost Month", type: "select", options: [
          { label: "January", value: "0" },
          { label: "February", value: "1" },
          { label: "March", value: "2" },
          { label: "April", value: "3" },
          { label: "May", value: "4" },
          { label: "June", value: "5" },
          { label: "July", value: "6" },
          { label: "August", value: "7" },
        ], defaultValue: "3" },
        { name: "lastFrostDay", label: "Last Frost Day of Month", type: "number", placeholder: "e.g. 15", min: 1, max: 31, defaultValue: 15 },
        { name: "weeksBefore", label: "Weeks Before Last Frost", type: "number", placeholder: "e.g. 6", min: 1, max: 16, defaultValue: 6 },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.lastFrostMonth as string);
        const day = inputs.lastFrostDay as number;
        const weeks = inputs.weeksBefore as number;
        if (isNaN(month) || !day || !weeks) return null;

        const frostDate = new Date(2025, month, day);
        const startDate = new Date(frostDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return {
          primary: { label: "Start Seeds Indoors", value: `${monthNames[startDate.getMonth()]} ${startDate.getDate()}` },
          details: [
            { label: "Weeks before frost", value: `${weeks} weeks` },
            { label: "Days before frost", value: `${weeks * 7} days` },
            { label: "Last frost date", value: `${monthNames[month]} ${day}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["harvest-date-calculator", "growing-season-calculator", "plant-spacing-calculator"],
  faq: [
    { question: "When should I start tomato seeds indoors?", answer: "Start tomato seeds indoors 6-8 weeks before your last frost date. For most zones in the US, this means starting in February to April depending on your location. Tomatoes need warm soil (70-85°F) to germinate." },
    { question: "How do I find my last frost date?", answer: "Check the USDA Plant Hardiness Zone Map or contact your local extension office. Common last frost dates: Zone 3-4 (May 15-30), Zone 5-6 (April 15-May 15), Zone 7-8 (March 15-April 15), Zone 9-10 (February 1-March 1)." },
    { question: "What supplies do I need to start seeds indoors?", answer: "You need seed starting mix (not regular potting soil), seed trays or cell packs, a humidity dome, grow lights or a sunny south-facing window, a heat mat (optional but helpful), and a spray bottle for watering." },
  ],
  formula: "Start Date = Last Frost Date - (Weeks Before Frost × 7 days) | Transplant Date = Last Frost Date + 7 days (after hardening off)",
};
