import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const knittingGaugeCalculator: CalculatorDefinition = {
  slug: "knitting-gauge-calculator",
  title: "Knitting Gauge Calculator",
  description: "Free knitting gauge calculator. Calculate stitches and rows needed for your project based on your gauge swatch.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["knitting gauge calculator", "knitting stitch calculator", "gauge swatch calculator", "knitting row calculator", "stitches per inch"],
  variants: [
    {
      id: "stitch-count",
      name: "Stitches & Rows Needed",
      description: "Calculate how many stitches to cast on and rows to knit",
      fields: [
        { name: "gaugeStitches", label: "Your Gauge: Stitches per 4 inches", type: "number", placeholder: "e.g. 20", step: 0.5 },
        { name: "gaugeRows", label: "Your Gauge: Rows per 4 inches", type: "number", placeholder: "e.g. 28", step: 0.5 },
        { name: "desiredWidth", label: "Desired Width", type: "number", placeholder: "e.g. 20", suffix: "in", step: 0.25 },
        { name: "desiredLength", label: "Desired Length", type: "number", placeholder: "e.g. 24", suffix: "in", step: 0.25 },
      ],
      calculate: (inputs) => {
        const gaugeStitches = inputs.gaugeStitches as number;
        const gaugeRows = inputs.gaugeRows as number;
        const desiredWidth = inputs.desiredWidth as number;
        const desiredLength = inputs.desiredLength as number;
        if (!gaugeStitches || !desiredWidth) return null;

        const stitchesPerInch = gaugeStitches / 4;
        const rowsPerInch = gaugeRows ? gaugeRows / 4 : 0;

        const totalStitches = Math.round(desiredWidth * stitchesPerInch);
        const totalRows = rowsPerInch && desiredLength ? Math.round(desiredLength * rowsPerInch) : 0;

        const stitchesPerCm = stitchesPerInch / 2.54;
        const widthCm = desiredWidth * 2.54;

        const details: { label: string; value: string }[] = [
          { label: "Stitches Per Inch", value: formatNumber(stitchesPerInch, 1) },
          { label: "Stitches Per cm", value: formatNumber(stitchesPerCm, 2) },
          { label: "Target Width", value: `${formatNumber(desiredWidth, 1)} in (${formatNumber(widthCm, 1)} cm)` },
        ];

        if (totalRows) {
          details.push(
            { label: "Rows Per Inch", value: formatNumber(rowsPerInch, 1) },
            { label: "Total Rows Needed", value: `${totalRows}` },
            { label: "Target Length", value: `${formatNumber(desiredLength, 1)} in` },
          );
        }

        return {
          primary: { label: "Cast On", value: `${totalStitches} stitches` },
          details,
          note: "Always knit a gauge swatch before starting your project. Wash and block the swatch before measuring for the most accurate gauge.",
        };
      },
    },
    {
      id: "gauge-adjustment",
      name: "Gauge Adjustment",
      description: "Compare your gauge to pattern gauge and adjust needle size",
      fields: [
        { name: "patternStitches", label: "Pattern Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 20", step: 0.5 },
        { name: "yourStitches", label: "Your Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 22", step: 0.5 },
        { name: "needleSize", label: "Current Needle Size (mm)", type: "number", placeholder: "e.g. 4.5", suffix: "mm", step: 0.25 },
        { name: "patternWidth", label: "Pattern Finished Width", type: "number", placeholder: "e.g. 20", suffix: "in", step: 0.25 },
      ],
      calculate: (inputs) => {
        const patternSts = inputs.patternStitches as number;
        const yourSts = inputs.yourStitches as number;
        const needleSize = inputs.needleSize as number;
        const patternWidth = inputs.patternWidth as number;
        if (!patternSts || !yourSts) return null;

        const ratio = patternSts / yourSts;
        const gaugeDiff = yourSts - patternSts;
        const percentDiff = ((yourSts - patternSts) / patternSts) * 100;

        let recommendation: string;
        let suggestedNeedle: number;

        if (Math.abs(gaugeDiff) < 0.5) {
          recommendation = "Your gauge matches! No adjustment needed.";
          suggestedNeedle = needleSize;
        } else if (gaugeDiff > 0) {
          recommendation = "Your gauge is too tight (too many stitches). Try a larger needle.";
          suggestedNeedle = needleSize + (gaugeDiff > 2 ? 1 : 0.5);
        } else {
          recommendation = "Your gauge is too loose (too few stitches). Try a smaller needle.";
          suggestedNeedle = needleSize - (Math.abs(gaugeDiff) > 2 ? 1 : 0.5);
        }

        // Impact on finished size
        let sizeImpact = "";
        if (patternWidth) {
          const patternStitchCount = (patternSts / 4) * patternWidth;
          const yourWidth = patternStitchCount / (yourSts / 4);
          sizeImpact = `${formatNumber(yourWidth, 1)} in (${formatNumber(yourWidth - patternWidth, 1)} in ${yourWidth > patternWidth ? "wider" : "narrower"})`;
        }

        return {
          primary: { label: "Gauge Difference", value: `${gaugeDiff > 0 ? "+" : ""}${formatNumber(gaugeDiff, 1)} sts` },
          details: [
            { label: "Pattern Gauge", value: `${patternSts} sts/4 in` },
            { label: "Your Gauge", value: `${yourSts} sts/4 in` },
            { label: "Difference", value: `${formatNumber(percentDiff, 1)}%` },
            { label: "Recommendation", value: recommendation },
            { label: "Try Needle Size", value: `${formatNumber(suggestedNeedle, 1)} mm` },
            ...(sizeImpact ? [{ label: "Your Finished Width Would Be", value: sizeImpact }] : []),
          ],
          note: "Change needle size by 0.5mm at a time and re-swatch. Gauge can also be affected by your yarn, tension, and stitch pattern.",
        };
      },
    },
  ],
  relatedSlugs: ["crochet-yarn-calculator", "thread-calculator", "fabric-yardage-calculator"],
  faq: [
    { question: "What is knitting gauge and why does it matter?", answer: "Gauge (tension) is the number of stitches and rows per inch or per 4 inches in your knitting. It determines the finished size of your project. Even a small difference compounds across a garment — 1 extra stitch per inch could make a sweater 3-4 inches too small." },
    { question: "How do I knit a gauge swatch?", answer: "Cast on enough stitches for at least 6 inches of width using the recommended yarn and needles. Knit for at least 6 inches in the pattern stitch. Bind off, wash, and block the swatch. Measure the center 4 inches, counting stitches and rows." },
    { question: "What if my gauge does not match the pattern?", answer: "Go up a needle size if your gauge is tight (too many stitches) or down if loose (too few stitches). Change by 0.5mm increments. Some knitters are consistently tight or loose and always adjust needle sizes." },
  ],
  formula: "Stitches needed = Desired width (inches) × (Gauge stitches / 4) | Rows needed = Desired length × (Gauge rows / 4) | Adjust needle ±0.5mm per 1-2 stitches difference",
};
