import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const loadingDockCalculator: CalculatorDefinition = {
  slug: "loading-dock-calculator",
  title: "Loading Dock Calculator",
  description: "Calculate loading dock dimensions and requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["loading dock","loading dock size calculator"],
  variants: [{
    id: "standard",
    name: "Loading Dock",
    description: "Calculate loading dock dimensions and requirements.",
    fields: [
      { name: "dockPositions", label: "Number of Dock Positions", type: "number", min: 1, max: 30, defaultValue: 4 },
      { name: "truckType", label: "Truck Type", type: "select", options: [{ value: "48", label: "Standard Semi (48 ft)" }, { value: "53", label: "Long Semi (53 ft)" }, { value: "24", label: "Box Truck (24 ft)" }], defaultValue: "48" },
      { name: "dockWidth", label: "Dock Door Width (ft)", type: "number", min: 8, max: 14, defaultValue: 10 },
      { name: "apronDepth", label: "Approach Apron Depth (ft)", type: "number", min: 30, max: 120, defaultValue: 60 },
    ],
    calculate: (inputs) => {
      const positions = inputs.dockPositions as number;
      const truckLen = Number(inputs.truckType as number);
      const dw = inputs.dockWidth as number;
      const apron = inputs.apronDepth as number;
      if (!positions || !truckLen || !dw) return null;
      const centerSpacing = dw + 4;
      const totalWidth = positions * centerSpacing;
      const dockDepth = 8;
      const totalDepth = truckLen + apron + dockDepth;
      const totalArea = totalWidth * totalDepth;
      return {
        primary: { label: "Total Dock Area", value: formatNumber(totalArea) + " sq ft" },
        details: [
          { label: "Dock Wall Width", value: formatNumber(totalWidth) + " ft" },
          { label: "Total Depth Required", value: formatNumber(totalDepth) + " ft" },
          { label: "Center-to-Center Spacing", value: formatNumber(centerSpacing) + " ft" },
        ],
      };
  },
  }],
  relatedSlugs: [],
  faq: [
    { question: "How wide should a loading dock door be?", answer: "Standard dock doors are 8 to 10 feet wide and 8 to 10 feet tall." },
    { question: "How much apron space does a truck need?", answer: "A standard semi needs at least 60 feet of approach apron for turning." },
  ],
  formula: "Dock Area = (Positions x Spacing) x (Truck Length + Apron + Dock Depth)",
};
