import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const hydraulicCylinderCalculator: CalculatorDefinition = {
  slug: "hydraulic-cylinder-calculator",
  title: "Hydraulic Cylinder Calculator",
  description: "Calculate the force output and flow requirements of a hydraulic cylinder based on bore size and pressure.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: ["hydraulic cylinder","hydraulic force calculator","cylinder force calculator"],
  variants: [{
    id: "standard",
    name: "Hydraulic Cylinder",
    description: "Calculate the force output and flow requirements of a hydraulic cylinder based on bore size and pressure.",
    fields: [
      { name: "boreDiameter", label: "Bore Diameter (inches)", type: "number", suffix: "in", min: 0.5, max: 50, defaultValue: 3 },
      { name: "rodDiameter", label: "Rod Diameter (inches)", type: "number", suffix: "in", min: 0.25, max: 30, defaultValue: 1.5 },
      { name: "pressure", label: "System Pressure (PSI)", type: "number", suffix: "PSI", min: 50, max: 10000, defaultValue: 3000 },
      { name: "strokeLength", label: "Stroke Length (inches)", type: "number", suffix: "in", min: 0.5, max: 200, defaultValue: 12 },
    ],
    calculate: (inputs) => {
      const bore = inputs.boreDiameter as number;
      const rod = inputs.rodDiameter as number;
      const pressure = inputs.pressure as number;
      const stroke = inputs.strokeLength as number;
      if (!bore || !pressure) return null;
      const boreArea = Math.PI * Math.pow(bore / 2, 2);
      const rodArea = Math.PI * Math.pow(rod / 2, 2);
      const annularArea = boreArea - rodArea;
      const pushForce = boreArea * pressure;
      const pullForce = annularArea * pressure;
      const extendVolume = boreArea * stroke / 231;
      const retractVolume = annularArea * stroke / 231;
      return {
        primary: { label: "Push Force (extend)", value: formatNumber(Math.round(pushForce)) + " lbs" },
        details: [
          { label: "Pull Force (retract)", value: formatNumber(Math.round(pullForce)) + " lbs" },
          { label: "Bore Area", value: formatNumber(Math.round(boreArea * 1000) / 1000) + " sq in" },
          { label: "Extend Volume", value: formatNumber(Math.round(extendVolume * 1000) / 1000) + " gal" },
          { label: "Retract Volume", value: formatNumber(Math.round(retractVolume * 1000) / 1000) + " gal" },
        ],
      };
    },
  }],
  relatedSlugs: ["torque-calculator","pressure-drop-calculator"],
  faq: [
    { question: "How is hydraulic cylinder force calculated?", answer: "Force equals pressure multiplied by piston area. For push (extend) force, use the full bore area. For pull (retract) force, subtract the rod area from the bore area to get the annular area." },
    { question: "Why is the retract force less than the extend force?", answer: "During retraction, hydraulic fluid acts on the annular area (bore area minus rod area), which is smaller than the full bore area used during extension. This results in less force but faster retraction speed." },
  ],
  formula: "Push Force = Bore Area x Pressure; Pull Force = (Bore Area - Rod Area) x Pressure; Volume = Area x Stroke / 231",
};
