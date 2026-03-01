import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yarnYardageCalculator: CalculatorDefinition = {
  slug: "yarn-yardage-calculator",
  title: "Yarn Yardage Calculator",
  description: "Estimate yarn yardage needed for a knitting project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["yarn yardage","knitting yarn calculator"],
  variants: [{
    id: "standard",
    name: "Yarn Yardage",
    description: "Estimate yarn yardage needed for a knitting project.",
    fields: [
      { name: "stitchesPerInch", label: "Stitches Per Inch", type: "number", min: 1, max: 12, defaultValue: 5 },
      { name: "rowsPerInch", label: "Rows Per Inch", type: "number", min: 1, max: 15, defaultValue: 7 },
      { name: "width", label: "Project Width (in)", type: "number", min: 1, max: 100, defaultValue: 20 },
      { name: "length", label: "Project Length (in)", type: "number", min: 1, max: 200, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const spi = inputs.stitchesPerInch as number;
      const rpi = inputs.rowsPerInch as number;
      const w = inputs.width as number;
      const l = inputs.length as number;
      if (!spi || !rpi || !w || !l) return null;
      const totalStitches = (spi * w) * (rpi * l);
      const yarnPerStitch = 1.5;
      const totalInches = totalStitches * yarnPerStitch;
      const totalYards = totalInches / 36;
      const skeins = Math.ceil(totalYards / 220);
      return {
        primary: { label: "Yarn Needed", value: formatNumber(Math.round(totalYards)) + " yards" },
        details: [
          { label: "Total Stitches", value: formatNumber(totalStitches) },
          { label: "Skeins (220 yd)", value: formatNumber(skeins) },
          { label: "Meters", value: formatNumber(Math.round(totalYards * 0.9144)) + " m" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How do I figure stitches per inch?", answer: "Knit a 4-inch swatch and count the stitches, then divide by 4." },
    { question: "How much extra yarn should I buy?", answer: "Buy one extra skein to account for gauge differences and mistakes." },
  ],
  formula: "Yards = Total Stitches x Yarn Per Stitch / 36",
};
