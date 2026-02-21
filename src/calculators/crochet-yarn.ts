import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const crochetYarnCalculator: CalculatorDefinition = {
  slug: "crochet-yarn-calculator",
  title: "Crochet Yarn Calculator",
  description: "Free crochet yarn calculator. Estimate how much yarn you need for crochet projects based on stitch count, hook size, and project type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["crochet yarn calculator", "how much yarn for crochet", "crochet yardage calculator", "crochet project estimator", "yarn for blanket"],
  variants: [
    {
      id: "by-project",
      name: "By Project Type",
      description: "Estimate yarn needed for common crochet projects",
      fields: [
        { name: "project", label: "Project Type", type: "select", options: [
          { label: "Dishcloth / washcloth", value: "dishcloth" },
          { label: "Scarf", value: "scarf" },
          { label: "Cowl / infinity scarf", value: "cowl" },
          { label: "Hat / beanie", value: "hat" },
          { label: "Pair of mittens", value: "mittens" },
          { label: "Baby blanket (30x36 in)", value: "babyblanket" },
          { label: "Throw blanket (50x60 in)", value: "throw" },
          { label: "Full blanket (60x80 in)", value: "blanket" },
          { label: "Amigurumi (small toy)", value: "amigurumi" },
          { label: "Tote bag", value: "bag" },
          { label: "Sweater / cardigan", value: "sweater" },
        ], defaultValue: "throw" },
        { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [
          { label: "Thread / Lace (0-1)", value: "lace" },
          { label: "Fingering / Sport (1-2)", value: "sport" },
          { label: "DK / Light Worsted (3)", value: "dk" },
          { label: "Worsted / Aran (4)", value: "worsted" },
          { label: "Bulky / Chunky (5)", value: "bulky" },
          { label: "Super Bulky / Roving (6-7)", value: "superbulky" },
        ], defaultValue: "worsted" },
        { name: "size", label: "Size", type: "select", options: [
          { label: "Small / Child", value: "small" },
          { label: "Medium / Standard", value: "medium" },
          { label: "Large / Oversized", value: "large" },
        ], defaultValue: "medium" },
      ],
      calculate: (inputs) => {
        const project = inputs.project as string;
        const yarnWeight = inputs.yarnWeight as string;
        const size = inputs.size as string;

        // Base yardage for worsted weight, medium size
        // Crochet uses approximately 30% more yarn than knitting for the same project
        const baseYardage: Record<string, number> = {
          dishcloth: 120,
          scarf: 450,
          cowl: 300,
          hat: 250,
          mittens: 300,
          babyblanket: 1200,
          throw: 2400,
          blanket: 4500,
          amigurumi: 150,
          bag: 400,
          sweater: 2000,
        };

        let yardage = baseYardage[project] || 1000;

        // Yarn weight multiplier
        const weightMultiplier: Record<string, number> = {
          lace: 2.5,
          sport: 1.5,
          dk: 1.2,
          worsted: 1.0,
          bulky: 0.7,
          superbulky: 0.5,
        };
        yardage *= weightMultiplier[yarnWeight] || 1;

        // Size multiplier
        const sizeMultiplier: Record<string, number> = {
          small: 0.65,
          medium: 1.0,
          large: 1.35,
        };
        yardage *= sizeMultiplier[size] || 1;

        yardage = Math.ceil(yardage / 10) * 10;

        // Skein calculation
        const skeinYardage: Record<string, number> = {
          lace: 440,
          sport: 280,
          dk: 250,
          worsted: 200,
          bulky: 130,
          superbulky: 90,
        };
        const ydsPerSkein = skeinYardage[yarnWeight] || 200;
        const skeins = Math.ceil(yardage / ydsPerSkein);
        const meters = yardage * 0.9144;

        // Recommended hook size
        const hookSize: Record<string, string> = {
          lace: "B/1-E/4 (2.25-3.5mm)",
          sport: "E/4-7 (3.5-4.5mm)",
          dk: "7-I/9 (4.5-5.5mm)",
          worsted: "I/9-K/10.5 (5.5-6.5mm)",
          bulky: "K/10.5-M/13 (6.5-9mm)",
          superbulky: "M/13-Q (9-16mm)",
        };

        return {
          primary: { label: "Yarn Needed", value: `~${formatNumber(yardage, 0)}`, suffix: "yards" },
          details: [
            { label: "In Meters", value: `~${formatNumber(meters, 0)}` },
            { label: "Estimated Skeins", value: `${skeins} skeins (~${ydsPerSkein} yd each)` },
            { label: "Recommended Hook", value: hookSize[yarnWeight] || "Check yarn label" },
            { label: "Project", value: project.charAt(0).toUpperCase() + project.slice(1) },
            { label: "Yarn Weight", value: yarnWeight.charAt(0).toUpperCase() + yarnWeight.slice(1) },
          ],
          note: "Crochet uses approximately 30% more yarn than knitting for the same project. Always buy extra and keep receipts for returns.",
        };
      },
    },
    {
      id: "by-dimensions",
      name: "By Dimensions (Blankets/Rectangles)",
      description: "Calculate yarn for a rectangular project by dimensions",
      fields: [
        { name: "widthIn", label: "Width", type: "number", placeholder: "e.g. 50", suffix: "in", step: 1 },
        { name: "lengthIn", label: "Length", type: "number", placeholder: "e.g. 60", suffix: "in", step: 1 },
        { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [
          { label: "DK / Light Worsted (3)", value: "dk" },
          { label: "Worsted / Aran (4)", value: "worsted" },
          { label: "Bulky / Chunky (5)", value: "bulky" },
          { label: "Super Bulky (6)", value: "superbulky" },
        ], defaultValue: "worsted" },
        { name: "stitch", label: "Stitch Pattern", type: "select", options: [
          { label: "Single crochet (dense)", value: "sc" },
          { label: "Half double crochet", value: "hdc" },
          { label: "Double crochet (standard)", value: "dc" },
          { label: "Granny square", value: "granny" },
        ], defaultValue: "dc" },
      ],
      calculate: (inputs) => {
        const widthIn = inputs.widthIn as number;
        const lengthIn = inputs.lengthIn as number;
        const yarnWeight = inputs.yarnWeight as string;
        const stitch = inputs.stitch as string;
        if (!widthIn || !lengthIn) return null;

        const area = widthIn * lengthIn;

        // Yards per square inch by yarn weight and stitch (approximate)
        const ydsPerSqIn: Record<string, Record<string, number>> = {
          dk: { sc: 1.1, hdc: 0.9, dc: 0.8, granny: 0.85 },
          worsted: { sc: 0.9, hdc: 0.75, dc: 0.65, granny: 0.7 },
          bulky: { sc: 0.6, hdc: 0.5, dc: 0.45, granny: 0.5 },
          superbulky: { sc: 0.4, hdc: 0.35, dc: 0.3, granny: 0.35 },
        };

        const rate = ydsPerSqIn[yarnWeight]?.[stitch] || 0.7;
        let yardage = area * rate;
        yardage = Math.ceil(yardage / 25) * 25; // round up to nearest 25

        const skeinYds: Record<string, number> = { dk: 250, worsted: 200, bulky: 130, superbulky: 90 };
        const ydsPerSkein = skeinYds[yarnWeight] || 200;
        const skeins = Math.ceil(yardage / ydsPerSkein);

        return {
          primary: { label: "Yarn Needed", value: `~${formatNumber(yardage, 0)}`, suffix: "yards" },
          details: [
            { label: "In Meters", value: `~${formatNumber(yardage * 0.9144, 0)}` },
            { label: "Skeins Needed", value: `${skeins} skeins (~${ydsPerSkein} yd each)` },
            { label: "Project Area", value: `${formatNumber(area, 0)} sq in` },
            { label: "Dimensions", value: `${widthIn} x ${lengthIn} inches` },
          ],
          note: "Single crochet uses the most yarn but creates the densest fabric. Double crochet is a good balance of yarn usage and speed.",
        };
      },
    },
  ],
  relatedSlugs: ["knitting-gauge-calculator", "thread-calculator", "quilt-size-calculator"],
  faq: [
    { question: "Does crochet use more yarn than knitting?", answer: "Yes, crochet typically uses about 30% more yarn than knitting for the same project size. This is because crochet stitches are taller and the fabric is generally thicker and less stretchy." },
    { question: "How much yarn do I need for a crochet blanket?", answer: "A throw blanket (50x60 in) in worsted weight double crochet needs about 2000-2500 yards. A baby blanket (30x36 in) needs about 1000-1400 yards. Full-size blankets need 4000-5000 yards." },
    { question: "What hook size should I use for worsted weight yarn?", answer: "Worsted weight yarn typically uses a 5.5-6.5mm hook (US I/9 to K/10.5). However, always check your yarn label for the recommended hook size and make a gauge swatch to verify your tension." },
  ],
  formula: "Yarn (yards) ≈ Project area (sq in) × Yards per sq in | Crochet uses ~30% more yarn than knitting | sc > hdc > dc in yarn usage",
};
