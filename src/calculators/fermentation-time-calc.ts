import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fermentationTimeCalculator: CalculatorDefinition = {
  slug: "fermentation-time-calculator",
  title: "Fermentation Time Calculator",
  description:
    "Free fermentation time calculator for sauerkraut, kimchi, pickles, yogurt, and more. Estimate fermentation duration based on food type, temperature, and salt concentration.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fermentation time",
    "sauerkraut fermentation",
    "kimchi time",
    "lacto fermentation",
    "fermented vegetables",
    "pickle fermentation",
  ],
  variants: [
    {
      id: "vegetables",
      name: "Vegetable Fermentation",
      description:
        "Fermentation times for lacto-fermented vegetables",
      fields: [
        {
          name: "food",
          label: "Food Type",
          type: "select",
          options: [
            { label: "Sauerkraut", value: "sauerkraut" },
            { label: "Kimchi", value: "kimchi" },
            { label: "Dill Pickles (cucumbers)", value: "pickles" },
            { label: "Fermented Hot Sauce", value: "hot_sauce" },
            { label: "Pickled Carrots", value: "carrots" },
            { label: "Pickled Beets", value: "beets" },
            { label: "Fermented Salsa", value: "salsa" },
            { label: "Curtido (cabbage relish)", value: "curtido" },
          ],
          defaultValue: "sauerkraut",
        },
        {
          name: "temperature",
          label: "Ambient Temperature (\u00b0F)",
          type: "number",
          placeholder: "e.g. 70",
          min: 55,
          max: 85,
          step: 1,
          defaultValue: 70,
        },
        {
          name: "saltPct",
          label: "Salt Concentration",
          type: "select",
          options: [
            { label: "2% (standard)", value: "2" },
            { label: "2.5%", value: "2.5" },
            { label: "3% (saltier, slower)", value: "3" },
            { label: "3.5%", value: "3.5" },
            { label: "5% (brine pickles)", value: "5" },
          ],
          defaultValue: "2",
        },
      ],
      calculate: (inputs) => {
        const food = inputs.food as string;
        const temperature = parseFloat(inputs.temperature as string);
        const saltPct = parseFloat(inputs.saltPct as string);
        if (!temperature) return null;

        // Base fermentation days at 68F, 2% salt
        const baseData: Record<string, { minDays: number; maxDays: number; idealDays: number }> = {
          sauerkraut: { minDays: 7, maxDays: 30, idealDays: 21 },
          kimchi: { minDays: 3, maxDays: 14, idealDays: 7 },
          pickles: { minDays: 3, maxDays: 7, idealDays: 5 },
          hot_sauce: { minDays: 5, maxDays: 14, idealDays: 7 },
          carrots: { minDays: 3, maxDays: 10, idealDays: 5 },
          beets: { minDays: 5, maxDays: 14, idealDays: 7 },
          salsa: { minDays: 2, maxDays: 5, idealDays: 3 },
          curtido: { minDays: 1, maxDays: 5, idealDays: 3 },
        };

        const data = baseData[food] || baseData.sauerkraut;

        // Temperature adjustment: fermentation roughly doubles in speed per 15F increase
        const tempFactor = Math.pow(2, (68 - temperature) / 15);

        // Higher salt slows fermentation
        const saltFactor = saltPct / 2;

        const adjustedMin = Math.max(1, Math.round(data.minDays * tempFactor * saltFactor));
        const adjustedMax = Math.round(data.maxDays * tempFactor * saltFactor);
        const adjustedIdeal = Math.round(data.idealDays * tempFactor * saltFactor);

        return {
          primary: {
            label: `${food.charAt(0).toUpperCase() + food.slice(1).replace(/_/g, " ")} at ${formatNumber(temperature)}\u00b0F`,
            value: `${formatNumber(adjustedMin)}-${formatNumber(adjustedMax)} days`,
          },
          details: [
            { label: "Minimum Fermentation", value: `${formatNumber(adjustedMin)} days` },
            { label: "Ideal/Recommended", value: `~${formatNumber(adjustedIdeal)} days` },
            { label: "Maximum (before over-ferment)", value: `${formatNumber(adjustedMax)} days` },
            { label: "Temperature", value: `${formatNumber(temperature)}\u00b0F (${formatNumber((temperature - 32) * 5 / 9, 0)}\u00b0C)` },
            { label: "Salt Concentration", value: `${formatNumber(saltPct, 1)}%` },
          ],
          note: temperature > 78
            ? "Higher temperatures speed fermentation but can produce off-flavors. Consider moving to a cooler spot."
            : "Taste periodically and refrigerate when it reaches your preferred flavor. The tang will increase over time.",
        };
      },
    },
    {
      id: "dairy",
      name: "Dairy Fermentation",
      description: "Fermentation times for yogurt, kefir, and other dairy",
      fields: [
        {
          name: "product",
          label: "Product",
          type: "select",
          options: [
            { label: "Yogurt (regular)", value: "yogurt" },
            { label: "Greek Yogurt (strained)", value: "greek_yogurt" },
            { label: "Milk Kefir", value: "kefir" },
            { label: "Sour Cream", value: "sour_cream" },
            { label: "Cream Cheese", value: "cream_cheese" },
            { label: "Buttermilk", value: "buttermilk" },
          ],
          defaultValue: "yogurt",
        },
        {
          name: "temperature",
          label: "Fermentation Temperature (\u00b0F)",
          type: "number",
          placeholder: "e.g. 110",
          min: 65,
          max: 120,
          step: 1,
        },
      ],
      calculate: (inputs) => {
        const product = inputs.product as string;
        const temperature = parseFloat(inputs.temperature as string);
        if (!temperature) return null;

        const dairyData: Record<string, { idealTempF: number; hours: number; note: string }> = {
          yogurt: { idealTempF: 110, hours: 8, note: "Incubate at 108-112\u00b0F. Longer = tangier." },
          greek_yogurt: { idealTempF: 110, hours: 10, note: "Ferment like yogurt, then strain through cheesecloth 2-4 hours." },
          kefir: { idealTempF: 72, hours: 24, note: "Room temperature fermentation. Ferments faster in warmer rooms." },
          sour_cream: { idealTempF: 72, hours: 24, note: "Use heavy cream with mesophilic culture." },
          cream_cheese: { idealTempF: 72, hours: 12, note: "Culture then drain through cheesecloth." },
          buttermilk: { idealTempF: 72, hours: 18, note: "Use mesophilic culture at room temperature." },
        };

        const data = dairyData[product] || dairyData.yogurt;
        const tempDiff = data.idealTempF - temperature;
        const tempFactor = Math.pow(2, tempDiff / 15);
        const adjustedHours = Math.round(data.hours * tempFactor);

        return {
          primary: {
            label: `${product.charAt(0).toUpperCase() + product.slice(1).replace(/_/g, " ")}`,
            value: `~${formatNumber(adjustedHours)} hours`,
          },
          details: [
            { label: "Fermentation Time", value: `~${formatNumber(adjustedHours)} hours` },
            { label: "Ideal Temperature", value: `${formatNumber(data.idealTempF)}\u00b0F` },
            { label: "Your Temperature", value: `${formatNumber(temperature)}\u00b0F` },
          ],
          note: data.note,
        };
      },
    },
  ],
  relatedSlugs: [
    "kombucha-brew-calculator",
    "bread-proofing-calculator",
    "canning-time-calculator",
  ],
  faq: [
    {
      question: "What is the ideal temperature for fermenting vegetables?",
      answer:
        "The ideal temperature for most vegetable fermentation is 65-75\u00b0F (18-24\u00b0C). Below 60\u00b0F fermentation is very slow; above 80\u00b0F it can produce off-flavors and soft textures. Cooler, slower fermentation generally produces better flavor.",
    },
    {
      question: "How much salt do I need for fermentation?",
      answer:
        "For most vegetable ferments, use 2-3% salt by weight of the vegetables. For example, 1 kg of cabbage needs 20-30 g of salt. Too little salt allows harmful bacteria to grow; too much slows fermentation and produces salty results. Use non-iodized salt.",
    },
    {
      question: "How do I know when fermentation is done?",
      answer:
        "Taste it! Fermented vegetables should taste pleasantly tangy and sour. Bubbling will slow or stop as fermentation completes. For sauerkraut, most people prefer 2-4 weeks. Once it tastes right to you, refrigerate to slow further fermentation.",
    },
  ],
  formula:
    "Adjusted Time = Base Time x Temperature Factor x Salt Factor | Temp Factor = 2^((68 - Temp\u00b0F) / 15) | Salt Factor = Salt% / 2%",
};
