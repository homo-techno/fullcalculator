import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airflowCfmCalculator: CalculatorDefinition = {
  slug: "airflow-cfm-calculator",
  title: "Airflow CFM Calculator",
  description: "Free airflow CFM calculator. Calculate cubic feet per minute for HVAC systems based on room size, duct velocity, or air changes per hour.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["airflow CFM calculator", "cubic feet per minute", "HVAC airflow", "air changes per hour", "CFM calculator"],
  variants: [
    {
      id: "room-cfm",
      name: "CFM from Room Size",
      description: "Calculate required CFM based on room volume and air changes",
      fields: [
        { name: "length", label: "Room Length (ft)", type: "number", placeholder: "e.g. 20" },
        { name: "width", label: "Room Width (ft)", type: "number", placeholder: "e.g. 15" },
        { name: "height", label: "Ceiling Height (ft)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "achType", label: "Room Type (ACH)", type: "select", options: [
          { label: "Bedroom (4-6 ACH)", value: "5" },
          { label: "Living Room (6-8 ACH)", value: "7" },
          { label: "Kitchen (10-15 ACH)", value: "12" },
          { label: "Bathroom (8-10 ACH)", value: "9" },
          { label: "Office (6-8 ACH)", value: "7" },
          { label: "Warehouse (3-6 ACH)", value: "4" },
        ], defaultValue: "7" },
      ],
      calculate: (inputs) => {
        const length = inputs.length as number;
        const width = inputs.width as number;
        const height = inputs.height as number;
        const ach = parseFloat(inputs.achType as string);
        if (!length || !width || !height || !ach) return null;
        const volume = length * width * height;
        const cfm = (volume * ach) / 60;
        const lps = cfm * 0.4719;
        const m3h = cfm * 1.699;
        return {
          primary: { label: "Required Airflow", value: `${formatNumber(cfm, 0)}` + " CFM" },
          details: [
            { label: "Room Volume", value: `${formatNumber(volume, 0)}` + " cu ft" },
            { label: "Air Changes/Hour", value: `${formatNumber(ach, 0)}` + " ACH" },
            { label: "Liters per Second", value: `${formatNumber(lps, 1)}` + " L/s" },
            { label: "Cubic Meters/Hour", value: `${formatNumber(m3h, 1)}` + " m3/h" },
          ],
        };
      },
    },
    {
      id: "duct-cfm",
      name: "CFM from Duct Velocity",
      description: "Calculate CFM from duct size and velocity",
      fields: [
        { name: "ductDiam", label: "Duct Diameter (inches)", type: "number", placeholder: "e.g. 10" },
        { name: "velocity", label: "Air Velocity (FPM)", type: "number", placeholder: "e.g. 800" },
      ],
      calculate: (inputs) => {
        const ductDiam = inputs.ductDiam as number;
        const velocity = inputs.velocity as number;
        if (!ductDiam || !velocity) return null;
        const areaIn2 = Math.PI * Math.pow(ductDiam / 2, 2);
        const areaFt2 = areaIn2 / 144;
        const cfm = areaFt2 * velocity;
        return {
          primary: { label: "Airflow", value: `${formatNumber(cfm, 0)}` + " CFM" },
          details: [
            { label: "Duct Area", value: `${formatNumber(areaIn2, 2)}` + " sq in" },
            { label: "Velocity", value: `${formatNumber(velocity, 0)}` + " FPM" },
            { label: "Duct Diameter", value: `${formatNumber(ductDiam, 0)}` + " in" },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["duct-size-calculator", "static-pressure-calculator", "cooling-load-calculator"],
  faq: [
    { question: "What is CFM?", answer: "CFM stands for Cubic Feet per Minute, the standard measure of airflow in HVAC systems. It tells you how much air volume moves through the system each minute." },
    { question: "How many CFM per room?", answer: "A general rule is 1 CFM per square foot of floor area. Kitchens and bathrooms need more. The exact amount depends on air changes per hour required." },
  ],
  formula: "CFM = (Volume x ACH) / 60 | CFM = Duct Area (ft2) x Velocity (FPM)",
};