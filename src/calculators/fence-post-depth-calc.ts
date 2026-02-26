import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const fencePostDepthCalculator: CalculatorDefinition = {
  slug: "fence-post-depth-calculator",
  title: "Fence Post Depth & Concrete Calculator",
  description:
    "Calculate the proper fence post depth and amount of concrete needed for each post hole. Accounts for frost line, fence height, and soil conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "fence post depth",
    "post hole concrete",
    "how deep fence post",
    "fence post concrete calculator",
    "post hole size",
  ],
  variants: [
    {
      id: "post-depth",
      name: "Post Depth & Concrete",
      description:
        "Calculate ideal post depth and concrete per hole",
      fields: [
        {
          name: "fenceHeight",
          label: "Fence Height (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "postSize",
          label: "Post Size (inches)",
          type: "select",
          options: [
            { label: "4x4", value: "4" },
            { label: "6x6", value: "6" },
          ],
          defaultValue: "4",
        },
        {
          name: "numPosts",
          label: "Number of Posts",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "holeDiameter",
          label: "Hole Diameter (inches)",
          type: "select",
          options: [
            { label: '8"', value: "8" },
            { label: '10"', value: "10" },
            { label: '12"', value: "12" },
          ],
          defaultValue: "10",
        },
      ],
      calculate: (inputs) => {
        const fenceHeight = parseFloat(inputs.fenceHeight as string);
        const postSize = parseFloat(inputs.postSize as string);
        const numPosts = parseFloat(inputs.numPosts as string);
        const holeDiameter = parseFloat(inputs.holeDiameter as string);
        if (!fenceHeight || !numPosts || !holeDiameter) return null;

        // Rule of thumb: bury 1/3 of total post length, minimum 24 inches
        const depthInches = Math.max(24, Math.ceil((fenceHeight * 12) / 2));
        const depthFeet = depthInches / 12;
        const totalPostLength = fenceHeight + depthFeet;

        // Concrete volume per hole (cylinder minus post volume)
        const holeRadiusFt = holeDiameter / 2 / 12;
        const postSizeFt = postSize / 12;
        const holeVolume = Math.PI * holeRadiusFt * holeRadiusFt * depthFeet;
        const postVolume = postSizeFt * postSizeFt * depthFeet;
        const concretePerHole = holeVolume - postVolume;
        const totalConcrete = concretePerHole * numPosts;
        const bags50lb = Math.ceil(totalConcrete / 0.375);
        const bags80lb = Math.ceil(totalConcrete / 0.6);
        const cubicYards = totalConcrete / 27;

        return {
          primary: {
            label: "Recommended Post Depth",
            value: `${formatNumber(depthInches)} inches`,
          },
          details: [
            { label: "Post depth", value: `${formatNumber(depthInches)} in (${formatNumber(depthFeet, 1)} ft)` },
            { label: "Total post length needed", value: `${formatNumber(totalPostLength, 1)} ft` },
            { label: "Concrete per hole", value: `${formatNumber(concretePerHole, 2)} cu ft` },
            { label: "Total concrete", value: `${formatNumber(totalConcrete, 1)} cu ft` },
            { label: "50-lb bags (fast-set)", value: formatNumber(bags50lb) },
            { label: "80-lb bags", value: formatNumber(bags80lb) },
            { label: "Cubic yards (ready-mix)", value: formatNumber(cubicYards, 2) },
          ],
          note: "Hole diameter should be 3x the post width. In cold climates, dig below the frost line (typically 36-48 inches). Use fast-setting concrete for easier installation.",
        };
      },
    },
    {
      id: "frost-line",
      name: "Frost Line Depth Guide",
      description: "Determine post depth based on frost line zone",
      fields: [
        {
          name: "fenceHeight",
          label: "Fence Height (feet)",
          type: "number",
          placeholder: "e.g. 6",
        },
        {
          name: "frostZone",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Southern US (12\" frost)", value: "12" },
            { label: "Mid-Atlantic (24\" frost)", value: "24" },
            { label: "Midwest (36\" frost)", value: "36" },
            { label: "Northern US (48\" frost)", value: "48" },
            { label: "Far North (60\" frost)", value: "60" },
          ],
          defaultValue: "36",
        },
        {
          name: "numPosts",
          label: "Number of Posts",
          type: "number",
          placeholder: "e.g. 20",
        },
      ],
      calculate: (inputs) => {
        const fenceHeight = parseFloat(inputs.fenceHeight as string);
        const frostLine = parseFloat(inputs.frostZone as string);
        const numPosts = parseFloat(inputs.numPosts as string);
        if (!fenceHeight || !frostLine || !numPosts) return null;

        // Post must go at least 6 inches below frost line
        const minByFrost = frostLine + 6;
        const minByHeight = Math.ceil((fenceHeight * 12) / 2);
        const recommendedDepth = Math.max(minByFrost, minByHeight);
        const totalPostLength = fenceHeight + recommendedDepth / 12;

        const holeRadiusFt = 5 / 12; // 10-inch hole
        const postSizeFt = 4 / 12;
        const depthFt = recommendedDepth / 12;
        const concretePerHole =
          Math.PI * holeRadiusFt * holeRadiusFt * depthFt -
          postSizeFt * postSizeFt * depthFt;
        const totalConcrete = concretePerHole * numPosts;
        const bags50lb = Math.ceil(totalConcrete / 0.375);

        return {
          primary: {
            label: "Recommended Depth",
            value: `${formatNumber(recommendedDepth)} inches`,
          },
          details: [
            { label: "Frost line depth", value: `${formatNumber(frostLine)} inches` },
            { label: "Min depth (frost + 6\")", value: `${formatNumber(minByFrost)} inches` },
            { label: "Min depth (1/2 fence height)", value: `${formatNumber(minByHeight)} inches` },
            { label: "Total post length needed", value: `${formatNumber(totalPostLength, 1)} ft` },
            { label: "50-lb fast-set bags (total)", value: formatNumber(bags50lb) },
          ],
          note: "Always dig below the frost line to prevent frost heave. Check local building codes for exact frost line requirements in your area.",
        };
      },
    },
  ],
  relatedSlugs: ["wood-fence-calculator", "vinyl-fence-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How deep should a fence post be?",
      answer:
        "The general rule is to bury 1/3 to 1/2 of the total post length underground. For a 6-foot fence, use 8-foot posts buried 24-36 inches deep. In cold climates, posts must extend below the frost line (check local codes) to prevent frost heave.",
    },
    {
      question: "How much concrete do I need per fence post?",
      answer:
        "A typical fence post in a 10-inch diameter hole, 24 inches deep, requires about 0.4 cubic feet of concrete, or roughly one 50-lb bag of fast-setting concrete. For deeper holes (36 inches), you will need 1.5 to 2 bags per post.",
    },
    {
      question: "Should I use fast-setting or regular concrete for fence posts?",
      answer:
        "Fast-setting concrete (like Quikrete Fast-Setting) is ideal for fence posts. You can pour it dry into the hole and add water on top. It sets in 20-40 minutes. Regular concrete requires mixing but may be cheaper for large projects.",
    },
  ],
  formula:
    "Post Depth = max(Frost Line + 6\", Fence Height / 2) | Concrete Volume = pi x r^2 x depth - post_area x depth",
};
