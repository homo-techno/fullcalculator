import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postHoleConcreteCalculator: CalculatorDefinition = {
  slug: "post-hole-concrete-calculator",
  title: "Post Hole Concrete Calculator",
  description: "Calculate concrete bags needed per fence or deck post hole.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["post hole concrete","fence post concrete","post concrete bags"],
  variants: [{
    id: "standard",
    name: "Post Hole Concrete",
    description: "Calculate concrete bags needed per fence or deck post hole.",
    fields: [
      { name: "holeDiameter", label: "Hole Diameter (in)", type: "number", min: 4, max: 24, defaultValue: 10 },
      { name: "holeDepth", label: "Hole Depth (in)", type: "number", min: 12, max: 60, defaultValue: 36 },
      { name: "numPosts", label: "Number of Posts", type: "number", min: 1, max: 200, defaultValue: 10 },
      { name: "bagSize", label: "Bag Size (lbs)", type: "select", options: [{ value: "50", label: "50 lb" }, { value: "60", label: "60 lb" }, { value: "80", label: "80 lb" }], defaultValue: "60" },
    ],
    calculate: (inputs) => {
      const dia = inputs.holeDiameter as number;
      const dep = inputs.holeDepth as number;
      const posts = inputs.numPosts as number;
      const bagLbs = parseFloat(inputs.bagSize as string);
      if (!dia || !dep || !posts || !bagLbs) return null;
      const radius = dia / 2 / 12;
      const depthFt = dep / 12;
      const cubicFtPerHole = Math.PI * radius * radius * depthFt;
      const lbsPerCuFt = 133;
      const bagsPerHole = Math.ceil((cubicFtPerHole * lbsPerCuFt) / bagLbs);
      const totalBags = bagsPerHole * posts;
      return {
        primary: { label: "Total Bags Needed", value: formatNumber(totalBags) + " bags" },
        details: [
          { label: "Bags per Post", value: formatNumber(bagsPerHole) },
          { label: "Cu Ft per Hole", value: formatNumber(Math.round(cubicFtPerHole * 100) / 100) },
          { label: "Total Concrete (lbs)", value: formatNumber(totalBags * bagLbs) },
        ],
      };
  },
  }],
  relatedSlugs: ["fence-calculator","concrete-calculator"],
  faq: [
    { question: "How deep should a fence post hole be?", answer: "Dig post holes to one-third of the total post length, typically 24 to 36 inches." },
    { question: "How many bags of concrete per fence post?", answer: "Most standard fence posts need 1 to 3 bags of 60 lb concrete mix." },
  ],
  formula: "Bags = (PI x (Dia/2)^2 x Depth x 133) / Bag Size per post",
};
