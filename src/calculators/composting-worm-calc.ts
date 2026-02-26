import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const compostingWormCalculator: CalculatorDefinition = {
  slug: "composting-worm-calc",
  title: "Worm Composting Bin Calculator",
  description:
    "Free worm composting (vermicomposting) bin sizing calculator. Calculate the number of worms, bin size, and bedding needed based on your food waste volume.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "worm composting calculator",
    "vermicomposting",
    "worm bin size",
    "red wiggler worms",
    "compost bin calculator",
    "worm farm calculator",
    "vermiculture",
  ],
  variants: [
    {
      id: "bin-sizing",
      name: "Worm Bin Sizing",
      description: "Calculate bin size and worm count from food waste volume",
      fields: [
        {
          name: "wasteLbs",
          label: "Food Waste per Week (lbs)",
          type: "number",
          placeholder: "e.g. 5",
        },
        {
          name: "household",
          label: "Household Size",
          type: "select",
          options: [
            { label: "1 person (~2 lbs/week)", value: "1" },
            { label: "2 people (~4 lbs/week)", value: "2" },
            { label: "3-4 people (~6 lbs/week)", value: "4" },
            { label: "5-6 people (~8 lbs/week)", value: "6" },
          ],
          defaultValue: "2",
        },
        {
          name: "climate",
          label: "Climate / Location",
          type: "select",
          options: [
            { label: "Indoor (year-round)", value: "indoor" },
            { label: "Temperate outdoor", value: "temperate" },
            { label: "Hot climate outdoor", value: "hot" },
            { label: "Cold climate (seasonal)", value: "cold" },
          ],
          defaultValue: "indoor",
        },
      ],
      calculate: (inputs) => {
        const wasteLbs = parseFloat(inputs.wasteLbs as string);
        const household = parseFloat(inputs.household as string);
        const climate = inputs.climate as string;
        if (isNaN(wasteLbs) || wasteLbs <= 0) return null;

        // Red wigglers eat roughly half their body weight per day
        // 1 lb of worms ≈ 1000 worms
        // Need about 2 lbs of worms per 1 lb of waste per week
        const wormsLbs = wasteLbs * 2;
        const wormCount = wormsLbs * 1000;

        // Bin size: 1 sq ft of surface area per lb of waste per week
        const binAreaSqFt = wasteLbs;
        const binDepth = 12; // inches standard depth

        // Recommended bin dimensions
        const binWidth = Math.ceil(Math.sqrt(binAreaSqFt) * 12); // inches
        const binLength = Math.ceil((binAreaSqFt / (binWidth / 12)) * 12); // inches

        // Bedding volume (fill bin 2/3 full initially)
        const beddingVolumeCuFt = binAreaSqFt * (binDepth * 0.67 / 12);

        // Climate adjustments
        const climateNotes: Record<string, string> = {
          "indoor": "Ideal 55-77°F. Keep in kitchen, basement, or garage.",
          "temperate": "Move indoors when temps drop below 40°F or rise above 90°F.",
          "hot": "Keep bin in shade. May need ice bottles in summer to cool bin.",
          "cold": "Insulate bin in winter or move indoors. Worms slow below 50°F.",
        };

        // Compost output (roughly 50% of input by weight, every 3-6 months)
        const monthlyCompost = wasteLbs * 4 * 0.5; // monthly input x 50%

        return {
          primary: {
            label: "Worms Needed",
            value: formatNumber(wormsLbs, 1),
            suffix: "lbs of red wigglers",
          },
          details: [
            { label: "Approximate Worm Count", value: formatNumber(wormCount) + " worms" },
            { label: "Bin Surface Area", value: formatNumber(binAreaSqFt, 1) + " sq ft" },
            { label: "Suggested Bin Size", value: formatNumber(binWidth) + "\" x " + formatNumber(binLength) + "\" x " + formatNumber(binDepth) + "\"" },
            { label: "Initial Bedding", value: formatNumber(beddingVolumeCuFt, 1) + " cu ft" },
            { label: "Monthly Compost Output", value: formatNumber(monthlyCompost, 1) + " lbs (after 3-6 months)" },
            { label: "Climate Note", value: climateNotes[climate] || "" },
          ],
        };
      },
    },
    {
      id: "worm-population",
      name: "Worm Population Growth",
      description: "Estimate worm population growth over time",
      fields: [
        {
          name: "startingWorms",
          label: "Starting Worms (lbs)",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
        {
          name: "months",
          label: "Time Period (months)",
          type: "number",
          placeholder: "e.g. 12",
          defaultValue: 12,
        },
        {
          name: "conditions",
          label: "Conditions",
          type: "select",
          options: [
            { label: "Optimal (well-maintained)", value: "optimal" },
            { label: "Average (some neglect)", value: "average" },
            { label: "Poor (overcrowded/harsh)", value: "poor" },
          ],
          defaultValue: "optimal",
        },
      ],
      calculate: (inputs) => {
        const startLbs = parseFloat(inputs.startingWorms as string);
        const months = parseFloat(inputs.months as string);
        const conditions = inputs.conditions as string;
        if (isNaN(startLbs) || isNaN(months) || startLbs <= 0 || months <= 0) return null;

        // Red wigglers can double every 60-90 days under optimal conditions
        const doublingMonths: Record<string, number> = {
          "optimal": 2,
          "average": 4,
          "poor": 8,
        };

        const dm = doublingMonths[conditions] || 4;
        const doublings = months / dm;
        const finalLbs = startLbs * Math.pow(2, doublings);
        const finalCount = finalLbs * 1000;

        // Processing capacity
        const weeklyProcessing = finalLbs * 0.5; // half body weight per day * 7 / 7 = per day avg per week

        return {
          primary: {
            label: "Estimated Population",
            value: formatNumber(finalLbs, 1),
            suffix: "lbs",
          },
          details: [
            { label: "Starting Population", value: formatNumber(startLbs * 1000) + " worms" },
            { label: "Final Population", value: formatNumber(Math.round(finalCount)) + " worms" },
            { label: "Doubling Period", value: formatNumber(dm) + " months" },
            { label: "Processing Capacity", value: formatNumber(weeklyProcessing * 7, 1) + " lbs food/week" },
            { label: "Growth Factor", value: formatNumber(Math.pow(2, doublings), 1) + "x" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["rain-garden-calc", "greenhouse-ventilation", "chicken-egg-calc"],
  faq: [
    {
      question: "How many worms do I need for composting?",
      answer:
        "A general rule is 2 lbs of red wiggler worms per 1 lb of food waste per week. For a typical household producing 4 lbs of food waste weekly, start with 2-4 lbs (2,000-4,000 worms). They will multiply to match the food supply.",
    },
    {
      question: "What can I feed composting worms?",
      answer:
        "Feed them fruit/vegetable scraps, coffee grounds, tea bags, crushed eggshells, and small amounts of bread/grains. Avoid meat, dairy, oils, citrus, onions, and spicy foods. Cut waste into small pieces for faster processing.",
    },
    {
      question: "How long does vermicomposting take?",
      answer:
        "Worms can process food waste in 2-3 months under good conditions. A new bin typically produces harvestable compost (castings) in 3-6 months. The worm population will double every 2-3 months if well cared for.",
    },
  ],
  formula:
    "Worms (lbs) = Weekly Waste (lbs) x 2 | Bin Area (sq ft) = Weekly Waste (lbs) x 1 | Population doubles every 2-3 months",
};
