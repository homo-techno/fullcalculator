import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tvDistanceCalculator: CalculatorDefinition = {
  slug: "tv-distance-calculator",
  title: "TV Viewing Distance Calculator",
  description:
    "Free TV viewing distance calculator. Find the optimal seating distance for any TV size based on screen diagonal.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "TV distance",
    "viewing distance",
    "TV size",
    "seating distance",
    "screen size",
  ],
  variants: [
    {
      id: "calc",
      name: "Calculate",
      fields: [
        {
          name: "tvSize",
          label: "TV Size (diagonal inches)",
          type: "number",
          placeholder: "e.g. 65",
        },
      ],
      calculate: (inputs) => {
        const tvSize = inputs.tvSize as number;
        if (!tvSize || tvSize <= 0) return null;

        // Recommended: 1.5x to 2.5x the diagonal
        const minDistIn = tvSize * 1.5;
        const maxDistIn = tvSize * 2.5;
        const optimalDistIn = tvSize * 2.0;

        const minDistFt = minDistIn / 12;
        const maxDistFt = maxDistIn / 12;
        const optimalDistFt = optimalDistIn / 12;
        const optimalDistM = optimalDistFt * 0.3048;

        // 16:9 dimensions
        const widthIn = tvSize * (16 / Math.sqrt(16 * 16 + 9 * 9));
        const heightIn = tvSize * (9 / Math.sqrt(16 * 16 + 9 * 9));

        // THX recommendation: 40-degree viewing angle
        const thxDistIn = widthIn / (2 * Math.tan((40 * Math.PI) / 360));
        const thxDistFt = thxDistIn / 12;

        // SMPTE: 30-degree viewing angle
        const smpteDistIn = widthIn / (2 * Math.tan((30 * Math.PI) / 360));
        const smpteDistFt = smpteDistIn / 12;

        return {
          primary: {
            label: "Recommended Distance",
            value:
              formatNumber(minDistFt, 1) +
              " - " +
              formatNumber(maxDistFt, 1) +
              " ft",
          },
          details: [
            {
              label: "Optimal (2x diagonal)",
              value:
                formatNumber(optimalDistFt, 1) +
                " ft (" +
                formatNumber(optimalDistM, 1) +
                " m)",
            },
            {
              label: "THX Rec. (40 deg)",
              value: formatNumber(thxDistFt, 1) + " ft",
            },
            {
              label: "SMPTE Rec. (30 deg)",
              value: formatNumber(smpteDistFt, 1) + " ft",
            },
            {
              label: "TV Diagonal",
              value: formatNumber(tvSize, 0) + " inches",
            },
            {
              label: "Screen Width",
              value: formatNumber(widthIn, 1) + " inches",
            },
            {
              label: "Screen Height",
              value: formatNumber(heightIn, 1) + " inches",
            },
            {
              label: "Screen Area",
              value: formatNumber((widthIn * heightIn) / 144, 1) + " sq ft",
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: [
    "projector-size-calculator",
    "monitor-comparison-calculator",
  ],
  faq: [
    {
      question: "How far should I sit from my TV?",
      answer:
        "A common guideline is 1.5 to 2.5 times the screen diagonal. For a 65-inch TV, that is about 8 to 13.5 feet. THX recommends a 40-degree viewing angle, and SMPTE recommends 30 degrees.",
    },
    {
      question: "Does 4K resolution change the recommended distance?",
      answer:
        "Yes. With 4K resolution, you can sit closer without seeing pixels. Some recommendations for 4K suggest 1.0 to 1.5 times the diagonal, allowing you to enjoy the extra detail.",
    },
  ],
  formula:
    "Minimum distance = diagonal x 1.5. Maximum distance = diagonal x 2.5. THX: distance = width / (2 x tan(20 deg)). SMPTE: distance = width / (2 x tan(15 deg)). 16:9 width = diagonal x 0.8716.",
};
