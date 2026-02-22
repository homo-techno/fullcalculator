import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crochetBlanketCalculator: CalculatorDefinition = {
  slug: "crochet-blanket-calculator",
  title: "Crochet Blanket Size Calculator",
  description: "Free crochet blanket calculator. Calculate chain count, yarn needed, and row count for crochet blankets and afghans of any size.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crochet blanket calculator", "crochet afghan calculator", "crochet chain calculator", "how much yarn for blanket", "crochet blanket size"],
  variants: [
    {
      id: "blanket-size",
      name: "Blanket from Size",
      description: "Calculate chain count and rows for a specific blanket size",
      fields: [
        { name: "blanketSize", label: "Blanket Size", type: "select", options: [
          { label: "Lovey (12 × 12 in)", value: "lovey" },
          { label: "Baby blanket (30 × 36 in)", value: "baby" },
          { label: "Stroller (30 × 40 in)", value: "stroller" },
          { label: "Toddler (40 × 50 in)", value: "toddler" },
          { label: "Throw (50 × 60 in)", value: "throw" },
          { label: "Twin (66 × 90 in)", value: "twin" },
          { label: "Full (80 × 90 in)", value: "full" },
          { label: "Queen (90 × 100 in)", value: "queen" },
          { label: "King (108 × 100 in)", value: "king" },
        ], defaultValue: "throw" },
        { name: "gaugeStitches", label: "Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 14", step: 0.5 },
        { name: "gaugeRows", label: "Gauge (rows per 4 in)", type: "number", placeholder: "e.g. 8", step: 0.5 },
        { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [
          { label: "Sport (#2)", value: "sport" },
          { label: "DK (#3)", value: "dk" },
          { label: "Worsted (#4)", value: "worsted" },
          { label: "Bulky (#5)", value: "bulky" },
          { label: "Super Bulky (#6)", value: "superbulky" },
        ], defaultValue: "worsted" },
      ],
      calculate: (inputs) => {
        const blanketSize = inputs.blanketSize as string;
        const gaugeStitches = inputs.gaugeStitches as number;
        const gaugeRows = inputs.gaugeRows as number;
        const yarnWeight = inputs.yarnWeight as string;
        if (!gaugeStitches || !gaugeRows) return null;

        const sizes: Record<string, [number, number]> = {
          lovey: [12, 12],
          baby: [30, 36],
          stroller: [30, 40],
          toddler: [40, 50],
          throw: [50, 60],
          twin: [66, 90],
          full: [80, 90],
          queen: [90, 100],
          king: [108, 100],
        };

        const [width, length] = sizes[blanketSize] || [50, 60];
        const stitchesPerInch = gaugeStitches / 4;
        const rowsPerInch = gaugeRows / 4;

        const chainCount = Math.ceil(width * stitchesPerInch) + 1; // +1 for turning chain
        const totalRows = Math.ceil(length * rowsPerInch);

        // Yarn estimation by weight (yards per square inch, approximate)
        const yardsPerSqInch: Record<string, number> = {
          sport: 0.7,
          dk: 0.55,
          worsted: 0.45,
          bulky: 0.35,
          superbulky: 0.25,
        };
        const totalYards = Math.ceil(width * length * (yardsPerSqInch[yarnWeight] || 0.45));
        const yardsPerSkein: Record<string, number> = {
          sport: 250,
          dk: 230,
          worsted: 200,
          bulky: 130,
          superbulky: 90,
        };
        const skeinsNeeded = Math.ceil(totalYards / (yardsPerSkein[yarnWeight] || 200));

        return {
          primary: { label: "Foundation Chain", value: `${chainCount}`, suffix: "chains" },
          details: [
            { label: "Total Rows", value: `${totalRows}` },
            { label: "Blanket Size", value: `${width} × ${length} in` },
            { label: "Yarn Needed", value: `~${formatNumber(totalYards, 0)} yards` },
            { label: "Skeins Needed", value: `~${skeinsNeeded}` },
            { label: "In Meters", value: `~${formatNumber(totalYards * 0.9144, 0)} m` },
            { label: "Gauge", value: `${gaugeStitches} st × ${gaugeRows} rows per 4 in` },
          ],
          note: "Chain count includes turning chain. Crochet a gauge swatch in your chosen stitch pattern before starting. Blankets tend to use more yarn than expected — buy 10% extra.",
        };
      },
    },
    {
      id: "custom-blanket",
      name: "Custom Dimensions",
      description: "Calculate for custom blanket dimensions",
      fields: [
        { name: "width", label: "Blanket Width", type: "number", placeholder: "e.g. 50", suffix: "in", step: 1 },
        { name: "length", label: "Blanket Length", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "gaugeStitches", label: "Gauge (stitches per 4 in)", type: "number", placeholder: "e.g. 14", step: 0.5 },
        { name: "gaugeRows", label: "Gauge (rows per 4 in)", type: "number", placeholder: "e.g. 8", step: 0.5 },
        { name: "skeinYards", label: "Yards Per Skein", type: "number", placeholder: "e.g. 200", suffix: "yd", step: 1 },
        { name: "borderRows", label: "Border Rows", type: "select", options: [
          { label: "No border", value: "0" },
          { label: "2 rows", value: "2" },
          { label: "4 rows", value: "4" },
          { label: "6 rows", value: "6" },
        ], defaultValue: "0" },
      ],
      calculate: (inputs) => {
        const width = inputs.width as number;
        const length = inputs.length as number;
        const gaugeStitches = inputs.gaugeStitches as number;
        const gaugeRows = inputs.gaugeRows as number;
        const skeinYards = inputs.skeinYards as number;
        const borderRows = parseInt(inputs.borderRows as string);
        if (!width || !length || !gaugeStitches || !gaugeRows || !skeinYards) return null;

        const stitchesPerInch = gaugeStitches / 4;
        const rowsPerInch = gaugeRows / 4;

        const chainCount = Math.ceil(width * stitchesPerInch) + 1;
        const bodyRows = Math.ceil(length * rowsPerInch);
        const totalRows = bodyRows + borderRows;

        // Estimate border as perimeter stitches
        const borderYards = borderRows > 0 ? (width + length) * 2 * borderRows * 0.05 : 0;
        const bodyYards = width * length * 0.45;
        const totalYards = Math.ceil(bodyYards + borderYards);
        const skeins = Math.ceil(totalYards / skeinYards);

        return {
          primary: { label: "Foundation Chain", value: `${chainCount}`, suffix: "chains" },
          details: [
            { label: "Body Rows", value: `${bodyRows}` },
            { label: "Border Rows", value: borderRows > 0 ? `${borderRows}` : "None" },
            { label: "Total Rows", value: `${totalRows}` },
            { label: "Estimated Yardage", value: `~${formatNumber(totalYards, 0)} yards` },
            { label: "Skeins Needed", value: `${skeins} (at ${skeinYards} yd/skein)` },
            { label: "Dimensions", value: `${width} × ${length} in` },
          ],
          note: "Border adds extra yarn. For a contrasting border color, calculate border yardage separately. Consider buying all yarn from the same dye lot for consistent color.",
        };
      },
    },
  ],
  relatedSlugs: ["crochet-yarn-calculator", "yarn-weight-calculator", "knitting-gauge-calculator"],
  faq: [
    { question: "How many chains do I need for a blanket?", answer: "Divide your desired width by your stitch gauge (stitches per inch). For example, a 50-inch throw at 3.5 stitches per inch needs about 176 chains. Add 1-3 extra for the turning chain depending on your stitch pattern." },
    { question: "How much yarn do I need for a crochet throw blanket?", answer: "A throw blanket (50×60 inches) in worsted weight yarn typically needs 1,200-1,500 yards of yarn, or about 6-8 standard skeins. Bulky yarn needs less yardage but more skeins since each skein has fewer yards." },
    { question: "What is the best stitch for a crochet blanket?", answer: "Popular blanket stitches include: single crochet (dense, warm), half double crochet (good balance), double crochet (works up fast), and the granny stitch (classic look, uses less yarn). Choose based on desired thickness and how quickly you want to finish." },
  ],
  formula: "Chain count = (Width × Stitches per inch) + 1 | Total rows = Length × Rows per inch | Yarn = Width × Length × Yards per square inch",
};
