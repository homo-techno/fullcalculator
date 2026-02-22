import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const knittingPatternCalculator: CalculatorDefinition = {
  slug: "knitting-pattern-calculator",
  title: "Knitting Pattern Resizer Calculator",
  description: "Free knitting pattern resizer calculator. Resize knitting patterns by adjusting stitch counts and row counts to match your gauge and desired dimensions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["knitting pattern resizer", "resize knitting pattern", "knitting stitch calculator", "adjust knitting gauge", "knitting size calculator"],
  variants: [
    {
      id: "gauge-resize",
      name: "Gauge Resize",
      description: "Resize a pattern to match your actual gauge",
      fields: [
        { name: "patternStitches", label: "Pattern Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 20", step: 0.5 },
        { name: "patternRows", label: "Pattern Gauge (rows per 4 in)", type: "number", placeholder: "e.g. 28", step: 0.5 },
        { name: "yourStitches", label: "Your Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 18", step: 0.5 },
        { name: "yourRows", label: "Your Gauge (rows per 4 in)", type: "number", placeholder: "e.g. 26", step: 0.5 },
        { name: "castOn", label: "Pattern Cast-on Stitches", type: "number", placeholder: "e.g. 80", min: 1, step: 1 },
        { name: "totalRows", label: "Pattern Total Rows", type: "number", placeholder: "e.g. 120", min: 1, step: 1 },
      ],
      calculate: (inputs) => {
        const patternStitches = inputs.patternStitches as number;
        const patternRows = inputs.patternRows as number;
        const yourStitches = inputs.yourStitches as number;
        const yourRows = inputs.yourRows as number;
        const castOn = inputs.castOn as number;
        const totalRows = inputs.totalRows as number;
        if (!patternStitches || !patternRows || !yourStitches || !yourRows || !castOn || !totalRows) return null;

        // Original dimensions
        const origWidth = (castOn / patternStitches) * 4;
        const origLength = (totalRows / patternRows) * 4;

        // New stitch/row counts to achieve same dimensions
        const newCastOn = Math.round((origWidth / 4) * yourStitches);
        const newTotalRows = Math.round((origLength / 4) * yourRows);

        // Stitch ratio
        const stitchRatio = yourStitches / patternStitches;
        const rowRatio = yourRows / patternRows;

        // If you keep original stitch count, what dimensions result?
        const resultWidth = (castOn / yourStitches) * 4;
        const resultLength = (totalRows / yourRows) * 4;

        return {
          primary: { label: "Adjusted Cast-on", value: `${newCastOn}`, suffix: "stitches" },
          details: [
            { label: "Adjusted Row Count", value: `${newTotalRows} rows` },
            { label: "Target Dimensions", value: `${formatNumber(origWidth, 1)} × ${formatNumber(origLength, 1)} in` },
            { label: "Stitch Ratio", value: formatNumber(stitchRatio, 3) },
            { label: "Row Ratio", value: formatNumber(rowRatio, 3) },
            { label: "If Unchanged", value: `${formatNumber(resultWidth, 1)} × ${formatNumber(resultLength, 1)} in` },
            { label: "Difference", value: `${formatNumber(resultWidth - origWidth, 1)} × ${formatNumber(resultLength - origLength, 1)} in` },
          ],
          note: "When resizing, stitch patterns with repeats may need adjustment. Round to the nearest pattern repeat count. For example, if your pattern has a 4-stitch repeat, round the new cast-on to a multiple of 4.",
        };
      },
    },
    {
      id: "dimension-resize",
      name: "Resize to New Dimensions",
      description: "Calculate stitch and row counts for different finished dimensions",
      fields: [
        { name: "gaugeStitches", label: "Your Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 20", step: 0.5 },
        { name: "gaugeRows", label: "Your Gauge (rows per 4 in)", type: "number", placeholder: "e.g. 28", step: 0.5 },
        { name: "desiredWidth", label: "Desired Width", type: "number", placeholder: "e.g. 20", suffix: "in", step: 0.25 },
        { name: "desiredLength", label: "Desired Length", type: "number", placeholder: "e.g. 25", suffix: "in", step: 0.25 },
        { name: "patternRepeat", label: "Stitch Pattern Repeat", type: "select", options: [
          { label: "No repeat (stockinette, garter)", value: "1" },
          { label: "2-stitch repeat", value: "2" },
          { label: "4-stitch repeat", value: "4" },
          { label: "6-stitch repeat", value: "6" },
          { label: "8-stitch repeat", value: "8" },
          { label: "10-stitch repeat", value: "10" },
          { label: "12-stitch repeat", value: "12" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const gaugeStitches = inputs.gaugeStitches as number;
        const gaugeRows = inputs.gaugeRows as number;
        const desiredWidth = inputs.desiredWidth as number;
        const desiredLength = inputs.desiredLength as number;
        const patternRepeat = parseInt(inputs.patternRepeat as string);
        if (!gaugeStitches || !gaugeRows || !desiredWidth || !desiredLength) return null;

        const stitchesPerInch = gaugeStitches / 4;
        const rowsPerInch = gaugeRows / 4;

        let totalStitches = Math.round(desiredWidth * stitchesPerInch);
        const totalRows = Math.round(desiredLength * rowsPerInch);

        // Adjust for pattern repeat
        if (patternRepeat > 1) {
          totalStitches = Math.round(totalStitches / patternRepeat) * patternRepeat;
        }

        const actualWidth = totalStitches / stitchesPerInch;
        const actualLength = totalRows / rowsPerInch;

        // Yarn estimate (rough)
        const yardageEstimate = (totalStitches * totalRows * 0.02); // rough inches per stitch

        return {
          primary: { label: "Cast On", value: `${totalStitches}`, suffix: "stitches" },
          details: [
            { label: "Total Rows", value: `${totalRows}` },
            { label: "Actual Width", value: `${formatNumber(actualWidth, 2)} in` },
            { label: "Actual Length", value: `${formatNumber(actualLength, 2)} in` },
            { label: "Stitches Per Inch", value: formatNumber(stitchesPerInch, 2) },
            { label: "Rows Per Inch", value: formatNumber(rowsPerInch, 2) },
            { label: "Pattern Repeat", value: patternRepeat > 1 ? `${patternRepeat} stitches` : "None" },
            { label: "Est. Yardage", value: `~${formatNumber(yardageEstimate, 0)} yards` },
          ],
          note: "Always knit a gauge swatch in your chosen yarn and needle size before starting. Wash and block the swatch as you would the finished project for the most accurate gauge.",
        };
      },
    },
  ],
  relatedSlugs: ["knitting-gauge-calculator", "yarn-weight-calculator", "crochet-blanket-calculator"],
  faq: [
    { question: "How do I resize a knitting pattern?", answer: "First, knit a gauge swatch with your yarn and needles. Compare your gauge to the pattern gauge. Multiply the pattern stitch counts by the ratio of your gauge to the pattern gauge. For example, if the pattern calls for 20 stitches per 4 inches but you get 18, multiply all stitch counts by 18/20." },
    { question: "What if my row gauge is different but stitch gauge matches?", answer: "If only your row gauge differs, you can usually just knit to the specified length measurement instead of row count. Stitch gauge is more critical since it affects width, which is harder to adjust during knitting." },
    { question: "How do I handle pattern repeats when resizing?", answer: "After calculating the new stitch count, round to the nearest multiple of your stitch pattern repeat. For example, if your pattern has a 6-stitch repeat and you calculated 83 stitches, round to 84 (14 repeats of 6)." },
  ],
  formula: "New stitches = Original width × Your stitches per inch | New rows = Original length × Your rows per inch | Width = Stitches / (Gauge / 4)",
};
