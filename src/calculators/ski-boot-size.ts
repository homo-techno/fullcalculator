import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const skiBootSizeCalculator: CalculatorDefinition = {
  slug: "ski-boot-size-calculator",
  title: "Ski Boot Size & Flex Calculator",
  description:
    "Free ski boot mondo point size and flex calculator. Find your ski boot size based on foot measurements, and get flex recommendations based on ability and weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "ski boot size calculator",
    "mondo point size",
    "ski boot flex",
    "ski boot fitting",
    "mondopoint calculator",
  ],
  variants: [
    {
      id: "mondo-size",
      name: "Mondo Point Size",
      description: "Convert foot length to ski boot mondo size",
      fields: [
        {
          name: "footLength",
          label: "Foot Length",
          type: "number",
          placeholder: "e.g. 27.5",
          step: 0.5,
          min: 15,
          max: 35,
        },
        {
          name: "measurement",
          label: "Measurement Unit",
          type: "select",
          options: [
            { label: "Centimeters", value: "cm" },
            { label: "Inches", value: "inches" },
          ],
          defaultValue: "cm",
        },
        {
          name: "fitPreference",
          label: "Fit Preference",
          type: "select",
          options: [
            { label: "Performance (snug)", value: "performance" },
            { label: "Comfort (relaxed)", value: "comfort" },
            { label: "Racing (tight)", value: "racing" },
          ],
          defaultValue: "performance",
        },
      ],
      calculate: (inputs) => {
        const footLength = parseFloat(inputs.footLength as string);
        const unit = inputs.measurement as string;
        const fit = inputs.fitPreference as string;
        if (!footLength) return null;

        let footCm = unit === "inches" ? footLength * 2.54 : footLength;

        // Mondo point is in cm, rounded to nearest 0.5
        let mondoBase = Math.round(footCm * 2) / 2;

        // Fit adjustments
        if (fit === "comfort") mondoBase += 0.5;
        else if (fit === "racing") mondoBase -= 0.5;

        // Shell size (boots come in full sizes that cover half-size ranges)
        const shellSize = Math.ceil(mondoBase);

        // US size conversion (approximate)
        const usMen = mondoBase - 18;
        const usWomen = mondoBase - 17;
        const euSize = mondoBase + 14.5;

        return {
          primary: {
            label: "Mondo Point Size",
            value: formatNumber(mondoBase, 1) + " MP",
          },
          details: [
            { label: "Shell Size", value: formatNumber(shellSize, 0) },
            { label: "US Men's", value: formatNumber(usMen, 1) },
            { label: "US Women's", value: formatNumber(usWomen, 1) },
            { label: "EU Size", value: formatNumber(euSize, 1) },
            { label: "Foot Length", value: formatNumber(footCm, 1) + " cm" },
            { label: "Fit Type", value: fit.charAt(0).toUpperCase() + fit.slice(1) },
          ],
          note: "Always try ski boots on in person. Sizes vary between brands. A bootfitter can adjust shells for the best fit.",
        };
      },
    },
    {
      id: "flex-rating",
      name: "Flex Recommendation",
      description: "Get recommended boot flex based on ability and weight",
      fields: [
        {
          name: "weight",
          label: "Body Weight (lbs)",
          type: "number",
          placeholder: "e.g. 175",
          min: 60,
          max: 350,
        },
        {
          name: "ability",
          label: "Skiing Ability",
          type: "select",
          options: [
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
            { label: "Expert/Racer", value: "expert" },
          ],
          defaultValue: "intermediate",
        },
        {
          name: "style",
          label: "Skiing Style",
          type: "select",
          options: [
            { label: "Cruising / All-Mountain", value: "allmt" },
            { label: "Aggressive / Charging", value: "aggressive" },
            { label: "Park / Freestyle", value: "park" },
            { label: "Touring / Backcountry", value: "touring" },
          ],
          defaultValue: "allmt",
        },
        {
          name: "gender",
          label: "Boot Line",
          type: "select",
          options: [
            { label: "Men's / Unisex", value: "mens" },
            { label: "Women's", value: "womens" },
          ],
          defaultValue: "mens",
        },
      ],
      calculate: (inputs) => {
        const weight = parseFloat(inputs.weight as string);
        const ability = inputs.ability as string;
        const style = inputs.style as string;
        const gender = inputs.gender as string;
        if (!weight) return null;

        // Base flex from ability
        const abilityFlex: Record<string, number> = {
          beginner: 70,
          intermediate: 90,
          advanced: 110,
          expert: 130,
        };
        let baseFlex = abilityFlex[ability] || 90;

        // Weight adjustment
        if (weight > 200) baseFlex += 10;
        else if (weight > 175) baseFlex += 5;
        else if (weight < 130) baseFlex -= 10;
        else if (weight < 150) baseFlex -= 5;

        // Style adjustment
        if (style === "aggressive") baseFlex += 10;
        else if (style === "park") baseFlex -= 10;
        else if (style === "touring") baseFlex -= 15;

        // Women's boots have softer flex scale
        if (gender === "womens") baseFlex -= 20;

        baseFlex = Math.max(50, Math.min(150, baseFlex));

        const flexRange = `${formatNumber(baseFlex - 10, 0)} - ${formatNumber(baseFlex + 10, 0)}`;

        let category = "Medium";
        if (baseFlex >= 120) category = "Stiff";
        else if (baseFlex >= 100) category = "Medium-Stiff";
        else if (baseFlex >= 80) category = "Medium";
        else category = "Soft";

        return {
          primary: {
            label: "Recommended Flex",
            value: formatNumber(baseFlex, 0),
          },
          details: [
            { label: "Flex Range", value: flexRange },
            { label: "Flex Category", value: category },
            { label: "Body Weight", value: formatNumber(weight, 0) + " lbs" },
            { label: "Ability Level", value: ability.charAt(0).toUpperCase() + ability.slice(1) },
            { label: "Skiing Style", value: style },
          ],
          note: "Higher flex = stiffer boot = more control at speed. Lower flex = softer boot = easier to flex, more comfort. Women's flex ratings are typically 20 points softer.",
        };
      },
    },
  ],
  relatedSlugs: ["shoe-size-converter", "bmi-calculator", "unit-converter"],
  faq: [
    {
      question: "What is mondo point in ski boots?",
      answer:
        "Mondo point (MP) is the universal ski boot sizing system based on foot length in centimeters. A mondo size of 27.5 means the boot is designed for a foot that is 27.5 cm long. It eliminates confusion from varying US/EU size scales across brands.",
    },
    {
      question: "What flex should my ski boot be?",
      answer:
        "Beginners should use flex 60-80, intermediates 80-100, advanced skiers 100-120, and experts/racers 120-150. Heavier skiers should go stiffer, lighter skiers softer. Women's boots are typically rated 20 points lower than men's for equivalent stiffness.",
    },
    {
      question: "How should a ski boot fit?",
      answer:
        "A properly fitting ski boot should feel snug but not painful. Your toes should lightly touch the front when standing upright but pull back slightly when you flex forward. There should be no heel lift. Performance fit means about 0.5 cm less than your actual foot length.",
    },
  ],
  formula:
    "Mondo Point = Foot Length in cm (rounded to nearest 0.5) | Flex = Base (ability) ± Weight Adjustment ± Style Adjustment",
};
