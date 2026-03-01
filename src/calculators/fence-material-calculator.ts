import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fenceMaterialCalculator: CalculatorDefinition = {
  slug: "fence-material-calculator",
  title: "Fence Material Calculator",
  description: "Calculate fence posts and boards needed.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fence calculator","fence material estimator"],
  variants: [{
    id: "standard",
    name: "Fence Material",
    description: "Calculate fence posts and boards needed.",
    fields: [
      { name: "fenceLength", label: "Fence Length (ft)", type: "number", min: 1, max: 10000, defaultValue: 100 },
      { name: "fenceHeight", label: "Fence Height (ft)", type: "number", min: 2, max: 12, defaultValue: 6 },
      { name: "postSpacing", label: "Post Spacing (ft)", type: "number", min: 4, max: 12, defaultValue: 8 },
    ],
    calculate: (inputs) => {
      const len = inputs.fenceLength as number;
      const ht = inputs.fenceHeight as number;
      const sp = inputs.postSpacing as number;
      if (!len || !ht || !sp) return null;
      const posts = Math.ceil(len / sp) + 1;
      const sections = posts - 1;
      const boardsPerSection = Math.ceil(sp * 12 / 5.5);
      const totalBoards = boardsPerSection * sections;
      const rails = sections * (ht > 4 ? 3 : 2);
      return {
        primary: { label: "Posts Needed", value: String(posts) },
        details: [
          { label: "Fence Boards", value: formatNumber(totalBoards) },
          { label: "Rails", value: formatNumber(rails) },
          { label: "Sections", value: String(sections) },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How deep should fence posts be set?", answer: "Set posts at least one-third of their length underground." },
    { question: "What is standard fence post spacing?", answer: "6 to 8 feet is standard for most residential fences." },
  ],
  formula: "Posts = (Length / Spacing) + 1",
};
