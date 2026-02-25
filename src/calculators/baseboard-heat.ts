import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const baseboardHeatCalculator: CalculatorDefinition = {
  slug: "baseboard-heat-calculator",
  title: "Baseboard Heater Length Calculator",
  description: "Free baseboard heater calculator. Estimate the length and wattage of baseboard heaters needed to heat rooms based on square footage, insulation, and climate.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["baseboard heater calculator", "baseboard heat length calculator", "how much baseboard heat do I need", "electric baseboard heater sizing", "baseboard heater BTU calculator"],
  variants: [
    {
      id: "calc",
      name: "Calculate Baseboard Heater Length",
      description: "Size baseboard heaters for a room",
      fields: [
        { name: "roomLength", label: "Room Length (feet)", type: "number", placeholder: "e.g. 14" },
        { name: "roomWidth", label: "Room Width (feet)", type: "number", placeholder: "e.g. 12" },
        { name: "ceilingHeight", label: "Ceiling Height (feet)", type: "number", placeholder: "e.g. 8", defaultValue: 8 },
        { name: "insulation", label: "Insulation Quality", type: "select", options: [{ label: "Well Insulated (newer home)", value: "good" }, { label: "Average Insulation", value: "average" }, { label: "Poor Insulation (older home)", value: "poor" }], defaultValue: "average" },
        { name: "climate", label: "Climate Zone", type: "select", options: [{ label: "Mild (Zone 1-2)", value: "mild" }, { label: "Moderate (Zone 3-4)", value: "moderate" }, { label: "Cold (Zone 5-6)", value: "cold" }, { label: "Very Cold (Zone 7+)", value: "very_cold" }], defaultValue: "moderate" },
      ],
      calculate: (inputs) => {
        const roomLength = inputs.roomLength as number;
        const roomWidth = inputs.roomWidth as number;
        const ceilingHeight = (inputs.ceilingHeight as number) || 8;
        const insulation = (inputs.insulation as string) || "average";
        const climate = (inputs.climate as string) || "moderate";
        if (!roomLength || !roomWidth) return null;

        const areaSqFt = roomLength * roomWidth;
        const volumeCuFt = areaSqFt * ceilingHeight;

        // Base watts per sq ft
        let wattsPerSqFt = 10;

        // Adjust for insulation
        if (insulation === "good") wattsPerSqFt = 8;
        else if (insulation === "average") wattsPerSqFt = 10;
        else wattsPerSqFt = 12;

        // Adjust for climate
        if (climate === "mild") wattsPerSqFt *= 0.8;
        else if (climate === "moderate") wattsPerSqFt *= 1.0;
        else if (climate === "cold") wattsPerSqFt *= 1.2;
        else wattsPerSqFt *= 1.4;

        // Adjust for ceiling height (higher ceilings need more)
        if (ceilingHeight > 8) {
          wattsPerSqFt *= ceilingHeight / 8;
        }

        const totalWatts = Math.ceil(areaSqFt * wattsPerSqFt);
        const totalBTU = Math.ceil(totalWatts * 3.412);

        // Standard baseboard heater: ~250 watts per linear foot
        const wattsPerFoot = 250;
        const heaterLengthFt = totalWatts / wattsPerFoot;

        // Common baseboard heater sizes
        const heaters8ft = Math.floor(heaterLengthFt / 8);
        const remaining = heaterLengthFt - (heaters8ft * 8);
        const heaters4ft = Math.floor(remaining / 4);
        const remaining2 = remaining - (heaters4ft * 4);
        const heaters2ft = Math.ceil(remaining2 / 2);

        // Circuit requirements: 240V typical
        const amps240V = totalWatts / 240;
        const circuits20A = Math.ceil(amps240V / 16); // 80% rule for continuous load

        const details: { label: string; value: string }[] = [
          { label: "Room Area", value: `${formatNumber(areaSqFt)} sq ft` },
          { label: "Room Volume", value: `${formatNumber(volumeCuFt)} cu ft` },
          { label: "Watts per sq ft", value: formatNumber(wattsPerSqFt, 1) },
          { label: "Total Wattage Needed", value: `${formatNumber(totalWatts)} watts` },
          { label: "Total BTU/hr", value: formatNumber(totalBTU) },
          { label: "Heater Length Needed", value: `${formatNumber(heaterLengthFt, 1)} linear feet` },
          { label: "Suggested Configuration", value: `${heaters8ft > 0 ? heaters8ft + " x 8'" : ""}${heaters4ft > 0 ? (heaters8ft > 0 ? " + " : "") + heaters4ft + " x 4'" : ""}${heaters2ft > 0 ? " + " + heaters2ft + " x 2'" : ""}` },
          { label: "Amps at 240V", value: formatNumber(amps240V, 1) },
          { label: "20A Circuits Needed", value: formatNumber(circuits20A) },
        ];

        return {
          primary: { label: "Baseboard Heater Length", value: `${formatNumber(heaterLengthFt, 1)} feet (${formatNumber(totalWatts)} W)` },
          details,
          note: "Based on 250 watts per linear foot for standard electric baseboard heaters at 240V. Actual requirements vary by window count, exterior wall exposure, and local climate. A licensed electrician should verify circuit requirements.",
        };
      },
    },
  ],
  relatedSlugs: ["btu-calculator", "insulation-calculator", "square-footage-calculator"],
  faq: [
    { question: "How many watts per square foot for baseboard heat?", answer: "As a general rule, plan for 10 watts per square foot for average insulation in moderate climates. Well-insulated homes need 8 watts/sq ft, while poorly insulated homes in cold climates may need 12-15 watts/sq ft." },
    { question: "How many feet of baseboard heat do I need?", answer: "Standard electric baseboard heaters produce about 250 watts per linear foot. Divide your total wattage requirement by 250 to get the linear feet needed. A 150 sq ft room needs about 6 feet of heater." },
    { question: "Should baseboard heaters be on their own circuit?", answer: "Yes, baseboard heaters should be on dedicated 240V circuits. Each 20A circuit can safely support 3,840 watts continuously (16A at 240V, applying the 80% rule for continuous loads)." },
  ],
  formula: "Heater Length (ft) = Room Area (sq ft) x Watts per sq ft / 250 watts per foot",
};
