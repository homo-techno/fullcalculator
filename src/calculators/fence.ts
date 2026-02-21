import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fenceCalculator: CalculatorDefinition = {
  slug: "fence-calculator",
  title: "Fence Calculator",
  description: "Free fence calculator. Calculate how many posts, rails, pickets, and materials you need for your fence project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["fence calculator", "fence material calculator", "fence posts calculator", "fence cost estimator", "picket fence"],
  variants: [
    {
      id: "materials",
      name: "Fence Materials",
      fields: [
        { name: "length", label: "Total Fence Length (ft)", type: "number", placeholder: "e.g. 200" },
        { name: "height", label: "Fence Height (ft)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "postSpacing", label: "Post Spacing (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "picketWidth", label: "Picket Width (in)", type: "number", placeholder: "e.g. 3.5", defaultValue: 3.5 },
        { name: "gap", label: "Gap Between Pickets (in)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "rails", label: "Number of Rails", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number, height = (inputs.height as number) || 6;
        const spacing = (inputs.postSpacing as number) || 8;
        const picketW = (inputs.picketWidth as number) || 3.5;
        const gap = (inputs.gap as number) || 0;
        const railCount = (inputs.rails as number) || 2;
        if (!length) return null;
        const posts = Math.ceil(length / spacing) + 1;
        const sections = posts - 1;
        const railsTotal = sections * railCount;
        const picketSpacing = (picketW + gap) / 12;
        const pickets = Math.ceil(length / picketSpacing);
        const concrete = posts * 2;
        return {
          primary: { label: "Total Posts", value: String(posts) },
          details: [
            { label: "Sections", value: String(sections) },
            { label: "Rails needed", value: String(railsTotal) },
            { label: "Pickets needed", value: String(pickets) },
            { label: "Concrete bags (50lb)", value: `≈ ${concrete}` },
            { label: "Post length (w/ 2ft buried)", value: `${height + 2} ft` },
            { label: "Total linear feet", value: `${formatNumber(length, 0)} ft` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["deck-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [{ question: "How far apart should fence posts be?", answer: "Standard spacing is 6-8 feet between posts. Use 6 ft for heavy fences (privacy), 8 ft for lighter ones (picket). Each post hole should be about 1/3 the above-ground height deep (2 ft for a 6 ft fence)." }],
  formula: "Posts = Total Length / Spacing + 1",
};
