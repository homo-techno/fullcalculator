import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const airHandlerSizeCalculator: CalculatorDefinition = {
  slug: "air-handler-size-calculator",
  title: "Air Handler Sizing Calculator",
  description: "Free air handler sizing calculator. Determine the right air handler capacity based on system tonnage, airflow requirements, and ductwork.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["air handler size calculator", "AHU sizing", "air handler CFM", "fan coil sizing", "HVAC air handler"],
  variants: [
    {
      id: "tonnage-based",
      name: "Size from System Tonnage",
      description: "Calculate air handler specs from cooling/heating tonnage",
      fields: [
        { name: "tonnage", label: "System Tonnage", type: "number", placeholder: "e.g. 3" },
        { name: "cfmPerTon", label: "CFM per Ton", type: "select", options: [
          { label: "350 CFM/ton (humid climate)", value: "350" },
          { label: "400 CFM/ton (standard)", value: "400" },
          { label: "450 CFM/ton (dry climate)", value: "450" },
        ], defaultValue: "400" },
        { name: "externalSP", label: "External Static Pressure (in. w.g.)", type: "number", placeholder: "e.g. 0.5", defaultValue: 0.5 },
      ],
      calculate: (inputs) => {
        const tonnage = inputs.tonnage as number;
        const cfmPerTon = parseFloat(inputs.cfmPerTon as string);
        const externalSP = inputs.externalSP as number;
        if (!tonnage || !cfmPerTon) return null;
        const totalCfm = tonnage * cfmPerTon;
        const btuCapacity = tonnage * 12000;
        const heatingBtu = btuCapacity * 1.25;
        const motorHp = totalCfm / 1200;
        const roundedHp = [0.25, 0.33, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0].find(h => h >= motorHp) || 5.0;
        return {
          primary: { label: "Required Airflow", value: `${formatNumber(totalCfm, 0)}` + " CFM" },
          details: [
            { label: "Cooling Capacity", value: `${formatNumber(btuCapacity, 0)}` + " BTU/hr" },
            { label: "Heating Capacity (est)", value: `${formatNumber(heatingBtu, 0)}` + " BTU/hr" },
            { label: "Est. Motor HP", value: `${formatNumber(roundedHp, 2)}` + " HP" },
            { label: "External SP", value: `${formatNumber(externalSP || 0.5, 2)}` + " in. w.g." },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["cooling-load-calculator", "duct-size-calculator", "airflow-cfm-calculator"],
  faq: [
    { question: "What is CFM per ton?", answer: "CFM per ton is the airflow rate per ton of cooling. Standard is 400 CFM/ton. Humid climates use 350 CFM/ton for better dehumidification. Dry climates use 450 CFM/ton." },
    { question: "How do I size an air handler?", answer: "Match the air handler to your outdoor unit tonnage. Ensure it can deliver the required CFM at the available external static pressure. Consider heating capacity needs as well." },
  ],
  formula: "CFM = Tonnage x CFM/Ton | 1 Ton = 12,000 BTU/hr",
};