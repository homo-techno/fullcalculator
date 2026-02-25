import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const concreteFootingCalcCalculator: CalculatorDefinition = {
  slug: "concrete-footing-calc-calculator",
  title: "Concrete Footing Calculator",
  description: "Free concrete footing calculator. Estimate cubic yards and bags of concrete needed for continuous footings, pier footings, and foundation walls.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["concrete footing calculator", "footing calculator", "foundation footing calculator", "how much concrete for footings", "pier footing calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Concrete Footing",
      description: "Estimate concrete for continuous or pier footings",
      fields: [
        { name: "footingType", label: "Footing Type", type: "select", options: [{ label: "Continuous Footing (strip)", value: "continuous" }, { label: "Pier/Column Footing (round)", value: "pier" }, { label: "Pier/Column Footing (square)", value: "square_pier" }], defaultValue: "continuous" },
        { name: "length", label: "Length / Perimeter (feet)", type: "number", placeholder: "e.g. 120" },
        { name: "width", label: "Width or Diameter (inches)", type: "number", placeholder: "e.g. 16", defaultValue: 16 },
        { name: "depth", label: "Depth (inches)", type: "number", placeholder: "e.g. 12", defaultValue: 12 },
        { name: "quantity", label: "Number of Piers (if pier type)", type: "number", placeholder: "e.g. 8", defaultValue: 1 },
      ],
      calculate: (inputs) => {
        const footingType = (inputs.footingType as string) || "continuous";
        const length = inputs.length as number;
        const widthIn = (inputs.width as number) || 16;
        const depthIn = (inputs.depth as number) || 12;
        const quantity = (inputs.quantity as number) || 1;
        if (!length && footingType === "continuous") return null;
        if (!widthIn) return null;

        let cubicFeet = 0;

        if (footingType === "continuous") {
          const widthFt = widthIn / 12;
          const depthFt = depthIn / 12;
          cubicFeet = length * widthFt * depthFt;
        } else if (footingType === "pier") {
          const radiusFt = (widthIn / 12) / 2;
          const depthFt = depthIn / 12;
          cubicFeet = Math.PI * radiusFt * radiusFt * depthFt * quantity;
        } else {
          const sideFt = widthIn / 12;
          const depthFt = depthIn / 12;
          cubicFeet = sideFt * sideFt * depthFt * quantity;
        }

        const cubicYards = cubicFeet / 27;
        const cubicYardsWithWaste = cubicYards * 1.10;

        // 80-lb bags: each yields 0.6 cubic feet
        const bags80lb = Math.ceil(cubicFeet * 1.10 / 0.6);
        // 60-lb bags: each yields 0.45 cubic feet
        const bags60lb = Math.ceil(cubicFeet * 1.10 / 0.45);

        const details: { label: string; value: string }[] = [
          { label: "Footing Type", value: footingType === "continuous" ? "Continuous Strip" : footingType === "pier" ? "Round Pier" : "Square Pier" },
          { label: "Dimensions", value: `${widthIn}\" wide x ${depthIn}\" deep` },
        ];

        if (footingType === "continuous") {
          details.push({ label: "Length", value: `${formatNumber(length)} feet` });
        } else {
          details.push({ label: "Number of Piers", value: formatNumber(quantity) });
        }

        details.push(
          { label: "Volume (exact)", value: `${formatNumber(cubicFeet, 1)} cubic feet` },
          { label: "Cubic Yards (exact)", value: formatNumber(cubicYards, 2) },
          { label: "Cubic Yards with 10% Waste", value: formatNumber(cubicYardsWithWaste, 2) },
          { label: "80 lb Bags Needed", value: formatNumber(bags80lb) },
          { label: "60 lb Bags Needed", value: formatNumber(bags60lb) },
        );

        const useTruck = cubicYardsWithWaste > 1;
        if (useTruck) {
          details.push({ label: "Recommendation", value: "Order ready-mix truck delivery" });
        }

        return {
          primary: { label: "Concrete Needed", value: `${formatNumber(cubicYardsWithWaste, 2)} cubic yards` },
          details,
          note: "Includes 10% waste factor for spillage and overdig. For volumes over 1 cubic yard, ready-mix truck delivery is more cost-effective. Always check local codes for minimum footing dimensions and rebar requirements.",
        };
      },
    },
  ],
  relatedSlugs: ["concrete-calculator", "post-hole-calc-calculator", "cinder-block-wall-calculator"],
  faq: [
    { question: "How deep should a concrete footing be?", answer: "Footings must extend below the frost line, which varies by region (12-48 inches). Standard residential footings are typically 12 inches deep and 16-20 inches wide, or twice the width of the wall they support." },
    { question: "How wide should a footing be?", answer: "A footing should be at least twice the width of the wall it supports. For a standard 8-inch block wall, the footing should be at least 16 inches wide. Check local codes for specific requirements." },
    { question: "How many bags of concrete do I need for a footing?", answer: "An 80-lb bag of concrete yields about 0.6 cubic feet. A 10-foot continuous footing that is 16\" wide and 12\" deep requires about 13 cubic feet, or about 22 bags of 80-lb concrete mix." },
  ],
  formula: "Continuous: Cu Yd = Length (ft) x Width (in)/12 x Depth (in)/12 / 27; Pier: Cu Yd = π x (Diameter/24)² x Depth (in)/12 / 27 x Qty",
};
