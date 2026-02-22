import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const routerBitSpeedCalculator: CalculatorDefinition = {
  slug: "router-bit-speed-calculator",
  title: "Router Bit Speed Calculator",
  description: "Free router bit speed calculator. Determine the maximum safe RPM for router bits based on bit diameter and type.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["router bit speed calculator", "router RPM calculator", "router bit safety", "router speed chart", "maximum router RPM"],
  variants: [
    {
      id: "max-rpm",
      name: "Maximum Safe RPM",
      description: "Calculate maximum safe RPM based on bit diameter",
      fields: [
        { name: "bitDiameter", label: "Bit Diameter (inches)", type: "number", placeholder: "e.g. 1.5" },
        {
          name: "bitType",
          label: "Bit Type",
          type: "select",
          options: [
            { label: "Straight / Spiral", value: "straight" },
            { label: "Round-over / Chamfer", value: "profile" },
            { label: "Raised Panel", value: "panel" },
            { label: "Large Diameter (> 2 in)", value: "large" },
          ],
        },
        {
          name: "material",
          label: "Material",
          type: "select",
          options: [
            { label: "Softwood", value: "1.0" },
            { label: "Hardwood", value: "0.9" },
            { label: "Plywood / MDF", value: "0.85" },
            { label: "Plastic / Acrylic", value: "0.6" },
          ],
        },
        { name: "feedRate", label: "Feed Rate (inches/min, optional)", type: "number", placeholder: "e.g. 120" },
      ],
      calculate: (inputs) => {
        const bitDia = inputs.bitDiameter as number;
        const bitType = inputs.bitType as string;
        const materialFactor = parseFloat(inputs.material as string);
        const feedRate = (inputs.feedRate as number) || 0;
        if (!bitDia) return null;
        let maxRPM: number;
        if (bitDia <= 1) maxRPM = 24000;
        else if (bitDia <= 1.5) maxRPM = 22000;
        else if (bitDia <= 2) maxRPM = 18000;
        else if (bitDia <= 2.5) maxRPM = 16000;
        else if (bitDia <= 3) maxRPM = 14000;
        else maxRPM = 12000;
        if (bitType === "panel") maxRPM = Math.min(maxRPM, 14000);
        if (bitType === "large") maxRPM = Math.min(maxRPM, 12000);
        const adjustedRPM = Math.round(maxRPM * materialFactor);
        const surfaceSpeed = (adjustedRPM * Math.PI * bitDia) / 12;
        const chipLoad = feedRate > 0 ? feedRate / (adjustedRPM * 2) : 0;
        return {
          primary: { label: "Maximum Safe RPM", value: formatNumber(adjustedRPM, 0) },
          details: [
            { label: "Base Max RPM", value: formatNumber(maxRPM, 0) },
            { label: "Material Adjustment", value: `${formatNumber(materialFactor * 100, 0)}%` },
            { label: "Surface Speed", value: `${formatNumber(surfaceSpeed, 0)} ft/min` },
            { label: "Bit Diameter", value: `${formatNumber(bitDia, 3)} inches` },
            { label: "Chip Load", value: chipLoad > 0 ? `${formatNumber(chipLoad, 4)} inches` : "Enter feed rate" },
            { label: "Bit Type", value: bitType },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["lathe-speed-calculator", "drill-bit-size-calculator", "bandsaw-blade-calculator"],
  faq: [
    { question: "Why does bit diameter affect speed?", answer: "Larger bits have higher rim speed at the same RPM. Excessive rim speed causes burning, poor cut quality, and safety hazards. Always reduce RPM for larger bits." },
    { question: "What is a safe feed rate for routing?", answer: "Feed rate depends on RPM, bit diameter, and number of flutes. Generally aim for a chip load of 0.003-0.005 inches per tooth for clean cuts without burning." },
  ],
  formula: "Surface Speed = RPM x Pi x Diameter / 12 | Chip Load = Feed Rate / (RPM x Flutes)",
};
