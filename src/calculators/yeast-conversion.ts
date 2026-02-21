import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yeastConversionCalculator: CalculatorDefinition = {
  slug: "yeast-conversion-calculator",
  title: "Yeast Type Conversion Calculator",
  description:
    "Free yeast conversion calculator. Convert between active dry yeast, instant yeast, fresh (cake) yeast, and sourdough starter for bread baking.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "yeast conversion",
    "active dry to instant yeast",
    "fresh yeast to dry",
    "cake yeast conversion",
    "yeast substitute",
    "yeast type converter",
  ],
  variants: [
    {
      id: "convert",
      name: "Convert Yeast Types",
      fields: [
        {
          name: "amount",
          label: "Amount",
          type: "number",
          placeholder: "e.g. 7",
        },
        {
          name: "unit",
          label: "Unit",
          type: "select",
          options: [
            { label: "Grams", value: "grams" },
            { label: "Teaspoons", value: "tsp" },
            { label: "Tablespoons", value: "tbsp" },
            { label: "Packets (7g / 2.25 tsp)", value: "packet" },
            { label: "Ounces", value: "oz" },
          ],
        },
        {
          name: "fromType",
          label: "Convert From",
          type: "select",
          options: [
            { label: "Active Dry Yeast", value: "active_dry" },
            { label: "Instant (Rapid-Rise) Yeast", value: "instant" },
            { label: "Fresh (Cake) Yeast", value: "fresh" },
          ],
        },
      ],
      calculate: (inputs) => {
        const amount = inputs.amount as number;
        const unit = inputs.unit as string;
        const fromType = inputs.fromType as string;
        if (!amount || !unit || !fromType) return null;

        // First convert to grams of active dry yeast as the base unit
        let gramsActiveDry: number;

        // Convert input to grams first
        let inputGrams: number;
        if (unit === "grams") inputGrams = amount;
        else if (unit === "tsp") inputGrams = amount * 3.1; // ~3.1g per tsp for dry yeast
        else if (unit === "tbsp") inputGrams = amount * 9.3;
        else if (unit === "packet") inputGrams = amount * 7;
        else if (unit === "oz") inputGrams = amount * 28.35;
        else inputGrams = amount;

        // Convert to active dry yeast equivalents
        if (fromType === "active_dry") gramsActiveDry = inputGrams;
        else if (fromType === "instant") gramsActiveDry = inputGrams * 1.25; // instant is more potent, need 25% more active dry
        else gramsActiveDry = inputGrams / 2.5; // fresh yeast: use 2.5x the active dry amount
        // So active_dry = fresh / 2.5

        // Calculate all types from active dry base
        const activeDryG = gramsActiveDry;
        const instantG = gramsActiveDry * 0.8; // 20% less instant than active dry
        const freshG = gramsActiveDry * 2.5; // 2.5x more fresh than active dry

        // Convert to teaspoons for convenience
        const activeDryTsp = activeDryG / 3.1;
        const instantTsp = instantG / 3.1;
        const freshTsp = freshG / 4.7; // fresh yeast is denser, ~4.7g per tsp

        // Packets
        const activeDryPackets = activeDryG / 7;
        const instantPackets = instantG / 7;

        return {
          primary: {
            label: "Conversion Results",
            value: formatNumber(activeDryG, 1) + "g active dry = " + formatNumber(instantG, 1) + "g instant",
          },
          details: [
            { label: "Active Dry Yeast", value: formatNumber(activeDryG, 1) + " g (" + formatNumber(activeDryTsp, 1) + " tsp / " + formatNumber(activeDryPackets, 2) + " packets)" },
            { label: "Instant (Rapid-Rise) Yeast", value: formatNumber(instantG, 1) + " g (" + formatNumber(instantTsp, 1) + " tsp / " + formatNumber(instantPackets, 2) + " packets)" },
            { label: "Fresh (Cake) Yeast", value: formatNumber(freshG, 1) + " g (" + formatNumber(freshG / 28.35, 2) + " oz)" },
            { label: "Conversion Ratio", value: "Active Dry : Instant : Fresh = 1 : 0.8 : 2.5" },
          ],
          note: "Active dry yeast should be dissolved in warm water (105-110\u00B0F) before use. Instant yeast can be mixed directly with dry ingredients.",
        };
      },
    },
    {
      id: "packet-guide",
      name: "Yeast Packet Guide",
      description: "How much yeast for different flour amounts",
      fields: [
        {
          name: "flour",
          label: "Flour Amount (cups)",
          type: "number",
          placeholder: "e.g. 4",
        },
        {
          name: "yeastType",
          label: "Yeast Type",
          type: "select",
          options: [
            { label: "Active Dry Yeast", value: "active_dry" },
            { label: "Instant (Rapid-Rise) Yeast", value: "instant" },
            { label: "Fresh (Cake) Yeast", value: "fresh" },
          ],
        },
        {
          name: "riseTime",
          label: "Desired Rise Time",
          type: "select",
          options: [
            { label: "Quick Rise (1-2 hours)", value: "quick" },
            { label: "Standard Rise (2-4 hours)", value: "standard" },
            { label: "Slow Rise / Overnight", value: "slow" },
          ],
        },
      ],
      calculate: (inputs) => {
        const flour = inputs.flour as number;
        const yeastType = inputs.yeastType as string;
        const riseTime = inputs.riseTime as string;
        if (!flour || !yeastType || !riseTime) return null;

        // Standard: 1 packet (7g / 2.25 tsp) per 4 cups of flour
        // Quick: 1.5x standard, Slow: 0.5x standard
        const flourGrams = flour * 120; // 120g per cup
        const baseYeastPer4Cups = 7; // grams active dry
        const yeastPerCup = baseYeastPer4Cups / 4;
        let multiplier: number;
        if (riseTime === "quick") multiplier = 1.5;
        else if (riseTime === "standard") multiplier = 1;
        else multiplier = 0.5;

        let yeastGrams = flour * yeastPerCup * multiplier;

        // Adjust for yeast type
        if (yeastType === "instant") yeastGrams *= 0.8;
        else if (yeastType === "fresh") yeastGrams *= 2.5;

        const yeastTsp = yeastType === "fresh" ? yeastGrams / 4.7 : yeastGrams / 3.1;
        const packets = yeastType === "fresh" ? 0 : yeastGrams / 7;

        const typeNames: Record<string, string> = {
          active_dry: "Active Dry Yeast",
          instant: "Instant Yeast",
          fresh: "Fresh (Cake) Yeast",
        };

        return {
          primary: {
            label: typeNames[yeastType] + " Needed",
            value: formatNumber(yeastGrams, 1) + " g",
          },
          details: [
            { label: "Yeast (grams)", value: formatNumber(yeastGrams, 1) + " g" },
            { label: "Yeast (teaspoons)", value: formatNumber(yeastTsp, 1) + " tsp" },
            { label: "Packets (7g each)", value: yeastType === "fresh" ? "N/A" : formatNumber(packets, 2) },
            { label: "Flour", value: flour + " cups (" + formatNumber(flourGrams, 0) + "g)" },
            { label: "Rise Time", value: riseTime === "quick" ? "1-2 hours" : riseTime === "standard" ? "2-4 hours" : "8-12 hours (or overnight in fridge)" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["bread-recipe-calculator", "sourdough-starter-calculator", "pizza-dough-calculator"],
  faq: [
    {
      question: "What is the difference between active dry and instant yeast?",
      answer:
        "Active dry yeast has larger granules and must be dissolved in warm water (105-110\u00B0F) before use. Instant (rapid-rise) yeast has finer granules and can be mixed directly with dry ingredients. Instant yeast is about 25% more potent, so you need 20% less.",
    },
    {
      question: "How do I substitute fresh yeast for dry yeast?",
      answer:
        "Use 2.5 times the amount of fresh (cake) yeast compared to active dry yeast. So if a recipe calls for 7g (1 packet) of active dry yeast, use about 17-18g of fresh yeast. Fresh yeast is crumbled directly into the dough.",
    },
    {
      question: "How much yeast is in one packet?",
      answer:
        "One standard packet of active dry or instant yeast contains 7 grams (about 2.25 teaspoons or 0.25 oz). One packet is enough for recipes using up to 4 cups (480g) of flour.",
    },
  ],
  formula:
    "Conversion Ratios: Active Dry : Instant : Fresh = 1 : 0.8 : 2.5. One packet = 7g = 2.25 tsp. Standard usage: 1 packet per 4 cups flour. Quick rise: 1.5x yeast. Slow rise: 0.5x yeast. Proof active dry at 105-110\u00B0F.",
};
