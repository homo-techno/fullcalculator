import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const staticPressureCalculator: CalculatorDefinition = {
  slug: "static-pressure-calculator",
  title: "Static Pressure Drop Calculator",
  description: "Free static pressure drop calculator. Estimate friction loss in ductwork based on duct size, length, and airflow.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["static pressure calculator", "duct pressure drop", "friction loss duct", "HVAC pressure", "ductwork pressure"],
  variants: [
    {
      id: "duct-friction",
      name: "Duct Friction Loss",
      description: "Calculate pressure drop in straight ductwork",
      fields: [
        { name: "cfm", label: "Airflow (CFM)", type: "number", placeholder: "e.g. 400" },
        { name: "ductDiam", label: "Duct Diameter (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "length", label: "Duct Length (ft)", type: "number", placeholder: "e.g. 50" },
        { name: "ductType", label: "Duct Material", type: "select", options: [
          { label: "Sheet Metal", value: "metal" },
          { label: "Flex Duct", value: "flex" },
          { label: "Fiberglass Lined", value: "fiberglass" },
        ], defaultValue: "metal" },
      ],
      calculate: (inputs) => {
        const cfm = inputs.cfm as number;
        const ductDiam = inputs.ductDiam as number;
        const length = inputs.length as number;
        const ductType = inputs.ductType as string;
        if (!cfm || !ductDiam || !length) return null;
        const areaFt2 = (Math.PI * Math.pow(ductDiam / 2, 2)) / 144;
        const velocity = cfm / areaFt2;
        const typeMult: Record<string, number> = { metal: 1.0, flex: 3.0, fiberglass: 1.5 };
        const frictionPer100 = 0.109136 * Math.pow(cfm, 1.9) / Math.pow(ductDiam, 5.02) * (typeMult[ductType] || 1.0);
        const totalDrop = frictionPer100 * (length / 100);
        const velocityPressure = Math.pow(velocity / 4005, 2);
        return {
          primary: { label: "Total Pressure Drop", value: `${formatNumber(totalDrop, 4)}` + " in. w.g." },
          details: [
            { label: "Friction per 100 ft", value: `${formatNumber(frictionPer100, 4)}` + " in. w.g." },
            { label: "Air Velocity", value: `${formatNumber(velocity, 0)}` + " FPM" },
            { label: "Velocity Pressure", value: `${formatNumber(velocityPressure, 4)}` + " in. w.g." },
            { label: "Duct Material", value: ductType },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["duct-size-calculator", "airflow-cfm-calculator", "air-handler-size-calculator"],
  faq: [
    { question: "What is static pressure?", answer: "Static pressure is the resistance to airflow in a duct system, measured in inches of water gauge (in. w.g.). It must be overcome by the fan/blower." },
    { question: "What causes pressure drop?", answer: "Friction from duct walls, fittings, filters, coils, and grilles all contribute. Flex duct has about 3x the friction of sheet metal." },
  ],
  formula: "Delta P = f x (L/D) x (V2 / 2g) | VP = (V / 4005)^2",
};