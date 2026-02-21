import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const threadCalculator: CalculatorDefinition = {
  slug: "thread-calculator",
  title: "Thread & Yarn Calculator",
  description: "Free thread and yarn calculator. Estimate how much thread you need for sewing projects or yarn for knitting and crochet.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["thread calculator", "yarn calculator", "how much thread do I need", "sewing thread calculator", "yarn estimator"],
  variants: [
    {
      id: "sewing-thread",
      name: "Sewing Thread Estimate",
      description: "Calculate thread needed for a sewing project based on seam length",
      fields: [
        { name: "seamLength", label: "Total Seam Length", type: "number", placeholder: "e.g. 200", suffix: "in", step: 1 },
        { name: "stitchType", label: "Stitch Type", type: "select", options: [
          { label: "Straight stitch (standard)", value: "straight" },
          { label: "Zigzag stitch", value: "zigzag" },
          { label: "Overlock / serger", value: "overlock" },
          { label: "Topstitch / decorative", value: "topstitch" },
        ], defaultValue: "straight" },
        { name: "projectType", label: "Or Choose Project Type", type: "select", options: [
          { label: "Custom (use seam length above)", value: "custom" },
          { label: "Simple top / blouse", value: "top" },
          { label: "Shirt with collar & cuffs", value: "shirt" },
          { label: "Pants / trousers", value: "pants" },
          { label: "Simple dress", value: "dress" },
          { label: "Skirt", value: "skirt" },
          { label: "Jacket / coat", value: "jacket" },
        ], defaultValue: "custom" },
      ],
      calculate: (inputs) => {
        let seamLength = inputs.seamLength as number;
        const stitchType = inputs.stitchType as string;
        const projectType = inputs.projectType as string;

        // Project-based seam length estimates (in inches)
        const projectSeamLengths: Record<string, number> = {
          top: 200,
          shirt: 350,
          pants: 300,
          dress: 400,
          skirt: 180,
          jacket: 500,
        };

        if (projectType !== "custom") {
          seamLength = projectSeamLengths[projectType] || 200;
        }

        if (!seamLength) return null;

        // Thread usage multiplier (thread consumed per inch of seam)
        // Standard: ~2.5x the seam length for bobbin + top thread
        let multiplier: number;
        if (stitchType === "straight") multiplier = 2.5;
        else if (stitchType === "zigzag") multiplier = 3.5;
        else if (stitchType === "overlock") multiplier = 12; // serger uses much more thread
        else multiplier = 3.0; // topstitch

        const threadInches = seamLength * multiplier;
        const threadYards = threadInches / 36;
        const threadMeters = threadYards * 0.9144;

        // Standard spool sizes
        const smallSpool = 200; // yards
        const largeSpool = 500; // yards (Gutermann)
        const coneSpool = 3000; // yards

        const spoolsSmall = Math.ceil(threadYards / smallSpool);
        const spoolsLarge = Math.ceil(threadYards / largeSpool);

        return {
          primary: { label: "Thread Needed", value: formatNumber(threadYards, 0), suffix: "yards" },
          details: [
            { label: "In Meters", value: formatNumber(threadMeters, 0) },
            { label: "Seam Length", value: `${formatNumber(seamLength, 0)} inches` },
            { label: "Stitch Multiplier", value: `${multiplier}x` },
            { label: "Small Spools (200yd)", value: `${spoolsSmall} spool${spoolsSmall > 1 ? "s" : ""}` },
            { label: "Large Spools (500yd)", value: `${spoolsLarge} spool${spoolsLarge > 1 ? "s" : ""}` },
          ],
          note: "One standard 200-yard spool is usually enough for most single garments with straight stitching. Buy extra for serger projects.",
        };
      },
    },
    {
      id: "yarn-weight",
      name: "Yarn by Weight Estimate",
      description: "Estimate total yarn needed for a knitting or crochet project",
      fields: [
        { name: "projectType", label: "Project Type", type: "select", options: [
          { label: "Scarf", value: "scarf" },
          { label: "Hat / beanie", value: "hat" },
          { label: "Pair of mittens", value: "mittens" },
          { label: "Pair of socks", value: "socks" },
          { label: "Sweater / pullover", value: "sweater" },
          { label: "Cardigan", value: "cardigan" },
          { label: "Baby blanket", value: "babyblanket" },
          { label: "Throw blanket", value: "throw" },
          { label: "Afghan / large blanket", value: "afghan" },
        ], defaultValue: "sweater" },
        { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [
          { label: "Fingering / Sock (1)", value: "fingering" },
          { label: "Sport / DK (2-3)", value: "dk" },
          { label: "Worsted / Aran (4)", value: "worsted" },
          { label: "Bulky / Chunky (5)", value: "bulky" },
          { label: "Super Bulky (6)", value: "superbulky" },
        ], defaultValue: "worsted" },
        { name: "size", label: "Size", type: "select", options: [
          { label: "Small / Child", value: "small" },
          { label: "Medium / Adult", value: "medium" },
          { label: "Large / Plus", value: "large" },
        ], defaultValue: "medium" },
      ],
      calculate: (inputs) => {
        const projectType = inputs.projectType as string;
        const yarnWeight = inputs.yarnWeight as string;
        const size = inputs.size as string;

        // Base yardage estimates for worsted weight, medium size
        const baseYardage: Record<string, number> = {
          scarf: 350,
          hat: 200,
          mittens: 250,
          socks: 400,
          sweater: 1500,
          cardigan: 1800,
          babyblanket: 900,
          throw: 1500,
          afghan: 3000,
        };

        let yardage = baseYardage[projectType] || 1000;

        // Yarn weight adjustment (thinner yarn = more yardage)
        const weightMultiplier: Record<string, number> = {
          fingering: 1.8,
          dk: 1.3,
          worsted: 1.0,
          bulky: 0.7,
          superbulky: 0.5,
        };
        yardage *= weightMultiplier[yarnWeight] || 1;

        // Size adjustment
        const sizeMultiplier: Record<string, number> = {
          small: 0.7,
          medium: 1.0,
          large: 1.3,
        };
        yardage *= sizeMultiplier[size] || 1;

        yardage = Math.ceil(yardage / 10) * 10; // round to nearest 10

        // Typical skein yardage
        const skeinYardage: Record<string, number> = {
          fingering: 400,
          dk: 250,
          worsted: 200,
          bulky: 130,
          superbulky: 90,
        };
        const ydsPerSkein = skeinYardage[yarnWeight] || 200;
        const skeins = Math.ceil(yardage / ydsPerSkein);

        const meters = yardage * 0.9144;
        const grams = yardage / (ydsPerSkein / 100) * 100; // rough estimate

        return {
          primary: { label: "Yarn Needed", value: `~${formatNumber(yardage, 0)}`, suffix: "yards" },
          details: [
            { label: "In Meters", value: `~${formatNumber(meters, 0)}` },
            { label: "Estimated Skeins", value: `${skeins} skeins (~${ydsPerSkein} yd each)` },
            { label: "Project", value: projectType.charAt(0).toUpperCase() + projectType.slice(1) },
            { label: "Yarn Weight", value: yarnWeight.charAt(0).toUpperCase() + yarnWeight.slice(1) },
          ],
          note: "Always buy 10-15% more than estimated. Dye lots can vary, so purchase all yarn at once. Check your pattern for specific yardage requirements.",
        };
      },
    },
  ],
  relatedSlugs: ["fabric-yardage-calculator", "knitting-gauge-calculator", "crochet-yarn-calculator"],
  faq: [
    { question: "How much sewing thread do I need per garment?", answer: "One standard 200-yard spool is usually sufficient for a simple garment with straight stitching. Complex garments (jackets, shirts with details) may need 300-500 yards. Serger projects use significantly more thread." },
    { question: "How do I estimate yarn for a knitting project?", answer: "A medium adult sweater typically needs 1200-1800 yards of worsted weight yarn. Check your pattern for exact requirements. If no pattern, estimate based on project type, yarn weight, and size." },
    { question: "Does yarn weight affect how much I need?", answer: "Yes, significantly. Thinner yarn needs more yardage but weighs less per yard. A fingering-weight sweater may need 2500+ yards, while a bulky-weight version may need only 1000 yards." },
  ],
  formula: "Sewing thread = Seam length × Stitch multiplier (straight: 2.5x, zigzag: 3.5x, serger: 12x) | Yarn varies by project, weight, and size",
};
