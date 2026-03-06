import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const filmGrainIsoCalculator: CalculatorDefinition = {
  slug: "film-grain-iso-calculator",
  title: "Film Grain ISO Equivalent Calculator",
  description: "Convert between analog film grain sizes and digital ISO equivalents, and estimate visible noise levels for film simulation.",
  category: "Conversion",
  categorySlug: "conversion",
  icon: "R",
  keywords: ["film grain","ISO equivalent","analog film digital","film stock ISO","grain size"],
  variants: [{
    id: "standard",
    name: "Film Grain ISO Equivalent",
    description: "Convert between analog film grain sizes and digital ISO equivalents, and estimate visible noise levels for film simulation.",
    fields: [
      { name: "filmStock", label: "Film Stock Type", type: "select", options: [{ value: "1", label: "Kodak Portra 160" }, { value: "2", label: "Kodak Portra 400" }, { value: "3", label: "Kodak Portra 800" }, { value: "4", label: "Fuji Superia 400" }, { value: "5", label: "Ilford HP5 Plus 400" }, { value: "6", label: "Kodak Tri-X 400" }, { value: "7", label: "Ilford Delta 3200" }], defaultValue: "2" },
      { name: "pushStops", label: "Push/Pull (stops)", type: "number", min: -2, max: 3, defaultValue: 0 },
      { name: "scanResolution", label: "Scan Resolution (DPI)", type: "number", min: 300, max: 10000, defaultValue: 4000 },
      { name: "format", label: "Film Format", type: "select", options: [{ value: "1", label: "35mm" }, { value: "2", label: "Medium Format (120)" }, { value: "3", label: "Large Format (4x5)" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const stock = parseInt(inputs.filmStock as string);
    const push = inputs.pushStops as number;
    const scanDPI = inputs.scanResolution as number;
    const format = parseInt(inputs.format as string);
    const baseISOs = [0, 160, 400, 800, 400, 400, 400, 3200];
    const grainSizes = [0, 6, 8, 11, 9, 10, 10, 16];
    const baseISO = baseISOs[stock];
    const effectiveISO = Math.round(baseISO * Math.pow(2, push));
    const grainSize = grainSizes[stock] + push * 2;
    const formatGrainReduction = [0, 1.0, 0.5, 0.25][format];
    const visibleGrain = Math.round(grainSize * formatGrainReduction * 10) / 10;
    const digitalEquivISO = Math.round(effectiveISO * formatGrainReduction);
    const grainChar = visibleGrain < 6 ? "Very Fine" : visibleGrain < 9 ? "Fine" : visibleGrain < 12 ? "Moderate" : "Coarse";
    const megapixels35 = Math.round(scanDPI * 1.42 * scanDPI * 0.94 / 1000000 * 10) / 10;
    return {
      primary: { label: "Effective ISO", value: formatNumber(effectiveISO) },
      details: [
        { label: "Digital Noise Equivalent", value: "~ISO " + formatNumber(digitalEquivISO) },
        { label: "Grain Character", value: grainChar + " (" + formatNumber(visibleGrain) + "/20)" },
        { label: "Scan Resolution", value: formatNumber(megapixels35) + " MP equivalent" },
        { label: "Push/Pull", value: push >= 0 ? "+" + formatNumber(push) + " stops" : formatNumber(push) + " stops" }
      ]
    };
  },
  }],
  relatedSlugs: ["exposure-triangle-calculator","camera-sensor-crop-factor-calculator"],
  faq: [
    { question: "Does pushing film increase grain?", answer: "Yes. Pushing film (underexposing and overdeveloping) increases grain noticeably. Each stop of push increases visible grain. Pulling film reduces grain slightly." },
    { question: "How does film format affect grain?", answer: "Larger film formats show less visible grain when printed at the same size because less enlargement is needed. Medium format shows about half the grain of 35mm." },
    { question: "What film stock has the finest grain?", answer: "Among common stocks, Kodak Portra 160 and Fuji Velvia 50 have extremely fine grain. For black and white, Ilford Delta 100 and Kodak T-Max 100 are very fine-grained." },
  ],
  formula: "Effective ISO = Base ISO x 2^(push stops); Visible Grain = Base Grain + (Push x 2) x Format Reduction; Digital Equiv = Effective ISO x Format Grain Reduction",
};
