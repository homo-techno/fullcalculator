import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const furnaceSizeCalculator: CalculatorDefinition = {
  slug: "furnace-size-calculator",
  title: "Furnace BTU Sizing Calculator",
  description:
    "Calculate the correct furnace size in BTU for your home. Factor in climate zone, insulation, and home size to determine heating requirements.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: [
    "furnace size calculator",
    "furnace BTU",
    "heating calculator",
    "what size furnace",
    "HVAC heating sizing",
  ],
  variants: [
    {
      id: "by-sqft",
      name: "Furnace Size by Square Footage",
      description: "Estimate furnace BTU output needed for your home",
      fields: [
        {
          name: "sqFt",
          label: "Heated Area (sq ft)",
          type: "number",
          placeholder: "e.g. 2000",
        },
        {
          name: "climateZone",
          label: "Climate Zone",
          type: "select",
          options: [
            { label: "Zone 1 - Hot (Southern FL, TX)", value: "25" },
            { label: "Zone 2 - Warm (Southeast US)", value: "35" },
            { label: "Zone 3 - Moderate (Mid-Atlantic)", value: "45" },
            { label: "Zone 4 - Cool (Midwest, Northeast)", value: "55" },
            { label: "Zone 5 - Cold (Northern US)", value: "60" },
          ],
          defaultValue: "45",
        },
        {
          name: "insulation",
          label: "Insulation Quality",
          type: "select",
          options: [
            { label: "Poor (old home, little insulation)", value: "1.2" },
            { label: "Average", value: "1.0" },
            { label: "Good (well insulated, new build)", value: "0.85" },
          ],
          defaultValue: "1.0",
        },
        {
          name: "ceilingHeight",
          label: "Ceiling Height",
          type: "select",
          options: [
            { label: "8 ft (standard)", value: "1.0" },
            { label: "9 ft", value: "1.12" },
            { label: "10 ft", value: "1.25" },
            { label: "12 ft (vaulted)", value: "1.5" },
          ],
          defaultValue: "1.0",
        },
      ],
      calculate: (inputs) => {
        const sqFt = parseFloat(inputs.sqFt as string);
        const btuPerSqFt = parseFloat(inputs.climateZone as string);
        const insulation = parseFloat(inputs.insulation as string);
        const ceiling = parseFloat(inputs.ceilingHeight as string);
        if (!sqFt || !btuPerSqFt) return null;

        // Required BTU output
        const outputBTU = sqFt * btuPerSqFt * insulation * ceiling;

        // Furnace input BTU (at 80% efficiency standard, 96% high-eff)
        const inputBTU80 = outputBTU / 0.8;
        const inputBTU96 = outputBTU / 0.96;

        // Round to nearest standard furnace size
        const standardSizes = [40000, 60000, 80000, 100000, 120000, 140000];
        const recommended = standardSizes.find((s) => s >= inputBTU80) || 140000;

        // Annual cost estimate (natural gas at $1.00 per therm, 1000 hrs heating)
        const annualTherms80 = (outputBTU * 1000) / (0.8 * 100000);
        const annualTherms96 = (outputBTU * 1000) / (0.96 * 100000);

        return {
          primary: {
            label: "Furnace Output Needed",
            value: `${formatNumber(outputBTU)} BTU/hr`,
          },
          details: [
            { label: "Required output", value: `${formatNumber(outputBTU)} BTU/hr` },
            { label: "Input BTU (80% AFUE)", value: `${formatNumber(inputBTU80)} BTU/hr` },
            { label: "Input BTU (96% AFUE)", value: `${formatNumber(inputBTU96)} BTU/hr` },
            { label: "Recommended furnace size", value: `${formatNumber(recommended)} BTU input` },
            { label: "Est. annual gas (80% AFUE)", value: `${formatNumber(annualTherms80)} therms` },
            { label: "Est. annual gas (96% AFUE)", value: `${formatNumber(annualTherms96)} therms` },
          ],
          note: "BTU output is the actual heating delivered. Input BTU includes efficiency losses. A 96% AFUE furnace converts 96 cents of every fuel dollar to heat. Always get a Manual J load calculation for precise sizing.",
        };
      },
    },
    {
      id: "comparison",
      name: "Efficiency Comparison",
      description: "Compare heating costs between furnace efficiency levels",
      fields: [
        {
          name: "currentBTU",
          label: "Current Furnace BTU Input",
          type: "number",
          placeholder: "e.g. 100000",
        },
        {
          name: "currentAFUE",
          label: "Current AFUE (%)",
          type: "select",
          options: [
            { label: "70% (very old)", value: "70" },
            { label: "80% (standard)", value: "80" },
            { label: "90% (mid-efficiency)", value: "90" },
          ],
          defaultValue: "80",
        },
        {
          name: "newAFUE",
          label: "New Furnace AFUE (%)",
          type: "select",
          options: [
            { label: "80% AFUE", value: "80" },
            { label: "92% AFUE", value: "92" },
            { label: "96% AFUE", value: "96" },
            { label: "98% AFUE", value: "98" },
          ],
          defaultValue: "96",
        },
        {
          name: "gasCost",
          label: "Gas Cost per Therm ($)",
          type: "number",
          placeholder: "e.g. 1.00",
          defaultValue: 1,
        },
      ],
      calculate: (inputs) => {
        const currentBTU = parseFloat(inputs.currentBTU as string);
        const currentAFUE = parseFloat(inputs.currentAFUE as string);
        const newAFUE = parseFloat(inputs.newAFUE as string);
        const gasCost = parseFloat(inputs.gasCost as string) || 1;
        if (!currentBTU || !currentAFUE || !newAFUE) return null;

        const heatingHours = 1000; // average heating hours per year
        const currentOutput = currentBTU * (currentAFUE / 100);
        const currentAnnualTherms = (currentBTU * heatingHours) / 100000;
        const newInputBTU = currentOutput / (newAFUE / 100);
        const newAnnualTherms = (newInputBTU * heatingHours) / 100000;
        const currentAnnualCost = currentAnnualTherms * gasCost;
        const newAnnualCost = newAnnualTherms * gasCost;
        const annualSavings = currentAnnualCost - newAnnualCost;

        return {
          primary: {
            label: "Annual Savings",
            value: `$${formatNumber(annualSavings)}`,
          },
          details: [
            { label: "Current annual gas cost", value: `$${formatNumber(currentAnnualCost)}` },
            { label: "New annual gas cost", value: `$${formatNumber(newAnnualCost)}` },
            { label: "Annual savings", value: `$${formatNumber(annualSavings)}` },
            { label: "Savings percentage", value: `${formatNumber((annualSavings / currentAnnualCost) * 100, 1)}%` },
            { label: "New furnace input BTU", value: formatNumber(newInputBTU) },
          ],
          note: "Based on estimated 1,000 heating hours per year. Actual savings vary by climate, usage patterns, and local gas prices.",
        };
      },
    },
  ],
  relatedSlugs: ["ac-tonnage-calculator", "r-value-calculator", "electricity-calculator"],
  faq: [
    {
      question: "How many BTU do I need per square foot for heating?",
      answer:
        "It depends on your climate zone. In mild climates (Zone 1-2), you need 25-35 BTU per square foot. In moderate climates (Zone 3), 40-50 BTU. In cold climates (Zone 4-5), 50-60 BTU per square foot. These are output BTU values.",
    },
    {
      question: "What size furnace do I need for a 2000 sq ft house?",
      answer:
        "In a moderate climate with average insulation, a 2,000 sq ft home needs approximately 90,000 BTU output, which translates to a 100,000-120,000 BTU input furnace at 80% AFUE efficiency. In cold climates, you may need a 120,000-140,000 BTU unit.",
    },
    {
      question: "What does AFUE mean for furnaces?",
      answer:
        "AFUE (Annual Fuel Utilization Efficiency) measures what percentage of fuel is converted to heat. An 80% AFUE furnace converts 80 cents of every fuel dollar to heat; 20 cents goes up the flue. High-efficiency (96% AFUE) furnaces waste only 4 cents per dollar.",
    },
  ],
  formula:
    "Output BTU = Sq Ft x BTU/sqft x Insulation Factor x Ceiling Factor | Input BTU = Output / AFUE",
};
