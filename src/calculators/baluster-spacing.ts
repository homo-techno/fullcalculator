import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const balusterSpacingCalculator: CalculatorDefinition = {
  slug: "baluster-spacing-calculator",
  title: "Baluster Spacing Calculator",
  description: "Free baluster spacing calculator. Calculate the number of balusters, spindles, or pickets and even spacing for deck railings, stair railings, and balconies.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baluster spacing calculator", "spindle spacing calculator", "railing baluster calculator", "deck baluster calculator", "picket spacing calculator"],
  variants: [
    {
      id: "standard",
      name: "Standard Baluster Layout",
      description: "Calculate number of balusters and spacing for a railing section",
      fields: [
        { name: "sectionLength", label: "Railing Section Length (inches)", type: "number", placeholder: "e.g. 72" },
        { name: "balusterWidth", label: "Baluster Width (inches)", type: "select", options: [
          { label: "1.5\" (standard 2x2)", value: "1.5" },
          { label: "1.25\" (turned spindle)", value: "1.25" },
          { label: "0.75\" (metal baluster)", value: "0.75" },
          { label: "3.5\" (flat 1x4 panel)", value: "3.5" },
        ], defaultValue: "1.5" },
        { name: "maxGap", label: "Maximum Gap (inches)", type: "select", options: [
          { label: "4\" (standard building code)", value: "4" },
          { label: "3.5\" (extra safe)", value: "3.5" },
          { label: "3\" (tight spacing)", value: "3" },
          { label: "6\" (some commercial codes)", value: "6" },
        ], defaultValue: "4" },
        { name: "postWidth", label: "Post Width (inches)", type: "number", placeholder: "e.g. 3.5", defaultValue: 3.5 },
      ],
      calculate: (inputs) => {
        const sectionLength = inputs.sectionLength as number;
        const balusterWidth = parseFloat(inputs.balusterWidth as string) || 1.5;
        const maxGap = parseFloat(inputs.maxGap as string) || 4;
        const postWidth = (inputs.postWidth as number) || 3.5;
        if (!sectionLength) return null;

        const clearSpan = sectionLength - postWidth;
        const numBalusters = Math.ceil((clearSpan - maxGap) / (balusterWidth + maxGap));
        const actualGap = (clearSpan - numBalusters * balusterWidth) / (numBalusters + 1);
        const meetsCode = actualGap <= 4;

        return {
          primary: { label: "Balusters Needed", value: `${numBalusters}` },
          details: [
            { label: "Actual gap between balusters", value: `${formatNumber(actualGap, 3)} in` },
            { label: "Clear span (between posts)", value: `${formatNumber(clearSpan, 2)} in` },
            { label: "Baluster width", value: `${balusterWidth} in` },
            { label: "Gap at each end (post to baluster)", value: `${formatNumber(actualGap, 3)} in` },
            { label: "Meets 4\" sphere test", value: meetsCode ? "Yes" : "No" },
            { label: "Total baluster material", value: `${formatNumber(numBalusters * balusterWidth, 1)} in` },
          ],
          note: "Building code requires that a 4-inch sphere cannot pass through any opening. Gaps are evenly distributed including the spaces between posts and the first/last baluster.",
        };
      },
    },
    {
      id: "total-railing",
      name: "Total Railing Project",
      description: "Calculate total balusters needed for an entire railing project",
      fields: [
        { name: "totalLength", label: "Total Railing Length (feet)", type: "number", placeholder: "e.g. 32" },
        { name: "postSpacing", label: "Post Spacing (feet)", type: "number", placeholder: "e.g. 6", defaultValue: 6 },
        { name: "balusterWidth", label: "Baluster Width (inches)", type: "select", options: [
          { label: "1.5\" (standard 2x2)", value: "1.5" },
          { label: "1.25\" (turned spindle)", value: "1.25" },
          { label: "0.75\" (metal baluster)", value: "0.75" },
        ], defaultValue: "1.5" },
        { name: "maxGap", label: "Maximum Gap (inches)", type: "number", placeholder: "e.g. 4", defaultValue: 4 },
        { name: "priceEach", label: "Price per Baluster (optional)", type: "number", placeholder: "e.g. 3.50", prefix: "$" },
      ],
      calculate: (inputs) => {
        const totalLengthFt = inputs.totalLength as number;
        const postSpacing = (inputs.postSpacing as number) || 6;
        const balusterWidth = parseFloat(inputs.balusterWidth as string) || 1.5;
        const maxGap = (inputs.maxGap as number) || 4;
        const price = inputs.priceEach as number;
        if (!totalLengthFt) return null;

        const totalLengthIn = totalLengthFt * 12;
        const numSections = Math.ceil(totalLengthFt / postSpacing);
        const sectionLengthIn = totalLengthIn / numSections;
        const postWidth = 3.5;
        const clearSpan = sectionLengthIn - postWidth;
        const balustersPerSection = Math.ceil((clearSpan - maxGap) / (balusterWidth + maxGap));
        const totalBalusters = balustersPerSection * numSections;
        const numPosts = numSections + 1;
        const totalWithExtra = Math.ceil(totalBalusters * 1.05);

        const details = [
          { label: "Balusters per section", value: `${balustersPerSection}` },
          { label: "Number of sections", value: `${numSections}` },
          { label: "Total balusters", value: `${totalBalusters}` },
          { label: "With 5% waste", value: `${totalWithExtra}` },
          { label: "Posts needed", value: `${numPosts}` },
          { label: "Section length", value: `${formatNumber(sectionLengthIn, 1)} in` },
        ];

        if (price) {
          details.push({ label: "Estimated baluster cost", value: `$${formatNumber(totalWithExtra * price, 2)}` });
        }

        return {
          primary: { label: "Total Balusters Needed", value: `${totalWithExtra} (includes 5% waste)` },
          details,
          note: "Post spacing of 6 feet is typical for most residential railings. Always buy a few extra balusters for cuts and mistakes.",
        };
      },
    },
  ],
  relatedSlugs: ["handrail-height-calculator", "stair-stringer-calculator", "deck-board-calculator"],
  faq: [
    { question: "What is the code for baluster spacing?", answer: "The IRC (International Residential Code) requires that a 4-inch sphere cannot pass through any opening in the railing system. This means the clear gap between balusters must be less than 4 inches. This applies to deck railings, stair railings, and balcony guards." },
    { question: "How many balusters do I need per foot?", answer: "With standard 1.5-inch balusters and 3.75-inch gaps (under the 4-inch maximum), you need approximately 2-3 balusters per foot of railing. The exact number depends on your baluster width and desired gap." },
  ],
  formula: "Balusters = ceil((Clear Span - Max Gap) / (Baluster Width + Max Gap)) | Actual Gap = (Clear Span - N \u00D7 Width) / (N + 1)",
};
