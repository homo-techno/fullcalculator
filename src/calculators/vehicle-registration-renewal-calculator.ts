import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const vehicleRegistrationRenewalCalculator: CalculatorDefinition = {
  slug: "vehicle-registration-renewal-calculator",
  title: "Vehicle Registration Renewal Calculator",
  description: "Estimate your annual vehicle registration renewal cost based on vehicle value, weight, age, and state fee structures.",
  category: "Finance",
  categorySlug: "finance",
  icon: "$",
  keywords: ["vehicle registration","registration renewal cost","car registration fee","annual registration"],
  variants: [{
    id: "standard",
    name: "Vehicle Registration Renewal",
    description: "Estimate your annual vehicle registration renewal cost based on vehicle value, weight, age, and state fee structures.",
    fields: [
      { name: "vehicleValue", label: "Vehicle Value ($)", type: "number", min: 500, max: 200000, defaultValue: 25000 },
      { name: "vehicleWeight", label: "Vehicle Weight (lbs)", type: "number", min: 1000, max: 10000, defaultValue: 3500 },
      { name: "vehicleAge", label: "Vehicle Age (years)", type: "number", min: 0, max: 30, defaultValue: 3 },
      { name: "feeStructure", label: "Fee Structure Type", type: "select", options: [{ value: "1", label: "Flat Fee ($75-150)" }, { value: "2", label: "Value-Based (ad valorem)" }, { value: "3", label: "Weight-Based" }, { value: "4", label: "Combined (value + weight)" }], defaultValue: "2" },
      { name: "emissionsTest", label: "Emissions Test Required", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes (+$25-50)" }], defaultValue: "0" },
    ],
    calculate: (inputs) => {
    const value = inputs.vehicleValue as number;
    const weight = inputs.vehicleWeight as number;
    const age = inputs.vehicleAge as number;
    const structure = parseInt(inputs.feeStructure as string);
    const emissions = parseInt(inputs.emissionsTest as string);
    let baseFee = 0;
    if (structure === 1) baseFee = 100;
    else if (structure === 2) baseFee = Math.round(value * 0.01 * Math.max(1 - age * 0.05, 0.3));
    else if (structure === 3) baseFee = Math.round(weight * 0.02);
    else baseFee = Math.round(value * 0.006 * Math.max(1 - age * 0.05, 0.3) + weight * 0.01);
    const titleFee = 15;
    const plateFee = age === 0 ? 35 : 0;
    const emissionsCost = emissions * 35;
    const totalCost = baseFee + titleFee + plateFee + emissionsCost;
    const monthlyEquiv = Math.round(totalCost / 12 * 100) / 100;
    return {
      primary: { label: "Estimated Annual Registration", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Base Registration Fee", value: "$" + formatNumber(baseFee) },
        { label: "Title/Processing Fee", value: "$" + formatNumber(titleFee) },
        { label: "New Plate Fee", value: plateFee > 0 ? "$" + formatNumber(plateFee) : "N/A" },
        { label: "Emissions Test Fee", value: emissions ? "$" + formatNumber(emissionsCost) : "Not required" },
        { label: "Monthly Equivalent", value: "$" + formatNumber(monthlyEquiv) }
      ]
    };
  },
  }],
  relatedSlugs: ["car-depreciation-curve-calculator","car-annual-maintenance-cost-calculator"],
  faq: [
    { question: "Why do registration fees vary by state?", answer: "Each state uses different formulas. Some charge flat fees, others base fees on vehicle value, weight, age, or combinations. Some states also include property tax within registration fees." },
    { question: "Do registration fees decrease as a car ages?", answer: "In value-based states, registration fees decrease as the vehicle depreciates. In flat-fee or weight-based states, the fee remains relatively constant regardless of age." },
    { question: "What happens if I miss my registration renewal?", answer: "Late renewal typically incurs penalty fees ranging from $10 to $100 or more. Driving with expired registration can result in traffic citations and fines in most states." },
  ],
  formula: "Flat Fee: Fixed amount ($75-150); Value-Based: Vehicle Value x Tax Rate x Age Factor; Weight-Based: Vehicle Weight x Rate Per Pound; Total = Base Fee + Title Fee + Plate Fee + Emissions",
};
