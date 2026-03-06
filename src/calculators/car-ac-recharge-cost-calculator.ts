import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const carAcRechargeCostCalculator: CalculatorDefinition = {
  slug: "car-ac-recharge-cost-calculator",
  title: "Car AC Recharge Cost Calculator",
  description: "Estimate the cost of recharging your vehicle air conditioning system based on refrigerant type, system capacity, and service method.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["car AC recharge","auto air conditioning","AC refrigerant cost","car AC service"],
  variants: [{
    id: "standard",
    name: "Car AC Recharge Cost",
    description: "Estimate the cost of recharging your vehicle air conditioning system based on refrigerant type, system capacity, and service method.",
    fields: [
      { name: "refrigerantType", label: "Refrigerant Type", type: "select", options: [{ value: "1", label: "R-134a (most cars 1994-2015)" }, { value: "2", label: "R-1234yf (2016+ vehicles)" }, { value: "3", label: "R-12 (pre-1994 vehicles)" }], defaultValue: "1" },
      { name: "systemCapacity", label: "System Capacity (oz)", type: "number", min: 10, max: 60, defaultValue: 28 },
      { name: "serviceMethod", label: "Service Method", type: "select", options: [{ value: "1", label: "DIY Recharge Kit" }, { value: "2", label: "Independent Shop" }, { value: "3", label: "Dealership" }], defaultValue: "2" },
      { name: "leakTest", label: "Include Leak Test", type: "select", options: [{ value: "0", label: "No" }, { value: "1", label: "Yes" }], defaultValue: "1" },
    ],
    calculate: (inputs) => {
    const refType = parseInt(inputs.refrigerantType as string);
    const capacity = inputs.systemCapacity as number;
    const method = parseInt(inputs.serviceMethod as string);
    const leakTest = parseInt(inputs.leakTest as string);
    const refCostPerOz = { 1: 3, 2: 8, 3: 15 };
    const laborCosts = { 1: 0, 2: 120, 3: 200 };
    const leakTestCost = { 1: 0, 2: 50, 3: 75 };
    const refrigerantCost = Math.round(capacity * (refCostPerOz[refType] || 3));
    const labor = laborCosts[method] || 120;
    const leak = leakTest * (leakTestCost[method] || 50);
    const diyCost = refType === 1 ? 40 : refType === 2 ? 80 : 0;
    const totalCost = method === 1 ? diyCost : refrigerantCost + labor + leak;
    return {
      primary: { label: "Estimated Total Cost", value: "$" + formatNumber(totalCost) },
      details: [
        { label: "Refrigerant Cost", value: method === 1 ? "Included in kit" : "$" + formatNumber(refrigerantCost) },
        { label: "Labor Cost", value: "$" + formatNumber(labor) },
        { label: "Leak Test", value: leakTest ? "$" + formatNumber(leak) : "Not included" },
        { label: "System Capacity", value: formatNumber(capacity) + " oz" }
      ]
    };
  },
  }],
  relatedSlugs: ["car-annual-maintenance-cost-calculator","car-battery-replacement-cost-calculator"],
  faq: [
    { question: "How often does car AC need recharging?", answer: "A properly sealed AC system should not need regular recharging. If your AC needs frequent topping off, there is likely a leak that should be repaired to avoid compressor damage." },
    { question: "What is the difference between R-134a and R-1234yf?", answer: "R-1234yf is a newer, more environmentally friendly refrigerant used in most vehicles built after 2015. It costs significantly more than R-134a but has a much lower global warming potential." },
    { question: "Can I recharge my car AC myself?", answer: "DIY recharge kits work for R-134a systems and are simple to use. R-1234yf requires special equipment and is best handled by professionals. Overcharging can damage the compressor." },
  ],
  formula: "Professional Cost = Refrigerant (capacity x price/oz) + Labor + Leak Test; DIY Cost = Recharge Kit Price; R-134a: ~$3/oz, R-1234yf: ~$8/oz, R-12: ~$15/oz",
};
