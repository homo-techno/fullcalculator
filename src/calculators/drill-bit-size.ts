import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const drillBitSizeCalculator: CalculatorDefinition = {
  slug: "drill-bit-size-calculator",
  title: "Drill Bit Size Calculator",
  description: "Free drill bit size calculator. Find the right drill bit size in fractional, decimal, letter, and metric equivalents.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["drill bit size calculator", "drill bit chart", "drill bit conversion", "tap drill size", "drill bit decimal"],
  variants: [
    {
      id: "from-decimal",
      name: "Find Closest Drill Bit",
      description: "Find the nearest standard drill bit to a decimal size",
      fields: [
        { name: "targetSize", label: "Target Hole Size (inches)", type: "number", placeholder: "e.g. 0.156" },
        {
          name: "bitSet",
          label: "Drill Bit Set Available",
          type: "select",
          options: [
            { label: "Fractional (1/64 increments)", value: "fractional" },
            { label: "Number/Letter Set", value: "number" },
            { label: "Metric Set", value: "metric" },
          ],
        },
        {
          name: "preference",
          label: "Size Preference",
          type: "select",
          options: [
            { label: "Closest match", value: "closest" },
            { label: "Next size up", value: "up" },
            { label: "Next size down", value: "down" },
          ],
        },
      ],
      calculate: (inputs) => {
        const target = inputs.targetSize as number;
        const bitSet = inputs.bitSet as string;
        const preference = inputs.preference as string;
        if (!target) return null;
        const fractionalSizes: [string, number][] = [];
        for (let n = 1; n <= 64; n++) {
          const val = n / 64;
          const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
          const g = gcd(n, 64);
          fractionalSizes.push([`${n/g}/${64/g}`, val]);
        }
        let closest = fractionalSizes[0];
        let closestDiff = Math.abs(fractionalSizes[0][1] - target);
        let nextUp = fractionalSizes[fractionalSizes.length - 1];
        let nextDown = fractionalSizes[0];
        for (const s of fractionalSizes) {
          const diff = Math.abs(s[1] - target);
          if (diff < closestDiff) { closestDiff = diff; closest = s; }
          if (s[1] >= target && s[1] < nextUp[1]) nextUp = s;
          if (s[1] <= target && s[1] > nextDown[1]) nextDown = s;
        }
        const selected = preference === "up" ? nextUp : preference === "down" ? nextDown : closest;
        const metricMm = target * 25.4;
        const closestMetric = Math.round(metricMm * 2) / 2;
        const selectedDecimal = selected[1];
        const error = selectedDecimal - target;
        return {
          primary: { label: "Drill Bit Size", value: `${selected[0]} inch` },
          details: [
            { label: "Decimal Equivalent", value: `${formatNumber(selectedDecimal, 4)} inches` },
            { label: "Target Size", value: `${formatNumber(target, 4)} inches` },
            { label: "Size Difference", value: `${formatNumber(error, 4)} inches` },
            { label: "Metric Equivalent", value: `${formatNumber(metricMm, 2)} mm` },
            { label: "Nearest Metric Bit", value: `${formatNumber(closestMetric, 1)} mm` },
            { label: "Next Size Up", value: `${nextUp[0]} (${formatNumber(nextUp[1], 4)})` },
            { label: "Next Size Down", value: `${nextDown[0]} (${formatNumber(nextDown[1], 4)})` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["wood-screw-pilot-calculator", "dowel-spacing-calculator", "router-bit-speed-calculator"],
  faq: [
    { question: "How do I choose the right drill bit size?", answer: "Match the drill bit to your purpose. For pilot holes, use a bit matching the screw root diameter. For clearance holes, match the shank diameter. For dowels, match the dowel exactly." },
    { question: "What is the difference between fractional and number drill bits?", answer: "Fractional bits come in 1/64 inch increments. Number bits (1-80) and letter bits (A-Z) fill in the gaps between fractional sizes for more precise sizing." },
  ],
  formula: "Fractional sizes = N/64 inch | Metric = Inches x 25.4 mm | Closest = min(|bit - target|)",
};
