import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const knittingYarnCalcCalculator: CalculatorDefinition = {
  slug: "knitting-yarn-calculator",
  title: "Knitting Yarn Yardage Calculator",
  description: "Free online knitting yarn yardage calculator. Calculate how much yarn you need for your knitting project based on gauge, dimensions, and yarn weight.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["knitting yarn calculator", "yarn yardage calculator", "how much yarn do I need", "knitting yarn estimator", "yarn requirement calculator"],
  variants: [
    {
      id: "by-gauge",
      name: "By Gauge Swatch",
      description: "Calculate yarn needed based on your gauge swatch measurement",
      fields: [
        { name: "projectWidth", label: "Project Width (inches)", type: "number", placeholder: "e.g. 20" },
        { name: "projectLength", label: "Project Length (inches)", type: "number", placeholder: "e.g. 60" },
        { name: "stitchesPer4in", label: "Stitches per 4 inches (gauge)", type: "number", placeholder: "e.g. 18" },
        { name: "rowsPer4in", label: "Rows per 4 inches (gauge)", type: "number", placeholder: "e.g. 24" },
        { name: "yarnPerStitch", label: "Yarn per stitch (inches)", type: "number", placeholder: "e.g. 0.75", defaultValue: 0.75 },
        { name: "yardPerSkein", label: "Yards per Skein", type: "number", placeholder: "e.g. 220", defaultValue: 220 },
        { name: "waste", label: "Waste/Margin (%)", type: "number", placeholder: "e.g. 10", defaultValue: 10 },
      ],
      calculate: (inputs) => {
        const width = parseFloat(inputs.projectWidth as string) || 0;
        const length = parseFloat(inputs.projectLength as string) || 0;
        const stPer4 = parseFloat(inputs.stitchesPer4in as string) || 0;
        const rowsPer4 = parseFloat(inputs.rowsPer4in as string) || 0;
        const yarnPerSt = parseFloat(inputs.yarnPerStitch as string) || 0.75;
        const yardPerSkein = parseFloat(inputs.yardPerSkein as string) || 220;
        const waste = parseFloat(inputs.waste as string) || 10;
        if (!width || !length || !stPer4 || !rowsPer4) return null;

        const stPerInch = stPer4 / 4;
        const rowsPerInch = rowsPer4 / 4;
        const totalStitches = (width * stPerInch) * (length * rowsPerInch);
        const totalYarnInches = totalStitches * yarnPerSt;
        const totalYards = totalYarnInches / 36;
        const withWaste = totalYards * (1 + waste / 100);
        const skeinsNeeded = Math.ceil(withWaste / yardPerSkein);

        return {
          primary: { label: "Yarn Needed", value: `${formatNumber(withWaste, 0)} yards` },
          details: [
            { label: "Total stitches", value: formatNumber(totalStitches, 0) },
            { label: "Yarn (before waste)", value: `${formatNumber(totalYards, 0)} yards` },
            { label: "Waste margin", value: `${waste}%` },
            { label: "Skeins needed", value: `${skeinsNeeded} (at ${yardPerSkein} yds/skein)` },
            { label: "Stitches per inch", value: formatNumber(stPerInch, 1) },
            { label: "Rows per inch", value: formatNumber(rowsPerInch, 1) },
          ],
          note: "Always buy an extra skein for safety. Dye lots may vary, so purchase all yarn at once.",
        };
      },
    },
    {
      id: "by-weight",
      name: "By Yarn Weight Category",
      description: "Quick estimate based on yarn weight and project type",
      fields: [
        { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [
          { label: "Lace (2,000 yds/lb)", value: "2000" },
          { label: "Fingering (1,600 yds/lb)", value: "1600" },
          { label: "Sport (1,200 yds/lb)", value: "1200" },
          { label: "DK (1,000 yds/lb)", value: "1000" },
          { label: "Worsted (800 yds/lb)", value: "800" },
          { label: "Aran (700 yds/lb)", value: "700" },
          { label: "Bulky (500 yds/lb)", value: "500" },
          { label: "Super Bulky (300 yds/lb)", value: "300" },
        ], defaultValue: "800" },
        { name: "project", label: "Project Type", type: "select", options: [
          { label: "Scarf (300-400 yds)", value: "350" },
          { label: "Hat (100-200 yds)", value: "150" },
          { label: "Mittens/Gloves (200-300 yds)", value: "250" },
          { label: "Socks (pair, 350-450 yds)", value: "400" },
          { label: "Shawl (500-800 yds)", value: "650" },
          { label: "Baby Blanket (800-1200 yds)", value: "1000" },
          { label: "Adult Sweater (1500-2500 yds)", value: "2000" },
          { label: "Afghan/Throw (2500-4000 yds)", value: "3250" },
        ], defaultValue: "350" },
        { name: "yardPerSkein", label: "Yards per Skein", type: "number", placeholder: "e.g. 220", defaultValue: 220 },
      ],
      calculate: (inputs) => {
        const ydsPerLb = parseFloat(inputs.yarnWeight as string) || 800;
        const projectYards = parseFloat(inputs.project as string) || 350;
        const yardPerSkein = parseFloat(inputs.yardPerSkein as string) || 220;

        const weightLbs = projectYards / ydsPerLb;
        const weightOz = weightLbs * 16;
        const skeinsNeeded = Math.ceil(projectYards / yardPerSkein);

        return {
          primary: { label: "Estimated Yarn Needed", value: `${formatNumber(projectYards, 0)} yards` },
          details: [
            { label: "Weight needed", value: `${formatNumber(weightOz, 1)} oz (${formatNumber(weightLbs, 2)} lbs)` },
            { label: "Skeins needed", value: `${skeinsNeeded}` },
            { label: "Yards per skein", value: formatNumber(yardPerSkein, 0) },
            { label: "Yards per pound", value: formatNumber(ydsPerLb, 0) },
          ],
          note: "These are average estimates. Actual yardage depends on pattern stitch, gauge, and personal tension.",
        };
      },
    },
  ],
  relatedSlugs: ["unit-converter", "quilting-fabric-calculator"],
  faq: [
    { question: "How do I calculate yarn needed for a project?", answer: "Knit a gauge swatch, measure stitches and rows per 4 inches, then multiply by project dimensions to get total stitches. Multiply by yarn per stitch (varies by weight) and add 10% for waste." },
    { question: "How much yarn for a scarf?", answer: "A typical scarf (6\" × 60\") in worsted weight yarn requires about 300-400 yards. Wider or longer scarves need more. Bulky yarn uses fewer yards but more weight." },
    { question: "What if I run out of yarn mid-project?", answer: "Always buy an extra skein and keep the dye lot number. If you can't find the same dye lot, alternate rows of old and new yarn for a few inches to blend the color transition." },
  ],
  formula: "Yarn (yards) = (Width × Stitches/inch) × (Length × Rows/inch) × Yarn per stitch / 36 × (1 + Waste%)",
};
