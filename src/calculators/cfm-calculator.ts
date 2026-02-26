import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const cfmCalculator: CalculatorDefinition = {
  slug: "cfm-calculator",
  title: "CFM Airflow Calculator",
  description:
    "Calculate cubic feet per minute (CFM) airflow for HVAC systems, duct sizing, and ventilation. Determine required airflow for rooms and buildings.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "CFM calculator",
    "airflow calculator",
    "cubic feet per minute",
    "duct airflow",
    "HVAC CFM",
  ],
  variants: [
    {
      id: "room-ventilation",
      name: "Room Ventilation CFM",
      description: "Calculate required CFM for a room based on air changes per hour",
      fields: [
        {
          name: "length",
          label: "Room Length (feet)",
          type: "number",
          placeholder: "e.g. 20",
        },
        {
          name: "width",
          label: "Room Width (feet)",
          type: "number",
          placeholder: "e.g. 15",
        },
        {
          name: "height",
          label: "Ceiling Height (feet)",
          type: "number",
          placeholder: "e.g. 8",
          defaultValue: 8,
        },
        {
          name: "ach",
          label: "Air Changes per Hour (ACH)",
          type: "select",
          options: [
            { label: "4 ACH (Office/Retail)", value: "4" },
            { label: "6 ACH (Residential)", value: "6" },
            { label: "8 ACH (Classroom)", value: "8" },
            { label: "10 ACH (Restaurant)", value: "10" },
            { label: "12 ACH (Kitchen)", value: "12" },
            { label: "15 ACH (Lab/Workshop)", value: "15" },
            { label: "20 ACH (Welding Shop)", value: "20" },
          ],
          defaultValue: "6",
        },
      ],
      calculate: (inputs) => {
        const length = parseFloat(inputs.length as string);
        const width = parseFloat(inputs.width as string);
        const height = parseFloat(inputs.height as string) || 8;
        const ach = parseFloat(inputs.ach as string);
        if (!length || !width || !ach) return null;

        const volumeCuFt = length * width * height;
        const cfm = (volumeCuFt * ach) / 60;

        // Duct sizing (for round duct at 900 FPM velocity)
        const ductArea = cfm / 900; // sq ft
        const ductDiameter = Math.sqrt((ductArea * 4) / Math.PI) * 12; // inches

        return {
          primary: {
            label: "Required CFM",
            value: `${formatNumber(cfm, 0)} CFM`,
          },
          details: [
            { label: "Room volume", value: `${formatNumber(volumeCuFt)} cu ft` },
            { label: "Air changes per hour", value: formatNumber(ach) },
            { label: "Required airflow", value: `${formatNumber(cfm, 0)} CFM` },
            { label: "Suggested round duct size", value: `${formatNumber(ductDiameter, 0)}" diameter` },
            { label: "Duct velocity (at suggested size)", value: "~900 FPM" },
          ],
          note: "ACH requirements vary by local codes and building type. ASHRAE 62.1 provides detailed ventilation standards.",
        };
      },
    },
    {
      id: "duct-cfm",
      name: "CFM from Duct Velocity",
      description: "Calculate CFM from duct size and air velocity",
      fields: [
        {
          name: "ductDiameter",
          label: "Round Duct Diameter (inches)",
          type: "select",
          options: [
            { label: '4"', value: "4" },
            { label: '6"', value: "6" },
            { label: '8"', value: "8" },
            { label: '10"', value: "10" },
            { label: '12"', value: "12" },
            { label: '14"', value: "14" },
            { label: '16"', value: "16" },
            { label: '18"', value: "18" },
            { label: '20"', value: "20" },
          ],
          defaultValue: "8",
        },
        {
          name: "velocity",
          label: "Air Velocity (FPM)",
          type: "number",
          placeholder: "e.g. 900",
          defaultValue: 900,
        },
      ],
      calculate: (inputs) => {
        const ductDiameter = parseFloat(inputs.ductDiameter as string);
        const velocity = parseFloat(inputs.velocity as string);
        if (!ductDiameter || !velocity) return null;

        const radiusFt = ductDiameter / 2 / 12;
        const areaSqFt = Math.PI * radiusFt * radiusFt;
        const cfm = areaSqFt * velocity;

        return {
          primary: {
            label: "Airflow",
            value: `${formatNumber(cfm, 0)} CFM`,
          },
          details: [
            { label: "Duct diameter", value: `${formatNumber(ductDiameter)}"` },
            { label: "Duct area", value: `${formatNumber(areaSqFt * 144, 1)} sq in` },
            { label: "Air velocity", value: `${formatNumber(velocity)} FPM` },
            { label: "Airflow", value: `${formatNumber(cfm, 0)} CFM` },
          ],
          note: "Typical residential duct velocities: supply 600-900 FPM, return 400-600 FPM. Higher velocities increase noise.",
        };
      },
    },
    {
      id: "hvac-cfm",
      name: "HVAC System CFM",
      description: "Calculate CFM required for heating/cooling system",
      fields: [
        {
          name: "btu",
          label: "System BTU/hr",
          type: "number",
          placeholder: "e.g. 48000",
        },
        {
          name: "tempDiff",
          label: "Temperature Difference (degrees F)",
          type: "number",
          placeholder: "e.g. 20",
          defaultValue: 20,
        },
      ],
      calculate: (inputs) => {
        const btu = parseFloat(inputs.btu as string);
        const tempDiff = parseFloat(inputs.tempDiff as string);
        if (!btu || !tempDiff) return null;

        // CFM = BTU / (1.08 x delta-T) for sensible heat
        const cfm = btu / (1.08 * tempDiff);
        const tons = btu / 12000;

        // Standard: 400 CFM per ton for cooling
        const cfmPerTon = cfm / tons;

        return {
          primary: {
            label: "Required CFM",
            value: `${formatNumber(cfm, 0)} CFM`,
          },
          details: [
            { label: "System capacity", value: `${formatNumber(btu)} BTU/hr (${formatNumber(tons, 1)} tons)` },
            { label: "Temperature difference", value: `${formatNumber(tempDiff)} degrees F` },
            { label: "Required airflow", value: `${formatNumber(cfm, 0)} CFM` },
            { label: "CFM per ton", value: formatNumber(cfmPerTon, 0) },
          ],
          note: "Standard HVAC design uses 400 CFM per ton of cooling. The sensible heat formula CFM = BTU / (1.08 x delta-T) applies to dry air. Adjust for humidity in humid climates.",
        };
      },
    },
  ],
  relatedSlugs: ["ac-tonnage-calculator", "furnace-size-calculator", "exhaust-fan-size-calculator"],
  faq: [
    {
      question: "How do I calculate CFM for a room?",
      answer:
        "CFM = (Room Volume x Air Changes per Hour) / 60. For example, a 20x15x8 room (2,400 cu ft) needing 6 air changes per hour: (2,400 x 6) / 60 = 240 CFM. Air changes per hour depend on the room type and usage.",
    },
    {
      question: "What is a good CFM for HVAC?",
      answer:
        "For residential HVAC, the standard is 400 CFM per ton of cooling capacity. A 3-ton system needs about 1,200 CFM. For heating, 350-400 CFM per ton is typical. Too little airflow causes freezing coils; too much reduces dehumidification.",
    },
  ],
  formula:
    "CFM = Volume x ACH / 60 | CFM = Duct Area x Velocity | CFM = BTU / (1.08 x Delta-T)",
};
