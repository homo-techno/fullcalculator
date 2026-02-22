import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const shingleCalculator: CalculatorDefinition = {
  slug: "shingle-calculator",
  title: "Roof Shingle Calculator",
  description: "Free roof shingle calculator. Calculate how many bundles or squares of shingles you need, plus underlayment, ridge cap, and nails for your roofing project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["shingle calculator", "roof shingle calculator", "how many shingles do I need", "roofing bundle calculator", "roofing square calculator"],
  variants: [
    {
      id: "from-area",
      name: "From Roof Area",
      description: "Calculate shingles needed from known roof area",
      fields: [
        { name: "roofArea", label: "Roof Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "shingleType", label: "Shingle Type", type: "select", options: [
          { label: "3-Tab (3 bundles/square)", value: "3" },
          { label: "Architectural (3 bundles/square)", value: "3" },
          { label: "Heavy Architectural (4 bundles/square)", value: "4" },
          { label: "Designer/Premium (4-5 bundles/square)", value: "5" },
        ], defaultValue: "3" },
        { name: "wasteFactor", label: "Waste Factor", type: "select", options: [
          { label: "10% - Simple gable roof", value: "1.10" },
          { label: "15% - Standard hip/valley", value: "1.15" },
          { label: "20% - Complex roof with dormers", value: "1.20" },
          { label: "25% - Very complex layout", value: "1.25" },
        ], defaultValue: "1.15" },
        { name: "ridgeLength", label: "Ridge & Hip Length (feet, optional)", type: "number", placeholder: "e.g. 60" },
        { name: "pricePerBundle", label: "Price per Bundle (optional)", type: "number", placeholder: "e.g. 35", prefix: "$" },
      ],
      calculate: (inputs) => {
        const roofArea = inputs.roofArea as number;
        const bundlesPerSq = parseInt(inputs.shingleType as string) || 3;
        const waste = parseFloat(inputs.wasteFactor as string) || 1.15;
        const ridgeLength = inputs.ridgeLength as number;
        const price = inputs.pricePerBundle as number;
        if (!roofArea) return null;

        const adjustedArea = roofArea * waste;
        const squares = adjustedArea / 100;
        const bundles = Math.ceil(squares * bundlesPerSq);
        const underlaymentRolls = Math.ceil(adjustedArea / 400);
        const nailsLbs = Math.ceil((adjustedArea / 100) * 2.5);
        const ridgeCaps = ridgeLength ? Math.ceil(ridgeLength / 20) : 0;

        const details = [
          { label: "Roofing squares", value: formatNumber(squares, 1) },
          { label: "Bundles needed", value: `${bundles}` },
          { label: "Underlayment rolls (4\u00D7100 ft)", value: `${underlaymentRolls}` },
          { label: "Roofing nails", value: `~${nailsLbs} lbs` },
          { label: "Roof area (with waste)", value: `${formatNumber(adjustedArea, 0)} sq ft` },
          { label: "Waste factor", value: `${((waste - 1) * 100).toFixed(0)}%` },
        ];

        if (ridgeLength) {
          details.push({ label: "Ridge cap bundles", value: `${ridgeCaps}` });
        }
        if (price) {
          details.push({ label: "Estimated shingle cost", value: `$${formatNumber(bundles * price, 2)}` });
        }

        return {
          primary: { label: "Shingle Bundles Needed", value: `${bundles} bundles (${formatNumber(squares, 1)} squares)` },
          details,
          note: "One roofing square = 100 sq ft. Standard shingles come 3 bundles per square. Underlayment rolls cover approximately 400 sq ft. Always check manufacturer specifications.",
        };
      },
    },
    {
      id: "from-footprint",
      name: "From House Footprint",
      description: "Estimate roof area from house footprint and roof pitch",
      fields: [
        { name: "footprintArea", label: "House Footprint Area (sq ft)", type: "number", placeholder: "e.g. 1500" },
        { name: "pitch", label: "Roof Pitch", type: "select", options: [
          { label: "3/12 (low slope) - Factor 1.031", value: "1.031" },
          { label: "4/12 - Factor 1.054", value: "1.054" },
          { label: "5/12 - Factor 1.083", value: "1.083" },
          { label: "6/12 - Factor 1.118", value: "1.118" },
          { label: "7/12 - Factor 1.158", value: "1.158" },
          { label: "8/12 - Factor 1.202", value: "1.202" },
          { label: "9/12 - Factor 1.250", value: "1.250" },
          { label: "10/12 - Factor 1.302", value: "1.302" },
          { label: "12/12 - Factor 1.414", value: "1.414" },
        ], defaultValue: "1.118" },
        { name: "wasteFactor", label: "Waste Factor", type: "select", options: [
          { label: "10% - Simple gable", value: "1.10" },
          { label: "15% - Standard", value: "1.15" },
          { label: "20% - Complex", value: "1.20" },
        ], defaultValue: "1.15" },
      ],
      calculate: (inputs) => {
        const footprint = inputs.footprintArea as number;
        const pitchFactor = parseFloat(inputs.pitch as string) || 1.118;
        const waste = parseFloat(inputs.wasteFactor as string) || 1.15;
        if (!footprint) return null;

        const roofArea = footprint * pitchFactor;
        const adjustedArea = roofArea * waste;
        const squares = adjustedArea / 100;
        const bundles = Math.ceil(squares * 3);

        return {
          primary: { label: "Shingle Bundles Needed", value: `${bundles} bundles (${formatNumber(squares, 1)} squares)` },
          details: [
            { label: "Estimated roof area", value: `${formatNumber(roofArea, 0)} sq ft` },
            { label: "With waste", value: `${formatNumber(adjustedArea, 0)} sq ft` },
            { label: "Pitch factor", value: `${pitchFactor}` },
            { label: "Footprint area", value: `${formatNumber(footprint, 0)} sq ft` },
          ],
          note: "This estimates roof area from the house footprint using the pitch multiplier. For accurate results, measure the actual roof area. Overhangs/eaves add to the footprint.",
        };
      },
    },
  ],
  relatedSlugs: ["metal-roofing-calculator", "concrete-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many bundles of shingles do I need?", answer: "One roofing square covers 100 square feet. Most standard and architectural shingles come 3 bundles per square. So for a 2,000 sq ft roof: 2,000 / 100 = 20 squares \u00D7 3 = 60 bundles. Add 10-20% for waste depending on roof complexity." },
    { question: "How long do asphalt shingles last?", answer: "3-tab shingles last 15-20 years. Architectural/dimensional shingles last 25-30 years. Premium/designer shingles can last 30-50 years. Lifespan depends on climate, ventilation, installation quality, and maintenance." },
  ],
  formula: "Squares = Roof Area / 100 | Bundles = Squares \u00D7 3 (or 4-5 for heavy shingles)",
};
