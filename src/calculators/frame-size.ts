import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const frameSizeCalculator: CalculatorDefinition = {
  slug: "frame-size-calculator",
  title: "Picture Frame Size Calculator",
  description: "Free picture frame size calculator. Calculate frame dimensions, mat opening, and overall size for photos, prints, and artwork.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["picture frame size calculator", "frame calculator", "photo frame size", "frame dimensions", "framing calculator"],
  variants: [
    {
      id: "frame",
      name: "Frame Size Calculator",
      description: "Calculate overall frame dimensions with mat",
      fields: [
        { name: "artWidth", label: "Art/Photo Width (inches)", type: "number", placeholder: "e.g. 8", step: 0.125 },
        { name: "artHeight", label: "Art/Photo Height (inches)", type: "number", placeholder: "e.g. 10", step: 0.125 },
        { name: "matWidth", label: "Mat Border Width (inches)", type: "select", options: [
          { label: "No mat", value: "0" },
          { label: "1.5 inches", value: "1.5" },
          { label: "2 inches", value: "2" },
          { label: "2.5 inches (standard)", value: "2.5" },
          { label: "3 inches", value: "3" },
          { label: "3.5 inches", value: "3.5" },
          { label: "4 inches", value: "4" },
        ], defaultValue: "2.5" },
        { name: "frameWidth", label: "Frame Moulding Width (inches)", type: "select", options: [
          { label: "0.5 inch (thin)", value: "0.5" },
          { label: "0.75 inch", value: "0.75" },
          { label: "1 inch (standard)", value: "1" },
          { label: "1.5 inches", value: "1.5" },
          { label: "2 inches (wide)", value: "2" },
          { label: "3 inches (gallery)", value: "3" },
        ], defaultValue: "1" },
      ],
      calculate: (inputs) => {
        const aw = inputs.artWidth as number;
        const ah = inputs.artHeight as number;
        const mat = parseFloat(inputs.matWidth as string) || 0;
        const frame = parseFloat(inputs.frameWidth as string) || 1;
        if (!aw || !ah) return null;

        const matOpenW = aw - 0.5;
        const matOpenH = ah - 0.5;
        const matOuterW = aw + mat * 2;
        const matOuterH = ah + mat * 2;
        const overallW = matOuterW + frame * 2;
        const overallH = matOuterH + frame * 2;

        return {
          primary: { label: "Overall Frame Size", value: `${formatNumber(overallW, 1)}" x ${formatNumber(overallH, 1)}"` },
          details: [
            { label: "Art/photo size", value: `${aw}" x ${ah}"` },
            { label: "Mat opening (visible area)", value: `${formatNumber(matOpenW, 2)}" x ${formatNumber(matOpenH, 2)}"` },
            { label: "Mat outer size", value: mat > 0 ? `${formatNumber(matOuterW, 1)}" x ${formatNumber(matOuterH, 1)}"` : "No mat" },
            { label: "Frame moulding width", value: `${frame}"` },
            { label: "Overall dimensions", value: `${formatNumber(overallW, 1)}" x ${formatNumber(overallH, 1)}"` },
            { label: "Overall in cm", value: `${formatNumber(overallW * 2.54, 1)} x ${formatNumber(overallH * 2.54, 1)} cm` },
            { label: "Wall space needed", value: `${formatNumber(overallW + 2, 1)}" x ${formatNumber(overallH + 2, 1)}" (with 1" margin)` },
          ],
          note: "Mat opening is typically 0.25\" smaller per side than the art to create an overlap that holds the art in place.",
        };
      },
    },
    {
      id: "glass",
      name: "Glass/Backing Size",
      description: "Calculate glass and backing board dimensions",
      fields: [
        { name: "artWidth", label: "Art Width (inches)", type: "number", placeholder: "e.g. 8", step: 0.125 },
        { name: "artHeight", label: "Art Height (inches)", type: "number", placeholder: "e.g. 10", step: 0.125 },
        { name: "matWidth", label: "Mat Border (inches)", type: "number", placeholder: "e.g. 2.5", step: 0.25, defaultValue: 2.5 },
      ],
      calculate: (inputs) => {
        const aw = inputs.artWidth as number;
        const ah = inputs.artHeight as number;
        const mat = (inputs.matWidth as number) || 0;
        if (!aw || !ah) return null;

        const glassW = aw + mat * 2;
        const glassH = ah + mat * 2;
        const backingW = glassW;
        const backingH = glassH;

        return {
          primary: { label: "Glass Size", value: `${formatNumber(glassW, 2)}" x ${formatNumber(glassH, 2)}"` },
          details: [
            { label: "Glass dimensions", value: `${formatNumber(glassW, 2)}" x ${formatNumber(glassH, 2)}"` },
            { label: "Backing board", value: `${formatNumber(backingW, 2)}" x ${formatNumber(backingH, 2)}"` },
            { label: "Mat board (outer)", value: `${formatNumber(glassW, 2)}" x ${formatNumber(glassH, 2)}"` },
            { label: "Mat opening", value: `${formatNumber(aw - 0.5, 2)}" x ${formatNumber(ah - 0.5, 2)}"` },
            { label: "Glass area", value: `${formatNumber(glassW * glassH, 1)} sq in` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["mat-board-calculator", "canvas-size-calculator", "photo-print-size-calculator"],
  faq: [
    { question: "How wide should a mat border be?", answer: "Standard mat borders are 2-3 inches. Use wider mats (3-4 inches) for larger art. The bottom border is sometimes 0.5 inches wider than the top and sides (weighted bottom) for a more pleasing visual effect." },
    { question: "What is the standard mat opening overlap?", answer: "The mat opening is typically 0.25 inches smaller per side (0.5 inches total) than the art. This creates an overlap that holds the art in place and prevents it from falling through." },
    { question: "How do I choose frame moulding width?", answer: "Thin frames (0.5-1 inch) work for small prints and modern styles. Medium frames (1-2 inches) suit most artwork. Wide frames (2-3+ inches) are for large pieces or gallery-style presentation." },
  ],
  formula: "Mat Outer = Art Size + (2 × Mat Border) | Overall Frame = Mat Outer + (2 × Frame Moulding) | Mat Opening = Art Size - 0.5\"",
};
