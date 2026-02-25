import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const postHoleCalcCalculator: CalculatorDefinition = {
  slug: "post-hole-calc-calculator",
  title: "Post Hole Concrete Calculator",
  description: "Free post hole concrete calculator. Estimate how many bags of concrete you need for fence posts, deck posts, mailbox posts, and sign posts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["post hole calculator", "fence post concrete calculator", "how much concrete for fence post", "post hole concrete bags", "deck post footing calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Post Hole Concrete",
      description: "Estimate concrete bags for post holes",
      fields: [
        { name: "holeDiameter", label: "Hole Diameter (inches)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
        { name: "holeDepth", label: "Hole Depth (inches)", type: "number", placeholder: "e.g. 36", defaultValue: 36 },
        { name: "postSize", label: "Post Size (inches)", type: "select", options: [{ label: "4x4 (3.5\" actual)", value: "3.5" }, { label: "6x6 (5.5\" actual)", value: "5.5" }, { label: "Round 4\" diameter", value: "4r" }, { label: "Round 6\" diameter", value: "6r" }], defaultValue: "3.5" },
        { name: "numPosts", label: "Number of Posts", type: "number", placeholder: "e.g. 12", defaultValue: 1 },
        { name: "bagSize", label: "Bag Size", type: "select", options: [{ label: "50 lb bag (0.375 cu ft)", value: "50" }, { label: "60 lb bag (0.45 cu ft)", value: "60" }, { label: "80 lb bag (0.6 cu ft)", value: "80" }], defaultValue: "80" },
      ],
      calculate: (inputs) => {
        const holeDiameter = (inputs.holeDiameter as number) || 10;
        const holeDepth = (inputs.holeDepth as number) || 36;
        const postSize = (inputs.postSize as string) || "3.5";
        const numPosts = (inputs.numPosts as number) || 1;
        const bagSize = (inputs.bagSize as string) || "80";
        if (!holeDiameter || !holeDepth) return null;

        const holeRadiusIn = holeDiameter / 2;
        const holeVolumeCuIn = Math.PI * holeRadiusIn * holeRadiusIn * holeDepth;

        // Calculate post volume to subtract
        let postVolumeCuIn = 0;
        if (postSize === "3.5") {
          postVolumeCuIn = 3.5 * 3.5 * holeDepth;
        } else if (postSize === "5.5") {
          postVolumeCuIn = 5.5 * 5.5 * holeDepth;
        } else if (postSize === "4r") {
          postVolumeCuIn = Math.PI * 2 * 2 * holeDepth;
        } else {
          postVolumeCuIn = Math.PI * 3 * 3 * holeDepth;
        }

        const concretePerHoleCuIn = holeVolumeCuIn - postVolumeCuIn;
        const concretePerHoleCuFt = concretePerHoleCuIn / 1728;
        const totalConcreteCuFt = concretePerHoleCuFt * numPosts;

        const cuFtPerBag = bagSize === "50" ? 0.375 : bagSize === "60" ? 0.45 : 0.6;
        const bagsPerHole = Math.ceil(concretePerHoleCuFt / cuFtPerBag);
        const totalBags = bagsPerHole * numPosts;

        const details: { label: string; value: string }[] = [
          { label: "Hole Dimensions", value: `${holeDiameter}\" diameter x ${holeDepth}\" deep` },
          { label: "Post Size", value: postSize.endsWith("r") ? `${postSize.replace("r", "")}\" round` : `${postSize}\" x ${postSize}\" square` },
          { label: "Number of Posts", value: formatNumber(numPosts) },
          { label: "Concrete per Hole", value: `${formatNumber(concretePerHoleCuFt, 2)} cu ft` },
          { label: "Bags per Hole", value: `${formatNumber(bagsPerHole)} (${bagSize} lb)` },
          { label: "Total Bags", value: `${formatNumber(totalBags)} (${bagSize} lb)` },
          { label: "Total Volume", value: `${formatNumber(totalConcreteCuFt, 2)} cu ft` },
        ];

        const costPerBag = bagSize === "50" ? 4.5 : bagSize === "60" ? 5.5 : 6.5;
        const totalCost = totalBags * costPerBag;
        details.push({ label: "Estimated Cost", value: `$${formatNumber(totalCost, 2)} (at ~$${costPerBag}/bag)` });

        return {
          primary: { label: "Concrete Bags Needed", value: `${formatNumber(totalBags)} bags (${bagSize} lb)` },
          details,
          note: "Volume accounts for the post displacing concrete in the hole. Fast-setting concrete is recommended for post installations. Set posts plumb and brace while concrete cures.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-footing-calc-calculator", "chain-fence-calculator", "concrete-calculator"],
  faq: [
    { question: "How many bags of concrete for a 4x4 fence post?", answer: "A typical 4x4 fence post in a 10-inch diameter, 36-inch deep hole requires about 3 bags of 80-lb concrete mix, or 4 bags of 60-lb mix." },
    { question: "How deep should a fence post hole be?", answer: "A fence post hole should be 1/3 the total post length plus 6 inches for gravel drainage. For a 6-foot fence with 8-foot posts, dig holes 30-36 inches deep." },
    { question: "Should I use fast-setting concrete for fence posts?", answer: "Yes, fast-setting concrete is ideal for fence posts. You can pour it dry into the hole and add water, or mix it first. It sets in 20-40 minutes, allowing you to continue building the same day." },
  ],
  formula: "Bags = (π x (Hole Radius)² x Depth - Post Cross Section x Depth) / 1728 / Cu Ft per Bag",
};
