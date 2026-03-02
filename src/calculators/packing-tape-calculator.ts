import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const packingTapeCalculator: CalculatorDefinition = {
  slug: "packing-tape-calculator",
  title: "Packing Tape Calculator",
  description: "Estimate the rolls of tape needed for moving boxes.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["packing","tape","rolls","moving"],
  variants: [{
    id: "standard",
    name: "Packing Tape",
    description: "Estimate the rolls of tape needed for moving boxes.",
    fields: [
      { name: "boxes", label: "Number of Boxes", type: "number", min: 1, max: 200, defaultValue: 30 },
      { name: "stripsPerBox", label: "Tape Strips Per Box", type: "number", min: 2, max: 6, defaultValue: 3 },
      { name: "rollLength", label: "Roll Length (yards)", type: "number", min: 30, max: 110, defaultValue: 55 },
    ],
    calculate: (inputs) => {
    const boxes = inputs.boxes as number;
    const stripsPerBox = inputs.stripsPerBox as number;
    const rollLength = inputs.rollLength as number;
    const totalStrips = boxes * stripsPerBox;
    const tapeYards = totalStrips * 1.5;
    const rollsNeeded = Math.ceil(tapeYards / rollLength);
    return { primary: { label: "Rolls of Tape Needed", value: formatNumber(rollsNeeded) }, details: [{ label: "Total Tape Strips", value: formatNumber(totalStrips) }, { label: "Total Tape Length", value: formatNumber(tapeYards) + " yards" }, { label: "Roll Length", value: rollLength + " yards each" }] };
  },
  }],
  relatedSlugs: ["moving-box-calculator","moving-cost-calculator","moving-timeline-calculator"],
  faq: [
    { question: "How many rolls of tape do I need for moving?", answer: "About 1 roll per 15 to 20 boxes on average." },
    { question: "What type of packing tape is best?", answer: "Use 2-inch wide heavy-duty acrylic tape for boxes." },
    { question: "How much tape per box?", answer: "Use about 3 strips per box for a secure seal." },
  ],
  formula: "Rolls = ceil((Boxes * StripsPerBox * 1.5) / RollLength)",
};
