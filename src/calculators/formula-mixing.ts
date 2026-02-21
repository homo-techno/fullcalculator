import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const formulaMixingCalculator: CalculatorDefinition = {
  slug: "formula-mixing-calculator",
  title: "Baby Formula Mixing Calculator",
  description:
    "Free baby formula mixing calculator. Get exact water-to-powder ratios for different formula brands, bottle sizes, and concentrations.",
  category: "Health",
  categorySlug: "health",
  icon: "H",
  keywords: [
    "formula mixing",
    "formula ratio",
    "formula water ratio",
    "how to mix formula",
    "formula scoop calculator",
  ],
  variants: [
    {
      id: "powder-formula",
      name: "Powder Formula Mixing",
      description: "Calculate powder and water amounts for bottles",
      fields: [
        {
          name: "formulaType",
          label: "Formula Type",
          type: "select",
          options: [
            { label: "Standard (1 scoop per 2 oz water)", value: "standard" },
            { label: "European (1 scoop per 1 oz water)", value: "european" },
            { label: "Similac (1 scoop per 2 oz water)", value: "similac" },
            { label: "Enfamil (1 scoop per 2 oz water)", value: "enfamil" },
          ],
          defaultValue: "standard",
        },
        {
          name: "bottleSize",
          label: "Desired Bottle Size (oz)",
          type: "number",
          placeholder: "e.g. 4",
          min: 1,
          max: 12,
        },
        {
          name: "numberOfBottles",
          label: "Number of Bottles to Prepare",
          type: "number",
          placeholder: "e.g. 1",
          min: 1,
          max: 12,
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const formulaType = inputs.formulaType as string;
        const bottleSize = inputs.bottleSize as number;
        const numBottles = (inputs.numberOfBottles as number) || 1;
        if (!bottleSize) return null;

        // Scoop sizes and ratios
        let ozPerScoop: number;
        let scoopGrams: number;
        let brandNote: string;

        switch (formulaType) {
          case "european":
            ozPerScoop = 1;
            scoopGrams = 4.4;
            brandNote = "European brands (HiPP, Holle): 1 scoop per 1 oz (30ml) water";
            break;
          case "similac":
            ozPerScoop = 2;
            scoopGrams = 8.5;
            brandNote = "Similac: 1 unpacked level scoop per 2 oz (60ml) water";
            break;
          case "enfamil":
            ozPerScoop = 2;
            scoopGrams = 8.7;
            brandNote = "Enfamil: 1 unpacked level scoop per 2 oz (60ml) water";
            break;
          default:
            ozPerScoop = 2;
            scoopGrams = 8.5;
            brandNote = "Standard US: 1 unpacked level scoop per 2 oz (60ml) water";
        }

        const scoopsPerBottle = bottleSize / ozPerScoop;
        const totalScoops = scoopsPerBottle * numBottles;
        const totalWaterOz = bottleSize * numBottles;
        const totalWaterMl = totalWaterOz * 29.574;
        const totalPowderGrams = totalScoops * scoopGrams;
        const caloriesPerOz = 20; // Standard 20 cal/oz
        const totalCalories = bottleSize * caloriesPerOz;

        return {
          primary: {
            label: "Scoops Per Bottle",
            value: `${formatNumber(scoopsPerBottle, 1)} scoops`,
          },
          details: [
            { label: "Water Per Bottle", value: `${formatNumber(bottleSize, 0)} oz (${formatNumber(bottleSize * 29.574, 0)} ml)` },
            { label: "Powder Per Bottle", value: `${formatNumber(scoopsPerBottle * scoopGrams, 1)} grams` },
            { label: "Total Scoops (all bottles)", value: `${formatNumber(totalScoops, 1)} scoops` },
            { label: "Total Water (all bottles)", value: `${formatNumber(totalWaterOz, 0)} oz (${formatNumber(totalWaterMl, 0)} ml)` },
            { label: "Total Powder (all bottles)", value: `${formatNumber(totalPowderGrams, 1)} grams` },
            { label: "Calories Per Bottle", value: `${totalCalories} kcal (${caloriesPerOz} kcal/oz)` },
            { label: "Mixing Ratio", value: brandNote },
          ],
          note: "Always follow your specific formula brand's instructions. Add water to the bottle first, then powder. Use the scoop provided with your formula. Never add extra water or powder to change concentration unless directed by your pediatrician.",
        };
      },
    },
  ],
  relatedSlugs: ["baby-formula-calculator", "breast-milk-intake-calculator", "baby-feeding-schedule-calculator"],
  faq: [
    {
      question: "How do I properly mix baby formula?",
      answer:
        "1) Wash hands thoroughly. 2) Add the measured water to the bottle first. 3) Add the correct number of level, unpacked scoops. 4) Cap and swirl or shake gently. 5) Test temperature on your wrist. Always use the scoop that comes with the formula and follow package directions exactly.",
    },
    {
      question: "Can I use tap water to mix formula?",
      answer:
        "In most areas with safe municipal water, tap water is fine for mixing formula after the first 3 months. For newborns, many pediatricians recommend using boiled and cooled water or nursery water. If your water has high fluoride levels or you use well water, consult your pediatrician.",
    },
    {
      question: "How long is mixed formula good for?",
      answer:
        "Prepared formula should be used within 2 hours at room temperature or stored in the refrigerator for up to 24 hours. Once a baby begins drinking from a bottle, it should be used within 1 hour and then discarded. Never reheat or re-serve leftover formula.",
    },
  ],
  formula:
    "Standard: 1 level scoop per 2 oz water | European: 1 scoop per 1 oz water | Calories = 20 kcal per oz (standard concentration) | 1 oz = 29.574 ml.",
};
