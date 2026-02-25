import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frostDateCalculator: CalculatorDefinition = {
  slug: "frost-date-calculator",
  title: "First/Last Frost Date Calculator",
  description: "Free frost date calculator. Estimate planting windows based on your USDA hardiness zone, last spring frost, and first fall frost dates.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["frost date calculator", "last frost date", "first frost date", "planting date calculator", "when to plant", "growing season"],
  variants: [
    {
      id: "by-zone",
      name: "Frost Dates by USDA Zone",
      description: "Estimate frost dates based on your hardiness zone",
      fields: [
        { name: "zone", label: "USDA Hardiness Zone", type: "select", options: [
          { label: "Zone 3 (-40 to -30\u00B0F)", value: "3" },
          { label: "Zone 4 (-30 to -20\u00B0F)", value: "4" },
          { label: "Zone 5 (-20 to -10\u00B0F)", value: "5" },
          { label: "Zone 6 (-10 to 0\u00B0F)", value: "6" },
          { label: "Zone 7 (0 to 10\u00B0F)", value: "7" },
          { label: "Zone 8 (10 to 20\u00B0F)", value: "8" },
          { label: "Zone 9 (20 to 30\u00B0F)", value: "9" },
          { label: "Zone 10 (30 to 40\u00B0F)", value: "10" },
        ], defaultValue: "6" },
        { name: "cropType", label: "Crop Hardiness", type: "select", options: [
          { label: "Cold-hardy (peas, spinach, kale)", value: "hardy" },
          { label: "Semi-hardy (lettuce, carrots, beets)", value: "semi" },
          { label: "Tender (tomatoes, peppers, squash)", value: "tender" },
          { label: "Very tender (melons, eggplant)", value: "very-tender" },
        ], defaultValue: "tender" },
      ],
      calculate: (inputs) => {
        const zone = parseInt(inputs.zone as string) || 6;
        const cropType = inputs.cropType as string;

        const zoneData: Record<number, { lastFrost: string; firstFrost: string; seasonDays: number }> = {
          3: { lastFrost: "May 15", firstFrost: "Sep 15", seasonDays: 123 },
          4: { lastFrost: "May 10", firstFrost: "Sep 25", seasonDays: 138 },
          5: { lastFrost: "Apr 30", firstFrost: "Oct 5", seasonDays: 158 },
          6: { lastFrost: "Apr 15", firstFrost: "Oct 15", seasonDays: 183 },
          7: { lastFrost: "Apr 1", firstFrost: "Oct 30", seasonDays: 212 },
          8: { lastFrost: "Mar 15", firstFrost: "Nov 10", seasonDays: 240 },
          9: { lastFrost: "Feb 15", firstFrost: "Nov 30", seasonDays: 288 },
          10: { lastFrost: "Jan 31", firstFrost: "Dec 15", seasonDays: 318 },
        };

        const data = zoneData[zone];
        if (!data) return null;

        let plantBeforeFrost = "";
        let plantAfterFrost = "";
        if (cropType === "hardy") {
          plantBeforeFrost = "4-6 weeks before last frost";
          plantAfterFrost = "Can tolerate light frost (28-32\u00B0F)";
        } else if (cropType === "semi") {
          plantBeforeFrost = "2-4 weeks before last frost";
          plantAfterFrost = "Light frost may damage";
        } else if (cropType === "tender") {
          plantBeforeFrost = "After last frost date";
          plantAfterFrost = "Killed by any frost";
        } else {
          plantBeforeFrost = "1-2 weeks after last frost";
          plantAfterFrost = "Needs warm soil (60\u00B0F+)";
        }

        return {
          primary: { label: "Growing Season", value: `${data.seasonDays} days` },
          details: [
            { label: "Last spring frost (avg)", value: data.lastFrost },
            { label: "First fall frost (avg)", value: data.firstFrost },
            { label: "USDA Zone", value: `${zone}` },
            { label: "When to plant outdoors", value: plantBeforeFrost },
            { label: "Frost tolerance", value: plantAfterFrost },
          ],
          note: "These are average dates and can vary by 2-3 weeks. Check local weather forecasts before planting. Microclimates in your yard may differ.",
        };
      },
    },
    {
      id: "seed-start",
      name: "Seed Starting Date",
      description: "Calculate when to start seeds indoors based on frost date",
      fields: [
        { name: "lastFrostMonth", label: "Last Frost Month", type: "select", options: [
          { label: "February", value: "2" },
          { label: "March", value: "3" },
          { label: "April", value: "4" },
          { label: "May", value: "5" },
          { label: "June", value: "6" },
        ], defaultValue: "4" },
        { name: "lastFrostDay", label: "Last Frost Day of Month", type: "number", placeholder: "e.g. 15", defaultValue: 15 },
        { name: "weeksIndoors", label: "Weeks to Start Indoors Before Frost", type: "select", options: [
          { label: "4 weeks (lettuce, broccoli)", value: "4" },
          { label: "6 weeks (peppers, eggplant)", value: "6" },
          { label: "8 weeks (tomatoes)", value: "8" },
          { label: "10 weeks (onions, celery)", value: "10" },
          { label: "12 weeks (slow growers)", value: "12" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        const month = parseInt(inputs.lastFrostMonth as string) || 4;
        const day = (inputs.lastFrostDay as number) || 15;
        const weeks = parseInt(inputs.weeksIndoors as string) || 8;

        const frostDate = new Date(2025, month - 1, day);
        const startDate = new Date(frostDate.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
        const transplantDate = new Date(frostDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        return {
          primary: { label: "Start Seeds Indoors", value: `${months[startDate.getMonth()]} ${startDate.getDate()}` },
          details: [
            { label: "Last frost date", value: `${months[month - 1]} ${day}` },
            { label: "Weeks before frost", value: `${weeks} weeks` },
            { label: "Safe transplant date", value: `${months[transplantDate.getMonth()]} ${transplantDate.getDate()}` },
            { label: "Start hardening off", value: `1-2 weeks before transplant` },
          ],
          note: "Start seeds under grow lights or in a sunny south-facing window. Harden off seedlings by gradually exposing them to outdoor conditions over 7-10 days before transplanting.",
        };
      },
    },
  ],
  relatedSlugs: ["seed-germination-calculator", "vegetable-garden-size-calculator", "garden-row-spacing-calculator"],
  faq: [
    { question: "How do I find my last frost date?", answer: "Check with your local agricultural extension office or search online using your zip code. The USDA Plant Hardiness Zone Map provides general guidance. Local frost dates can vary significantly by elevation and microclimate." },
    { question: "When should I start seeds indoors?", answer: "Tomatoes: 6-8 weeks before last frost. Peppers: 8-10 weeks. Broccoli/cabbage: 4-6 weeks. Lettuce: 4 weeks. Always check the specific seed packet for recommendations." },
  ],
  formula: "Seed Start Date = Last Frost Date - (Weeks Indoors \u00D7 7 days)",
};
