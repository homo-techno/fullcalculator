import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const soffitCalculator: CalculatorDefinition = {
  slug: "soffit-calculator",
  title: "Soffit & Fascia Calculator",
  description: "Free soffit and fascia calculator. Calculate materials needed for soffit panels, fascia boards, and ventilation for your roof overhang.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["soffit calculator", "fascia calculator", "soffit and fascia", "soffit panels", "soffit ventilation calculator"],
  variants: [
    {
      id: "soffit-materials",
      name: "Soffit & Fascia Materials",
      description: "Calculate soffit panels and fascia boards needed",
      fields: [
        { name: "perimeterLength", label: "Total Eave Length (linear feet)", type: "number", placeholder: "e.g. 120" },
        { name: "soffitWidth", label: "Soffit Width / Overhang (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "soffitMaterial", label: "Soffit Material", type: "select", options: [
          { label: "Vinyl (12\" × 12' panels)", value: "vinyl" },
          { label: "Aluminum (12\" × 12' panels)", value: "aluminum" },
          { label: "Wood (4\" × 8' boards)", value: "wood" },
          { label: "Fiber Cement (12\" × 12' panels)", value: "fibercement" },
          { label: "Engineered Wood (12\" × 16' panels)", value: "engineered" },
        ], defaultValue: "vinyl" },
        { name: "ventType", label: "Ventilation Type", type: "select", options: [
          { label: "Fully Vented Soffit", value: "full" },
          { label: "Center Vent Strip", value: "center" },
          { label: "Non-Vented (solid)", value: "solid" },
        ], defaultValue: "full" },
      ],
      calculate: (inputs) => {
        const perimeterLength = inputs.perimeterLength as number;
        const soffitWidth = (inputs.soffitWidth as number) || 12;
        const material = inputs.soffitMaterial as string;
        const ventType = inputs.ventType as string;
        if (!perimeterLength) return null;

        const soffitAreaSqFt = perimeterLength * (soffitWidth / 12);

        let panelLengthFt: number;
        let panelWidthIn: number;
        let costPerPanel: number;

        switch (material) {
          case "vinyl":
            panelLengthFt = 12; panelWidthIn = 12; costPerPanel = 14; break;
          case "aluminum":
            panelLengthFt = 12; panelWidthIn = 12; costPerPanel = 18; break;
          case "wood":
            panelLengthFt = 8; panelWidthIn = 4; costPerPanel = 3; break;
          case "fibercement":
            panelLengthFt = 12; panelWidthIn = 12; costPerPanel = 20; break;
          case "engineered":
            panelLengthFt = 16; panelWidthIn = 12; costPerPanel = 22; break;
          default:
            panelLengthFt = 12; panelWidthIn = 12; costPerPanel = 14;
        }

        const panelCoverage = panelLengthFt * (panelWidthIn / 12);
        const panelsNeeded = Math.ceil(soffitAreaSqFt / panelCoverage * 1.10); // 10% waste

        // Fascia boards (typically 1×6 or 1×8, 16' lengths)
        const fasciaLength = perimeterLength;
        const fasciaBoards = Math.ceil(fasciaLength / 16 * 1.05);
        const fasciaCostPerBoard = 18;

        // J-channel for soffit edges
        const jChannelLength = perimeterLength * 2; // Both edges
        const jChannelPieces = Math.ceil(jChannelLength / 12);
        const jChannelCost = jChannelPieces * 4;

        const totalMaterialCost = (panelsNeeded * costPerPanel) + (fasciaBoards * fasciaCostPerBoard) + jChannelCost;

        // Ventilation
        let ventNote: string;
        switch (ventType) {
          case "full":
            ventNote = "Fully vented panels provide maximum airflow. NFA (Net Free Area) ≈ 9 sq in per linear foot.";
            break;
          case "center":
            ventNote = "Center-vent uses one vented panel flanked by solid panels. Good balance of ventilation and appearance.";
            break;
          default:
            ventNote = "Solid soffit requires other roof ventilation (ridge vent, gable vents, roof vents).";
        }

        return {
          primary: { label: "Soffit Panels Needed", value: `${panelsNeeded} panels` },
          details: [
            { label: "Soffit area", value: `${formatNumber(soffitAreaSqFt, 1)} sq ft` },
            { label: "Soffit panels (with 10% waste)", value: `${panelsNeeded}` },
            { label: "Fascia boards (1×6, 16')", value: `${fasciaBoards}` },
            { label: "J-channel pieces (12')", value: `${jChannelPieces}` },
            { label: "Estimated material cost", value: `$${formatNumber(totalMaterialCost, 0)}` },
            { label: "Soffit panel cost", value: `$${formatNumber(panelsNeeded * costPerPanel, 0)}` },
            { label: "Fascia board cost", value: `$${formatNumber(fasciaBoards * fasciaCostPerBoard, 0)}` },
          ],
          note: ventNote,
        };
      },
    },
    {
      id: "soffit-ventilation",
      name: "Soffit Ventilation Requirement",
      description: "Calculate how much soffit ventilation your attic needs",
      fields: [
        { name: "atticArea", label: "Attic Floor Area (sq ft)", type: "number", placeholder: "e.g. 1200" },
        { name: "ridgeVent", label: "Ridge Vent Installed?", type: "select", options: [
          { label: "Yes (balanced system)", value: "yes" },
          { label: "No (soffit vents only)", value: "no" },
        ], defaultValue: "yes" },
        { name: "eaveLength", label: "Total Eave Length (feet)", type: "number", placeholder: "e.g. 80" },
      ],
      calculate: (inputs) => {
        const atticArea = inputs.atticArea as number;
        const ridgeVent = inputs.ridgeVent as string;
        const eaveLength = inputs.eaveLength as number;
        if (!atticArea || !eaveLength) return null;

        // 1/150 rule: 1 sq ft of NFA per 150 sq ft of attic
        // 1/300 rule: 1 sq ft of NFA per 300 sq ft IF balanced intake/exhaust
        const ratio = ridgeVent === "yes" ? 300 : 150;
        const totalNFA = atticArea / ratio; // sq ft
        const totalNFASqIn = totalNFA * 144;

        // For balanced system, 50% intake (soffit) / 50% exhaust (ridge)
        const soffitNFASqIn = ridgeVent === "yes" ? totalNFASqIn / 2 : totalNFASqIn;

        // Standard vented soffit: ~9 sq in NFA per linear foot
        const ventedSoffitNeeded = soffitNFASqIn / 9; // linear feet of vented soffit

        // Or use individual soffit vents (typically 4"×16" = 26 sq in NFA each)
        const individualVents = Math.ceil(soffitNFASqIn / 26);
        const ventSpacing = eaveLength / individualVents;

        return {
          primary: { label: "Soffit Ventilation Needed", value: `${formatNumber(soffitNFASqIn, 0)} sq in NFA` },
          details: [
            { label: "Ventilation ratio used", value: `1/${ratio}` },
            { label: "Total attic NFA needed", value: `${formatNumber(totalNFASqIn, 0)} sq in` },
            { label: "Soffit NFA needed", value: `${formatNumber(soffitNFASqIn, 0)} sq in` },
            { label: "Option A: Vented soffit length", value: `${formatNumber(ventedSoffitNeeded, 1)} linear ft` },
            { label: "Option B: Individual vents (4\"×16\")", value: `${individualVents} vents` },
            { label: "Vent spacing", value: `Every ${formatNumber(ventSpacing, 1)} ft` },
          ],
          note: "A balanced ventilation system (50% intake at soffits, 50% exhaust at ridge) is most effective. Never block soffit vents with insulation. Use baffles to keep insulation away from soffit vents.",
        };
      },
    },
  ],
  relatedSlugs: ["roofing-calculator", "gutter-calculator", "siding-calculator"],
  faq: [
    { question: "What is the difference between soffit and fascia?", answer: "Soffit is the underside of the roof overhang (horizontal, faces the ground). Fascia is the vertical board at the edge of the roof where gutters attach. Together they enclose and protect the rafter tails and provide attic ventilation." },
    { question: "How much soffit ventilation do I need?", answer: "Follow the 1/300 rule with balanced ventilation: 1 sq ft of Net Free Area (NFA) per 300 sq ft of attic floor area, split 50/50 between intake (soffit) and exhaust (ridge vent). Without balanced ventilation, use 1/150 ratio." },
  ],
  formula: "Soffit Area = Eave Length × Overhang Width | NFA = Attic Area / 300 (balanced) or / 150 (unbalanced) | Panels = Area / Panel Coverage × 1.10",
};
