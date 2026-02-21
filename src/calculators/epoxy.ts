import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const epoxyCalculator: CalculatorDefinition = {
  slug: "epoxy-calculator",
  title: "Epoxy Calculator",
  description: "Free epoxy floor calculator. Calculate how many gallons of epoxy coating you need for garage floors, basements, and other surfaces.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["epoxy calculator", "epoxy floor calculator", "garage floor epoxy", "epoxy coating calculator", "epoxy resin floor"],
  variants: [
    {
      id: "calc",
      name: "Calculate Epoxy Needed",
      description: "Calculate gallons of epoxy for your floor",
      fields: [
        { name: "area", label: "Floor Area (sq ft)", type: "number", placeholder: "e.g. 400" },
        { name: "thickness", label: "Thickness (mils)", type: "select", options: [
          { label: "8 mils (thin coat)", value: "8" },
          { label: "12 mils (standard)", value: "12" },
          { label: "16 mils (thick coat)", value: "16" },
          { label: "20 mils (heavy duty)", value: "20" },
        ], defaultValue: "12" },
        { name: "coats", label: "Number of Coats", type: "select", options: [
          { label: "1 coat", value: "1" },
          { label: "2 coats (recommended)", value: "2" },
        ], defaultValue: "2" },
      ],
      calculate: (inputs) => {
        const area = inputs.area as number;
        const thickness = parseInt(inputs.thickness as string) || 12;
        const coats = parseInt(inputs.coats as string) || 2;
        if (!area) return null;

        // 1 mil = 0.001 inches. Volume = area (sq in) x thickness (in)
        // 1 gallon = 231 cubic inches
        // Coverage per gallon at 1 mil = 1604 sq ft (theoretical)
        // With practical losses (~60% solids for typical epoxy), coverage is lower
        const thicknessInches = thickness / 1000;
        const areaSqIn = area * 144;
        const volumeCuIn = areaSqIn * thicknessInches;
        const gallonsPerCoat = volumeCuIn / 231;
        const totalGallons = gallonsPerCoat * coats;
        const gallonsWithWaste = totalGallons * 1.10; // 10% waste

        // Typical 2-car garage
        const kitSize = Math.ceil(gallonsWithWaste);

        return {
          primary: { label: "Epoxy Needed", value: `${formatNumber(gallonsWithWaste, 1)} gallons` },
          details: [
            { label: "Floor area", value: `${formatNumber(area)} sq ft` },
            { label: "Thickness per coat", value: `${thickness} mils` },
            { label: "Number of coats", value: `${coats}` },
            { label: "Gallons per coat", value: formatNumber(gallonsPerCoat, 2) },
            { label: "Total gallons (exact)", value: formatNumber(totalGallons, 2) },
            { label: "With 10% waste", value: `${formatNumber(gallonsWithWaste, 1)} gallons` },
            { label: "Gallon kits to buy", value: `${kitSize}` },
          ],
          note: "Typical garage floor epoxy is applied at 12-16 mils per coat. A standard 2-car garage (400-500 sq ft) needs 2-3 gallons for 2 coats at 12 mils. Includes 10% waste for uneven surfaces.",
        };
      },
    },
  ],
  relatedSlugs: ["resin-calculator", "paint-calculator", "square-footage-calculator"],
  faq: [
    { question: "How much epoxy do I need for a garage floor?", answer: "A standard 2-car garage (400-500 sq ft) typically needs 2-3 gallons of epoxy for 2 coats at 12 mils thickness. One gallon covers approximately 125-160 sq ft per coat at 12 mils." },
    { question: "How thick should garage floor epoxy be?", answer: "For residential garage floors, 12-16 mils per coat is standard. Apply 2 coats for a total of 24-32 mils. Commercial and industrial floors may require 20+ mils per coat." },
    { question: "What are mils in epoxy coating?", answer: "A mil is 1/1000 of an inch (0.001 inches). It is the standard unit for measuring coating thickness. 12 mils equals about the thickness of a sheet of paper." },
  ],
  formula: "Gallons = (Area x 144 x Thickness/1000) / 231 x Coats x 1.10",
};
