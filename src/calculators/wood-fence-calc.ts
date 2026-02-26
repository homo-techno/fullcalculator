import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const woodFenceCalculator: CalculatorDefinition = {
  slug: "wood-fence-calculator",
  title: "Wood Fence Board & Post Calculator",
  description:
    "Calculate wood fence materials including pickets, posts, rails, and hardware. Estimate boards needed for privacy, picket, and board-on-board fences.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "wood fence calculator",
    "fence board calculator",
    "fence picket calculator",
    "how many fence boards",
    "fence post spacing",
  ],
  variants: [
    {
      id: "privacy-fence",
      name: "Privacy Fence",
      description: "Calculate materials for a standard wood privacy fence",
      fields: [
        {
          name: "totalLength",
          label: "Total Fence Length (feet)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "fenceHeight",
          label: "Fence Height (feet)",
          type: "select",
          options: [
            { label: "4 ft", value: "4" },
            { label: "6 ft", value: "6" },
            { label: "8 ft", value: "8" },
          ],
          defaultValue: "6",
        },
        {
          name: "picketWidth",
          label: "Picket Width (inches)",
          type: "select",
          options: [
            { label: '3.5" (1x4)', value: "3.5" },
            { label: '5.5" (1x6)', value: "5.5" },
          ],
          defaultValue: "5.5",
        },
        {
          name: "postSpacing",
          label: "Post Spacing (feet)",
          type: "select",
          options: [
            { label: "6 ft", value: "6" },
            { label: "8 ft", value: "8" },
          ],
          defaultValue: "8",
        },
      ],
      calculate: (inputs) => {
        const totalLength = parseFloat(inputs.totalLength as string);
        const fenceHeight = parseFloat(inputs.fenceHeight as string);
        const picketWidth = parseFloat(inputs.picketWidth as string);
        const postSpacing = parseFloat(inputs.postSpacing as string);
        if (!totalLength || !fenceHeight || !picketWidth || !postSpacing) return null;

        const picketWidthFt = picketWidth / 12;
        const pickets = Math.ceil(totalLength / picketWidthFt);
        const posts = Math.ceil(totalLength / postSpacing) + 1;
        const rails = fenceHeight <= 4 ? 2 : 3;
        const totalRails = (posts - 1) * rails;
        const nails = pickets * rails * 2;

        // Post length = fence height + 2 ft (buried) + 0.5 ft (above)
        const postLength = fenceHeight + 2;

        return {
          primary: {
            label: "Pickets Needed",
            value: `${formatNumber(pickets)} boards`,
          },
          details: [
            { label: "Fence pickets", value: `${formatNumber(pickets)} (${formatNumber(fenceHeight)}ft long)` },
            { label: "Posts (4x4)", value: `${formatNumber(posts)} (${formatNumber(postLength)}ft long)` },
            { label: "Rails (2x4)", value: `${formatNumber(totalRails)} (${formatNumber(postSpacing)}ft long)` },
            { label: "Rails per section", value: formatNumber(rails) },
            { label: "Nails/screws (approx)", value: formatNumber(nails) },
          ],
          note: "For a tight privacy fence with no gaps. Add 10% extra pickets for waste and cutting. Posts should be pressure-treated.",
        };
      },
    },
    {
      id: "board-on-board",
      name: "Board-on-Board Fence",
      description: "Calculate materials for overlapping board-on-board style",
      fields: [
        {
          name: "totalLength",
          label: "Total Fence Length (feet)",
          type: "number",
          placeholder: "e.g. 150",
        },
        {
          name: "fenceHeight",
          label: "Fence Height (feet)",
          type: "select",
          options: [
            { label: "6 ft", value: "6" },
            { label: "8 ft", value: "8" },
          ],
          defaultValue: "6",
        },
        {
          name: "overlap",
          label: "Board Overlap (inches)",
          type: "number",
          placeholder: "e.g. 1.5",
          defaultValue: 1.5,
        },
      ],
      calculate: (inputs) => {
        const totalLength = parseFloat(inputs.totalLength as string);
        const fenceHeight = parseFloat(inputs.fenceHeight as string);
        const overlap = parseFloat(inputs.overlap as string) || 1.5;
        if (!totalLength || !fenceHeight) return null;

        const boardWidth = 5.5; // 1x6
        const effectiveWidth = boardWidth - overlap;
        const boardsPerFoot = 12 / effectiveWidth;
        const totalBoards = Math.ceil(totalLength * boardsPerFoot);
        const posts = Math.ceil(totalLength / 8) + 1;
        const rails = 3;
        const totalRails = (posts - 1) * rails;

        return {
          primary: {
            label: "Boards Needed",
            value: `${formatNumber(totalBoards)} boards`,
          },
          details: [
            { label: "1x6 fence boards", value: `${formatNumber(totalBoards)} (${formatNumber(fenceHeight)}ft)` },
            { label: "Posts (4x4)", value: `${formatNumber(posts)} (${formatNumber(fenceHeight + 2)}ft)` },
            { label: "Rails (2x4)", value: formatNumber(totalRails) },
            { label: "Effective board width", value: `${formatNumber(effectiveWidth, 1)} inches` },
            { label: "Boards per linear foot", value: formatNumber(boardsPerFoot, 1) },
          ],
          note: "Board-on-board uses ~50% more pickets than a standard privacy fence due to the overlap.",
        };
      },
    },
  ],
  relatedSlugs: ["vinyl-fence-calculator", "fence-post-depth-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How many fence boards do I need per foot?",
      answer:
        "For 1x6 boards (5.5\" wide) in a tight privacy fence, you need about 2.2 boards per linear foot. For 1x4 boards (3.5\" wide), you need about 3.4 boards per foot. Board-on-board style requires roughly 3 boards per foot with standard overlap.",
    },
    {
      question: "How far apart should fence posts be?",
      answer:
        "Standard fence post spacing is 6 to 8 feet on center. The most common is 8 feet because lumber comes in 8ft and 16ft lengths. For high-wind areas or taller fences (8ft), use 6-foot spacing for added strength.",
    },
    {
      question: "How deep should wood fence posts be?",
      answer:
        "Fence posts should be buried at least 1/3 of their total length. For a 6-foot fence, use 8-foot posts buried 24 inches deep. In cold climates, posts should extend below the frost line, typically 36-48 inches deep.",
    },
  ],
  formula:
    "Pickets = Fence Length / Picket Width | Posts = (Length / Spacing) + 1 | Rails = Sections x Rails per Section",
};
