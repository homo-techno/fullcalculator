import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gemstoneCaratToMmCalculator: CalculatorDefinition = {
  slug: "gemstone-carat-to-mm-calculator",
  title: "Gemstone Carat to MM Calculator",
  description: "Convert gemstone weight in carats to approximate dimensions in millimeters based on gem type, cut shape, and specific gravity.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["carat to mm","gemstone size","diamond dimensions","gem carat converter","stone measurements"],
  variants: [{
    id: "standard",
    name: "Gemstone Carat to MM",
    description: "Convert gemstone weight in carats to approximate dimensions in millimeters based on gem type, cut shape, and specific gravity.",
    fields: [
      { name: "carats", label: "Weight (Carats)", type: "number", min: 0.01, max: 100, defaultValue: 1 },
      { name: "gemType", label: "Gemstone Type", type: "select", options: [{ value: "3.52", label: "Diamond (SG 3.52)" }, { value: "4.03", label: "Ruby/Sapphire (SG 4.03)" }, { value: "2.72", label: "Emerald (SG 2.72)" }, { value: "3.53", label: "Alexandrite (SG 3.53)" }, { value: "2.65", label: "Quartz/Amethyst (SG 2.65)" }, { value: "3.18", label: "Tourmaline (SG 3.18)" }], defaultValue: "3.52" },
      { name: "cutShape", label: "Cut Shape", type: "select", options: [{ value: "1", label: "Round Brilliant" }, { value: "2", label: "Oval" }, { value: "3", label: "Princess (Square)" }, { value: "4", label: "Emerald Cut" }, { value: "5", label: "Pear" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const carats = inputs.carats as number;
    const sg = parseFloat(inputs.gemType as unknown as string);
    const cut = parseFloat(inputs.cutShape as unknown as string);
    const massGrams = carats * 0.2;
    const volumeMm3 = (massGrams / sg) * 1000;
    const depthRatios = { 1: 0.6, 2: 0.62, 3: 0.72, 4: 0.65, 5: 0.62 } as Record<number, number>;
    const widthRatios = { 1: 1, 2: 0.75, 3: 1, 4: 0.75, 5: 0.65 } as Record<number, number>;
    const depthR = depthRatios[cut];
    const widthR = widthRatios[cut];
    const diameter = Math.pow(volumeMm3 / (depthR * widthR * Math.PI / 4), 1/3) * (cut === 3 ? 0.95 : 1);
    const length = cut === 1 ? diameter : diameter / widthR;
    const width = cut === 1 ? diameter : diameter;
    const depth = diameter * depthR;
    return {
      primary: { label: "Estimated Diameter/Width", value: formatNumber(parseFloat(width.toFixed(2))) + " mm" },
      details: [
        { label: "Length", value: formatNumber(parseFloat(length.toFixed(2))) + " mm" },
        { label: "Depth", value: formatNumber(parseFloat(depth.toFixed(2))) + " mm" },
        { label: "Mass", value: formatNumber(parseFloat(massGrams.toFixed(4))) + " grams" },
        { label: "Volume", value: formatNumber(parseFloat(volumeMm3.toFixed(2))) + " mm3" },
        { label: "Specific Gravity", value: formatNumber(sg) }
      ]
    };
  },
  }],
  relatedSlugs: ["mineral-hardness-comparison-calculator","gold-ore-grade-value-calculator","rock-density-calculator"],
  faq: [
    { question: "How big is a 1 carat diamond?", answer: "A 1 carat round brilliant diamond is approximately 6.5mm in diameter. However, the exact dimensions depend on the cut proportions and depth. Well-cut diamonds may appear larger face-up." },
    { question: "Does gemstone type affect size for the same carat weight?", answer: "Yes, because different gems have different densities (specific gravity). A 1 carat emerald (SG 2.72) is physically larger than a 1 carat ruby (SG 4.03) because emerald is less dense." },
    { question: "What is a carat?", answer: "A carat is a unit of weight equal to 200 milligrams (0.2 grams). It is the standard measure for gemstones. It should not be confused with karat, which measures gold purity." },
  ],
  formula: "Mass (g) = Carats x 0.2
Volume (mm3) = Mass / Specific Gravity x 1000
Diameter = cube root of (Volume / (Depth Ratio x Width Ratio x pi/4))",
};
