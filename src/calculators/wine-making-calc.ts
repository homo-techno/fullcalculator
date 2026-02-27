import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wineMakingCalculator: CalculatorDefinition = {
  slug: "wine-making-calculator",
  title: "Wine Making Calculator",
  description:
    "Free wine making ingredient calculator. Calculate sugar additions, sulfite levels, and acid adjustments for homemade wine from grapes, fruit, or kits.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wine making calculator",
    "homemade wine calculator",
    "sugar addition wine",
    "sulfite calculator wine",
    "chaptalization calculator",
  ],
  variants: [
    {
      id: "sugar-addition",
      name: "Sugar & ABV Calculator",
      description: "Calculate sugar needed for target alcohol level",
      fields: [
        {
          name: "batchGallons",
          label: "Batch Size (gallons)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 100,
          step: 0.5,
        },
        {
          name: "currentBrix",
          label: "Current Brix (sugar content)",
          type: "number",
          placeholder: "e.g. 22",
          min: 5,
          max: 35,
          step: 0.5,
        },
        {
          name: "targetAbv",
          label: "Target ABV (%)",
          type: "number",
          placeholder: "e.g. 12",
          min: 5,
          max: 20,
          step: 0.5,
        },
      ],
      calculate: (inputs) => {
        const gallons = parseFloat(inputs.batchGallons as string);
        const currentBrix = parseFloat(inputs.currentBrix as string);
        const targetAbv = parseFloat(inputs.targetAbv as string);
        if (!gallons || !currentBrix || !targetAbv) return null;

        // Brix to potential alcohol: roughly Brix * 0.55 = potential ABV
        const currentPotentialAbv = currentBrix * 0.55;
        const neededAdditionalAbv = Math.max(0, targetAbv - currentPotentialAbv);

        // Sugar needed: approximately 2.25 oz sugar per gallon raises ABV by 1%
        const sugarOzPerGallon = neededAdditionalAbv * 2.25;
        const totalSugarOz = sugarOzPerGallon * gallons;
        const totalSugarLbs = totalSugarOz / 16;
        const totalSugarKg = totalSugarLbs * 0.4536;
        const totalSugarCups = totalSugarOz / 7; // about 7 oz per cup of sugar

        // Specific gravity
        const currentSG = 1 + (currentBrix / (258.6 - (currentBrix * 0.880)));
        const targetBrix = targetAbv / 0.55;
        const targetSG = 1 + (targetBrix / (258.6 - (targetBrix * 0.880)));

        return {
          primary: {
            label: "Sugar to Add",
            value: formatNumber(totalSugarLbs, 1) + " lbs",
          },
          details: [
            { label: "Sugar (oz)", value: formatNumber(totalSugarOz, 0) },
            { label: "Sugar (kg)", value: formatNumber(totalSugarKg, 2) },
            { label: "Sugar (cups approx)", value: formatNumber(totalSugarCups, 1) },
            { label: "Current Potential ABV", value: formatNumber(currentPotentialAbv, 1) + "%" },
            { label: "Target ABV", value: formatNumber(targetAbv, 1) + "%" },
            { label: "Current Specific Gravity", value: formatNumber(currentSG, 3) },
            { label: "Target Starting SG", value: formatNumber(targetSG, 3) },
          ],
          note: currentPotentialAbv >= targetAbv
            ? "Your juice already has enough sugar for your target ABV. No additional sugar needed."
            : "Add sugar gradually and measure with a hydrometer. Dissolve in warm must for even distribution.",
        };
      },
    },
    {
      id: "sulfite",
      name: "Sulfite (SO2) Calculator",
      description: "Calculate campden tablet / metabisulfite additions",
      fields: [
        {
          name: "batchGallons",
          label: "Batch Size (gallons)",
          type: "number",
          placeholder: "e.g. 5",
          min: 1,
          max: 100,
        },
        {
          name: "targetPpm",
          label: "Target Free SO2 (ppm)",
          type: "select",
          options: [
            { label: "25 ppm (light white/rose)", value: "25" },
            { label: "35 ppm (standard white)", value: "35" },
            { label: "50 ppm (standard red)", value: "50" },
            { label: "60 ppm (sweet wine/high pH)", value: "60" },
          ],
          defaultValue: "50",
        },
        {
          name: "currentPpm",
          label: "Current Free SO2 (ppm)",
          type: "number",
          placeholder: "e.g. 10",
          min: 0,
          max: 100,
          defaultValue: 0,
        },
        {
          name: "form",
          label: "Addition Form",
          type: "select",
          options: [
            { label: "Campden Tablets", value: "campden" },
            { label: "Potassium Metabisulfite (powder)", value: "kmeta" },
          ],
          defaultValue: "campden",
        },
      ],
      calculate: (inputs) => {
        const gallons = parseFloat(inputs.batchGallons as string);
        const targetPpm = parseFloat(inputs.targetPpm as string);
        const currentPpm = parseFloat(inputs.currentPpm as string) || 0;
        const form = inputs.form as string;
        if (!gallons || !targetPpm) return null;

        const neededPpm = Math.max(0, targetPpm - currentPpm);
        const liters = gallons * 3.785;

        // 1 Campden tablet per gallon = ~67 ppm SO2
        // Potassium metabisulfite: 1 gram per gallon = ~150 ppm
        let campdenTablets = 0;
        let kmetaGrams = 0;

        if (form === "campden") {
          campdenTablets = (neededPpm / 67) * gallons;
        }
        kmetaGrams = (neededPpm * liters) / 1000 * 1.5; // simplified

        return {
          primary: {
            label: form === "campden" ? "Campden Tablets" : "K-Meta Powder",
            value: form === "campden"
              ? formatNumber(campdenTablets, 1) + " tablets"
              : formatNumber(kmetaGrams, 2) + " grams",
          },
          details: [
            { label: "SO2 Increase Needed", value: formatNumber(neededPpm, 0) + " ppm" },
            { label: "Current Free SO2", value: formatNumber(currentPpm, 0) + " ppm" },
            { label: "Target Free SO2", value: formatNumber(targetPpm, 0) + " ppm" },
            { label: "Batch Size", value: formatNumber(gallons, 1) + " gal (" + formatNumber(liters, 1) + " L)" },
            { label: "Campden Tablets", value: formatNumber(campdenTablets, 1) },
            { label: "K-Meta Powder", value: formatNumber(kmetaGrams, 2) + " grams" },
          ],
          note: "Measure free SO2 with a test kit before adding. Higher pH wines need more SO2 for protection. Always dissolve in a small amount of water before adding to wine.",
        };
      },
    },
  ],
  relatedSlugs: ["beer-recipe-scale-calculator", "cooking-converter", "unit-converter"],
  faq: [
    {
      question: "How much sugar do I add to wine?",
      answer:
        "The amount depends on your starting Brix (sugar content) and target ABV. Each Brix degree contributes ~0.55% potential alcohol. To raise ABV by 1%, add approximately 2.25 oz of sugar per gallon. Most table wines target 11-14% ABV.",
    },
    {
      question: "How many campden tablets do I need?",
      answer:
        "One campden tablet per gallon produces approximately 67 ppm of SO2. Most wines need 30-50 ppm free SO2. For a 5-gallon batch at 50 ppm, use about 3-4 tablets. Crush tablets and dissolve in warm water before adding.",
    },
    {
      question: "When should I add sulfites to homemade wine?",
      answer:
        "Add sulfites at crushing (to inhibit wild yeast), after fermentation, at each racking, and at bottling. Typical free SO2 targets are 25-35 ppm for whites and 30-50 ppm for reds. Test with a kit rather than guessing.",
    },
  ],
  formula:
    "Sugar (oz/gal) = (Target ABV - Current Brix × 0.55) × 2.25 | Campden tablets = (Target ppm / 67) × gallons",
};
