import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gardenFenceCalculator: CalculatorDefinition = {
  slug: "garden-fence-calculator",
  title: "Garden Fence Calculator",
  description: "Free garden fence calculator. Calculate fencing materials, posts, gates, and costs needed to protect your garden from deer, rabbits, and other animals.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["garden fence calculator", "deer fence calculator", "garden fencing cost", "how much fencing do I need", "fence material calculator"],
  variants: [
    {
      id: "rectangular",
      name: "Rectangular Garden Fence",
      description: "Calculate fencing for a rectangular garden area",
      fields: [
        { name: "length", label: "Garden Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Garden Width (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "fenceType", label: "Fence Type", type: "select", options: [
          { label: "Welded Wire (4ft) - Rabbit/Small Animal", value: "welded4" },
          { label: "Welded Wire (6ft) - General Purpose", value: "welded6" },
          { label: "Deer Netting (7ft)", value: "deer7" },
          { label: "Deer Fence (8ft)", value: "deer8" },
          { label: "Chicken Wire (4ft)", value: "chicken" },
          { label: "Hardware Cloth (3ft) - Small Critters", value: "hardware" },
          { label: "Cedar/Wood Fence (4ft)", value: "wood4" },
          { label: "Cedar/Wood Fence (6ft)", value: "wood6" },
        ], defaultValue: "welded6" },
        { name: "gateWidth", label: "Gate Width (ft)", type: "select", options: [
          { label: "3 ft (walking gate)", value: "3" },
          { label: "4 ft (wheelbarrow access)", value: "4" },
          { label: "6 ft (riding mower/cart)", value: "6" },
          { label: "No Gate", value: "0" },
        ], defaultValue: "4" },
        { name: "postSpacing", label: "Post Spacing (ft)", type: "select", options: [
          { label: "6 feet (heavy fence/wind)", value: "6" },
          { label: "8 feet (standard)", value: "8" },
          { label: "10 feet (light fence)", value: "10" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const fence = inputs.fenceType as string;
        const gateWidth = parseInt(inputs.gateWidth as string);
        const postSpacing = parseInt(inputs.postSpacing as string);
        if (!length || !width || !postSpacing) return null;

        const perimeter = 2 * (length + width);
        const fenceLength = perimeter - (gateWidth || 0);
        const numPosts = Math.ceil(perimeter / postSpacing) + 1;
        const cornerPosts = 4;
        const gatePosts = gateWidth > 0 ? 2 : 0;

        const fenceCostPerFt: Record<string, number> = {
          welded4: 1.50, welded6: 2.50, deer7: 1.00, deer8: 1.50,
          chicken: 0.75, hardware: 3.00, wood4: 8.00, wood6: 12.00,
        };
        const fenceHeight: Record<string, number> = {
          welded4: 4, welded6: 6, deer7: 7, deer8: 8,
          chicken: 4, hardware: 3, wood4: 4, wood6: 6,
        };
        const postCost: Record<string, number> = {
          welded4: 8, welded6: 12, deer7: 15, deer8: 18,
          chicken: 6, hardware: 8, wood4: 15, wood6: 20,
        };

        const fenceMaterialCost = fenceLength * (fenceCostPerFt[fence] || 2);
        const postMaterialCost = numPosts * (postCost[fence] || 10);
        const gateCost = gateWidth > 0 ? gateWidth * 25 + 30 : 0;
        const hardwareCost = numPosts * 3 + 20;
        const totalCost = fenceMaterialCost + postMaterialCost + gateCost + hardwareCost;

        return {
          primary: { label: "Perimeter", value: `${formatNumber(perimeter, 0)} linear feet` },
          details: [
            { label: "Fence material needed", value: `${formatNumber(fenceLength, 0)} ft of ${fenceHeight[fence] || 6}ft fence` },
            { label: "Total posts", value: `${numPosts} (incl. ${cornerPosts} corner + ${gatePosts} gate posts)` },
            { label: "Post spacing", value: `${postSpacing} ft apart` },
            { label: "Fence cost", value: `$${formatNumber(fenceMaterialCost, 0)}` },
            { label: "Post cost", value: `$${formatNumber(postMaterialCost, 0)}` },
            { label: "Gate cost (${gateWidth}ft)", value: gateWidth > 0 ? `$${formatNumber(gateCost, 0)}` : "No gate" },
            { label: "Hardware (ties, caps)", value: `$${formatNumber(hardwareCost, 0)}` },
            { label: "Total estimated cost", value: `$${formatNumber(totalCost, 0)}` },
          ],
          note: "Set posts 18-24 inches deep for stability. For deer fencing, use 8ft posts. For rabbit protection, bury the bottom 6-12 inches underground or bend outward in an L-shape.",
        };
      },
    },
    {
      id: "animal-protection",
      name: "Animal Protection Guide",
      description: "Get fence specifications based on pest type",
      fields: [
        { name: "perimeter", label: "Garden Perimeter (ft)", type: "number", placeholder: "e.g. 80" },
        { name: "animal", label: "Primary Pest", type: "select", options: [
          { label: "Deer", value: "deer" },
          { label: "Rabbits", value: "rabbit" },
          { label: "Groundhogs/Woodchucks", value: "groundhog" },
          { label: "Raccoons", value: "raccoon" },
          { label: "Chickens (Keep Out)", value: "chicken" },
          { label: "Deer + Rabbits (Combo)", value: "combo" },
        ], defaultValue: "deer" },
      ],
      calculate: (inputs) => {
        const perimeter = inputs.perimeter as number;
        const animal = inputs.animal as string;
        if (!perimeter) return null;

        const specs: Record<string, { height: number; mesh: string; bury: number; costPerFt: number; notes: string }> = {
          deer: { height: 8, mesh: "Deer netting or welded wire", bury: 0, costPerFt: 3, notes: "8ft minimum height. Double fence (two 4ft fences 4ft apart) also works." },
          rabbit: { height: 3, mesh: "1/2\" hardware cloth or chicken wire", bury: 6, costPerFt: 2.5, notes: "Bury bottom 6-12\" underground in L-shape to prevent digging." },
          groundhog: { height: 4, mesh: "Welded wire (2×4\" mesh)", bury: 12, costPerFt: 3, notes: "Bury 12\" deep with bottom bent outward. Add electric wire at top." },
          raccoon: { height: 4, mesh: "Welded wire + electric top wire", bury: 0, costPerFt: 4, notes: "Add electric wire at top. Raccoons are excellent climbers." },
          chicken: { height: 4, mesh: "Chicken wire (1\" hex mesh)", bury: 0, costPerFt: 1.5, notes: "4ft fence with chicken wire is sufficient. Clip flight feathers if needed." },
          combo: { height: 8, mesh: "Welded wire (bottom 3ft) + deer netting (top 5ft)", bury: 6, costPerFt: 4.5, notes: "Small mesh at bottom for rabbits, tall for deer. Bury bottom 6\"." },
        };

        const spec = specs[animal] || specs.deer;
        const totalCost = perimeter * spec.costPerFt;
        const posts = Math.ceil(perimeter / 8) + 1;

        return {
          primary: { label: "Recommended Fence", value: `${spec.height}ft ${spec.mesh}` },
          details: [
            { label: "Fence height", value: `${spec.height} feet` },
            { label: "Mesh type", value: spec.mesh },
            { label: "Bury depth", value: spec.bury > 0 ? `${spec.bury} inches underground` : "None needed" },
            { label: "Fence material", value: `${formatNumber(perimeter, 0)} linear feet` },
            { label: "Posts needed", value: `${posts} (8ft spacing)` },
            { label: "Estimated total cost", value: `$${formatNumber(totalCost, 0)}` },
            { label: "Key tip", value: spec.notes },
          ],
          note: "For the most effective protection, identify your specific pest before buying materials. Motion-activated sprinklers and repellent sprays can supplement fencing.",
        };
      },
    },
  ],
  relatedSlugs: ["garden-bed-cost-calculator", "raised-garden-bed-calculator", "plant-spacing-calculator"],
  faq: [
    { question: "How tall should a garden fence be for deer?", answer: "A deer fence should be at least 8 feet tall. Deer can jump 6-7 feet from a standstill. An alternative is a double fence: two 4-foot fences placed 4 feet apart - deer are reluctant to jump into a narrow space." },
    { question: "How do I keep rabbits out of my garden?", answer: "Use chicken wire or 1/2-inch hardware cloth at least 3 feet tall. Bury the bottom 6-12 inches underground in an L-shape (bend outward) to prevent digging. Secure the fence flush to the ground with landscape staples." },
    { question: "What is the cheapest garden fence?", answer: "Chicken wire is the cheapest at $0.50-1.00/ft, but is only effective against small animals and is not very durable. Deer netting is affordable ($0.75-1.50/ft) for deer protection. Welded wire ($1.50-3.00/ft) offers the best all-around protection for the price." },
  ],
  formula: "Perimeter = 2 × (Length + Width) | Posts = Perimeter / Spacing + 1 | Fence Material = Perimeter - Gate Width",
};
