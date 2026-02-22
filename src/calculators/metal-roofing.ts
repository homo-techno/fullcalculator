import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metalRoofingCalculator: CalculatorDefinition = {
  slug: "metal-roofing-calculator",
  title: "Metal Roofing Calculator",
  description: "Free metal roofing calculator. Calculate the number of metal panels, screws, trim pieces, and materials needed for a standing seam or corrugated metal roof.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["metal roofing calculator", "metal roof panels calculator", "standing seam calculator", "corrugated metal roof", "metal roof cost calculator"],
  variants: [
    {
      id: "panels",
      name: "Metal Roof Panels",
      description: "Calculate the number of metal roofing panels and fasteners needed",
      fields: [
        { name: "roofArea", label: "Roof Area (sq ft)", type: "number", placeholder: "e.g. 2000" },
        { name: "panelType", label: "Panel Type / Width", type: "select", options: [
          { label: "Standing Seam - 16\" coverage", value: "16" },
          { label: "Standing Seam - 18\" coverage", value: "18" },
          { label: "Corrugated - 24\" coverage", value: "24" },
          { label: "Corrugated - 36\" coverage", value: "36" },
          { label: "R-Panel / PBR - 36\" coverage", value: "36" },
        ], defaultValue: "16" },
        { name: "panelLength", label: "Panel Length (feet)", type: "select", options: [
          { label: "Custom / Full length (ridge to eave)", value: "0" },
          { label: "8 feet", value: "8" },
          { label: "10 feet", value: "10" },
          { label: "12 feet", value: "12" },
          { label: "16 feet", value: "16" },
        ], defaultValue: "0" },
        { name: "ridgeToEave", label: "Ridge to Eave Length (feet)", type: "number", placeholder: "e.g. 18" },
        { name: "roofLength", label: "Roof Ridge Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "pricePerPanel", label: "Price per Panel (optional)", type: "number", placeholder: "e.g. 45", prefix: "$" },
      ],
      calculate: (inputs) => {
        const roofArea = inputs.roofArea as number;
        const panelWidth = parseInt(inputs.panelType as string) || 16;
        const panelLengthStd = parseInt(inputs.panelLength as string) || 0;
        const ridgeToEave = inputs.ridgeToEave as number;
        const roofLength = inputs.roofLength as number;
        const price = inputs.pricePerPanel as number;
        if (!roofArea || !ridgeToEave || !roofLength) return null;

        const panelWidthFt = panelWidth / 12;
        const numPanelsWide = Math.ceil(roofLength / panelWidthFt);
        const totalPanels = numPanelsWide * 2;
        const actualPanelLength = panelLengthStd > 0 ? panelLengthStd : ridgeToEave;
        const panelsPerSide = numPanelsWide;

        const screwsPer100SqFt = panelWidth <= 18 ? 75 : 80;
        const totalScrews = Math.ceil((roofArea / 100) * screwsPer100SqFt);
        const ridgeCap = Math.ceil(roofLength / 10.5);
        const underlaymentRolls = Math.ceil(roofArea / 400);

        const details = [
          { label: "Panels per side", value: `${panelsPerSide}` },
          { label: "Total panels (both sides)", value: `${totalPanels}` },
          { label: "Panel coverage width", value: `${panelWidth}\"` },
          { label: "Panel length", value: `${formatNumber(actualPanelLength, 1)} ft` },
          { label: "Screws needed", value: `~${totalScrews}` },
          { label: "Ridge cap pieces (10.5 ft)", value: `${ridgeCap}` },
          { label: "Underlayment rolls", value: `${underlaymentRolls}` },
        ];

        if (price) {
          details.push({ label: "Estimated panel cost", value: `$${formatNumber(totalPanels * price, 2)}` });
        }

        return {
          primary: { label: "Metal Panels Needed", value: `${totalPanels} panels` },
          details,
          note: "Standing seam panels use concealed clips. Corrugated/R-panels use exposed fasteners. Add 5-10% extra for cuts and overlaps. Panels are often custom-cut to full ridge-to-eave length.",
        };
      },
    },
    {
      id: "trim-accessories",
      name: "Trim & Accessories",
      description: "Calculate trim pieces and accessories for a metal roof",
      fields: [
        { name: "ridgeLength", label: "Ridge Length (feet)", type: "number", placeholder: "e.g. 50" },
        { name: "eaveLength", label: "Total Eave/Drip Edge Length (feet)", type: "number", placeholder: "e.g. 100" },
        { name: "rakeLength", label: "Total Rake/Gable Edge Length (feet)", type: "number", placeholder: "e.g. 60" },
        { name: "valleyLength", label: "Total Valley Length (feet, 0 if none)", type: "number", placeholder: "e.g. 0", defaultValue: 0 },
        { name: "trimPieceLength", label: "Trim Piece Length", type: "select", options: [
          { label: "10 feet", value: "10" },
          { label: "10.5 feet (standard)", value: "10.5" },
          { label: "12 feet", value: "12" },
        ], defaultValue: "10.5" },
      ],
      calculate: (inputs) => {
        const ridge = inputs.ridgeLength as number;
        const eave = inputs.eaveLength as number;
        const rake = inputs.rakeLength as number;
        const valley = (inputs.valleyLength as number) || 0;
        const trimLength = parseFloat(inputs.trimPieceLength as string) || 10.5;
        if (!ridge || !eave || !rake) return null;

        const overlapFactor = 0.9;
        const effectiveLength = trimLength * overlapFactor;
        const ridgePieces = Math.ceil(ridge / effectiveLength);
        const eavePieces = Math.ceil(eave / effectiveLength);
        const rakePieces = Math.ceil(rake / effectiveLength);
        const valleyPieces = valley > 0 ? Math.ceil(valley / effectiveLength) : 0;

        return {
          primary: { label: "Total Trim Pieces", value: `${ridgePieces + eavePieces + rakePieces + valleyPieces}` },
          details: [
            { label: "Ridge cap pieces", value: `${ridgePieces}` },
            { label: "Eave/drip edge pieces", value: `${eavePieces}` },
            { label: "Rake/gable trim pieces", value: `${rakePieces}` },
            { label: "Valley pieces", value: `${valleyPieces}` },
            { label: "Trim piece length", value: `${trimLength} ft` },
            { label: "Effective length (with overlap)", value: `${formatNumber(effectiveLength, 1)} ft` },
          ],
          note: "Trim pieces overlap by approximately 1 foot (10% of length). Order matching color trim. Include sealant tape/butyl tape for overlaps and transitions.",
        };
      },
    },
  ],
  relatedSlugs: ["shingle-calculator", "square-footage-calculator", "slope-grade-calculator"],
  faq: [
    { question: "How long does a metal roof last?", answer: "Standing seam metal roofs last 40-70 years with proper installation. Corrugated metal panels typically last 25-40 years. Metal roofs withstand high winds, are fire-resistant, and reflect heat. They cost more upfront but often pay for themselves in longevity and energy savings." },
    { question: "Standing seam vs corrugated metal roofing?", answer: "Standing seam uses concealed fasteners (hidden clips) making it more weather-tight and long-lasting, but more expensive. Corrugated and R-panel use exposed fasteners which are cheaper to install but may require fastener replacement over time. Standing seam is preferred for residential; corrugated for agricultural and commercial buildings." },
  ],
  formula: "Panels = (Ridge Length / Panel Width) \u00D7 2 sides | Trim = Length / (Piece Length \u00D7 0.9 overlap)",
};
