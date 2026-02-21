import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const gridCalculator: CalculatorDefinition = {
  slug: "grid-calculator",
  title: "Design Grid Calculator",
  description: "Free design grid calculator. Calculate column widths, gutters, and margins for responsive web layouts and print design grids.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["grid calculator", "column grid calculator", "design grid", "responsive grid", "layout grid calculator", "gutter calculator"],
  variants: [
    {
      id: "columns",
      name: "Column Grid",
      description: "Calculate column widths from a total width",
      fields: [
        { name: "totalWidth", label: "Total Width (px)", type: "number", placeholder: "e.g. 1440" },
        { name: "columns", label: "Number of Columns", type: "select", options: [
          { label: "3 columns", value: "3" },
          { label: "4 columns", value: "4" },
          { label: "6 columns", value: "6" },
          { label: "8 columns", value: "8" },
          { label: "12 columns (standard)", value: "12" },
          { label: "16 columns", value: "16" },
        ], defaultValue: "12" },
        { name: "gutterWidth", label: "Gutter Width (px)", type: "number", placeholder: "e.g. 24", defaultValue: 24 },
        { name: "marginWidth", label: "Side Margins (px)", type: "number", placeholder: "e.g. 80", defaultValue: 80 },
      ],
      calculate: (inputs) => {
        const total = inputs.totalWidth as number;
        const cols = parseInt(inputs.columns as string) || 12;
        const gutter = (inputs.gutterWidth as number) || 0;
        const margin = (inputs.marginWidth as number) || 0;
        if (!total) return null;

        const contentWidth = total - margin * 2;
        const totalGutters = gutter * (cols - 1);
        const colWidth = (contentWidth - totalGutters) / cols;

        const spanWidths = [1, 2, 3, 4, 6].filter(s => s <= cols).map(span => ({
          label: `${span}-column span`,
          value: `${formatNumber(colWidth * span + gutter * (span - 1), 1)}px`,
        }));

        return {
          primary: { label: "Column Width", value: `${formatNumber(colWidth, 1)}px` },
          details: [
            { label: "Total width", value: `${total}px` },
            { label: "Content width", value: `${formatNumber(contentWidth, 1)}px` },
            { label: "Column width", value: `${formatNumber(colWidth, 2)}px` },
            { label: "Gutter width", value: `${gutter}px` },
            { label: "Side margins", value: `${margin}px each` },
            { label: "Number of columns", value: `${cols}` },
            { label: "Number of gutters", value: `${cols - 1}` },
            ...spanWidths,
          ],
        };
      },
    },
    {
      id: "responsive",
      name: "Responsive Breakpoints",
      description: "Calculate grid at common breakpoints",
      fields: [
        { name: "columns", label: "Desktop Columns", type: "select", options: [
          { label: "6 columns", value: "6" },
          { label: "8 columns", value: "8" },
          { label: "12 columns", value: "12" },
        ], defaultValue: "12" },
        { name: "gutterWidth", label: "Gutter Width (px)", type: "number", placeholder: "e.g. 24", defaultValue: 24 },
      ],
      calculate: (inputs) => {
        const cols = parseInt(inputs.columns as string) || 12;
        const gutter = (inputs.gutterWidth as number) || 24;

        const breakpoints = [
          { name: "Mobile (375px)", width: 375, margin: 16, cols: 4 },
          { name: "Tablet (768px)", width: 768, margin: 32, cols: 8 },
          { name: "Desktop (1024px)", width: 1024, margin: 48, cols: cols },
          { name: "Large (1280px)", width: 1280, margin: 64, cols: cols },
          { name: "XL (1440px)", width: 1440, margin: 80, cols: cols },
          { name: "2XL (1920px)", width: 1920, margin: 120, cols: cols },
        ];

        const details = breakpoints.map(bp => {
          const content = bp.width - bp.margin * 2;
          const colWidth = (content - gutter * (bp.cols - 1)) / bp.cols;
          return {
            label: bp.name,
            value: `${bp.cols} cols × ${formatNumber(colWidth, 1)}px (${bp.margin}px margins)`,
          };
        });

        return {
          primary: { label: "Responsive Grid", value: `${cols}-column system` },
          details,
          note: "Column counts reduce on smaller screens. Standard approach: 12 cols desktop, 8 cols tablet, 4 cols mobile.",
        };
      },
    },
    {
      id: "baseline",
      name: "Baseline Grid",
      description: "Calculate a baseline grid for vertical rhythm",
      fields: [
        { name: "baseFontSize", label: "Base Font Size (px)", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
        { name: "lineHeight", label: "Line Height", type: "number", placeholder: "e.g. 1.5", step: 0.05, defaultValue: 1.5 },
        { name: "steps", label: "Spacing Steps", type: "select", options: [
          { label: "6 steps", value: "6" },
          { label: "8 steps", value: "8" },
          { label: "10 steps", value: "10" },
        ], defaultValue: "8" },
      ],
      calculate: (inputs) => {
        const fontSize = (inputs.baseFontSize as number) || 16;
        const lineHeight = (inputs.lineHeight as number) || 1.5;
        const steps = parseInt(inputs.steps as string) || 8;

        const baselineUnit = fontSize * lineHeight;
        const details: { label: string; value: string }[] = [
          { label: "Baseline unit", value: `${formatNumber(baselineUnit, 1)}px` },
        ];

        const multipliers = [0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8].slice(0, steps);
        for (const m of multipliers) {
          details.push({
            label: `${m}x baseline`,
            value: `${formatNumber(baselineUnit * m, 1)}px`,
          });
        }

        return {
          primary: { label: "Baseline Unit", value: `${formatNumber(baselineUnit, 1)}px` },
          details,
          note: "Use baseline multiples for margins, padding, and element heights to maintain consistent vertical rhythm.",
        };
      },
    },
  ],
  relatedSlugs: ["golden-ratio-calculator", "font-scale-calculator", "rule-of-thirds-calculator"],
  faq: [
    { question: "What is a design grid?", answer: "A design grid is a system of columns, gutters, and margins that creates a consistent framework for placing content. The most common web grid is 12 columns because 12 is divisible by 2, 3, 4, and 6." },
    { question: "What is a gutter in a grid?", answer: "A gutter is the space between columns. Standard gutter widths are 16-32px for web design. Gutters provide breathing room between content areas and improve readability." },
    { question: "What is a baseline grid?", answer: "A baseline grid is a horizontal grid based on your line height. All spacing and element heights align to multiples of the baseline unit, creating consistent vertical rhythm throughout the design." },
  ],
  formula: "Column Width = (Total Width - 2 × Margin - (Columns - 1) × Gutter) / Columns | Baseline Unit = Font Size × Line Height",
};
