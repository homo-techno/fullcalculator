import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const tirePressureCalculator: CalculatorDefinition = {
  slug: "tire-pressure-calculator",
  title: "Tire Pressure Calculator",
  description: "Free tire pressure calculator. Find the recommended tire pressure for your vehicle and adjust for temperature, load, and driving conditions.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["tire pressure calculator", "recommended tire pressure", "PSI calculator", "tire inflation", "tire pressure temperature"],
  variants: [
    {
      id: "temp",
      name: "Temperature Adjustment",
      description: "Adjust tire pressure for temperature changes",
      fields: [
        { name: "recommendedPsi", label: "Recommended Pressure (PSI)", type: "number", placeholder: "e.g. 35" },
        { name: "setTemp", label: "Temperature When Set (F)", type: "number", placeholder: "e.g. 70" },
        { name: "currentTemp", label: "Current Temperature (F)", type: "number", placeholder: "e.g. 30" },
      ],
      calculate: (inputs) => {
        const recPsi = inputs.recommendedPsi as number;
        const setTemp = inputs.setTemp as number;
        const currentTemp = inputs.currentTemp as number;
        if (!recPsi || setTemp === undefined || currentTemp === undefined) return null;

        // Tire pressure changes ~1 PSI per 10 degrees F
        const tempDiff = currentTemp - setTemp;
        const psiChange = tempDiff / 10;
        const currentPsi = recPsi + psiChange;
        const shouldInflate = currentPsi < recPsi;
        const adjustment = recPsi - currentPsi;

        return {
          primary: { label: "Estimated Current Pressure", value: `${formatNumber(currentPsi, 1)} PSI` },
          details: [
            { label: "Recommended pressure", value: `${recPsi} PSI` },
            { label: "Temperature change", value: `${tempDiff > 0 ? "+" : ""}${formatNumber(tempDiff, 0)}°F` },
            { label: "Pressure change", value: `${psiChange > 0 ? "+" : ""}${formatNumber(psiChange, 1)} PSI` },
            { label: "Action needed", value: shouldInflate ? `Add ${formatNumber(adjustment, 1)} PSI` : "No action needed" },
          ],
          note: "Tire pressure changes approximately 1 PSI for every 10°F change in temperature. Always check pressure when tires are cold (not driven for 3+ hours).",
        };
      },
    },
    {
      id: "load",
      name: "Load-Adjusted Pressure",
      description: "Adjust tire pressure for extra vehicle load",
      fields: [
        { name: "recommendedPsi", label: "Recommended Pressure (PSI)", type: "number", placeholder: "e.g. 35" },
        { name: "maxPsi", label: "Max Pressure on Tire Sidewall (PSI)", type: "number", placeholder: "e.g. 51" },
        { name: "loadLevel", label: "Extra Load Level", type: "select", options: [
          { label: "Normal (just passengers)", value: "normal" },
          { label: "Moderate (full passengers + luggage)", value: "moderate" },
          { label: "Heavy (near max cargo)", value: "heavy" },
          { label: "Towing", value: "towing" },
        ], defaultValue: "normal" },
      ],
      calculate: (inputs) => {
        const recPsi = inputs.recommendedPsi as number;
        const maxPsi = inputs.maxPsi as number;
        const loadLevel = (inputs.loadLevel as string) || "normal";
        if (!recPsi || !maxPsi) return null;

        const loadAdds: Record<string, number> = { normal: 0, moderate: 3, heavy: 5, towing: 8 };
        const addPsi = loadAdds[loadLevel] || 0;
        const adjustedPsi = Math.min(recPsi + addPsi, maxPsi);

        const frontPsi = adjustedPsi;
        const rearPsi = loadLevel === "towing" ? Math.min(adjustedPsi + 3, maxPsi) : adjustedPsi;

        return {
          primary: { label: "Recommended Pressure", value: `${formatNumber(adjustedPsi, 0)} PSI` },
          details: [
            { label: "Front tires", value: `${formatNumber(frontPsi, 0)} PSI` },
            { label: "Rear tires", value: `${formatNumber(rearPsi, 0)} PSI` },
            { label: "Base recommended", value: `${recPsi} PSI` },
            { label: "Load adjustment", value: `+${addPsi} PSI` },
            { label: "Max tire pressure", value: `${maxPsi} PSI` },
          ],
          note: "Never exceed the max pressure printed on the tire sidewall. For towing, rear tires may need slightly more pressure. Consult your owner's manual for specific towing pressures.",
        };
      },
    },
  ],
  relatedSlugs: ["braking-distance-calculator", "mpg-calculator", "fuel-cost-calculator"],
  faq: [
    { question: "Where do I find my recommended tire pressure?", answer: "The recommended tire pressure is on a sticker inside the driver's door jamb, in the glove box, or in your owner's manual. Do NOT use the max pressure on the tire sidewall - that is the maximum the tire can handle, not the optimal pressure for your vehicle." },
    { question: "How does temperature affect tire pressure?", answer: "Tire pressure drops about 1 PSI for every 10°F decrease in temperature. If you set your tires to 35 PSI in 70°F weather, they may read 31 PSI on a 30°F morning. This is why the tire pressure light often comes on in cold weather." },
    { question: "What happens if tire pressure is too low or too high?", answer: "Under-inflated tires increase fuel consumption, wear unevenly on the edges, generate excess heat, and can fail. Over-inflated tires give a harsh ride, reduce traction, and wear unevenly in the center. Keep tires within 2-3 PSI of the recommended pressure." },
  ],
  formula: "Adjusted PSI = Recommended PSI + (Temperature Change / 10) + Load Adjustment",
};
