import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const sausageMakingCalculator: CalculatorDefinition = {
  slug: "sausage-making-calculator",
  title: "Sausage Making Calculator",
  description:
    "Free sausage making meat, fat, and casing calculator. Calculate ingredient ratios for homemade sausage including meat, fat content, salt, spices, and casing requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "sausage making calculator",
    "sausage recipe calculator",
    "meat to fat ratio",
    "casing calculator",
    "homemade sausage",
  ],
  variants: [
    {
      id: "by-weight",
      name: "By Total Weight",
      description: "Calculate ingredients for a target batch weight",
      fields: [
        {
          name: "totalLbs",
          label: "Total Batch Weight (lbs)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 100,
          step: 0.5,
        },
        {
          name: "sausageType",
          label: "Sausage Style",
          type: "select",
          options: [
            { label: "Bratwurst", value: "bratwurst" },
            { label: "Italian (sweet/hot)", value: "italian" },
            { label: "Breakfast Sausage", value: "breakfast" },
            { label: "Chorizo", value: "chorizo" },
            { label: "Kielbasa", value: "kielbasa" },
            { label: "Summer Sausage", value: "summer" },
          ],
          defaultValue: "italian",
        },
        {
          name: "fatPct",
          label: "Fat Percentage",
          type: "select",
          options: [
            { label: "20% (leaner)", value: "20" },
            { label: "25% (standard)", value: "25" },
            { label: "30% (traditional)", value: "30" },
            { label: "35% (rich)", value: "35" },
          ],
          defaultValue: "25",
        },
        {
          name: "casingType",
          label: "Casing Type",
          type: "select",
          options: [
            { label: "Natural Hog (32-35mm)", value: "hog" },
            { label: "Natural Sheep (22-24mm)", value: "sheep" },
            { label: "Collagen (various)", value: "collagen" },
            { label: "No Casing (bulk/patty)", value: "none" },
          ],
          defaultValue: "hog",
        },
      ],
      calculate: (inputs) => {
        const totalLbs = parseFloat(inputs.totalLbs as string);
        const sausageType = inputs.sausageType as string;
        const fatPct = parseFloat(inputs.fatPct as string) / 100;
        const casingType = inputs.casingType as string;
        if (!totalLbs) return null;

        const fatLbs = totalLbs * fatPct;
        const leanLbs = totalLbs - fatLbs;
        const totalKg = totalLbs * 0.4536;

        // Salt: typically 1.5-2% of total weight
        const saltTbsp = totalLbs * 0.48; // ~1 tbsp per 2 lbs = 1.75% salt
        const saltGrams = totalLbs * 8;

        // Curing salt (for summer sausage only)
        const curingSalt = sausageType === "summer" ? totalLbs * 0.454 : 0; // 1 tsp per 5 lbs

        // Spice amounts per lb
        const spiceProfiles: Record<string, string> = {
          bratwurst: "White pepper, nutmeg, ginger, marjoram",
          italian: "Fennel seed, red pepper flakes, garlic, parsley",
          breakfast: "Sage, black pepper, thyme, brown sugar, red pepper",
          chorizo: "Paprika, chili powder, cumin, garlic, oregano, vinegar",
          kielbasa: "Garlic, marjoram, black pepper, mustard seed",
          summer: "Mustard seed, black pepper, garlic, coriander, cure #1",
        };

        // Casing footage needed (approximately 2 lbs per foot for hog, 1 lb per foot for sheep)
        const casingFeet: Record<string, number> = {
          hog: totalLbs / 2,
          sheep: totalLbs * 1.2,
          collagen: totalLbs / 2,
          none: 0,
        };
        const casingNeeded = casingFeet[casingType] || 0;

        // Links estimate (6-inch links for hog, 4-inch for sheep/breakfast)
        const linkLength = casingType === "sheep" ? 4 : 6;
        const numLinks = casingNeeded > 0 ? Math.floor((casingNeeded * 12) / linkLength) : 0;

        const details = [
          { label: "Lean Meat", value: formatNumber(leanLbs, 1) + " lbs" },
          { label: "Fat (back fat/trim)", value: formatNumber(fatLbs, 1) + " lbs" },
          { label: "Salt", value: formatNumber(saltTbsp, 1) + " tbsp (" + formatNumber(saltGrams, 0) + "g)" },
        ];
        if (curingSalt > 0) {
          details.push({ label: "Cure #1 (Prague Powder)", value: formatNumber(curingSalt, 1) + " tsp" });
        }
        details.push({ label: "Seasoning Profile", value: spiceProfiles[sausageType] || "Custom" });
        if (casingNeeded > 0) {
          details.push({ label: "Casing Needed", value: formatNumber(casingNeeded, 0) + " feet" });
          details.push({ label: "Est. Links (" + formatNumber(linkLength, 0) + '" each)', value: formatNumber(numLinks, 0) });
        }
        details.push({ label: "Total Weight (kg)", value: formatNumber(totalKg, 1) });

        return {
          primary: {
            label: "Lean/Fat Split",
            value: formatNumber(leanLbs, 1) + " / " + formatNumber(fatLbs, 1) + " lbs",
          },
          details,
          note: "Keep meat and fat very cold (32-35F) during grinding and mixing. Re-chill if mixture warms above 40F.",
        };
      },
    },
    {
      id: "casing-calculator",
      name: "Casing Calculator",
      description: "Calculate casing needs for a specific batch",
      fields: [
        {
          name: "meatLbs",
          label: "Total Meat + Fat (lbs)",
          type: "number",
          placeholder: "e.g. 10",
          min: 1,
          max: 100,
        },
        {
          name: "casingType",
          label: "Casing Type",
          type: "select",
          options: [
            { label: "Natural Hog (32-35mm) - standard", value: "hog" },
            { label: "Natural Sheep (22-24mm) - breakfast links", value: "sheep" },
            { label: "Beef Rounds (40-45mm) - ring bologna", value: "beef" },
            { label: "Fibrous (55-65mm) - summer sausage", value: "fibrous" },
          ],
          defaultValue: "hog",
        },
        {
          name: "linkLength",
          label: "Desired Link Length (inches)",
          type: "number",
          placeholder: "e.g. 6",
          min: 2,
          max: 24,
        },
      ],
      calculate: (inputs) => {
        const meatLbs = parseFloat(inputs.meatLbs as string);
        const casingType = inputs.casingType as string;
        const linkLength = parseFloat(inputs.linkLength as string);
        if (!meatLbs || !linkLength) return null;

        // Lbs of meat per foot of casing
        const lbsPerFoot: Record<string, number> = {
          hog: 2.0,
          sheep: 0.8,
          beef: 3.0,
          fibrous: 4.0,
        };

        const rate = lbsPerFoot[casingType] || 2.0;
        const casingFeet = meatLbs / rate;
        const numLinks = Math.floor((casingFeet * 12) / linkLength);
        const weightPerLink = meatLbs / numLinks;

        // Standard hank coverage
        const hankFeet: Record<string, number> = { hog: 32, sheep: 100, beef: 20, fibrous: 12 };
        const hanksNeeded = casingFeet / (hankFeet[casingType] || 32);

        return {
          primary: {
            label: "Casing Needed",
            value: formatNumber(casingFeet, 0) + " feet",
          },
          details: [
            { label: "Number of Links", value: formatNumber(numLinks, 0) },
            { label: "Weight Per Link", value: formatNumber(weightPerLink * 16, 1) + " oz" },
            { label: "Hanks to Order", value: formatNumber(Math.ceil(hanksNeeded), 0) },
            { label: "Stuffing Rate", value: formatNumber(rate, 1) + " lbs/ft" },
          ],
          note: "Order 10-15% extra casing to account for tears and trimming. Rinse natural casings well before use.",
        };
      },
    },
  ],
  relatedSlugs: ["cooking-converter", "unit-converter", "protein-calculator"],
  faq: [
    {
      question: "What is the ideal fat ratio for sausage?",
      answer:
        "The traditional fat ratio for most sausages is 25-30%. Less than 20% fat will result in dry, crumbly sausage. For a juicier, more flavorful sausage, aim for 30%. Breakfast sausage and bratwurst traditionally use 30-35% fat. Use pork back fat for the best texture.",
    },
    {
      question: "How much casing do I need per pound of meat?",
      answer:
        "For natural hog casings (32-35mm), plan about 0.5 feet per pound of meat. For sheep casings (22-24mm), plan about 1.2 feet per pound. A standard hank of hog casing (about 32 feet) will stuff approximately 60-65 pounds of sausage.",
    },
  ],
  formula:
    "Fat Weight = Total × Fat % | Lean Weight = Total - Fat | Salt = ~1.75% of total weight | Casing (ft) = Total Weight / Stuffing Rate",
};
