import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const canningTimeCalculator: CalculatorDefinition = {
  slug: "canning-time-calculator",
  title: "Canning Processing Time Calculator",
  description:
    "Free canning processing time calculator. Get water bath and pressure canning times adjusted for altitude for fruits, jams, pickles, vegetables, and meats.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "canning time",
    "canning processing time",
    "water bath canning time",
    "pressure canning time",
    "canning altitude adjustment",
    "home canning calculator",
  ],
  variants: [
    {
      id: "water-bath",
      name: "Water Bath Canning",
      description: "Processing times for high-acid foods",
      fields: [
        {
          name: "food",
          label: "Food Type",
          type: "select",
          options: [
            { label: "Fruit Jam / Jelly", value: "jam" },
            { label: "Whole Tomatoes", value: "tomatoes" },
            { label: "Tomato Sauce", value: "tomato_sauce" },
            { label: "Pickles (dill/bread & butter)", value: "pickles" },
            { label: "Salsa", value: "salsa" },
            { label: "Peaches / Pears", value: "peaches" },
            { label: "Applesauce", value: "applesauce" },
            { label: "Berry Preserves", value: "berry" },
            { label: "Fruit Butter (apple/pear)", value: "fruit_butter" },
            { label: "Relish / Chutney", value: "relish" },
          ],
        },
        {
          name: "jarSize",
          label: "Jar Size",
          type: "select",
          options: [
            { label: "Half Pint (8 oz)", value: "half_pint" },
            { label: "Pint (16 oz)", value: "pint" },
            { label: "Quart (32 oz)", value: "quart" },
          ],
        },
        {
          name: "altitude",
          label: "Altitude (feet)",
          type: "select",
          options: [
            { label: "0 - 1,000 ft", value: "0" },
            { label: "1,001 - 3,000 ft", value: "1001" },
            { label: "3,001 - 6,000 ft", value: "3001" },
            { label: "6,001 - 8,000 ft", value: "6001" },
            { label: "8,001 - 10,000 ft", value: "8001" },
          ],
        },
      ],
      calculate: (inputs) => {
        const food = inputs.food as string;
        const jarSize = inputs.jarSize as string;
        const altitude = parseFloat(inputs.altitude as string) || 0;
        if (!food || !jarSize) return null;

        // Base processing times at 0-1000 ft in minutes
        const baseTimes: Record<string, Record<string, number>> = {
          jam: { half_pint: 10, pint: 10, quart: 15 },
          tomatoes: { half_pint: 35, pint: 40, quart: 45 },
          tomato_sauce: { half_pint: 35, pint: 35, quart: 40 },
          pickles: { half_pint: 10, pint: 10, quart: 15 },
          salsa: { half_pint: 15, pint: 15, quart: 20 },
          peaches: { half_pint: 20, pint: 25, quart: 30 },
          applesauce: { half_pint: 15, pint: 15, quart: 20 },
          berry: { half_pint: 10, pint: 15, quart: 15 },
          fruit_butter: { half_pint: 10, pint: 10, quart: 15 },
          relish: { half_pint: 10, pint: 10, quart: 15 },
        };

        const baseTime = baseTimes[food]?.[jarSize] || 15;

        // Altitude adjustment for water bath: add 5 min per 3000 ft above 1000 ft
        let altitudeAdj = 0;
        if (altitude > 0 && altitude <= 1001) altitudeAdj = 0;
        else if (altitude <= 3001) altitudeAdj = 5;
        else if (altitude <= 6001) altitudeAdj = 10;
        else if (altitude <= 8001) altitudeAdj = 15;
        else altitudeAdj = 20;

        const adjustedTime = baseTime + altitudeAdj;

        const foodNames: Record<string, string> = {
          jam: "Fruit Jam/Jelly",
          tomatoes: "Whole Tomatoes",
          tomato_sauce: "Tomato Sauce",
          pickles: "Pickles",
          salsa: "Salsa",
          peaches: "Peaches/Pears",
          applesauce: "Applesauce",
          berry: "Berry Preserves",
          fruit_butter: "Fruit Butter",
          relish: "Relish/Chutney",
        };

        const jarNames: Record<string, string> = {
          half_pint: "Half Pint (8 oz)",
          pint: "Pint (16 oz)",
          quart: "Quart (32 oz)",
        };

        return {
          primary: {
            label: "Processing Time",
            value: adjustedTime + " minutes",
          },
          details: [
            { label: "Food", value: foodNames[food] },
            { label: "Jar Size", value: jarNames[jarSize] },
            { label: "Base Time (sea level)", value: baseTime + " min" },
            { label: "Altitude Adjustment", value: "+" + altitudeAdj + " min" },
            { label: "Total Processing Time", value: adjustedTime + " min" },
            { label: "Method", value: "Water Bath Canning (212\u00B0F / 100\u00B0C)" },
            { label: "Headspace", value: jarSize === "quart" ? "1/2 inch" : "1/4 inch" },
          ],
          note: "Always follow tested canning recipes from USDA or Ball. Do not modify processing times. Start timing only when water reaches a full rolling boil.",
        };
      },
    },
    {
      id: "pressure",
      name: "Pressure Canning",
      description: "Processing times for low-acid foods",
      fields: [
        {
          name: "food",
          label: "Food Type",
          type: "select",
          options: [
            { label: "Green Beans", value: "green_beans" },
            { label: "Corn (whole kernel)", value: "corn" },
            { label: "Carrots", value: "carrots" },
            { label: "Potatoes (cubed)", value: "potatoes" },
            { label: "Chicken / Turkey", value: "poultry" },
            { label: "Beef / Pork", value: "meat" },
            { label: "Beef Stew", value: "stew" },
            { label: "Chili (no beans)", value: "chili" },
            { label: "Bone Broth / Stock", value: "broth" },
          ],
        },
        {
          name: "jarSize",
          label: "Jar Size",
          type: "select",
          options: [
            { label: "Pint (16 oz)", value: "pint" },
            { label: "Quart (32 oz)", value: "quart" },
          ],
        },
        {
          name: "altitude",
          label: "Altitude (feet)",
          type: "select",
          options: [
            { label: "0 - 1,000 ft (10 PSI dial / 10 PSI weighted)", value: "0" },
            { label: "1,001 - 2,000 ft (11 PSI dial / 15 PSI weighted)", value: "1001" },
            { label: "2,001 - 4,000 ft (12 PSI dial / 15 PSI weighted)", value: "2001" },
            { label: "4,001 - 6,000 ft (13 PSI dial / 15 PSI weighted)", value: "4001" },
            { label: "6,001+ ft (14-15 PSI dial / 15 PSI weighted)", value: "6001" },
          ],
        },
      ],
      calculate: (inputs) => {
        const food = inputs.food as string;
        const jarSize = inputs.jarSize as string;
        const altitude = parseFloat(inputs.altitude as string) || 0;
        if (!food || !jarSize) return null;

        // Pressure canning times in minutes at 10 PSI
        const baseTimes: Record<string, Record<string, number>> = {
          green_beans: { pint: 20, quart: 25 },
          corn: { pint: 55, quart: 85 },
          carrots: { pint: 25, quart: 30 },
          potatoes: { pint: 35, quart: 40 },
          poultry: { pint: 75, quart: 90 },
          meat: { pint: 75, quart: 90 },
          stew: { pint: 75, quart: 90 },
          chili: { pint: 75, quart: 90 },
          broth: { pint: 20, quart: 25 },
        };

        const baseTime = baseTimes[food]?.[jarSize] || 75;

        // For pressure canning, adjust pressure not time
        let dialPsi = 10;
        let weightedPsi = 10;
        if (altitude > 0 && altitude <= 1001) { dialPsi = 10; weightedPsi = 10; }
        else if (altitude <= 2001) { dialPsi = 11; weightedPsi = 15; }
        else if (altitude <= 4001) { dialPsi = 12; weightedPsi = 15; }
        else if (altitude <= 6001) { dialPsi = 13; weightedPsi = 15; }
        else { dialPsi = 15; weightedPsi = 15; }

        return {
          primary: {
            label: "Processing Time",
            value: baseTime + " minutes at " + dialPsi + " PSI",
          },
          details: [
            { label: "Processing Time", value: baseTime + " minutes" },
            { label: "Dial Gauge Pressure", value: dialPsi + " PSI" },
            { label: "Weighted Gauge Pressure", value: weightedPsi + " PSI" },
            { label: "Jar Size", value: jarSize === "pint" ? "Pint (16 oz)" : "Quart (32 oz)" },
            { label: "Method", value: "Pressure Canner (NOT a pressure cooker)" },
            { label: "Headspace", value: "1 inch" },
          ],
          note: "Low-acid foods MUST be pressure canned. Water bath canning is NOT safe for these foods. Use a proper pressure canner, not a pressure cooker.",
        };
      },
    },
  ],
  relatedSlugs: ["freezer-storage-calculator", "candy-temperature-calculator"],
  faq: [
    {
      question: "What foods can be water bath canned?",
      answer:
        "Water bath canning is safe for high-acid foods: most fruits, jams, jellies, pickles (vinegar-based), tomatoes (with added acid), salsas, and fruit butters. The pH must be 4.6 or below.",
    },
    {
      question: "Why does altitude affect canning times?",
      answer:
        "Water boils at a lower temperature at higher altitudes. At sea level, water boils at 212\u00B0F. At 5,000 feet, it boils at about 203\u00B0F. Longer processing times or higher pressure compensates for this lower temperature.",
    },
    {
      question: "Can I use a pressure cooker for canning?",
      answer:
        "No. Instant Pots and electric pressure cookers are NOT safe for pressure canning. They don't reach or maintain the required temperature and pressure consistently. You need a dedicated stovetop pressure canner.",
    },
  ],
  formula:
    "Water Bath: Base time + altitude adjustment (5 min per 3000 ft above 1000 ft). Pressure Canning: Adjust pressure (not time) for altitude. At 0-1000 ft: 10 PSI, add 1 PSI per 2000 ft for dial gauges, or use 15 PSI weighted gauge above 1000 ft.",
};
