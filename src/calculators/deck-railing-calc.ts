import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const deckRailingCalculator: CalculatorDefinition = {
  slug: "deck-railing-calculator",
  title: "Deck Railing Material Calculator",
  description:
    "Calculate materials for deck railings including posts, top/bottom rails, balusters, and hardware. Supports wood, composite, and metal railing systems.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "deck railing calculator",
    "baluster calculator",
    "railing material",
    "deck spindle calculator",
    "how many balusters",
  ],
  variants: [
    {
      id: "standard-railing",
      name: "Standard Deck Railing",
      description: "Calculate materials for standard baluster railing",
      fields: [
        {
          name: "totalLength",
          label: "Total Railing Length (feet)",
          type: "number",
          placeholder: "e.g. 40",
        },
        {
          name: "numCorners",
          label: "Number of Corners/Ends",
          type: "number",
          placeholder: "e.g. 4",
          defaultValue: 4,
        },
        {
          name: "railingHeight",
          label: "Railing Height (inches)",
          type: "select",
          options: [
            { label: '36" (standard)', value: "36" },
            { label: '42" (elevated deck / code)', value: "42" },
          ],
          defaultValue: "36",
        },
        {
          name: "material",
          label: "Material Type",
          type: "select",
          options: [
            { label: "Pressure-Treated Wood", value: "wood" },
            { label: "Cedar", value: "cedar" },
            { label: "Composite", value: "composite" },
          ],
          defaultValue: "wood",
        },
      ],
      calculate: (inputs) => {
        const totalLength = parseFloat(inputs.totalLength as string);
        const numCorners = parseFloat(inputs.numCorners as string) || 4;
        const railingHeight = parseFloat(inputs.railingHeight as string);
        const material = inputs.material as string;
        if (!totalLength || !railingHeight) return null;

        // Posts at corners/ends plus every 6-8 ft
        const sectionLength = 6; // 6ft max section
        const numSections = Math.ceil(totalLength / sectionLength);
        const numPosts = numCorners + Math.max(0, numSections - numCorners);
        const totalPosts = Math.max(numPosts, numCorners);

        // Balusters: max 4" spacing (code), 3.5" baluster = ~5.5" on center
        // Per foot: ~2.2 balusters
        const balustersPerFoot = 12 / 5.5;
        const totalBalusters = Math.ceil(totalLength * balustersPerFoot);

        // Top and bottom rails
        const topRails = numSections;
        const bottomRails = numSections;

        // Post caps
        const postCaps = totalPosts;

        // Hardware: 2 brackets per rail section
        const brackets = numSections * 2;

        // Cost estimates per foot
        const costPerFoot: Record<string, number> = {
          wood: 15,
          cedar: 25,
          composite: 45,
        };
        const totalCost = totalLength * (costPerFoot[material] || 15);

        return {
          primary: {
            label: "Total Balusters",
            value: `${formatNumber(totalBalusters)} balusters`,
          },
          details: [
            { label: "Railing length", value: `${formatNumber(totalLength)} ft` },
            { label: "Posts (4x4)", value: formatNumber(totalPosts) },
            { label: "Top rails (2x4)", value: formatNumber(topRails) },
            { label: "Bottom rails (2x4)", value: formatNumber(bottomRails) },
            { label: "Balusters (2x2)", value: formatNumber(totalBalusters) },
            { label: "Post caps", value: formatNumber(postCaps) },
            { label: "Rail brackets", value: formatNumber(brackets) },
            { label: "Estimated material cost", value: `$${formatNumber(totalCost)}` },
          ],
          note: `Building code requires railing on decks 30" or more above grade. Baluster spacing must not exceed 4" (a 4" sphere cannot pass through). Railing height is ${formatNumber(railingHeight)}" from deck surface.`,
        };
      },
    },
    {
      id: "baluster-spacing",
      name: "Baluster Spacing Calculator",
      description: "Calculate exact baluster count and spacing for a section",
      fields: [
        {
          name: "sectionLength",
          label: "Section Length (inches)",
          type: "number",
          placeholder: "e.g. 72",
        },
        {
          name: "balusterWidth",
          label: "Baluster Width (inches)",
          type: "select",
          options: [
            { label: '1.5" (2x2 wood)', value: "1.5" },
            { label: '0.75" (metal)', value: "0.75" },
            { label: '1.25" (composite)', value: "1.25" },
          ],
          defaultValue: "1.5",
        },
        {
          name: "maxGap",
          label: "Maximum Gap (inches)",
          type: "select",
          options: [
            { label: '3.5" (tight spacing)', value: "3.5" },
            { label: '4" (code maximum)', value: "4" },
          ],
          defaultValue: "4",
        },
      ],
      calculate: (inputs) => {
        const sectionLength = parseFloat(inputs.sectionLength as string);
        const balusterWidth = parseFloat(inputs.balusterWidth as string);
        const maxGap = parseFloat(inputs.maxGap as string);
        if (!sectionLength || !balusterWidth || !maxGap) return null;

        // Number of balusters: n = ceil((section - gap) / (baluster + gap))
        const numBalusters = Math.ceil((sectionLength - maxGap) / (balusterWidth + maxGap));
        // Actual gap: gap = (section - n * baluster) / (n + 1)
        const actualGap = (sectionLength - numBalusters * balusterWidth) / (numBalusters + 1);

        return {
          primary: {
            label: "Balusters per Section",
            value: `${formatNumber(numBalusters)}`,
          },
          details: [
            { label: "Section length", value: `${formatNumber(sectionLength)} inches` },
            { label: "Number of balusters", value: formatNumber(numBalusters) },
            { label: "Actual gap between balusters", value: `${formatNumber(actualGap, 2)} inches` },
            { label: "Max allowed gap", value: `${formatNumber(maxGap)} inches` },
            { label: "Gap passes code", value: actualGap <= maxGap ? "YES" : "NO" },
          ],
          note: "Code requires that a 4-inch sphere cannot pass through any opening. Calculate gaps between balusters and between balusters and posts.",
        };
      },
    },
  ],
  relatedSlugs: ["wood-fence-calculator", "square-footage-calculator", "concrete-calculator"],
  faq: [
    {
      question: "How many balusters do I need per foot of railing?",
      answer:
        "With standard 2x2 wood balusters (1.5\" wide) and code-maximum 4\" gaps, you need approximately 2.2 balusters per linear foot of railing. For 3/4\" metal balusters at 4\" gaps, you need about 2.5 per foot.",
    },
    {
      question: "What height does a deck railing need to be?",
      answer:
        "Most building codes require a minimum railing height of 36 inches for residential decks. If the deck is more than 30 inches above grade, railings are required. Some jurisdictions require 42-inch railings for decks higher than 30 inches. Always check local codes.",
    },
  ],
  formula:
    "Balusters = (Section Length - Gap) / (Baluster Width + Gap) | Actual Gap = (Section - n x Width) / (n + 1)",
};
