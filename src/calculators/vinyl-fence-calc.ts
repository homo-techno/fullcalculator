import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vinylFenceCalculator: CalculatorDefinition = {
  slug: "vinyl-fence-calculator",
  title: "Vinyl Fence Material Calculator",
  description:
    "Calculate vinyl fence materials including panels, posts, caps, and gates. Estimate total cost for privacy, semi-privacy, and picket vinyl fencing projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "vinyl fence calculator",
    "PVC fence materials",
    "vinyl fence panels",
    "vinyl fence cost",
    "fence panel calculator",
  ],
  variants: [
    {
      id: "panels",
      name: "Vinyl Fence Panels",
      description: "Calculate panels, posts, and accessories for a vinyl fence",
      fields: [
        {
          name: "totalLength",
          label: "Total Fence Length (feet)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "panelWidth",
          label: "Panel Width (feet)",
          type: "select",
          options: [
            { label: "6 ft", value: "6" },
            { label: "8 ft", value: "8" },
          ],
          defaultValue: "8",
        },
        {
          name: "fenceHeight",
          label: "Fence Height (feet)",
          type: "select",
          options: [
            { label: "4 ft", value: "4" },
            { label: "5 ft", value: "5" },
            { label: "6 ft", value: "6" },
          ],
          defaultValue: "6",
        },
        {
          name: "numGates",
          label: "Number of Gates",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const totalLength = parseFloat(inputs.totalLength as string);
        const panelWidth = parseFloat(inputs.panelWidth as string);
        const fenceHeight = parseFloat(inputs.fenceHeight as string);
        const numGates = parseFloat(inputs.numGates as string) || 0;
        if (!totalLength || !panelWidth) return null;

        const gateWidth = 4;
        const fenceableLength = totalLength - numGates * gateWidth;
        const panels = Math.ceil(fenceableLength / panelWidth);
        // Posts = panels + 1 (for line), + 2 per gate (gate posts)
        const posts = panels + 1 + numGates * 2;
        const postCaps = posts;

        // Cost estimates
        const panelCosts: Record<number, Record<number, number>> = {
          4: { 6: 45, 8: 60 },
          5: { 6: 55, 8: 75 },
          6: { 6: 70, 8: 95 },
        };
        const panelCost = panelCosts[fenceHeight]?.[panelWidth] || 80;
        const postCost = fenceHeight <= 4 ? 25 : 35;
        const gateCost = fenceHeight <= 4 ? 120 : 180;
        const capCost = 5;

        const totalCost =
          panels * panelCost +
          posts * postCost +
          postCaps * capCost +
          numGates * gateCost;

        return {
          primary: {
            label: "Panels Needed",
            value: `${formatNumber(panels)} panels`,
          },
          details: [
            { label: "Fence panels", value: formatNumber(panels) },
            { label: "Posts", value: formatNumber(posts) },
            { label: "Post caps", value: formatNumber(postCaps) },
            { label: "Gates", value: formatNumber(numGates) },
            { label: "Estimated material cost", value: `$${formatNumber(totalCost)}` },
          ],
          note: `Based on ${formatNumber(panelWidth)}ft wide x ${formatNumber(fenceHeight)}ft tall panels. Costs are rough estimates and vary by region and brand.`,
        };
      },
    },
    {
      id: "cost-estimate",
      name: "Vinyl Fence Cost Estimate",
      description: "Estimate total installed cost of a vinyl fence",
      fields: [
        {
          name: "totalLength",
          label: "Total Fence Length (feet)",
          type: "number",
          placeholder: "e.g. 200",
        },
        {
          name: "fenceStyle",
          label: "Fence Style",
          type: "select",
          options: [
            { label: "Picket (3-4 ft)", value: "picket" },
            { label: "Semi-Privacy (5-6 ft)", value: "semi" },
            { label: "Privacy (6 ft)", value: "privacy" },
          ],
          defaultValue: "privacy",
        },
        {
          name: "numGates",
          label: "Number of Gates",
          type: "number",
          placeholder: "e.g. 1",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const totalLength = parseFloat(inputs.totalLength as string);
        const fenceStyle = inputs.fenceStyle as string;
        const numGates = parseFloat(inputs.numGates as string) || 0;
        if (!totalLength) return null;

        const costPerFoot: Record<string, number> = {
          picket: 18,
          semi: 25,
          privacy: 30,
        };
        const installPerFoot: Record<string, number> = {
          picket: 10,
          semi: 14,
          privacy: 16,
        };

        const materialCost = totalLength * (costPerFoot[fenceStyle] || 30);
        const installCost = totalLength * (installPerFoot[fenceStyle] || 16);
        const gateCost = numGates * 200;
        const totalMaterial = materialCost + gateCost;
        const totalInstalled = totalMaterial + installCost;

        return {
          primary: {
            label: "Total Installed Cost",
            value: `$${formatNumber(totalInstalled)}`,
          },
          details: [
            { label: "Material cost", value: `$${formatNumber(totalMaterial)}` },
            { label: "Installation cost", value: `$${formatNumber(installCost)}` },
            { label: "Gate cost", value: `$${formatNumber(gateCost)}` },
            { label: "Cost per linear foot (installed)", value: `$${formatNumber(totalInstalled / totalLength, 2)}` },
          ],
          note: "Costs are estimates for budgeting. Get local quotes for accurate pricing. Installation costs vary significantly by region.",
        };
      },
    },
  ],
  relatedSlugs: ["wood-fence-calculator", "fence-post-depth-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How many vinyl fence panels do I need?",
      answer:
        "Divide your total fence length by the panel width (typically 6 or 8 feet). Round up to the next whole number. Subtract the width of any gates from the total length first. You will need one more post than the number of panels, plus 2 extra posts per gate.",
    },
    {
      question: "How long does vinyl fencing last?",
      answer:
        "Quality vinyl fencing lasts 20-30 years with minimal maintenance. It does not rot, warp, or need painting. UV-resistant vinyl prevents yellowing. It typically outlasts wood fencing by 10-15 years, making it cost-effective long-term despite higher upfront costs.",
    },
  ],
  formula:
    "Panels = (Total Length - Gate Widths) / Panel Width | Posts = Panels + 1 + (Gates x 2)",
};
