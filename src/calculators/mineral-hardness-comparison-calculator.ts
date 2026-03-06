import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const mineralHardnessComparisonCalculator: CalculatorDefinition = {
  slug: "mineral-hardness-comparison-calculator",
  title: "Mineral Hardness Comparison Calculator",
  description: "Compare mineral hardness values on the Mohs scale and estimate scratch resistance, absolute hardness, and practical durability ratings.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["mineral hardness","Mohs scale","scratch resistance","mineral comparison","gemstone hardness"],
  variants: [{
    id: "standard",
    name: "Mineral Hardness Comparison",
    description: "Compare mineral hardness values on the Mohs scale and estimate scratch resistance, absolute hardness, and practical durability ratings.",
    fields: [
      { name: "mineral1", label: "Mineral 1", type: "select", options: [{ value: "1", label: "Talc (1)" }, { value: "2", label: "Gypsum (2)" }, { value: "3", label: "Calcite (3)" }, { value: "4", label: "Fluorite (4)" }, { value: "5", label: "Apatite (5)" }, { value: "6", label: "Orthoclase (6)" }, { value: "7", label: "Quartz (7)" }, { value: "8", label: "Topaz (8)" }, { value: "9", label: "Corundum (9)" }, { value: "10", label: "Diamond (10)" }], defaultValue: "7" },
      { name: "mineral2", label: "Mineral 2", type: "select", options: [{ value: "1", label: "Talc (1)" }, { value: "2", label: "Gypsum (2)" }, { value: "3", label: "Calcite (3)" }, { value: "4", label: "Fluorite (4)" }, { value: "5", label: "Apatite (5)" }, { value: "6", label: "Orthoclase (6)" }, { value: "7", label: "Quartz (7)" }, { value: "8", label: "Topaz (8)" }, { value: "9", label: "Corundum (9)" }, { value: "10", label: "Diamond (10)" }], defaultValue: "5" },
    ],
    calculate: (inputs) => {
    const m1 = parseFloat(inputs.mineral1 as unknown as string);
    const m2 = parseFloat(inputs.mineral2 as unknown as string);
    const absHardness = { 1: 1, 2: 3, 3: 9, 4: 21, 5: 48, 6: 72, 7: 100, 8: 200, 9: 400, 10: 1500 } as Record<number, number>;
    const names = { 1: "Talc", 2: "Gypsum", 3: "Calcite", 4: "Fluorite", 5: "Apatite", 6: "Orthoclase", 7: "Quartz", 8: "Topaz", 9: "Corundum", 10: "Diamond" } as Record<number, string>;
    const abs1 = absHardness[m1];
    const abs2 = absHardness[m2];
    const ratio = abs1 / abs2;
    const diff = m1 - m2;
    const canScratch = diff > 0 ? names[m1] + " scratches " + names[m2] : diff < 0 ? names[m2] + " scratches " + names[m1] : "Neither scratches the other";
    return {
      primary: { label: "Mohs Difference", value: formatNumber(Math.abs(diff)) + " levels" },
      details: [
        { label: "Scratch Result", value: canScratch },
        { label: names[m1] + " Absolute Hardness", value: formatNumber(abs1) },
        { label: names[m2] + " Absolute Hardness", value: formatNumber(abs2) },
        { label: "Absolute Hardness Ratio", value: formatNumber(parseFloat(ratio.toFixed(2))) + "x" },
        { label: "Harder Mineral", value: diff >= 0 ? names[m1] : names[m2] }
      ]
    };
  },
  }],
  relatedSlugs: ["gemstone-carat-to-mm-calculator","rock-density-calculator","gold-ore-grade-value-calculator"],
  faq: [
    { question: "What is the Mohs hardness scale?", answer: "The Mohs scale ranks mineral hardness from 1 (talc, softest) to 10 (diamond, hardest). A mineral can scratch any mineral with a lower number. It is a relative scale, not linear." },
    { question: "Why is the Mohs scale not linear?", answer: "The absolute hardness difference between each Mohs level varies enormously. The jump from corundum (9) to diamond (10) is much larger than from talc (1) to corundum (9) in absolute terms." },
    { question: "What common items can test hardness?", answer: "A fingernail is about 2.5, a copper penny about 3.5, a steel knife blade about 5.5, and a glass plate about 5.5 on the Mohs scale." },
  ],
  formula: "Mohs Difference = |Hardness1 - Hardness2|; Absolute Hardness Ratio = AbsoluteHardness1 / AbsoluteHardness2; Scratch Test: Higher Mohs number scratches lower",
};
