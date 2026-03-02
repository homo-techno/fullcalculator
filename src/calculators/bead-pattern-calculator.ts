import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const beadPatternCalculator: CalculatorDefinition = {
  slug: "bead-pattern-calculator",
  title: "Bead Pattern Calculator",
  description: "Calculate the number of beads needed for bead weaving, loom work, or stringing projects based on pattern dimensions and bead size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["bead calculator","bead pattern","bead weaving","seed bead count"],
  variants: [{
    id: "standard",
    name: "Bead Pattern",
    description: "Calculate the number of beads needed for bead weaving, loom work, or stringing projects based on pattern dimensions and bead size.",
    fields: [
      { name: "patternWidth", label: "Pattern Width (beads)", type: "number", min: 5, max: 500, defaultValue: 40 },
      { name: "patternHeight", label: "Pattern Height (rows)", type: "number", min: 5, max: 500, defaultValue: 50 },
      { name: "beadSize", label: "Bead Size", type: "select", options: [{ value: "1", label: "15/0 (1.5mm)" }, { value: "2", label: "11/0 (2.2mm)" }, { value: "3", label: "8/0 (3mm)" }, { value: "4", label: "6/0 (4mm)" }], defaultValue: "2" },
      { name: "numColors", label: "Number of Colors", type: "number", min: 1, max: 30, defaultValue: 5 },
      { name: "technique", label: "Technique", type: "select", options: [{ value: "1", label: "Loom" }, { value: "2", label: "Peyote" }, { value: "3", label: "Brick Stitch" }, { value: "4", label: "Right Angle Weave" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const pw = inputs.patternWidth as number;
    const ph = inputs.patternHeight as number;
    const beadSize = parseInt(inputs.beadSize as string);
    const numColors = inputs.numColors as number;
    const technique = parseInt(inputs.technique as string);
    const beadMm = { 1: 1.5, 2: 2.2, 3: 3, 4: 4 };
    const mm = beadMm[beadSize] || 2.2;
    const wasteFactor = { 1: 1.05, 2: 1.08, 3: 1.08, 4: 1.12 };
    const waste = wasteFactor[technique] || 1.05;
    const totalBeads = Math.ceil(pw * ph * waste);
    const beadsPerColor = Math.ceil(totalBeads / numColors);
    const widthInches = Math.round(pw * mm / 25.4 * 100) / 100;
    const heightInches = Math.round(ph * mm / 25.4 * 100) / 100;
    const gramsPerBead = { 1: 0.02, 2: 0.04, 3: 0.1, 4: 0.2 };
    const totalGrams = Math.round(totalBeads * (gramsPerBead[beadSize] || 0.04) * 10) / 10;
    return {
      primary: { label: "Total Beads Needed", value: formatNumber(totalBeads) },
      details: [
        { label: "Avg Beads Per Color", value: formatNumber(beadsPerColor) },
        { label: "Finished Width", value: formatNumber(widthInches) + " inches" },
        { label: "Finished Height", value: formatNumber(heightInches) + " inches" },
        { label: "Total Weight", value: formatNumber(totalGrams) + " grams" }
      ]
    };
  },
  }],
  relatedSlugs: ["jewelry-wire-calculator","embroidery-thread-calculator"],
  faq: [
    { question: "How many beads are in a gram?", answer: "For size 11/0 seed beads, there are approximately 110 beads per gram. Larger beads like 6/0 have about 10 per gram, while tiny 15/0 have about 290 per gram." },
    { question: "Why add a waste factor?", answer: "The waste factor accounts for beads lost during work, irregular beads that must be discarded, and extras needed for tension adjustments in the weaving technique." },
    { question: "What is the difference between peyote and loom beading?", answer: "Loom beading uses a loom to hold warp threads and creates a flat fabric quickly. Peyote stitch is off-loom and more portable but slower. Both produce similar-looking flat beadwork." },
  ],
  formula: "Total Beads = Pattern Width x Pattern Height x Waste Factor
Finished Size (inches) = Beads x Bead Size (mm) / 25.4
Weight (grams) = Total Beads x Grams Per Bead",
};
