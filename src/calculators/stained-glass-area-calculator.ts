import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const stainedGlassAreaCalculator: CalculatorDefinition = {
  slug: "stained-glass-area-calculator",
  title: "Stained Glass Area Calculator",
  description: "Calculate glass area, lead came or copper foil, and solder needed for stained glass panel projects.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["stained glass area","stained glass calculator","lead came","copper foil glass"],
  variants: [{
    id: "standard",
    name: "Stained Glass Area",
    description: "Calculate glass area, lead came or copper foil, and solder needed for stained glass panel projects.",
    fields: [
      { name: "panelWidth", label: "Panel Width (inches)", type: "number", min: 4, max: 72, defaultValue: 18 },
      { name: "panelHeight", label: "Panel Height (inches)", type: "number", min: 4, max: 72, defaultValue: 24 },
      { name: "numPieces", label: "Number of Glass Pieces", type: "number", min: 2, max: 200, defaultValue: 25 },
      { name: "technique", label: "Technique", type: "select", options: [{ value: "1", label: "Copper Foil (Tiffany)" }, { value: "2", label: "Lead Came" }], defaultValue: "1" },
      { name: "glassPrice", label: "Glass Price ($/sq ft)", type: "number", min: 3, max: 50, defaultValue: 10 },
    ],
    calculate: (inputs) => {
    const pw = inputs.panelWidth as number;
    const ph = inputs.panelHeight as number;
    const pieces = inputs.numPieces as number;
    const tech = parseInt(inputs.technique as string);
    const glassPrice = inputs.glassPrice as number;
    const panelArea = pw * ph;
    const panelAreaSqFt = panelArea / 144;
    const wasteFactor = 1.33;
    const glassNeeded = panelAreaSqFt * wasteFactor;
    const glassCost = glassNeeded * glassPrice;
    const avgPerimeter = Math.sqrt(panelArea / pieces) * 4;
    const totalSeamLength = (pieces * avgPerimeter) / 2;
    const borderLength = (pw + ph) * 2;
    const totalCameLength = Math.round(totalSeamLength + borderLength);
    const solderOz = tech === 1 ? Math.round(totalCameLength * 0.06 * 10) / 10 : Math.round(pieces * 0.3 * 10) / 10;
    return {
      primary: { label: "Glass Needed", value: formatNumber(Math.round(glassNeeded * 100) / 100) + " sq ft" },
      details: [
        { label: "Glass Cost", value: "$" + formatNumber(Math.round(glassCost * 100) / 100) },
        { label: "Came/Foil Length", value: formatNumber(totalCameLength) + " inches" },
        { label: "Solder Needed", value: formatNumber(solderOz) + " oz" },
        { label: "Panel Area", value: formatNumber(Math.round(panelAreaSqFt * 100) / 100) + " sq ft" }
      ]
    };
  },
  }],
  relatedSlugs: ["mosaic-tile-calculator","resin-art-volume-calculator"],
  faq: [
    { question: "How much extra glass should I buy for stained glass?", answer: "Buy 30 to 40 percent more glass than the panel area to account for cutting waste, breakage, and irregular shapes. Complex curved pieces have higher waste." },
    { question: "What is the difference between copper foil and lead came?", answer: "Copper foil (Tiffany method) wraps each piece in adhesive-backed foil and solders joints. Lead came uses H-shaped lead strips between pieces. Foil allows finer detail; came is more traditional." },
    { question: "How much solder do I need?", answer: "For copper foil, estimate about 0.5 to 1 pound of solder per 4 square feet of panel. Lead came uses less solder since joints are only at intersections." },
  ],
  formula: "Glass Needed = (Panel Width x Height / 144) x 1.33 waste factor; Came Length = (Pieces x Avg Perimeter / 2) + Border; Solder = Came Length x Usage Factor",
};
