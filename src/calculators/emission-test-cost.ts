import type { CalculatorDefinition } from "./types";
import { formatNumber } from "@/lib/utils";

export const emissionTestCostCalculator: CalculatorDefinition = {
  slug: "emission-test-cost-calculator",
  title: "Emission Test Cost Calculator",
  description: "Free emission test cost calculator. Estimate vehicle emission test and inspection costs including potential repair expenses.",
  category: "Everyday",
  categorySlug: "everyday",
  icon: "~",
  keywords: ["emission test cost", "smog check cost", "vehicle inspection cost", "emission testing fee", "smog test calculator"],
  variants: [
    {
      id: "cost",
      name: "Emission Test Cost",
      description: "Estimate emission test and inspection costs",
      fields: [
        { name: "testType", label: "Test Type", type: "select", options: [
          { label: "Basic emission test", value: "basic" },
          { label: "Enhanced emission test (OBD-II)", value: "enhanced" },
          { label: "Full safety + emission inspection", value: "full" },
        ], defaultValue: "enhanced" },
        { name: "vehicleAge", label: "Vehicle Age", type: "number", placeholder: "e.g. 8", suffix: "years" },
        { name: "lastTest", label: "Time Since Last Test", type: "select", options: [
          { label: "1 year", value: "1" },
          { label: "2 years", value: "2" },
          { label: "First test/new to state", value: "first" },
        ], defaultValue: "2" },
        { name: "retestNeeded", label: "Retest Likely?", type: "select", options: [
          { label: "No - vehicle runs well", value: "no" },
          { label: "Maybe - check engine light on", value: "maybe" },
          { label: "Yes - known issues", value: "yes" },
        ], defaultValue: "no" },
      ],
      calculate: (inputs) => {
        const testType = inputs.testType as string;
        const age = (inputs.vehicleAge as number) || 5;
        const retest = inputs.retestNeeded as string;

        let testCost = 0;
        if (testType === "basic") testCost = 25;
        else if (testType === "enhanced") testCost = 40;
        else testCost = 75;

        let repairEstimate = 0;
        if (retest === "maybe") repairEstimate = 200;
        else if (retest === "yes") repairEstimate = 500;

        const retestFee = retest !== "no" ? testCost * 0.5 : 0;
        const totalLow = testCost;
        const totalHigh = testCost + retestFee + repairEstimate;

        return {
          primary: { label: "Test Fee", value: `$${formatNumber(testCost)}` },
          details: [
            { label: "Test type", value: testType.charAt(0).toUpperCase() + testType.slice(1) },
            { label: "Estimated repair cost", value: repairEstimate > 0 ? `$${formatNumber(repairEstimate)}` : "None expected" },
            { label: "Retest fee (if needed)", value: retestFee > 0 ? `$${formatNumber(retestFee)}` : "N/A" },
            { label: "Best case total", value: `$${formatNumber(totalLow)}` },
            { label: "Worst case total", value: `$${formatNumber(totalHigh)}` },
          ],
        };
      },
    },
    {
      id: "annual",
      name: "Annual Inspection Budget",
      description: "Plan annual inspection and testing budget",
      fields: [
        { name: "emissionCost", label: "Emission Test Cost", type: "number", placeholder: "e.g. 40", prefix: "$" },
        { name: "inspectionCost", label: "Safety Inspection Cost", type: "number", placeholder: "e.g. 35", prefix: "$" },
        { name: "emissionFreq", label: "Emission Test Frequency", type: "select", options: [
          { label: "Annual", value: "1" },
          { label: "Every 2 years", value: "2" },
          { label: "Not required", value: "0" },
        ], defaultValue: "2" },
        { name: "inspectionFreq", label: "Safety Inspection Frequency", type: "select", options: [
          { label: "Annual", value: "1" },
          { label: "Every 2 years", value: "2" },
          { label: "Not required", value: "0" },
        ], defaultValue: "1" },
        { name: "repairBuffer", label: "Repair Budget Buffer", type: "number", placeholder: "e.g. 200", prefix: "$" },
      ],
      calculate: (inputs) => {
        const emissionCost = (inputs.emissionCost as number) || 0;
        const inspectionCost = (inputs.inspectionCost as number) || 0;
        const emissionFreq = parseInt(inputs.emissionFreq as string);
        const inspectionFreq = parseInt(inputs.inspectionFreq as string);
        const buffer = (inputs.repairBuffer as number) || 0;

        const annualEmission = emissionFreq > 0 ? emissionCost / emissionFreq : 0;
        const annualInspection = inspectionFreq > 0 ? inspectionCost / inspectionFreq : 0;
        const annualTotal = annualEmission + annualInspection + buffer;

        return {
          primary: { label: "Annual Budget", value: `$${formatNumber(annualTotal)}` },
          details: [
            { label: "Emission test (annualized)", value: `$${formatNumber(annualEmission)}` },
            { label: "Safety inspection (annualized)", value: `$${formatNumber(annualInspection)}` },
            { label: "Repair buffer", value: `$${formatNumber(buffer)}` },
            { label: "Monthly set-aside", value: `$${formatNumber(annualTotal / 12)}` },
          ],
        };
      },
    },
  ],
  relatedSlugs: ["car-maintenance-cost-calculator", "registration-fee-calculator"],
  faq: [
    { question: "How much does an emission test cost?", answer: "Emission test fees range from $15-$100 depending on your state and test type. Basic tailpipe tests cost $15-30, while OBD-II diagnostic tests cost $25-50. Some states include emissions in their annual safety inspection." },
    { question: "How often do I need an emission test?", answer: "Frequency varies by state. Most states require testing every 1-2 years, while some don't require it at all. New vehicles are often exempt for the first few years. Check your state's DMV for specific requirements." },
  ],
  formula: "Annual Budget = (Emission Cost / Frequency) + (Inspection Cost / Frequency) + Repair Buffer",
};
