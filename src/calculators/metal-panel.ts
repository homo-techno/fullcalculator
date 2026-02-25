import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const metalPanelCalculator: CalculatorDefinition = {
  slug: "metal-panel-calculator",
  title: "Corrugated Metal Panel Calculator",
  description: "Free corrugated metal panel calculator. Estimate how many metal roofing or siding panels, screws, trim, and flashing you need for your project.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["metal panel calculator", "corrugated metal calculator", "metal roofing calculator", "how many metal panels do I need", "metal siding calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Metal Panel Materials",
      description: "Estimate panels, screws, and trim for roofing or siding",
      fields: [
        { name: "length", label: "Area Length (feet)", type: "number", placeholder: "e.g. 40" },
        { name: "width", label: "Area Width / Height (feet)", type: "number", placeholder: "e.g. 20" },
        { name: "panelWidth", label: "Panel Coverage Width (inches)", type: "select", options: [{ label: "26\" (standard corrugated)", value: "26" }, { label: "36\" (standing seam)", value: "36" }, { label: "24\" (R-panel / PBR)", value: "24" }], defaultValue: "26" },
        { name: "panelLength", label: "Panel Length (feet)", type: "select", options: [{ label: "8 feet", value: "8" }, { label: "10 feet", value: "10" }, { label: "12 feet", value: "12" }, { label: "16 feet", value: "16" }, { label: "Custom (match width)", value: "custom" }], defaultValue: "12" },
        { name: "costPerPanel", label: "Cost per Panel (optional)", type: "number", placeholder: "e.g. 25", prefix: "$" },
      ],
      calculate: (inputs) => {
        const areaLength = inputs.length as number;
        const areaWidth = inputs.width as number;
        const panelWidthIn = parseInt((inputs.panelWidth as string) || "26");
        const panelLengthStr = (inputs.panelLength as string) || "12";
        const costPerPanel = inputs.costPerPanel as number;
        if (!areaLength || !areaWidth) return null;

        const areaSqFt = areaLength * areaWidth;
        const panelWidthFt = panelWidthIn / 12;
        const panelLengthFt = panelLengthStr === "custom" ? areaWidth : parseFloat(panelLengthStr);

        // Account for 1-rib overlap (about 2" for corrugated)
        const effectivePanelWidth = panelWidthFt;

        // Panels across the length
        const panelsAcross = Math.ceil(areaLength / effectivePanelWidth);

        // Panels needed vertically if area height > panel length
        const panelRows = Math.ceil(areaWidth / panelLengthFt);
        const totalPanels = panelsAcross * panelRows;
        const panelsWithWaste = Math.ceil(totalPanels * 1.05);

        // Screws: approximately 80 screws per 100 sq ft
        const screws = Math.ceil(areaSqFt / 100 * 80);

        // Ridge cap: for roofing, 1 per 10 feet
        const ridgeCapPcs = Math.ceil(areaLength / 10);

        // Trim: perimeter
        const trimLength = 2 * (areaLength + areaWidth);
        const trimPcs = Math.ceil(trimLength / 10);

        // Closure strips
        const closureStrips = panelsAcross * 2;

        const details: { label: string; value: string }[] = [
          { label: "Total Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Panel Size", value: `${panelWidthIn}\" x ${panelLengthFt}' ` },
          { label: "Panels Across", value: formatNumber(panelsAcross) },
          { label: "Panel Rows", value: formatNumber(panelRows) },
          { label: "Total Panels (exact)", value: formatNumber(totalPanels) },
          { label: "Panels with 5% Waste", value: formatNumber(panelsWithWaste) },
          { label: "Screws Needed", value: formatNumber(screws) },
          { label: "Ridge Cap (10' pcs)", value: formatNumber(ridgeCapPcs) },
          { label: "Trim Pieces (10' pcs)", value: formatNumber(trimPcs) },
          { label: "Closure Strips", value: formatNumber(closureStrips) },
        ];

        if (costPerPanel) {
          const panelCost = panelsWithWaste * costPerPanel;
          const screwCost = Math.ceil(screws / 250) * 30;
          const trimCost = (ridgeCapPcs + trimPcs) * 15;
          const totalCost = panelCost + screwCost + trimCost;
          details.push({ label: "Panel Cost", value: `$${formatNumber(panelCost, 2)}` });
          details.push({ label: "Hardware & Trim", value: `$${formatNumber(screwCost + trimCost, 2)}` });
          details.push({ label: "Estimated Total", value: `$${formatNumber(totalCost, 2)}` });
          details.push({ label: "Cost per sq ft", value: `$${formatNumber(totalCost / areaSqFt, 2)}` });
        }

        return {
          primary: { label: "Metal Panels Needed", value: `${formatNumber(panelsWithWaste)} panels` },
          details,
          note: "Panel coverage width accounts for the standard 1-rib overlap. Use self-drilling screws with rubber washers. Install panels starting from the end opposite prevailing wind direction. Includes 5% waste.",
        };
      },
    },
  ],
  relatedSlugs: ["roofing-calculator", "siding-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many screws per metal panel?", answer: "Use approximately 80 screws per 100 square feet (about 12-15 screws per 26-inch wide panel). Place screws in the flat of the corrugation for roofing and in the rib for siding." },
    { question: "How much do metal panels overlap?", answer: "Standard corrugated metal panels overlap by one rib, or approximately 2 inches. The overlap should face away from prevailing winds to prevent water infiltration." },
    { question: "How long do corrugated metal panels last?", answer: "Galvanized corrugated metal lasts 20-30 years. Painted or coated panels (Galvalume) last 40-60 years. Standing seam metal roofing can last 50+ years with proper installation." },
  ],
  formula: "Panels = (Area Length / Panel Width) x (Area Height / Panel Length) x 1.05 waste factor",
};
