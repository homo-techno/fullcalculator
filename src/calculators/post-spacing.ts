import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postSpacingCalculator: CalculatorDefinition = {
  slug: "post-spacing-calculator",
  title: "Post Spacing Calculator",
  description: "Free post spacing calculator. Calculate the number of fence or deck posts needed and post hole depth based on total length and spacing.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["post spacing calculator", "fence post calculator", "how many posts do I need", "deck post spacing", "post hole depth"],
  variants: [
    {
      id: "calc",
      name: "Calculate Posts Needed",
      description: "Calculate number of posts and post hole depth",
      fields: [
        { name: "totalLength", label: "Total Length (ft)", type: "number", placeholder: "e.g. 100" },
        { name: "spacing", label: "Post Spacing", type: "select", options: [
          { label: "4 ft apart", value: "4" },
          { label: "6 ft apart", value: "6" },
          { label: "8 ft apart", value: "8" },
          { label: "10 ft apart", value: "10" },
        ], defaultValue: "8" },
        { name: "postHeight", label: "Post Height Above Ground (ft)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "postSize", label: "Post Size", type: "select", options: [
          { label: "4x4", value: "4" },
          { label: "6x6", value: "6" },
        ], defaultValue: "4" },
      ],
      calculate: (inputs) => {
        const totalLength = inputs.totalLength as number;
        const spacing = parseInt(inputs.spacing as string) || 8;
        const postHeight = (inputs.postHeight as number) || 6;
        const postSize = inputs.postSize as string;
        if (!totalLength) return null;

        const numberOfPosts = Math.ceil(totalLength / spacing) + 1;
        // Post hole depth: 1/3 of total post length + 6 inches for gravel base
        const totalPostLength = postHeight + (postHeight / 2); // rough: bury 1/3 of total
        const buriedDepth = totalPostLength / 3;
        const holeDepth = buriedDepth + 0.5; // add 6 inches for gravel
        const actualBuried = Math.max(buriedDepth, 2); // minimum 2 ft buried
        const actualHoleDepth = Math.max(holeDepth, 2.5); // minimum 2.5 ft hole

        // Post hole diameter: typically 3x post width
        const postWidthInches = parseInt(postSize) || 4;
        const holeDiameter = postWidthInches * 3;

        // Concrete per post: approximate for typical post hole
        const holeRadiusFt = (holeDiameter / 2) / 12;
        const holeVolCuFt = Math.PI * holeRadiusFt * holeRadiusFt * actualHoleDepth;
        const postVolCuFt = ((postWidthInches / 12) * (postWidthInches / 12)) * actualHoleDepth;
        const concretePerPost = holeVolCuFt - postVolCuFt;
        const totalConcreteCuFt = concretePerPost * numberOfPosts;
        const bags50lb = Math.ceil(totalConcreteCuFt / 0.375); // 50-lb bag = 0.375 cu ft

        return {
          primary: { label: "Posts Needed", value: `${numberOfPosts} posts` },
          details: [
            { label: "Total length", value: `${formatNumber(totalLength)} ft` },
            { label: "Post spacing", value: `${spacing} ft apart` },
            { label: "Number of posts", value: `${numberOfPosts}` },
            { label: "Post height above ground", value: `${postHeight} ft` },
            { label: "Post hole depth", value: `${formatNumber(actualHoleDepth, 1)} ft (${formatNumber(actualHoleDepth * 12, 0)}")` },
            { label: "Post hole diameter", value: `${holeDiameter}" (3x post width)` },
            { label: "Total post length", value: `${formatNumber(postHeight + actualBuried, 1)} ft each` },
            { label: "Concrete bags (50-lb)", value: `${bags50lb} total` },
          ],
          note: "Post hole depth should be 1/3 of total post length plus 6\" for gravel drainage. Minimum buried depth is 2 feet. Always dig below the frost line in cold climates. Post hole diameter should be 3x the post width.",
        };
      },
    },
  ],
  relatedSlugs: ["fence-calculator", "deck-calculator", "concrete-calculator"],
  faq: [
    { question: "How many fence posts do I need?", answer: "Divide the total fence length by the post spacing and add 1. For example, a 100-ft fence with 8-ft spacing needs (100/8) + 1 = 14 posts." },
    { question: "How deep should fence post holes be?", answer: "Post holes should be 1/3 of the total post length plus 6 inches for a gravel base. For a 6-ft fence with 8-ft posts, dig holes about 2.5-3 feet deep. In cold climates, dig below the frost line." },
    { question: "Should I use 6 ft or 8 ft post spacing?", answer: "8-ft spacing is standard for wood privacy fences. 6-ft spacing is stronger and better for windy areas, heavy fence panels, or chain link. Deck posts are typically 4-8 ft apart depending on beam spans." },
  ],
  formula: "Posts = (Total Length / Spacing) + 1 | Hole Depth = (Total Post Length / 3) + 6\"",
};
