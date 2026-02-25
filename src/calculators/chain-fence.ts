import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const chainFenceCalculator: CalculatorDefinition = {
  slug: "chain-fence-calculator",
  title: "Chain Link Fence Calculator",
  description: "Free chain link fence calculator. Estimate how much chain link fabric, posts, top rail, tension wire, fittings, and concrete you need for your fence project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["chain link fence calculator", "chain link cost calculator", "how much chain link fence do I need", "fence material calculator", "cyclone fence calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Chain Link Fence Materials",
      description: "Estimate all materials for a chain link fence",
      fields: [
        { name: "totalLength", label: "Total Fence Length (feet)", type: "number", placeholder: "e.g. 150" },
        { name: "fenceHeight", label: "Fence Height", type: "select", options: [{ label: "4 feet", value: "4" }, { label: "5 feet", value: "5" }, { label: "6 feet", value: "6" }, { label: "8 feet", value: "8" }], defaultValue: "6" },
        { name: "gates", label: "Number of Walk Gates", type: "number", placeholder: "e.g. 1", defaultValue: 1 },
        { name: "doubleGates", label: "Number of Double/Drive Gates", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "corners", label: "Number of Corners", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "costPerFtFabric", label: "Fabric Cost per Linear Foot (optional)", type: "number", placeholder: "e.g. 5", prefix: "$" },
      ],
      calculate: (inputs) => {
        const totalLength = inputs.totalLength as number;
        const fenceHeight = parseInt((inputs.fenceHeight as string) || "6");
        const gates = (inputs.gates as number) || 0;
        const doubleGates = (inputs.doubleGates as number) || 0;
        const corners = (inputs.corners as number) || 0;
        const costPerFtFabric = inputs.costPerFtFabric as number;
        if (!totalLength) return null;

        // Chain link fabric: sold in 50-foot rolls
        const fabricFt = totalLength;
        const fabricRolls = Math.ceil(fabricFt / 50);

        // Line posts: every 10 feet
        const linePosts = Math.ceil(totalLength / 10) - 1;

        // Terminal posts (ends, corners, gate posts)
        const endPosts = 2;
        const cornerPosts = corners;
        const gatePostsSingle = gates * 2;
        const gatePostsDouble = doubleGates * 2;
        const terminalPosts = endPosts + cornerPosts + gatePostsSingle + gatePostsDouble;

        // Total posts
        const totalPosts = linePosts + terminalPosts;

        // Top rail: 21-foot sections (10.5 ft effective with coupling)
        const topRailSections = Math.ceil(totalLength / 10.5);

        // Post diameter based on height
        const linePostDia = fenceHeight <= 6 ? "1-5/8\"" : "2\"";
        const terminalPostDia = fenceHeight <= 6 ? "2-3/8\"" : "3\"";

        // Tension wire: bottom of fence
        const tensionWireFt = totalLength;

        // Tension bands: 3-4 per terminal post depending on height
        const bandsPerPost = fenceHeight <= 4 ? 3 : fenceHeight <= 6 ? 4 : 5;
        const tensionBands = terminalPosts * bandsPerPost;

        // Tension bars: 1 per terminal post
        const tensionBars = terminalPosts;

        // Rail caps (loop caps): 1 per line post
        const loopCaps = linePosts;

        // Rail end bands: 1 per terminal post
        const railEndBands = terminalPosts;

        // Brace bands: 1 per terminal post (for top rail)
        const braceBands = terminalPosts;

        // Post caps: 1 per terminal post
        const postCaps = terminalPosts;

        // Tie wires: ~1 per linear foot for attaching fabric
        const tieWires = totalLength;

        // Concrete: 2 bags (80 lb) per post
        const concreteBags = totalPosts * 2;

        const details: { label: string; value: string }[] = [
          { label: "Fence Length", value: `${formatNumber(totalLength)} feet` },
          { label: "Fence Height", value: `${fenceHeight} feet` },
          { label: "Chain Link Fabric", value: `${formatNumber(fabricFt)} ft (${formatNumber(fabricRolls)} rolls)` },
          { label: "Line Posts (" + linePostDia + ")", value: formatNumber(linePosts) },
          { label: "Terminal Posts (" + terminalPostDia + ")", value: formatNumber(terminalPosts) },
          { label: "Total Posts", value: formatNumber(totalPosts) },
          { label: "Top Rail (21' sections)", value: formatNumber(topRailSections) },
          { label: "Tension Wire", value: `${formatNumber(tensionWireFt)} ft` },
          { label: "Tension Bands", value: formatNumber(tensionBands) },
          { label: "Tension Bars", value: formatNumber(tensionBars) },
          { label: "Loop/Rail Caps", value: formatNumber(loopCaps) },
          { label: "Rail End Bands", value: formatNumber(railEndBands) },
          { label: "Brace Bands", value: formatNumber(braceBands) },
          { label: "Post Caps", value: formatNumber(postCaps) },
          { label: "Tie Wires", value: formatNumber(tieWires) },
          { label: "Walk Gates", value: formatNumber(gates) },
          { label: "Double/Drive Gates", value: formatNumber(doubleGates) },
          { label: "Concrete (80 lb bags)", value: formatNumber(concreteBags) },
        ];

        if (costPerFtFabric) {
          const fabricCost = fabricFt * costPerFtFabric;
          const linePostCost = linePosts * (fenceHeight <= 6 ? 12 : 18);
          const termPostCost = terminalPosts * (fenceHeight <= 6 ? 22 : 35);
          const topRailCost = topRailSections * 15;
          const fittingsCost = tensionBands * 1.5 + tensionBars * 8 + loopCaps * 1 + railEndBands * 2 + braceBands * 2 + postCaps * 2 + tieWires * 0.10;
          const gateCost = gates * 80 + doubleGates * 200;
          const concreteCost = concreteBags * 6;
          const totalCost = fabricCost + linePostCost + termPostCost + topRailCost + fittingsCost + gateCost + concreteCost;
          details.push({ label: "Fabric Cost", value: `$${formatNumber(fabricCost, 2)}` });
          details.push({ label: "Posts & Rails", value: `$${formatNumber(linePostCost + termPostCost + topRailCost, 2)}` });
          details.push({ label: "Fittings & Hardware", value: `$${formatNumber(fittingsCost, 2)}` });
          details.push({ label: "Gates", value: `$${formatNumber(gateCost, 2)}` });
          details.push({ label: "Concrete", value: `$${formatNumber(concreteCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per linear foot", value: `$${formatNumber(totalCost / totalLength, 2)}` });
        }

        return {
          primary: { label: "Chain Link Fence Materials", value: `${formatNumber(totalLength)} ft fence, ${formatNumber(totalPosts)} posts` },
          details,
          note: "Line posts spaced 10 feet apart. Terminal posts at all ends, corners, and gate openings. Post holes should be 3x post diameter wide and 1/3 post length deep plus 6\". Set posts in concrete and allow 24-48 hrs to cure before hanging fabric.",
        };
      },
    },
  ],
  relatedSlugs: ["post-hole-calc-calculator", "concrete-calculator", "vinyl-fence-calculator"],
  faq: [
    { question: "How far apart should chain link fence posts be?", answer: "Line posts should be spaced no more than 10 feet apart. Terminal posts (end, corner, and gate posts) are placed at each change of direction, gate opening, and fence end. Closer spacing provides a sturdier fence." },
    { question: "How deep should chain link fence posts be?", answer: "Post holes should be 3 times the post diameter wide and about 1/3 of the total post length deep plus 6 inches for gravel drainage. For a 6-foot fence with 8-foot posts, dig holes 30-36 inches deep." },
    { question: "How much does a chain link fence cost per foot?", answer: "DIY chain link fence materials cost $7-$15 per linear foot for a 4-foot fence and $10-$20 per foot for a 6-foot fence. Professional installation adds $5-$15 per foot for labor." },
  ],
  formula: "Line Posts = Total Length / 10 ft spacing; Terminal Posts = 2 ends + corners + (gates x 2); Fabric = Total Length in 50-ft rolls",
};
