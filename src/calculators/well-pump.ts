import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const wellPumpCalculator: CalculatorDefinition = {
  slug: "well-pump-calculator",
  title: "Well Pump Calculator",
  description: "Free well pump sizing calculator. Determine the right pump size based on well depth, water demand, pipe diameter, and pressure requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["well pump calculator", "well pump size calculator", "well pump HP calculator", "submersible pump sizing", "well pump GPM"],
  variants: [
    {
      id: "sizing",
      name: "Pump Sizing",
      description: "Calculate required pump horsepower",
      fields: [
        { name: "wellDepth", label: "Well Depth (feet)", type: "number", placeholder: "e.g. 200" },
        { name: "staticLevel", label: "Static Water Level (feet from surface)", type: "number", placeholder: "e.g. 50" },
        { name: "drawdown", label: "Drawdown (feet)", type: "number", placeholder: "e.g. 20", defaultValue: 20 },
        { name: "pressurePSI", label: "Desired Pressure (PSI)", type: "number", placeholder: "e.g. 50", defaultValue: 50 },
        { name: "flowGPM", label: "Required Flow Rate (GPM)", type: "number", placeholder: "e.g. 10" },
        { name: "pipeLength", label: "Total Pipe Length (feet)", type: "number", placeholder: "e.g. 300" },
      ],
      calculate: (inputs) => {
        const wellDepth = inputs.wellDepth as number;
        const staticLevel = inputs.staticLevel as number;
        const drawdown = (inputs.drawdown as number) || 0;
        const pressurePSI = (inputs.pressurePSI as number) || 50;
        const flowGPM = inputs.flowGPM as number;
        const pipeLength = inputs.pipeLength as number;
        if (!wellDepth || !staticLevel || !flowGPM || !pipeLength) return null;
        const pumpingLevel = staticLevel + drawdown;
        const pressureHead = pressurePSI * 2.31; // PSI to feet of head
        const frictionLoss = pipeLength * 0.02; // approx 2 ft per 100 ft for 1" pipe at moderate flow
        const totalDynamicHead = pumpingLevel + pressureHead + frictionLoss;
        // HP = (GPM × TDH) / (3960 × pump efficiency)
        const efficiency = 0.55; // typical submersible pump efficiency
        const hpRequired = (flowGPM * totalDynamicHead) / (3960 * efficiency);
        // Round up to standard sizes
        const standardSizes = [0.5, 0.75, 1, 1.5, 2, 3, 5, 7.5, 10];
        const recommendedHP = standardSizes.find(s => s >= hpRequired) || standardSizes[standardSizes.length - 1];
        const wattsRequired = recommendedHP * 746;
        return {
          primary: { label: "Recommended Pump Size", value: `${recommendedHP} HP` },
          details: [
            { label: "Calculated HP required", value: formatNumber(hpRequired, 2) },
            { label: "Total dynamic head (TDH)", value: `${formatNumber(totalDynamicHead, 0)} ft` },
            { label: "Pumping water level", value: `${formatNumber(pumpingLevel, 0)} ft` },
            { label: "Pressure head", value: `${formatNumber(pressureHead, 0)} ft` },
            { label: "Friction loss (est.)", value: `${formatNumber(frictionLoss, 0)} ft` },
            { label: "Electrical requirement", value: `${formatNumber(wattsRequired, 0)} watts` },
            { label: "Flow rate", value: `${flowGPM} GPM` },
          ],
          note: "Based on 55% pump efficiency. Actual sizing should consider pipe diameter, fittings, and elevation changes. Consult a well professional for final sizing.",
        };
      },
    },
    {
      id: "demand",
      name: "Water Demand",
      description: "Calculate household water demand in GPM",
      fields: [
        { name: "bedrooms", label: "Number of Bedrooms", type: "number", placeholder: "e.g. 3", defaultValue: 3 },
        { name: "bathrooms", label: "Number of Bathrooms", type: "number", placeholder: "e.g. 2", defaultValue: 2 },
        { name: "extras", label: "Additional Uses", type: "select", options: [
          { label: "None", value: "none" },
          { label: "Irrigation/Garden", value: "irrigation" },
          { label: "Livestock/Animals", value: "livestock" },
          { label: "Irrigation + Livestock", value: "both" },
        ], defaultValue: "none" },
      ],
      calculate: (inputs) => {
        const bedrooms = (inputs.bedrooms as number) || 3;
        const bathrooms = (inputs.bathrooms as number) || 2;
        const extras = inputs.extras as string;
        const occupants = bedrooms + 1; // estimate
        // Peak demand calculation
        const basePeakGPM = 5 + (bathrooms * 2.5); // base + per bathroom fixtures
        const extraGPM: Record<string, number> = { none: 0, irrigation: 5, livestock: 3, both: 8 };
        const peakGPM = basePeakGPM + (extraGPM[extras] || 0);
        const dailyGallons = occupants * 75 + (extras === "irrigation" || extras === "both" ? 200 : 0) + (extras === "livestock" || extras === "both" ? 100 : 0);
        const storageRecommended = dailyGallons * 1.5;
        return {
          primary: { label: "Peak Demand", value: `${formatNumber(peakGPM, 0)} GPM` },
          details: [
            { label: "Estimated occupants", value: `${occupants}` },
            { label: "Daily water use", value: `${formatNumber(dailyGallons, 0)} gallons` },
            { label: "Storage tank recommended", value: `${formatNumber(storageRecommended, 0)} gallons` },
            { label: "Well yield needed", value: `${formatNumber(dailyGallons / 1440, 1)} GPM continuous` },
          ],
          note: "Pump GPM rating should meet or exceed peak demand. Low-yield wells can compensate with a large storage/pressure tank.",
        };
      },
    },
  ],
  relatedSlugs: ["water-flow-rate-calculator", "septic-size-calculator", "btu-heating-calculator"],
  faq: [
    { question: "What size well pump do I need?", answer: "Most residential wells use 0.5 to 1.5 HP submersible pumps. A 3-bedroom, 2-bath home typically needs a 0.75-1 HP pump delivering 8-12 GPM. Deep wells (200+ ft) or high-demand homes may need 1.5-2 HP." },
    { question: "How deep is the average residential well?", answer: "Residential wells typically range from 100-400 feet deep, with the national average around 150-200 feet. Depth depends on the local water table and geology. Some areas require wells over 500 feet." },
    { question: "How long does a well pump last?", answer: "Submersible well pumps typically last 8-15 years. Factors affecting lifespan include water quality (minerals, sand), cycling frequency, and proper sizing. Oversized or undersized pumps wear out faster." },
  ],
  formula: "HP = (GPM × TDH) / (3960 × Efficiency) | TDH = Pumping Level + Pressure Head + Friction Loss | Pressure Head = PSI × 2.31",
};
