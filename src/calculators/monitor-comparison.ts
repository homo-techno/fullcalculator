import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const monitorComparisonCalculator: CalculatorDefinition = {
  slug: "monitor-comparison-calculator",
  title: "Monitor Comparison Calculator",
  description:
    "Free monitor comparison calculator. Compare two monitors by PPI, screen area, and total pixels side by side.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "monitor comparison",
    "PPI calculator",
    "pixels per inch",
    "screen size",
    "display comparison",
  ],
  variants: [
    {
      id: "calc",
      name: "Compare",
      fields: [
        {
          name: "diag1",
          label: "Monitor 1 - Diagonal (inches)",
          type: "number",
          placeholder: "e.g. 27",
        },
        {
          name: "resW1",
          label: "Monitor 1 - Resolution Width (px)",
          type: "number",
          placeholder: "e.g. 2560",
        },
        {
          name: "resH1",
          label: "Monitor 1 - Resolution Height (px)",
          type: "number",
          placeholder: "e.g. 1440",
        },
        {
          name: "diag2",
          label: "Monitor 2 - Diagonal (inches)",
          type: "number",
          placeholder: "e.g. 32",
        },
        {
          name: "resW2",
          label: "Monitor 2 - Resolution Width (px)",
          type: "number",
          placeholder: "e.g. 3840",
        },
        {
          name: "resH2",
          label: "Monitor 2 - Resolution Height (px)",
          type: "number",
          placeholder: "e.g. 2160",
        },
      ],
      calculate: (inputs) => {
        const diag1 = inputs.diag1 as number;
        const resW1 = inputs.resW1 as number;
        const resH1 = inputs.resH1 as number;
        const diag2 = inputs.diag2 as number;
        const resW2 = inputs.resW2 as number;
        const resH2 = inputs.resH2 as number;
        if (!diag1 || !resW1 || !resH1 || !diag2 || !resW2 || !resH2)
          return null;

        // PPI = sqrt(w^2 + h^2) / diagonal
        const ppi1 = Math.sqrt(resW1 * resW1 + resH1 * resH1) / diag1;
        const ppi2 = Math.sqrt(resW2 * resW2 + resH2 * resH2) / diag2;

        // Screen dimensions (16:9 assumed via resolution ratio)
        const aspectRatio1 = resW1 / resH1;
        const width1 = diag1 * (aspectRatio1 / Math.sqrt(1 + aspectRatio1 * aspectRatio1));
        const height1 = width1 / aspectRatio1;
        const area1 = width1 * height1;

        const aspectRatio2 = resW2 / resH2;
        const width2 = diag2 * (aspectRatio2 / Math.sqrt(1 + aspectRatio2 * aspectRatio2));
        const height2 = width2 / aspectRatio2;
        const area2 = width2 * height2;

        const totalPixels1 = resW1 * resH1;
        const totalPixels2 = resW2 * resH2;

        const ppiWinner = ppi1 > ppi2 ? "Monitor 1" : ppi1 < ppi2 ? "Monitor 2" : "Tie";
        const areaWinner = area1 > area2 ? "Monitor 1" : area1 < area2 ? "Monitor 2" : "Tie";

        return {
          primary: {
            label: "Higher PPI",
            value: ppiWinner + " (" + formatNumber(Math.max(ppi1, ppi2), 1) + " PPI)",
          },
          details: [
            {
              label: "Monitor 1 PPI",
              value: formatNumber(ppi1, 1),
            },
            {
              label: "Monitor 2 PPI",
              value: formatNumber(ppi2, 1),
            },
            {
              label: "Monitor 1 Area",
              value: formatNumber(area1, 1) + " sq in",
            },
            {
              label: "Monitor 2 Area",
              value: formatNumber(area2, 1) + " sq in",
            },
            {
              label: "Monitor 1 Total Pixels",
              value: formatNumber(totalPixels1, 0),
            },
            {
              label: "Monitor 2 Total Pixels",
              value: formatNumber(totalPixels2, 0),
            },
            {
              label: "Pixel Count Ratio",
              value: "Monitor 2 has " + formatNumber((totalPixels2 / totalPixels1) * 100, 0) + "% of Monitor 1's pixels",
            },
            {
              label: "Larger Screen",
              value: areaWinner,
            },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["tv-distance-calculator", "projector-size-calculator"],
  faq: [
    {
      question: "What is PPI and why does it matter?",
      answer:
        "PPI (Pixels Per Inch) measures pixel density. Higher PPI means sharper text and images. A 27-inch 2560x1440 monitor has ~109 PPI, while a 27-inch 3840x2160 (4K) has ~163 PPI.",
    },
    {
      question: "Is a higher resolution always better?",
      answer:
        "Not necessarily. Higher resolution requires more GPU power for gaming. At normal viewing distances, the benefit of very high PPI diminishes. For productivity, higher resolution provides more screen real estate.",
    },
  ],
  formula:
    "PPI = sqrt(resolution_width^2 + resolution_height^2) / diagonal_inches. Screen Width = diagonal x (aspect / sqrt(1 + aspect^2)). Total Pixels = width_px x height_px.",
};
