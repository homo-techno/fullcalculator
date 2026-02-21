import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const matBoardCalculator: CalculatorDefinition = {
  slug: "mat-board-calculator",
  title: "Mat Board Calculator",
  description: "Free mat board calculator. Calculate mat board dimensions, opening size, and border widths for picture framing and art mounting.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["mat board calculator", "picture mat calculator", "mount board calculator", "mat border calculator", "framing mat size"],
  variants: [
    {
      id: "equal",
      name: "Equal Borders",
      description: "Calculate mat with equal borders on all sides",
      fields: [
        { name: "artWidth", label: "Art Width (inches)", type: "number", placeholder: "e.g. 8", step: 0.125 },
        { name: "artHeight", label: "Art Height (inches)", type: "number", placeholder: "e.g. 10", step: 0.125 },
        { name: "borderWidth", label: "Border Width (inches)", type: "number", placeholder: "e.g. 2.5", step: 0.25, defaultValue: 2.5 },
        { name: "overlap", label: "Overlap per Side (inches)", type: "select", options: [
          { label: "1/8 inch (3mm)", value: "0.125" },
          { label: "1/4 inch (6mm) - standard", value: "0.25" },
          { label: "3/8 inch (10mm)", value: "0.375" },
        ], defaultValue: "0.25" },
      ],
      calculate: (inputs) => {
        const aw = inputs.artWidth as number;
        const ah = inputs.artHeight as number;
        const border = (inputs.borderWidth as number) || 2.5;
        const overlap = parseFloat(inputs.overlap as string) || 0.25;
        if (!aw || !ah) return null;

        const openW = aw - overlap * 2;
        const openH = ah - overlap * 2;
        const outerW = aw + border * 2;
        const outerH = ah + border * 2;
        const matArea = outerW * outerH - openW * openH;

        return {
          primary: { label: "Mat Outer Size", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
          details: [
            { label: "Mat outer dimensions", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
            { label: "Mat opening", value: `${formatNumber(openW, 2)}" x ${formatNumber(openH, 2)}"` },
            { label: "Border width (all sides)", value: `${border}"` },
            { label: "Overlap per side", value: `${overlap}"` },
            { label: "Art size", value: `${aw}" x ${ah}"` },
            { label: "Mat board area", value: `${formatNumber(matArea, 1)} sq in` },
            { label: "Visible art area", value: `${formatNumber(openW * openH, 1)} sq in` },
          ],
        };
      },
    },
    {
      id: "weighted",
      name: "Weighted Bottom",
      description: "Mat with a wider bottom border for visual balance",
      fields: [
        { name: "artWidth", label: "Art Width (inches)", type: "number", placeholder: "e.g. 8", step: 0.125 },
        { name: "artHeight", label: "Art Height (inches)", type: "number", placeholder: "e.g. 10", step: 0.125 },
        { name: "sideBorder", label: "Side Border Width (inches)", type: "number", placeholder: "e.g. 2.5", step: 0.25, defaultValue: 2.5 },
        { name: "extraBottom", label: "Extra Bottom Width (inches)", type: "number", placeholder: "e.g. 0.5", step: 0.25, defaultValue: 0.5 },
      ],
      calculate: (inputs) => {
        const aw = inputs.artWidth as number;
        const ah = inputs.artHeight as number;
        const side = (inputs.sideBorder as number) || 2.5;
        const extra = (inputs.extraBottom as number) || 0.5;
        if (!aw || !ah) return null;

        const topBorder = side;
        const bottomBorder = side + extra;
        const outerW = aw + side * 2;
        const outerH = ah + topBorder + bottomBorder;
        const openW = aw - 0.5;
        const openH = ah - 0.5;

        return {
          primary: { label: "Mat Outer Size", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
          details: [
            { label: "Top border", value: `${topBorder}"` },
            { label: "Bottom border", value: `${bottomBorder}"` },
            { label: "Side borders", value: `${side}" each` },
            { label: "Mat opening", value: `${formatNumber(openW, 2)}" x ${formatNumber(openH, 2)}"` },
            { label: "Mat outer size", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
          ],
          note: "A weighted bottom (wider bottom border) compensates for an optical illusion that makes equal borders look bottom-heavy. Standard extra is 0.5 inches.",
        };
      },
    },
    {
      id: "double",
      name: "Double Mat",
      description: "Calculate dimensions for a double mat (two layered mats)",
      fields: [
        { name: "artWidth", label: "Art Width (inches)", type: "number", placeholder: "e.g. 8", step: 0.125 },
        { name: "artHeight", label: "Art Height (inches)", type: "number", placeholder: "e.g. 10", step: 0.125 },
        { name: "outerBorder", label: "Outer Mat Border (inches)", type: "number", placeholder: "e.g. 2.5", step: 0.25, defaultValue: 2.5 },
        { name: "innerReveal", label: "Inner Mat Reveal (inches)", type: "select", options: [
          { label: "1/8 inch", value: "0.125" },
          { label: "1/4 inch (standard)", value: "0.25" },
          { label: "3/8 inch", value: "0.375" },
          { label: "1/2 inch", value: "0.5" },
        ], defaultValue: "0.25" },
      ],
      calculate: (inputs) => {
        const aw = inputs.artWidth as number;
        const ah = inputs.artHeight as number;
        const outerBorder = (inputs.outerBorder as number) || 2.5;
        const reveal = parseFloat(inputs.innerReveal as string) || 0.25;
        if (!aw || !ah) return null;

        const innerOpenW = aw - 0.5;
        const innerOpenH = ah - 0.5;
        const outerOpenW = innerOpenW - reveal * 2;
        const outerOpenH = innerOpenH - reveal * 2;
        const outerW = aw + outerBorder * 2;
        const outerH = ah + outerBorder * 2;

        return {
          primary: { label: "Double Mat Size", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
          details: [
            { label: "Outer mat size", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
            { label: "Outer mat opening", value: `${formatNumber(outerOpenW, 2)}" x ${formatNumber(outerOpenH, 2)}"` },
            { label: "Inner mat size", value: `${formatNumber(outerW, 2)}" x ${formatNumber(outerH, 2)}"` },
            { label: "Inner mat opening", value: `${formatNumber(innerOpenW, 2)}" x ${formatNumber(innerOpenH, 2)}"` },
            { label: "Inner reveal", value: `${reveal}" all sides` },
            { label: "Art size", value: `${aw}" x ${ah}"` },
          ],
          note: "Double matting adds a thin accent border of a second color. The inner mat reveal is the visible strip of the inner mat color.",
        };
      },
    },
  ],
  relatedSlugs: ["frame-size-calculator", "canvas-size-calculator", "photo-print-size-calculator"],
  faq: [
    { question: "What is a mat board?", answer: "A mat board is a thick cardboard border placed between artwork and the frame glass. It provides visual separation, protects the art from touching the glass, and adds a professional finished look." },
    { question: "What is a weighted bottom mat?", answer: "A weighted bottom mat has a slightly wider bottom border (typically 0.5\" extra). This compensates for an optical illusion where equal borders appear bottom-heavy, making the presentation look more balanced." },
    { question: "What is a double mat?", answer: "A double mat uses two mat boards stacked together with the inner mat slightly larger opening, revealing a thin strip (1/4\" typical) of the inner mat color. This adds depth and a decorative accent." },
  ],
  formula: "Mat Outer = Art + (2 × Border) | Opening = Art - (2 × Overlap) | Double Mat: Inner Opening = Art - 0.5\", Outer Opening = Inner Opening - (2 × Reveal)",
};
