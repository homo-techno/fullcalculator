import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crossStitchFabricCalculator: CalculatorDefinition = {
  slug: "cross-stitch-fabric-calculator",
  title: "Cross Stitch Fabric Calculator",
  description: "Calculate the fabric dimensions and thread amounts needed for cross stitch projects based on pattern size and fabric count.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["cross stitch fabric","aida cloth calculator","cross stitch size","needlework fabric"],
  variants: [{
    id: "standard",
    name: "Cross Stitch Fabric",
    description: "Calculate the fabric dimensions and thread amounts needed for cross stitch projects based on pattern size and fabric count.",
    fields: [
      { name: "patternWidth", label: "Pattern Width (stitches)", type: "number", min: 10, max: 1000, defaultValue: 100 },
      { name: "patternHeight", label: "Pattern Height (stitches)", type: "number", min: 10, max: 1000, defaultValue: 80 },
      { name: "fabricCount", label: "Fabric Count", type: "select", options: [{ value: "11", label: "11 count Aida" }, { value: "14", label: "14 count Aida" }, { value: "16", label: "16 count Aida" }, { value: "18", label: "18 count Aida" }, { value: "28", label: "28 count Evenweave" }], defaultValue: "14" },
      { name: "margin", label: "Border Margin (inches)", type: "number", min: 1, max: 6, defaultValue: 3 },
    ],
    calculate: (inputs) => {
    const pw = inputs.patternWidth as number;
    const ph = inputs.patternHeight as number;
    const count = parseInt(inputs.fabricCount as string);
    const margin = inputs.margin as number;
    const stitchCount = count >= 28 ? count / 2 : count;
    const designWidth = pw / stitchCount;
    const designHeight = ph / stitchCount;
    const fabricWidth = designWidth + margin * 2;
    const fabricHeight = designHeight + margin * 2;
    const totalStitches = pw * ph;
    const flossPerStitch = 0.012;
    const estimatedSkeins = Math.ceil(totalStitches * flossPerStitch / 8);
    return {
      primary: { label: "Fabric Size Needed", value: formatNumber(Math.round(fabricWidth * 10) / 10) + " x " + formatNumber(Math.round(fabricHeight * 10) / 10) + " inches" },
      details: [
        { label: "Design Size", value: formatNumber(Math.round(designWidth * 10) / 10) + " x " + formatNumber(Math.round(designHeight * 10) / 10) + " inches" },
        { label: "Total Stitches", value: formatNumber(totalStitches) },
        { label: "Estimated Skeins (all colors)", value: formatNumber(estimatedSkeins) },
        { label: "Effective Count", value: formatNumber(stitchCount) + " stitches/inch" }
      ]
    };
  },
  }],
  relatedSlugs: ["embroidery-thread-calculator","quilt-fabric-calculator"],
  faq: [
    { question: "What fabric count should I use for cross stitch?", answer: "Beginners should start with 14 count Aida. Higher counts like 18 count produce finer details but are harder to see. 28 count evenweave is stitched over two threads." },
    { question: "How much margin should I leave around my design?", answer: "Leave at least 3 inches on each side for framing. If your piece will be mounted in a large frame, leave 4 to 6 inches." },
    { question: "How do I estimate thread for a cross stitch project?", answer: "A general rule is about 1 skein of 8-yard floss per 500 to 700 stitches, though this varies with coverage density and number of thread strands used." },
  ],
  formula: "Design Size = Pattern Stitches / Fabric Count; Fabric Size = Design Size + (Margin x 2) on each dimension; Estimated Skeins = (Total Stitches x 0.012 yards per stitch) / 8 yards per skein",
};
