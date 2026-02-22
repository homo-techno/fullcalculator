import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const yarnWeightCalculator: CalculatorDefinition = {
  slug: "yarn-weight-calculator",
  title: "Yarn Weight & Yardage Calculator",
  description: "Free yarn weight and yardage calculator. Convert between yarn weights, estimate yardage needed, and calculate skeins for knitting and crochet projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["yarn weight calculator", "yarn yardage calculator", "how much yarn do I need", "yarn skein calculator", "knitting yarn calculator"],
  variants: [
    {
      id: "project-yardage",
      name: "Project Yardage",
      description: "Estimate yarn yardage needed for a project",
      fields: [
        { name: "projectType", label: "Project Type", type: "select", options: [
          { label: "Scarf", value: "scarf" },
          { label: "Hat (adult)", value: "hat" },
          { label: "Mittens (pair)", value: "mittens" },
          { label: "Socks (pair)", value: "socks" },
          { label: "Cowl / Infinity Scarf", value: "cowl" },
          { label: "Baby blanket", value: "babyblanket" },
          { label: "Throw blanket", value: "throw" },
          { label: "Afghan (full size)", value: "afghan" },
          { label: "Sweater (adult)", value: "sweater" },
          { label: "Cardigan (adult)", value: "cardigan" },
          { label: "Shawl", value: "shawl" },
          { label: "Vest (adult)", value: "vest" },
        ], defaultValue: "scarf" },
        { name: "yarnWeight", label: "Yarn Weight", type: "select", options: [
          { label: "Lace (#0)", value: "lace" },
          { label: "Fingering / Sock (#1)", value: "fingering" },
          { label: "Sport (#2)", value: "sport" },
          { label: "DK (#3)", value: "dk" },
          { label: "Worsted (#4)", value: "worsted" },
          { label: "Bulky (#5)", value: "bulky" },
          { label: "Super Bulky (#6)", value: "superbulky" },
        ], defaultValue: "worsted" },
        { name: "size", label: "Size", type: "select", options: [
          { label: "Small / Child", value: "small" },
          { label: "Medium / Adult", value: "medium" },
          { label: "Large / Plus size", value: "large" },
        ], defaultValue: "medium" },
      ],
      calculate: (inputs) => {
        const projectType = inputs.projectType as string;
        const yarnWeight = inputs.yarnWeight as string;
        const size = inputs.size as string;

        // Base yardage for medium size in worsted weight
        const baseYardage: Record<string, number> = {
          scarf: 300,
          hat: 150,
          mittens: 200,
          socks: 350,
          cowl: 200,
          babyblanket: 900,
          throw: 1500,
          afghan: 2500,
          sweater: 1500,
          cardigan: 1800,
          shawl: 600,
          vest: 800,
        };

        // Yarn weight multiplier (relative to worsted)
        const weightMultiplier: Record<string, number> = {
          lace: 1.6,
          fingering: 1.4,
          sport: 1.2,
          dk: 1.1,
          worsted: 1.0,
          bulky: 0.85,
          superbulky: 0.7,
        };

        // Size multiplier
        const sizeMultiplier: Record<string, number> = {
          small: 0.7,
          medium: 1.0,
          large: 1.35,
        };

        // Typical yards per skein
        const yardsPerSkein: Record<string, number> = {
          lace: 400,
          fingering: 400,
          sport: 250,
          dk: 230,
          worsted: 200,
          bulky: 130,
          superbulky: 90,
        };

        let yardage = baseYardage[projectType] || 300;
        yardage *= weightMultiplier[yarnWeight] || 1;
        yardage *= sizeMultiplier[size] || 1;
        yardage = Math.ceil(yardage / 10) * 10;

        const skeinsNeeded = Math.ceil(yardage / (yardsPerSkein[yarnWeight] || 200));
        const grams = yardage / (yardsPerSkein[yarnWeight] || 200) * (yarnWeight === "lace" ? 50 : yarnWeight === "fingering" ? 100 : 100);
        const meters = yardage * 0.9144;

        const weightLabels: Record<string, string> = {
          lace: "Lace (#0)",
          fingering: "Fingering/Sock (#1)",
          sport: "Sport (#2)",
          dk: "DK (#3)",
          worsted: "Worsted (#4)",
          bulky: "Bulky (#5)",
          superbulky: "Super Bulky (#6)",
        };

        return {
          primary: { label: "Yarn Needed", value: formatNumber(yardage, 0), suffix: "yards" },
          details: [
            { label: "In Meters", value: formatNumber(meters, 0) },
            { label: "Skeins Needed", value: `~${skeinsNeeded} (standard skeins)` },
            { label: "Yarn Weight", value: weightLabels[yarnWeight] || yarnWeight },
            { label: "Yards Per Skein (typical)", value: `${yardsPerSkein[yarnWeight] || 200}` },
            { label: "Project", value: projectType.charAt(0).toUpperCase() + projectType.slice(1) },
            { label: "Size", value: size.charAt(0).toUpperCase() + size.slice(1) },
          ],
          note: "These are estimates based on typical patterns. Always check your specific pattern for exact yardage requirements. Buy an extra skein from the same dye lot to be safe.",
        };
      },
    },
    {
      id: "yarn-substitute",
      name: "Yarn Substitution",
      description: "Calculate yardage when substituting a different yarn weight",
      fields: [
        { name: "originalYards", label: "Original Pattern Yardage", type: "number", placeholder: "e.g. 1200", suffix: "yd", step: 10 },
        { name: "originalWeight", label: "Original Yarn Weight", type: "select", options: [
          { label: "Fingering / Sock (#1)", value: "fingering" },
          { label: "Sport (#2)", value: "sport" },
          { label: "DK (#3)", value: "dk" },
          { label: "Worsted (#4)", value: "worsted" },
          { label: "Bulky (#5)", value: "bulky" },
          { label: "Super Bulky (#6)", value: "superbulky" },
        ], defaultValue: "worsted" },
        { name: "newWeight", label: "Substitute Yarn Weight", type: "select", options: [
          { label: "Fingering / Sock (#1)", value: "fingering" },
          { label: "Sport (#2)", value: "sport" },
          { label: "DK (#3)", value: "dk" },
          { label: "Worsted (#4)", value: "worsted" },
          { label: "Bulky (#5)", value: "bulky" },
          { label: "Super Bulky (#6)", value: "superbulky" },
        ], defaultValue: "dk" },
        { name: "skeinYards", label: "Substitute Skein Yardage", type: "number", placeholder: "e.g. 230", suffix: "yd", step: 1 },
      ],
      calculate: (inputs) => {
        const originalYards = inputs.originalYards as number;
        const originalWeight = inputs.originalWeight as string;
        const newWeight = inputs.newWeight as string;
        const skeinYards = inputs.skeinYards as number;
        if (!originalYards || !skeinYards) return null;

        // Weight conversion factors (yards per weight unit relative to worsted)
        const conversionFactor: Record<string, number> = {
          fingering: 1.4,
          sport: 1.2,
          dk: 1.1,
          worsted: 1.0,
          bulky: 0.85,
          superbulky: 0.7,
        };

        const origFactor = conversionFactor[originalWeight] || 1;
        const newFactor = conversionFactor[newWeight] || 1;
        const newYardage = Math.ceil(originalYards * (newFactor / origFactor));
        const skeinsNeeded = Math.ceil(newYardage / skeinYards);

        return {
          primary: { label: "Substitute Yardage", value: formatNumber(newYardage, 0), suffix: "yards" },
          details: [
            { label: "Original Yardage", value: `${formatNumber(originalYards, 0)} yards` },
            { label: "Skeins Needed", value: `${skeinsNeeded}` },
            { label: "Yards Per Skein", value: `${skeinYards}` },
            { label: "Difference", value: `${newYardage > originalYards ? "+" : ""}${formatNumber(newYardage - originalYards, 0)} yards` },
            { label: "In Meters", value: formatNumber(newYardage * 0.9144, 0) },
          ],
          note: "When substituting yarn weights, you must also adjust your needle/hook size and may need to adjust the pattern gauge. Always knit/crochet a gauge swatch with the new yarn before starting.",
        };
      },
    },
  ],
  relatedSlugs: ["knitting-gauge-calculator", "crochet-yarn-calculator", "knitting-pattern-calculator"],
  faq: [
    { question: "How much yarn do I need for a sweater?", answer: "An adult medium sweater in worsted weight typically needs 1,200-1,500 yards. Lighter weights need more yardage (1,500-2,000 for DK), while bulky yarn needs less (800-1,000 yards). Always check your specific pattern." },
    { question: "Can I substitute a different yarn weight?", answer: "Yes, but you need to adjust the yardage, needle/hook size, and gauge. Lighter yarn generally needs more yardage; heavier yarn needs less. The finished fabric texture and drape will differ, so swatch first." },
    { question: "How do I know what yarn weight to use?", answer: "Check the yarn label for the weight number (0-7) or name (fingering, sport, DK, worsted, bulky). Your pattern will specify a recommended weight. Worsted (#4) is the most versatile and common weight." },
  ],
  formula: "Yardage = Base project yardage × Weight multiplier × Size multiplier | Skeins = Yardage / Yards per skein | Substitution = Original yardage × (New factor / Original factor)",
};
