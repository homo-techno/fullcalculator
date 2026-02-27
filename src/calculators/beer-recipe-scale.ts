import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beerRecipeScaleCalculator: CalculatorDefinition = {
  slug: "beer-recipe-scale-calculator",
  title: "Homebrew Beer Recipe Scaler",
  description:
    "Free homebrew beer recipe scaling calculator. Scale grain bills, hops, yeast, and water volumes to any batch size while maintaining proper ratios.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "homebrew recipe scaler",
    "beer recipe calculator",
    "batch size scaler",
    "homebrew calculator",
    "grain bill calculator",
  ],
  variants: [
    {
      id: "batch-scale",
      name: "Batch Size Scaler",
      description: "Scale a recipe to a different batch size",
      fields: [
        {
          name: "originalBatch",
          label: "Original Batch Size (gallons)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.5,
          max: 50,
          step: 0.5,
        },
        {
          name: "targetBatch",
          label: "Target Batch Size (gallons)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.5,
          max: 50,
          step: 0.5,
        },
        {
          name: "originalGrainLbs",
          label: "Original Grain Bill (lbs)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.5,
          step: 0.25,
        },
        {
          name: "originalHopsOz",
          label: "Original Total Hops (oz)",
          type: "number",
          placeholder: "e.g. 2",
          min: 0.1,
          step: 0.25,
        },
        {
          name: "originalYeast",
          label: "Original Yeast (packets)",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 10,
        },
      ],
      calculate: (inputs) => {
        const original = parseFloat(inputs.originalBatch as string);
        const target = parseFloat(inputs.targetBatch as string);
        const grainLbs = parseFloat(inputs.originalGrainLbs as string);
        const hopsOz = parseFloat(inputs.originalHopsOz as string);
        const yeastPacks = parseFloat(inputs.originalYeast as string);
        if (!original || !target || !grainLbs || !hopsOz || !yeastPacks) return null;

        const scaleFactor = target / original;

        const newGrain = grainLbs * scaleFactor;
        const newHops = hopsOz * scaleFactor;
        const newYeast = Math.ceil(yeastPacks * scaleFactor);

        // Water calculations (typical 1.25 gal water per lb grain for mash + sparge)
        const mashWater = newGrain * 1.25;
        const totalWater = target * 1.5; // account for boil-off and absorption
        const spargeWater = totalWater - mashWater;

        const newGrainKg = newGrain * 0.4536;
        const newHopsG = newHops * 28.35;

        return {
          primary: {
            label: "Scale Factor",
            value: formatNumber(scaleFactor, 2) + "x",
          },
          details: [
            { label: "Grain Bill", value: formatNumber(newGrain, 2) + " lbs (" + formatNumber(newGrainKg, 2) + " kg)" },
            { label: "Total Hops", value: formatNumber(newHops, 2) + " oz (" + formatNumber(newHopsG, 1) + " g)" },
            { label: "Yeast Packets", value: formatNumber(newYeast, 0) },
            { label: "Mash Water", value: formatNumber(mashWater, 1) + " gallons" },
            { label: "Sparge Water", value: formatNumber(Math.max(spargeWater, 0), 1) + " gallons" },
            { label: "Total Water", value: formatNumber(totalWater, 1) + " gallons" },
            { label: "Target Batch", value: formatNumber(target, 1) + " gallons" },
          ],
          note: "Hop utilization may change with batch volume. For large batch increases, consider adjusting hop additions slightly. Yeast should always be rounded up.",
        };
      },
    },
    {
      id: "gravity-calc",
      name: "OG/FG & ABV Calculator",
      description: "Calculate original gravity, final gravity, and ABV",
      fields: [
        {
          name: "grainLbs",
          label: "Total Grain (lbs)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0.5,
          step: 0.25,
        },
        {
          name: "batchGallons",
          label: "Batch Size (gallons)",
          type: "number",
          placeholder: "e.g. 5",
          min: 0.5,
          max: 50,
          step: 0.5,
        },
        {
          name: "efficiency",
          label: "Mash Efficiency",
          type: "select",
          options: [
            { label: "60% (BIAB, beginner)", value: "60" },
            { label: "70% (typical all-grain)", value: "70" },
            { label: "75% (good all-grain)", value: "75" },
            { label: "80% (experienced brewer)", value: "80" },
          ],
          defaultValue: "70",
        },
        {
          name: "attenuation",
          label: "Yeast Attenuation",
          type: "select",
          options: [
            { label: "65% (low - English ale)", value: "65" },
            { label: "73% (medium - American ale)", value: "73" },
            { label: "78% (high - lager, Belgian)", value: "78" },
            { label: "85% (very high - saison)", value: "85" },
          ],
          defaultValue: "73",
        },
      ],
      calculate: (inputs) => {
        const grainLbs = parseFloat(inputs.grainLbs as string);
        const gallons = parseFloat(inputs.batchGallons as string);
        const efficiency = parseFloat(inputs.efficiency as string) / 100;
        const attenuation = parseFloat(inputs.attenuation as string) / 100;
        if (!grainLbs || !gallons) return null;

        // Average grain potential: 36 PPG (points per pound per gallon) for base malt
        const avgPPG = 36;
        const totalPoints = grainLbs * avgPPG * efficiency;
        const gravityPoints = totalPoints / gallons;
        const og = 1 + gravityPoints / 1000;

        // Final gravity
        const fgPoints = gravityPoints * (1 - attenuation);
        const fg = 1 + fgPoints / 1000;

        // ABV
        const abv = (og - fg) * 131.25;

        // Calories per 12oz
        const calories = (6.9 * ((og - 1) * 1000) + 4 * ((fg - 1) * 1000 - (og - 1) * 1000)) * 3.55 * 0.12;
        const caloriesEst = 1881.22 * fg * (og - fg) / (1.775 - og) + 3550 * (fg - 1);

        // Color estimate (SRM rough)
        const srm = grainLbs * 3 / gallons;

        return {
          primary: {
            label: "Original Gravity",
            value: formatNumber(og, 3),
          },
          details: [
            { label: "Final Gravity", value: formatNumber(fg, 3) },
            { label: "ABV", value: formatNumber(abv, 1) + "%" },
            { label: "Gravity Points", value: formatNumber(gravityPoints, 0) },
            { label: "Estimated Calories (12 oz)", value: formatNumber(Math.max(caloriesEst, 100), 0) },
            { label: "Est. Color (SRM)", value: formatNumber(srm, 0) },
            { label: "Mash Efficiency", value: formatNumber(efficiency * 100, 0) + "%" },
          ],
          note: "OG/FG depends on grain types. Specialty malts (crystal, roasted) have different PPG values. Use brewing software for precise recipes.",
        };
      },
    },
  ],
  relatedSlugs: ["cooking-converter", "unit-converter", "percentage-calculator"],
  faq: [
    {
      question: "How do I scale a homebrew recipe?",
      answer:
        "Multiply all grain and hop amounts by the ratio of new batch size to original batch size. For example, scaling a 5-gallon recipe to 10 gallons means multiplying everything by 2.0. Yeast should be rounded up, and hop utilization may change slightly with volume.",
    },
    {
      question: "What is a good mash efficiency for homebrewing?",
      answer:
        "Beginning all-grain brewers typically achieve 65-70% efficiency. Experienced brewers with refined processes get 75-80%. Brew-in-a-bag (BIAB) typically yields 60-70%. Extract brewing is effectively 100% since the sugars are already extracted.",
    },
    {
      question: "How do I calculate ABV from gravity readings?",
      answer:
        "ABV = (OG - FG) x 131.25. For example, a beer with OG 1.050 and FG 1.010 has ABV = (1.050 - 1.010) x 131.25 = 5.25%. Always measure gravity at the same temperature (typically 60F/15.5C) for accuracy.",
    },
  ],
  formula:
    "Scale Factor = Target Volume / Original Volume | OG = 1 + (Grain lbs × PPG × Efficiency / Volume) / 1000 | ABV = (OG - FG) × 131.25",
};
