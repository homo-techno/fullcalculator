import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const generatorSizingCalculator: CalculatorDefinition = {
  slug: "generator-sizing-calculator",
  title: "Generator Sizing Calculator",
  description:
    "Free generator sizing calculator. Calculate the required generator size (kW/kVA) based on your total electrical load, including motor starting surge requirements.",
  category: "Science",
  categorySlug: "science",
  icon: "A",
  keywords: [
    "generator sizing",
    "generator calculator",
    "generator size",
    "backup generator",
    "standby generator",
    "kVA calculator",
  ],
  variants: [
    {
      id: "total-load",
      name: "Generator Size by Total Load",
      description: "Calculate generator size from total wattage of connected loads",
      fields: [
        {
          name: "runningWatts",
          label: "Total Running Watts (W)",
          type: "number",
          placeholder: "e.g. 8000",
        },
        {
          name: "largestMotorStarting",
          label: "Largest Motor Starting Watts (W)",
          type: "number",
          placeholder: "e.g. 2500",
          defaultValue: 0,
        },
        {
          name: "powerFactor",
          label: "Power Factor",
          type: "number",
          placeholder: "e.g. 0.8",
          defaultValue: 0.8,
        },
        {
          name: "safetyMargin",
          label: "Safety Margin (%)",
          type: "number",
          placeholder: "e.g. 25",
          defaultValue: 25,
        },
      ],
      calculate: (inputs) => {
        const runningW = inputs.runningWatts as number;
        const startingW = (inputs.largestMotorStarting as number) || 0;
        const pf = (inputs.powerFactor as number) || 0.8;
        const margin = (inputs.safetyMargin as number) || 25;
        if (!runningW) return null;

        const peakWatts = runningW + startingW;
        const requiredKw = peakWatts / 1000;
        const requiredKva = requiredKw / pf;
        const withMargin = requiredKva * (1 + margin / 100);

        // Standard generator sizes
        const sizes = [3, 5, 7.5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250, 300, 400, 500];
        let recommendedKva = sizes[sizes.length - 1];
        for (const s of sizes) {
          if (s >= withMargin) {
            recommendedKva = s;
            break;
          }
        }

        return {
          primary: {
            label: "Recommended Generator Size",
            value: `${recommendedKva} kVA`,
          },
          details: [
            { label: "Recommended Size", value: `${recommendedKva} kVA (${formatNumber(recommendedKva * pf, 1)} kW)` },
            { label: "Running Load", value: `${formatNumber(runningW / 1000, 2)} kW` },
            { label: "Peak Load (with starting)", value: `${formatNumber(peakWatts / 1000, 2)} kW` },
            { label: "Required kVA", value: `${formatNumber(requiredKva, 2)} kVA` },
            { label: "With Safety Margin", value: `${formatNumber(withMargin, 2)} kVA` },
            { label: "Power Factor", value: formatNumber(pf, 2) },
          ],
        };
      },
    },
    {
      id: "itemized",
      name: "Itemized Load Calculation",
      description: "Add up common household/building loads",
      fields: [
        {
          name: "lighting",
          label: "Lighting (W)",
          type: "number",
          placeholder: "e.g. 1500",
          defaultValue: 0,
        },
        {
          name: "refrigerator",
          label: "Refrigerator (W running)",
          type: "number",
          placeholder: "e.g. 200",
          defaultValue: 0,
        },
        {
          name: "acHeat",
          label: "A/C or Heating (W)",
          type: "number",
          placeholder: "e.g. 3500",
          defaultValue: 0,
        },
        {
          name: "wellPump",
          label: "Well Pump / Sump Pump (W)",
          type: "number",
          placeholder: "e.g. 1000",
          defaultValue: 0,
        },
        {
          name: "other",
          label: "Other Loads (W)",
          type: "number",
          placeholder: "e.g. 2000",
          defaultValue: 0,
        },
        {
          name: "motorStartMultiplier",
          label: "Motor Start Multiplier",
          type: "select",
          options: [
            { label: "2x (Inverter / VFD motors)", value: "2" },
            { label: "3x (Typical motors)", value: "3" },
            { label: "4x (Hard-start motors)", value: "4" },
            { label: "6x (Compressors / pumps)", value: "6" },
          ],
          defaultValue: "3",
        },
      ],
      calculate: (inputs) => {
        const lighting = (inputs.lighting as number) || 0;
        const fridge = (inputs.refrigerator as number) || 0;
        const ac = (inputs.acHeat as number) || 0;
        const pump = (inputs.wellPump as number) || 0;
        const other = (inputs.other as number) || 0;
        const startMult = Number(inputs.motorStartMultiplier) || 3;

        const totalRunning = lighting + fridge + ac + pump + other;
        if (totalRunning === 0) return null;

        // Largest motor load for starting surge
        const motorLoads = [fridge, ac, pump].filter(x => x > 0);
        const largestMotor = motorLoads.length > 0 ? Math.max(...motorLoads) : 0;
        const startingSurge = largestMotor * (startMult - 1);

        const peakWatts = totalRunning + startingSurge;
        const requiredKva = peakWatts / 1000 / 0.8;

        const sizes = [3, 5, 7.5, 10, 12, 15, 20, 25, 30, 40, 50];
        let recommended = sizes[sizes.length - 1];
        for (const s of sizes) {
          if (s >= requiredKva * 1.1) {
            recommended = s;
            break;
          }
        }

        return {
          primary: {
            label: "Recommended Generator",
            value: `${recommended} kVA (${formatNumber(recommended * 0.8, 1)} kW)`,
          },
          details: [
            { label: "Total Running Load", value: `${formatNumber(totalRunning, 0)} W` },
            { label: "Largest Motor Load", value: `${formatNumber(largestMotor, 0)} W` },
            { label: "Starting Surge", value: `${formatNumber(startingSurge, 0)} W` },
            { label: "Peak Demand", value: `${formatNumber(peakWatts, 0)} W` },
            { label: "Required kVA", value: `${formatNumber(requiredKva, 2)} kVA` },
            { label: "Recommended Generator", value: `${recommended} kVA` },
          ],
          note: "Motor starting surges are temporary (1-3 seconds). Size your generator to handle the largest motor startup while other loads are running.",
        };
      },
    },
  ],
  relatedSlugs: ["electrical-load-calculator", "ups-sizing-calculator", "three-phase-power-calculator"],
  faq: [
    {
      question: "What size generator do I need for my house?",
      answer:
        "Most homes need 7.5-25 kW depending on the loads. A small home with basic needs (lights, fridge, sump pump) can use 7.5 kW. A medium home with central A/C typically needs 15-20 kW. A large home with electric heating and many appliances may need 25+ kW.",
    },
    {
      question: "What is the difference between kW and kVA?",
      answer:
        "kW (kilowatts) is real power that does useful work. kVA (kilovolt-amperes) is apparent power, which includes reactive power. kW = kVA × Power Factor. Generators are often rated in kVA. With a typical 0.8 power factor, a 10 kVA generator provides 8 kW of real power.",
    },
    {
      question: "Why do motors need extra starting power?",
      answer:
        "Electric motors draw 3-6 times their running current when starting (inrush current). This starting surge lasts 1-3 seconds. The generator must handle this surge or the motor won't start. Always account for the largest motor's starting watts when sizing a generator.",
    },
  ],
  formula:
    "Generator kVA = (Running Watts + Starting Surge) / (1000 × Power Factor) × Safety Margin | Starting Surge = Largest Motor × (Start Multiplier - 1)",
};
