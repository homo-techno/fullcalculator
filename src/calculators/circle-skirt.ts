import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const circleSkirtCalculator: CalculatorDefinition = {
  slug: "circle-skirt-calculator",
  title: "Circle Skirt Calculator",
  description: "Free circle skirt calculator. Calculate radius, fabric yardage, and cutting layout for full, half, and quarter circle skirts.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["circle skirt calculator", "full circle skirt", "half circle skirt", "skirt radius calculator", "circle skirt fabric"],
  variants: [
    {
      id: "waist-to-radius",
      name: "By Waist Measurement",
      description: "Calculate circle skirt radius and fabric from waist measurement",
      fields: [
        { name: "waist", label: "Waist Measurement", type: "number", placeholder: "e.g. 28", suffix: "in", step: 0.25 },
        { name: "skirtLength", label: "Desired Skirt Length", type: "number", placeholder: "e.g. 24", suffix: "in", step: 0.5 },
        { name: "skirtType", label: "Skirt Type", type: "select", options: [
          { label: "Full circle (360°)", value: "full" },
          { label: "3/4 circle (270°)", value: "three-quarter" },
          { label: "Half circle (180°)", value: "half" },
          { label: "Quarter circle (90°)", value: "quarter" },
        ], defaultValue: "full" },
        { name: "seamAllowance", label: "Seam Allowance", type: "select", options: [
          { label: "None (add your own)", value: "0" },
          { label: "3/8 inch", value: "0.375" },
          { label: "1/2 inch", value: "0.5" },
          { label: "5/8 inch (standard)", value: "0.625" },
        ], defaultValue: "0.625" },
        { name: "hemAllowance", label: "Hem Allowance", type: "select", options: [
          { label: "1/4 inch (rolled hem)", value: "0.25" },
          { label: "1/2 inch (narrow hem)", value: "0.5" },
          { label: "1 inch (standard hem)", value: "1" },
          { label: "2 inches (wide hem)", value: "2" },
        ], defaultValue: "0.5" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const skirtLength = inputs.skirtLength as number;
        const skirtType = inputs.skirtType as string;
        const seamAllowance = parseFloat(inputs.seamAllowance as string);
        const hemAllowance = parseFloat(inputs.hemAllowance as string);
        if (!waist || !skirtLength) return null;

        const circleFraction: Record<string, number> = {
          "full": 1,
          "three-quarter": 0.75,
          "half": 0.5,
          "quarter": 0.25,
        };
        const fraction = circleFraction[skirtType] || 1;

        // Waist radius: circumference = 2 * pi * r => r = circumference / (2 * pi * fraction)
        const waistRadius = waist / (2 * Math.PI * fraction);
        const outerRadius = waistRadius + skirtLength + hemAllowance;
        const cuttingRadius = waistRadius - seamAllowance;

        // Fabric needed: depends on type
        let fabricWidth = 45; // standard fabric width in inches
        let fabricLength: number;

        if (skirtType === "full") {
          // Full circle: need 2 * outerRadius for the diameter, cut in two halves
          fabricLength = (outerRadius * 2 + 2) * 2; // two semicircles
        } else if (skirtType === "three-quarter") {
          fabricLength = outerRadius * 2 + 2;
        } else if (skirtType === "half") {
          fabricLength = outerRadius * 2 + 2;
        } else {
          fabricLength = outerRadius + 2;
        }

        const fabricYards = Math.ceil((fabricLength / 36) * 4) / 4;
        const fabricMeters = fabricYards * 0.9144;

        const typeLabels: Record<string, string> = {
          "full": "Full Circle (360°)",
          "three-quarter": "3/4 Circle (270°)",
          "half": "Half Circle (180°)",
          "quarter": "Quarter Circle (90°)",
        };

        return {
          primary: { label: "Waist Radius", value: formatNumber(waistRadius, 2), suffix: "inches" },
          details: [
            { label: "Outer Radius (with hem)", value: `${formatNumber(outerRadius, 2)} in` },
            { label: "Cutting Radius (waist, with seam)", value: `${formatNumber(cuttingRadius, 2)} in` },
            { label: "Skirt Type", value: typeLabels[skirtType] || skirtType },
            { label: "Fabric Needed (45\" wide)", value: `${formatNumber(fabricYards, 2)} yards` },
            { label: "Fabric Needed (metric)", value: `${formatNumber(fabricMeters, 2)} meters` },
            { label: "Skirt Length (finished)", value: `${formatNumber(skirtLength, 1)} in` },
          ],
          note: "Let the cut fabric hang for 24 hours before hemming — circle skirts stretch on the bias. Add extra fabric for pattern matching or directional prints.",
        };
      },
    },
    {
      id: "fabric-check",
      name: "Fabric Width Check",
      description: "Check if your fabric width is sufficient for your circle skirt",
      fields: [
        { name: "waist", label: "Waist Measurement", type: "number", placeholder: "e.g. 28", suffix: "in", step: 0.25 },
        { name: "skirtLength", label: "Desired Skirt Length", type: "number", placeholder: "e.g. 24", suffix: "in", step: 0.5 },
        { name: "skirtType", label: "Skirt Type", type: "select", options: [
          { label: "Full circle (360°)", value: "full" },
          { label: "Half circle (180°)", value: "half" },
          { label: "Quarter circle (90°)", value: "quarter" },
        ], defaultValue: "full" },
        { name: "fabricWidth", label: "Fabric Width", type: "select", options: [
          { label: "36 inches", value: "36" },
          { label: "45 inches", value: "45" },
          { label: "54 inches", value: "54" },
          { label: "60 inches", value: "60" },
        ], defaultValue: "45" },
      ],
      calculate: (inputs) => {
        const waist = inputs.waist as number;
        const skirtLength = inputs.skirtLength as number;
        const skirtType = inputs.skirtType as string;
        const fabricWidth = parseInt(inputs.fabricWidth as string);
        if (!waist || !skirtLength) return null;

        const fraction = skirtType === "full" ? 1 : skirtType === "half" ? 0.5 : 0.25;
        const waistRadius = waist / (2 * Math.PI * fraction);
        const outerRadius = waistRadius + skirtLength + 1;

        const neededWidth = skirtType === "quarter" ? outerRadius + 2 : outerRadius * 2 + 2;
        const fits = fabricWidth >= neededWidth;

        const panels = fits ? 1 : Math.ceil(neededWidth / fabricWidth);
        const totalLength = fits
          ? (skirtType === "full" ? outerRadius * 2 * 2 : outerRadius * 2) + 4
          : outerRadius * 2 * panels + 4;
        const totalYards = Math.ceil((totalLength / 36) * 4) / 4;

        return {
          primary: { label: "Fits on Fabric?", value: fits ? "Yes — single width" : `No — need ${panels} panels` },
          details: [
            { label: "Minimum Width Needed", value: `${formatNumber(neededWidth, 1)} in` },
            { label: "Your Fabric Width", value: `${fabricWidth} in` },
            { label: "Outer Radius", value: `${formatNumber(outerRadius, 1)} in` },
            { label: "Estimated Fabric Length", value: `${formatNumber(totalYards, 2)} yards` },
            { label: "Panels Needed", value: `${panels}` },
          ],
          note: fits
            ? "Your fabric is wide enough. Fold the fabric and cut on the fold for efficiency."
            : "Your fabric is too narrow for a single-width cut. You will need to piece panels together, which adds seams.",
        };
      },
    },
  ],
  relatedSlugs: ["fabric-yardage-calculator", "pleated-skirt-calculator", "hem-length-calculator"],
  faq: [
    { question: "How do I calculate the radius for a circle skirt?", answer: "Divide your waist measurement by (2 × pi × circle fraction). For a full circle: waist / 6.28. For a half circle: waist / 3.14. For a quarter circle: waist / 1.57. This gives you the waist cutting radius." },
    { question: "How much fabric do I need for a full circle skirt?", answer: "A full circle skirt typically needs 4-6 yards of 45-inch fabric, depending on your waist size and desired length. Shorter skirts or smaller waists may need less. The calculator gives exact amounts." },
    { question: "Why does my circle skirt hang unevenly?", answer: "Circle skirts stretch on the bias grain. After cutting, hang the skirt for 24-48 hours, then trim the hemline evenly. This is normal and expected with any circular cut." },
  ],
  formula: "Waist radius = Waist / (2 × π × circle fraction) | Outer radius = Waist radius + Skirt length + Hem allowance | Fabric ≈ 2 × Outer radius for each half",
};
