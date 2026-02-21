import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const growingSeasonCalculator: CalculatorDefinition = {
  slug: "growing-season-calculator",
  title: "Growing Season Calculator",
  description: "Free growing season calculator. Determine your USDA hardiness zone, growing season length, and planting dates based on location.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["growing season calculator", "planting zone calculator", "USDA hardiness zone", "frost date calculator", "growing zone calculator"],
  variants: [
    {
      id: "by-zone",
      name: "By USDA Zone",
      description: "Get growing season details for your hardiness zone",
      fields: [
        { name: "zone", label: "USDA Hardiness Zone", type: "select", options: [
          { label: "Zone 3 (-40 to -30°F)", value: "3" },
          { label: "Zone 4 (-30 to -20°F)", value: "4" },
          { label: "Zone 5 (-20 to -10°F)", value: "5" },
          { label: "Zone 6 (-10 to 0°F)", value: "6" },
          { label: "Zone 7 (0 to 10°F)", value: "7" },
          { label: "Zone 8 (10 to 20°F)", value: "8" },
          { label: "Zone 9 (20 to 30°F)", value: "9" },
          { label: "Zone 10 (30 to 40°F)", value: "10" },
          { label: "Zone 11 (40 to 50°F)", value: "11" },
        ] },
      ],
      calculate: (inputs) => {
        const zone = inputs.zone as string;
        if (!zone) return null;
        const zoneData: Record<string, { days: number; lastFrost: string; firstFrost: string; plantStart: string }> = {
          "3": { days: 100, lastFrost: "May 15-30", firstFrost: "Sep 1-15", plantStart: "June 1" },
          "4": { days: 120, lastFrost: "May 1-15", firstFrost: "Sep 15-30", plantStart: "May 15" },
          "5": { days: 140, lastFrost: "Apr 15-30", firstFrost: "Oct 1-15", plantStart: "May 1" },
          "6": { days: 170, lastFrost: "Apr 1-15", firstFrost: "Oct 15-31", plantStart: "Apr 15" },
          "7": { days: 200, lastFrost: "Mar 15-31", firstFrost: "Nov 1-15", plantStart: "Apr 1" },
          "8": { days: 240, lastFrost: "Mar 1-15", firstFrost: "Nov 15-30", plantStart: "Mar 15" },
          "9": { days: 270, lastFrost: "Feb 1-15", firstFrost: "Dec 1-15", plantStart: "Feb 15" },
          "10": { days: 320, lastFrost: "Jan 15-31", firstFrost: "Dec 15-31", plantStart: "Feb 1" },
          "11": { days: 365, lastFrost: "Frost-free", firstFrost: "Frost-free", plantStart: "Year-round" },
        };
        const data = zoneData[zone];
        if (!data) return null;
        return {
          primary: { label: "Growing Season Length", value: `${data.days} days` },
          details: [
            { label: "USDA Zone", value: zone },
            { label: "Last spring frost", value: data.lastFrost },
            { label: "First fall frost", value: data.firstFrost },
            { label: "Safe outdoor planting", value: data.plantStart },
            { label: "Weeks of growing season", value: formatNumber(data.days / 7, 0) },
          ],
          note: "These are average dates. Actual frost dates vary by year, elevation, and microclimate. Start seeds indoors 6-8 weeks before the last frost date for warm-season crops.",
        };
      },
    },
    {
      id: "crop-timing",
      name: "Crop Timing",
      description: "Calculate when to plant specific crop types",
      fields: [
        { name: "zone", label: "USDA Zone", type: "select", options: [
          { label: "Zone 3", value: "3" },
          { label: "Zone 4", value: "4" },
          { label: "Zone 5", value: "5" },
          { label: "Zone 6", value: "6" },
          { label: "Zone 7", value: "7" },
          { label: "Zone 8", value: "8" },
          { label: "Zone 9", value: "9" },
          { label: "Zone 10", value: "10" },
        ] },
        { name: "cropType", label: "Crop Type", type: "select", options: [
          { label: "Tomatoes (70-85 days)", value: "tomato" },
          { label: "Peppers (60-90 days)", value: "pepper" },
          { label: "Lettuce (30-60 days)", value: "lettuce" },
          { label: "Beans (50-70 days)", value: "beans" },
          { label: "Corn (60-100 days)", value: "corn" },
          { label: "Squash (50-100 days)", value: "squash" },
          { label: "Peas (55-70 days)", value: "peas" },
          { label: "Carrots (70-80 days)", value: "carrots" },
        ] },
      ],
      calculate: (inputs) => {
        const zone = inputs.zone as string;
        const crop = inputs.cropType as string;
        if (!zone || !crop) return null;
        const lastFrostWeek: Record<string, number> = { "3": 22, "4": 19, "5": 17, "6": 15, "7": 12, "8": 10, "9": 6, "10": 4 };
        const firstFrostWeek: Record<string, number> = { "3": 36, "4": 39, "5": 41, "6": 43, "7": 45, "8": 47, "9": 49, "10": 51 };
        const cropData: Record<string, { daysToHarvest: number; weeksBeforeFrost: number; coldHardy: boolean }> = {
          tomato: { daysToHarvest: 80, weeksBeforeFrost: 0, coldHardy: false },
          pepper: { daysToHarvest: 75, weeksBeforeFrost: 0, coldHardy: false },
          lettuce: { daysToHarvest: 45, weeksBeforeFrost: 4, coldHardy: true },
          beans: { daysToHarvest: 60, weeksBeforeFrost: 0, coldHardy: false },
          corn: { daysToHarvest: 80, weeksBeforeFrost: 0, coldHardy: false },
          squash: { daysToHarvest: 75, weeksBeforeFrost: 0, coldHardy: false },
          peas: { daysToHarvest: 65, weeksBeforeFrost: 4, coldHardy: true },
          carrots: { daysToHarvest: 75, weeksBeforeFrost: 2, coldHardy: true },
        };
        const lf = lastFrostWeek[zone] || 17;
        const ff = firstFrostWeek[zone] || 41;
        const cd = cropData[crop] || cropData.tomato;
        const plantWeek = cd.coldHardy ? lf - cd.weeksBeforeFrost : lf + 1;
        const harvestWeeks = Math.ceil(cd.daysToHarvest / 7);
        const harvestWeek = plantWeek + harvestWeeks;
        const seasonWeeks = ff - lf;
        const canGrow = harvestWeek <= ff + (cd.coldHardy ? 2 : 0);
        const startIndoorsWeek = plantWeek - 6;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const weekToDate = (w: number) => {
          const month = Math.floor((w - 1) / 4.33);
          const week = Math.round(((w - 1) % 4.33) + 1);
          return `${monthNames[Math.min(month, 11)]} week ${Math.min(week, 4)}`;
        };
        return {
          primary: { label: "Plant Outdoors", value: weekToDate(plantWeek) },
          details: [
            { label: "Start seeds indoors", value: weekToDate(startIndoorsWeek) },
            { label: "Expected harvest", value: weekToDate(harvestWeek) },
            { label: "Days to harvest", value: `${cd.daysToHarvest} days` },
            { label: "Growing season", value: `${seasonWeeks} weeks` },
            { label: "Can grow in zone?", value: canGrow ? "Yes" : "Marginal – may not have enough time" },
            { label: "Cold hardy", value: cd.coldHardy ? "Yes – tolerates light frost" : "No – frost sensitive" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["plant-spacing-calculator", "garden-yield-calculator", "frost-depth-calculator"],
  faq: [
    { question: "How do I find my USDA hardiness zone?", answer: "Visit the USDA Plant Hardiness Zone Map at planthardiness.ars.usda.gov and enter your zip code. Zones are based on the average annual minimum winter temperature. Most of the US falls in zones 3-10." },
    { question: "What is the growing season?", answer: "The growing season is the number of frost-free days between the last spring frost and the first fall frost. It ranges from about 100 days in zone 3 to year-round in zone 11. Most vegetables need at least 60-100 frost-free days." },
    { question: "When should I start seeds indoors?", answer: "Start seeds indoors 6-8 weeks before your last frost date for warm-season crops (tomatoes, peppers). Cool-season crops (lettuce, peas) can be direct-sown outdoors 2-4 weeks before the last frost." },
  ],
  formula: "Growing Season = First Fall Frost Date - Last Spring Frost Date (in days)",
};
